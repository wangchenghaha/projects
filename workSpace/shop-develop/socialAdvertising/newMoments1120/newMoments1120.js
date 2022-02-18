// socialAdvertising/newMomentsDynamic/newMomentsDynamic.js
import { splitImg } from '../../utils/utils'
const app = getApp();
const brand = app.config.brand;

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
    this.utm_term = options.utm_term
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(`onReady >>>  windowHeight =${windowHeight}   windowWidth=${windowWidth} `)
    this.windowWidth = windowWidth
  },

  onCouponClick: function (ev) {
    console.log(ev)
    //    pages/whitePage/whitePage?channel=channel5fb765bf49adc&delivery_id=5025
    //    pages/whitePage/whitePage?channel=channel5fb765bf49adc&delivery_id=5026
    let path = ""
    if (this.utm_term == "1MPMOMENT012") {
      path = `/pages/whitePage/whitePage?channel=channel5fb765bf49adc&delivery_id=5025`
    }
    if (this.utm_term == "1MPMOMENT013") {
      path = `/pages/whitePage/whitePage?channel=channel5fb765bf49adc&delivery_id=5026`
    }
    wx.navigateTo({
      url: path,
    })
  },

  onGoodClick: function (ev) {
    let colorCode = ev.currentTarget.dataset.colorCode
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    });
  },

  onIndexClick: function (ev) {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  onShopClick: function (ev) {
    let cUrl = `https://www.woaap.com/store-html/store/lbs_m?tpl_id=83&appid=c3259690d51106851a84cd0317d14a2d&tag=404`
    app.goToWebView(cUrl)
  },

})