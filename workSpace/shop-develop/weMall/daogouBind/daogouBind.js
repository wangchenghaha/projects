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
    wx.showLoading({title: '加载中...'});
    setTimeout(function () {
      wx.hideLoading();
    }, 2000);
    let { employeeId } = wx.getStorageSync('daogouInfo');
    this.setData({
      bindUrl: `${app.config.domain_h5}/activity/shoppinGuide/`
    });
    // if(app.config.brand == "FOL"){
    //   this.setData({
    //     bindUrl:`${app.config.domain_h5}/user/XCX/?brand=FOL&employeeId=${employeeId}`
    //   });
    //   setTimeout(function(){
    //     wx.navigateBack({ delta: 1 });
    //   },60000)
    // } else {
    //   this.setData({
    //     bindUrl:`${app.config.domain_h5}/lingzhiguide/guide/index.do?brand=${app.config.brand}&employeeId=${employeeId}`
    //   });
    //   setTimeout(function(){
    //     wx.navigateBack({ delta: 1 });
    //   },4000)
    // }
  },

})