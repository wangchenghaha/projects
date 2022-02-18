import Utils from '../../utils/utils'
import fetch from '../fetch/index'
import API from '../api/index'
import utils from '../common/utils/index'
let _app = null
let reg = /^[1][0-9]{10}$/
Page({
  data: {
    ch: 0,
    agree: false,
    warnObj: [{
      show: false,
      txt: ''
    }, {
      show: false,
      txt: ''
    }, {
      show: false,
      txt: ''
    }, {
      show: false,
      txt: ''
    }, {
      show: false,
      txt: ''
    }], // 错误提示
    holder: ['请输入姓名','请输入手机号'],
    mobile: null,
    name: '',
    shop: {},
    dateobj: {},
    timeobj: {},
    showDateBol:false,
    showtype: 'date',
    appoint_id: null,
    banner: '',
    dtl: {}
  },
  onLoad: function (options) {
    _app = this
    let ch = wx.getSystemInfoSync().windowHeight - 124
    let user = wx.getStorageSync('OrderUserInfo')
    this.setData({
      ch
    })
    if (user.name) {
      this.setData({
        name: user.name,
        mobile: user.mobile
      })
      this.gtl()
    } else {
      this.getUserInfo()
    }

    if (options.appoint_id) {
      this.getData(options.appoint_id)
      this.setData({
        appoint_id: options.appoint_id
      })
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约信息'
    })
  },
  onShow: function () {
    const me = this
    wx.getStorage({
      key: 'shopInfo',
      success: res => {
        me.setData({
          shop: res.data
        })
      }
    })
    this.setData({
      banner : wx.getStorageSync('CSB')
    })
  },
  // 改变类型
  changeshowtype(e) {
    this.setData({
      showtype: e.detail
    })
  },
  // shijiaochongzhi
  inputBlur(e) {
    let { type } = e.currentTarget.dataset
    let { holder } = this.data
    if (type === 'name') {
      holder[0] = '请输入姓名'
    } else {
      holder[1] = '请输入手机号'
    }
    this.setData({
      holder
    })
  },
  // 输入狂聚焦
  inputFocus(e)  {
    let { type } = e.currentTarget.dataset
    let { warnObj,holder } = this.data
    if (type === 'name') {
      warnObj[0].show = false
      holder[0] = ' '
    } else {
      warnObj[1].show = false
      holder[1] = ' '
    }
    this.setData({
      warnObj,
      holder
    })
  },
  // 隐藏错误提示
  hideError(e) {
    let { index } = e.currentTarget.dataset
    let { warnObj } = this.data
    index = parseInt(index)
    warnObj[index].show = false
    this.setData({
      warnObj
    })
  },
  changeVal(e) {
    this.setData({
      agree: !this.data.agree
    })
  },
  // 选择店铺
  selectShop() {
    let { warnObj } = this.data
    warnObj[2].show = false

    this.setData({
      warnObj
    })

    wx.navigateTo({
      url: '/CustomService/shoplist/index'
    })
  },
  // 选择日期
  selectDate() {
    let { warnObj } = this.data
    warnObj[3].show = false
    warnObj[4].show = false

    this.setData({
      warnObj,
      showtype: 'date',
      showDateBol: true
    })
  },
  // 选择时间
  selectTime () {
    let { warnObj } = this.data
    warnObj[3].show = false
    warnObj[4].show = false

    this.setData({
      warnObj,
      showtype: 'time',
      showDateBol: true
    })
  },
  // 选定日期
  chooseDate(e) {
    let { dateobj, timeobj } = e.detail
    this.setData({
      dateobj, 
      timeobj,
      showDateBol: false
    })
  },
  // 关闭日期弹窗
  hidedatemodal() {
    this.setData({
      showDateBol: false
    })
  },
  // 节流
  inputVal: Utils.debounce((e) => {
    console.log(e)
    let { type } = e.currentTarget.dataset
    if (type === 'name') {
      _app.setData({
        name: e.detail.value
      })
    } else {
      _app.setData({
        mobile: e.detail.value
      })
    }
  }, 300),
  // 提交数据
  submitFormfun() {
    let _this = this
    utils.throttle(() => {
      _this.submitForm()
    },1000)()
  },
  submitForm() {
    let { name, mobile, shop, dateobj, timeobj, warnObj, appoint_id } = this.data

    if (!name) {
      warnObj[0].show = true
      warnObj[0].txt = '请输入姓名'
    } else {
      warnObj[0].show = false
    }

    if (!mobile) {
      warnObj[1].show=true
      warnObj[1].txt = '请输入手机号'
    } else if (!reg.test(mobile)) {
      warnObj[1].show=true
      warnObj[1].txt = '请输入正确的手机号'
    } else {
      warnObj[1].show=false
    }

    if (!shop.address) {
      warnObj[2].show = true
      warnObj[2].txt = '请选择店铺信息'
    } else {
      warnObj[2].show = false
    }
    if (!dateobj.value) {
      warnObj[3].show = true
      warnObj[3].txt = '请选择预约日期'
    } else {
      warnObj[3].show = false
    }
    if (!timeobj.value && this.data.dtl.is_time == 1) {
      warnObj[4].show = true
      warnObj[4].txt = '请选择预约时间'
    } else {
      warnObj[4].show = false
    }
    this.setData({
      warnObj
    })
    if (warnObj.filter(el => el.show).length > 0) return
    let params = {
      name,
      mobile,
      store_no: shop.shopcode || '',
      store_name: shop.name || '',
      store_address: shop.address || '',
      appoint_time: `${dateobj.value}`,
      time: timeobj.value
    }
    if (appoint_id) {
      params.appoint_id = appoint_id
    }
    fetch({method: 'POST',url: API.user.order, data: params}).then(res => {
      let { errcode, errmsg } = res
      let data = res.data && res.data.data || {}
      if (errcode === 0) {
        wx.showToast({
          title: '预约成功',
          icon: 'none'
        })
        wx.redirectTo({
          url: `/CustomService/detail/index?appoint_id=${data.id}&isNew=${appoint_id?false:true}`
        })
      } else {
        wx.showToast({
          title: errmsg,
          icon: 'none'
        })
        wx.navigateTo({
          url: '/CustomService/fail/index'
        })
      }
    })
    
  },
  // 获取会员信息
  getUserInfo() {
    fetch({url: API.user.userInfo}).then(res => {
      let { errcode, data } = res
      if (errcode === 0) {
        wx.setStorageSync('OrderUserInfo', data)
        this.setData({
          name: data.name,
          mobile: data.mobile
        })
        this.gtl()
      }
    })
  },
  // 获取订单信息
  getData(appoint_id) {
    const me = this
    fetch({url: API.user.orderDetail, data: {appoint_id}}).then(res => {
      let { errcode, data } = res
      if (errcode === 0) {
        me.setData({
          name: data.name,
          mobile: data.mobile,
          shop: {
            shopcode: data.store_no,
            address: data.store_address,
            name: data.store_name
          },
          dateobj: {
            value: data.appoint_time
          },
          timeobj: {
            value: data.time
          }
        })
      }
    })
  },
  // 获取活动时间段
  gtl() {
    const me = this
    fetch({url: API.user.getTimeList, data: {}, hideToast: true}).then(res => {
      if (res.errcode === 0) {
        me.setData({
          dtl: res.data
        })
      }
    })
  }
})  