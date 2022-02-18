// weMall/distributor/customerList/customerList.js
import {distributorCustomerList} from "../../service/distributor";
import {wxShowToast} from "../../../utils/wxMethods";
import {KEYSTORAGE} from "../../../src/const";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCustomerList();
  },
  getCustomerList(){
    let {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    distributorCustomerList(employeeId).then(res => {
      if(res && res.length){
        res.forEach(item => {
          if(item.createTime){
            item.myTime = item.createTime.substr(0,10);
          }
        });
        this.setData({customerList:res})
      }
    }).catch(err => wxShowToast(err.message));
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