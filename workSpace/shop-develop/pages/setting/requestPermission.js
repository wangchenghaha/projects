import { requestPermission } from '../../service/init.js'
import { getWxInfo, wxLogin, login, getWeChatInfo, unionIdByCode, wxGetUserProfile } from '../../service/user.js'
import { KEYSTORAGE, URL_CDN,EVENTS } from '../../src/const.js'
import events from '../../src/events';
import {splitImg, getCurrentUrl} from '../../utils/utils';
import {wxShowToast} from '../../utils/wxMethods';
const app = getApp();
const {brand, cdn, title} = app.config;
let guide ='';
// let js_code = '';
// pages/requestPermission/.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    programName:wx.getStorageSync(KEYSTORAGE.brand),
    title,
    bannerImg: splitImg('authorize_banner.jpg'),
    brandLogo: URL_CDN.LOGO_WHITE_RECT,
    // brandLogo: URL_CDN.LOGO_WHITE_RECT_JJ,
    serverList:[
      {
        image:'/images/member_icon.png',
        serverText1: '会员历程',
        serverText2: '购物累积积分'
      },
      {
        image:'/images/gift_icon.png',
        serverText1: '专享好礼',
        serverText2: '积分兑换好礼'
      },
      {
        image:'/images/return_icon.png',
        serverText1: '退换无忧',
        serverText2: '方便订单查询'
      },
      {
        image:'/images/address_icon.png',
        serverText1: '收货地址',
        serverText2: '一键授权地址'
      }
    ],
    agreePrivacy: false
  },
  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {
    }
  },
  onLoad: function(options){
    console.log("options", options);
    /*wxLogin().then(res => {
      console.log('wxLogin',res);
      js_code = res;
    });*/
    guide = options.guide || '';
    //订阅登录事件
    events.register(this, EVENTS.EVENT_LOGINED);
    // 隐私政策
    const agreePrivacy = wx.getStorageSync(KEYSTORAGE.AGREE_PRIVACY);
    this.setData({
      agreePrivacy,
    });
  },
  getUserProfile(){
    const { agreePrivacy } = this.data;
    if(!agreePrivacy){
      wxShowToast('请勾选隐私政策');
      this.setData({animate: true});
      setTimeout( () =>{
        this.setData({animate: false});
      }, 1000);
      return
    }
    wxGetUserProfile().then(wxInfo => {
      this.getUnionId(wxInfo);
    });
  },
  goClause(){
    app.navigateTo('weMall/userService/userService?tab=1')
  },
  changeCheck(){
    let { agreePrivacy } = this.data;
    agreePrivacy = !agreePrivacy;
    this.setData({ agreePrivacy });
  },
  async getUnionId(wxInfo){
    try {
      wx.showLoading({title:'正在登录...', mask: true});
      let code = await wxLogin();
      let {openid, unionid} = await unionIdByCode(code);
      /*let {openid, unionid} = {
        session_key: "aTus6oTRtDRjjX2rEwYCEw==",
        expires_in: 7200,
        openid: "osMoB0ewdxNSnIQlPrtxw6WIQWKs",
        unionid: "ozYoQs53Ni9hIaF0p8S3rVzX1PqQ"
      };*/
      wx.setStorageSync(KEYSTORAGE.authed, true);
      wx.setStorageSync(KEYSTORAGE.openid, openid || '');
      wx.setStorageSync(KEYSTORAGE.unionid, unionid || '');
      Object.assign(wxInfo, {openId: openid, unionId: unionid});
      wx.setStorageSync(KEYSTORAGE.wxInfo, wxInfo);
      wx.setStorageSync(KEYSTORAGE.AGREE_PRIVACY, true);
      app.login(guide);
      wx.navigateBack({ delta: 1 });
    }catch (e) {
      console.log(e)
      wxShowToast(e.message)
    }
  },
  onClick: function () {
    wx.switchTab({url: '/pages/index/index'})
  },
  navigateBack(){
    let pages = getCurrentPages(); //获取加载的页面
    if(pages.length === 1){
      app.goBack();
      return
    }
    let prePage = pages[pages.length-2].route; //获取当前页面的对象
    if(app.globalData.tabBarList.includes(prePage)){
      app.goBack();
    }else{
      wx.navigateBack({ delta: 1 });
    }
  },
})
