//订单业务模块

import {request} from '../utils/request.js'
import {URL, KEYSTORAGE} from '../src/const.js'
import {objToQuery, dateIsOverDue} from '../utils/utils'
let exCons = require('../utils/exCons');
const {brand, CHANNEL_ID, ORDER_TYPE, WX_WORK, differDay} = getApp().config;
//获取普通订单列表，不包括换货单和退货单
function getOrderList(paramBean) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.NORMAL_ORDER_LIST,
      method: 'GET',
      data: paramBean
    })
      .then(response => {
        if (response.code == 0) {
          response.data.list.forEach(element => {
            element.payPrice = element.payPrice.toFixed(2);
          });
          resolve(response.data);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch(e => {
        reject(new Error(e.msg));
      });
  });
}

// 保存订单
function orderSave(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ORDERSAVE,
      data: data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 取消订单
function orderCancel(data) {
	return new Promise((resolve, reject) => {
		request({
			url: URL.ORDER_CANCEL + objToQuery(data),
			data: {},
			method: 'post'
		}).then(res => {
			res.code === 0 ? resolve(res) : reject(new Error(res.msg))
		}).catch(e => {
			reject(new Error(e.msg || e.message))
		})
	})
}
// 汇总订单 判断品牌
function newOrderSave(data) {
  data.channelId = CHANNEL_ID; // 固定的
  let url = URL.CREATE_GOODS_ORDER;
  if(data.payPrice <= 0){
    url = URL.ORDER_SAVE_FREE;
    data.orderType = ORDER_TYPE['ZERO'];
  }
  // 行政区修改
  const {province= '', city = '', area = '', goodsOrderList} = data;
  if(city.includes('行政')){
    data.city = area;
  }
  // 直辖市的县修改为市
  if(city === '县' || province === '重庆市'){
    data.city = province;
  }
  if(Array.isArray(goodsOrderList) && goodsOrderList.length){
    goodsOrderList.forEach(item => {
      // goodsOrderList去掉两边的空格。字段最长不能超过30
      let {goodsName, colorName = '', sizeName = '', price} = item;
      item.salePrice = price;
      if(goodsName){
        item.goodsName = goodsName.trim().slice(0, 30)
      }
      item.colorName = colorName.trim();
      item.sizeName = sizeName.trim();
    })
  }
  // 添加直播间ID
  const orderRoomId = wx.getStorageSync(KEYSTORAGE.orderRoomId);
  const setRoomIdDate = wx.getStorageSync(KEYSTORAGE.setRoomIdDate);
  if(orderRoomId && !dateIsOverDue(setRoomIdDate, 1)){
    data.liveRoomId = orderRoomId
  }
  // 视频号房间ID
  const wxVideoLiveRoom = wx.getStorageSync(KEYSTORAGE.wxVideoLiveRoom) ;
  if(wxVideoLiveRoom && wxVideoLiveRoom.date && wxVideoLiveRoom.id){
    if(!dateIsOverDue(wxVideoLiveRoom.date, differDay)){
      data.liveRoomNo = wxVideoLiveRoom.id;
    }
  }
  data.unionid = data.unionid || wx.getStorageSync(KEYSTORAGE.unionid);
  data.openId = data.openId || wx.getStorageSync(KEYSTORAGE.openid);
  // 分享设备
  const device = wx.getSystemInfoSync().model || '';
  const devFlag = wx.getStorageSync(KEYSTORAGE.devFlag);
  const shareDevice = wx.getStorageSync(KEYSTORAGE.shareDevice);
  let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
  let orderDevFlag = `设备型号：${device}`;
  if(devFlag && devFlag === WX_WORK){
    orderDevFlag += `_分享设备：${devFlag}`
  }
  if(shareDevice){
    orderDevFlag += `_${shareDevice}`
  }
  // 分享信息
  data.devFlag = orderDevFlag;
  if(shareFrom){
    let {wxScene, share_by, share_by_shop, shareBy = '', shareByShop} = shareFrom;
    wxScene += '';
    // 单人聊天会话中的小程序消息卡片 群聊会话中的小程序消息卡片
    if(wxScene === '1007' || wxScene === '1008'){
      data.devFlag = `场景值：${wxScene}_${data.devFlag}`;
    }
    // 计算业绩
    if(!data.shareBy){
      let orderSaveShare = {
        shareBy: share_by || shareBy || '',
        shareByShop: share_by_shop || shareByShop || '',
        channelCode: 'WEMALL',
        shareByTime:  wx.getStorageSync('openShareTime') || Date.now()
      };
      Object.assign(data, orderSaveShare)
    }
  }
  if(data.shareBy){
    // 虚拟工号出现字母的索引，例如: DA00A1OE30
    if(getApp().isFictitiousGuide(data.shareBy)){
      // 虚拟工号登录，后四位店铺代码
      data.shareByShop = data.shareBy.substr(-4);
    }
  }
  // 获取utm参数
  const optionList = wx.getStorageSync('daogouLists');
  let bigOrderAppendix = {
    targetUrl: wx.getStorageSync('targetUrl') || ''
  };
  if(optionList && optionList.length){
    optionList.forEach(item => {
      if(item.key && item.key.startsWith('utm')){
        bigOrderAppendix[item.key] = item.value;
      }
    })
  }
  data.bigOrderAppendix = bigOrderAppendix;
  return new Promise((resolve, reject) => {
    request({
      url,
      data: data,
      method: 'post',
    }).then(res => {
      /*
      give_order：用户提交订单；
      cancel_pay：用户关闭支付密码浮层；
      cancel_give_order：用户取消订单；
      pay：用户发起支付；
      payed：用户完成支付（影响有数实时订单统计）
      refund：用户发起退货退款*/
      if(res.code === 0){
        resolve(res.data);
        const {bigorderCode, payPrice} = res.data;
        getApp().wxPaymentReport(bigorderCode, 'give_order', payPrice);
      }else{
        reject(new Error(res.msg))
      }
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/*
* 获取订单详情
* bigOrderId: String,
* orderToken: String
* */
function orderDetail(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ORDERDETAIL,
      data: data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 *
 * @param orderCodeArr 订单号数组
 * @returns {Promise<unknown>}
 */
function hideOrder(orderCodeArr) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.HIDE_ORDER,
      data: orderCodeArr,
      method:'post',
    }).then(res => {
      res.code === 0 ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 查询订单物流信息
function getOrderExpressInfo(bigorderCode) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ORDER_EXPRESS_INFO,
      data: {
        bigorderCode: bigorderCode,
      },
    }).then(response => {
      if (response.code == 0 && response.data != null && response.data.length > 0) {
        resolve(response.data);
      } else {
        reject(new Error(response.msg));
      }
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 获取换货单列表
function getExchangeOrderList(postBean) {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderList` : URL.EXCHANGE_ORDER_LIST,//测试地址
      method: 'GET',
      data: postBean
    })
      .then((response) => {
        if (response.code == 0 && response.data != null) {
          resolve(response.data);//正式代码
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

//创建换货单
function createExchangeOrder(bean) {
  bean.channelId = CHANNEL_ID;
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderCreate` : URL.EXCHANGE_ORDER_CREATE,
      method: 'POST',
      data: bean
    })
      .then((response) => {
        console.log(response);
        if (response.code == 0 && response.data != null && response.data.exchangeCode != null) {
          resolve(response.data.exchangeCode);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

function getExOrderDetail(queryParam) {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderDetail` : URL.EXCHANGE_ORDER_DETAIL,//测试地址
      method: 'GET',
      data: queryParam
    })
      .then((response) => {
        if (response.code == 0 && response.data != null) {
          resolve(response.data);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

function updateExType(uBean) {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeTypeUpdate` : URL.EXCHANGE_ORDER_EXCHANGE_TYPE_UPDATE,//测试地址
      method: 'POST',
      data: uBean
    })
      .then((response) => {
        if (response.code == 0) {
          resolve(true);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

function uploadExpressInfo(eBean) {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/orderExpressUpdate` : URL.EXC_ORDER_UPLOAD_EXPRESS_INFO,//测试地址
      method: 'POST',
      data: eBean
    })
      .then((response) => {
        console.log("response.code == 0 ???????????????");
        console.log(response.code == 0);
        if (response.code == 0) {
          resolve(true);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

//确认换货
function confirmExchangeOrder(cBean) {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderConfirm` : URL.EXC_CONFIRM,//测试地址
      method: 'POST',
      data: cBean
    })
      .then((response) => {
        if (response.code == 0) {
          resolve(response.data);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

function confirmReceiptExOr(exchangeCode) {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeConfirmReceived` : URL.EXC_CONFIRM_RECEIPT,//测试地址
      method: 'POST',
      data: {
        exchangeCode: exchangeCode,
      }
    })
      .then((response) => {
        if (response.code == 0) {
          resolve(true);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

function closeExOrder(exchangeCode) {
  return new Promise((resolve, reject) => {
    request({
      // url: URL.EXC_ORDER_CLOSE,   //正式地址
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderClose` : URL.EXC_ORDER_CLOSE,//测试地址
      method: 'POST',
      data: {
        exchangeCode: exchangeCode,
      }
    })
      .then((response) => {
        if (response.code == 0) {
          resolve(response.msg);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  });
}

function remindExpress(_id, _token) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.REMINDEPRESS,
      data: {
        bigOrderId: _id,
        orderToken: _token,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function confirmOrder(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.CONFIRMORDER,
      data
    }).then(res => {
      res.code === 0 ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 支付成功调用优惠券
function voucherForReturn(data) {
  let url =  getApp().config.isSaleForce ? URL.ORDER_FOR_RECEIVE : URL.VOUCHERFORRETURN;
  return new Promise((resolve, reject) => {
    request({
      url,
      data: data,
      method: 'post'
    }).then(res => {
      /*res = {"code":0,"msg":"OK","data":[{"attend":"N","promotion":"4CR11903664","coupNum":"1-6157444485","videoType":"月卡"},{"attend":"N","promotion":"4CR11903679","coupNum":"1-6131436976","videoType":"电影票"}]}*/
      res.code === 0 ? res.data ? resolve(res.data) : resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 调用优惠券
function voucherForReturnJson() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.VOUCHERFORRETURNJSON,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
/*获取快递费用
*
* data = {
*   ep: 0  // 是否内购（1，是；0，否）必填
*   count: 0 // 商品数量    必填
*   areaCode ：string // 地区非必填
*   expressCompany ：string 快递公司非必填
* }
*
* */
function getExpressFare(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.EXPRESS_FARE,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}


//支付成功调转盘banner接口
function awardActivity(data) {
  if(data.pageAddress){
    const splitIndex = data.pageAddress.indexOf('?');
    if(splitIndex > -1){
      data.pageAddress = data.pageAddress.substr(0, splitIndex);
    }
  }
    return new Promise((resolve, reject) => {
        request({
            header:{
                'content-type': 'application/json', // 请求体类型默认值
                token: wx.getStorageSync('token') || '', //请求凭证
                brand:getApp().config.brand //测试环境用到
            },
            url: URL.AWARDACTIVITY,
            data: data,
            method: 'post'
        }).then(res => {
          /*res = {"code":0,"msg":"OK","data":[{"attend":"N","promotion":"4CR11903664","coupNum":"1-6157444485","videoType":"月卡"},{"attend":"N","promotion":"4CR11903679","coupNum":"1-6131436976","videoType":"电影票"}]}*/
            res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
        }).catch(e => {
            reject(new Error(e.msg || e.message))
        })
    })
}

function getNewExpressFare(data) {
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:  brand
      },
      url: URL.NEW_EXPRESS_FARE,
      data,
      method:'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function getReceipt(orderNum) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GET_RECEIPT}?orderNum=${orderNum}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 导购查看退货订单详情
 * @param {bigOrderId} _orderNum
 */
function getRefundDetail(_orderNum){
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:  brand
      },
      url: URL.REFUNDDETAIL,
      data:{
        orderNum: _orderNum
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function orderCount(){
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETORDERCOUNT,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function getOrderExpressDetail(_bigorderCode){
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETORDEREXPRESSDETAIL,
      data:{
        bigorderCode: _bigorderCode
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function pointOrderSave(data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.POINTORDERSAVE,
      data: data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 预售订单
function preSaleOrderSave(data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.PRE_SALE_ORDER_SAVE,
      data: data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 预售取消
function preSaleCancel(Id){
  return new Promise((resolve, reject) => {
    request({
      url: URL.PRE_SALE_CANCEL,
      data: {Id},
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 预售订单列表
function perOrderList(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.PREORDERLIST,
      data: _data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function perOrderCancal(_orderId){
  return new Promise((resolve, reject) => {
    request({
      url: URL.PREORDERCANCAL,
      data: {
        Id: _orderId
      },
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
function preSaleOrderDetail(bigCode){
  return new Promise((resolve, reject) => {
    request({
      url: URL.PRE_SALE_ORDER_DETAIL,
      data: {
	      bigCode
      },
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

export {
  orderSave,
  orderDetail,
  getOrderExpressInfo,
  getOrderList,
  getExchangeOrderList,
  createExchangeOrder,
  getExOrderDetail,
  updateExType,
  uploadExpressInfo,
  confirmExchangeOrder,
  confirmReceiptExOr,
  closeExOrder,
  remindExpress,
  confirmOrder,
  voucherForReturn,
  voucherForReturnJson,
  newOrderSave,
  getExpressFare,
  awardActivity,
  getNewExpressFare,
  getReceipt,
  getRefundDetail,
  orderCount,
  getOrderExpressDetail,
  orderCancel,
  pointOrderSave,
  preSaleOrderSave,
  perOrderList,
  perOrderCancal,
	preSaleOrderDetail,
	preSaleCancel,
  hideOrder
}
