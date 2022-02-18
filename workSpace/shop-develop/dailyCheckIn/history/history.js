// dailyCheckIn/history/histroy.js
import {
  queryRedeemableList, getRedeemPrizeHistroy, perfromRedeem
} from '../dailycheckin'
import { splitImg, formatDate, isArrayEmpty, throttle } from '../../utils/utils'
let app = getApp()
const cdn = app.config.cdn
const brand = app.config.brand
var couponList = []
var historyList = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CDN_HOST: app.config.DEV ? `http://db.vm.cn` : cdn,
    couponList: [],
    historyList: [],
    tabTitles: ['兑换礼品', '兑换记录'],
    tabIndex: 0,
    imgCouponNoStock: `${cdn}/assets/common/pub/image/daily_checkin_coupon_no_stock.png`,
    imgCouponReceived: `${cdn}/assets/common/pub/image/daily_checkin_coupon_already_receive.png`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.phone = options.phone
    this.userid = options.userid
    // let titles = []
    // if (brand == "FOL") {
    //   titles = ['兑换礼品', '兑换记录']
    // } else {
    //   titles = ['兑换记录']
    // }
    // this.setData({ tabTitles: titles })
    this._refreshList()
  },

  _refreshList: function (ev) {
    wx.showLoading({
      title: "加载中...",
    })
    let promiseList = []
    promiseList.push(queryRedeemableList({ brand: brand }))
    promiseList.push(getRedeemPrizeHistroy({
      userId: this.userid, brand: brand, phone: this.phone,
    }))
    Promise.all(promiseList).then(list => {
      if (!isArrayEmpty(list[0])) {
        couponList = list[0]
      }
      if (!isArrayEmpty(list[1])) {
        historyList = list[1]
        for (const coupon of couponList) {
          for (const his of historyList) {
            if (coupon.couponId == his.couponId) {
              coupon.hasRedeemed = true
              break
            }
            his.showDateStr = formatDate(his.createdTime, true)
          }
        }
      }
      this.setData({
        couponList,
        historyList
      })
      let page = getCurrentPages()[getCurrentPages().length - 2]
      if (page) {
        page.setData({ couponList })
      }
      wx.hideLoading();
    })
      .catch(e => {
        wx.hideLoading();
        console.log(">>>>>>>>>>>>>>>>>      queryRedeemableList   errrrrrr    ")
        console.log(e)
      })
  },

  _onCouponItemClick: function (ev) {
    if (!throttle()) return
    console.log(ev)
    let index = ev.currentTarget.dataset.id
    let coupon = this.data.couponList[index]
    let hasRedeemed = coupon.hasRedeemed
    if (hasRedeemed) {
      wx.showModal({
        title: '提示',
        content: '您已兑换过这张优惠券',
        showCancel: false,
      });
      return
    }
    let totalCount = coupon.cardCount
    if (totalCount <= 0) {
      wx.showModal({
        title: '提示',
        content: '很抱歉，这个优惠券已没有库存',
      });
      return
    }
    wx.showLoading({
      title: "加载中...",
    })
    let bean = {
      "brand": brand,
      "count": 1,
      "couponId": coupon.couponId,
      "couponName": coupon.redeemName,
      "couponUrl": coupon.couponId,
      "redeemId": coupon.id,
      "phone": this.phone,
      "points": coupon.points,
      "redeemType": coupon.redeemType,
      "userId": this.userid
    }
    perfromRedeem(bean)
      .then(res => {
        wx.showToast({
          title: `兑换成功`,
          duration: 2000,
        });
        this._refreshList()
      })
      .catch(e => {
        wx.hideLoading();
        if (app.config.DEV) {
          wx.showModal({
            title: '测试环境提示',
            content: `${e.message}`,
          });
        }
        console.log(e)
      })
  },

  _onTabChange: function (ev) {
    console.log(ev)
    let index = ev.detail.index
    this.setData({ tabIndex: index })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})