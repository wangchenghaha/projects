import { splitImg } from '../../../utils/utils'
const app = getApp();
const brand = app.config.brand;
let utmParam = ``
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
    utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
  },

  onCouponClick: function (ev) {
    console.log(ev)
    let path = ``
    if (this.utm_term == "1MPMOMENT08") {
      path = `/pages/whitePage/whitePage?channel=channel5ffeb081cdf06&delivery_id=5861`
    } else {
      path = `/pages/whitePage/whitePage?channel=channel5ffeb081cdf06&delivery_id=5862`
    }
    wx.navigateTo({
      url: path
    });
  },

  onIndexClick: function (ev) {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  onWebClick: function (ev) {
    let url = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=83&appid=c3259690d51106851a84cd0317d14a2d&tag=404&${utmParam}`
    app.goToWebView(url)
  },

  onGoodClick: function (ev) {
    console.log(ev)
    let colorCode = ev.currentTarget.dataset.colorCode
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    });
  },


  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (ev) {
    let pagePath = this.getCurrentPageUrl()
    return {
      path: `/${pagePath}?${utmParam}`
    }
  },

  getCurrentPageUrl: function () {
    let pages = getCurrentPages()
    let curr = pages[pages.length - 1]
    let pagePath = curr.route
    return pagePath
  }
})