// pages/guize/index.js
const jsonPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/redRain_charged/guize.json?${new Date().getTime()}`
import{getGuizeJson} from '../../service/redRain_charged'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    json : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getGuizeJson(jsonPath).then(res=>{

      this.setData({
        json : res
      })

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