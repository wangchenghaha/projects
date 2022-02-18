import Utils from '../../utils/utils'
import fetch from '../fetch/index'
import API from '../api/index'
let _app = null
Page({
  data: {
    screen: 0,
    shoplist: [],
    copy:[],
    name: '',
    nothing: false
  },
  onLoad: function (options) {
    let info = wx.getSystemInfoSync()
    let screen = info.windowHeight - 120 /750 * info.windowWidth
    _app = this
    this.setData({
      screen
    })
    this.gsl()
  },
  onReady: function () {

  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '选择店铺'
    })
  },
  makephonecall(e) {
    let { phone } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone
    });
      
  },
  selectThis(e) {
    let { item } = e.currentTarget.dataset
    wx.setStorage({
      key: 'shopInfo',
      data: item,
      success:() => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  // 获取店铺列表
  gsl() {
    fetch({url: API.user.getAllShop,data:{}}).then(res => {
      if (res.errcode === 0) {
        res.data = res.data.map(el => {
          return {
            name: el.store_name,
            address: el.store_address,
            shopcode: el.store_no,
            telephone: '010-654 4198',
            id: el.id
          }
        })
        this.setData({
          shoplist: res.data,
          copy: res.data,
          nothing: res.data == 0
        })
      }
    })
  },
  // 输入检索
  inputVal: Utils.debounce(e => {
    let {copy} = _app.data
    let { value } = e.detail

    let arr = copy.filter(el => el.name.search(value) > -1)

    console.log(e,'----------------',copy, arr)
    _app.setData({
      shoplist: arr,
      name: value,
      nothing: arr.length == 0
    })

  }, 240)
})