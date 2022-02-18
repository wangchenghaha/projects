import {splitGameImg ,toDecimal} from '../../../../utils/utils'
import {EVENTS, KEYSTORAGE} from '../../../../src/const'
import events from "../../../../src/events"
import {getUserInfo, getCouponList, openStepsGift, stepsGiftRecords} from '../../../service/springOuting'
import {getGiftRule} from '../gameAdapter'
const app = getApp();


const splashImgList = [
  {
    scale: 6218, // 375/603 iphone 7
    couponHeight: '700rpx'
  },
  {
    scale: 5179, // 375/724 iphoneX
    couponHeight: '900rpx'
  },
  {
    scale: 5057,  // 393/776  redMi Pro 8
    couponHeight: '900rpx'
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myPonitImg: splitGameImg('my_points.png', 'springOuting'),
    logo_1: splitGameImg('coupon_logo_1.png', 'springOuting'),
    logo_2: splitGameImg('coupon_logo_2.png', 'springOuting'),
    logo_3: splitGameImg('coupon_logo_3.png', 'springOuting'),
    userData: '',
    myStep: 0,
    couponLogos: [],
    couponTitle: splitGameImg('coupon_title_new.png', 'springOuting'),     
    couponList:[],
    couponHeight: '900rpx',
    showCoupon: false,
    couponName: '',
    couponShowImg: splitGameImg('open_step_bg.png', 'springOuting'), 
    couponImg:'',     
    widthPercent: '0%',
    isFol: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      couponLogos: getGiftRule(),
      isFol: app.config.brand === 'FOL'
    })
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
    this.getSystemInfo();
    this._userInfo();
   
  },

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let couponHeight = '';
      console.log('scale ======',scale);
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        
        if(diff < 100){
          couponHeight = item.couponHeight
        }
      });
     
      if(couponHeight){
        that.setData({
          couponHeight,
        })
        console.log(that.data.couponHeight,'***init');
      }
    }catch (e) {}
  },

  onClick(e){
    let type = e.currentTarget.dataset.type;
    let step = e.currentTarget.dataset.step;
    switch(type){
      case 'getCoupon':
        this._openStepsGift(step)
        break;
      case 'goHome':
        app.goBack();
        break;
      case 'close':
        this.setData({
          showCoupon: false,
        })
        break;    
    }
  },

  _userInfo() {
    let openID = wx.getStorageSync('wxOpenID');
    let {userData} = this.data
    getUserInfo(openID).then(res => {
        userData = res
        this.setData({
          userData,
          myStep : userData.steps
        })
        this._stepsGiftRecords();
        this._getCouponList();
    })
  },

  _getCouponList(){
    let jsData = {
      userid: this.data.userData.id
    }
    getCouponList(jsData).then(res =>{
      this.setData({
        couponList: res
      })
    }) 
  },

  _stepsGiftRecords(){
    let {userData, couponLogos ,isFol} = this.data
    let jsData = {
      userid: userData.id
    }
    stepsGiftRecords(jsData).then(res =>{
      let percent ='';
      if(isFol){
        console.log("================", percent);
        if(userData.steps > 188 && userData.steps < 666){
          couponLogos[0].logo = splitGameImg('coupon_logo_gif_1.gif', 'springOuting')
          couponLogos[0].step = '点击领取'
          percent = toDecimal(userData.steps / 888 * 10000) / 100 + "%";
        } else if(userData.steps > 666 && userData.steps < 888){
          couponLogos[0].logo = splitGameImg('coupon_logo_gif_1.gif', 'springOuting')
          couponLogos[0].step = '点击领取'
          couponLogos[1].logo = splitGameImg('coupon_logo_gif_2.gif', 'springOuting')
          couponLogos[1].step = '点击领取'
          percent = toDecimal( userData.steps / 888 * 10000) / 100 + "%";
        } else if(userData.steps > 888){
          couponLogos[0].logo = splitGameImg('coupon_logo_gif_1.gif', 'springOuting')
          couponLogos[0].step = '点击领取'
          couponLogos[1].logo = splitGameImg('coupon_logo_gif_2.gif', 'springOuting')
          couponLogos[1].step = '点击领取'
          couponLogos[2].logo = splitGameImg('coupon_logo_gif_3.gif', 'springOuting')
          couponLogos[2].step = '点击领取'
          percent = "100%";
        } else {
          percent = toDecimal(userData.steps / 888 * 10000) / 100 + "%";
        }
      } else {
        if(userData.steps > 100 && userData.steps < 500){
          couponLogos[0].logo = splitGameImg('coupon_logo_gif_1.gif', 'springOuting')
          couponLogos[0].step = '点击领取'
          percent = toDecimal( userData.steps / 1000 * 10000) / 100 + "%";
        } else if(userData.steps > 500 && userData.steps < 1000){
          couponLogos[0].logo = splitGameImg('coupon_logo_gif_1.gif', 'springOuting')
          couponLogos[0].step = '点击领取'
          couponLogos[1].logo = splitGameImg('coupon_logo_gif_2.gif', 'springOuting')
          couponLogos[1].step = '点击领取'
          percent = toDecimal( userData.steps / 1000 * 10000) / 100 + "%";
        } else if(userData.steps > 1000){
          couponLogos[0].logo = splitGameImg('coupon_logo_gif_1.gif', 'springOuting')
          couponLogos[0].step = '点击领取'
          couponLogos[1].logo = splitGameImg('coupon_logo_gif_2.gif', 'springOuting')
          couponLogos[1].step = '点击领取'
          couponLogos[2].logo = splitGameImg('coupon_logo_gif_3.gif', 'springOuting')
          couponLogos[2].step = '点击领取'
          percent = "100%";
        } else {
          percent = toDecimal( userData.steps / 1000 * 10000) / 100 + "%";
        }
      }
     
      for (let i = 0; i < res.length; i++) {
        if(res[i].steps === couponLogos[0].steps){
          couponLogos[0].logo = splitGameImg('coupon_logo_1.png', 'springOuting')
          couponLogos[0].step = '已领取'
        }
        if(res[i].steps === couponLogos[1].steps){
          couponLogos[1].logo = splitGameImg('coupon_logo_2.png', 'springOuting')
          couponLogos[1].step = '已领取'
        }
        if(res[i].steps === couponLogos[2].steps){
          couponLogos[2].logo = splitGameImg('coupon_logo_3.png', 'springOuting')
          couponLogos[2].step = '已领取'
        }
      }

      this.setData({
        couponLogos,
        widthPercent: percent
      })
    }) 
  },

  _openStepsGift(_step){
    let jsData = {
      steps: _step,
      userid: this.data.userData.id
    }
    openStepsGift(jsData).then(res =>{
      this.setData({
        showCoupon: true,
        couponImg: res.giftPic,
        couponName: res.giftName
      })
      this._stepsGiftRecords();
      this._getCouponList();
    }) 
  },
})