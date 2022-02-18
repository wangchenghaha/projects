
Page({
  data: {
    ch: 0,
    banner: ''
  },
  onLoad: function (options) {
    let ch = wx.getSystemInfoSync().windowHeight - 124
    this.setData({
      ch
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      banner : wx.getStorageSync('CSB')
    })
  },
  submitForm() {
    wx.navigateBack()
  }
})