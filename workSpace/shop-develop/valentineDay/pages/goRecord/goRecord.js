import pathModel from '../../models/path.model';
import mainService from '../../../base/main.js';
import Urls from '../../services/url'
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import dataModel from '../../models/dataInfo.model';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comData:{},
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
    wx.getSetting({
      success(res) {
        console.log(res, 'getSetting')
        // return
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success(res) {
              console.log('授权录音成功')
      
            },
            fail: function () {
              // 授权失败
          
            }
          })
        } else {
          console.log('授权过录音')
       
        }
      }
    })
  },

  reportOffice(){
    Fetch({
      url: Urls.love_office,
      loading: true,
      method:'POST',
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        ch_id: wx.getStorageSync('ch_id'),
      }
    }).then(res => {
      
    })
  },
  reportAd(){
    Fetch({
      url: Urls.love_btnAd,
      loading: true,
      method:'POST',
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        ch_id: wx.getStorageSync('ch_id'),
      }
    }).then(res => {
      
    })
  },
  openRecord() {
    // 判断是否是会员
    // return
    Fetch({
      url: Urls.love_ismember,
      loading: true,
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        ch_id: wx.getStorageSync('ch_id'),
        user_id: this.data.comData.user_id
      }
    }).then(res => {
      let { errcode, data } = res
      if (errcode == 0) {
        console.info('res$$$$$$$$$$$$', res)
        if (data.is_member) {//如果是会员
          if (data.is_get_card) {//但是领过卡
            this.reportAd();
            wx.navigateTo({
              url: `${pathModel.vd_startRecord}`,
            })
          } else {//没领过卡
            wx.addCard({
              cardList: data.cardList,
              success: res => { }
            })
            // wx.navigateTo({
            //   url: `${pathModel.vd_startRecord}`,
            // })

          }
        } else {//不是会员
          console.info('data.cardList', data.cardList)
          if (data.is_get_card) {//但是领过卡
            wx.openCard({
              cardList: data.cardList,
              success(res) { }
            })
          } else {//没领过卡
            Utils.memberRegistration(data.activatemembercard_url)

          }
        }
      }
    })
  },
  jumpToIndex() {
    this.reportOffice();
    let navType = Utils.isTabPage(decodeURIComponent(this.data.comData.valentine.lover_gift_url)) ? 3 : 0;
    // mainService.link(decodeURIComponent(this.data.comData.valentine.lover_gift_url), navType)
    let giftUrl = decodeURIComponent(this.data.comData.valentine.lover_gift_url);
    if(navType){
      wx.switchTab({
        url: giftUrl,
      })
    }else{
      wx.navigateTo({
        url: giftUrl,
      })
    }
 
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