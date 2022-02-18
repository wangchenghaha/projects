const app = getApp();
const brand = app.config.brand;

import { EVENTS, KEYSTORAGE } from '../../../src/const.js'
import events from '../../../src/events';

Page({
  data:{
    brand: brand,
    pointss:'',
    phones:'',
    types:false,
  },
  onLoad: function (options) {
    this.truntableFOL = this.selectComponent("#truntableFOL")
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
      this.setData({
        types: true,
      })
    }, 1000);
  },
  /**
     * 接受授权成功刷新页面
     */
    handleEvent: function (event, type) {
      if (type === EVENTS.EVENT_CRMINFO) {
        this.getUserPhone();
        this.truntableFOL._getGiftRecords()
        this.truntableDraw._getGiftList()
        console.log('111111111111111111111----' + this.truntableFOL)
      }
    },

    getUserPhone: function(){
      if (wx.getStorageSync('user_info')) {
        console.log("=============user");
        this.setData({
          phones: wx.getStorageSync('user_info').phone
        })
      }
    }
})