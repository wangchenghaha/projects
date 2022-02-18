// socialAdvertising/shopLanding/shopLanding.js
const app = getApp();
const brand = app.config.brand;
import { splitImg } from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBrandBaseUrl: splitImg(''),
    swiperImgList: [],
    autoplay: true,
    interval: 3000,
    duration: 500,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let list = []
    for (let i = 1; i <= 6; i++) {
      list.push({
        picUrl: `${this.data.imgBrandBaseUrl}/wechat_social_shop_landing_swiper_0${i}0.png`,
      });
    }
    this.setData({ swiperImgList: list })

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

  onCouponClick: function (e) {

    // let authed = wx.getStorageSync(KEYSTORAGE.authed);
    // authed ? app.login() : app.goSetting();

    let cUrl = `https://bestseller-wechat.woaap.com/page/coupon-exchange/channel5e709538e222f?brand=5&delivery_id=2583`
    app.goToWebView(cUrl)
  },


  onGotoShopClick: function (e) {
    let shopUrl = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=173&appid=3a37c167c2648243b0b6f2f8e705853a&tag=405`
    app.goToWebView(shopUrl)

  },



  onRushToBuyClick: function (ev) {
    wx.navigateTo({
      url: '/socialAdvertising/landingJL/landingJL',
      success: (result) => {
        console.log(`onRushToBuyClick-----  success`)
      },
      fail: (e) => {
        console.log(`onRushToBuyClick-----  fail ${e}`)
       },
      complete: () => { }
    });
  }


})