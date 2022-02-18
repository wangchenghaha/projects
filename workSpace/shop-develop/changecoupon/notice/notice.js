
import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../imgmodel/imgmodel'
const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
console.log(img)


Page({
  data: {
    token : '',
    whitebg : img.whitebg,
    activity_num : ''
  },
  onShow: function () {
    this.is_get_coupon()
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: config.title
    })
  },
  onLoad(options) {
    if(options.token) {
      this.setData({
        token:options.token
      })
    }
    if(options.activity_num) {
      this.setData({
        activity_num:options.activity_num
      })
    }
  },
  is_get_coupon() {  //是否领券
    fetch({url: API.is_get_coupon,data:{token:this.data.token,activity_num:this.data.activity_num}}).then(res => {
      console.log(res)
      let { data:{channel,delivery_id,token,is_get_coupon},errcode } = res
      if(errcode == 0) {
          if(is_get_coupon) {  //领过
            wx.redirectTo({
              url : `/changecoupon/received/received`
            })
          }else {
            wx.redirectTo({
              url : `/pages/share/share?channel=${channel}&delivery_id=${delivery_id}&token=${token}&gohome=1`
            })
          }
      }
    })
  }
})