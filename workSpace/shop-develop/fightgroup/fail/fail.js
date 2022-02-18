import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../model/img-model'
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
  data: {
    brand,
      bigPhone : main.judgeBigScreen(),
      showrule : false,
      showalert : false,
      couponlist : img.couponlist,
      imgmodel : {
        groupbg_s : img.groupbg_s,
        groupbg : img.groupbg,
        groupcardbg : img.groupcardbg,
        fail : img.fail
      },
      basecolor:img.basecolor,
      showoption : {
        type : 1,
        show : false,
        alerttext : '',
        btntext : ''
      },
  },
  onShow: function () {
    
  },
  onLoad(options) {
  },
  clicksure(obj) {
    obj.detail.success && obj.detail.success();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '组团详情'
    })
  },
    //开启拼团
    openGroup() {
      let userInfo = wx.getStorageSync('userInfo')
      let avatarUrl = userInfo.avatarUrl || 'https://tc.woaap.com/lingzhi/fightgroup/user.png'
      let data = {
        avatar_url : avatarUrl,
        token : this.data.token
      }
      fetch({url: API.open,data,method:'POST'}).then(res => {
        let { data,errcode,errmsg } = res
        if(errcode == 0) {
          if(data.is_open) {  //是否开过团
            this.setData({
              showoption : {
                type : 1,
                show : true,
                alerttext : '每个用户仅可开团一次，但仍可\n不限次数邀请好友参团或开团，快\n邀请好友一起参加吧',
                btntext : '我知道了',
                success() {
                  wx.navigateTo({
                    url: `/fightgroup/group/group?token=${data.token}`
                  })
                }
              }
            })
          }else{
            wx.navigateTo({
              url: `/fightgroup/group/group?token=${data.token}`
            })
          }
        }else if(errcode == 201) {
          this.endfun()
        }else if(errcode == 202) {
          this.startfun()
        }
      })
    },
  endfun() {
    this.setData({
      showoption : {
        type : 1,
        show : true,
        alerttext : '您来晚了，活动已结束！',
        btntext : '我知道了',
        success() {
          wx.switchTab({
              url: '/pages/index/index'
          })
        }
      }
    })
  },
  startfun() {
    this.setData({
      showoption : {
        type : 1,
        show : true,
        alerttext : '您来早了，活动未开始！',
        btntext : '我知道了',
        success() {
          wx.switchTab({
              url: '/pages/index/index'
          })
        }
      }
    })
  },
  coupondetail(){
    wx.navigateTo({
        url: '/fightgroup/index/index'
    })
  },
  shareRecord() {
    fetch({url: API.shareRecord,data:{token:this.data.token}}).then(res => {})
  },
  onShareAppMessage() {
    return main.baseshare()
  }
})