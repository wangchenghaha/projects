// socialAdvertising/newMomentsDynamic/newMomentsDynamic.js
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
let memDeliveryIdList = ["4892", "4893", "4894", "4901", "4908", "4909", "4910"]
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
    fromKuaiKanApp: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad >>>  ", options)
    app.setUtmOptions(options);
    // app.checkLogin()
    // getApp().isMemberETO()
    // if (!wx.getStorageSync('isMember')){
    //   getApp().isMemberETO()
    // }
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign

    console.log(`@@@@@@@@@@@@@@@@@@    this.utm_source = ${this.utm_source}`)
    console.log(`@@@@@@@@@@@@@@@@@@    this.utm_medium = ${this.utm_medium}`)
    console.log(`@@@@@@@@@@@@@@@@@@    this.utm_term = ${this.utm_term}`)
    console.log(`@@@@@@@@@@@@@@@@@@    this.utm_campaign = ${this.utm_campaign}`)
    shareFlag = options.shareFlag == "Y" ? "Y" : "N"

    if (memTermMap.get(this.utm_term) && memTermMap.get(this.utm_term) > 16) {
      this.setData({ fromKuaiKanApp: true })
    }
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@  fromKuaiKanApp==${this.data.fromKuaiKanApp}`)
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@  shareFlag==${shareFlag}`)
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
    if (index == 17 || index == 18) {
      channel = "channel5fb3b0a16c503"
    }
    let deliveryId = list[index]
    console.log(`onCouponClick >>>>>>>>   index==${index}`)
    console.log(`onCouponClick >>>>>>>>   list==`, list)
    console.log(`channel ==${channel}  deliveryId==${deliveryId}`)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=${channel}&delivery_id=${deliveryId}`,
    })
    // pages/whitePage/whitePage?channel=channel5fb3b0a16c503&delivery_id=4912
    // pages/whitePage/whitePage?channel=channel5fb3b0a16c503&delivery_id=4913
    // pages/whitePage/whitePage?channel=channel5fb21c6d7350d&delivery_id=4885
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

  onMultiClick: function (ev) {
    console.log("onMultiClick  >>>>")
    let x = ev.detail.x
    let halfW = this.windowWidth / 2
    if (x < halfW) {
      this._injectTdsdk("早鸟福利1")
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      this._injectTdsdk("早鸟福利2")
      let url = `https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=pArCQHtHOhH&check_type=2#wechat_redirect`
      if (this.utm_term == "1KAPPIS01") {
        url = `https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=csbSWsiDeUQ&check_type=2#wechat_redirect`
      }
      if (this.utm_term == "1MPMOMENT15") {
        url = `https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=rgE8qVHQXlG&check_type=2#wechat_redirect`
      }
      console.log("onMultiClick  >>>> url ===", url)
      app.goToWebView(url)
    }
  },

  onIndexClick: function (ev) {
    console.log("onGoodClick  >>>>", ev)
    this._injectTdsdk(ev.currentTarget.dataset.btName)
    wx.switchTab({
      url: '/pages/index/index',
    });

    //     新老客页面按钮上报名称：
    // 按钮1： 早鸟优惠1
    // 按钮2：早鸟福利1
    // 按钮3：立即购买1
    // 按钮4：立即购买2
    // 按钮5：立即购买3
    // 按钮6：小游戏链接
    // 按钮7：早鸟优惠2


    // 快看页面按钮上报名称：
    // 按钮1：  早鸟优惠1
    // 按钮2：  早鸟福利1
    // 按钮3：  早鸟福利2 --- diff
    // 按钮4：  立即购买1
    // 按钮5：  立即购买2
    // 按钮6：  立即购买3
    // 按钮7：  小游戏链接
    // 按钮8：  早鸟优惠2
  },

  _injectTdsdk: function (btName) {
    console.log(`_injectTdsdk ---------------- btName=${btName}`)
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
      path: `/socialAdvertising/newMomentsDynamic/newMomentsDynamic?shareFlag=Y${utmParam}`
    }
  },

})