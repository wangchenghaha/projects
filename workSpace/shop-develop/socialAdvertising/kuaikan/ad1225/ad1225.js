import { splitImg } from '../../../utils/utils'
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


  onCouponClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel5fe2e95b0218b&delivery_id=5591`,
    });
  },

  onAlbumClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/webview/webview?&utm_medium=AD&utm_source=DBOT&utm_term=1KAPPIS03&utm_campaign=20201224ONLYIP&linkUrl=https%3A%2F%2Fm.only.cn%2FcustomPage%2FONLY%2FKK1223%2Findex.html`
    });
  },

  onOneCentClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel5fe588f39a412&delivery_id=5645`,
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
    let pagePath = this.getCurrentPageUrl()
    return {
      path: `/${pagePath}?shareFlag=Y${utmParam}`
    }
  },

  getCurrentPageUrl: function () {
    let pages = getCurrentPages()
    let curr = pages[pages.length - 1]
    let pagePath = curr.route
    return pagePath
  }
})