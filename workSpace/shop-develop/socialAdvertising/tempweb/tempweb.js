import { getCurrentUrl, getQueryStringArgs } from '../../utils/utils'
import { KEYSTORAGE, URL_CDN } from '../../src/const'
const app = getApp();
const brand = app.config.brand;
let curOptions = null;
let shareImg = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link_url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    console.log(options, 'webview options****');
    wx.setNavigationBarTitle({ title: getApp().config.title })//页面标题

    let onlyAd = `https://m.only.cn/customPage/ONLY/ONLY0605/index.html`
    let vmAd = `https://m.veromoda.com.cn/customPage/VEROMODA/VEROMODA0616/index.html`
    let sltAd = `https://m.selected.com.cn/customPage/SELECTED/SLT0724/index.html`
    options.linkUrl = brand == "ONLY" ? onlyAd : brand == "SELECTED" ? sltAd : vmAd
    let linkUrl = decodeURIComponent(options.linkUrl);
    try {
      if (linkUrl.includes('index.html')) {
        let path = linkUrl.split('index.html')[0];
        shareImg = `${path}/images/cover_share.jpg`
      }
    } catch (e) { }
    this.setData({
      link_url: linkUrl
    });
    this.storageOptions(linkUrl);

    try {
      app.tdSdkEvent('pageclick_webview_onload', {
        title: app.config.title,
        path: linkUrl
      });
    } catch (e) { }
  },
  // 获取URL参数
  storageOptions: function (url) {
    let options = getQueryStringArgs(url);
    if (options) {
      app.setUtmOptions(options);
    }
    const clickId = curOptions.gdt_vid || '';
    wx.setStorageSync(KEYSTORAGE.wxUserAction, {
      date: '',
      url,
      clickId,
    });
    let param = Object.assign(options, {
      eventName: `${clickId}_打开专辑页_${url}`,
      clickId: clickId ? `${clickId}_腾讯有数` : ''
    });
    app._collectData2(param);
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
    app.track()
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
    let curRoute = getCurrentUrl();
    let urlH5 = curOptions.linkUrl;
    let sharePath = `${curRoute}?linkUrl=${urlH5}`;
    return {
      path: sharePath,
      imageUrl: shareImg,
    }
  }
})