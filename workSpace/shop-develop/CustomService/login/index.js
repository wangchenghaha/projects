import fetch from '../fetch/index'
import API from '../api/index'
import Utils from '../../utils/utils'
import utils from '../common/utils/index'
let _app = null
Page({
  data: {
    ch: 0,
    warnObj: [{
      show: false,
      txt: '请输入用户名'
    }, {
      show: false,
      txt: '请输入密码'
    }],
    name: '',
    password: '',
    holder: ['请输入用户名','请输入密码'],
    banner: '',
  },
  onLoad: function (options) {
    _app = this
    let ch = wx.getSystemInfoSync().windowHeight - 124
    this.setData({
      ch
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      banner : wx.getStorageSync('CSB')
    })
  },
  inputBlur(e) {
    let { type } = e.currentTarget.dataset
    let { holder } = this.data
    if(type == 'name') {
      holder[0] = '请输入用户名'
    } else {
      holder[1] = '请输入密码'
    }
    this.setData({
      holder
    })
  },
  // 隐藏错误
  hideError(e) {
    let { index } = e.currentTarget.dataset
    let { warnObj } = this.data
    index = parseInt(index)
    warnObj[index].show = false
    this.setData({
      warnObj
    })
  },
  // 节流
  inputVal: Utils.debounce((e) => {
    let { type } = e.currentTarget.dataset
    console.log(e, type)
    if (type === 'name') {
      _app.setData({
        name: e.detail.value
      })
    }else if (type =='password') {
      _app.setData({
        password: e.detail.value
      })
    }
  }, 300),

  // 输入狂聚焦
  inputFocus(e)  {
    let { type } = e.currentTarget.dataset
    let { warnObj, holder } = this.data
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
  submitLoginfun() {
    let _this =this
    utils.throttle(() => {
      _this.submitLogin()
    },1000)()
  },
  // 立即登录
  submitLogin() {
      let { name, password, warnObj } = this.data
      if (!name) {
        warnObj[0].show = true
      } else {
        warnObj[0].show = false
      }
      if (!password) {
        warnObj[1].show = true
      } else {
        warnObj[1].show = false
      }

      console.log(this.data)

      if (warnObj.findIndex(el => el.show) > -1) {
        this.setData({
          warnObj
        })
        return
      }
      fetch({method: 'POST', url: API.staff.loginIn, data: {name,password}}).then(res => {
        if (res.errcode === 0) {
          wx.showToast({
            title: '登录成功',
            icon: 'title'
          })
          wx.redirectTo({
            url: '/CustomService/record/index'
          })
        }
      })
  },
})