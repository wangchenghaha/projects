import {pointOrderSave, orderSave, newOrderSave} from '../../../service/order'
import {KEYSTORAGE} from "../../../src/const";
import { getAddress} from '../../../service/member'
import {wxShowToast} from '../../../utils/wxMethods'
import { payment, wxRequestPayment } from '../../../service/pay'
import {objToQuery, getBrandBySku} from "../../../utils/utils";
import { wxSubscription } from '../../../utils/wxSubscribe';
var mCard = require("../../../base/memberCard.js");
var main = require("../../../base/main.js");
var url = require("../../../base/url.js");
var cityJS = require('../../../utils/city.js');
var app = getApp();
const {cdn, ORDER_TYPE} = app.config;

var dingdanCon = new Array();
var submitOnoff = true;
var proviceNum = 0, cityNum = 0, districtNum = 0;
const strReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

//调用一下，为了获取unionid，并存在缓存中
function is_Member(that, AllMoneys) {
  //为了获取用户的unionid,便于用户提交订单时，根据用户的unionid判断用户是不是会员
  var isCallbackCard = wx.getStorageSync('isCallbackCard')
  if (1 != isCallbackCard) {
    mCard.isMember(function (isMember) {
      if (isMember == 200) {
        var _user_info = wx.getStorageSync("user_info")
        if (!_user_info.name) {
          main.request(url.getUserinfo, { brand: getApp().config.etoBrand }, function (res) {
            wx.setStorageSync("user_info", res.data.data.user_info);
          }, 1);
        }
      }
    }, 1, 1);
    wx.setStorageSync("isCallbackCard", "");
  };
};


Page({

  //页面的初始数据
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    dingdanList: new Array(),

    address: {},

    //总件数和总价
    Nums: 0,
    AllPrice: 0,
    AllScore: 0,
    myCoupons: 0,
    couponMore: 0,   //优惠了多少？

    index1: 0,
    index2: 0,
    index3: 0,
    hasAddress: false,

  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

    cityJS.init(this);
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {


    var that = this;
    dingdanCon = wx.getStorageSync('jifenBuyDingdan');

    that.setData({
      couponMore: 0
    });

    var Numbers = 0;
    var AllMoneys = 0;
    var AllScores = 0;
    //计算得出总件数和总价
    for (var i = 0; i < dingdanCon.length; i++) {
      Numbers += dingdanCon[i].nums;
      AllMoneys += Number(dingdanCon[i].allPrice);
      AllScores += Number(dingdanCon[i].score);
    };

    if (dingdanCon) {
      dingdanCon.forEach((item)=>{
        item.pic = `${cdn}${item.color.picurls[0]}`
      })
      this.setData({
        dingdanList: dingdanCon,
        Nums: Numbers,
        AllPrice: AllMoneys.toFixed(0),
        AllScore: AllScores,
      });
    };

    //获取unionid
    var unionid = wx.getStorageSync('unionid');
    if (unionid == '') {
      is_Member(that, AllMoneys);
    } 
    // else {
    //   //获得优惠券
    //   getMyYhqList(that, AllMoneys);
    // };


    var pageList = getCurrentPages();
    var prevPageUrl = pageList[pageList.length - 1].route; 
    if (prevPageUrl == 'pages/content/content') {
      wx.removeStorageSync('dingdanAddress');
    };

    this.getAddress();


    app.track();
  },
  getAddress(){
    //取本地订单地址
    const dingdanAddress = wx.getStorageSync('dingdanAddress');
    if (dingdanAddress.userName) {
      this.setData({
        address: dingdanAddress,
        hasAddress: true,
      });
      return;
    }
    getAddress().then(res => {
      let hasAddress = true, address = {};
      if(res && res.length){
        address = res[0];
        res.forEach(item => {
          if(item.defaultAddress === 'Y'){
            address = item
          }
        })
      }else{
        hasAddress = false;
      }
      this.setData({hasAddress, address});
      wx.setStorageSync('dingdanAddress', address);
    }).catch(err => wxShowToast(err.message))

  },

  //收货信息
  shouhuoxinxi: function (e) {

    if(this.data.hasAddress){
      wx.navigateTo({
        url: '/pages/address/address?dingdan=200'
      });
    } else {
      wx.setStorageSync('xiugaiAddress', {});
      wx.setStorageSync('getWxAddress', 1);
      wx.navigateTo({
        url: '/pages/addAddress/addAddress'
      })
    }

  },

  submit: function(){
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

  //提交订单
  formSubmit: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    });
    var Dingdan = this.data.dingdanList;
    var Address = this.data.address;


    if (JSON.stringify(Address) == "{}") {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '请填写收货信息',
        showCancel: false
      });
      return;
    };

    /* 提交订单的准备数据 开始 */
    var goodsOrderLists = new Array();
    for (var i = 0; i < Dingdan.length; i++) {
      goodsOrderLists.push({
        "clearingType": 3,
        "colorName": Dingdan[i].color.colorAlias,
        "gcsSku": Dingdan[i].size.sku,
        "goodsName": Dingdan[i].goodsName,
        "goodsCount": Dingdan[i].nums,
        "goodsColorCode": Dingdan[i].color.colorCode,
        "gscolPicPath": Dingdan[i].color.picurls[0],
        "originalPrice": Number(Dingdan[i].color.originalPrice) * Number(Dingdan[i].nums),
        "sizeName": Dingdan[i].size.sizeAlias,
        "price": Dingdan[i].allPrice,
        "isGift": "N",
        pointPrice: Dingdan[i].score * 1 || 0
      });
    };

    var user_phone = wx.getStorageSync('user_info').phone;
    var crmId = wx.getStorageSync("user_info").memberno;
    let currentBrand = getBrandBySku(Dingdan[0].size.sku);
    if(Address.detailAddress && Address.detailAddress.length < 10){
      wx.showToast({
        title: '详细地址不能少于10位',
        icon: 'none'
      });
      return;
    }
    
    var dingdanJson = {
      orderType: ORDER_TYPE.POINT,
      "crmId": crmId,
      "payIntegral": parseInt(Dingdan[0].score),
      "ruleId": '',
      "fromBrand": currentBrand,
      "activityId": '',
      "channelCode": 'MINIPROGRAM',
      "realSellPrice": Dingdan[0].money,
      "payPrice": Dingdan[0].money,
      "goodsTotalCount": that.data.Nums,
      "gscPicmianId": "1",
      "picUrl": Dingdan[0].color.picurls[0],
      "province": Address.province,
      "city": Address.city,
      "area": Address.area,
      "detailAddress": Address.detailAddress,
      "contactTel": Address.phone,
      "consignee": Address.userName,
      "goodsOrderList": goodsOrderLists,
      "bigOrderAppendix": {
        "targetUrl": "",
        "utmCampaign": "",
        "utmMedium": "",
        "utmSource": "",
        "utmTerm": ""
      },
      unionid: wx.getStorageSync(KEYSTORAGE.unionid) || '',
      userLevel:"0",
      originalTotalPrice:Dingdan[0].onePrice
    };

    //导购分享参数添加
    var daogouList = wx.getStorageSync('daogouLists');
    var nowTimes = Date.now();
    if (daogouList && daogouList.length > 0) {
      var thisItem = daogouList[0];
      var runTime = parseInt((nowTimes - thisItem.times) / 1000);
      var day = Math.floor(runTime / 86400);
      if (day <= 15) {
        for (let k = 0; k < daogouList.length; k++) {
          dingdanJson.bigOrderAppendix[daogouList[k].key] = daogouList[k].value;
        };
      };
    };
    

    //判断是否是会员，如果不是就绑卡
    var unionid = wx.getStorageSync('unionid');
    if (unionid == '') {
      wx.showModal({
        title: '提示',
        content: '您不是会员，不能提交该订单',
        showCancel: false
      });
      return;
    } else {
      let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
      let {wxScene, share_by, share_by_shop} = shareFrom;
      let orderAdd = {
        shareBy: share_by || '',
        shareByShop: share_by_shop || '',
        unionid: unionid,
        phone: user_phone,
        devFlag: '',
        channelCode: (share_by && share_by_shop) ? 'WEMALL' : app.config.channel,
        utmWxScene: wx.getStorageSync(KEYSTORAGE.wxScene) || ''
      };
      const device = wx.getSystemInfoSync().model || '';
      const devFlag = wx.getStorageSync(KEYSTORAGE.devFlag);
      const shareDevice = wx.getStorageSync(KEYSTORAGE.shareDevice);
      let orderDevFlag = `设备型号：${device}`;
      if(devFlag && devFlag === app.config.WX_WORK){
        orderDevFlag += `_分享设备：${devFlag}`
      }
      if(shareDevice){
        orderDevFlag += `_${shareDevice}`
      }
      // 分享信息
      orderAdd.devFlag = orderDevFlag;
      if(wxScene){
        wxScene += '';
        if(wxScene === '1007' || wxScene === '1008'){
          orderAdd.devFlag = `场景值：${wxScene}_${orderAdd.devFlag}`;
        }
      }
      Object.assign(dingdanJson, orderAdd);
      submitDingdan();
    };

    // 过滤地址中的特殊字符
    function  filterStr(str){
      var filterStr = "";
      if(str){
        filterStr = str.replace(/ /g,'').replace(/\t/g,'').replace(/\n/g,'').replace(/\r\n/g,'');
      } else {
        wx.showModal({
          title: '提示',
          content: '您的收货地址不存在详细地址，请添加后再次提交订单！',
          showCancel: false
        });
        wx.hideLoading();
        return false;
      }
      if(!strReg.test(filterStr)){
        wx.showModal({
          title: '提示',
          content: '您的收货地址中存在特殊字符，请修改地址后，再次提交订单！',
          showCancel: false
        });
        wx.hideLoading();
        return false;
      } else {
        return true;
      }
    };

    if(!filterStr(dingdanJson.detailAddress) || !filterStr(dingdanJson.consignee)){
      return;
    }
    
   

    //保存订单
    function submitDingdan() {

      newOrderSave(dingdanJson).then(res =>{
        if(res){
          const {bigorderCode = '', payToken = '', payTokenTime = '', orderToken, bigOrderId} = res;
          const paramString = {orderToken, bigorderCode, id: bigOrderId};
          const param = { bigorderCode, payToken, payTokenTime };
          payment(param).then(res => {
            if(res){
              wx.hideLoading();
              wxRequestPayment(res).then(payRes => {
                if(payRes){
                  if(!wx.getStorageSync('wxSubscriptions').isPaySuccess){
                    wxSubscription("paySuccess").then(res => {
                    }).catch(err => {
                    });
                  }
                  wx.navigateTo({
                    url: '/pages/wxPayCon/wxPayCon' + objToQuery(paramString)
                  });
                }
              });
            }
          })
        }
      }).catch(err =>{
        wx.hideLoading();
        console.log(err)
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: err.message,
        });
      })
    };

  },
})