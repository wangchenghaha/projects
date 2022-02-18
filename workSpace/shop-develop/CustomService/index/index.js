import fetch from '../fetch/index'
import API from '../api/index'
import { getWeChatInfo } from '../../service/user'
import { KEYSTORAGE } from '../../src/const'
import utils from '../common/utils/index'
const app = getApp();
const brand = app.config.brand;
Page({
  data: {
    ch: 0,
    isAuth: true,
    haslist: true,
    showModal: false,
    cardInfo: {}, //开卡组件参数，
    needCardModal: false,
    is_appints: 0,
    io: {},
    isNotStart: false,
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular : true,
    loadindex : false
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
       wx.setStorageSync('ac_number', options.ac_number)
    }
    this.setData({
      ch,
      isAuth: !openid || !unionid ? false: true
    })
    
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '特殊定制'
    })
  },
  onShow: function () {
    let _this = this
    setTimeout(() => {
      console.log('获取轮播图')
      let ac_number = wx.getStorageSync('ac_number')
      console.log('ac_number1...',ac_number)
      _this.indexinfo(ac_number)
    }, 17);
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    let flag = !openid || !unionid? false: true
    if(!flag) {
      return 
    }
    if(wx.getStorageSync('isStart') === 3) {
      wx.showLoading({
        title: ' ',
        icon: 'loading',
        mask: true
      })
      return
    }
    console.log('开始从新检测')
    console.log('backCustomService',wx.getStorageSync('backCustomService'))
    if(wx.getStorageSync('backCustomService') == 1) {
      wx.removeStorageSync('backCustomService')
      this.checkIsMember(true)
    }else{
      this.checkIsMember()
    }
  },
  indexinfo(ac_number) {
    console.log('ac_number',ac_number)
    if(ac_number) {
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
          console.log('res---------->',res.data)
          if (errcode === 0) {
            if (res.data.activity_info.banner) {
              // 存储数据
              wx.setStorageSync('CSB', res.data.activity_info.banner)
              wx.setStorageSync('imgUrls', JSON.stringify(res.data.activity_info.carousel_map))
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
    }
  },
   getUserAuth2(e) {
    //  return false
    const me = this
    if (e.detail.errMsg === 'getUserInfo:ok'){
      wx.showLoading({
        title: ' ',
        icon: 'loading',
        mask: true
      })
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
            me.checkIsMember(true,true)
          })
        },
        complete:function() {
          wx.hideLoading()
        }
      })
    }
    
  },
  // 获取用户信息
  getUserAuth(e) {
    // return false
    const me = this
    if (e.detail.errMsg === 'getUserInfo:ok'){
      wx.showLoading({
        title: ' ',
        icon: 'loading',
        mask: true
      })
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
            me.checkIsMember(true)
          })
        },
        complete:function() {
          wx.hideLoading()
        }
      })
    }
    
  },

  // 根据unionid判断是否授权
  checkIsMember(bol = false,bol2 = false) {
    console.log('查询会员')
    console.log('查询会员',bol,bol2)
    const me = this
    let unionid = wx.getStorageSync('unionid')
    // me.isHaveRecord(bol)
    // return
    wx.showLoading({
      title: ' ',
      icon: 'loading',
      mask: true
    })
    
    wx.request({
      url: API.user.isMember,
      data: {
        brand: API.ETO_BRAND[brand],
        unionid
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      success: (res) => {
        console.log('查询会员结果',res.data)
        let {data, errcode, errmsg, activatemembercard_url,is_member, is_get_card } = res.data
        
        if ( errcode === 0 ) {
          // 是会员
          if ( is_member ) {
            wx.setStorageSync('ismember', true)
            wx.setStorageSync('activeCard', true)
            me.isHaveRecord(bol,bol2)
          }else {
            //没有领过卡正常走开卡
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
            me.setData({
              cardInfo: data,
              needCardModal: true,
              showModal: true
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content:errmsg || '会员接口崩溃,再来一次呗！',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                me.checkIsMember(true)
              }else {
                me.isHaveRecord(true)
              }
            },
          })

        }
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content:'会员接口崩溃,再来一次呗！',
          showCancel: true,
          cancelText: '返回',
          cancelColor: '#000000',
          confirmText: '确定取消',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              me.checkIsMember(true)
            }else {
              me.isHaveRecord(true)
            }
          },
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    });
      

  },

  // 判断是否有预约存在
  isHaveRecord(bol,bol2) {
    console.log('预约参数',bol,bol2)
    fetch({url: API.user.isOrderList, hideToast: true}).then(res => {
      console.log('预约结果',res)
      let { errcode } = res
      if (bol) {
        if(bol2) {
           wx.navigateTo({
            url: '/CustomService/myrecord/index'
          })
          return 
        }
        if (res.data.is_appints) {
          this.setData({
            showModal: true
          })
        } else {
          wx.navigateTo({
            url: '/CustomService/form/index'
          })
        }
      }
      if (errcode === 0) {
        this.setData({
          isNotStart: res.data.activity_info.status!=='进行中',
          io: res.data.activity_info,
          is_appints: res.data.is_appints,
          imgUrls : res.data.activity_info.carousel_map
        })
      }
    })
    
  },
  /**
   *  跳转微信原生开卡
   * @param {*} data  微信需要的参数
   */
  memberRegistration() {
    let data = this.data.cardInfo
    const me = this
    wx.setStorage({
      key: 'isLogin',
      data: true,
      success: function(res){
        wx.navigateToMiniProgram({
          appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
          extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
          success: function (res) {
            wx.setStorageSync('isStart', 3);
            me.setData({
              needCardModal: false,
              showModal: false
            })
          },
          fail: function (res) {
            wx.hideLoading();
          }
        })
      }
    }) //设置参数 
  },
  stop() {
    return false
  },
  hidemodal() {
    this.setData({
      showModal: false
    })
  },
  // 开始预约订单
  activeRunningfun() {
    let _this = this
    utils.throttle(() => {
      _this.activeRunning()
    },1000)()
  },
  activeRunning() {
    let ismember =wx.getStorageSync('ismember', true)
    let activeCard = wx.getStorageSync('activeCard', true)
    if (!ismember || !activeCard)  {
      this.checkIsMember(true)
      return
    }
    if (this.data.is_appints) {
      this.setData({
        showModal: true
      })
      return
    }
    
    wx.navigateTo({
      url: '/CustomService/form/index'
    })
  },
  // 查看正在进行中的服务
  checkOrder() {
    this.setData({
      showModal: false
    })
    wx.navigateTo({
      url: '/CustomService/myrecord/index'
    })
  },
  // 查看我的预约
  checkOrderListfun() {
    let _this = this
    utils.throttle(() => {
      _this.checkOrderList()
    },1000)()
  },
  checkOrderList() {
    let ismember =wx.getStorageSync('ismember', true)
    let activeCard = wx.getStorageSync('activeCard', true)
    if (!ismember || !activeCard)  {
      this.checkIsMember(true,true)
      return
    }
    wx.navigateTo({
      url: '/CustomService/myrecord/index'
    })
  },
  // 活动未开始提示
  tn() {
    this.setData({
      showModal: true
    })
  },
  // 用户知道
  ik(){
    this.setData({
      showModal: false
    })
  },
   onPageScroll(e){
     console.log(e)
  },

})