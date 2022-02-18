import { requestPermission } from '../../service/init.js'
import { getWxInfo, wxLogin, login, getWeChatInfo } from '../../service/user.js'
import { KEYSTORAGE, URL_CDN,EVENTS } from '../../src/const.js'
import events from '../../src/events';
const app = getApp();
const brand = app.config.brand;
const cdn = app.config.cdn;
const title = app.config.title;
var guide ='';
let js_code = '';
// pages/requestPermission/.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    programName:wx.getStorageSync(KEYSTORAGE.brand),
    title,
    bannerImg: `${cdn}/assets/common/${brand}/image/authorize_banner.jpg`,
    brandLogo: URL_CDN.LOGO_BLACK_SQUARE,
    serverList:[
      [
        {
          image:'/images/member_icon.png',
          serverText1: '会员历程',
          serverText2: '购物累积积分'
        },
        {
          image:'/images/gift_icon.png',
          serverText1: '专享好礼',
          serverText2: '积分兑换好礼'
        }
      ],
      [
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
      ]
    ]
  },
  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {

      //用户登录成功
      /*setTimeout( ()=> {
        wx.hideLoading();
        let sharePage = wx.getStorageSync('sharePage');
        if(sharePage.indexOf('daogouwxq')>-1){
          wx.showModal({
            title: '提示',
            content: '暂时未登录导购微商城，请前往首页登录！',
            success: res => {
              if (res.confirm) {
                wx.switchTab({url: '/pages/index/index'});
              } else if (res.cancel) {
                wx.switchTab({url: '/pages/index/index'});
              }
            }
          });
          return;
        }else{
          wx.navigateBack({ delta: 1 });
        }
      },1000)*/
    }
  },
  onLoad: function(options){
    console.log("options", options);
    wxLogin().then(res => {
      console.log('wxLogin',res);
      js_code = res;
    });
    if(options.guide){
      guide = options.guide;
    } else {
      guide = '';
    }
    //订阅登录事件
    events.register(this, EVENTS.EVENT_LOGINED);
  },
  bindGetUserInfo: function(e) {
    console.log(e);
    if (e.detail.errMsg === 'getUserInfo:ok'){
      wx.showLoading({title:'正在登录...', mask: true});
      const wxInfoParam = {
        brand: brand,
        js_code: js_code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      };
      getWeChatInfo(wxInfoParam).then(res => {
        wx.setStorageSync(KEYSTORAGE.authed, true);
        wx.setStorageSync(KEYSTORAGE.openid, res.openId || '');
        wx.setStorageSync(KEYSTORAGE.unionid, res.unionId || '');
        wx.setStorageSync(KEYSTORAGE.wxInfo, res)
      }).then( () => {
        wx.navigateBack({ delta: 1 })
      })
    }
    /*if(e.detail.errMsg === 'getUserInfo:ok'){
      wx.setStorageSync(KEYSTORAGE.wxInfo,e.detail.userInfo);
      wx.setStorageSync('encryptedData',e.detail.encryptedData);
      wx.setStorageSync('iv',e.detail.iv);
      wx.setStorageSync(KEYSTORAGE.authed, true);
      wx.showLoading({
        title:'正在登录...',
        mask: true
      });
      console.log("guide ===========",guide);
      if(guide || guide != ''){
        app.guideLogin();
        //回退到上一页
      } else {
        app.login();
      }
    }*/
    /*requestPermission().then((result) =>{
      wx.hideLoading();
      wx.showToast({ title: result, duration: 800 });
      wx.setStorageSync(KEYSTORAGE.authed, true);
      
      app.login();
    }).catch(e => wx.showToast({ title: e.message,duration:1500}) );*/
  },
  onClick: function () {
    wx.switchTab({url: '/pages/index/index'})
  }

})