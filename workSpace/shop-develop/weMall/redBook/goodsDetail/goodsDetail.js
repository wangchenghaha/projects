// weMall/redBook/detail/detail.js
import {redBookDetail} from '../../service/redBook'
import {wxShowToast} from '../../../utils/wxMethods'
import { chengfa } from '../../../utils/utils'
import {URL_CDN, KEYSTORAGE} from '../../../src/const'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocalInfo();
  },
  getLocalInfo(){
    const goodsDetail = wx.getStorageSync(KEYSTORAGE.redBookGoods);
    if(goodsDetail){
      const {goodsList = []} = goodsDetail;
      if(goodsList.length){
        goodsList.forEach(item => {
          const {discount} = item;
          item.myDiscount = discount === 9 ? '一口价': `${chengfa(discount, 10)}折`;
        })
      }  
    }
    this.setData({
      goodsDetail
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