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
        arr = ["#4B4954", "SELECTED", "用户***ex   抽中40元无门槛优惠券;  用户***青  抽中80元无门槛优惠券;  用户***Flex   抽中宝岛眼镜; 用户***艳   抽中沙滩裤;"];
        break;
      case 'FOL':
        arr = ["#000000", "BESTSELLER折扣店", ""];
        break;
      case 'ONLY':
        arr = ["#5B6E74", "ONLY", "用户***ex   抽中40元无门槛优惠券;  用户***青  抽中80元无门槛优惠券;  用户***Flex   抽中宝岛眼镜; 用户***飞   抽中项链;"];
        break;
      case 'VEROMODA':
        arr = ["#EAC1BF", "VEROMODA", "用户***ex   抽中40元无门槛优惠券;  用户***青  抽中80元无门槛优惠券;  用户***Flex   抽中宝岛眼镜; 用户***艳   抽中项链;"];
        break;
      case 'JACKJONES':
        arr = ["#91ABB8", "JACKJONES", "用户***ex   抽中40元无门槛优惠券;  用户***青  抽中80元无门槛优惠券;  用户***Flex   抽中宝岛眼镜; 用户***莉   抽中短裤;"];
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