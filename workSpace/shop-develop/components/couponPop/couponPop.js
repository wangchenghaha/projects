import {getdate} from '../../utils/utils'
import { sendCouponNotify } from '../../service/coupon.js'
import {KEYSTORAGE} from '../../src/const.js'
let app = getApp();
const cdn = app.config.cdn;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activityInfo: Object,
    coupon_display: Boolean,
    inputUrl: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    couponPicList:[],
    showCoupon: true,
    showToast: false,
    detailInput: false,
  },

  ready: function(){
    this.onLoad();
    this.onShow();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onLoad: function(){
      let inputUrl = this.properties.inputUrl;
      let detailInput = this.data.detailInput;
      if(inputUrl === '/pages/content'){
          detailInput = true;
      } else {
        detailInput = false;
      }
      console.log("---------------------",detailInput);
      this.setData({
        detailInput,
      })
    },

    onShow: function(){
      console.log(this.properties.activityInfo)
      let activitCoupon = this.properties.activityInfo.actionCouponList;
      let couponPicList = this.data.couponPicList;
      for (let i = 0; i < activitCoupon.length; i++) {
        couponPicList[i] = activitCoupon[i].imgUrl
      }
      this.setData({
        couponPicList: couponPicList,
      })

    },

    closeCoupon: function(){
      this.properties.coupon_display = false;
      this.triggerEvent('changeShow', this.properties.coupon_display);
    },

    jumpMiniCard: function(){
      const {activityInfo, inputUrl} = this.properties
      let coupons =  activityInfo.actionCouponList;
      console.log("..........", coupons);
      let data = {
        brand: app.config.brand,
        couponName: coupons[0].couponName || '',
        expireDesc: coupons[0].promptMsg,
        getTime: getdate(Date.parse(new Date())),
        memberName: wx.getStorageSync(KEYSTORAGE.wxInfo).nickName,
        openid: wx.getStorageSync('openid'),
      }
      sendCouponNotify(data).then(res=>{

      })
      const url = activityInfo.minipageUrl;
      /*app.gioTrack('pageclick_home_couponbar', {
        url
      });*/
      app.gioTrack('wemall_myCoupons', {
        couponName: coupons[0].couponName || '',
        couponID: coupons[0].couponNum || '',
        couponGetType : activityInfo.couponType,
        pagename: inputUrl === '/pages/content' ? '详情页' : '首页',
        couponID_Dateline: activityInfo.actionEndDate,
      })
      app.navigateTo(url);
      this.properties.coupon_display = false;
      this.triggerEvent('changeShow', this.properties.coupon_display);
    }
  }
})
