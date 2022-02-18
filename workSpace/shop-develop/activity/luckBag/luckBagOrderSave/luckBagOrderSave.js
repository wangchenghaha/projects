import {getAddress} from '../../../service/member'
import { wxShowToast } from "../../../utils/wxMethods";
import {URL_CDN, KEYSTORAGE, REGEXP, EVENTS} from "../../../src/const";
import { ruleListBySku } from '../../../service/promotion';
import { payment, wxRequestPayment } from '../../../service/pay'
import { newOrderSave } from "../../../service/order";
import { getLuckbagStock } from '../../../service/goods';
import events from '../../../src/events';
import { jianfa ,skuToImg, objToQuery} from '../../../utils/utils';
import { wxSubscription } from '../../../utils/wxSubscribe';
const app = getApp();
const cdn = app.config.cdn;
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
        price: 0,
        color: "#000"
      },
       {
        explain: "运费",
        price: 0,
        color:  "#000"
      },
      {
        explain: "优惠",
        price: 0,
        color: "red",
        showReduce: true
      }
    ],
    payPrice: 0,
    isShowAll: false,
    isChecked: false,
    promotionDescripe:'',
    ruleId: '',
    isSell: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
     //订阅登录事件
     events.register(this, EVENTS.EVENT_CRMINFO);
     this.showOrderInfo();
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
    this.getRuleListBySku();
  },

  handleEvent: function(event, type){
    if(type === EVENTS.EVENT_CRMINFO){
      CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      orderSaveParam.phone = CRMInfo.phone;
      this.getRuleListBySku();
    }
  },

  _getLuckbagStock: function(param){
    // 获取库存
    getLuckbagStock(param).then( stockRes => {
      let isSell = (stockRes.status === 'open');
      this.setData({isSell});
    });
  },

  showOrderInfo: function(){
    let goodsInfo = wx.getStorageSync("luckbagGoods");
    let totlePrice = 0
    for (let i = 0; i < goodsInfo.length; i++) {
      goodsInfo[i].gscolPicPath = cdn + goodsInfo[i].gscolPicPath;
      totlePrice += goodsInfo[i].price;
    }
    const costList = this.data.costList;
    costList[0].price = totlePrice;
    this._getLuckbagStock(goodsInfo[1].gcsSku);
    this.setData({
      goodsInfo,
      costList,
      payPrice: totlePrice,
    })
  },

  // 获取地址
  _getAddress: function () {
    let localAddress = wx.getStorageSync('dingdanAddress');
    if(localAddress && localAddress.phone){
      this.setData({address: localAddress});
      return;
    }
    getAddress().then(res => {
      if(res.length){
        let addressObj = {}, num = 0;
        res.forEach(item => {
          item.defaultAddress === IS_GIFT ? addressObj = item : num++;
        });
        res.length === num ? addressObj = res[0] : '';
        this.setData({address: addressObj});
      }
    })
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

  // 查询促销规则列表
  getRuleListBySku: function(){
    let wxData = this.data;
    let orderGoods = wxData.goodsInfo, param = [], promotion = wxData.promotion;
    orderGoods.forEach( item => {
      param.push({
        sku: item.color ? item.color.colorCode : item.goodsColorCode,
        quantity: 1
      })
    });
    wx.showLoading({
      mask: true,
    })
    ruleListBySku(param).then( res => {
      wx.hideLoading();
      if(Array.isArray(res) && res.length > 0){
        let promotionInfo =  '';
        for (let i = 0; i < res.length; i++) {
          if(res[i].id === 1114){
            promotionInfo = res[i]
          }else if(res[i].id === 1132){
            promotionInfo = res[i]
          }
        }
        if(promotionInfo){
          let costList = this.data.costList;
          costList[2].price = promotionInfo.markupPrice;
          let payPrice = this.data.payPrice;
          payPrice =  jianfa(costList[0].price , promotionInfo.markupPrice)
          this.setData({
            promotionDescripe: promotionInfo.description,
            costList,
            payPrice,
            ruleId: promotionInfo.id,
          })
        } else {
          wxShowToast("该活动已下线！")
        }
      } else {
        wxShowToast("促销为空！请联系导购！")
      }
    }).catch(err => {
      wx.hideLoading();
      let that = this;
      wx.showModal({
        title: '提示',
        content: "网络异常，重新加载！",
        showCancel: false,
        success: function (res) {
           that.getRuleListBySku();
        }
      });
    })
  },
  

  wxSubscribe: function(e){
    const goodsInfo = this.data.goodsInfo;
    if(!this.data.isSell){
      this.sellShowModal();
      return;
    }
    // 获取库存
    getLuckbagStock(goodsInfo[1].gcsSku).then( stockRes => {
      let isSell = (stockRes.status === 'open');
      if(isSell){
        if(!wx.getStorageSync('wxSubscriptions').isOrderPay){
          wxSubscription("orderPay").then(res => {
            this.submitOrder(e)
          }).catch(err => {
            this.submitOrder(e)
          });
        }else{
          this.submitOrder(e)
        }
      } else {
        this.sellShowModal();
      }
    });
   
  },

  sellShowModal: function(){
    wx.showModal({
      title: '提示',
      content: "该商品已售罄！",
      showCancel: false,
      success: function (res) {
         app.goBack();
      }
    });
  },

  submitOrder: function(){
    if(!this.data.address.userName){
      wxShowToast("请选择地址！");
      return;
    }
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const data = this.data;
    const goodsInfo = data.goodsInfo;
    const address = data.address;
    const payPrice = data.payPrice;
    const ruleId = data.ruleId;
    let goodsDetailList = [];
    goodsInfo.forEach( item=>{
      goodsDetailList.push({
        colorName: item.colorName,
        gcsSku: item.gcsSku,
        goodsName: item.goodsName,
        goodsCount: 1,
        goodsColorCode: item.goodsColorCode,
        gscolPicPath: this.getPic(item.goodsColorCode),
        originalPrice: item.originalPrice,
        sizeName: item.sizeName,
        price: item.price,
        isGift: "N"
      })
    })

    let orderParams = {
      ruleId: ruleId,
      channelCode: app.config.channel,
      realSellPrice: payPrice,
      payPrice: payPrice,
      goodsTotalCount:2,
      gscPicmianId:"1",
      picUrl: goodsDetailList[1].gscolPicPath,
      province: address.province,
      city:address.city,
      area: address.area,
      detailAddress:address.detailAddress,
      contactTel: address.phone,
      consignee: address.userName,
      crmId: CRMInfo.memberno || '',
      utmWxScene: wx.getStorageSync('scene') || '',
      expressFare: 0,
      unionid: wx.getStorageSync(KEYSTORAGE.unionid),
      customerNickname: wxInfo.nickName || '',
      customerFaceImg: wxInfo.avatarUrl || '',
      phone: CRMInfo.phone || '',
      openId: app.getOpenId(),
      originalTotalPrice: this.data.costList[0].price,
      bigOrderAppendix: {
        targetUrl: '',
        utmCampaign: '',
        utmMedium: '',
        utmSource: '',
        utmTerm: ''
      },
      goodsOrderList: goodsDetailList,
      devFlag: ''
    }
    let daogouLists = wx.getStorageSync('daogouLists');
    if(daogouLists && daogouLists.length){
      let utmObj = {};
      daogouLists.forEach(item =>  utmObj[item.key] = item.value )
      Object.assign(orderParams.bigOrderAppendix, utmObj)
    }

    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    const {wxScene, share_by, share_by_shop} = shareFrom;
    let orderSaveShare = {
      shareBy: share_by || '',
      shareByShop: share_by_shop || '',
    };
    if(wxScene){
      orderParams.devFlag = `场景值：${wxScene}_${orderParams.devFlag}`;
    }
    let bigOrderAppendix = {targetUrl: wx.getStorageSync('targetUrl') || ''};
    const optionList = wx.getStorageSync('daogouLists');
    if(optionList && optionList.length){
      optionList.forEach(item => {
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

  getPic: function(goodsColorCode){
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku: goodsColorCode,
    };
    return  skuToImg(skuToImgParam);
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
        payment(queryString).then(res => {
          console.log(res);
          if(res){
            wxRequestPayment(res).then(payRes => {
              if(payRes){
                if(payRes.errMsg && payRes.errMsg.includes('fail')){
    
                }else{
    
                }
                wx.navigateTo({
                  url: '/pages/wxPayCon/wxPayCon' + objToQuery(queryParam)
                });
              }
            });
          }
        }).catch(err => wxShowToast(err.message))
      }
    }).catch( e => {
      wx.hideLoading();
      wxShowToast(e.message);
    });
  },

})