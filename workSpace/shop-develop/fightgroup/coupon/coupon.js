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
      isloading : false,
      showalert : false,
      token : '',
      showoption : {
        type : 1,
        show : false,
        alerttext : '',
        btntext : ''
      },
      couponlist : img.couponlist,
      basecolor : img.basecolor,
      couponbg : img.couponbg,
      jointip2:img.jointip2,
      showbtn : false
  },
  onShow: function () {
    this.is_get_coupon()
    console.log(this.data.jointip2)
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '组团详情'
    })
  },
  onLoad(options) {
    let fighttoken = wx.getStorageSync('fighttoken')
    if(!options.token && !fighttoken) {
      wx.showToast({
        title: '缺少参数',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let token = options.token || fighttoken
    wx.setStorageSync('fighttoken',token)
    console.log('token',token)
    this.setData({
      token : token,
      isloading : true
    })
  },
  is_get_coupon() {
    let _this = this
    fetch({url: API.is_get_coupon,data:{token:this.data.token}}).then(res => {
      let {errcode,errmsg, data:{is_get_coupon} } = res
      if(errcode == 0) {
        if(is_get_coupon == 1 ) {
          wx.redirectTo({
            url: `/fightgroup/result/result?token=${this.data.token}`
          })
          return false
        }
      }
      _this.setData({
        showbtn : true
      })
      let activecoupon = wx.getStorageSync('activecoupon2')
      let fighttoken = wx.getStorageSync('fighttoken')
      if(activecoupon && fighttoken) {
        _this.setData({
          token:fighttoken
        })
        _this.getcoupon()
      }
    }).catch(err => {
      _this.setData({
        showbtn : true
      })
      let activecoupon = wx.getStorageSync('activecoupon2')
      let fighttoken = wx.getStorageSync('fighttoken')
      if(activecoupon && fighttoken) {
        _this.setData({
          token:fighttoken
        })
        _this.getcoupon()
      }
    })
  },
  _getcoupon() {
    let _this = this
      main.throttle(function(){
        _this.getcoupon()
      },5000)()
  },
  //领券
  getcoupon() {
    console.log(wx.getStorageSync('isStart') === 5)
    if(wx.getStorageSync('isStart') === 5) {
      wx.showLoading({
        title: ' ',
        icon: 'loading',
        mask: true
      })
      return
    }
    this.checkIsMember()
  },
  //是否是会员
  checkIsMember() {
    // const me = this
    let _this = this
    fetch({url: API.isMember,data:{token:this.data.token}, needUnionid : true}).then(res => {
      console.log('couponres------>',res)
      wx.hideLoading();
      let {errcode,errmsg, data:{activatemembercard_url,is_member, is_get_card,is_get_coupon} } = res
      if ( errcode === 0 ) {
        if(is_get_coupon) {  //已领过券
          wx.redirectTo({
            url: `/fightgroup/result/result?token=${this.data.token}`
          })
        }else{    //未领过券
          // 是会员
          if ( is_member ) {
            this.addCardJump(res);
          }else {
          if(is_get_card == 1) {  //已领过卡
            wx.openCard({
              cardList: data.cardList,
              success: function () {
                console.log('成功进入opencard');
              },
              fail: function (res) {
                wx.showToast({
                  title: res,
                  icon: 'none'
                })
              }
            })
          }else{  //没领过卡，去领卡
            var url = activatemembercard_url;
            var a = url.split("#")[0];
            var b = a.split("?")[1].split("&");
            var result = {};
            for (var i = 0; i < b.length; i++) {
              var c = b[i].split("=");
              result[c[0]] = c[1];
            }
            let data = {
              biz: decodeURIComponent(result.biz),
              encrypt_card_id: decodeURIComponent(result.encrypt_card_id),
              outer_str: decodeURIComponent(result.outer_str)
            }
            console.log("传入data",data);
            _this.memberRegistration(data)
          }
          }
        }
      } else {
        wx.showModal({
          title: '提示',
          content:errmsg || '会员接口崩溃,再来一次呗！',
          showCancel: false
        })

      }
    })
  },

  /**
   *  跳转微信原生开卡
   * @param {*} data  微信需要的参数
  */
  memberRegistration(data) {
    wx.setStorage({
      key: 'isLogin',
      data: true,
      success: function(res){
        wx.navigateToMiniProgram({
          appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
          extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
          success: function (res) {
            wx.setStorageSync('isStart', 5);
            wx.setStorageSync('activecoupon2',true);
          },
          fail: function (res) {
            console.log(res, "navigateToMiniProgram-fail");
            wx.hideLoading();
          }
        })
      },
      fail: function() {
        // fail
      }
    }) //设置参数 
  },
  /**
   * 领券并跳转
  */
  addCardJump(res) {
    let _this = this
    wx.addCard({
      cardList: res.data.cardList,
      success: function (back) {
        _this.updateCouponStatus()
      },
      fail: function () {
        // wx.navigateBack({delta: 1})
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
  //更新领卡状态
  updateCouponStatus() {
    let _this = this
    fetch({url: API.updateCouponStatus,data:{token:this.data.token}, needUnionid : true}).then(res => {
     if(res.errcode == 0) {
      wx.navigateTo({
        url : `/fightgroup/result/result?token=${_this.data.token}`
      })
     }
    })
  },
  onShareAppMessage() {
    return main.baseshare(this.data.token)
  }
})