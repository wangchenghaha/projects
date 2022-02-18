/*
 * @Author: your name
 * @Date: 2020-06-04 16:47:15
 * @LastEditTime: 2020-07-14 17:27:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FOL/activity/redRain/myTicketView/myTicketView.js
 */ 
// activity//redRain/myTicketView/myTicketView.js
const brand = getApp().config.brand
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/redRains/`

import {duijiangjilu} from "../../../service/redRain"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    jinbi : 0,
    noViewHeight : 0,
    yhqArrs : []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({jinbi : options.jinbi,noViewHeight : wx.getSystemInfoSync().windowHeight})
    let userData = wx.getStorageSync('hby_userInfo');
    duijiangjilu({userid : userData.id}).then(res => {
      if (res){
        this.setData({yhqArrs : res})
      }
    })

    let navColor = brand == 'VEROMODA' ? '#0072CB' : '#0055FA'
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: navColor
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

  }

})