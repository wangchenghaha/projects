// socialAdvertising/ads/ad20210224/ad20210224.js
import { splitImg, getCurrentUrl } from '../../../utils/utils'
import { getAdConfig } from '../ad'
const app = getApp()
const brand = app.config.brand
let utmParam = ``
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperImgList: [1, 2, 3, 4, 5, 6],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUtmOptions(options)
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign
    utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`

    getAdConfig()
      .then(res => {
        this.configList = res
      })
  },

  onCouponClick: function (ev) {
    let path = `/${this.configList[0]}`
    console.log(path)
    wx.navigateTo({
      url: path
    })
  },

  onFolderClick: function (ev) {
    let url = `/${this.configList[1]}`
    console.log(url)
    wx.navigateTo({
      url: url
    })
  },

  onShopClick: function (ev) {
    let cUrl = `${this.configList[2]}`
    app.goToWebView(cUrl)
  },

  onShareAppMessage: function (ev) {
    let pagePath = getCurrentUrl()
    return {
      path: `/${pagePath}?${utmParam}`
    }
  },

})