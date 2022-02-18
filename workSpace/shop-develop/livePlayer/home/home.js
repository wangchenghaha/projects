// livePlayer/home/home.js
const app = getApp();
import {KEYSTORAGE} from '../../src/const'
let livePlayer = requirePlugin('live-player-plugin') // 引入获取直播状态接口
// 至少1分钟频率去轮询获取直播状态
setInterval(() => {
  const roomId = wx.getStorageSync(KEYSTORAGE.roomId) // 房间id
  livePlayer.getLiveStatus({ room_id: roomId })
    .then(res => {
      // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常
      const liveStatus = res.liveStatus;
    })
    .catch(err => {
      console.log(err)
    })
}, 60000);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'zhibo**')
    try{
      const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      const roomName = wx.getStorageSync('roomName');
      app.tdSdkEvent('pageclick_home_live', {
        "直播名称": roomName || '',
        'PHONE': crmInfo.phone || ''
      });
    }catch (e) { }
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
    this.setData({
      roomId: wx.getStorageSync(KEYSTORAGE.roomId)
    });
  },



})