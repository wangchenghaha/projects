// pages/weMember/weMember.js
import {objToQuery, splitImg} from '../../utils/utils'
import {wxShowToast, wxCopyText} from '../../utils/wxMethods'
import {getWeChatInfo, wxLogin, wxGetUserProfile , unionIdByCode,} from "../../service/user";
import {KEYSTORAGE, SUCCESS_STATUS} from "../../src/const";
const app = getApp();
const {brand} = app.config;
const systemInfo = wx.getSystemInfoSync();
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: splitImg('logo-black-rect.png'),
    // loginList: ['导购微商城', 'WeMall'],
    steps: [
      {
        text: '授权获取微信个人信息',
        openType: 'getUserInfo'
      },
      {
        text: '授权获取手机号信息',
        openType: 'getPhoneNumber',
      }
    ],
    wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
    unionId: wx.getStorageSync(KEYSTORAGE.unionid),
    wxPhone: wx.getStorageSync(KEYSTORAGE.wxPhone),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
  },

  getUserProfile(){
    wxGetUserProfile().then(wxInfo => {
      this.getUnionId(wxInfo);
    });
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
      wx.setStorageSync(KEYSTORAGE.wxInfo, wxInfo)
      wx.hideLoading();
      this.setData({wxInfo});
    }catch (e) {
      console.log(e)
      wx.hideLoading();
      wxShowToast(e.message)
    }
  },
  async getPhoneNumber(e) {
    const {encryptedData = '', iv = ''} = e.detail;
    if(encryptedData && iv){
      try {
        const wxPhone = await app.getWxPhone(encryptedData,  iv);
        wx.setStorageSync(KEYSTORAGE.wxPhone, wxPhone);
        this.setData({wxPhone});
        const bol = curOptions.game ? true : false
        app.login(bol);
        setTimeout(()=> {
          wx.navigateBack({ delta: 1 })
        }, 1000)
      }catch(e){
        wxShowToast(e.message)
      }

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const bol = curOptions.game ? true : false
    const {wxPhone, unionId} = this.data;
    if(wxPhone && unionId){
      app.login(bol);
      setTimeout(()=> {
        wx.navigateBack({ delta: 1 })
      }, 1000)
    }
  },
});