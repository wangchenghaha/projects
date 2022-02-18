// socialAdvertising/landing/landing.js
const app = getApp();
const brand = app.config.brand;
import { splitImg } from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    adMode: `MODE_A`,
    randomMilli: Math.random(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`--------------  options -----`)
    console.log(options)
    app.setUtmOptions(options);
    let intentMode = options.adMode
    this.setData({
      adMode: intentMode ? intentMode : `MODE_A`
    })
    wx.setStorageSync("socialLandingBackable", true);
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

  onAdItemClick: function (ev) {
    console.log(`onAdItemClick  -------------`)
    let colorCode = ev.target.dataset.colorCode
    console.log(colorCode)
    if(colorCode){
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${colorCode}`
      });
    }
  },

  onGotoIndexClick: function (ev) {
    wx.switchTab({
      url: '/pages/index/index',
      success: (result) => {
        console.log(`onIndexClick----- success`)
      },
      fail: () => { },
      complete: () => { }
    });
  }

})