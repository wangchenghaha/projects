import { splitImg, getBrandBySku } from '../../../utils/utils'
const app = getApp()
const brand = app.config.brand
let utmParam = ``
Page({

  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
  },

  onLoad: function (options) {
    app.setUtmOptions(options)
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign
    utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
  },

  onReady: function () {
    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    this.windowWidth = windowWidth
  },

  onIndexClick: function (ev) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  onGoodClick: function (ev) {
    console.log(ev)
    let colorCode = ev.currentTarget.dataset.colorCode
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    })
  },

  onMultiClick: function (ev) {
    console.log(ev)
    let x = ev.detail.x
    let halfW = this.windowWidth / 2
    if (x < halfW) {
      wx.pageScrollTo({ scrollTop: 0 })
    } else {
      this.onIndexClick()
    }

  },

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