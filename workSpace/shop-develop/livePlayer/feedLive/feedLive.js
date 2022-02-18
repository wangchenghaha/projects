const app = getApp();
const {FEED_ID, cdn, brand} = app.config;
import {splitImg} from '../../utils/utils'
import {getFeedLive} from '../server/album'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    splitImg: `${cdn}/assets/common/${brand}/image/`,
    pageConfig: {},
    channelInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageList();
    this.getChannelsLiveInfo();
    app.setUtmOptions(options);
    app.handleRoomId(options);
  },
  getPageList(){
    getFeedLive().then(res => {
      this.setData({pageConfig: res})
    })
  },
  onClick(e){
    const {sku, room} = e.currentTarget.dataset;
    if(room){
      this.openChannelsLive()
      return
    }
    if(sku){
      const {live_room_no = ''} = this.data.pageConfig
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${sku}&live_room_no=${live_room_no}`
      })
    }
  },
  getChannelsLiveInfo() {
    const _this = this;
    wx.getChannelsLiveInfo({
      finderUserName: FEED_ID,
      success(res) {
        _this.setData({ channelInfo: res});
      },
      fail(err) {
        console.error(err, '%%%%%%%%%%%%%%%%%%%%')
      }
    })
  },
  openChannelsLive() {
    const {feedId, nonceId} = this.data.channelInfo;
    wx.openChannelsLive({
      finderUserName: FEED_ID,
      feedId,
      nonceId
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
