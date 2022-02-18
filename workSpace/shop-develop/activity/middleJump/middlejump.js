// activity/middleJump/middlejump.js
const app = getApp();
import { getFreeLogin } from '../../service/member';
import { KEYSTORAGE } from '../../src/const.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('***************20200902-----')
    wx.showToast({
      title: '正在为您跳转...',
      icon: 'complete',
      duration: 3000
    })
    this.jumpDuiba()
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

  },
  jumpDuiba() {
    if (!app.checkLogin()) {
      return;
    }
    let webviewLinkUrl = wx.getStorageSync(KEYSTORAGE.webviewLinkUrl);
    let crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let availablepoints = crmInfo.availablepoints ? Math.floor(crmInfo.availablepoints) : 0
    let memberno = crmInfo.memberno || ''
    let params = {
      credits: availablepoints,
      uid: memberno,
      redirect: webviewLinkUrl
    }
    getFreeLogin(params).then(res => {
      if (res.data) {
        app.goToWebView(res.data)
        // let deCodeURL = encodeURIComponent(res.data);
        // wx.redirectTo({
        //   url: `/pages/webview/webview?linkUrl=${deCodeURL}`
        // });
      }
    })
  },
})