import {KEYSTORAGE} from "../../../src/const";
import {splitImg} from "../../../utils/utils";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo: {},
    guideInfo: {},
    level: [
      {
        value: 0,
        text: '铜牌',
        imgUrl: splitImg('FX_icon_T.png','common')
      },
      {
        value: 6000,
        text: '银牌',
        imgUrl: splitImg('FX_icon_Y.png', 'common')
      },
      {
        value: 15000,
        text: '金牌',
        imgUrl: splitImg('FX_icon_J.png', 'common')
      }
    ],
    levelValue: 200
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setGuideInfo();
  },
  setGuideInfo(){
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    this.setData({wxInfo, guideInfo})
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