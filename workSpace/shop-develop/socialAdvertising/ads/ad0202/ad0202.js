import { splitImg, getBrandBySku } from '../../../utils/utils'
const app = getApp()
const brand = app.config.brand
let utmParam = ``
Page({

  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperImgList: [51, 52, 53],
  },

  onLoad: function (options) {
    app.setUtmOptions(options)
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign
    utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
    this.swiperImgMap = new Map([
      [51, ["221124056", "120414086H91"]],
      [52, ["221133098A48", "221133098A48"]],
      [53, ["221133101", "121136005S12"]]
    ])
  },

  onReady: function () {
    console.log("onReady >>> ")
    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(`onReady >>>  windowHeight =${windowHeight}   windowWidth=${windowWidth} `)
    this.windowWidth = windowWidth
  },

  onBannerLoad: function (ev) {
    let h = ev.detail.height
    this.setData({ bannerHeight: h })
  },

  onCouponClick: function (ev) {
    console.log(ev)
    let x = ev.detail.x
    let halfW = this.windowWidth / 2
    let path = ``
    if (x < halfW) {
      path = `/pages/whitePage/whitePage?channel=channel6017a1543d7a2&delivery_id=6285`
    } else {
      path = `/pages/whitePage/whitePage?channel=channel601380b1f0a87&delivery_id=6179`
    }
    wx.navigateTo({
      url: path
    })
  },

  onIndexClick: function (ev) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  onWebClick: function (ev) {
    let url = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=83&appid=c3259690d51106851a84cd0317d14a2d&tag=404&${utmParam}`
    app.goToWebView(url)
  },

  onGoodClick: function (ev) {
    console.log(ev)
    let colorCode = ev.currentTarget.dataset.colorCode
    this._navtoDetail(colorCode)
  },
  onMultiGoodClick: function (ev) {
    console.log(ev)
    let x = ev.detail.x
    let halfW = this.windowWidth / 2
    let colorCode = x < halfW ? `221133101` : `12119S056C58`
    this._navtoDetail(colorCode)
  },
  onBannerClick: function (ev) {
    console.log(ev)
    let index = ev.currentTarget.dataset.mapIndex
    let skuList = this.swiperImgMap.get(index)
    let x = ev.detail.x
    let halfW = this.windowWidth / 2
    let colorCode = x < halfW ? skuList[0] : skuList[1]
    this._navtoDetail(colorCode)
  },

  _navtoDetail(colorCode) {
    let b = getBrandBySku(colorCode)
    console.log(`---  sku 为 ${colorCode}  的商品品牌为：${b}   是否为当前品牌：${b == brand}`)
    if (b == brand) {
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${colorCode}`
      })
    } else {
      wx.navigateToMiniProgram({
        appId: b == "JACKJONES" ? "wx7f1b0d611e93dea4" : "wxa3d9d2199eeded73",
        path: `/pages/content/content?colorCode=${colorCode}&${utmParam}`,
      })
    }
  },

  onMoreClick() {
    wx.navigateTo({
      url: '/activity/onlyXjackjones/onlyXjackjones',
    })
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