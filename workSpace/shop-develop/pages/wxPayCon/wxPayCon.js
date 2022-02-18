import {getPopupVoucher} from "../../service/mini";
import {fileIsExist} from "../../service/init";
import { URL_CDN, KEYSTORAGE, EVENTS } from '../../src/const';
import { orderDetail, voucherForReturn, voucherForReturnJson,awardActivity } from '../../service/order'
import { wxUserActions} from '../../service/collect.js'
import { getCouponStatus, sendNewUsercoupon } from '../../service/coupon'
import events from '../../src/events';
const Util = require('../../utils/utils.js');
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
var loadDingdanNums = 0;
var order_state = '';
var timer = null;
let requestAgain = 0;
const JLBrand = 'JLINDEBERG';
let orderPayPrice = 0;
let isWeMallOrder = false;
let orderType = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    headerTitle: '您的订单未完成',
    description: '我们将会在第一时间响应您的订单',
    headerImg: URL_CDN.STATUS_ORDER_NO,

    payCon : {},
    wrap : 'none',
    activity: [],
    sendVoucher:{
      showVip: false,
      cardImg: '',
      voucherInfo:{
        couponCode: '',
        couponId: ''
      }
    },
    // 电影票
    cinema: {},
    // 视频卡
    qqVipData: {},
    voucherItem:{
      couponno: '',
      promid: ''
    },
    // zpImg: Util.splitImg('zpBanner.jpg','FOL'),
    zpImg:'',
    zpLink:'',
    zpNums:'',
    shareZan: {
      isShow: false,
      appId:app.config.aiShowAppid,
      path: '/pages/index/index',
      imgUrl: URL_CDN.SHOWGETIWATCH
    },
    customer: {
      wxName: '',
      imgUrl: Util.splitImg('customer_qrCode.jpg')
    },
    activeList: [],
    guideQRImg: '',
    projeckName:  app.config.brand === 'SELECTED' ? 'borda-gender':'orderFinishPage',
    itemId: '',
    isNewUser: false,
    newUserImage: Util.splitImg("newUser_coupon.png"),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getAwardActivity(0)
    /*options = {
      id: '2088232',
      orderToken: '99fe56f39105c0a958e29d640d677dfa',
      bigOrderCode: '41320190514112228268'
    };*/
    //页面标题
    wx.setNavigationBarTitle({ title: getApp().config.title });
    this.setData({
      payCon : options
    });
    wx.showLoading({title: '加载中'});
    this.getWebSocketOrder()
    app.track();
  },
  copySuccess(data){
    app.gioTrack('pageclick_order_copyorder', {
      order_Id: data.detail
    })
  },
  getWebSocketOrder: function(){
    app.wxWebSocket().then(res => {
      if(typeof res === 'string'){
        let resObj = JSON.parse(res);
        if(resObj && resObj.order && resObj.order.payPrice){
          orderPayPrice = resObj.order.payPrice;
          if(resObj && resObj.VIDEO_CARD){
            // 视频卡
            if(typeof resObj.VIDEO_CARD === 'string'){
              return JSON.parse(resObj.VIDEO_CARD)
            }else if(typeof resObj.VIDEO_CARD === 'object'){
              return resObj.VIDEO_CARD
            }
          }
        }
      }else if (typeof res === 'object'){
        if(typeof res.VIDEO_CARD === 'string'){
          return JSON.parse(res.VIDEO_CARD)
        }else if(typeof res.VIDEO_CARD === 'object'){
          return res.VIDEO_CARD
        }
      }
    }).then(videoRes => {
      // videoRes = {"code":0,"msg":"OK","data":[{"attend":"N","promotion":"4CR11903664","coupNum":"1-6157444485","videoType":"月卡"},{"attend":"N","promotion":"4CR11903679","coupNum":"1-6131436976","videoType":"电影票"}]}
      console.log(videoRes,'****')
      if(videoRes && videoRes.code === 0){
        let videoData = videoRes.data;
        this.getAwardActivity(videoData);
      }
    })
  },
  // 获取订单详情
  getOrderDetail: function(){
    let wxPayCon =this.data.payCon;
    let params = {
      // bigOrderId: wxPayCon.id,
      bigorderCode: wxPayCon.bigOrderCode || wxPayCon.bigorderCode || '',
      orderToken: wxPayCon.orderToken
    };
    orderDetail( params ).then( res => {
      let goodsOrderList = [];
      if(res.goodsOrderList.length > 0){
        goodsOrderList = res.goodsOrderList;
        goodsOrderList.forEach(item => {
          item.price = item.price.toFixed(2);
        })
      }
      orderPayPrice = res.payPrice;
      res.payPrice = res.payPrice.toFixed(2);
      res.createTime = Util.getdate(res.createTime);
      wx.hideLoading();
      let header = {};
      //如果订单状态为 “待支付”，每3秒刷新订单状态
      //res.status = 'WaitingShipment'
      if(res.status === 'WaitingPay'){
        order_state = 'WaitingPay';
        app.tdSdkEvent('flow_purchase_order_pay_fail_5b', {
          ORDER_ID: res.bigorderCode || '',
          ORDER_PAY: res.payPrice
        });
        app.gioTrack('flow_purchase_order_pay_fail_5b', {
          payTime: res.paymentTime,
          payMethod: res.payWay === 'SVCardPay' ? '储值卡' : '微信',
          order_id: res.bigorderCode,
          order_amount: res.payPrice,
          ship_price: res.expressFare,
          num: res.goodsTotalCount
        })
        header = {
          headerTitle: '您的订单未完成',
          description: '我们将会在第一时间响应您的订单',
          headerImg: URL_CDN.STATUS_ORDER_NO
        };
        /*timer = setInterval( ()=> {
          loadDingdanNums +=1;
          loadDingdanNums >= 3 ? clearInterval(timer) : this.getOrderDetail()
        }, 3000)*/
      }else{
        //-----------==========if订单支付满299即可抽奖===========------------
          this.setData({
              zpNums: res.bigorderCode
          });
        if(res.shareBy){
          isWeMallOrder = true;
          orderType = 1;
        }else if(res.shopguideId){
          orderType = 2
        }else{
          orderType = 0
        }
        this.getAwardActivity()
        if(brand === 'JACKJONES' && res.ruleId){
          this.newCustomerCoupon(res.bigorderCode, res.ruleId)
        }
        //-----------==========if订单支付满299即可抽奖===========------------over
        this.shareZan();
        header = {
          headerTitle: '您的订单已完成',
          description: '我们将会在第一时间响应您的订单',
          headerImg: URL_CDN.STATUS_ORDER_OK,
        };
        // 微信用户行为 勿删 暂不开放
        // this._wxUserAction(res.goodsOrderList);
        // this.deleteCartGoods();
        // this.paySuccess(res);
        try {
          app.tdSdkEvent('flow_purchase_order_pay_success_5a', {
            ORDER_ID: res.bigorderCode || '',
            ORDER_PAY: res.payPrice || ''
          });
          // 埋点重复
          app.gioTrack('flow_purchase_order_pay_success_5a', {
            payTime: res.paymentTime,
            payMethod: res.payWay === 'SVCardPay' ? '储值卡' : '微信',
            order_id: res.bigorderCode,
            order_amount: res.payPrice,
            ship_price: res.expressFare,
            num: res.goodsTotalCount,
            commodity_number: goodsOrderList.length,
            ifUseCoupon: res.couponNo ? '是' : '否',
          })
        }catch (e) {}
        // clearInterval(timer);
        this.deleteCartGoods();
      }
      this.setData({
        payCon: res,
        wrap: 'block',
        headerTitle: header.headerTitle,
        description: header.description,
        headerImg: header.headerImg,
        itemId: Util.getNineSku(goodsOrderList[0].gcsSku),
      });
      const guideQRImg = (app.config.guidePathQR && isWeMallOrder) ? `${cdn}${app.config.guidePathQR}${res.shareBy}.jpg` : '';
      fileIsExist(guideQRImg).then(res => {
        if(res){
          this.setData({guideQRImg});
        }
      });
      events.post(true, EVENTS.EVENT_OREDERCOUNT);
    }).catch(e => {
      wx.showToast({
        title: e.message
      })
    })
  },

  paySuccess: function(orderDetail){
    let param = {eventName: '支付完成', orderCode: orderDetail.bigorderCode};
    app._collectData2(param);
    if(orderDetail.status === 'WaitingPay'){
      return;
    }
    /*orderDetail.shareBy = "DA00423946";
    orderDetail.shareByShop = "0000";*/
    if(!orderDetail.shareBy || !orderDetail.shareByShop){
      return
    }
    const CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    if(orderDetail.status === 'WaitingShipment'){
      let collectParam = {eventName: '发送视频卡', orderCode: orderDetail.bigorderCode};
      app._collectData2(collectParam);
      let param = {
        orderNum: orderDetail.bigorderCode, // 订单小票号:21420171115180930038
        crmChannel: app.config.channel,
        phone: CRMInfo.phone || '',
        sinceLift:"否",  // 是否自提
        sinceReturn:"否", //是否自提退货
        payWay:"WXPay",   // 支付方式
        orderDiscount:"1", // 折扣
        orderQuantity: orderDetail.goodsTotalCount, // 件数
        orderAmount: orderDetail.payPrice, // 订单金额
        parameter1: orderDetail.shareBy || '',  // 导购号，非必填
        storeNum: orderDetail.shareByShop || '',
        parameter2:"",
        parameter3:"",
        parameter4:"",
        parameter5:"",
        lineMsg:[
          {
            orderNum: "",
            prodNum: "",
            lineAmount: "",
            lineDiscount: "",
            lineQuantity: "",
            parameter1:"",
            parameter2:"",
            parameter3:"",
            parameter4:"",
            parameter5:"",
          },
          {
            orderNum: "",
            prodNum: "",
            lineAmount: "",
            lineDiscount: "",
            lineQuantity: "",
            parameter1:"",
            parameter2:"",
            parameter3:"",
            parameter4:"",
            parameter5:"",
          }
        ]
      };
      voucherForReturnJson().then( resJson => {
        if(resJson[brand] && resJson[brand].effect){
          voucherForReturn(param).then(res => {
            // 请求JSON文件
            let voucherItem = this.data.voucherItem;
            let sendVoucher = this.data.sendVoucher;
            let curBranJson = resJson[brand];
            let cinemaTicket = curBranJson.cinemaTicket;
            if(Array.isArray(res)){
              res.forEach(item => {
                // 卡的类型
                this.isGetQQVip(curBranJson, item, orderDetail.payPrice);
                this.isCinema(cinemaTicket, item)
              });
            }else{
              this.isGetQQVip(curBranJson, res, orderDetail.payPrice);
              this.isCinema(cinemaTicket, res)
            }
          }).catch(err => {
            console.log(err);
          })
        }
      })
    }
  },
  isGetQQVip: function(curBranJson, item, payPrice){
    let qqVipData = this.data.qqVipData;
    if(qqVipData.couponId){
      return;
    }
    let cardImg = '';
    let linkUrl = '';
    let qqVip = curBranJson.qqVip;
    let promotion = item.promotion;
    if(item.promotion){
      if(qqVip.month.promotion === promotion){
        cardImg = qqVip.month.cardImg;
        linkUrl = qqVip.month.linkUrl;
      }else if(qqVip.season.promotion === promotion){
        cardImg = qqVip.season.cardImg;
        linkUrl = qqVip.season.linkUrl;
      }else if(qqVip.year.promotion === promotion){
        cardImg = qqVip.year.cardImg;
        linkUrl = qqVip.year.linkUrl;
      }
      !linkUrl ? linkUrl = curBranJson.linkUrl : '';
      qqVipData = {
        cardImg,
        linkUrl,
        couponCode: item.coupNum || '',
        couponId: item.promotion || '',
      };
      this.setData({qqVipData})
    }
  },
  // 电影票判断
  isCinema: function(json, item){
    let cinema = this.data.cinema;
    if(cinema.couponId){
      return;
    }
    // 第二种活动
    if(json && json.promotion){
      if(item && item.promotion && item.promotion === json.promotion){
        cinema = {
          couponCode: item.coupNum,
          couponId: item.promotion,
          linkUrl: json.linkUrl,
          cardImg: json.cardImg
        };
        this.setData({cinema})
      }
    }
  },
  tdSdkEvent: function(eventName, orderId, payPrice){
    try {
      app.tdsdk.event({
        id: eventName,
        label: '',
        params: {
          key: `订单id:${orderId}支付金额: ${payPrice}`,
          value: `订单id:${orderId}支付金额: ${payPrice}`,
        }
      });
    }catch (e) {

    }
  },
  // 集赞小程序
  shareZan: function(){
    getPopupVoucher().then(res => {
      let curData = res[brand];
      if(curData && curData.showShareZan){
        let shareZan = this.data.shareZan;
        shareZan = {
          isShow: curData.showShareZan,
          appId: curData.appId,
          path: curData.appId.path,
          imgUrl: curData.shareZanOrderCompleteImgUrl
        };
        this.setData({shareZan});
      }
    }).catch(err => {
      console.log(err.msg)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    loadDingdanNums = 0;
    let _wxPayCon = this.data.payCon;
    wx.setStorageSync('allToDingdan', _wxPayCon);
    wx.setStorageSync('isTuihuo', false);
  },
  onReady: function(){
    this.getOrderDetail();
  },
  onClick: function(e) {
    let dataType = e.currentTarget.dataset.type;
    switch (dataType){
      case 'copy':
        this.copyOrderNum(e);
        break;
      case 'saveImg':
        this.isAuthor(e);
        break;
      case 'copyName':
        this.copyNameFn();
        break;
      case 'video':
        this.openImgCar(e);
        break;
      case 'close':
        this.setData({
          isNewUser: false
        })
        break;
    }
  },
  //检查授权
  isAuthor: function(e){
    const {url, link} = e.currentTarget.dataset;
    if(link){
      app.navigateTo(link);
      return
    }
    if(url){
      app.saveImage(url);
    }
  },

  copyNameFn: function(){
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
  openImgCar: function(e){
    let index = e.currentTarget.dataset.index;
    let imgCardInfo = this.data.activeList[index];
    wx.setStorageSync("zpId", this.data.zpNums);
    if(imgCardInfo.linkUrl && imgCardInfo.linkUrl !== '0'){
      app.navigateTo(imgCardInfo.linkUrl)
    }else {
      if(imgCardInfo.couponCode){
        this.openVoucherCard(imgCardInfo)
      }
    }
  },
  // 打开卡券
  openVoucherCard: function(voucherInfo){
    if(voucherInfo.couponCode && voucherInfo.couponId){
      let param = {
        couponCode: voucherInfo.couponCode,
        couponId: voucherInfo.couponId
      };
      getCouponStatus(param).then(res => {
        if(res.is_get_card){
          // 已领卡
          let carList = [{
            cardId: res.data.cardList[0].cardId,
            code: res.data.cardList[0].code
          }];
          app.openMemberCard(carList)
        }else{
          let cardItem = {};
          if(res.data.cardList[0].cardExt){
            cardItem = JSON.parse(res.data.cardList[0].cardExt)
          }
          let cardList = [{
            cardId: res.data.cardList[0].cardId,
            cardExt: res.data.cardList[0].cardExt
          }];
          wx.addCard({
            cardList,
            success: function (res) {
              let openCardList = [{
                cardId: cardItem.card_id,
                code: cardItem.code
              }];
              app.openMemberCard(openCardList);
            }
          })
        }
      }).catch(err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    }else{
      wx.showToast({
        title: '优惠券信息不完整',
        icon: 'none'
      })
    }
  },
  // 复制订单号
  copyOrderNum: function(e){
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success:res=>{
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        })
      }
    })

  },

  //继续逛逛
  toIndex(e){
    let { bigorderCode, payPrice, status} = this.data.payCon;
    //订单未完成
    try {
      debugger
      const eventName = status === 'WaitingPay' ? 'flow_purchase_order_pay_fail_seeothers_6bb' : 'flow_purchase_order_pay_success_seeothers_6ab'
      app.tdSdkEvent(eventName, {
        ORDER_ID: bigorderCode,
        ORDER_PAY: payPrice
      });
      app.gioTrack(eventName, {
        order_id: bigorderCode,
      })
    }catch (err){
      console.log(err)
    }
    app.goBack();
  },

  //查看订单
  toDingdan(e){
    let { bigorderCode, payPrice, status } = this.data.payCon;
    //订单未完成
    try {
      const eventName = status === 'WaitingPay' ? 'flow_purchase_order_pay_fail_orderdetail_6ba' : 'flow_purchase_order_pay_success_orderdetail_6aa'
      app.tdSdkEvent(eventName, {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      });
      app.gioTrack(eventName, {
        order_id: bigorderCode,
      })
      app.gioTrack('pageclick_order_check', {
        order_Id: bigorderCode
      })
    }catch (e) {}

    wx.redirectTo({
        url: `../dingdanToPay/dingdanToPay?bigorderCode=${bigorderCode}`
    });
  },
  // 微信用户行为“购买”
  _wxUserAction: function(param){
    let data = [];
    param.forEach(item => {
      data.push({
        action_type: 'PURCHASE',
        action_param: {
           'wx_order_id':'',
           'product_id': item.gcsSku,
           'industry_id':'',
           'product_name':item.goodsName,
           'original_price':Math.round(Number(item.originalPrice) * 100),
           'actual_price':Math.round(Number(item.price) * 100),
           'discount_price':Math.round((Number(item.originalPrice) - Number(item.price)) * 100),
           'quantity': item.goodsCount,
        }
      });
    });
    wxUserActions(data);
  },
  //支付成功之后调转盘是否显示接口
  getAwardActivity:function (videoData) {
    let data ={
      orderType,
      pageType:1,
      pageAddress: Util.getCurrentUrl()
    }
    awardActivity(data).then(res=>{

      let {activeList, customer} = this.data;
      let activeRes = [];
      // 筛选所有all的数据
      activeRes = res.filter(item => item.orderType === "ALL");
      let activeOther = [];
      // 判断是否是wemall订单
      if(isWeMallOrder){
          activeOther =  res.filter(item => item.orderType === "1");
      } else {
          activeOther =  res.filter(item => item.orderType === "0");
      }
      // 组合活动数据
      activeRes = activeRes.concat(activeOther);
      // 非绑定导购用户，弹出绑定导购二维码banner
      for(let item of activeRes){
        if(item.pageRule){
          if(!isWeMallOrder){
            customer = {
              wxName: item.pageRule,
              imgUrl: Util.judgeUrl(item.imgUrl),
              linkUrl: item.linkUrl
            };
            this.setData({customer});
            break;
          }
        }
      }
      if(activeRes && Array.isArray(activeRes) && activeRes.length){
        activeRes = activeRes.sort(Util.compareArr('orderPrice'));
        const priceArr = activeRes.filter(item => item.orderPrice > 0 );
        const zeroPriceArr = activeRes.filter(item => item.orderPrice <= 0 );
        if(priceArr.length){
          for(let item of priceArr){
            if(orderPayPrice >= item.orderPrice){
              activeList.push({
                linkUrl: item.linkUrl,
                imgUrl: item.imgUrl ? Util.judgeUrl(item.imgUrl) : '',
              });
              break
            }
          }
        }
      }
      this.setData({activeList});
    }).catch(err=>{

    })
  },
  handleActiveList: function(arr, videoItem, item){
    if(videoItem.promotion && videoItem.coupNum){
      arr.push({
        couponId: videoItem.promotion,
        couponCode: videoItem.coupNum,
        linkUrl: item.linkUrl,
        imgUrl: Util.judgeUrl(item.imgUrl)
      })
    }
  },

  // 删除购物车商品
  deleteCartGoods(){
    let orderGoods = wx.getStorageSync('dingdanCon');
    if(Array.isArray(orderGoods) && orderGoods.length){
      orderGoods.forEach((item, index) => {
        if(item.delId){
          let localCart = wx.getStorageSync(KEYSTORAGE.cartList);
          if(localCart.data && localCart.data.length){
            localCart.data = localCart.data.filter(cartItem => cartItem.id !== item.delId);
            wx.setStorageSync(KEYSTORAGE.cartList, localCart);
            app.changeLocalCart(localCart.data.length)
          }
        }
      })
    }
  },

  newCustomerCoupon(_orderId, _ruleId){
    let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    // 用户注册时间
    let userJoinDate = userInfo.joindate;
    let userJoinDateStr = new Date(userJoinDate.replace(/-/g, '/')).getTime()
    // 当天零点时间
    let startTime = '2021-06-29 00:00:00'
    let endTime=  '2021-06-30 23:59:59'
    let startTimeStr = new Date(startTime.replace(/-/g, '/')).getTime()
    let endTimeStr = new Date(endTime.replace(/-/g, '/')).getTime()
    if(userJoinDateStr < endTimeStr && userJoinDateStr > startTimeStr){
      let jsData = {
        bigOrderCode: _orderId,
        ruleId: _ruleId,
        phone: userInfo.phone
      }
      sendNewUsercoupon(jsData).then(res=>{
        this.setData({
          isNewUser: true
        })
      })
    }
  }
})
