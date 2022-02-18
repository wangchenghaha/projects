const app = getApp();
const brand = app.config.brand;

import { EVENTS, KEYSTORAGE } from '../../../src/const.js'
import events from '../../../src/events';


Page({
  data:{
    brand,
    pointss:'',
    phones:'',
    bgColorArr:[],
    gameCode: ''
  },
  onLoad: function (options) {
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    this.getUserPhone();
    this.setData({
      gameCode: options.gameCode || ''
    })
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
        arr = ["#ffd800", "#ffd800", "#ffffff", "#000","SELECTED"];
        break;
      case 'FOL':
        arr = [ "#de1822", "#d3464d", "#ffffff", "#ffffff","BESTSELLER折扣店"];
        break;
      case 'ONLY':
        arr = ["#f6e865", "#000000","#ffffff", "#ffffff", "ONLY" ];
        break;
      case 'VEROMODA':
        arr = [ "#000", "#f2666e", "#ffffff", "#ffffff","VEROMODA"];
        break;
      case 'JACKJONES':
        arr = [ "#3a5ddb", "#93f6ff", "#ffffff", "#000", "JACK&JONES"];
        break;
      case 'JLINDEBERG':
        arr = [ "#fff", "#000", "JLINDEBERG"];
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

  //转发分享功能
  onShareAppMessage: function () {
    return {
      title: '抽奖赢好礼，享购乐翻天！',
      path: '/games/pages/turntablePromotion/turntablePromotion',
      imageUrl: '',
    }
  },

})
