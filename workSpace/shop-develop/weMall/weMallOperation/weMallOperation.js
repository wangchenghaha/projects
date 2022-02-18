// weMall//weMallOperation/weMallOperation.js
import {splitImg} from "../../utils/utils";
import {guideStudy} from "../../service/guide";
import {KEYSTORAGE} from "../../src/const";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  getData: function(){
    let videoList = this.data.videoList;
    guideStudy().then(res => {
      if(res && res.guideShare){
        res.guideShare.forEach(item => {
          videoList.push({
            img: splitImg(item.img),
            videoName: item.videoName
          })
        });
        this.setData({
          videoList
        })
      }
    })
  },
  toNextPage: function (e) {
    const dataIndex = e.currentTarget.dataset.index;
    const videoName = this.data.videoList[dataIndex].videoName;
    try {
      app.tdSdkEvent(`pageclick_instruction_vedio${dataIndex+1}`, {
        GUIDE_DAID:wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId || ''
      });
    }catch (e) {

    }
    wx.navigateTo({
      url: `/weMall/daogouVideo/daogouVideo?videoName=${videoName}`,
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