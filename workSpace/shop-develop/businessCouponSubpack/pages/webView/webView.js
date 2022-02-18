// businessCouponSubpack/pages/webView/webView.js
import main from '../../services/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    console.info('options',options)
     options = options.scene ? main.getRouteObjByStrOfSunQr(options.scene) : options
     if(options.linkUrl) {
       this.setData({
         options:options,
         linkUrl : decodeURIComponent(options.linkUrl)
       })
     }else{
       wx.showModal({
         title : '提示',
         content : '请访问正确地址~',
         showCancel : false,
         success (res) {
           wx.switchTab({
               url:'/pages/eshopModule/pages/onShop/index',
           });
         }
       })
     }
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