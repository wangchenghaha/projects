// pages/userDaogou/guideVideo/guideVideo.js
import {translateArray, splitImg} from '../../utils/utils'
import { URL_CDN, KEYSTORAGE } from '../../src/const'
import { listenToThem, guideStudy } from '../../service/guide'
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {
      data: [],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 500,
      guide: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._listenToThem()
    this.getGuideStudy();
  },
  _listenToThem: function(){
    let swiper = this.data.swiper;
    listenToThem().then(res => {
      swiper.data = res;
      this.setData({ swiper });
    }).catch(err => {
      wx.showToast({
        title:'获取数据失败'
      })
    })
  },
  getGuideStudy: function(){
    guideStudy().then(res => {
      if(res && res.guide){
        res.guide.forEach(item => {
          if(item.list){
            item.list.forEach(listItem => {
              listItem.img = splitImg(listItem.img, 'common')
            })
          }
        });
        this.setData({
          guide: res.guide,
        })
      }
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