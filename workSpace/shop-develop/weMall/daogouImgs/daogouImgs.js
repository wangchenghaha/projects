
var app = getApp();

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
    //标题
    wx.setNavigationBarTitle({ title: getApp().config.title });
    wx.showLoading({
      title: '加载中...'
    });
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
    var that = this;

    wx.request({
      url: `${app.config.cdn}/assets/share/coverList.json`,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res){
        var Data = res.data;
        if( Data.coverList.length > 0 ){
          that.setData({
            coverList: Data.coverList
          });
        };
        wx.hideLoading();
      },
      fail: function (err) {
      },
      complete: function (res) {

      }
    });

  },

  //点击选择图片
  clickImg: function(e){
    var thisSrc = e.currentTarget.dataset.src;
    wx.setStorageSync('coverImg', thisSrc);
    wx.navigateBack({
      delta: 1
    });
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
