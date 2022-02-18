// businessCouponSubpack/pages/couponList/couponList.js
import couponDataModel from '../../models/coupon.model'
import mainService from '../../services/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gzhImgHeight: 0,
    scrollHeight: 0,
    couponDatas: [],
    couponInfoDatas: {},
    gzhData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.info('couponDatas', couponDataModel)
    this.setData({
      couponDatas: couponDataModel.couponData,
      couponInfoDatas: couponDataModel.couponInfoData,
      gzhData: couponDataModel.gzhData
    })
  },

  jumpTo() {
    console.info('this.data.gzhData.launch_type', this.data.gzhData.launch_type)
    if (this.data.gzhData.launch_type == 1) {//跳转小程序
      let url = '';
      if( this.data.gzhData.launch_addr.substr(0, 1) == '/'){
        url = this.data.gzhData.launch_addr
      }else{
        url = '/' + this.data.gzhData.launch_addr
      }
      let navtype = mainService.isTabPage(url) ? 3 : 0;
      if(navtype){
        wx.switchTab({
          url: url,
        })
      }else{
        wx.navigateTo({
          url: url,

        })
      }
    } else {
      wx.navigateTo({
        url: `/businessCouponSubpack/pages/webView/webView?linkUrl=${this.data.gzhData.launch_addr}`,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  jumpToCard(e){
    console.info(e)
    let index = e.currentTarget.dataset.index;
    let arr = [];
    arr.push(this.data.couponDatas[index])
    wx.openCard({
      cardList:arr ,
      success: function () {
        console.log('成功进入opencard');
      },
      fail: function (res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  imageLoad(e) {
    console.info('图片加载完成', e)
    var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      gzhImgHeight: res.windowWidth / ratio
    })
    let obj = wx.createSelectorQuery();
    obj.selectAll('.gzh-area').boundingClientRect((rect) => {
      console.info('rect', rect)
      this.setData({
        scrollHeight: rect[0].top - 54
      })
    })
    obj.exec();
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
