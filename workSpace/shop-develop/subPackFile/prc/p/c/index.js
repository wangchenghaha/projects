import Utils from '../../common/utils/index'
import Service from '../../request/index'
Page({
  data: {
    isBigPhone: Utils.judgeBigScreen(),
    items: [{
      id: 1,
      label: '淡黄的长裙'
    }, {
      id: 2,
      label: '性感的蕾丝'
    }, {
      id: 3,
      label: '卡哇伊的T恤'
    }, {
      id: 4,
      label: '超A的牛仔'
    }, {
      id: 5,
      label: '甜辣的西装'
    }],
    activeIndex: -1,
    framebox: [],
    isRestart: false
  },
  onLoad: function (options) {
    this.data.framebox = wx.getStorageSync('frameBox') || [0]
    this.data.isRestart = options.playagain || false;
      
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
    wx.showLoading({
      title: '跳转中',
      mask: true
    })
    this.data.framebox.push(this.data.activeIndex)
    let framebox = this.data.framebox
    wx.setStorageSync('frameBox', framebox);
    if (this.data.isRestart) {
      this.jump()
    } else {
      const op = wx.getStorageSync('crayonOtions')
      let params = {
        term: op.utm_term,
        campaign: op.utm_campaign,
        is_share: op.is_share,
        select_ids: framebox,
        big_channel: op.big_channel,
        small_channel: op.small_channel
      }
      Service.join(params).then(res => {
        if (res.errcode == 0) {
          this.jump()
        }
      })
    }
  },
  jump() {
    wx.reLaunch({
      url: '/subPackFile/prc/p/d/index?fromQs=true',
      success: (result) => {
        wx.hideLoading();
    },
    })
  },
  checkThis(e) {
    let { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index
    })
  }
})