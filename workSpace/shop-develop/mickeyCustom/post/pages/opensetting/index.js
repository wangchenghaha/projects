// pages/main/index.js
// const main = require('../../../base/main.js');
// const urls = require('../../../base/url.js');

// const app = getApp();
// var system = app.getAppSysInfo()


Page({
  data: {
    // scrollHeight: 300, // 滚动高度
    // modalHidden2: true, // 弹出框是否隐藏
    // modalWord: '', // 弹出框话术
    setting: {
      // brandName: '导购通', // 品牌名
      // img1:'http://wxapp-1253679705.cossh.myqcloud.com/NPC/img/WechatIMG84.jpeg',
      // img2:'http://wxapp-1253679705.cossh.myqcloud.com/NPC/img/WechatIMG83.jpeg'
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  open(e) {
    console.log(e);
    // if (e.detail.authSetting['scope.userLocation']) {
    //   wx.navigateBack({
    //     delta: 1,
    //   });
    // }
  },
  onLoad(options) {
    
  },
  onReady() {
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面关闭
  },

});
