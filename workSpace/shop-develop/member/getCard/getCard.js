// pages/fashionID/getCard/getCard.js
const urls = require('../../base/url.js');
const main = require('../../base/main.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extraData:{
      encrypt_card_id: '',
      biz: '',
      outer_str: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {encrypt_card_id, biz, outer_str} = options;
    let extraData = this.data.extraData;
    extraData = {
      encrypt_card_id: decodeURIComponent(encrypt_card_id) || '',
      biz: decodeURIComponent(biz) || '',
      outer_str: decodeURIComponent(outer_str) || ''
    };
    this.setData({ extraData });
  },
  // 点击事件
  onClick: function(e){
    wx.setStorageSync("isMember", 0);
    wx.setStorageSync("isGetCard", 1);
    // 上报入会渠道 18-06-29 by golan
    main.request(urls.setChannel, {}, function (res) { console.log(res); })
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

  }
})