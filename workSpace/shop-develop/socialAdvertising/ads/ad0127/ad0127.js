const app = getApp()
const brand = app.config.brand
import { splitImg } from '../../../utils/utils'
const jjSkuList = [`221133022`, `221133023`, `221101005`, `221101004`, `221124005`,]
const sltSkuList = [`42114D033`, `421124044`, `421125008`, `421125010`, `421124043`,]
const onlySkuList = [`12119S076`, `12119S074`, `12113B019`, `121107001`, `12119S035`,]

Page({

  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
    autoplay: true,
    interval: 3000,
    duration: 500,
    showButtonTips: false,
    swiperImgList: [3, 4, 5, 6, 7],
    tip1: ``,
    tip2: ``,
    tip3: ``,
  },

  onLoad: function (options) {
    app.setUtmOptions(options)
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign

    this.channel = options.channel || ''
    this.delivery_id = options.delivery_id || ''
    let tip1 = ``
    let tip2 = ``
    let tip3 = ``
    if (brand == "JACKJONES") {
      tip1 = `领取230元新年豪礼券`
      tip2 = `了解更多牛气战服`
      tip3 = `去门店，买牛气新衣`
    } else if (brand == "VEROMODA") {
      tip1 = `领取300元新年豪礼券`
      tip2 = `了解更多牛气战服`
      tip3 = `去门店，买牛气新衣`
    } else if (brand == "SELECTED") {
      tip1 = `领取230元新年豪礼券`
      tip2 = `了解更多牛气战服`
      tip3 = `去门店，买牛气新衣`
    } else if (brand == "ONLY") {
      tip1 = `领取300元新年豪礼券`
      tip2 = `了解更多牛气战服`
      tip3 = `去门店，买牛气新衣`
    }
    this.luckMap = new Map([
      ["2MPMOMENT01", "/pages/whitePage/whitePage?channel=channel6018ec37b1347&delivery_id=6290"],
      ["4MPMOMENT03", "/pages/whitePage/whitePage?channel=channel6018fb305993d&delivery_id=6292"],
      ["3MPMOMENT01", "/pages/whitePage/whitePage?channel=channel601903f445d24&delivery_id=6297"],
      ["3MPMOMENT03", "/pages/whitePage/whitePage?channel=channel6018fd5ca6b04&delivery_id=6295"],
      ["1MPMOMENT01", "/pages/whitePage/whitePage?channel=channel6018ba986ea46&delivery_id=6289"],
    ])
    let showLucky = Boolean(this.luckMap.get(this.utm_term))
    this.setData({
      tip1,
      tip2,
      tip3,
      showLucky,
    })

  },

  onCouponClick: function (ev) {
    console.log(ev)
    wx.navigateTo({
      url: `/businessCouponSubpack/pages/index/index?channel=channel607656458dbc5&delivery_id=7141`
    })
  },

  onIndexClick: function (ev) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  onGoodClick: function (ev) {
    console.log(ev)
    let index = ev.currentTarget.dataset.id
    if (brand == "JACKJONES") {
      let colorCode = jjSkuList[index]
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${colorCode}`
      })
    } else if (brand == "VEROMODA") {
      this.onIndexClick()
    } else if (brand == "SELECTED") {
      let colorCode = sltSkuList[index]
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${colorCode}`
      })
    } else if (brand == "ONLY") {
      let colorCode = onlySkuList[index]
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${colorCode}`
      })
    }
  },

  onShopClick: function (ev) {
    let jj = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=156&appid=b7359edb3407eefa5d415dc3a1506039&tag=360`
    let vm = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=153&appid=6dfd7b94c190bf7356a5b6c4f1f3a97c&tag=401`
    let slt = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=62&appid=f85e0e20884fb19f669bfb9113882466&tag=400`
    let only = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=83&appid=c3259690d51106851a84cd0317d14a2d&tag=404`
    let cUrl = ``
    if (brand == "JACKJONES") {
      cUrl = jj
    } else if (brand == "VEROMODA") {
      cUrl = vm
    } else if (brand == "SELECTED") {
      cUrl = slt
    } else if (brand == "ONLY") {
      cUrl = only
    }
    app.goToWebView(cUrl)
  },

  onImageLoad: function (ev) {
    this.setData({ showButtonTips: true })
  },

  onBannerLoad: function (ev) {
    let h = ev.detail.height
    this.setData({ bannerHeight: h })
  },

  onLuckyClick() {
    let url = this.luckMap.get(this.utm_term)
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },

  onShareAppMessage: function (ev) {
    let utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
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