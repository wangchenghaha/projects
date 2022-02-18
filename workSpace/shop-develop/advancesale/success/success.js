import img from '../model/img.model'
import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
const config = require('../../src/config.js')
Page({
  data: {
    img,
    advance_book_record : {},
    membercard : ''  //会员开卡回来之后的标识
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: config.title
    })
  },
  onLoad(options) {
    this.init()
    // if(options.membercard) {
    //   this.setData({
    //     membercard : options.membercard
    //   })
    // }
  },
  onShow: function () {
    // if(wx.getStorageSync('isStart') === 7) {
    //   wx.showLoading({
    //     title: ' ',
    //     icon: 'loading',
    //     mask: true
    //   })
    //   return false
    // }
    // if(this.data.membercard == 1) {
    //   this.data.membercard == ''
    //   this.checkIsMember(true)
    // }
  },
  //首页状态
  init() {
    fetch({url: API.index,data:{}}).then(res => {
      let { data,errcode,errmsg } = res
      if(errcode == 0) {
        //有预约记录
        this.setData({
          advance_book_record : data.advance_book_record || {}
        })
      }else if(errcode == 74){
         wx.showModal({
          title: '提示',
          content: '活动结束',
          showCancel: false,
          success() {
             wx.switchTab({
                url: '/pages/index/index'
            })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: errmsg || '网络错误，稍后再试',
          showCancel: false
        })
      }
    })
  },
  //领券
  getcoupon() {
    main.throttle(() => {
      this.isHaveRecord()
    },1000)()
  },
  //查看卡券
  opencoupon() {
    main.throttle(() => {
      wx.openCard({
        cardList: this.data.advance_book_record.card_data,
        success (res) {
        }
      })
    },1000)()
  },
  //发送服务通知
  sendmessage() {
    fetch({url: API.sendmessage,data:{}}).then(res => {})
  },
  //是会员之后开始领券
  isHaveRecord() {
    let _this = this
    fetch({url: API.coupon,data:{},needUnionid:true}).then(res => {
      let { data,errcode,errmsg } = res
      if(errcode == 0) {
        //成功
        if(errcode == 0) {
          if(data.is_get_coupon == 0) {
            wx.addCard({
              cardList: data.cardList,
              success (res) {
                _this.updateCoupon()
              },
              complete(res) {
                _this.init()
              }
            })
          }
        }
      }else{
        wx.showModal({
          title: '提示',
          content: errmsg || '网络错误，稍后再试',
          showCancel: false
        })
      }
    })
  },
  //更新卡券状态
  updateCoupon() {
    fetch({url: API.updateCoupon,data:{}}).then(res => {
      let {errcode} = res
      if(errcode == 0) {
        this.init()
      }
    })
  },
  //formid
  registerFormSubmit(e) {
    if(e.detail.formId) {
      fetch({url: API.formid,data:{form_id:e.detail.formId}}).then(res => {})
    }
  },
  //附近门店
  gostore(e) {
    let tpl_id = e.target.dataset.tplid
    wx.navigateTo({
      url: `/advancesale/nearstore/storelist/storelist?tpl_id=${tpl_id}`
    })
  },
  //分享
  onShareAppMessage(res) {
      console.log(res.from)
      if (res.from === 'button') {
        this.isHaveRecord()
        this.sendmessage()
      }
      let path = `/advancesale/index/index`
      let imageUrl = `https://tc.woaap.com/lingzhi/sale/shares.jpg`
      return {
          title : 'JACK & JONES x JEREMY SCOTT设计师联名系列飓风来袭',
          path,
          imageUrl
      }
  }
})