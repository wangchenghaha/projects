import { exchangeCoupon, couponRestiction, exchangeJLCoupon} from '../../../service/coupon.js';
import {KEYSTORAGE} from '../../../src/const.js'
import {wxShowToast} from '../../../utils/wxMethods'
import {splitImg} from '../../../utils/utils'

var main = require("../../../base/main.js");
var url = require("../../../base/url.js");
var promotionCode = "";
var couponCode = "";
var point = "";
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFold: true,
    pullImage:'../../../images/pull_down.png',
    couponScope: '',
    description: '',
    ablePoint:'',
    contenHeight:'730rpx',
    showSubmitPop: false,
    userImage: '',
    couponInfo: '',
    customePoint: '',
    availablePoint: '',
    submit_pic: splitImg('submit_pic.png', 'common')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let couponInfo =  wx.getStorageSync("rcCouponInfo");
      let userInfo =  wx.getStorageSync("userInfo");
      let userCRM =  wx.getStorageSync("user_info");
      couponCode = couponInfo.goodsCode;
      point = options.score;
      this.setData({
        couponScope: couponInfo.couponScope,
        pictitle: couponInfo.picBg_04 +'?v=' + (new Date()).valueOf(),
        description: couponInfo.description,
        ablePoint: couponInfo.score,
        couponInfo: couponInfo.goodsName,
        userImage: userInfo.avatarUrl,
        customePoint: couponInfo.score,
        availablePoint: userCRM.availablepoints,
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  showSubmitPop: function(){
    this.setData({
      showSubmitPop: true,
    })
  },

  canncelBtn: function(){
    this.setData({
      showSubmitPop: false,
    })
  },

  submitBtn: function(){
    let {phone} = wx.getStorageSync(KEYSTORAGE.crmInfo);
    couponRestiction(phone).then(data =>{
      console.log(data);
      if(data == 1){
        wx.showModal({
          title: '提示',
          content: '抱歉您是导购无法兑换此优惠券！',
          showCancel: false
        });
      } else if(data == 0){
          let couponJsData = [{
            quantity:1,
            promotionCode: couponCode,
            voucherno:""
          }]
          exchangeCoupon(phone, couponJsData)
          .then((data) =>{
            // let couponInfo = {
            //   couponCode: data.newList[0].voucherno,
            //   couponId: data.newList[0].promotionCode
            // }
            // app.openVoucherCard(couponInfo)
            wxShowToast("领取成功！请到我的优惠券列表中查看！");
            // this.setData({
            //   showSubmitPop: false
            // })
          }).catch((e) => {
            wxShowToast(e.message);
          })
        }
    })

  },

  goBack: function(){
    wx.navigateBack({
      delta: -1
    });
  },

  takeUp: function(){
    if(this.data.isFold){
      this.setData({
        isFold: false,
        pullImage: '../../../images/take_up.png',
        contenHeight:'1100rpx',
      })
    } else {
      this.setData({
        isFold: true,
        pullImage: '../../../images/pull_down.png',
        contenHeight:'730rpx',
      })
    }
  }
})
