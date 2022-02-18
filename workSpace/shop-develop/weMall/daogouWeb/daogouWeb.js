// pages/userDaogou/daogouWeb/daogouWeb.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        bindUrl:options.webUrl
      })
      console.log(this.data.bindUrl)
  }
})