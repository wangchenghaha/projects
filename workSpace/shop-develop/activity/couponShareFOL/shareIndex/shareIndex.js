import {splitImg, timeStamp} from '../../../utils/utils'
import { createExpandCoupon, getExpandCoupon} from '../../../service/sharecoupon'
import {URL_CDN , KEYSTORAGE, EVENTS} from "../../../src/const";
import { wxShowToast } from '../../../utils/wxMethods'
import {brandAdapter} from '../brandAdapter'
import events from '../../../src/events'
const app = getApp();
const imgVersion = `${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}`
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponImage: splitImg(`coupon_Share_img.png?v=${imgVersion}`),
    couponShow:  splitImg(`couponShare_title.jpg?v=${imgVersion}`),
    canShowPic: false,
    getCouponImg:  splitImg(`couponShare_pop.png?v=${imgVersion}`),
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
      adapter: brandAdapter(),
    })
    this._getExpandCoupon();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  handleEvent: function(event, type){
    if (type === EVENTS.EVENT_LOGINED) {
      this._getExpandCoupon();
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
              url: "../couponShare/couponShare",
            })
          } else {
            this._createLightCoupon();
          }
          break;
        case 'share':
          wx.navigateTo({
            url: "../couponShare/couponShare",
          })
          break;
        case 'couponShow':
          wx.navigateTo({
            url: "../couponShare/couponShare"
          })
          break;
        case 'jump':
          app.goBack();
          // wx.navigateTo({
          //   url: this.data.adapter.jumpLink
          // })
          break;
      }
  },

  _getExpandCoupon: function(){
    getExpandCoupon(wx.getStorageSync(KEYSTORAGE.openid)).then(res =>{
        if(res.creatorInfo){
          this.setData({
            isLightRecord: true,
            couponID: res.id
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
        nickname: wxInfo.nickName || '',
        avatarUrl: wxInfo.avatarUrl || '',
        openid:  wx.getStorageSync(KEYSTORAGE.openid),
        phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone || '',
      }
      wx.showLoading({
        mask: true,
      });
      createExpandCoupon(jsData).then(res =>{
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
