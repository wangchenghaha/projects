import {newOrderSave,  getNewExpressFare} from "../../../service/order";
import {changePayStatus} from "../../../service/bargain";
import { payment, wxRequestPayment } from '../../../service/pay'
import {URL_CDN , KEYSTORAGE, EVENTS} from "../../../src/const";
import {skuToImg , jiafa, objToQuery, jianfa, toDecimal} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
import { wxSubscription } from '../../../utils/wxSubscribe';
import events from '../../../src/events'
var app = getApp();
const cdn = app.config.cdn;
let CRMInfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    dragainOrderInfo: '',
    address:'',
    goodsInfo:"",
    expressFare: '',
    bargainedPrice:'',
    payPrice: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //订阅登录事件
      events.register(this, EVENTS.EVENT_CRMINFO);
      CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      if(!CRMInfo.phone){
        app.getCRMInfoFn();
      }
      let dargain =  wx.getStorageSync("dargainOrder");
      console.log("dargain====", dargain)
      if(dargain){
        let goodsInfo = dargain.bargainGoodsDetail;
        let address = {
          consignee: dargain.consignee,
          contactTel: dargain.contactTel,
          province: dargain.province,
          city: dargain.city,
          area: dargain.area,
          detailAddress: dargain.detailAddress,
        }
        let skuToImgParam = {
          size: URL_CDN.IMGSIZE240400,
          sku: dargain.bargainGoodsDetail.sku.substring(0,12),
        };
        goodsInfo.picUrl = `${cdn}${skuToImg(skuToImgParam)}`;;
        let bargainedPrice = toDecimal(jianfa(dargain.goodsPrice, dargain.currentPrice))
        this._getExpress(dargain.currentPrice);
        this.setData({
          dragainOrderInfo: dargain,
          goodsInfo,
          address,
          bargainedPrice,
        })
       
      }
      

  },

  handleEvent: function(event, type){
    if(type === EVENTS.EVENT_CRMINFO){
      CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 新的计算邮费
 _getExpress: function(price){
  let expressParam = {
    expressMark: "SP",
    purchaseType: 0,
    sendingMode: 1,
    numberCourieres: 1,
  };
  getNewExpressFare(expressParam).then( res => {
    let expressFare = res.price || "0";
    this.setData({
      expressFare,
      payPrice: jiafa(price, expressFare)
    })
  });
},
  
  submitBtn: function(){
    if(!wx.getStorageSync('wxSubscriptions').isOrderPay){
      wxSubscription("orderPay").then(res => {
        this.formSubmit()
      }).catch(err => {
        this.formSubmit()
      });
    }else{
      this.formSubmit()
    }
  },

  formSubmit: function(){
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    // 微信广告用户行为信息
    const wxUserAction = wx.getStorageSync(KEYSTORAGE.wxUserAction);
    const chanId = wx.getStorageSync(KEYSTORAGE.chanId) || '';
    const data = this.data;
    const dargain = data.dragainOrderInfo;
    const goodsInfo = data.goodsInfo;
    const address = data.address;
    const expressFare = data.expressFare || 0;
    let goodsDetailList = [];
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku: dargain.bargainGoodsDetail.sku.substring(0,12),
    };
    goodsInfo.picUrl = skuToImg(skuToImgParam);
    let goodsDetail = {
      colorName: goodsInfo.colorName,
      gcsSku: goodsInfo.sku,
      goodsName: goodsInfo.goodsName,
      goodsCount:1,
      goodsColorCode: goodsInfo.sku.substring(0, 12),
      gscolPicPath: goodsInfo.picUrl,
      originalPrice: goodsInfo.originalPrice,
      sizeName: goodsInfo.sizeName,
      price: goodsInfo.floorPrice,
      isGift:"N"
    }
    let orderParams = {
      channelCode: app.config.channel,
      realSellPrice:dargain.currentPrice,
      payPrice:jiafa(dargain.currentPrice, expressFare),
      goodsTotalCount:1,
      gscPicmianId:"1",
      picUrl: goodsInfo.picUrl,
      province: address.province,
      city:address.city,
      area: address.area,
      detailAddress:address.detailAddress,
      contactTel: address.contactTel,
      consignee: address.consignee,
      crmId: CRMInfo.memberno || '',
      utmWxScene: wx.getStorageSync('scene') || '',
      expressFare: expressFare,
      unionid: wx.getStorageSync(KEYSTORAGE.unionid),
      customerNickname: wxInfo.nickName || '',
      customerFaceImg: wxInfo.avatarUrl || '',
      phone: CRMInfo.phone || '',
      openId: app.getOpenId(),
      activityId: dargain.id,
      orderType:'BARGAIN',
      originalTotalPrice: goodsInfo.originalPrice,
      bigOrderAppendix: {
        targetUrl: '',
        utmCampaign: '',
        utmMedium: '',
        utmSource: '',
        utmTerm: ''
      },
      //微信广告用户行为信息
      wxUserAction: {
        url: wxUserAction ? wxUserAction.url : '',
        clickId: wxUserAction ? wxUserAction.clickId : '',
      },
      // 微信订单来源渠道
      wxChanInfo: {
        chanId,
        chanReferAppId: chanId ? gygAPPid : '',
      },
      devFlag: '',
      goodsOrderList: goodsDetailList.concat(goodsDetail),
    }

    const device = wx.getSystemInfoSync().model || '';
	  const devFlag = wx.getStorageSync(KEYSTORAGE.devFlag);
	  const shareDevice = wx.getStorageSync(KEYSTORAGE.shareDevice);
	  let orderDevFlag = `设备型号：${device}`;
	  if(devFlag && devFlag === WX_WORK){
		  orderDevFlag += `_分享设备：${devFlag}`
	  }
	  if(shareDevice){
	  	orderDevFlag += `_${shareDevice}`
	  }
	  // 分享信息
    orderParams.devFlag = orderDevFlag;
    
    let daogouLists = wx.getStorageSync('daogouLists');
    if(daogouLists && daogouLists.length){
      let utmObj = {};
      daogouLists.forEach(item =>  utmObj[item.key] = item.value )
      Object.assign(orderParams.bigOrderAppendix, utmObj)
    }

    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    const {share_by, share_by_shop} = shareFrom;
    let orderSaveShare = {
      shareBy: share_by || '',
      shareByShop: share_by_shop || '',
    };
    let bigOrderAppendix = {targetUrl: wx.getStorageSync('targetUrl') || ''};
    if(daogouLists && daogouLists.length){
      daogouLists.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          bigOrderAppendix[item.key] = item.value;
        }
      })
    }
    orderParams.bigOrderAppendix = bigOrderAppendix;
    if(orderSaveShare.shareBy && orderSaveShare.shareByShop){
      orderParams.channelCode = 'WEMALL';
      orderParams.shareByTime = wx.getStorageSync('openShareTime') || Date.now();
      Object.assign(orderParams, orderSaveShare);
    }
    this._orderSave(orderParams);
  },

  _orderSave: function(params){
    wx.showLoading({
      title: '提交中',
      mask: true,
    });
    let that = this;
    newOrderSave(params).then(res =>{
      wx.hideLoading();
      if(res){
        let queryString = {
          id: res.id,
          bigorderCode: res.bigorderCode,
          payToken : res.payToken,
          payTokenTime : res.payTokenTime,
          orderToken: res.orderToken
        };
        return queryString;
      }else{
        wxShowToast('提交订单失败，请重试');
      }
    }).then(data=>{
      wx.hideLoading();
      let {id, bigorderCode, orderToken, payToken, payTokenTime} = data;

      let queryString ={
        bigorderCode,
        payToken,
        payTokenTime
      }

      let queryParam = {
        id,
        bigorderCode,
        orderToken
      }
      if(queryString){
        const dargain = that.data.dragainOrderInfo;
        changePayStatus(dargain.id).then(data =>{
          console.log(">>>>>>>>>>>>>>11111")
          payment(queryString).then(res => {
            console.log(res);
            if(res){
              wxRequestPayment(res).then(payRes => {
                if(payRes){
                  // errMsg: "requestPayment:fail cancel"
                  if(payRes.errMsg && payRes.errMsg.includes('fail')){
      
                  }else{
      
                  }
                  wx.navigateTo({
                    url: '../wxPayCon/wxPayCon' + objToQuery(queryParam)
                  });
                }
              });
            }
          }).catch(err => wxShowToast(err.message))
          // wx.navigateTo({
          //   url: `../../../pages/wxPay/wxPay${objToQuery(queryString)}`
          // });
        })
       
      }
    }).catch( e => {
      wx.hideLoading();
      wxShowToast(e.message);
    });
  }
})