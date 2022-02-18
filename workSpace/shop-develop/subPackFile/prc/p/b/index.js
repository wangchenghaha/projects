import Utils from '../../common/utils/index'

Page({
  data: {
    isBigPhone: Utils.judgeBigScreen(),
    items: [{
      id: 1,
      label: '奔放的红色'
    }, {
      id: 2,
      label: '暖心的黄色'
    }, {
      id: 3,
      label: '清爽的绿色'
    }, {
      id: 4,
      label: '纯净的蓝色'
    }, {
      id: 5,
      label: '无瑕的白色'
    }],
    activeIndex: -1
  },
  onLoad: function (options) {
    this.data.options = options
  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    return Utils.share()
  },
  clear() {
    this.setData({
      activeIndex: -1
    })
  },
  next() {
    if (this.data.activeIndex < 0) {
      wx.showToast({
        title: '请选择您的答案~~',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }
    wx.setStorageSync('frameBox', [ this.data.activeIndex ]);
    wx.navigateTo({
      url: this.data.options.playagain ? '/subPackFile/prc/p/c/index?playagain=true' : '/subPackFile/prc/p/c/index'
    })
  },
  checkThis(e) {
    let { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index
    })
  }
})