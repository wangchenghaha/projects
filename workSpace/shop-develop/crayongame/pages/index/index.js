import Utils from '../../common/utils/index'
import Service from '../../request/index'
Page({
  data: {
    isBigPhone: Utils.judgeBigScreen(),
    sbH: wx.getStorageSync('systemData').statusBarHeight,
    wh: wx.getStorageSync('systemData').windowHeight,
    preload: true
  },
  onLoad(options) {
    // wx.hideShareMenu()
    Utils.formatOptions(options).then(res => {
      console.log(res, '入参啊')
      wx.setStorageSync('crayonOtions', res)
      this._home()
    })
  },
  onShow(){
    this._home()
  },
  imageAllLoad() {
    this.setData({
      preload: false
    })
  },
  joinActive() {
    wx.redirectTo({
      url: '/crayongame/pages/info/index'
    })
      
  },
  // 获取首页数据
  _home() {
    Service.home().then(res => {
      if (res.errcode == 0) {
        this.data.info = res.data
        if (res.data.is_join) {
          wx.redirectTo({
            url: '/crayongame/pages/last/index'
          })
        }
      }
    })
  },
  
    onShareAppMessage: function(){
        return Utils.share()
    },
})