import {EVENTS, KEYSTORAGE, URL, URL_CDN} from '../../src/const.js'
import {  getOrderList, getExchangeOrderList, closeExOrder, confirmOrder, orderCount, orderDetail, hideOrder} from '../../service/order.js';
import {getExpressInfo} from '../../service/express.js'
import {refundList, submitWayBill} from '../../service/refund'
import {getImageInfo, saveImageToPhotosAlbum} from '../../service/saveImg'
import { getBrandBySku,  getdate, StringToMillisecond, yipinNumber, objToQuery,  splitImg, changeTimer, dateIsOverDue,  skuToImg} from '../../utils/utils.js';   //网络请求，传参必用
import {request} from '../../utils/request.js'
import {judgeUrl, jianfa} from "../../utils/utils";
import {getConfigJSON} from "../../service/init";
import {wxShowToast} from '../../utils/wxMethods'
import { payment, wxRequestPayment, storedValueCard, svCardPayByOrderCode } from '../../service/pay'
var wxbarcode = require('../../utils/wxbarcode.js');
var ExCons = require('../../utils/exCons');
var app = getApp();
const {brand, cdn, CHANNEL_ID, STORE_VALUE} = app.config;
const ORDER_INDEX_EXCHANGE = 8;
const config = require('../../src/config.js');
const paymentMethodArr = ['Wechatpay_app', 'Wechatpay_h5', 'Wechatpay_scancode', 'Wechatpay_public'];
var wxInfo = '';

var n_page = 1;
var all_page = 1;
var rotate = 3;
var timer = null;
var toLower_onOff = true;
var dingdanStatus = {};
var isTuihuo_global = false;
let newAllPage = 1;


//拼接图片
function getPicUrl(sku) {
  var picUrl;
  var code = sku.substr(0, 9);
  var codeLong = sku.substr(0, 12);
  var index = sku.substr(0, 1);
  var brand = '';
  // ONLY:1,
  // JACKJONES:2,
  // VEROMODA:3,
  // SELECTED:4,
  switch (index) {
    case "1":
      brand = 'ONLY';
      break;
    case "2":
      brand = 'JACKJONES';
      break;
    case "3":
      brand = 'VEROMODA';
      break;
    case "4":
      brand = 'SELECTED';
      break;
    case "5":
      brand = 'JLINDEBERG';
      break;
    case "8":
      brand = 'NAMEIT';
      break;
    default:
      brand = app.config.brand;
      break;
  }
  picUrl = `${cdn}/goodsImagePC/${brand}/${code}/${codeLong}/${codeLong}_p1.jpg`;
  return picUrl;

}

//获取非退货订单列表
function getDingdanList(thisPage, Status, that) {
  wx.showLoading({
    title: '加载中...'
  });
  //换货单
  if (that.data.nav_id_slide == ORDER_INDEX_EXCHANGE) {
    // if(ExCons.DEBUG){
    //   let exchangeOrderList = TestJson.exchangeOrderList;
    //   that.setData({
    //     exchangeOrderList:exchangeOrderList,
    //     flagShowExOrder:true,
    //     ul_show:false,
    //   });
    //   toLower_onOff = true;
    //   clearInterval(timer);
    //   wx.hideLoading();
    // }else{
    // =======================正式代码 start ===============================
    let postBean = {
      brandCode: getApp().config.brand,
      currentPage: n_page,
    };
    getExchangeOrderList(postBean)
      .then(response => {
        all_page = response.totalPage;
        let newEXOrderList = that.data.exchangeOrderList.concat(response.list);
        that.setData({
          exchangeOrderList: newEXOrderList,
          flagShowExOrder: true,
          ul_show: false,
          dingdanIsHidden: false,
          load_more_hidden: 'none',
        });
        toLower_onOff = true;
        clearInterval(timer);
        wx.hideLoading();
      })
      .catch(e => {
        that.setData({
          flagShowExOrder: true,
          ul_show: false,
          dingdanIsHidden: true,
        });
        toLower_onOff = true;
        clearInterval(timer);
        wx.hideLoading();
        console.log(e.message);
      });
    // ======================= 正式代码 end ===============================
    // }

  } else {
    //普通订单
    var param = {
      currentPage: thisPage,
      status: Status
    };
    if (Status == 'WaitingPintuan') {
      param = {currentPage: thisPage, status: 'WaitingShipment', pintuanStatus: Status}
    }
    getOrderList(param)
      .then(response => {
        all_page = response.totalPage;
        newAllPage = response.totalPage;
        if (response.list.length == 0) {
          that.setData({
            dingdanIsHidden: true,
            load_more_hidden: 'none'
          });
        } else {
          response.list.forEach(item => {
            const {createTime, payPrice, wxCouponValueTotal} = item;
            const timeStamp = Date.parse(createTime);
            // 6个月以上的订单可删除
            const minDate = 182
            item.showHideBtn = dateIsOverDue(timeStamp, minDate)
            item.myUseWXCouponValue = jianfa(payPrice, wxCouponValueTotal || 0);
          })
          let newData = that.data.dingdanList.concat(response.list);
          // newData.forEach((item)=>{
          //   const param = {
          //     size: URL_CDN.IMGSIZE240400,
          //     sku: item.gcsSku,
          //   };
          //   item.mainPicPath = cdn + skuToImg(param)
          // });
          that.setData({
            dingdanIsHidden: false,
            dingdanList: newData,
            load_more_hidden: 'none',
            ul_show: true
          });
          toLower_onOff = true;
          clearInterval(timer);
        }
        wx.hideLoading();
      })
      .catch(err =>  wxShowToast(err.message));
  }
};


//获取退货订单列表
function getTuihuoList(thisPage, that) {
  wx.showLoading({
    title: '加载中'
  });
  refundList(thisPage).then(data => {
      all_page = data.totalPage;
      const refundGoodsList = data.list;
      for (var i = 0; i < refundGoodsList.length; i++) {
        refundGoodsList[i].payPrice = refundGoodsList[i].realPayPrice;
        // refundGoodsList[i].createTime = getdate(refundGoodsList[i].createTime)
      }
      if (refundGoodsList.length === 0) {
        that.setData({
          dingdanIsHidden: true,
          load_more_hidden: 'none'
        });
      } else {
        var nowData = that.data.dingdanList;
        var newData = nowData.concat(refundGoodsList);

        // 这里是 到店退需要的 productCode 的拼接
        newData = newData.map((item, index) => {
          item.refundSkus[0] = item.refundSkus.join(',');
          item.refundSkus.length = 1;
          return item;
        });
        newData.forEach((item) => {
          item.mainPicPath = getPicUrl(item.refundSkus[0]);
        })
        that.setData({
          dingdanIsHidden: false,
          dingdanList: newData,
          load_more_hidden: 'none',
          ul_show: true
        });
        toLower_onOff = true;
        clearInterval(timer);
      }
      wx.hideLoading();
    }).catch(err => wxShowToast(err.message))
};


Page({

  //页面的初始数据
  data: {
    STORE_VALUE,
    CHANNEL_ID,
    // 参团人数
    personRequire : 0,
    // 剩余多少名额
    shengyuNum: 0,
    // 拼团头像数组
    icons: [],
    pintuanText: brand === 'JACKJONES' ? '待分享' : '待分享 差1人',
    showPintuan : false,

    nav: [
      {
        name: '全部',
        shoppingCar: 0,
        status: '',
      }, {
        name: '待付款',
        shoppingCar: 0,
        status: 'WaitingPay',
      }, {
        name: '待发货',
        shoppingCar: 0,
        status: 'WaitingShipment'
      }, {
        name: '待收货',
        shoppingCar: 0,
        status: 'WaitingReceive'
      }, {
        name: '退换货/售后',
        shoppingCar: 0,
        status: 'refund',
        dropDown: true
      }
    ],

    titleLogo: `${cdn}/assets/common/${brand}/image/logo-black-rect.png`,
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    nav_id: 0,
    nav_id_slide: -1,
    dingdanIsHidden: false,
    flagNavOpen: false,
    needAnimation: false,
    flagExNavShow: false,

    //加载中
    load_isHidden: true,
    text_isHidden: true,


    //加载更多 - 动画
    animationLoad: {},
    load_more_hidden: 'none',

    //列表是否显示
    ul_show: false,

    //是否是退货单列表
    isTuihuo: false,


    //是否关闭提示窗口信息
    isTip: false,
    oriorderCode: '',
    refundCode: '',
    //上传单号
    submitDanhao: false,
    danhao_name: '',
    //上传单号中的字段
    danhao_name_tishi: false,
    //上传单号中的字段
    danhao_name_text: '物流名称不能为空',
    //上传单号中的字段
    danhao_number: '',
    //上传单号中的字段
    danhao_tishi: false,
    //上传单号中的字段
    danhao_text: '快递单号不能为空',

    //是否显示修改退货方式
    isShowWay: 99999999999,
    isResetWay: 'block',
    isVoucher: false,  //提货码
    bigorderCode: '',//一维码订单号
    checkcode: '',//二维码
    flagShowExBar: false,
    noticeContent: "已经提醒商家发货",
    isNotice: false,
    isRecommd: false,
    isRecommdNew: false,
    aiShowAppid: app.config.aiShowAppid,
    miniPath: "/pages/index/index",
    imageUrl: URL_CDN.SHOWGETIWATCH,
    drawerImage: URL_CDN.SHOWDRAWER,
    showTime: false,
    paddingTop: '282rpx',
    shareZan: false,
    orderDrawer: false,
    brand: brand,

    // 是否显示支付成功分享弹框
    fromBuyView: false,
    // 是否显示分享图片弹框
    shareView: false,
    // 判断直接分享还是分享图片
    isShareImage: false,
    // 点击分享保存数据
    shareDatas: {},
    // 保存图片的临时路径
    pintuanFilePath: '',
    // 分享数据
    eveShareDatas: {},
    recommdNoticePic: '',
    recommdNoticePicNew: splitImg('guideBg.jpg', 'common'),
    customer: {
      wxName: app.config.guideWXNums,
      imgUrl: splitImg('guide_rq.png'),
    },
    isStoreOption: app.config.isStoreOption,
    expressTitle: '正在为您安排发货',
    expressNotice: '订单量大，您的订单还未发出\n我们已加急处理',
    closePic: splitImg('white_close.png', 'common'),
    showPreSale: app.config.preSale,
    // 储值卡金额
    totalBalance: 0
  },

  // 隐藏弹框
  hiddenBounces: function () {
    this.setData({
      fromBuyView: false
    })
  },
  // 隐藏分享图片弹框
  shareViewHiddenBounces: function () {
    this.setData({
      shareView: false,
      isShareImage: false
    })
  },

// 获取团所有的参与人
  PTGetFaceAndIcon: function (bigorderCode) {
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {
      }
    });
    return new Promise((resolve, reject) => {
      request({
        url: `${app.config.domain}/rest/bigOrder/getPintuanOrderLists?pintuanOrderPerson=${bigorderCode}`
      }).then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          let arrs = []
          res.data.forEach(es => {

            if (es.status == 'WaitingShipment') {
              arrs.push(es)
            }

          });
          resolve(arrs)
        } else {
          reject(new Error(res.msg))
        }
        if (res.code != 0) {
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
        }
      }).catch(e => {
        wx.hideLoading();
        let a = e.message ? e.message : e.msg
        wx.showToast({
          title: a,
          icon: "none",
        })
        reject(new Error(a))
      })
    })
  },
  // 邀请好友弹框
  shareAlterView: function (e) {
    var Index = e.target.id;

    var shareDatas = this.data.shareDatas
    let personRequire = this.data.personRequire
    shareDatas = this.data.dingdanList[Index];
    let shengyuNum = this.data.shengyuNum
    let icons = this.data.icons
    shengyuNum = 0

    this.PTGetFaceAndIcon(shareDatas.pintuanOrderPerson).then(e => {

      if (e.length <= 0) {
        wx.showModal({
          title: '提示',
          content: '网络繁忙,请稍后再试',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {

            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
        return
      }
      let aIcon = ''
      let bIcons = []
      e.forEach(item => {
        shengyuNum += 1
        if (item.pintuanOrderType == 0) {
          aIcon = item.customerFaceImg
          personRequire = item.personRequire

        } else {
          bIcons.push(item.customerFaceImg)
        }
      })
      shengyuNum = personRequire - shengyuNum
      shengyuNum = shengyuNum <= 0 ? 0 : shengyuNum
      icons = []
      icons.push(aIcon)
      if (personRequire > 2) {
        bIcons.forEach(item => {
          icons.push(item)
        })
      }
      this.setData({shengyuNum, icons,personRequire})

      let icon = wxInfo.avatarUrl || ''
      if (icon == '') {

        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {
          }
        });

        let authed = wx.getStorageSync(KEYSTORAGE.authed);
        if (authed) {
          this.setData({
            fromBuyView: true,
            shareDatas
          })
        } else {
          wx.showModal({
            title: '提示', //提示的标题,
            content: '未授权', //提示的内容,
            showCancel: false, //是否显示取消按钮,

            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#3CC51F', //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }

      } else {
        this.setData({
          fromBuyView: true,
          shareDatas
        })
      }
    })

  },
  // 分享图片
  shareImage: function () {
    let shareDatas = this.data.shareDatas

    this.hiddenBounces()
    let sku = shareDatas.goodsOrderList[0].gcsSku.substring(0, 12)
    let price = shareDatas.goodsOrderList[0].price
    let originalPrice = shareDatas.goodsOrderList[0].originalPrice
    let personNumber = this.data.personRequire
    let goodsName = shareDatas.goodsOrderList[0].goodsName
    let icon = wxInfo.avatarUrl || ''
    let name = wxInfo.nickName || ''
    let places = `${this.data.shengyuNum}`
    let brand = getBrandBySku(sku)

    var qrCode = '' // 二维码内容用于生成二维码
    var endTime = ''
    var buyNum = ''

    this.PTGetGoodsDetailPinTuan(sku).then(res => {
      console.log(`商品详情数据:${JSON.stringify(res)}`)
      let item = res[sku]
      buyNum = yipinNumber(item.startTime)

      var a = item.endTime
      var paymentTime = ''
      if (shareDatas.payTime == '' || shareDatas.payTime == null) {
        a = new Date().getTime() + (24 * 60 * 60 * 1000)
        paymentTime = new Date().getTime()
      } else {
        if (new Date(shareDatas.payTime.replace(/-/g, '/')).getTime() + (24 * 60 * 60 * 1000) < item.endTime) {
          a = new Date(shareDatas.payTime.replace(/-/g, '/')).getTime() + (24 * 60 * 60 * 1000)
        }
        paymentTime = new Date(shareDatas.payTime.replace(/-/g, '/')).getTime()
      }
      let endTimeObj = this.countDown(a);
      endTime = `${endTimeObj.hou}:${endTimeObj.min}:${endTimeObj.sec}`

      let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
      let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
      let shareJson = {
        productCode: sku.substring(0, 9),
        gsColorCode: sku,
        isShare: 'share',
        icon,
        name,
        paymentTime,
        bigorderCode: shareDatas.pintuanOrderPerson,
        share_by : sharePams.employeeId || shareFrom.shareBy || shareFrom.share_by || '',
        share_by_shop : sharePams.shopCode || shareFrom.shareByShop || shareFrom.share_by_shop || '',

        /*utm_source: 'pintuan_share',
        utm_medium: 'pintuan_pic',
        utm_term: shareDatas.pintuanOrderPerson,
        utm_campaign: sku*/
      }

      // 合并Utm参数
      Object.assign(shareJson, app.getUtmOptions())

      if (shareDatas.pintuanOrderType == '1') {
        // 参团的话分享拼主的数据
        let faqiArrs = wx.getStorageSync("pinzhuShareArrs");
        let faqiJson = ''

        faqiArrs.forEach(item => {
          if (shareDatas.bigorderCode == item.dingdanID) {
            faqiJson = item
          }
        });
        shareJson.productCode = faqiJson.productCode
        shareJson.gsColorCode = faqiJson.gsColorCode
        shareJson.paymentTime = faqiJson.paymentTime
        shareJson.bigorderCode = faqiJson.bigorderCode
        shareJson.share_by = faqiJson.share_by
        shareJson.share_by_shop = faqiJson.share_by_shop

        shareJson.utm_term = faqiJson.bigorderCode
        shareJson.utm_campaign = faqiJson.gsColorCode
      }

      this.setData({
        eveShareDatas: shareJson
      })

      qrCode = `${getApp().config.pintuanUrl}${objToQuery(shareJson)}`.replace(/\?/g, '')
      console.log(`拼团分享 二维码内容:${JSON.stringify(qrCode)}`)

      //测试用
      // qrCode = 'https://www.veromoda.com.cn/productCode=319201644&gsColorCode=319201644A06&isShare=share&icon=https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcUfMiceCdLMYpcYqh2cEibBEhibnzPSqsX69fMCngOHMSSFEsictLhfkhJVibHiaNKOdic67LqChZnCpQA/132&name=昵称、&paymentTime=1565944217000&bigOrderCode=41320190816163012056&utm_source=pintuan_share&utm_medium=pintuan_pic&utm_term=41320190816163012056&utm_campaign=319201644A06'
      let dJson = {
        sku,
        price,
        originalPrice,
        personNumber,
        goodsName,
        icon: this.data.icons,
        places,
        endTime,
        brand,
        qrCode,
        buyNum
      }
      console.log(`传入的参数:${JSON.stringify(dJson)}`)
      // 调合图接口
      // 授权
      wx.getSetting({
        success: res => {

          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope:
                'scope.writePhotosAlbum',
              success: res => {

                this.saveImage(dJson)

              },
              fail: () => {
                wx.showModal({
                  title: '提示', //提示的标题,
                  content: '需要授权相册权限才能保存', //提示的内容,
                  showCancel: true, //是否显示取消按钮,
                  cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                  cancelColor: '#000000', //取消按钮的文字颜色,
                  confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
                  confirmColor: '#3CC51F', //确定按钮的文字颜色,
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: res => {
                          if (res.authSetting['scope.writePhotosAlbum']) {

                            this.saveImage(dJson)

                          }
                        }
                      });
                    }
                  }
                });
              }
            });
          } else {

            this.saveImage(dJson)

          }
        }
      });
    })


  },
  // 获取商品详情页拼团数据
  PTGetGoodsDetailPinTuan: function (gsColorCode) {
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {
      }
    });
    let url = `${config.domain}/rest/pintuan/detail?`
    return new Promise((resolve, reject) => {
      request({
        url: `${url}goodsCode=${gsColorCode}`
      }).then(res => {
        wx.hideLoading();
        res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
        if (res.code != 0) {
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
        }
      }).catch(e => {
        wx.hideLoading();
        let a = e.message ? e.message : e.msg
        wx.showToast({
          title: a,
          icon: "none",
        })
        reject(new Error(a))
      })
    })
  },
  //跳转到转盘
  goZp: function (e) {
    console.log(e)
    wx.setStorageSync("zpId", e.currentTarget.bigorderCode);
    wx.navigateTo({
      url: '/games/pages/truntableNew/truntableNew'
    });
  },
  // 合图数据
  PTGetPicGen: function (dJson) {
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {
      }
    });
    return new Promise((resolve, reject) => {
      request({
        url: `${config.domain}/api/pintuan/sharePicGen`,
        method: 'POST',
        data: dJson
      }).then(res => {
        wx.hideLoading();
        res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
        if (res.code != 0) {
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
        }
      }).catch(e => {
        wx.hideLoading();
        let a = e.message ? e.message : e.msg
        wx.showToast({
          title: a,
          icon: "none",
        })
        reject(new Error(a))
      })
    })
  },
  timeFormat: function (param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param.toString();
  },
  countDown: function (e) {

    var newTime = new Date().getTime();
    let obj = null;
    var oneDateTime = e;
    if (oneDateTime - newTime > 0) {
      let time = (oneDateTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time / (60 * 60));
      // let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    return obj
  },
  saveImage: function (dJson) {
    this.PTGetPicGen(dJson).then(item => {
      if (item.image_url) {
        // 获取图片信息
        wx.getImageInfo({
          src: `${cdn}${item.image_url}`, //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径,
          success: res => {
            let tempFilePath = res.path

            wx.saveImageToPhotosAlbum({
              filePath: res.path, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
              success: res => {
                let shareJson = this.data.eveShareDatas
                let collectParam = Object.assign(shareJson, {eventName: `拼团生成二维码图片_${shareJson.gsColorCode}`});
                getApp()._collectData2(collectParam)

                this.setData({
                  shareView: true,
                  isShareImage: true,
                  pintuanFilePath: tempFilePath
                })

              }
            });
          },
          fail: () => {
            wx.showModal({
              title: '提示', //提示的标题,
              content: '图片保存失败', //提示的内容,
              showCancel: false, //是否显示取消按钮,
              confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
              }
            });
          }
        });

      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // console.log(`aaa:${JSON.stringify(e)}`)
    if (e.from == 'menu') {
      // 来自页面内转发按钮
      return
    }
    let shareDatas = this.data.shareDatas
    let isShareImage = this.data.isShareImage
    this.hiddenBounces()
    this.shareViewHiddenBounces()


    let gsColorCode = shareDatas.goodsOrderList[0].gcsSku.substring(0, 12)
    let productCode = shareDatas.goodsOrderList[0].gcsSku.substring(0, 9)
    let bigorderCode = shareDatas.pintuanOrderPerson
    let icon = wxInfo.avatarUrl || ''
    let name = wxInfo.nickName || ''
    var paymentTime = new Date(shareDatas.payTime.replace(/-/g, '/')).getTime()
    if (shareDatas.payTime == '' || shareDatas.payTime == null) {
      paymentTime = new Date().getTime()
    }

    var imageUrl = `${cdn}${shareDatas.picUrl}`
    var utm_param = 'pintuan_message'
    var eveName = `转发给好友_${gsColorCode}`
    if (isShareImage) {
      imageUrl = this.data.pintuanFilePath
      utm_param = 'pintuan_pic'
      eveName = ''
    }
    // 21731T501,21731T501E17
    //https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL6X84bWfXDEDbqDBAhqdzaSSwMG9YnQjHeySC6UZLoAkibrblNjiasqJId5wGO3fL6VXCRibgU9ibOqw/132
    //昵称、
    //23:23:31
    // "61820190127153123270"

    // 发团人的昵称+邀请您拼团 +商品名称前20个字
    let customTitle = `${name}邀请您拼团 ${shareDatas.goodsOrderList[0].goodsName}`

    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    let shareJson = {
      productCode,
      gsColorCode,
      isShare: 'share',
      icon,
      name,
      paymentTime,
      bigorderCode,
      share_by : sharePams.employeeId || shareFrom.shareBy || shareFrom.share_by || '',
      share_by_shop : sharePams.shopCode || shareFrom.shareByShop || shareFrom.share_by_shop || '',
      /*utm_source: 'pintuan_share',
      utm_medium: utm_param,
      utm_term: bigorderCode,
      utm_campaign: gsColorCode*/
    }
    Object.assign(shareJson, app.getUtmOptions())

    if (shareDatas.pintuanOrderType == '1') {
      // 参团的话分享拼主的数据
      let faqiArrs = wx.getStorageSync("pinzhuShareArrs");
      let faqiJson = ''

      faqiArrs.forEach(item => {
        if (shareDatas.bigorderCode == item.dingdanID) {
          faqiJson = item
        }
      });
      shareJson.productCode = faqiJson.productCode
      shareJson.gsColorCode = faqiJson.gsColorCode
      shareJson.paymentTime = faqiJson.paymentTime
      shareJson.bigorderCode = faqiJson.bigorderCode
      shareJson.share_by = faqiJson.share_by
      shareJson.share_by_shop = faqiJson.share_by_shop

      shareJson.utm_term = faqiJson.bigorderCode
      shareJson.utm_campaign = faqiJson.gsColorCode
    }
    if (eveName != '') {
      let collectParam = Object.assign(shareJson, {eventName: eveName});
      getApp()._collectData2(collectParam)
    }
    let path = `/pintuan/pintuanDetail/pintuanDetail${objToQuery(shareJson)}`
    console.log(`分享地址:${path}`)
    return {
      title: customTitle,
      path: path,
      imageUrl: imageUrl,
      success: function (e) {
        console.log(`分享成功`)
      },
      fail: function (e) {
        console.log(`分享失败`)
      }
    }
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

    wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo)
    this.setData({flagShowExBar: config.turnOnShowExOrderList});
    this.shareZan();
    this.searchPintuan()
    if(app.globalData.configJson.storedValueCardOnline){
      this.setData({
        storedValueCardOnline: true,
      })
    }
    let icon = wxInfo.avatarUrl || ''
    let name = wxInfo.nickName || ''
    this.storedValueCard()
    rotate = 3;
    n_page = 1;
    dingdanStatus = wx.getStorageSync('dingdanStatus');
    isTuihuo_global = dingdanStatus.status === "isTuihuo";
    this.setData({
      dingdanList: [],
      exchangeOrderList: [],
      nav_id: dingdanStatus.index,
      isTuihuo: isTuihuo_global
    });
    //获取订单列表
    if (isTuihuo_global) {
      getTuihuoList(n_page, this);
    } else {
      getDingdanList(n_page, dingdanStatus.status, this);
    }

    setTimeout(() => {
      this.getOrderCountNew();
    }, 1000);

  },
  // 储值卡
  storedValueCard(){
    const {memberno} = wx.getStorageSync(KEYSTORAGE.crmInfo)
    // 提交订单如果是储值卡支付，增加一个字段 isGiftCardPaid = Y，不是则不传
    storedValueCard(memberno).then(res => {
      if(res && res.total_balance){
        this.setData({
          totalBalance:  Number(res.total_balance)
        })
      }
    })
  },
  // 查询是否展示拼团模块
  searchPintuan(){
    let showPintuan = this.data.showPintuan
    if (Object.keys(getApp().globalData.configJson).length){
      showPintuan = getApp().globalData.configJson.showPintuan
      if (showPintuan){
        var nav = this.data.nav
        let saleItem = {
          name: '待拼购',
          shoppingCar: 0,
          status: 'WaitingPintuan'
        };
        nav.splice(2, 0, saleItem);

        this.setData({
          nav,
          showPintuan
        })
      }
    }
    else{
      getApp().getConfig().then(res => {
        showPintuan = res.showPintuan
        if (res.showPintuan){
          var nav = this.data.nav
          let saleItem = {
            name: '待拼购',
            shoppingCar: 0,
            status: 'WaitingPintuan'
          };
          nav.splice(2, 0, saleItem);

          this.setData({
            nav,
            showPintuan
          })
        }
      })

    }
  },
  shareZan: function () {
    getConfigJSON().then(res => {
      if (res.shareZanOrderList && res.shareZanOrderList.isShow) {
        this.setData({
          shareZan: res.shareZanOrderList.isShow,
          imageUrl: judgeUrl(res.shareZanOrderList.shareZanOrderListUrl),
        })
      }
      this.setData({
        showPreSale: !!res.showAdvance,
      })
    });
    /*getPopupVoucher().then(res => {
      let curData = res[brand];
      if(curData && curData.orderBannerShareZan){
        this.setData({
          shareZan: curData.orderBannerShareZan,
          orderDrawer: curData.isShowDrawer,
          imageUrl: curData.shareZanOrderListImgUrl,
        });
      }
    }).catch(err => {
      console.log(err.msg)
    })*/
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    //动画初始化
    var animation_load = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear'
    });
    this.animation_load = animation_load;
    app.track()
  },


  /**
   * 订阅的事件回调
   */
  handleEvent: (event, type) => {
    if (type === EVENTS.EVENT_LOGINED && event) {
      //获取非退货总条数
      getTuihuoList(1, this);
      getOrderCountNew();
    }
  },


  //查询拼团订单数量
  getPinTuanOrderCount: function () {
    let param = {
      currentPage: 1,
      status: 'WaitingShipment',
      pintuanStatus: "WaitingPintuan"
    }
    getOrderList(param)
      .then(response => {
        var _nav = this.data.nav;
        _nav[2].shoppingCar = response.totalCounts || 0;
        this.setData({
          nav: _nav,
        })
      })
      .catch(e => {
        console.log(e.message);
      });
  },

  getOrderCountNew: function () {
    orderCount().then(res => {
      if(res){
        let {nav} = this.data;
        nav.forEach(item => {
          item.shoppingCar = res[item.status || 'All'] || 0;
        })
        this.setData({nav});
      }
    })
  },

  //上拉触底 - 加载更多
  onReachBottom: function (e) {
    const that = this;
    if (toLower_onOff) {
      this.setData({
        load_more_hidden: 'block',
        text_isHidden: true
      });
      toLower_onOff = false;

      noStop(rotate);
      rotate += 3;
      const {isTuihuo} = this.data;
      function noStop(n) {
        that.animation_load.rotate(360 * n).step();
        that.setData({
          animationLoad: that.animation_load.export()
        });
      };

      if ((n_page < newAllPage) || (n_page < all_page)) {
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          n_page++;
          if(isTuihuo){
            getTuihuoList(n_page, this);
          }else {
            const orderStatus = wx.getStorageSync('dingdanStatus').status || '';
            getDingdanList(n_page, orderStatus, this);
          }

        }, 1500));

      } else {
        this.setData({
          load_more_hidden: 'block',
          load_isHidden: false,
          text_isHidden: false
        });
        clearInterval(timer);
        timer = setInterval( ()=> {
          this.setData({
            load_more_hidden: 'none'
          });
          toLower_onOff = true;
        }, 500);
      }
    }

  },

  //点击切换导航
  liClick: function (e) {
    console.log(`正常点击:${e}`);
    var index = e.currentTarget.id;
    if (this.data.nav_id === index) {
      return
    }
    n_page = 1;

    if (index == 4) {
      this.setData({
        nav_id: index,
        nav_id_slide: -1,
      });
    } else {
      isTuihuo_global = false;
      this.setData({
        nav_id: index,
        dingdanList: [],
        exchangeOrderList: [],
        nav_id_slide: -1,
      });
    }


    if (index != 4 && index != 7 && index != 8) {
      this.setData({
        flagNavOpen: false,
        needAnimation: true
      });
    }

    switch (Number(index)) {
      //全部订单
      case 0:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, '', this);
          wx.setStorageSync('dingdanStatus', {
            index: 0,
            status: ''
          });
        }, 1500));
        break;

      //待付款
      case 1:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingPay', this);
          wx.setStorageSync('dingdanStatus', {
            index: 1,
            status: 'WaitingPay'
          });
        }, 1500));

        break;
      //待发货
      case 2:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingShipment', this);
          wx.setStorageSync('dingdanStatus', {
            index: 2,
            status: 'WaitingShipment'
          });
        }, 1500));

        break;

      //待收货
      case 3:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingReceive', this);
          wx.setStorageSync('dingdanStatus', {
            index: 3,
            status: 'WaitingReceive'
          });
        }, 1500));

        break;

      // // 退货/售后
      // default:
      //   isTuihuo_global = true;
      //   getTuihuoList(n_page, this);
      //   wx.setStorageSync('dingdanStatus', {
      //     index: 4,
      //     status: 'tuihuo'
      //   });


      //退换货展开
      case 4:
        this.setData({
          flagExNavShow: true,
          flagNavOpen: !this.data.flagNavOpen,
          needAnimation: true
        });
        break;

      //退货单：
      case 7:
        isTuihuo_global = true;
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getTuihuoList(n_page, this);
          wx.setStorageSync('dingdanStatus', {
            index: 4,
            status: 'tuihuo'
          });
          this.setData({
            isBestseller: true,
          })
          this.setData({
            flagExNavShow: true,
            flagNavOpen: !this.data.flagNavOpen,
            needAnimation: true,
            nav_id: 4,
            nav_id_slide: 7,
          });
        }, 1500));

        break;

      //换货单：
      case 8:
        wx.showToast({
          title: '点击了换货单',
        })
        wx.setStorageSync('dingdanStatus', {
          index: 4,
          status: ''
        });
        this.setData({
          flagExNavShow: true,
          flagNavOpen: !this.data.flagNavOpen,
          needAnimation: true,
          nav_id: 4,
          nav_id_slide: 8,
        });

        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(1, "", this);
        }, 1500));

        break;

    }
    ;
    this.setData({
      isTuihuo: isTuihuo_global
    });
  },
  liClick_FOL: function (e) {
    // console.log(`FOL:${JSON.stringify(e)}`);
    var index = e.currentTarget.id;
    if (this.data.nav_id === index) {
      return
    }
    n_page = 1;

    if (index == 5) {
      this.setData({
        nav_id: index,
        nav_id_slide: -1,
      });
    } else {
      isTuihuo_global = false;
      this.setData({
        nav_id: index,
        dingdanList: [],
        exchangeOrderList: [],
        nav_id_slide: -1,
      });
    }


    if (index != 5 && index != 7 && index != 8) {
      this.setData({
        flagNavOpen: false,
        needAnimation: true
      });
    }

    switch (Number(index)) {
      //全部订单
      case 0:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, '', this);
          wx.setStorageSync('dingdanStatus', {
            index: 0,
            status: ''
          });
        }, 1500));
        break;
      //待付款
      case 1:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingPay', this);
          wx.setStorageSync('dingdanStatus', {
            index: 1,
            status: 'WaitingPay'
          });
        }, 1500));

        break;
      //带拼购
      case 2:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingPintuan', this);
          wx.setStorageSync('dingdanStatus', {
            index: 2,
            status: 'WaitingPintuan'
          });
        }, 1500));
        break;
      //待发货
      case 3:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingShipment', this);
          wx.setStorageSync('dingdanStatus', {
            index: 3,
            status: 'WaitingShipment'
          });
        }, 1500));

        break;

      //待收货
      case 4:
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(n_page, 'WaitingReceive', this);
          wx.setStorageSync('dingdanStatus', {
            index: 4,
            status: 'WaitingReceive'
          });
        }, 1500));

        break;

      // // 退货/售后
      // default:
      //   isTuihuo_global = true;
      //   getTuihuoList(n_page, this);
      //   wx.setStorageSync('dingdanStatus', {
      //     index: 4,
      //     status: 'tuihuo'
      //   });


      //退换货展开
      case 5:
        this.setData({
          flagExNavShow: true,
          flagNavOpen: !this.data.flagNavOpen,
          needAnimation: true
        });
        app.gioTrack('flow_purchase_order_pay_success_orderlist_return')
        break;

      //退货单：
      case 7:
        isTuihuo_global = true;
        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getTuihuoList(n_page, this);
          wx.setStorageSync('dingdanStatus', {
            index: 5,
            status: 'tuihuo'
          });
          this.setData({
            isBestseller: true,
          })
          this.setData({
            flagExNavShow: true,
            flagNavOpen: !this.data.flagNavOpen,
            needAnimation: true,
            nav_id: 5,
            nav_id_slide: 7,
          });
        }, 1500));

        break;

      //换货单：
      case 8:
        wx.showToast({
          title: '点击了换货单',
        })
        wx.setStorageSync('dingdanStatus', {
          index: 5,
          status: ''
        });
        this.setData({
          flagExNavShow: true,
          flagNavOpen: !this.data.flagNavOpen,
          needAnimation: true,
          nav_id: 5,
          nav_id_slide: 8,
        });

        wx.showLoading({
          title: "Loading....",
          mask: true
        }, setTimeout(() => {
          wx.hideLoading();
          getDingdanList(1, "", this);
        }, 1500));

        break;

    }
    this.setData({
      isTuihuo: isTuihuo_global
    });
  },
  removeOrder(index){
    const {dingdanList} = this.data;
    const param = [dingdanList[index].bigorderCode]
    hideOrder(param).then(res => {
      dingdanList.splice(index, 1)
      this.setData({dingdanList})
    }).catch(err => wxShowToast(err.message))
  },

  //查看订单详情 并 付款
  formSubmit: function (e) {
    console.log(e,'**')
    if (e.currentTarget.dataset.checkcode) {
      this.onTicketClick(e)
      return
    }
    const Index = e.currentTarget.dataset.index;
    // const Index = e.detail.target.id;
    var List = this.data.dingdanList;
    // console.log(`进入详情:${JSON.stringify(List[Index])}`)
    let json = List[Index];
    if(e.currentTarget.dataset.type === 'remove'){
      const {index} = e.currentTarget.dataset;
      const that = this;
      wx.showModal({
        title: '提示',
        content: '确定要删除订单?',
        showCancel: true,
        success (res) {
          if (res.confirm) {
            that.removeOrder(index)
          }
        }
      })
      return;
    }

    if (json.isPintuan == 'pintuan') {
      wx.setStorageSync('isPintuanForDetailPage', true)
      let orderData = {
        bigorderCode: json.pintuanOrderPerson,
        bigOrderId: json.id,
        orderToken: json.orderToken
      }
      wx.setStorageSync('orderData', orderData)
      let detailData = {
        imageUrl: `${cdn}${json.picUrl}`,
        goodsName: json.goodsOrderList[0].goodsName,
        sizeAlias: json.goodsOrderList[0].sizeName,
        nums: json.goodsTotalCount,
        onePrice: json.goodsOrderList[0].price,
        originalPrice: json.goodsOrderList[0].originalPrice,
        pintuanOrderType: json.pintuanOrderType
      }
      wx.setStorageSync('detailData', detailData)

    }
    wx.setStorageSync('pintuanGsColorCode', json.goodsOrderList[0].gcsSku.substring(0, 12))

    // 1.待发货+WaitingPintuan && 不是退货单2.待发货+PintuanSuccess && 不是退货单

    if (json.isPintuan == 'pintuan' && json.pintuanStatus == 'PintuanSuccess' && json.status == 'WaitingShipment' && json.isHaveRefund == '0') {
      wx.navigateTo({url: '/pintuan/pintuanOrder_success/pintuanOrder_success'});
    } else if (json.isPintuan == 'pintuan' && json.pintuanStatus == 'WaitingPintuan' && json.status == 'WaitingShipment' && json.isHaveRefund == '0') {
      wx.navigateTo({url: `/pintuan/pintuanOrder/pintuanOrder`});
    } else {
      this.setData({
        flagNavOpen: false,
      });

      wx.setStorageSync('allToDingdan', List[Index]);
      wx.setStorageSync('isTuihuo', false);
      wx.navigateTo({
        url: '../dingdanToPay/dingdanToPay'
      });
    }
  },

  //查看退货订单详情
  toDingdanCon1: function (e) {
    var Index = e.currentTarget.id;
    var List = this.data.dingdanList;

    wx.setStorageSync('allToDingdan', List[Index]);
    wx.setStorageSync('isTuihuo', true);
    wx.setStorageSync('tuikuanCode', '');

    //  这个是到店退标识 gzl  直接点击  退货商品进入
    wx.setStorageSync('toShop', false);

    //初始化时，选择的地区商店清除
    try {
      wx.setStorageSync('selectShopInfos', null);
    } catch (e) {
    }
    //end gzl

    wx.navigateTo({
      url: `../dingdanToPay/dingdanToPay?refundStatus=${List[Index].refundStatus}`,
    });
  },
  //复制订单号
  onClick: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: res => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        })
      }
    })
  },
  //立即支付
  wxPay: function (e) {
    const Index = e.currentTarget.dataset.index;
    const dingdanCon = this.data.dingdanList[Index];
    let orderType = dingdanCon.orderType;
    if (orderType && orderType == "EXCHANGE") {
      let bigorderCode = dingdanCon.bigorderCode;
      let payToken = dingdanCon.payToken;
      let payTokenTime = dingdanCon.payTokenTime;
      let exchangeCode = dingdanCon.exchangeCode;
      let amountPaid = dingdanCon.exchangeAdditionalPrice;
      let intentType = "fromOrderList";
      let querystring = `bigorderCode=${bigorderCode}&payToken=${payToken}&payTokenTime=${payTokenTime}&exchangeCode=${exchangeCode}&amountPaid=${amountPaid}&intentType=${intentType}&orderType=exchange`;
      console.log("querystring =======" + querystring);
      wx.navigateTo({
        url: `/pages/wxPay/wxPay?${querystring}`,
      });

    } else {

      let bigorderCode = dingdanCon.bigorderCode;
      let orderToken = dingdanCon.orderToken;
      let payToken = dingdanCon.payToken;
      let payTokenTime = dingdanCon.payTokenTime;
      let amountPaid = dingdanCon.payPrice;
      let id = dingdanCon.id;
      const queryObj = {
        id,
        bigorderCode,
        orderToken,
        payToken,
        payTokenTime,
        amountPaid,
        sku: dingdanCon.goodsOrderList[0].gcsSku.substring(0,12),
      }

      // 拼团订单参数封装
      let json = dingdanCon
      if (json.isPintuan == 'pintuan'){
        wx.setStorageSync('isPintuan',true)
        let orderData = {
          bigorderCode : json.pintuanOrderPerson,
          bigOrderId : json.id,
          orderToken : json.orderToken
        }
        wx.setStorageSync('orderData',orderData);
        const curGoods = json.goodsOrderList[0];
        if (json.pintuanOrderType == '1'){
          let detailData = {
            imageUrl : `${cdn}${json.picUrl}`,
            goodsName : curGoods.goodsName,
            sizeAlias : curGoods.sizeName,
            nums : json.goodsTotalCount,
            onePrice : curGoods.price,
            originalPrice : curGoods.originalPrice,
            pintuanOrderType : json.pintuanOrderType
          }
          wx.setStorageSync('detailData',detailData)
        }
        wx.setStorageSync('pintuanGsColorCode',curGoods.gcsSku.substring(0,12))

        wx.hideLoading();
        wx.navigateTo({
          url: `../wxPay/wxPay${objToQuery(queryObj)}`
        });
      }else{
        this.wxPayment(Index);
      }


    }
  },
  async wxPayment(index){
    const {bigorderCode, payToken, payTokenTime, id, orderToken, payPrice, channelId} = this.data.dingdanList[index];
    const payParam = {bigorderCode, payToken, payTokenTime};
    const paramString = {orderToken, bigorderCode, id};
    try {
      app.tdSdkEvent('flow_purchase_order_paynow_4', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      });
      app.gioTrack('flow_purchase_order_pay_fail_orderlist_paynow', {
        order_id: bigorderCode
      })
      // 其他平台的订单不能支付
      if(channelId !== CHANNEL_ID){
        wx.showModal({
          title: '提示',
          content: '您已在其他平台发起过支付，该单不能支付',
          showCancel: false,
          success (res) {
            if (res.confirm) {}
          }
        });
        return
      }
    }catch (e) {}
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    payment(payParam).then(res => {
      wx.hideLoading();
      if(res){
        wxRequestPayment(res).then(payRes => {
          if(payRes){
           this.goPayCon(paramString)
          }
        });
      }
    }).catch(err => wxShowToast(err.message))

  },
  goPayCon(paramString){
    wx.navigateTo({
      url: '../wxPayCon/wxPayCon' + objToQuery(paramString)
    });
  },
  cardPay(e){
    const {index} = e.currentTarget.dataset;
    const {bigorderCode, id, orderToken} = this.data.dingdanList[index];
    const paramString = {orderToken, bigorderCode, id};
    svCardPayByOrderCode(bigorderCode).then(res => {
      if(res){
        this.goPayCon(paramString)
      }
    }).catch(err => wxShowToast(err.message))
  },
  //去逛逛
  goToShopping: function (e) {
    wx.switchTab({
      url: '../index/index'
    });
  },

//打开提示信息窗口
  tip: function () {
    this.setData({
      isTip: true
    });
  },
  //关闭提示信息
  closeTip: function (e) {
    this.setData({
      isTip: false
    });
  },
  //打开上传单号框
  wxUp: function (e) {
    let oriordercode = e.currentTarget.dataset.oriordercode;
    let refundcode = e.currentTarget.dataset.refundcode;
    this.setData({
      submitDanhao: true,
      oriorderCode: oriordercode,
      refundCode: refundcode
    });
  },


  //输入物流名称
  nameInput: function (e) {
    var that = this;
    let danhao_name = e.detail.value;
    this.setData({
      danhao_name: danhao_name
    });
    if (danhao_name != '') {
      that.setData({
        danhao_name_tishi: false
      });
    }
    ;
  },

  //输入快递单号
  numberInput: function (e) {
    var that = this;
    let danhao_value = e.detail.value;
    this.setData({
      danhao_number: danhao_value
    });
    if (danhao_value != '') {
      that.setData({
        danhao_tishi: false
      });
    }
    ;
  },

  //关闭上传单号框, 并上传单号信息
  danhao_true: function () {
    var that = this;
    let danhao_name = this.data.danhao_name;
    let danhao_number = this.data.danhao_number;
    if (danhao_name == '') {
      this.setData({
        danhao_name_tishi: true
      });
    }

    if (danhao_number == '') {
      this.setData({
        danhao_tishi: true
      });
    } else {
      const {refundCode, oriorderCode} = this.data;
      //上传快递单号
      const param = {
        refundCode,
        oriorderCode,
        waybillNum: danhao_number,
        expressCompany: danhao_name
      };
      submitWayBill(param).then(res => {
        if(res){
          this.setData({
            submitDanhao: false
          });
          wx.redirectTo({
            url: `/order/refundDetail/refundDetail?type=express&refundOrderCode=${refundCode}`,
            success() {
              wx.hideLoading();
            }
          });
        }
      }).catch(err => {
        wx.showModal({
          title: '提示',
          content: '上传退货快递单号失败，请重新上传',
          showCancel: false
        });
      });
    }
  },


  //关闭上传单号框
  danhao_false: function () {
    this.setData({
      submitDanhao: false
    });
  },
  //到店退
  goReturned: function (e) {
    let {oriordercode, address, refundskus, refundcode, index} = e.currentTarget.dataset;

    var List = this.data.dingdanList;

    wx.setStorageSync('allToDingdan', List[index]);
    wx.setStorageSync('isTuihuo', true);
    wx.setStorageSync('tuikuanCode', '');


    wx.setStorageSync('oriordercode', oriordercode)
    wx.setStorageSync('address', address)
    wx.setStorageSync('refundskus', refundskus)
    wx.setStorageSync('refundcode', refundcode)
    // wx.setStorageSync('toShop', true);//点击到店退按钮进入

    wx.navigateTo({
      url: '../returned/returned'
    });
  },
  //修改退货方式
  resetWays: function (e) {
    let index = e.currentTarget.id;
    this.setData({
      isShowWay: index,
      isResetWay: 'none'
    });
  },

  //提货凭证
  onTicketClick: function (e) {
    let bigorderCode = e.currentTarget.dataset.bigOrderCode;//一维码字符串
    let checkcode = e.currentTarget.dataset.checkcode;//二维码字符串
    wxbarcode.barcode('barcode', bigorderCode, 400, 80);//一维码
    wxbarcode.barcode('qrcode', checkcode, 400, 80);//二维码
    this.setData({
      isVoucher: true,
      bigorderCode: bigorderCode,
      checkcode: checkcode
    });
  },
  //关闭提货凭证
  closeVoucher: function () {
    this.setData({
      isVoucher: false
    });
  },


  onExchangeOrderItemClick: function (e) {
    let index = e.currentTarget.id;
    console.log(e);
    this.setData({
      flagNavOpen: false,
    });
    let exBeanRaw = this.data.exchangeOrderList[index];
    let status = exBeanRaw.status;
    let exchangeCode = exBeanRaw.exchangeCode;
    console.log(exchangeCode);
    let exPath = `exchangeGoods`
    switch (status) {
      case ExCons.CREATED :
        wx.navigateTo({
          url: `/${exPath}/auditResults/auditResults?exchangeCode=${exchangeCode}`,
        })
        break;
      case ExCons.CHECK_FAIL :
        wx.navigateTo({
          url: `/${exPath}/auditResults/auditResults?exchangeCode=${exchangeCode}`,
        })
        break;

      //已选择到店还是邮寄换：
      case ExCons.CONFIRM_TYPE:
        if (exBeanRaw.exchangeType == "STORE") {
          //到店 不论选不选商品，都进入备货状态页面
          wx.navigateTo({
            url: `/${exPath}/prepareGoodsStatus/prepareGoodsStatus?exchangeCode=${exchangeCode}`,
          });
        } else {
          // 邮寄换货，还没填写运单号
          wx.navigateTo({
            url: `/${exPath}/uploadTrackingNumber/uploadTrackingNumber?exchangeCode=${exchangeCode}`,
          });
        }
        break;

      //备货的三种状态，都去备货状态页面：
      case ExCons.STOCKING:
      case ExCons.STOCKED:
      case ExCons.STOCK_FAIL:
        wx.navigateTo({
          url: `/${exPath}/prepareGoodsStatus/prepareGoodsStatus?exchangeCode=${exchangeCode}`,
        });
        break;

      case ExCons.BUYER_MAILED: //已寄回待入库/待卖家收货
        // wx.navigateTo({
        //   url: `/${exPath}/cusAlreadyMailed/cusAlreadyMailed?exchangeCode=${exchangeCode}`,
        // });
        // break;

      case ExCons.RECEIVED://待支付
      case ExCons.WAIT_SHIP://等待卖家发货
      case ExCons.SHIPPED://等待买家收货
      case ExCons.CLOSED://已关闭
      case ExCons.COMPLETE://换货成功
        wx.navigateTo({
          url: `/${exPath}/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`,
        });
        break;
    }
  },


  btnShowPointOrder: function (e) {
    wx.navigateTo({
      url: "/pages/rewardCenter/rcOrderList/rcOrderList"
    })
  },

  onExchangeCancel: function (e) {
    let index = e.currentTarget.id;
    console.log(e);
    this.setData({
      flagNavOpen: false,
    });
    let exchangeCode = this.data.exchangeOrderList[index].exchangeCode;
    console.log("exchangeCode = =" + exchangeCode);
    wx.showModal({
      title: '提示',
      content: '确认取消换货？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.showLoading({
            title: '加载中...'
          });
          closeExOrder(exchangeCode)
            .then(res => {
              wx.hideLoading();
              wx.navigateTo({
                url: `/exchangeGoods/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`,
              });
            })
            .catch(e => {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: `${e.message}`,
                showCancel: false,
              })
            });
        }
      }
    })
  },

  // 确认收货
  receipt: function (e) {
    var that = this;
    var Index = e.currentTarget.id;
    const {dingdanList} = this.data;
    var dingdanCon = dingdanList[Index];

    //提示框
    wx.showModal({
      title: '提示',
      content: '确认收货吗？',
      success: function (res) {
        if (res.confirm) {
          const param = {
            bigorderCode: dingdanCon.bigorderCode,
            orderToken: dingdanCon.orderToken,
            type: 1
          };
          confirmOrder(param).then(data => {
              wxShowToast('确认收货成功');
            dingdanCon.status = 'TransactionSuccess';
              that.setData({
                dingdanList,
                'prevDingdanStatus': 'TransactionSuccess',
                'footer_isShow': false
              });
            }).catch(err => {
            wx.showToast({
              title: '确认收货失败，请重新确认',
              image: '/images/joinFalse.png',
              duration: 500
            });
          });
        } else if (res.cancel) {
        }
      }
    });
  },

  // 提醒发货
  remind: function (e) {
    var Index = e.currentTarget.id;
    const {dingdanList} = this.data;
    var dingdanCon = dingdanList[Index];
    try {
      app.tdSdkEvent('flow_purchase_order_pay_success_orderdetail_shipreminder_7aaa', {
        ORDER_ID: dingdanCon.bigorderCode || '',
        ORDER_PAY: dingdanCon.payPrice || ''
      })
      app.gioTrack('flow_purchase_order_pay_success_orderlist_remind', {
        order_id: dingdanCon.bigorderCode
      })
    } catch (e) {

    }
    if (dingdanCon.warning == "N") {
      const param = {
        bigorderCode: dingdanCon.bigorderCode,
        orderToken: dingdanCon.orderToken,
        type: 3
      };
      confirmOrder(param).then(res => {
        if(res){
          wxShowToast('提醒成功！');
          dingdanCon.warning = 'Y';
          dingdanList.splice(Index, 1, dingdanCon);
          this.setData({dingdanList})
          // this.remidNotice(dingdanCon.createTime);
        }
      }).catch(err => wxShowToast(err.message));
    } else {
      this.remidNotice(dingdanCon.createTime);
    }
  },

  // 提醒发货通知
  remidNotice: function (timer) {
    let recommdNoticePic = '';
    let expressTitle = '';
    let expressNotice = '';
    let fromatTime = parseInt(StringToMillisecond(changeTimer(timer)));
    if (fromatTime < 24 && app.config.brand != "FOL") {
      recommdNoticePic = splitImg('recommd_in24hour.png', 'common');
      expressTitle = '正在为您安排发货';
      expressNotice = '预计在48小时内发出\n请耐心等待';
    } else if (fromatTime >= 24 && fromatTime < 48 && app.config.brand != "FOL") {
      recommdNoticePic = splitImg('recommd_over24hour.png', 'common');
      expressTitle = '正在为您安排发货';
      expressNotice = '预计在24小时内发出\n请耐心等待';
    } else if (fromatTime < 72 && app.config.brand === "FOL") {
      recommdNoticePic = splitImg('recommd_over24hour.png', 'common');
      expressTitle = '正在为您安排发货';
      expressNotice = '预计在72小时内发出\n请耐心等待';
    } else {
      recommdNoticePic = splitImg('recommd_over48hour.png', 'common');
      expressTitle = '非常抱歉';
      expressNotice = '订单量大，您的订单还未发出\n我们已加急处理';
    }
    this.setData({
      recommdNoticePic: recommdNoticePic,
      isRecommd: app.config.brand === "FOL",
      isRecommdNew: app.config.brand !== "FOL",
      expressTitle,
      expressNotice
    });
  },

  // 退货售后
  returnGoods: function (e) {
    var Index = e.currentTarget.id;
    var dingdanCon = this.data.dingdanList[Index];
    wx.setStorageSync('allToDingdan', dingdanCon);
    wx.setStorageSync('isTuihuo', false);
    wx.navigateTo({
      url: '../dingdanToPay/dingdanToPay'
    });
  },

  // 查看物流
  express: function (e) {
    var that = this;
    var Index = e.currentTarget.id;
    var dingdanCon = this.data.dingdanList[Index];
    if (Number(dingdanCon.goodsTotalCount) > 1) {
      wx.setStorageSync('allToDingdan', dingdanCon);
      wx.setStorageSync('isTuihuo', false);
      wx.navigateTo({
        url: '../dingdanToPay/dingdanToPay'
      });
    } else {
      var dingdan_code = '';
      var dingdan_code = dingdanCon.expressOrderNo || '';
      var _goodsid = e.currentTarget.dataset.goodsid;

      if (dingdan_code == '') {
        wx.setStorageSync('allToDingdan', dingdanCon);
        wx.setStorageSync('isTuihuo', false);
        wx.navigateTo({
          url: '../dingdanToPay/dingdanToPay'
        });
      } else {

        getExpressInfo(dingdan_code)
          .then(data => {
            if (data.length > 0) {
              wx.setStorageSync(KEYSTORAGE.expressInfo, {
                expressOrderNo: dingdan_code,
                bigorderCode: dingdanCon.bigorderCode
              });
              wx.navigateTo({
                url: '../lookDdAdress/lookDdAdress?dingdan_code=' + dingdan_code
              });
            }
            ;
            if (data.length == 0) {
              this.setData({
                noticeContent: '暂没有物流信息',
                isNotice: true,
              });
              setTimeout(function () {
                that.setData({
                  isNotice: false,
                });
              }, 2000);
            }
            ;
          });
      }
    }
  },

  jumpDrawer: function (e) {
    wx.navigateTo({
      url: '/games/pages/truntableNewId/truntableNewId'
    });
  },

  clickClose: function () {
    this.setData({
      isRecommd: false,
      isRecommdNew: false,
    })
  },

  // 拨打电话
  callPhone: function () {
    wx.makePhoneCall({phoneNumber: '400-862-8888'});
  },

  saveGuideImage: function () {
    const type = 'scope.writePhotosAlbum';
    let _this = this;
    app.isAuthor({
      type: 'scope.writePhotosAlbum',
      title: '需要授权相册权限才能保存',
      callBack: _this.saveImgFn,
    })
  },

  // 保存图片
  saveImgFn: function () {
    let customer = this.data.customer;
    let loadingTime = setTimeout(() => {
      wx.showLoading({
        title: '保存中...',
        mask: true,
      })
    }, 800);
    getImageInfo(customer.imgUrl).then(imgUrl => {
      return imgUrl
    }).then(filPath => {
      saveImageToPhotosAlbum(filPath).then(res => {
        wx.hideLoading();
        clearTimeout(loadingTime);
        wx.showToast({
          title: '图片保存成功！',
          icon: 'none'
        })
      });
    }).catch(err => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      console.log(err)
    })
  },

  saveName: function () {
    let customer = this.data.customer;
    wx.setClipboardData({
      data: customer.wxName,
      success: function (res) {
        wx.showToast({
          title: '复制成功！',
          icon: 'none'
        })
      }
    })
  },

  //复制订单号
  copyOrderNum: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: res => {
        wxShowToast('复制成功！')
      }
    })
  }
})
