import Utils from '../../common/utils/index'
import Service from '../../request/index'

Page({
  data: {
    preload: true,
    isBigPhone: Utils.judgeBigScreen(),
    sh: wx.getSystemInfoSync().statusBarHeight,
    first: true
  },
  onLoad: function (options) {
    Utils.formatOptions(options).then(res => {
      console.log(res, '入参啊')
      wx.setStorageSync('crayonOtions', res)
      this._home()
    })
  },
  onShow: function () {
    if (this.data.first) {
      this.data.first = false
      return
    }
    this._home()
  },
  onShareAppMessage: function () {
    return Utils.share()
  },
  imageAllLoad() {
    this.setData({
      preload: false
    })
  },
  // 获取首页数据
  _home() {
    Service.home().then(res => {
      if (res.errcode == 0) {
        this.data.info = res.data
        if (res.data.is_join) {
          wx.redirectTo({
            url: '/subPackFile/prc/p/d/index'
          })
        }
      }
    })
  },
  joinActive() {
    Utils.throttle(() => {
      wx.navigateTo({
        url: '/subPackFile/prc/p/b/index'
      })
    }, 1000)()
  }
})