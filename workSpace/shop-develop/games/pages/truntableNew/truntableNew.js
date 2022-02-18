const app = getApp();
const brand = app.config.brand;
import {splitImg} from '../../../utils/utils'
import { EVENTS, KEYSTORAGE } from '../../../src/const.js'
import events from '../../../src/events';


Page({
  data:{
    brand: brand,
    pointss:'',
    phones:'',
    bgColorArr: [],
  },
  onLoad: function (options) {
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    this.getUserPhone();
  },
  onUnload: function () {
    //取消订阅
    console.log("执行取消事件===========");
    events.unregister(this, EVENTS.EVENT_LOGINED);
  },
  onShow:function(){
     
    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      } else if(!wx.getStorageSync('user_info')){
        getApp().getCRMInfoFn();
      }
    }, 1000);
   let arr = [];
    switch(brand){
      case 'SELECTED':
        arr = ["#000000", "SELECTED", "用户***ex   抽中270元优惠券;  用户***青   抽中150元优惠券;  用户***Flex   抽中时尚短裤; 用户***艳    抽中时尚眼镜;"];
        break;
      case 'FOL':
        arr = ["#000000", "BESTSELLER折扣店", ""];
        break;
      case 'ONLY':
        arr = ["#76c0e7", "ONLY", "用户***ex    抽中225元优惠券;  用户***青  抽中时尚项链;  用户***Flex    抽中10元优惠券; 用户***飞    抽中80元优惠券;"];
        break;
      case 'VEROMODA':
        arr = ["#000000", "VEROMODA", "用户***ex   抽中时尚长袜;  用户***青  抽中90元优惠券;  用户***Flex   抽中时尚眼镜; 用户***艳   抽中270元优惠券;"];
        break;
      case 'JACKJONES':
        arr = ["#bbcad1", "JACKJONES", "用户***ex   抽中时尚帽子;  用户***青  抽中120元优惠券;  用户***Flex   抽中时尚腰带; 用户***莉   抽中80元优惠券;"];
        break;
    }

    this.setData({
      bgColorArr: arr,
    })

  },
  
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO) {
      this.getUserPhone();
    }
  },

  getUserPhone: function(){
    if (wx.getStorageSync('user_info')) {
      console.log("=============user");
      this.setData({
        phones: wx.getStorageSync('user_info').phone
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let sharePath = '/games/pages/truntableNew/truntableNew';
    let shareTitle =  "幸运抽奖"
    return {
      title: shareTitle,
      path: sharePath,
      imageUrl: splitImg('share_drawer.jpg'),
      success: res =>{}
    }
  },
})