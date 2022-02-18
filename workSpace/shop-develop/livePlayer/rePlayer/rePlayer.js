// livePlayer/rePlayer/rePlayer.js
import {KEYSTORAGE} from "../../src/const";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    height: 0,
    videList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  swiperChange(e){
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const videoList = wx.getStorageSync(KEYSTORAGE.rePlayer);
    if(videoList && videoList.length){
      this.setData({videoList})
    }
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      height: systemInfo.windowHeight * 2 +'rpx'
    })

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