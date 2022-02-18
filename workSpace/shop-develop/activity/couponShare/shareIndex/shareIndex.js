import { translateArray, splitImg} from '../../../utils/utils'
import { createLightCoupon, getLightCouponList} from '../../../service/sharecoupon'
import {URL_CDN , KEYSTORAGE, EVENTS} from "../../../src/const";
import { wxShowToast } from '../../../utils/wxMethods'
import {brandAdapter} from '../brandAdapter'
import events from '../../../src/events'
const app = getApp();
let CRMInfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponBg: splitImg("coupon_bg.jpg"),
    shareCouponBg: splitImg("coupon_bg.jpg"),
    coupon: [{
        firstPrice: 20,
        scendPrice: 50,
        limitPrice: 300,
      },
      {
        firstPrice: 20,
        scendPrice: 50,
        limitPrice: 300,
      },{
        firstPrice: 20,
        scendPrice: 50,
        limitPrice: 300,
      }],
      couponList: [],
      couponShow:  splitImg("couponShare_bg.png?v=11"),
      canShowPic: false,
      getCouponImg:  splitImg("couponShare_pop.png?v=11"),
      adapter: {},
      couponID: '',
      isLightRecord: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订阅401事件
    events.register(this, EVENTS.EVENT_LOGINED);
    this.setData({
      couponList: translateArray(this.data.coupon, 3),
      adapter: brandAdapter(),
    })
    this._getLightCouponList();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  handleEvent: function(event, type){
    if (type === EVENTS.EVENT_LOGINED) {
      this._getLightCouponList();
    }
  },

  onClick: function(e){
      let type = e.currentTarget.dataset.type;
      switch(type){
        case 'close':
            this.setData({
              canShowPic: false,
            })
            break;
        case 'coupon':
          if (!app.checkLogin()) {
            return;
          }
          if(this.data.isLightRecord){
            wx.navigateTo({
              url: "../couponShare/couponShare?couponID="+ this.data.couponID,
            })
          } else {
            this._createLightCoupon();
          }
          break;
        case 'share':
          wx.navigateTo({
            url: "../couponShare/couponShare?couponID="+ this.data.couponID,
          })
          break;
        case 'couponShow':
          wx.navigateTo({
            url: "../couponShare/couponShare"
          })
          break;
        case 'jump': 
          wx.navigateTo({
            url: this.data.adapter.jumpLink
          })
          break;
      }
  },

  _getLightCouponList: function(){
    getLightCouponList().then(res =>{
        if(res[0]){
          this.setData({
            isLightRecord: true,
            couponID: res[0].id,
          })
        }
    }).catch(err=>{
      wxShowToast(err);
    })
  },

  _createLightCoupon: function(){
    let that = this;
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
      console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{
        wx.showLoading({
          title: '加载中……',
          mask: true
        });
        setTimeout(() => {
          wx.hideLoading();
          getApp().getCRMInfoFn()
        }, 2000);

      }
    } else {
      let jsData = {
        brand : app.config.brand,
        lightStatus: 0,
        nickname: wxInfo.nickName || '',
        openid:  wx.getStorageSync(KEYSTORAGE.openid),
        phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone || '',
      }
      wx.showLoading({
        mask: true,
      });
      createLightCoupon(jsData).then(res =>{
        wx.hideLoading();
        that.setData({
          canShowPic: true,
          couponID: res.id,
          isLightRecord: true,
        })
      }).catch(err=>{
        wx.hideLoading();
        wxShowToast(err);
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})