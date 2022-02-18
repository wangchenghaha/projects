import { splitImg } from '../../utils/utils'
import {getCompound, getCustomizationlimitJson} from '../../service/customization'

import {URL_CDN} from '../../src/const.js'
const app = getApp();
const cdn = app.config.cdn;
let type = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    goodsInfo: [],
    swiper: {
      data: [],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 200000,
      duration: 500,
    },
    swiperList: [
      {
        picUrl: ''
      }, 
      {
        picUrl: ''
      }
    ],

    fixedRightArr: [
      {
        type: 'share',
        img: splitImg('icon_share.png', 'common'),
        isShow: true,
      },
      {
        type: 'home',
        img: splitImg('icon_home.png', 'common'),
        isShow: true,
      }
    ],
    swiperImageHeight: 0, 
    marginTop: 0,
    isShowTiebiao: false,
    templateImage: "",
    isShare: false,
    isLimit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    type = options.type;
    let goodsInfo = wx.getStorageSync("dzRequstDatas");
    let forShow = wx.getStorageSync("forShow");
    if(type === "1"){
      wx.setStorageSync("printData", goodsInfo[1]);
      wx.setStorageSync('printCustomText',goodsInfo[0].customRemark)
    }
    this._getCustomizationlimitJson();
    if(forShow === 2 &&  wx.getStorageSync("printData")){
      wx.removeStorageSync("printData")
      wx.removeStorageSync("printCustomText")
    }
    let swiperList = this.data.swiperList;
    swiperList[0].picUrl = cdn +  goodsInfo[0].picFront;
    swiperList[1].picUrl = cdn +  goodsInfo[0].picBack;
    this.setData({
      goodsInfo,
      swiperList,
      isShowTiebiao: type === "1" ? true : false,
      marginTop: type === "1" ? 0 : 100,
    })
  
  },

  // 获取图片高度
  getImageHeight : function (e) {
      var winWid = wx.getSystemInfoSync().windowWidth;
      var imgh=e.detail.height;
      var imgw=e.detail.width;
      var swiperH=winWid*imgh/imgw;
      this.setData({swiperImageHeight : swiperH});
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

  onClick: function(e){
    let type = e.currentTarget.dataset.type;
    switch(type){
      case 'share':
        this.getCompoundPic();
        break;
      case 'home':
        app.goBack();
        break;
    }
  },


  getCompoundPic: function(){
    let goodsInfo = this.data.goodsInfo;
    console.log("-----------", goodsInfo);
    let printInfo =  wx.getStorageSync("printData");
    let showPic = "";
    if(printInfo.picFront){
      showPic = goodsInfo[0].picFront.substring(1)
    } else {
      showPic = goodsInfo[0].picBack.substring(1)
    }
    let jsData = {
      template_name: goodsInfo[0].goodsName, 
      share_pic_url: showPic
    }
    getCompound(jsData).then(res=>{
      console.log("res=====",res);
      this.setData({
          templateImage: cdn +"/" + res,
          isShare: true
      })
    })
  },

  /**
   * 直接购买
   */
  submitOrder: function(e){
    if(type != "1"){
      let goodsInfo = wx.getStorageSync("dzRequstDatas");
      goodsInfo[1] = wx.getStorageSync("printData");
      goodsInfo[0].customRemark = wx.getStorageSync("printCustomText");
      wx.setStorageSync("dzRequstDatas", goodsInfo);
    }
    wx.navigateTo({
      url: '../customOrderSave/customOrderSave'
    })
  },

  /**
   * 贴标
   */
  goToMark: function(e){
      let json = {
        front : '',
        back : ''
      }
      let arrs = wx.getStorageSync('dzRequstDatas');
      json.front = cdn + arrs[0].picFront
      json.back =cdn + arrs[0].picBack
      wx.navigateTo({
        url: `../customEditGoods/customEditGoods?type=2&tiebiao=${JSON.stringify(json)}`
      });
  },

   // 去掉优惠券弹窗
   changeShow: function(e){
    this.setData({
      isShare: false,
    });
  },

  _getCustomizationlimitJson: function(){
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    getCustomizationlimitJson().then(res => {
      wx.hideLoading();
      let isTimeInterval = this.TimeInterval(res.startTime, res.endTime);
      this.setData({
        isLimit: isTimeInterval
      })
    }).catch(err =>{

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let sharePath = '/pages/index/index';
    return {
      title: app.config.title,
      path: sharePath,
      imageUrl: URL_CDN.COVER_SHARE,
      success: res =>{}
    }
  },

})