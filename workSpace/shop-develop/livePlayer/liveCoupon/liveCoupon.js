// livePlayer/liveCoupon/liveCoupon.js
import {objToQuery} from '../../utils/utils'
import {wxShowToast} from '../../utils/wxMethods'
import {KEYSTORAGE} from "../../src/const";
import {liveRoom} from "../../service/livePlayer";
import {gloryKing} from "../../service/index";
let curOptions = {};
const app = getApp();
const {brand, ETO_BRAND} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /*
  * {"2MOMENTAD":"pages/whitePage/whitePage?channel=channel5e99574623972&delivery_id=2767",
  * "2MOMENTAD1":"pages/whitePage/whitePage?channel=channel5e99574623972&delivery_id=2774",
  * "2MOMENTAD2":"pages/whitePage/whitePage?channel=channel5e99574623972&delivery_id=2775"}}
  *
  *
  * */
  onLoad: function (options) {
    curOptions = options;
    let utm_term = ETO_BRAND[brand] + 'DAFAULT';
    const optionList = wx.getStorageSync('daogouLists');
    if(optionList && optionList.length){
      optionList.forEach(item => {
        if(item.key && (item.key === 'utmTerm' || item.key === 'utm_term')){
          utm_term = item.value;
        }
      })
    }
    console.log(utm_term,'***utm_term')
    this.getUtmConfig(utm_term);
  },
  getUtmConfig(utm_term){
    wx.showLoading({
      title: '加载中',
    });
    gloryKing().then(res => {
      wx.hideLoading();
      if(utm_term && res && res.couponPage){
        const couponPage = res.couponPage;
        const couponPath = couponPage[utm_term] || couponPage[ETO_BRAND[brand] + 'DEFAULT'];
        if(couponPath){
          wx.redirectTo({
            url: couponPath.startsWith('/') ? couponPath : `/${couponPath}`
          })
        }else{
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  getLiveRoom(){
    liveRoom().then(res => {
      if(res && res.errcode === 0){
        if(res.room_info && res.room_info.length){
          // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常;
          const roomInfo = res.room_info;
          if(roomInfo.length){
            const curRoom = roomInfo[0];
            this.tdEvent(curRoom);
            const roomId = curRoom.roomid
            wx.redirectTo({
              url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
              success(){
                wx.setStorageSync(KEYSTORAGE.roomId, roomId);
                wx.setStorageSync('roomName', curRoom.name || '');
                app.setRoomId(roomId, curRoom.start_time)
              }
            })
          }
        }
      }
    }).catch(err => console.log(err))
  },
  tdEvent(roomInfo){
    const {start_time, end_time, live_status, roomid} = roomInfo;
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    const roomName = wx.getStorageSync('roomName');
    console.log(getCurrentPages(),'***');
    const {path} = getCurrentPages()
    const {utm_source, utm_medium, utm_term, utm_campaign, share_by } = curOptions;
    app.tdSdkEvent('pageclick_home_live', {
      直播名称: roomName || '',
      LIVEID: `${ETO_BRAND[brand]}${roomid}`,
      PHONE: crmInfo.phone || '',
      UTM_SOURCE: utm_source || '',
      UTM_MEDIUM: utm_medium || '',
      UTM_TERM: utm_term ||'',
      UTM_CAMPAIGN: utm_campaign || '',
      LIVE_STATUS: live_status || '',
      LIVE_START_TIME: Date.now(),
      LIVE_END_TIME: '',
      PAGE: path || '',
      FROM: 'pages/index/index',
      STAFF_NO: share_by || '',
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getLiveRoom();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})