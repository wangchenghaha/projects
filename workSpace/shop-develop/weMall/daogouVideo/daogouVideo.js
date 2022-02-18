// pages/userDaogou/daogouVideo/daogouVideo.js
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl:'',
    isVideo:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let videoName = options.videoName;
    let videoUrl = `${cdn}/assets/common/video/${videoName}.mp4`;
    if(videoName === 'question'){
      this.setData({isVideo: false});
      videoUrl = `${cdn}/assets/common/${brand}/image/learn_question.jpg`;
    }
    this.setData({videoUrl: videoUrl})
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