// main/main.js
import { request } from '../../utils/request.js'
let Util = require('../../utils/utils.js');
const app = getApp();
const brand = app.config.brand;
import { splitImg } from '../../utils/utils'
Page({
  // canGoback: true,
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    showRule: false,
    animationOpacity: {},
    animationBottom: {},
    randomMilli: Math.random(),
    showTopBG: true,
    // txtRuleDetail: `1.每人限领1张，每人限用1张，每单仅能使用1张优惠券，不可拆单使用，该券不与其他活动或优惠券同享，不找零，不兑现
    // 2.230元以下商品不可用，且仅限正价商品使用，不与其他活动同享
    // 3.领取时间：2020年04月03日-2020年04月30日23:59:59。
    // 4.使用时间：领取后5小时后生效，14天内有效，请在规定时间内使用，过期失效不予以返还。
    // 5.本优惠券仅限ONLY官网、门店使用
    // 6.此券不可用户购买帽子、领带、腰带、眼镜、袜子等配饰或家居产品。
    // 7.使用方法：
    // 官网：请在官网结账付款时选择该优惠券核销。
    // 门店：请在门店结账付款时向收银员出示优惠券页面。
    // 8.使用优惠券的订单发生退货或者换货，优惠券不退还，退款时优惠券抵扣金额不退还。
    // 9.对于通过技术、代码篡改等人和不正常或不正当手段获取或使用优惠券者，该优惠券无效，品牌有权进行删除。
    // 10.由于账户盗用等非常规用户自身原因造成的优惠券问题，品牌不予返还或补偿。
    // 11.品牌在法律范围内保留对此优惠券使用细则的最终解释权。`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`onLoad   >>>>>>>>>>>>>>>>>>>>>`)
    app.setUtmOptions(options);
    let { delivery_id } = options
    console.log(`>>>>>>>>>>>   delivery_id ==${delivery_id} `)
    this.deliveryId = delivery_id
    wx.hideShareMenu({
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

    wx.getSystemInfo({
      success: function (res) {
        console.log(`getSystemInfo  >>> res.model  ========== ${res.model}`)
      }
    })

    request({
      url: `https://cdn.bestseller.com.cn/assets/common/${brand}/json/wechat_social_rule.txt?v=${Math.random()}`,
    }).then(res => {
      console.log(`>>>>>>>>>>>>>>>>>   wechat_social_rule.txt=${res}  `)
      this.setData({ txtRuleDetail: res })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(`onReady   >>>>>>>>>>>>>>>>>>>>>`)
    var animation_bottom = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    var animation_oapcity = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    this.animation_bottom = animation_bottom;
    this.animation_oapcity = animation_oapcity;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (!this.canGoback) {
    //   wx.navigateTo({
    //     url: `/socialAdvertising/landing/landing?adMode=MODE_B`,
    //     success: (result) => {

    //     },
    //     fail: () => { },
    //     complete: () => { }
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(`onHide   >>>>>>>>>>>>>>>>>>>>>`)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(`onUnload   >>>>>>>>>>>>>>>>>>>>>`)
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



  onCouponClick: function (ev) {
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel5e86fa88f2dfc&delivery_id=${this.deliveryId}`,
      success: (result) => {
        console.log(`redirectTo----- successs`)
      },
      fail: () => {
        console.log(`redirectTo----- fail`)
      },
      complete: () => {
        console.log(`redirectTo----- complete`)
      }
    });

  },

  onRuleBarClick: function (ev) {
    this.setData({
      showRule: true
    })
    Util.animateShow(this)
  },

  onRuleConfirm: function (ev) {
    this.setData({
      showRule: false
    })
    Util.animateHide(this)
  },

  onIndexClick: function (ev) {
    // this.canGoback = true
    wx.navigateTo({
      url: `/socialAdvertising/landing/landing?adMode=MODE_B`,
      success: (result) => {
        console.log(`onIndexClick----- success`)
      },
      fail: () => { },
      complete: () => { }
    });
  },

  onShopBarClick: function (e) {
    // this.canGoback = true
    wx.navigateTo({
      url: '/store/storelist/storelist?tpl_id=95&&tag_id=404',
      success: (result) => {
        console.log(`onGotoShopClick----- successs`)
      },
      fail: () => {
        console.log(`onGotoShopClick----- fail`)
      },
      complete: () => {
        console.log(`onGotoShopClick----- complete`)
      }
    });
  }

})