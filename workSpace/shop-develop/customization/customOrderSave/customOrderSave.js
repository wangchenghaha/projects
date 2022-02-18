import {customizationOrderSave, getCustomizationlimitJson} from '../../service/customization'
import {newOrderSave} from '../../service/order'
import {getAddress} from '../../service/member'
import { wxShowToast } from "../../utils/wxMethods";
import {URL_CDN, KEYSTORAGE, REGEXP, EVENTS} from "../../src/const";
import { payment, wxRequestPayment } from '../../service/pay'
import { getCustomizationRule } from '../../service/customization'
import events from '../../src/events';
import { jiafa , objToQuery} from '../../utils/utils';
const app = getApp();
const {cdn, ORDER_TYPE} = app.config
let orderSaveParam = {}
let CRMInfo = {}
// 是否赠品
const IS_GIFT = 'Y';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    goodsInfo: [], 
    goodDetail: '',
    goodPrintInfo: '',
    goodsPic: '',
    markList: [],
    markPic: 'https://cdn.bestseller.com.cn/goodsImagePC/JACKJONES/218492501/218492501E40/7201280/218492501E40_p3.jpg',
    markName: '中秋印花图案卫衣',
    markNums: 1,
    costList: [
      {
        explain: "商品金额",
        price: 451,
        limitTime: false,
      },
       {
        explain: "运费",
        price: 0,
        limitTime: false,
      },
      {
        explain: "印刷服务费",
        price: 0,
        limitTime: false,
        limitTile: '',
        limitPrice: '',
      },
      {
        explain: "贴标费用",
        price: 0,
        limitTime: false,
        limitTile: '',
        limitPrice: '',
      }
    ],
    totlePrice: 0,
    originalPrice : 0,
    isShowAll: false,
    isChecked: false,
    isTimeInterval: false,
    rule: [],
    contentBotm: '本人已认真完整阅读并理解《“JACK & JONES定制服务”规则及同意书》的全部内容，并同意按照上述内容履行。'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
     //订阅登录事件
     events.register(this, EVENTS.EVENT_CRMINFO);
     this._getCustomizationlimitJson();
    
     this.getRule();
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
    // 获取地址信息每次进来请求
    this._getAddress();
  },

  handleEvent: function(event, type){
    if(type === EVENTS.EVENT_CRMINFO){
      CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      orderSaveParam.phone = CRMInfo.phone;
      // this.getRuleListBySku();
      // this.orderCouponList();
    }
  },

  _getCustomizationlimitJson: function(){
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    getCustomizationlimitJson().then(res => {
      wx.hideLoading();
      let isTimeInterval = this.TimeInterval(res.startTime, res.endTime);
      if(isTimeInterval){
       let costList = this.data.costList;
       costList[2].limitTime = isTimeInterval;
       costList[2].limitTile = res.drawTitle;
       costList[2].limitPrice = res.drawPrice;

       costList[3].limitTime = isTimeInterval;
       costList[3].limitTile = res.labeTitle;
       costList[3].limitPrice = res.labePrice;
       this.setData({
        costList,
        isTimeInterval
       })
      }
      this.showOrderInfo();
    }).catch(err =>{

    })
  },

  showOrderInfo: function(){
    let goodsInfo = wx.getStorageSync("dzRequstDatas");
    let markList = [];
    let costList = this.data.costList;
    // 商品价格
    costList[0].price = goodsInfo[0].price;
    // 打印价格
    costList[2].price = goodsInfo[1] ? ( goodsInfo[1].goodsName === "绘图" ? goodsInfo[1].price : 0) : 0;
    // 贴标列表
    for (let i = 0; i < goodsInfo.length; i++) {
      if(goodsInfo[i].goodsName === '贴标'){
        markList = markList.concat(goodsInfo[i]);
      }
    }

    console.log("markList ===", markList);
    // 计算贴标价格
    if(markList.length > 0){
      for (let i = 0; i < markList.length; i++) {
        markList.forEach((item) => {
          item.picUrl = cdn + item.gscolPicPath;
        });
        costList[3].price = jiafa(costList[3].price ,markList[i].price);
      }
    }

    if(this.data.isTimeInterval && goodsInfo[1]){
      for (let i = 1; i < goodsInfo.length; i++){
        goodsInfo[i].price = 0;
      }
    }

     // 计算总计价格
     let totlePrice = this.data.totlePrice;
     let originalPrice = this.data.originalPrice;
     for (let i = 0; i < goodsInfo.length; i++) {
         totlePrice = jiafa(totlePrice ,goodsInfo[i].price);
         originalPrice = jiafa(originalPrice ,goodsInfo[i].originalPrice);
     }
    this.setData({
      goodsInfo,
      goodDetail: goodsInfo[0],
      goodsPic: cdn + goodsInfo[0].gscolPicPath,
      goodPrintInfo: goodsInfo[1] ? ( goodsInfo[1].goodsName === "绘图" ?  goodsInfo[1] : '' ) : '',
      markList,
      costList,
      totlePrice,
      originalPrice,
    })
  },

  orderSave: function(orderData){
    wx.showLoading();
    newOrderSave(orderData).then(res =>{
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
          payment(queryString).then(res => {
            console.log(res);
            if(res){
              wxRequestPayment(res).then(payRes => {
                if(payRes){
                  if(payRes.errMsg && payRes.errMsg.includes('fail')){
                  }else{
                  }
                  wx.navigateTo({
                    url: '../../pages/wxPayCon/wxPayCon' + objToQuery(queryParam)
                  });
                }
              });
            }
          })
      }
    }).catch(err=>{
      wxShowToast(err.message);
    })
  },

  getRule: function(){
    getCustomizationRule().then(res =>{
      this.setData({
        rule: res,
      })
    })
  },

  // 获取地址
  _getAddress: function () {
    let localAddress = wx.getStorageSync('dingdanAddress');
    if(localAddress && localAddress.phone){
      this.handleAddress(localAddress);
      return;
    }
    getAddress().then(res => {
      if(res.length){
        let addressObj = {}, num = 0;
        res.forEach(item => {
          item.defaultAddress === IS_GIFT ? addressObj = item : num++;
        });
        res.length === num ? addressObj = res[0] : '';
        this.handleAddress(addressObj)
      }
    })
  },
  handleAddress: function(addressObj){
    this.setData({address: addressObj});
    let addressOrder = {
      province: this.data.address.province,
      city: this.data.address.city,
      area: this.data.address.area,
      detailAddress: this.data.address.detailAddress,
      contactTel: this.data.address.phone,
      consignee: this.data.address.userName,
    };
    
  },

  goAddress: function(){
    wx.setStorageSync('isAuthor',this.data.isAuthor)
    try {
      app.tdSdkEvent('flow_purchase_order_address', {});
    }catch (e) {}
    wx.navigateTo({
      url: '/pages/address/address?dingdan=200'
    });
  },


  submitOrder: function(e){
    if(!this.data.address.userName){
      wxShowToast("请选择地址！");
      return;
    }
    if(!this.data.isChecked){
      wxShowToast('请同意协议');
      return;
    }
    let goodsList = this.data.goodsInfo;
    if(goodsList[1].price === 0 && !this.data.isTimeInterval){
      goodsList.splice(1,1)
    }
    let address = this.data.address;
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    // 微信广告用户行为信息
    const wxUserAction = wx.getStorageSync(KEYSTORAGE.wxUserAction);
    const chanId = wx.getStorageSync(KEYSTORAGE.chanId) || '';
    let orderData = {
      bigOrderAppendix: {
        targetUrl: '',
        utmCampaign: '',
        utmMedium: '',
        utmSource: '',
        utmTerm: ''
      },
      payPrice: this.data.totlePrice,
      expressFare: 0,
      realSellPrice: this.data.totlePrice,
      originalTotalPrice: this.data.originalPrice,
      goodsTotalCount: goodsList.length,
      picUrl: goodsList[0].gscolPicPath,
      province: address.province,
      city: address.city,
      area: address.area,
      detailAddress: address.detailAddress,
      consignee: address.userName,
      contactTel: address.phone,
      brandCode: app.config.brand,
      channelCode: 'MINIPROGRAM',
      crmId: CRMInfo.memberno || '',
      phone: CRMInfo.phone,
      goodsOrderList: goodsList,
      orderType: ORDER_TYPE.CUSTOMER,
      openId: app.getOpenId(),
      utmWxScene: wx.getStorageSync('scene') || '',
      customerNickname: wxInfo.nickName || '',
      customerFaceImg: wxInfo.avatarUrl || '',
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
      unionid: wx.getStorageSync(KEYSTORAGE.unionid)
    }

    
    let daogouLists = wx.getStorageSync('daogouLists');
    if(daogouLists && daogouLists.length){
      let utmObj = {};
      daogouLists.forEach(item =>  utmObj[item.key] = item.value )
      Object.assign(orderData.bigOrderAppendix, utmObj)
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
    orderData.devFlag = orderDevFlag;

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
    orderData.bigOrderAppendix = bigOrderAppendix;
    if(orderSaveShare.shareBy && orderSaveShare.shareByShop){
      orderData.channelCode = 'WEMALL';
      orderData.shareByTime = wx.getStorageSync('openShareTime') || Date.now();
      Object.assign(orderData, orderSaveShare);
    }

    this.orderSave(orderData);
  },

  showRlue: function(){
    let isShowAll = this.data.isShowAll;
    isShowAll = !isShowAll;
    this.setData({
      isShowAll,
    })
  },

  checkboxChange: function(e){
    let isChecked = e.target.dataset.checked;
    isChecked = !isChecked;
    this.setData({
      isChecked,
    })
  },

   // 倒计时
   TimeInterval:function(startTime, endTime){
    let currentTime = new Date().getTime();   
    let startYear =  startTime.substring(0, 4) + '/' + startTime.substring(5, 7) + '/' + startTime.substring(8, 11);
    let startDay = startTime.substring(11)
    let startTimer = parseInt(new Date(`${startYear} ${startDay}`).getTime()) +  1000

    let endYear =  endTime.substring(0, 4) + '/' + endTime.substring(5, 7) + '/' + endTime.substring(8, 11);
    let endtDay = endTime.substring(11)
    let endTimer = parseInt(new Date(`${endYear} ${endtDay}`).getTime()) +  1000

    if(currentTime > startTimer && currentTime < endTimer){
      return true;
    } else {
      return false;
    }
  },
})