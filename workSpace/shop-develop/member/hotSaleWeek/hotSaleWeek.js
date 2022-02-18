import {recommendedWeek} from '../service/activity'
import { goodsColorList} from '../../service/goods'
import {wxShowToast} from '../../utils/wxMethods'
import {skuToImg, getQueryStringArgs} from '../../utils/utils'
import {KEYSTORAGE, URL_CDN} from '../../src/const'
const app = getApp();
const {cdn} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:{},
    goodsList: [],
    logo: URL_CDN.LOGO_BLACK_RECT
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommendedWeek();
    this.getUrlOptions(options)
  },
  goHome(){
    app.goBack();
  },
  getUrlOptions(options){
    if(options.q){
      const path = decodeURIComponent(options.q);
      const param = getQueryStringArgs(path);
      if(param && Object.keys(param)){
        app.setUtmOptions(param);
        app.setShareInfo(param);
        if(param.devFlag){
          wx.setStorageSync(KEYSTORAGE.shareDevice, param.devFlag);
        }
      }
    }
  },
  queryParam: {
    currentPage: 1,
    pageSize: 10,
  },
  getRecommendedWeek(){
    wx.showLoading({
      title: '加载中...'
    })
    recommendedWeek(this.queryParam).then(res => {
      if(res && Array.isArray(res.records) && res.records.length){
        this.setData({
          record: res.records[0]
        });
        if(res.records[0].activityName){
          wx.setNavigationBarTitle({
            title: res.records[0].activityName
          })
        }
        if(res.records[0].activitySku){
          this.getGoodsColorList(res.records[0].activitySku.split(','))
        }else{
          wx.hideLoading()
        }
      }else{
        wx.hideLoading()
      }
    }).catch(err => wxShowToast(err.message))
  },
  getGoodsColorList(colorList){
    goodsColorList(colorList).then(res => {
      wx.hideLoading();
      if(Array.isArray(res) && res.length){
        res.forEach(item => {
          item.goodsImg = cdn + skuToImg({
            sku: item.gsColorCode,
            size: URL_CDN.IMGSIZE7201280
          });
        })
        this.setData({
          goodsList: res
        })
      }
    }).catch(err => wxShowToast(err.message))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setNavigationBarTitle = '本周爆款'
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
