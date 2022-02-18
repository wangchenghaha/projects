import { getCurrentUrl, getQueryStringArgs } from '../../utils/utils'
import { KEYSTORAGE, URL_CDN } from '../../src/const'
const app = getApp();
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
    let linkUrl = decodeURIComponent(curOptions.linkUrl);
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
    wx.setStorageSync(KEYSTORAGE.webviewLinkUrl, linkUrl);
  },
  // 获取URL参数
  storageOptions: function (url) {
    let options = getQueryStringArgs(url);
    if (options) {
      app.setUtmOptions(options);
      app.setShareInfo(options);
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
    this.jumpDuiba();
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
    // 兑吧页面返回2次? 不解，先注释
    /* wx.navigateBack({
      delta: 2,
    }) */
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
  },
  jumpDuiba() {
    if (curOptions.linkUrl.includes('duiba')) {
      if (!app.checkLogin()) {
        return;
      }
    }
  }
})
