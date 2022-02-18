// businessCouponSubpack/pages/index/index.js
import apiModel from '../../models/api.model'
import Fetch from '../../services/fetch'
import Util from '../../services/util'
import couponDataModel from '../../models/coupon.model'
import config from '../../../src/config.js'

// tabbar的页面路径
const TAB_BAR = [
  '/pages/index/index',
  '/pages/memberCenter/memberCenter',
  '/pages/informat/informat',
  '/pages/weMember/weMember',
  '/pages/nearbyShops/main/main',
]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowPage: false,
    channel: '',
    delivery_id: '',
    need_open_card: 1,
    guideid: '',
    storeid: '',
    wemember: '',
    channel_token: '',
    channel_tag: '',
    couponDatas: '',
    hadget: false,
    isNotShowBtn: true,
    isShowLocalBtn: false,
    isFromSet: false,
    cardList: [],
    isJumpRegister: false,
    optionStr: '',
    gzhData:{},//公众号信息数据
    gzhImgHeight:0,
    scrollHeight:0,
    isReady:false,
    subchannel:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)

    this.data.optionStr = this.getRouteStrByObj(e)
    console.log(this.data.optionStr, '========�========================')
    if (!e.channel || !e.delivery_id) {
      wx.showToast({
        title: '启动参数错误',
        icon: 'none'
      })
      return
    }
    this.setData({
      channel: e.channel,
      delivery_id: e.delivery_id,
      // need_open_card: 1,
      guideId: e.guideid || '',
      storeId: e.storeid || '',
      wemember: e.wemember || '',
      channel_token: e.channel_token || '',
      channel_tag: e.channel_tag || '',
      subchannel:e.subchannel || ''
    })
  },
  getRouteStrByObj(obj){
    let result = ''
    for(let key in obj){
      let value = obj[key]
      if(result){
        result +=  `&${key}=${value}`
      }else{
        result = `?${key}=${value}`
      }
    }
    return result
  },
  // registerCallBack() {
  //   wx.showToast({
  //     title: 'registerCallBack',
  //   })
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (this.data.hadget) {
      return
    }
    this.setData({
      isReady:false
    })
    wx.showLoading({
      title: '正在加载',
      icon: 'loading'
    })
    if (!this.data.isFromSet) {
      if (this.data.isJumpRegister) {
        setTimeout(() => {
          this.getcouponlist()
          this.getGzhData()

        }, 2000)
        return
      }
      this.getcouponlist()
      this.getGzhData()

    }
  },
  getGzhData(){
    const brand = config;
    console.info('configModel',brand.etoBrand)
    Fetch({
      url: apiModel.gzh_data,
      loading: false,
      data: {
        id: brand.etoBrand
      },
    }).then(res => {
      let { errcode, data, errmsg } = res.data
      if (errcode == 0) {
        this.setData({
          gzhData:data
        })
        console.log('公众号请求成功')
        return
      }
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
    })
  },
  jumpTo(){
    console.info('this.data.gzhData.launch_type',this.data.gzhData.launch_type)
    if(this.data.gzhData.launch_type == 1){//跳转小程序
      let url = '';
      if( this.data.gzhData.launch_addr.substr(0, 1) == '/'){
        url = this.data.gzhData.launch_addr
      }else{
        url = '/' + this.data.gzhData.launch_addr
      }
      let navtype = Util.isTabPage(url) ? 3 : 0;

      console.info(navtype,url)
      if(navtype){
        wx.switchTab({
          url:url,
          success: function(res){
            // success
          },
          fail: function() {
            wx.showModal({
              title: '提示',
              content: '路径错误',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          },
        })
      }else{
        wx.navigateTo({
          url: url,
          success: function(res){
            // success
          },
          fail: function() {
            wx.showModal({
              title: '提示',
              content: '路径错误',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          },
        })
      }

    }else{
      wx.navigateTo({
        url: `/businessCouponSubpack/pages/webView/webView?linkUrl=${this.data.gzhData.launch_addr}`,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }
  },
  imageLoad(e){
    console.info('图片加载完成',e)
    var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      gzhImgHeight: res.windowWidth / ratio
    })
    let obj = wx.createSelectorQuery();
    obj.selectAll('.gzh-area').boundingClientRect((rect)=>{
      console.info('rect',rect)
      this.setData({
        scrollHeight:rect[0].top - 80 / 750 * res.windowWidth
      })
    })
    obj.exec();
  },
  getDatas (params, cb) {
    let that = this
    Fetch({
      url: apiModel.coupon_exchange,
      loading: true,
      data: params,
    }).then(res => {
      let { errcode, data ,errmsg, mini_jump_url } = res.data
      if (errcode == 0) {
        cb && cb(data)
        return
      }

      if (errcode == 201) {
        wx.showModal({
          content: errmsg, //`您需要消耗${data.exchange_point}积分获取商家券`,
          success: (data) => {
            if (data.confirm) {
              that.getcouponlist({
                isConfirm: 1,
              })
              return
            }
            if (data.cancel) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
        return
      }
      if(errcode == 202) {
        wx.showModal({
          content: '本次活动需要地理定位，点确认授权',
          success: (data) => {
            if (data.confirm) {
              that.getlocalsetting()
              return
            }
            if (data.cancel) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
        return
      }
      wx.showModal({
        title: '提示',
        content: errmsg,
        showCancel: false,
        success: function(res) {
          that.setData({
            isNotShowBtn: false
          })
          // 判断路径是否是TAB_BAR
          if(mini_jump_url){
            let is_tab = TAB_BAR.findIndex(item => path == item)
            if(is_tab != -1){
              wx.switchTab({
                url: path
              })
              return
            }
            wx.redirectTo({
              url: path,
            })
            return
          }
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    })
  },
  getcouponlist (typeObj) {
    let { channel, delivery_id, guideId, storeId, wemember, need_open_card, subchannel } = this.data
    let params = { channel, delivery_id, guideId, storeId, wemember, need_open_card: need_open_card, isConfirm: 0, subchannel }
    if (typeObj) {
      params = {...params, ...typeObj}
    }
    this.getDatas( params, (res) => {
      console.info(res, '优惠券列表接口===========')
      // res.is_member = false // test

      if (!res.is_member) {
        if (!res.activatemembercard_url) {
          return
        }
        wx.showModal({
          content: '您不是会员，点确认入会',
          success: (data) => {
            if (data.confirm) {
              Util.memberRegistration(res.activatemembercard_url)
              // Util.memberRegistration('https://mp.weixin.qq.com/bizmall/activatemembercard?action=preshow&&encrypt_card_id=pghg7VHPIkZUz4F5FHs2UukF0UDgkKL6IxGzBshgJyof0Ri0t5liSJrwkok84Vmu&outer_str=20190920&biz=MzIzMTA0Nzg1OQ%3D%3D#wechat_redirect')
              wx.setStorageSync('isStart', 'etoGetCoupon')
              this.data.isJumpRegister = true
              setTimeout(() => {
                wx.setStorageSync('etoSendCouponPath', `/businessCouponSubpack/pages/index/index${this.data.optionStr}`)
              }, 100)
            }
          }
        })
        return
      }
      if (!res.is_get_card) {
        console.log(res, 124343)
        wx.addCard({
          cardList: res.cardList,
          success: function(data) {
            console.log(1243439)
            wx.showModal({
              content: '会员卡领取成功',
              showCancel: false
            })
          },
          fail: function(err) {
            console.log(err, '7888124343')
            console.log('会员卡领取失败')
          }
        })
      }
      if (res.is_get_card == 1 && res.is_card == 1) {
        wx.openCard({
          cardList: res.cardList,
          success: function(data) {
            console.log(1243439)
          },
          fail: function(err) {
            console.log(err, '7888124343')
          }
        })
      }

      this.setData({
        couponDatas: res
      },()=>{
        this.setData({
          isReady:true
        })
        wx.hideLoading()
      })
    })
  },
  hadgetcoupon (params) {
    console.log(params.detail, '===========发券回调数据')
    let { errcode, msg, send_coupon_result } = params.detail
    if (errcode == "OK") {
      let {code, coupon_code, message, out_request_no, stock_id} = send_coupon_result[0]
      if (code == "SUCCESS") {
        // setTimeout(() => {
        // }, 10)
        this.setData({
          hadget: true
        }, () => {
          this.getupdatecoupon()
        })
      } else {
        wx.showModal({
          content: message,
          showCancel: false
        })
      }
    } else {
      wx.showModal({
        content: message,
        showCancel: false
      })
    }
  },
  getupdatecoupon () {
    Fetch({
      url: apiModel.coupon_update,
      loading: true,
      data: {
        channel: this.data.channel,
      },
    }).then(res => {
      let { errcode, data ,errmsg } = res.data
      if (errcode == 0) {
        console.log('领券更新成功')
        return
      }
      wx.showModal({
        title: '提示',
        content: errmsg,
        showCancel: false
      })
    })
  },
  getopencoupondata (cb) {
    Fetch({
      url: apiModel.coupon_card_data,
      loading: false,
      data: {
        channel: this.data.channel,
        record_id: this.data.couponDatas.record_id
      },
    }).then(res => {
      console.log( res ,'获取打开卡包数据成功')
      let { errcode, data ,errmsg } = res.data
      if (errcode == 0) {
        cb && cb(data.cardList.cardList)
        return
      }
      wx.showModal({
        title: '提示',
        content: errmsg,
        showCancel: false
      })
    })
  },
  tolookcoupon() {
    // if (this.data.cardList.length) {
    //   this.opencard()
    //   return
    // }
    // this.getopencoupondata((res) => {
    //   console.log(res)
    //   this.setData({
    //     cardList: res
    //   }, () => {
    //     this.opencard()
    //   })
    // })



    if(this.data.couponDatas.mini_jump_url){
      let navtype = Util.isTabPage(this.data.couponDatas.mini_jump_url) ? 3 : 0;
      if(navtype){
        wx.switchTab({
          url: this.data.couponDatas.mini_jump_url,
        })
      }else{
        wx.navigateTo({
          url: this.data.couponDatas.mini_jump_url,
        })
      }
      return
    }
    if(this.data.cardList.length){
      if(this.data.cardList.length > 1){
        couponDataModel.couponData = this.data.cardList;
        couponDataModel.couponInfoData = this.data.couponDatas;
        couponDataModel.gzhData = this.data.gzhData;
        wx.navigateTo({
          url: '/businessCouponSubpack/pages/couponList/couponList',
        })
      }else{
        this.opencard()
      }
    }else{
      this.getopencoupondata((res) => {
        this.data.cardList = res;
        if(this.data.cardList.length > 1){
          couponDataModel.couponData = this.data.cardList;
          couponDataModel.couponInfoData = this.data.couponDatas;
          couponDataModel.gzhData = this.data.gzhData;
          wx.navigateTo({
            url: '/businessCouponSubpack/pages/couponList/couponList',
          })
        }else{
          this.opencard()
        }
      })
    }

  },
  opencard () {
    wx.openCard({
      cardList: this.data.cardList,
      success: function() {
        console.log('成功进入opencard');
      },
      fail: function(res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  getlocalsetting() {
    const that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation'] == false) {
          that.setData({
            isFromSet: true
          })
          wx.openSetting({
            success: (result)=>{
              console.log(result)
              wx.authorize({
                scope: 'scope.userLocation',
                success: function (res) {
                  console.log("授权成功");
                  that.getlocation()
                }
              })
            },
            fail: (err)=>{
              wx.showModal({
                title: '提示',
                content: '授权失败请重试',
                showCancel: false,
              })
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function (res) {
              console.log("授权成功");
              that.getlocation()
            },
            fail: (err)=>{
              that.setData({
                isShowLocalBtn: true
              })
            }
          })
        }
      }
    })
  },
  getlocation() {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          isShowLocalBtn: false
        })
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.getLocationSelf(latitude, longitude);
      }
    })
  },
  getLocationSelf: function(lat, lng) {
    var _this = this;
    wx.request({
      url: apiModel.coupon_location,
      data: { lat, lng },
      method: 'POST',
      success: function(res) {
        var location = {};
        location.nation = res.data.data.nation;
        location.province = res.data.data.province;
        location.city = res.data.data.city;
        location.district = res.data.data.district;
        _this.getcouponlist(location);
      }
    })
  },
})
