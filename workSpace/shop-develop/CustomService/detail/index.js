import fetch from '../fetch/index'
import API from '../api/index'
Page({
  data: {
    ch: 0,
    appoint_id: null,
    isNew: false,
    orderInfo: {},
    banner: '',
  },
  onLoad: function (options) {
    let ch = wx.getSystemInfoSync().windowHeight - 124
    this.setData({
      ch,
      appoint_id: options.appoint_id,
      isNew: options.isNew ? JSON.parse(options.isNew) : false
    })
    this.getData(options.appoint_id)
  },
  onReady: function () {
    
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.data.isNew ? '预约成功' : '预约详情'
    })
    this.setData({
      banner : wx.getStorageSync('CSB')
    })
    console.log('this.banner------>',this.banner)
  },
  // 获取订单信息
  getData(appoint_id) {
    fetch({url: API.user.orderDetail, data: {appoint_id}}).then(res => {
      console.log(res,appoint_id,'--------------------')
      let { errcode, data } = res
      if (errcode === 0) {
        this.setData({
          orderInfo: data
        })
      }
    })
  },
  // 取消预约
  cancel() {
    let { appoint_id } = this.data
    wx.showModal({
      title: '提示',
      content: '是否取消该预约？',
      showCancel: true,
      cancelText: '返回',
      cancelColor: '#000000',
      confirmText: '确定取消',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          fetch({method: 'POST',url: API.user.cancelOrderDetail,data: {appoint_id}}).then(res => {
            if (res.errcode === 0) {
              wx.navigateBack()    
            }
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
    
  },
  // 返回
  getback() {
    wx.navigateBack()
  },
  // 修改预约
  activeRunning() {
    wx.redirectTo({
      url: '/CustomService/form/index?appoint_id=' + this.data.appoint_id
    })
  },
  // 打电话
  makePhoneCall(e) {
    let { phone } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone
    });
      
  },
  openInMap() {
    return
    let obj = this.data.orderInfo
    wx.openLocation({
      latitude: null,
      longitude: null,
      scale: 24,
      name: obj.store_name,
      address: obj.store_address,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  }
})