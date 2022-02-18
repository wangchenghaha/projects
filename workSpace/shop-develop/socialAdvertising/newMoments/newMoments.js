// socialAdvertising/newMoments/newMoments.js
import { splitImg } from '../../utils/utils'
import { EVENTS, KEYSTORAGE } from '../../src/const.js'
import events from '../../src/events'
import { isMember } from '../../service/user.js'
const app = getApp();
const brand = app.config.brand;
var shareFlag = "N"
let memTermMap = new Map([
  ["1MPMOMENT01", 0],
  ["1MPMOMENT02", 1],
  ["1MPMOMENT03", 2],
  ["1MPMOMENT21", 3],
  ["1MPMOMENT30", 4],
  ["1MPMOMENT31", 5],
  ["1SOUYS02", 6],
  // ]);
  // let newCusTermMap = new Map([

  ["1MPMOMENT04", 7],
  ["1MPMOMENT05", 8],
  ["1MPMOMENT06", 9],
  ["1MPMOMENT07", 10],
  ["1MPMOMENT08", 11],
  ["1MPMOMENT16", 12],
  ["1MPMOMENT17", 13],
  ["1MPMOMENT18", 14],
  ["1MPMOMENT19", 15],
  ["1MPMOMENT20", 16],

  ["1KAPPOP01", 17],
  ["1KAPPIS01", 18],
  ["1MPMOMENT15", 19],
]);

let memDeliveryIdList = ["4892", "4893", "4894", "4895", "4901", "4908", "4909", "4910"]
let newCusDeliveryIdList = ["4880", "4881", "4882", "4883", "4884", "4886", "4887", "4888", "4889", "4890"]
let kuaikanIdList = ["4912", "4913", "4885"]

let idList = memDeliveryIdList.concat(newCusDeliveryIdList).concat(kuaikanIdList)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUtmOptions(options);
    app.checkLogin()
    // getApp().isMemberETO()
    // if (!wx.getStorageSync('isMember')){
    //   getApp().isMemberETO()
    // }
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign
    shareFlag = options.shareFlag == "Y" ? "Y" : "N"
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady >>> ")

    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(`onReady >>>  windowHeight =${windowHeight}   windowWidth=${windowWidth} `)
    this.windowWidth = windowWidth
  },


  onCouponClick: function (ev) {
    console.log(ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    // let list = alreadyMember ? memDeliveryIdList : newCusDeliveryIdList
    let list = idList
    let index = memTermMap.get(this.utm_term)
    let channel = index < 7 ? "channel5fb2260d5a512" : "channel5fb21c6d7350d"
    let deliveryId = list[index]

    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=${channel}&delivery_id=${deliveryId}`,
    });
  },

  onGameClick: function (ev) {
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.navigateTo({
      url: `/activesubpack/pages/egg/index/index?activity_id=13&channel_id=48`,
    });
  },

  onGoodClick: function (ev) {
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    let colorCode = ev.currentTarget.dataset.colorCode
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    });
  },


  onIndexClick: function (ev) {
    console.log("onGoodClick  >>>>", ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  _injectTdsdk: function (btName) {
    app.tdSdkEvent('pageclick_camp_button', {
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_term: this.utm_term,
      utm_campaign: this.utm_campaign,
      share_flag: shareFlag,
      camp_button: btName,
    });
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (ev) {
    let utmParam = `&utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
    return {
      path: `/socialAdvertising/newMoments/newMoments?shareFlag=Y${utmParam}`
    }
  },


})