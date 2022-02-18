import { splitImg } from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    randomMilli: Math.random(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad >>>")
    this.deliveryId = options.delivery_id
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady >>> ")

    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(`onReady >>>  windowHeight =${windowHeight}   windowWidth=${windowWidth} `)
    this.windowWidth = windowWidth
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow >>> ")

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

  onCouponClick: function (ev) {
    console.log(ev)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel5f4724c86c360&delivery_id=${this.deliveryId}`,
      success: (result) => {
        console.log(`redirectTo----- successs`)
      },
      fail: () => {
        console.log(`redirectTo----- fail`)
      },
      complete: () => {
        console.log(`redirectTo----- complete`)
      }
    });
  },

  onGoodClick: function (ev) {
    console.log("onGoodClick  >>>>")
    console.log(ev)
    let colorCode = ev.target.dataset.colorCode
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    });
  },


  onMultiGoodsClick: function (ev) {
    console.log("onMultiGoodsClick  >>>>")
    console.log(ev)
    let x = ev.detail.x
    let halfW = this.windowWidth / 2
    var colorCode
    if (x < halfW) {
      colorCode = "220333064A00"
    } else {
      colorCode = "220333065E40"
    }
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    });
  },

  onIndexClick:function(){
    wx.switchTab({
      url: '/pages/index/index',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }


})