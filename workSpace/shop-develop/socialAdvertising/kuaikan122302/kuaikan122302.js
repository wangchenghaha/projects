// socialAdvertising/kuaikan122302/kuaikan122302.js
import { splitImg } from '../../utils/utils'
const app = getApp();
const brand = app.config.brand;
var shareFlag = "N"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUtmOptions(options);
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign
    shareFlag = options.shareFlag == "Y" ? "Y" : "N"
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady >>> ")
    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(`onReady >>>  windowHeight =${windowHeight}   windowWidth=${windowWidth} `)
    this.windowWidth = windowWidth
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

  onCouponClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel5fe2e95b0218b&delivery_id=5590`,
    });
  },

  onGoodClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    let colorCode = ev.currentTarget.dataset.colorCode
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    });
  },

  onAlbumClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/webview/webview?linkUrl=https%3A%2F%2Fm.only.cn%2FcustomPage%2FONLY%2FKK1223%2Findex.html`
    });
  },

  _injectTdsdk: function (btName) {
    app.tdSdkEvent('pageclick_camp_button', {
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_term: this.utm_term,
      utm_campaign: this.utm_campaign,
      share_flag: shareFlag,
      camp_button: btName,
    });
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (ev) {
    let utmParam = `&utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
    return {
      path: `/socialAdvertising/kuaikan122302/kuaikan122302?shareFlag=Y${utmParam}`
    }
  },
})