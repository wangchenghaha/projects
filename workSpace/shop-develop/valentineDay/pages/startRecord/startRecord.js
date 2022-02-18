// valentineDay/pages/startRecord/startRecord.js
import mainService from '../../../base/main.js';
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import Urls from '../../services/url'
import pathModel from '../../models/path.model';
import dataModel from '../../models/dataInfo.model';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comData:{},
    is3DStyle:true,
    autoplay: false,
    interval: 3000,
    bannerHeight:418,
    swiper2Index: 0,
    recordStatus:1,
    isBigPhone: Utils.isBigPhone()

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(dataModel.data){
      let data = dataModel.data
      this.setData({
        comData:data
      })
    }
 
  },

  swiper2Change(e) {
    let index = e.detail.current;
    this.setData({
      swiper2Index: index,
    })
  },
  startRecord(e){
    wx.navigateTo({
      url: `${pathModel.vd_longtapRecord}?heartSelect=${this.data.comData.valentine.heart_cards[this.data.swiper2Index].card_url}&heartId=${this.data.comData.valentine.heart_cards[this.data.swiper2Index].id}`,
    })
    // this.triggerEvent('isShow', {
    //   indexShow: true,
    //   recordShow: false,
    //   startRecord:true,
    //   heartSelect:this.properties.comData.heart_cards[this.data.swiper2Index].card_url,
    //   heartId:this.properties.comData.heart_cards[this.data.swiper2Index].id
    // });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.comData.valentine.share_title,
      path:`${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`,
      imageUrl: this.data.comData.valentine.card_img, 
    }
  }
})