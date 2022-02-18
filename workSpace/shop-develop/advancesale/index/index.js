import img from '../model/img.model'
import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
const config = require('../../src/config.js')
Page({
  data: {
    showloading : true,
    img,
    clotheslist : [
      {
        imgurl : img.clothes1,
        name : 'JS COLLAGE CREW NECK SWEAT',
        price : '599.00',
        path : '/pages/content/content?colorCode=219433508E38&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219433508E38'
      },
      {
        imgurl : img.clothes2,
        name : 'JS COLLAGE HOODIE SWEAT',
        price : '699.00',
        path : '/pages/content/content?colorCode=219433509C39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219433509C39'
      },
      {
        imgurl : img.clothes3,
        name : 'JS COLLAGE HOODIE SWEAT',
        price : '699.00',
        path : '/pages/content/content?colorCode=219433509E38&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219433509E38'
      },
      {
        imgurl : img.clothes4,
        name : 'JS COLLAGE ZIPUP HOODIE SWEAT',
        price : '749.00',
        path : '/pages/content/content?colorCode=219433510A28&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219433510A28'
      },
      {
        imgurl : img.clothes5,
        name : 'JS COLLAGE ZIPUP HOODIE SWEAT',
        price : '749.00',
        path : '/pages/content/content?colorCode=219433510E03&utm_medium=JS&utm_source=JJ&utm_term=20190920GoodList219433510E03'
      },
      {
        imgurl : img.clothes6,
        name : 'JS COLLEGE TROLLS DENIM TRUCKER JACKET',
        price : '999.00',
        path : '/pages/content/content?colorCode=219457505C39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219457505C39'
      },
      {
        imgurl : img.clothes7,
        name : 'JS COLLEGE TROLLS DENIM JEANS',
        price : '699.00',
        path : '/pages/content/content?colorCode=219432529C39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219432529C39'
      },
      {
        imgurl : img.clothes8,
        name : 'JS COLLEGE AWESOME COOL DENIM PARKA',
        price : '899.00',
        path : '/pages/content/content?colorCode=219457506E39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219457506E39'
      },
      {
        imgurl : img.clothes9,
        name : 'JS COLLEGE AWESOME COOL DENIM PARKA',
        price : '899.00',
        path : '/pages/content/content?colorCode=219457506E40&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219457506E40'
      },
      {
        imgurl : img.clothes10,
        name : 'JS TROLLS LETTERMAN WOOL JACKET-ST',
        price : '1499.00',
        path : '/pages/content/content?colorCode=219427526E51&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219427526E51'
      },
      {
        imgurl : img.clothes11,
        name : 'JS TROLLS LETTERMAN WOOL JACKET-ST',
        price : '1499.00',
        path : '/pages/content/content?colorCode=219427526E42&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219427526E42'
      },
      {
        imgurl : img.clothes12,
        name : 'JS AWESOMECOOL SWEAT PANTS',
        price : '599.00',
        path : '/pages/content/content?colorCode=219414522C39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219414522C39'
      },
      {
        imgurl : img.clothes13,
        name : 'JS AWESOMECOOL SWEAT PANTS',
        price : '599.00',
        path : '/pages/content/content?colorCode=219414522E40&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219414522E40'
      },
      {
        imgurl : img.clothes14,
        name : 'JS COLLAGE DOWN JACKET-MD',
        price : '1999.00',
        path : '/pages/content/content?colorCode=219412558F39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219412558F39'
      },
      {
        imgurl : img.clothes15,
        name : 'JS TROLLS REVERSIBLE PUFFER VEST-ST',
        price : '999.00',
        path : '/pages/content/content?colorCode=219412557E03&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219412557E03'
      },
      {
        imgurl : img.clothes16,
        name : 'JS AWESOME COOL DOWN JACKET-MD',
        price : '1799.00',
        path : '/pages/content/content?colorCode=219412556E41&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219412556E41'
      },
      {
        imgurl : img.clothes17,
        name : 'JS COLLAGE SWEAT PANTS',
        price : '799.00',
        path : '/pages/content/content?colorCode=219414523C39&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219414523C39'
      },
      {
        imgurl : img.clothes18,
        name : 'JS TIEDYE T-SHIRT',
        price : '349.00',
        path : '/pages/content/content?colorCode=219401503C41&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219401503C41'
      },
      {
        imgurl : img.clothes19,
        name : 'JS TIEDYE SWEAT PANTS',
        price : '599.00',
        path : '/pages/content/content?colorCode=219414521C41&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219414521C41'
      },
      {
        imgurl : img.clothes20,
        name : 'JS  PEACE T-SHIRT',
        price : '299.00',
        path : '/pages/content/content?colorCode=219401504A06&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219401504A06'
      },
      {
        imgurl : img.clothes21,
        name : 'JS  PEACE T-SHIRT',
        price : '299.00',
        path : '/pages/content/content?colorCode=219401504A28&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219401504A28'
      },
      {
        imgurl : img.clothes22,
        name : 'JS  PEACE T-SHIRT',
        price : '299.00',
        path : '/pages/content/content?colorCode=219401504E03&utm_medium=JS&utm_source=JJ&utm_term=20190916GoodList219401504E03'
      }
    ],
    bindloadok1 : false,
    bindloadok2 : false,
    imgloadCount : 0,
    pageheight : 0,
    animationheight1 : 0,
    animationheight2 : 0,
    animationheight3 : 0,
    animationheight4 : 0,
    animationclass1 : false,
    animationclass2 : false,
    animationclass3 : false,
    animationclass4 : false,
    cardInfo : {},
    entry : ''
  },
  onShow: function () {
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if(!openid || !unionid) {
      wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
      })
      return false
    }
    if(wx.getStorageSync('isStart') === 7) {
      wx.showLoading({
        title: ' ',
        icon: 'loading',
        // mask: true
      })
      return false
    }
    if(this.data.membercard == 1) {
      this.init(false)
      this.data.membercard == ''
      this.checkIsMember()
    }else{
      this.init(true)
      this.puuv(this.data.entry)
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: config.title
    })
  },
  onLoad(options) {
    let entry = options.entry?options.entry:2 //判断entry是1来自太阳码，其他来自公众号btn
    this.setData({
      entry
    })
    this.initanmation()
    if(options.membercard) {
      this.setData({
        membercard : options.membercard
      })
    }
  },
  godetail(e) {
    console.log(e.currentTarget.dataset.path)
    wx.navigateTo({
      url : e.currentTarget.dataset.path
    })
  },
  //puuv
  puuv(entry) {
    fetch({url: API.pvUv,data:{entry},loading:false}).then(res => {})
  },
  //检查是否是会员
  checkIsMember() {
    console.log('查询是否是会员')
    const me = this
    let unionid = wx.getStorageSync('unionid')
    wx.showLoading({
      title: ' ',
      icon: 'loading',
      // mask: true
    })
    wx.request({
      url: API.isMember,
      data: {
        brand: 2,
        unionid
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        console.log('查询会员结果',res.data)
        let {data, errcode, errmsg, activatemembercard_url,is_member, is_get_card } = res.data
        
        if ( errcode === 0 ) {
          // 是会员
          if ( is_member ) {
            me.record()
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
              cardInfo: data
            })
            this.memberRegistration()
          }
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content:'会员接口崩溃,再来一次呗！',
          showCancel: true,
          cancelText: '返回',
          cancelColor: '#000000',
          confirmText: '确定取消',
          confirmColor: '#3CC51F'
        })
      },
      complete: () => {
      }
    });
  },
  //会员开卡流程
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
            wx.setStorageSync('isStart', 7)
          },
          fail: function (res) {
            wx.hideLoading();
          }
        })
      }
    }) //设置参数 
  },
  //首页动画
  initanmation() {
    let _this = this
    let pageheight = wx.getSystemInfoSync().windowHeight
    this.setData({
      pageheight
    })
    wx.createSelectorQuery().select('#animation-item1').boundingClientRect(function(rect){
      if(rect) {
        _this.setData({
          animationheight1 : rect.height + rect.top - _this.data.pageheight
        })
      }
    }).exec()
    wx.createSelectorQuery().select('#animation-item2').boundingClientRect(function(rect){
      if(rect) {
        _this.setData({
          animationheight2 : rect.height + rect.top - _this.data.pageheight
        })
      }
    }).exec()
    wx.createSelectorQuery().select('#animation-item3').boundingClientRect(function(rect){
      if(rect) {
        _this.setData({
          animationheight3 : rect.height + rect.top - _this.data.pageheight
        })
      }
    }).exec()
    wx.createSelectorQuery().select('#animation-item4').boundingClientRect(function(rect){
      if(rect) {
        _this.setData({
          animationheight4 : rect.height + rect.top - _this.data.pageheight
        })
      }
    }).exec()
  },
  //首页状态
  init(flag) {
    fetch({url: API.index,data:{},loading:flag}).then(res => {
      let { data,errcode,errmsg } = res
      if(errcode == 0) {
        //有预约记录
        if(data.advance_book_record && JSON.stringify(data) != "{}") {
          wx.redirectTo({
            url: `/advancesale/success/success`
          })
          return false
        }
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
  //预约
  record() {
    console.log('开始预约----》')
    fetch({url: API.record,data:{},needUnionid:true}).then(res => {
      console.log('预约结果----》',res)
        let { data,errcode,msg } = res
        if(errcode == 0) {
          //预约成功
          wx.redirectTo({
            url: `/advancesale/success/success`
          })
          return false
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
          wx.redirectTo({
            url: `/advancesale/fail/fail`
          })
          return false
        }
      })
  },
  //附近门店
  gostore(e) {
    let tpl_id = e.target.dataset.tplid
    wx.navigateTo({
      url: `/advancesale/nearstore/storelist/storelist?tpl_id=${tpl_id}`
    })
  },
  //formid
  registerFormSubmit(e) {
    main.throttle(() => {
      if(e.detail.formId) {
        fetch({url: API.formid,data:{form_id:e.detail.formId},loading:false}).then(res => {})
      }
      this.checkIsMember()
    },1000)()
  },
  bindloadok2() {
    if(this.data.imgloadCount == 8 && this.data.bindloadok1) {
      this.setData({
        showloading : false
      })
    }else {
      this.setData({
        bindloadok2 : true
      })
    }
  },
  bindloadok1() {
    if(this.data.imgloadCount == 8 && this.data.bindloadok2) {
      this.setData({
        showloading : false
      })
    }else {
      this.setData({
        bindloadok1 : true
      })
    }
  },
  bindloadhand() {
    this.data.imgloadCount++
    this.setData({
      imgloadCount : this.data.imgloadCount
    })
    if(this.data.imgloadCount == 8 && this.data.bindloadok1 && this.data.bindloadok2) {
      this.setData({
        showloading : false
      })
    }
  },
  binderrorhand() {
    this.data.imgloadCount++
    this.setData({
      imgloadCount : this.data.imgloadCount
    })
    if(this.data.imgloadCount == 8 && this.data.bindloadok1 && this.data.bindloadok2) {
      this.setData({
        showloading : false
      })
    }
  },
  onPageScroll (e) { 
    if(e.scrollTop >= this.data.animationheight1) {
      if(!this.data.animationclass1) {
        this.setData({
          animationclass1 : true
        })
      }
    }
    if(e.scrollTop >= this.data.animationheight2) {
      if(!this.data.animationclass2) {
        this.setData({
          animationclass2 : true
        })
      }
    }
    if(e.scrollTop >= this.data.animationheight3) {
      if(!this.data.animationclass3) {
        this.setData({
          animationclass3 : true
        })
      }
    }
    if(e.scrollTop >= this.data.animationheight4) {
      if(!this.data.animationclass4) {
        this.setData({
          animationclass4 : true
        })
      }
    }
  },
  onShareAppMessage() {
      let path = `/advancesale/index/index`
      let imageUrl = `https://tc.woaap.com/lingzhi/sale/shares.jpg`
      return {
          title : 'JACK & JONES x JEREMY SCOTT设计师联名系列飓风来袭',
          path,
          imageUrl
      }
  }
})