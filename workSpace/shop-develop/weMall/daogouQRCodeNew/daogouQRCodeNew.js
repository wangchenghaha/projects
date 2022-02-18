
import { getGuideQR } from '../../service/guide.js'
import { splitImg } from '../../utils/utils'
var bgUrl = require('../../src/const.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    portraitPic: '',
    qrCode: '',
    // 新增
    guideBg: splitImg('guiderq_bg.png'),
    guideTitle : splitImg('guiderq_title.png'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    let { nickName, portraitPic, employeeId } = wx.getStorageSync('daogouInfo');
    this.setData({
      
      portraitPic: portraitPic
    });
    this.getUserInfo();
    getGuideQR(employeeId.slice(4, 10)).then((url) => {
      url = url.replace('.jpg', '.png') + "?v=" + Math.floor(Math.random() * 100);
      this.setData({ qrCode: app.config.cdn + url });
      wx.hideLoading();
    }).catch(e => {
      this.setData({ qrCode: '../../../images/so_sad.png'});
      wx.showToast({ title: e.message});
      wx.hideLoading();
    });
  },

 //获取微信用户信息
 getUserInfo: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.avatarUrl && userInfo.nickName) {
      this.setData({
        nickName: userInfo.nickName,
        portraitPic: userInfo.avatarUrl,
      })
    }
  },

  close: function () {
    wx.navigateBack({
      delta: -1
    });
  },

  previewImage: function(e){
    wx.previewImage({  
      urls: this.data.qrCode.split(',')  
    })  
  }
})