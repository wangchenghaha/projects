import fetch from '../fetch/index'
import API from '../api/index'
import { getWeChatInfo } from '../../service/user'
import { KEYSTORAGE } from '../../src/const'
const app = getApp();
const brand = app.config.brand;
Page({
  data: {
    ch: 0,
    notLogin: false,
    isAuth: true,
    io: {},
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular : true
  },
  onLoad: function (options) {
    let ch = wx.getSystemInfoSync().windowHeight - 124
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    // 扫码进来
    if (options.scene) {
      options.ac_number= decodeURIComponent(options.scene).split('ac_number=')[1]
    }
    if(options.ac_number) {
      this.indexinfo(options.ac_number)
       wx.setStorageSync('ac_number', options.ac_number)
    }
    console.log(options,'页面参数')
    this.setData({
      ch,
      isAuth: !openid || !unionid ? false: true,
    })
    this.gti()
  },
  onReady: function () {

  },
  onShow: function () {
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if (openid && unionid) {
      this.getData()
    }
  },
  indexinfo(ac_number) {
     wx.request({
      url: API.user.indexinfo,
      data: {
        ac_number
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      success: (res) => {
        res = res.data
        let { errcode } = res
        console.log('res---------->',res)
        if (errcode === 0) {
           console.log('CSB---------->',res.data.activity_info.banner)
          if (res.data.activity_info.banner) {
            // 存储数据
            wx.setStorageSync('CSB', res.data.activity_info.banner)
          }
          this.setData({
            io: res.data.activity_info,
            imgUrls : res.data.activity_info.carousel_map
          })
        }
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content:'网络开小差',
          cancelText: '返回',
        })
      },
    });
  },
  // 获取用户信息
  getUserAuth(e) {
    const me = this
    if (e.detail.errMsg === 'getUserInfo:ok'){
      wx.login({
        success: res => {
          let js_code = res.code
          let params = {
            brand,
            js_code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          getWeChatInfo(params).then(res => {
            wx.setStorageSync(KEYSTORAGE.authed, true);
            wx.setStorageSync(KEYSTORAGE.openid, res.openId || '');
            wx.setStorageSync(KEYSTORAGE.unionid, res.unionId || '');
            wx.setStorageSync(KEYSTORAGE.wxInfo, res)
            me.setData({
              isAuth: true
            })
            me.getData()
          })
        }
      })
    }
  },
  // 获取数据
  getData() {
    const me = this
    let params = {
      page: 1,
      count: 2,
      search: '',
      status: 1,
    }
    fetch({url: API.staff.orderList, data: params, hideToast: true}).then(res => {
      let { errcode } = res
      if (errcode === 0) {
        me.setData({
          notLogin: false
        })
      } else {
        me.setData({
          notLogin: true
        })
      }
    })
  },
  activeRunning() {
    if (this.data.notLogin) {
      wx.navigateTo({
        url: '/CustomService/login/index'
      })
    } else {
      wx.navigateTo({
        url: '/CustomService/record/index'
      })
    }
  },
  // 判断是否有预约存在
  gti() {
    fetch({url: API.user.isOrderList, hideToast: true}).then(res => {
      let { errcode } = res
      if (errcode === 0) {
        // if (res.data.activity_info.banner) {
        //   // 存储数据
        //   wx.setStorageSync('CSB', res.data.activity_info.banner)
        // }
        
        this.setData({
          // io: res.data.activity_info,
          // imgUrls : res.data.activity_info.carousel_map
        })
      }
    })
    
  },
})