import { splitImg } from '../../../utils/utils'
const app = getApp()
const brand = app.config.brand
let utmParam = ``
var shareFlag = "N"
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
    shareFlag = options.shareFlag == "Y" ? "Y" : "N"
    utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
  },

  onCouponClick: function (ev) {
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel60190cc56a058&delivery_id=6302`
    })
  },

  onSockClick: function (ev) {
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    let list = [
      '/pages/whitePage/whitePage?channel=channel60190d0ca8d09&delivery_id=6304',
      '/pages/whitePage/whitePage?channel=channel60190d2b87296&delivery_id=6305'
    ]
    let oneOrTwo = (Math.round(Math.random() * 9) + 1) % 2
    let path = list[oneOrTwo]
    wx.navigateTo({
      url: path
    })
  },

  onFolderClick: function (ev) {
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel60190d5417fc1&delivery_id=6306`
    })
  },

  onIndexClick: function (ev) {
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  _injectTdsdk: function (btName) {
    app.tdSdkEvent('pageclick_camp_button', {
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_term: this.utm_term,
      utm_campaign: this.utm_campaign,
      share_flag: shareFlag,
      camp_button: btName,
    })
  },

  onShareAppMessage: function (ev) {
    let pagePath = this.getCurrentPageUrl()
    return {
      path: `/${pagePath}?shareFlag=Y&${utmParam}`
    }
  },

  getCurrentPageUrl: function () {
    let pages = getCurrentPages()
    let curr = pages[pages.length - 1]
    let pagePath = curr.route
    return pagePath
  }
})