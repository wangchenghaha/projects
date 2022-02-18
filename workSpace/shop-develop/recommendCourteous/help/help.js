// recommendCourteous//homePage/homePage.js
import { splitImg } from '../../utils/utils'
import {	KEYSTORAGE, EVENTS } from '../../src/const.js'
import events from "../../src/events";
import { getHelp, getCreator} from '../common.js'

const app = getApp();

const splashImgList = [
  {
    scale: 6218, // 6
    topTj: '65%',
    topInvite: '60%'
  },
  {
    scale: 5179, // x
    topTj: '50%',
    topInvite: '50%'
  },
  {
    scale: 5064, // 安卓
    topTj: '50%',
    topInvite: '50%'
  }
];
let jsonUrl = {}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
    crmInfo: wx.getStorageSync(KEYSTORAGE.crmInfo),
    unionid: wx.getStorageSync(KEYSTORAGE.unionid),
    bgImg: splitImg('lml_tj_01.jpg'),
    zlImg: splitImg('lml_tj_07.jpg'),
    zlsImg: splitImg('lml_tj_08.png'),
    couponsImg: splitImg('lml_tj_12.png'),
    showShade: false,
    showCoupons: false,
    isIPhoneX: getApp().globalData.isIPhoneX,
    // topTj: 65,
    topInvite: 40,
    showInvite: true,
    haveHelp: false,
  },
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && event) {
      this.getGameUserInfo();
      
    }
  },
  getGameUserInfo(){
    this.setData({
      wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
      crmInfo: wx.getStorageSync(KEYSTORAGE.crmInfo),
      unionid: wx.getStorageSync(KEYSTORAGE.unionid),
    })
    this.funCreator()
    if(!this.data.crmInfo){
      return
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    // this.funCreator()
    this.getSystemInfo()
    //订阅登录事件
    events.register(this, EVENTS.EVENT_CRMINFO);
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
    this.getGameUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '抢50元无门槛券',
      path: '/page/user?id=123',
      imageUrl: this.data.bgImg, 
    }
  },
  funCreator: function () {
    getCreator({id: this.data.id}).then(res => {
        jsonUrl = {
          creatorAvatarUrl: res.creatorAvatarUrl,
          creatorNickname: res.creatorNickname,
          creatorOpenid: res.creatorOpenid,
          creatorPhone: res.creatorPhone,
          creatorUnionid: res.creatorUnionid
        }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: res.msg,
        duration: 2000
      });
    })
  },
  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let topTj = '',
          topInvite = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          topTj = item.topTj,
          topInvite = item.topInvite
        }
      });
      that.setData({
        topTj,
        topInvite
      })
    }catch (e) {}
  },
  goHelp: function () {
    if(!getApp().checkLogin()){
      return
    }
    // this.funCreator()
    let jsonData =  {
      brand: getApp().config.brand,
      crmRegisterTime: this.data.crmInfo.joindate,
      gameCode: "fission",
      helperAvatarUrl: this.data.wxInfo.avatarUrl,
      helperNickname: this.data.wxInfo.nickName,
      helperOpenid: this.data.wxInfo.openId,
      helperPhone: this.data.crmInfo.phone,
      helperUnionid: this.data.unionid,
      utmCampaign: "",
      utmMedium: "",
      utmSource: "",
      utmTerm: ""
     }
     let data = Object.assign(jsonUrl, jsonData)
    getHelp(data).then(res => {
        this.setData({
          haveHelp: true,
          showShade: true,
          showCoupons: true,
        })
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          duration: 2000
        });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: res.msg,
        duration: 2000
      });
    })
  },
  goInvite: function () {
    wx.navigateTo({
      url: '/recommendCourteous/homePage/homePage'
  })
  },
  hideShade: function () {
    this.setData({
      showShade: false,
      showCoupons: false
    })
  }
})