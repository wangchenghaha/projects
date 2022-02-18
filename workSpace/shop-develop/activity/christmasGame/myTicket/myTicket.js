// activity//courierGame/myTicket/myTicket.js
import {duijiangjilu} from "../../service/christmasNet"
import {TICKET} from '../gameParams'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TICKET,
    yhqArrs : [],
    userData : {},

    noViewHeight : wx.getSystemInfoSync().windowHeight

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();

    let userData = this.data.userData

    
    userData = wx.getStorageSync('maristmasData');
    wx.removeStorageSync('maristmasData');
    this.setData({
      userData
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