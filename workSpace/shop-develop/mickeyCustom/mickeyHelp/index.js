import API from '../api/index'
import main from "../base/mains.js"
import {urls} from "../base/url.js"

Page({
  data: {
    helpAlert:false,
    alertText:"成功为TA增加30游戏币",
    loadImageList:[
      'https://alioss.woaap.com/bestseller/campaign2001/images/help_bg_big.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/help_alert_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/help_button.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/home_help_success.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/help_start.png',
    ],
    channel:"",
    shop_type:"",
    inviter_openid:"",
  },
  helpOpenId:"",

  onLoad: function (options) {
    this.helpOpenId = options.openId;
    let {scene, channel = "", shop_type = ""} = options;
    this.setData({
      shop_type,
      channel,
    })
    channel && wx.setStorageSync("mickeyChannel", channel)
    shop_type && wx.setStorageSync("mickeyShopType", shop_type)
    wx.setStorageSync("mickeyInviterOpenid", "")
    if(scene){
      let str = decodeURIComponent(scene);
      let oid = str.split("=")[1];
      if(oid){
        this.helpOpenId = oid;
        oid && wx.setStorageSync("mickeyInviterOpenid", oid)
      }
    }
    wx.hideShareMenu();
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if(!openid || !unionid) {
      wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
      })
      return false
    }
      
  },
  onShow(){
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if(openid && unionid) {
      if(this.helpOpenId == openid){
        setTimeout(() => {
          main.link(`${urls.mickeyTiger}?channel=${this.data.channel}&shop_type=${this.data.shop_type}&inviter_openid=${this.data.inviter_openid}`, 1);
          
        }, 500);
      }
    }
  },
  help(){
    main.request(API.invite, {inviter_openid: this.helpOpenId}, "POST").then(res => {
      let {errcode, errmsg} = res.data
      if(errcode == 0){
        this.setData({
          helpAlert:true
        })
      } else {
        main.showToast(errmsg);
      }
    })
  },
  start(){
    main.link(`${urls.mickeyTiger}?channel=${this.data.channel}&shop_type=${this.data.shop_type}&inviter_openid=${this.data.inviter_openid}`, 1);
  }

})
