import Utils from '../../common/utils/index'
Page({
  data: {
    frame: [],
    isBigPhone: Utils.judgeBigScreen(),
    changing: true,
    showResult: false
  },
  onLoad: function (options) {
    // wx.hideShareMenu()

    this.setData({
      frame: wx.getStorageSync('frameBox')
    }, () => {
      setTimeout(() => {
        this.setData({
          changing: false
        }, () => {
          setTimeout(() => {
            this.setData({
              showResult: true
            })
          }, 250)
        })
      }, 1000)
    })

  },
  navigateTo() {
    if (!this.data.showResult) return
    wx.redirectTo({
      url: '/crayongame/pages/result/index'
    })

  },
  onShareAppMessage: function () {
    return Utils.share()
  },
})