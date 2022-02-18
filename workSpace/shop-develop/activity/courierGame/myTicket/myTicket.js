// activity//courierGame/myTicket/myTicket.js
import {duijiangjilu} from "../../service/courierNet"
const brand = getApp().config.brand
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/courierImgs/`
const version = Date.now();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    yhqArrs : [],
    userData : {},

    noViewHeight : wx.getSystemInfoSync().windowHeight,
    jinbiImg : '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let jinbiImg = this.data.jinbiImg
    let userData = this.data.userData
    jinbiImg = `${imgPath}jinbi.png?v=${version}`
    
    userData = wx.getStorageSync('courierData');
    wx.removeStorageSync('courierData');
    this.setData({
      userData,
      jinbiImg
    })
  

    this._duihuanjilu()
  },

  _duihuanjilu(){
    duijiangjilu({userid : this.data.userData.id}).then(res => {
      if (res){
        this.setData({yhqArrs : res})
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

  }
})