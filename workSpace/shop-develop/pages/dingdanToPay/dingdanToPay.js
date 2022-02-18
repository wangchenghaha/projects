const config = require('../../src/config.js');
import events from '../../src/events';
const { EVENTS, KEYSTORAGE, URL_CDN, REGEXP } = require('../../src/const');
import { orderDetail, orderCancel, confirmOrder } from '../../service/order'
import { payment, wxRequestPayment, storedValueCard, svCardPayByOrderCode } from '../../service/pay'
import { refundDetail, submitWayBill, refundStoreApply } from '../../service/refund'
import { wxShowToast, wxCopyText } from '../../utils/wxMethods'
import { objToQuery, formatCurTime, skuToImg, orderStatus, dateIsOverDue, jianfa, getNineSku } from "../../utils/utils";
import { wxSubscription } from '../../utils/wxSubscribe';
let curOption = {};
var app = getApp();
var danhao_value = '';
var danhao_name = '';
const { cdn, brand, CHANNEL_ID, STORE_VALUE } = app.config;

const countTime = 60;
let refundStatus = '';
Page({

  //页面的初始数据
  data: {
    storedValueCardOnline: app.globalData.configJson.storedValueCardOnline,
    STORE_VALUE,
    isPintuan: false,  //是否是拼团订单
    showPintuan: false,
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    dingdanCon: {},
    footer_isShow: false,
    dingdanStatus: false,
    prevDingdanStatus: '',
    payment: true,
    isCome: true,
    tuihuoCon: {},
    isTuihuo: false,

    //快递单号
    submitDanhao: false,

    danhao_name: '',
    danhao_name_tishi: false,
    danhao_name_text: '物流名称不能为空',

    danhao_number: '',
    danhao_tishi: false,
    danhao_text: '快递单号不能为空',

    //是否是到店退进入 gzl
    toShop: false,
    //选择的店铺信息
    // selectShopInfos:{},
    pd: '176rpx',
    //成功到店退
    yesShop: false,
    isSevenRPrd: 1, //控制7天无理由退货按钮是否显示
    sizeShow: true,
    derivedFromExchangeOrder: false,
    flagEnableApplyForEx: false,
    isWxReductionOrder: false,
    isPriceZero: false,
    showRefund: true,
    showReturnGoods: false,
    returnGoodsAddressList: [],
    showExpress: false,
    cancelOrder: true,
    cancelOrderCountDown: countTime,
    expressCar: cdn + '/assets/common/image/wattingReceiveCart.png',
    noExpressCar: cdn + '/assets/common/image/wattingShipmentCart.png',
    showRefundExpress: false,
    projeckName: app.config.brand === 'SELECTED' ? 'borda-gender' : 'orderInfoPage',
    refundFreight: false,
    itemId: '',
    // 显示评价
    showRating: false,
    reminder: '温馨提示：如遇商品退换货情况，运费需自理，到付拒不签收，质量问题请联系在线客服。',
    // 储值卡支付
    totalBalance: 0,
    storedValueCardPay: false
  },
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      this.getOrderDetail()
    }
  },
  evaluateClick(e){
    const {index} = e.currentTarget.dataset;
    const { bigorderCode} = this.data.dingdanCon;
    const {gcsSku, goodsName = '', colorName = '', sizeName = '', goodsId = ''} = this.data.dingdanCon.goodsOrderList[index];
    const queryString = objToQuery({gcsSku, goodsName, colorName, sizeName, bigorderCode, goodsId});
    wx.navigateTo({
      url: `/order/buyerShow/evaluate/evaluate${queryString}`
    });
  },
  refundExpress() {
    const { tuihuoCon } = this.data;
    if (tuihuoCon.otherWay) {
      wx.showModal({
        title: '提示',
        content: '此单您已申请，不可再次申请',
        showCancel: false,
        confirmText: '知道了',
        success(res) { }
      });
      return;
    }
    if (tuihuoCon.refundCode) {
      const param = {
        refundCode: tuihuoCon.refundCode,
        oriorderCode: tuihuoCon.oriorderCode
      };
      wx.navigateTo({
        url: `/order/qualityRefund/qualityRefund${objToQuery(param)}`,
      })
    }
  },
  getRefundDetail(refundCode) {
    this.initRefundAddress();
    refundDetail(refundCode).then(res => {
      wx.hideLoading();
      if (res) {
        wx.setStorageSync(KEYSTORAGE.refundDetail, [res]);
        res.rgopList.forEach((item) => {
          item.price = item.price.toFixed(2);
          item.gsMainPicPath = cdn + skuToImg({
            sku: item.sku,
            size: URL_CDN.IMGSIZE240400
          });
          if (!item.sizeName) {
            item.sizeName = '';
          }
        });
        //在搜索店铺中，存储了选择的店铺信息，需要在这里 根据 createTime +15天  计算出selectShopInfos.endTime
        if (res.refundStore) {
          let refundShopInfos = {
            address: res.refundStore.storeAddress,
            latitude: res.refundStore.storeLatitude,
            name: res.refundStore.storeName,
            businessHours: res.refundStore.storeBusinessHours,
            longitude: res.refundStore.storeLongitude,
            phone1: res.refundStore.storePhone,
            storeCode: res.refundStore.storeCode
          }
          //15*24*60*60*1000
          const createTime = Date.parse(res.createTime.replace(/-/g, '/'))
          let endTime = parseInt(createTime) + 15 * 24 * 60 * 60 * 1000;
          endTime = new Date(endTime);
          endTime = endTime.getFullYear() + '年' + (endTime.getMonth() + 1) + '月' + endTime.getDate() + '日' + endTime.getHours() + '点';
          refundShopInfos.endTime = endTime
          this.setData({
            showReturnGoods: false,
            refundShopInfos: refundShopInfos
          });
        }
        let { refundFreight } = this.data;
        if (res.otherRefundType && res.otherRefundType === 'goodsQuality') {
          refundFreight = true;
        }
        res.myRefundStatus = orderStatus(res.refundStatus);
        let refundTitle = '', refundSubTitle = '';
        if (res.refundStore && Object.keys(res.refundStore)) {
          res.myRefundStatus = res.refundStatus !== 'RefundSuccess' ? '等待店铺处理' : res.myRefundStatus;
          switch (refundStatus) {
            case "RefundSuccess":
              refundTitle = '退款成功';
              refundSubTitle = '退款成功，注意查看银行到账情况（一般3个工作日到账，未到账请与银行联系）。';
              break;
            case "ApplyRefunding":
              refundTitle = '等待商家处理';
              refundSubTitle = '商家已同意您的退货申请，正在为您处理退款，请耐心等待。若长时间退款未受理，请与在线客服联系，谢谢。';
              break;
            case "REFUNDING":
            case "RefundGoodsing":
              refundTitle = '请等待商家处理';
              refundSubTitle = '您已成功发起退款申请，请耐心等待商家处理。';
              break;
            default:
              refundTitle = res.myRefundStatus;
          }
        }

        this.setData({
          tuihuoCon: res,
          refundFreight,
          refundTitle,
          refundSubTitle
        });
      }
    }).catch(err => wxShowToast(err.message));
  },
  contactServe() {

  },

  // 查询是否展示拼团模块
  searchPintuan() {
    let showPintuan = this.data.showPintuan

    if (Object.keys(getApp().globalData.configJson).length) {
      showPintuan = getApp().globalData.configJson.showPintuan

      this.setData({
        showPintuan
      })
      this.getOrderDetailDatas()
    }
    else {
      getApp().getConfig().then(res => {
        showPintuan = res.showPintuan

        this.setData({
          showPintuan
        })
        this.getOrderDetailDatas()
      })

    }

  },
  // 获取订单详情
  getOrderDetailDatas() {

    var dingdanCon = wx.getStorageSync('allToDingdan');
    var tuihuoOnoff = wx.getStorageSync('isTuihuo');
    //获取订单详情
    if (tuihuoOnoff && dingdanCon && dingdanCon.refundCode) {
      wx.setStorageSync('dingdanStatus', {
        index: this.data.showPintuan ? 5 : 4,
        status: 'isTuihuo'
      });
      this.setData({
        isTuihuo: true
      });

      var refundCode = dingdanCon.refundCode;
      var backRefundCode = wx.getStorageSync('tuikuanCode');
      if (backRefundCode.length > 0) {
        refundCode = backRefundCode;
      }
      this.getRefundDetail(refundCode);
    } else {
      this.setData({
        isTuihuo: false
      });
      this.getOrderDetail()
    }

  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    refundStatus = options.refundStatus;
    let isPintuanDetailPage = wx.getStorageSync('isPintuanForDetailPage');
    wx.removeStorageSync("isPintuanForDetailPage");
    if (isPintuanDetailPage) {
      this.setData({ isPintuan: true })
    }
    if(app.globalData.configJson.storedValueCardOnline){
      this.setData({
        storedValueCardOnline: true,
      })
    }
    wx.showLoading({
      title: '加载中'
    });
    if (config.flagEnableApplyForEx) {
      this.setData({ flagEnableApplyForEx: true });
    }
    curOption = options;
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    if (!app.checkLogin()) {
      return;
    }
    danhao_name = '';
    danhao_value = '';

    let { selectShopInfos } = options
    console.log(">>>>>>>>>.       selectShopInfos================  ")
    console.log(selectShopInfos)
    if (selectShopInfos) {
      let infos = JSON.parse(selectShopInfos)
      this.setData({
        refundShopInfos: infos,
        toShop: true,
        pd: '20rpx'
      });
    }
    this.searchPintuan()
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    try {
      app.tdSdkEvent('flow_purchase_order_1', {})
    } catch (e) { }

    app.track();
  },
  getOrderDetail: function () {
    const ORDER_TOKEN = 'f215f9d75839fc716a6bd1ce82fe08fd';
    let wxData = this.data;
    let  orderToken = ORDER_TOKEN, bigorderCode = curOption.bigorderCode;
    if (!bigorderCode) {
      // 本地缓存
      let localOrder = wx.getStorageSync('allToDingdan');
      orderToken = localOrder.orderToken;
      bigorderCode = localOrder.bigorderCode;
    }
    app.gioTrack('flow_orderdetail_1', {order_id: bigorderCode})
    let param = { orderToken, bigorderCode };
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    orderDetail(param).then(res => {
      let hasNotRefund = false;
      let { showRefund, showExpress, footer_isShow, payment, isCome } = this.data;
      if (res.orderType === 'CUSTOM') {
        res.goodsOrderList.forEach(item => {
          item.price = item.price.toFixed(2);
          item.refundCount !== 1 ? hasNotRefund = true : '';
          item.goodsImg = cdn + item.gscolPicPath;
        });
      } else {
        res.goodsOrderList.forEach(item => {
          item.price = item.price.toFixed(2);
          if (item.refundCount !== 1) {
            hasNotRefund = true
          } else {
            if (item.goodsStatus === 'TransactionClose') {
              item.refundText = '退款成功';
            } else {
              item.refundText = `退${item.refundCount}件`
            }
          }
          let skuToImgParam = {
            sku: item.gcsSku,
            size: URL_CDN.IMGSIZE240400
          };
          item.goodsImg = cdn + skuToImg(skuToImgParam);
          item.showRefundBtn = true;
          // 签收日前
          const shipmentTime = item.updateFinishTime || item.finishTime;
          if(shipmentTime){
            const shipmentTimeSatamp = new Date( shipmentTime.replace(/-/g, '/')).getTime();
            // 签收7日不可退款
            if(dateIsOverDue(shipmentTimeSatamp, 7)){
              item.showRefundBtn = false;
              console.log(item.showRefundBtn)
            }
          }
        });
      }
      let canRefund = res.canRefund;
      let isSevenRPrd = (hasNotRefund && canRefund === 'Y');
      // isSplitOrder 默认1：0不拆-不退，1：拆
      let derivedFromExchangeOrder = res.exchangeCode ? true : wxData.derivedFromExchangeOrder;
      let createTime = Date.parse(res.createTime.replace(/-/g, '/'));
      let { cancelOrderCountDown } = this.data;
      cancelOrderCountDown = cancelOrderCountDown - Math.ceil((Date.now() - createTime) / 1000);
      if (Date.now() - createTime < countTime * 1000) {
        let countDown = setInterval(() => {
          cancelOrderCountDown--;
          this.setData({ cancelOrderCountDown });
          if (cancelOrderCountDown < 0) {
            this.setData({
              cancelOrder: false
            });
            clearInterval(countDown);
          }
        }, 1000)
      } else {
        this.setData({
          cancelOrder: false
        })
      }
      const {status, haveReview} = res;
      if((status === 'WaitingReceive' || status === 'TransactionSuccess' || status === 'TransactionClose') && haveReview === 'N'){
        this.setData({showRating: true})
      }
      if (status === 'WaitingShipment' || status === 'WaitingReceive' || status === 'TransactionSuccess') {
        showExpress = true;
      } else {
        showRefund = false;
      }
      if (status === 'TransactionCancel' || res.isHaveRefund + '' === '2') {
        footer_isShow = false;
      } else {
        if (status === 'WaitingPay') {
          footer_isShow = true;
          payment = false
        } else if (status === 'WaitingShipment') {
          footer_isShow = true;
          payment = true;
          isCome = false;
        } else if (status === 'WaitingReceive') {
          footer_isShow = true;
          payment = true;
          isCome = true;
        }
      }

      const goodsList = res.goodsOrderList;
      const expressInfo = res.expressPoList;
      if (expressInfo && expressInfo.length) {
        expressInfo.forEach(expressItem => {
          goodsList.forEach(item => {
            if (expressItem.goodsOrderId === item.goodsId) {
              item.showExpressBtn = true;
              item.expressInfo = expressItem;
            }
          });
        });
      }
      if (res.payPrice <= 0.01 ||
        res.orderType === 'PRESELL' ||
        res.orderType === 'CUSTOM' ||
        res.isSplitOrder === 0 ||
        (res.pDescription && res.pDescription.includes('内购'))) {
        // 一分钱， 预售，定制不显示退货 FOL童装1.7折 5月之后可删
        showRefund = false
      }
      // 微信立减金
      res.myUseWXCouponValue = jianfa(res.payPrice, res.wxCouponValueTotal || 0)
      this.setData({
        isSevenRPrd: isSevenRPrd, //gzl
        prevDingdanStatus: status,
        dingdanStatus: true,
        dingdanCon: res,
        isWxReductionOrder: Number(res.wxCouponValueTotal) > 0,
        footer_isShow,
        payment,
        isCome,
        showExpress,
        showRefund,
        derivedFromExchangeOrder,
        itemId: getNineSku(res.goodsOrderList[0].gcsSku),
      });

      if (status === 'WaitingPay' && curOption.utmSource) {
        let collectParam = Object.assign(curOption, {
          eventName: '催付款',
          orderCode: res.bigorderCode,
          viewTime: formatCurTime(),
          orderPrice: res.payPrice,
        });
        app._collectData2(collectParam);
      }
      wx.hideLoading()
    }).then(() => {
      this.storedValueCard();
    }).catch(err => wxShowToast(err.message))
  },
  //查看物流信息
  lookWuliu: function (e) {
    var dingdan_code = '';
    const { dingdanCon } = this.data;
    var _expressPoList = dingdanCon.expressPoList;
    var _goodsid = e.currentTarget.dataset.goodsid;
    for (let i = 0; i < _expressPoList.length; i++) {
      if (_expressPoList[i].goodsOrderId == _goodsid) {
        dingdan_code = _expressPoList[i].expressOrderNo;
        wx.setStorageSync(KEYSTORAGE.expressInfo, Object.assign(_expressPoList[i], {
          bigorderCode: dingdanCon.bigorderCode
        }))
      }
    }
    if (dingdan_code) {
      wx.navigateTo({
        url: `../lookDdAdress/lookDdAdress?dingdan_code=${dingdan_code}`
      });
    }
  },

  //查看地图
  lookDitu: function (e) {
    var jingweidu = this.data.dingdanCon;
    console.log('this.data.dingdanCon=', this.data.dingdanCon)
    wx.openLocation({
      longitude: Number(jingweidu.bigOrderStore.latitude),
      latitude: Number(jingweidu.bigOrderStore.longitude),
      address: jingweidu.bigOrderStore.address,
      name: jingweidu.bigOrderStore.name
    });
    return false;
  },
  //取消订单
  quxiao: function (e) {
    console.log(">>>>>>", this.data.dingdanCon);
    var that = this;
    const { orderToken, bigorderCode, payIntegral = '', payPrice = '' } = this.data.dingdanCon;
    app.saveFormIdFn(e.detail.formId);

    //提示框
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          var _vip_phone = wx.getStorageSync('user_info');
          if (_vip_phone.phone) {
            const param = {
              bigorderCode,
              orderToken,
              type: 2,
            };
            confirmOrder(param).then(res => {
              // 一分钱活动用
              wx.setStorageSync('aPennyReplace', true);
              wxShowToast('成功取消该订单');
              that.setData({
                'dingdanCon.status': 'TransactionCancel',
                'prevDingdanStatus': 'TransactionCancel',
                'footer_isShow': false
              });
              app.wxPaymentReport(bigorderCode, 'cancel_give_order', payPrice);
              events.post(true, EVENTS.EVENT_OREDERCOUNT);
            }).catch(err => wxShowToast(err.message));
            try {
              app.tdSdkEvent('flow_purchase_order_pay_fail_orderdetail_orderdelete_7bab', {
                ORDER_ID: bigorderCode,
                ORDER_PAY: payPrice
              })
              app.gioTrack('flow_purchase_order_pay_fail_orderdetail_orderdlt', {
                order_id: bigorderCode
              })
            } catch (e) {}
          } else {
            wx.showModal({
              title: '提示',
              content: '您还不是我们的会员，不能使用活动券功能',
              showCancel: false
            });
            return;
          };

        } else if (res.cancel) {
        }
      }
    });
  },


  //立即支付
  zhifu: function (e) {
    let {dingdanCon, storedValueCardPay} = this.data;
    let {id, bigorderCode, orderToken, payToken, payTokenTime, goodsOrderList = []} = dingdanCon;
    let amountPaid = dingdanCon.payPrice;
    if (dingdanCon.orderType && dingdanCon.orderType == "EXCHANGE") {
      amountPaid = dingdanCon.exchangeAdditionalPrice;
      let intentType = "fromOrderDetail";
      let querystring = `id=${id}&bigorderCode=${bigorderCode}&orderToken=${orderToken}&payToken=${payToken}&payTokenTime=${payTokenTime}&amountPaid=${amountPaid}&intentType=${intentType}`;
      console.log("............querystring ===" + querystring);
      wx.navigateTo({
        url: '../wxPay/wxPay?' + querystring
      });
      return;
    }
    try {
      app.tdSdkEvent('flow_purchase_order_pay_fail_orderdetail_paynow_7baa', {
        ORDER_ID: bigorderCode,
        ORDER_PAY: amountPaid
      })
      app.gioTrack('flow_purchase_order_pay_fail_orderdetail_paynow', {
        order_id: bigorderCode
      })
    } catch (e) {

    }
    if (this.data.isPintuan) {
      wx.setStorageSync('isPintuan', true)
      let querystring = `id=${id}&bigorderCode=${bigorderCode}&orderToken=${orderToken}&payToken=${payToken}&payTokenTime=${payTokenTime}&amountPaid=${amountPaid}&sku=${dingdanCon.goodsOrderList[0].gcsSku.substring(0, 12)}`;
      // 拼团订单参数封装
      let json = dingdanCon
      wx.setStorageSync('isPintuan', true)
      let orderData = {
        bigorderCode: json.pintuanOrderPerson || '',
        bigOrderId: json.id,
        orderToken: json.orderToken
      }
      wx.setStorageSync('orderData', orderData)
      if (json.pintuanOrderType == '1') {
        let detailData = {
          imageUrl: `${cdn}${json.goodsOrderList[0].gscolPicPath}`,
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

      wx.hideLoading();
      wx.navigateTo({
        url: '../wxPay/wxPay?' + querystring
      });
      return
    }
    const param = { bigorderCode, payToken,  payTokenTime, };
    const paramString = { orderToken, bigorderCode, id };
    try {
      app.tdSdkEvent('flow_purchase_order_paynow_4', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: amountPaid || ''
      })
    } catch (e) { }
    if (dingdanCon.channelId !== CHANNEL_ID) {
      wx.showModal({
        title: '提示',
        content: '您已在其他平台发起过支付，该单不能支付',
        showCancel: false,
        success(res) {
          if (res.confirm) { }
        }
      });
      return;
    }
    wx.showLoading({
      title: '加载中...'
    })
    payment(param).then(res => {
      wx.hideLoading();
      if (res) {
        wxRequestPayment(res).then(payRes => {
          if (payRes) {
            this.wxPayCon(paramString);
          }
        });
      }
    }).catch(err => wxShowToast(err.message))
  },
  wxPayCon(paramString){
    wx.navigateTo({
      url: '../wxPayCon/wxPayCon' + objToQuery(paramString)
    });
  },
  // 获取储值卡信息
  async storedValueCard(){
    const { memberno } = wx.getStorageSync(KEYSTORAGE.crmInfo)
    const res = await storedValueCard(memberno);
    if(res && res.total_balance){
      this.setData({
        totalBalance: res.total_balance
      })
    }
  },
  async storedValueCardPay(){
    const {totalBalance, dingdanCon} = this.data;
    let {  bigorderCode = '', orderToken, id, payPrice } = dingdanCon;
    if(payPrice > totalBalance){
      wxShowToast('储值卡余额不足');
      return
    }
    try {
      wx.showLoading({
        title: '加载中...'
      })
      const payRes = svCardPayByOrderCode(bigorderCode)
      wx.hideLoading();
      if(payRes){
        const paramString = { orderToken, bigorderCode, id };
        this.wxPayCon(paramString);
      }
    }catch (err){
      wxShowToast(err.message)
    }
  },
  //提醒发货
  cuidan: function (e) {
    let { bigorderCode = '', orderToken, payPrice = '', warning } = this.data.dingdanCon;
    try {
      app.tdSdkEvent('flow_purchase_order_pay_success_orderdetail_shipreminder_7aaa', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      })
      app.gioTrack('flow_purchase_order_pay_success_orderdetail_remind', {
        order_id: bigorderCode
      })
    } catch (e) { }
    if (warning === 'Y') {
      wxShowToast('已提醒发货');
      return;
    }
    //提醒发货接口
    this.confirmOrderAll(3).then(res => {
      this.setData({
        'dingdanCon.warning': 'Y'
      })
    });
  },
  confirmOrderAll(type) {
    const { orderToken, bigorderCode } = this.data.dingdanCon;
    const param = {
      orderToken,
      bigorderCode,
      type
    };
    //  1:确认,2:取消,3:提醒发货
    const titleType = ['确认收货成功', '取消成功！', '已经提醒商家发货'];
    return new Promise(((resolve, reject) => {
      confirmOrder(param).then(res => {
        wxShowToast(titleType[type - 1]);
        resolve(res);
      }).catch(err => wxShowToast(err.message))
    }));

  },
  //确认收货
  Shouhuo: function (e) {
    const that = this;
    //提示框
    wx.showModal({
      title: '提示',
      content: '确认收货吗？',
      success: function (res) {
        if (res.confirm) {
          //确认收货接口
          that.confirmOrderAll(1).then(res => {
            that.setData({
              'dingdanCon.status': 'TransactionSuccess',
              'prevDingdanStatus': 'TransactionSuccess',
              'footer_isShow': false
            });
          });
        } else if (res.cancel) {
        }
      }
    });

  },

  //申请退款
  tuikuan: function (e) {
    app.gioTrack('pageclick_return', {
      orderId: this.data.dingdanCon.bigorderCode
    })
    app.gioTrack('flow_purchase_order_pay_success_orderdetail_return', {
      order_id:this.data.dingdanCon.bigorderCode
    })
    if (!wx.getStorageSync('wxSubscriptions').isRefund) {
      wxSubscription("refund").then(res => {
        this.tuikuanOption()
      }).catch(err => {
        this.tuikuanOption()
      });
    } else {
      this.tuikuanOption()
    }
  },

  //申请退款
  tuikuanOption: function (e) {
    const { dingdanCon } = this.data;
    try {
      app.tdSdkEvent('flow_purchase_order_pay_success_orderdetail_return_7aab', {
        ORDER_ID: dingdanCon.bigorderCode || '',
        ORDER_PAY: dingdanCon.payPrice || ''
      })
    } catch (e) { }
    // isHaveRefund : 0:无，1，有，2，全退
    if (dingdanCon.isHaveRefund === 2) {
      wx.showModal({
        title: '提示',
        content: '该笔订单已申请全部退款，不可再次退款',
        showCancel: false
      });
    } else {
      const isExchangeOrder = dingdanCon.goodsOrderList.some(item => item.exchangeCount >= 1);
      if(isExchangeOrder){
        wxShowToast('换货单不可退款');
        return
      }
      if (this.data.isPintuan) {
        wx.setStorageSync('isPintuan', true)
      }
      wx.navigateTo({
        url: '../dingdanToTui/dingdanToTui'
      });
    };
  },
  initRefundAddress() {
    const refundAddress = app.config.refundAddress;
    let { returnGoodsAddressList } = this.data;
    if (returnGoodsAddressList.length) {
      this.setData({
        showReturnGoods: true,
      });
      return;
    }
    let splitMark = refundAddress.includes(',') ? ',' : '，';
    refundAddress.split(splitMark).forEach(item => {
      returnGoodsAddressList.push({
        text: item,
        list: item.split('：'),
      })
    });
    this.setData({
      returnGoodsAddressList,
    })
  },
  //退货地址
  tuihuodizhi: function (e) {
    this.setData({
      showReturnGoods: true,
    })
  },
  copy(e) {
    const text = e.currentTarget.dataset.text || app.config.refundAddress;
    wxCopyText(text);
  },
  hidePopup() {
    this.setData({
      showReturnGoods: false,
    })
  },


  //上传退款单号+物流名称 - 弹出输入框
  submitCode: function (e) {
    this.setData({
      submitDanhao: true,
      danhao_name: '',
      danhao_name_tishi: false,
      danhao_number: '',
      danhao_tishi: false
    });
  },

  //输入物流名称
  nameInput: function (e) {
    danhao_name = e.detail.value;
    if (!REGEXP.CHINESE_LETTER.test(danhao_name)) {
      wxShowToast('填写正确的快递单号，请重新输入');
      danhao_name = '';
      this.setData({
        danhao_name: ''
      });
      return;
    }
    this.setData({
      danhao_name: danhao_name
    });
    if (danhao_name !== '') {
      this.setData({
        danhao_name_tishi: false
      });
    }
  },

  //输入快递单号
  numberInput: function (e) {
    danhao_value = e.detail.value;
    if (!REGEXP.NUMBER_LETTER.test(danhao_value)) {
      wxShowToast('填写正确的快递单号，请重新输入');
      danhao_value = '';
      this.setData({
        danhao_number: ''
      });
      return
    }
    this.setData({
      danhao_number: danhao_value
    });
    if (danhao_value !== '') {
      this.setData({
        danhao_tishi: false
      });
    }
  },

  //取消上传快递单号
  danhao_false: function (e) {
    this.setData({
      submitDanhao: false
    });
  },

  //确定上传快递单号
  danhao_true: function (e) {
    var that = this;
    if (danhao_name == '') {
      that.setData({
        danhao_name_tishi: true
      });
    };
    if (danhao_value == '') {
      that.setData({
        danhao_tishi: true
      });
    } else {
      //上传快递单号
      wx.showLoading({
        title: '上传中...',
      });
      const { refundCode, oriorderCode } = this.data.tuihuoCon;
      const param = {
        refundCode,
        oriorderCode,
        waybillNum: danhao_value,
        expressCompany: danhao_name
      };
      submitWayBill(param).then(res => {
        if (res) {
          this.setData({
            submitDanhao: false
          });
          wx.redirectTo({
            url: '/order/refundDetail/refundDetail?type=express',
            success() {
              wx.hideLoading();
            }
          });
        }
      }).catch(err => wxShowToast(err.message));
    }
  },


  //确认到店退货
  onConfirmToShopRefundClick: function () {
    let { tuihuoCon, refundShopInfos } = this.data;
    this.setData({
      toShop: false,
      yesShop: true
    });
    const { refundCode, oriorderCode } = tuihuoCon;
    const { address, distance, latitude, name, businessHours, longitude, phone1, storeCode = '' } = refundShopInfos;
    const param = {
      refundCode, oriorderCode,
      brandCode: brand,
      storeAddress: address,
      storeDistance: distance,
      storeLatitude: latitude,
      storeName: name,
      storeBusinessHours: businessHours,
      storeLongitude: longitude,
      storePhone: phone1,
      storeCode
    };
    refundStoreApply(param).then(res => {
      if (res) {
        wx.showModal({
          title: '提示',
          content: '到店退货成功，请您及时到店退货',
          showCancel: false
        });
        this.getRefundDetail(tuihuoCon.refundCode)
      }
    }).catch(err => {
      wx.showModal({
        title: '提示',
        content: '到店退货失败，请您联系客服',
        showCancel: false
      });
    });
  },
  //取消退货
  noShop: function () {
    wx.switchTab({
      url: '/pages/memberCenter/memberCenter'
    })
  },
  //查看选择店铺信息里的 查看地图
  lookMap: function (e) {
    let { longitude, latitude, address, name } = e.currentTarget.dataset;

    // longitude = Number(longitude);
    // latitude = Number(latitude);
    wx.openLocation({
      longitude: Number(longitude),
      latitude: Number(latitude),
      address: address,
      name: name
    });
  },

  submitTuiKuan: function () {
    if (this.data.isPintuan) {
      wx.setStorageSync('isPintuan', true)
    }
    wx.navigateTo({
      url: '../dingdanToTui/dingdanToTui'
    });
  },

  gotoExchange: function (e) {
    let orderBean = JSON.stringify(this.data.dingdanCon);
    let exPath = `exchangeGoods`
    wx.navigateTo({
      url: `/${exPath}/applyForExchange/applyForExchange?orderBean=${orderBean}`
    });
  },
  //复制订单号
  onClick: function (e) {
    let {text} = e.currentTarget.dataset;
    wxCopyText(text);
    app.gioTrack('pageclick_return_copyorder', {
      orderId: text
    })
  }

})
