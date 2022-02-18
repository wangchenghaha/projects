import fetch from '../fetch/index'
import API from '../api/index'
Page({
  data: {
    screen: 0,
    appoints: [],
    is_appints: null,
    nothing: false
  },
  onLoad: function (options) {
    let screen = wx.getSystemInfoSync().windowHeight
    this.setData({
      screen
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.isHaveRecord()
  },
  selectThis(e) {
    let { item } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/CustomService/detail/index?appoint_id='+item.id
    })
  },
  // 判断是否有预约存在
  isHaveRecord() {
    fetch({url: API.user.isOrderList}).then(res => {
      let { errcode, data: {appoints, is_appints} } = res
      if (errcode === 0) {
        this.setData({
          appoints,
          is_appints,
          nothing: appoints.length === 0
        })
      }
    })
  },
})