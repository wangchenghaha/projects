import { EVENTS, KEYSTORAGE } from '../../src/const.js'
import events from '../../src/events';
import { getRefundDetail } from '../../service/order.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    let orderNumber = "51820190616162104299";
    if(wx.getStorageSync('user_info')){
      this.showUserInfo();
      this.refundDetail(orderNumber);
    }
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
    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        app.checkLogin()
      } else if(!wx.getStorageSync('user_info')){
        app.getCRMInfoFn();
      }
    }, 1000);
  },

  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO) {
      this.showUserInfo();
    }
  },

  showUserInfo: function(){
    let userInfo = wx.getStorageSync("userInfo");
    let vipInfo = wx.getStorageSync("user_info");
    this.setData({
      customerName: vipInfo.name,
      customerLevel: vipInfo.level,
      customerPoint: vipInfo.availablepoints,
      customerIcon: userInfo.avatarUrl,
      customerNick: userInfo.nickName,
    })
  },

  refundDetail: function(_orderNum){
    getRefundDetail(_orderNum).then(data =>{
      this.setData({
        orderNumber: data.orderNum,
        orderCount: data.goodsTotalCount,
        orderPrice: data.payPrice,
        orderPayTime: data.tradeTime,
        orderRefundTime: 'TODO',
        orderStore: data.shopguideId,
        orderStoreInfo: data.saleShop,
      })
    })
  }

})