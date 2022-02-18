const app = getApp();
const brand = app.config.brand;
import {splitImg} from '../../../utils/utils'
import { EVENTS, KEYSTORAGE } from '../../../src/const.js'
import events from '../../../src/events';

let gameCode = '';

Page({
  data:{
    brand: brand,
    pointss:'',
    phones:'',
    bgColorArr: [],
    sharedAddJoinCount: false,
    configId: ''
  },
  contInfo(e) {
  // 这里就是子组件传过来的内容了
  // console.log('这里就是子组件传过来的内容了11111111111112342432434432443')
  //   console.log(e.detail)
    this.setData({
      configId : e.detail.configId,
      sharedAddJoinCount: e.detail.sharedAddJoinCount
    })
  },
  onLoad: function (options) {
    this.truntableDraw = this.selectComponent("#truntableDraw")
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    this.getUserPhone();

    const pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let curOptions = currentPage.options;
    gameCode = curOptions.gameCode || '';
    
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
        arr = ["#000", "SELECTED", "用户***ex   抽中5元无门槛优惠券;  用户***青  抽中10元优惠券;  用户***Flex   抽中男士腰带; 用户***飞   抽中时尚手提袋;"];
        break;
      case 'FOL':
        arr = ["#000000", "BESTSELLER折扣店" ,"用户***ex   抽中5元无门槛优惠券;  用户***青  抽中10元优惠券;  用户***Flex   抽中男士腰带; 用户***飞   抽中时尚手提袋;"];
        break;
      case 'ONLY':
        arr = ["#947652", "ONLY","用户***ex   抽中5元无门槛优惠券;  用户***青  抽中10元优惠券AA;  用户***Flex   抽中男士腰带; 用户***飞   抽中时尚手提袋AA;"];
        break;
      case 'VEROMODA':
        arr = ["#000", "VEROMODA"];
        break;
      case 'JACKJONES':
        arr = ["#bbcad1", "JACKJONES"];
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
      this.truntableDraw._getGiftRecords()
      this.truntableDraw._getGiftList()
      this.truntableDraw._getHelp()
      console.log('11111111111111111111111111111111111')
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
    let phone = wx.getStorageSync('user_info').phone;
    let sharePath =  this.data.sharedAddJoinCount ? `/games/pages/turntableMemberDay/turntableMemberDay?gameCode=${gameCode}&phone=${phone}&configId=${this.data.configId} ` : `/games/pages/turntableMemberDay/turntableMemberDay?gameCode=${gameCode}`;
    console.log('分享的url参======数' + gameCode + phone + this.data.configId)
    let shareTitle =  "幸运抽奖"
    return {
      title: shareTitle,
      path: sharePath,
      imageUrl: splitImg('share_drawer.jpg'),
      success: res =>{}
    }
  },
  
})