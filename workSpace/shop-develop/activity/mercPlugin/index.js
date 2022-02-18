import {
  splitImg
} from '../../utils/utils'
import {
  EVENTS
} from "../../src/const";
import events from "../../src/events";
const app = getApp();
const {
  brandId
} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId,
    banner: splitImg('mercPlugin.png'),
    bannerUP: splitImg('banner-up-1209.jpg?v=0510'),
    bannerDown: splitImg('banner-down-1209.jpg?v=0510'),
    bannerUpNew: splitImg('banner-up-new-750.jpg?v=1105')
  },

  onLoad(query) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //订阅登录事件
    /*events.register(this, EVENTS.EVENT_CRMINFO);
    if(app.checkLogin()){
      this.getRedPackCover()
    }*/
  },
  getRedPackCover() {
    const url = 'https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=epjipxJgzcD&check_type=2#wechat_redirect'
    wx.redirectTo({
      url: `/pages/webview/webview?linkUrl=${encodeURIComponent(url)}`
    })
  },
  onHide() {
    // events.unregister(this, EVENTS.EVENT_CRMINFO)
  },
  onUnload() {
    // events.unregister(this, EVENTS.EVENT_CRMINFO)
  }
})