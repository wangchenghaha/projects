import fetch from '../fetch/index'
import API from '../api/index'
import Utils from '../../utils/utils'
let _app = null
Page({
  data: {
    searchVal: '',
    tabIndex: 1,
    showSearch: false,
    notLogin: false,
    page: 1,
    pageSize: 20,
    datalist: [],
    total: 0,
    checkdetail: false,
    oneItem: {}
  },
  onLoad: function (options) {
    _app = this
    this.getData()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  changeIndex(e) {
    let { index } = e.currentTarget.dataset
    index = parseInt(index)
    this.setData({
      tabIndex: index
    })
    this.getData()
  },
  // 开启搜索
  startSearch() {
    this.setData({
      showSearch: true
    })
  },
  // 隐藏搜搜狂
  cancelsearch() {
    this.setData({
      showSearch: false
    })
  },
  // 组织冒泡
  stop() {
    return 
  },
  // 获取数据
  getData() {
    const me = this
    let params = {
      page: 1,
      count: me.data.pageSize,
      search: me.data.searchVal,
      status: me.data.tabIndex
    }
    fetch({url: API.staff.orderList, data: params}).then(res => {
      let { errcode } = res
      if (errcode === 0) {
        me.setData({
          datalist: res.data.data,
          total: res.data.total
        })
      } else {
        wx.redirectTo({
          url: '/CustomService/login/index'
        })
      }
    })

    this.setData({
      showSearch: false
    })
  },
  // 查看详情
  checkDetail(e) {
    let { item } = e.currentTarget.dataset
    if (item.status!==1) return
    item.isHasReback = null
    item.rebackNumber = null
    this.setData({
      oneItem: item,
      checkdetail: true
    })
  },
  // 关闭详情弹窗
  closeDetailModal() {
    this.setData({
      checkdetail: false
    })
  },
  // 修改是否有复购状态
  changeRebackStatus(e) {
    let { status } = e.currentTarget.dataset
    let { oneItem } = this.data
    oneItem.isHasReback = status == 0 ? false : true
    this.setData({
      oneItem
    })
  },
  // 拨打电话
  makephonecall(e) {
    let { mobile } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  // 节流
  inputVal: Utils.debounce((e) => {
    let { type } = e.currentTarget.dataset
    console.log(e, type)
    if(type =='search') {
      _app.setData({
        searchVal: e.detail.value
      })
    }else {
      let { oneItem } = _app.data
      oneItem.rebackNumber = e.detail.value
      _app.setData({
        oneItem
      })
    }
  }, 300),

  // 上拉加载
  bindscrolltolower() {
    const me = this
    let { page, total, pageSize, datalist } = this.data

    page++
    if (page > Math.ceil(total / pageSize)) return

    let params = {
      page: page,
      count: me.data.pageSize,
      search: me.data.searchVal,
      status: me.data.tabIndex
    }
    fetch({url: API.staff.orderList, data: params}).then(res => {
      let { errcode } = res
      if (errcode === 0) {
        datalist = datalist.concat(res.data.data)
        me.setData({
          datalist,
          total: res.data.total
        })
      } else {
        wx.redirectTo({
          url: '/CustomService/login/index'
        })
      }
    })
  },
  // 完成订单
  completeOrder() {
    const me = this
    let { oneItem } = this.data
    let params = {
      nickname: wx.getStorageSync('userInfo').nickName,
      appoint_id: oneItem.id,
      re_buy: oneItem.isHasReback ? 1: 0
    }
    if (oneItem.isHasReback) {
      params.amount = oneItem.rebackNumber
    }
    
    fetch({method: 'POST', data: params,url: API.staff.overOrder}).then(res => {
      if (res.errcode === 0) {
        wx.showToast({
          title: '订单已完成',
          icon: 'none'
        })
        me.getData()
        me.setData({
          checkdetail: false
        })
      } else if (res.errcode == 299) {
        wx.redirectTo({
          url: '/CustomService/login/index'
        })
      }
    })
  },
  // 取消订单
  cancelOrder() {
    const me = this
    let { oneItem } = this.data
    let params = {
      nickname: wx.getStorageSync('userInfo').nickName,
      appoint_id: oneItem.id
    }

    wx.showModal({
      title: '提示',
      content: '是否取消该预约？',
      showCancel: true,
      cancelText: '返回',
      cancelColor: '#000000',
      confirmText: '确定取消',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          fetch({method: 'POST', data: params, url: API.staff.cancelOrder}).then(res => {
            if (res.errcode === 0) {
              wx.showToast({
                title: '订单取消成功',
                icon: 'none'
              })
              me.getData()
              me.setData({
                checkdetail: false
              })
            } else {
              wx.redirectTo({
                url: '/CustomService/login/index'
              })
            }
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
    
  }
})