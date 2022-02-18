import { getContact } from '../../service/member'
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    bannerImg: `${cdn}/assets/h5/${brand}/image/custop.jpg`,
    buyGoodsIcon: '/images/buygoods.jpg',
    tabBar: [],
    defaultIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  getData: function(){
    wx.showLoading({title: '加载中', mask: true});
    getContact().then( res => {
      this.setData({tabBar: res});
      wx.hideLoading();
    })
  },
  onClick: function(e){
    let dataType = e.currentTarget.dataset.type;
    if(dataType === 'tab'){
      this.changeTab(e)
    }else if(dataType === 'goBack'){
      app.goBack();
    }else if(dataType === 'tel'){
      this.dialing(e)
    }
  },
  dialing: function(e){
    let phoneNumber = e.currentTarget.dataset.phone;
    wx.makePhoneCall({phoneNumber })
  },
  changeTab: function(e){
    const {index} = e.currentTarget.dataset;
    const gioEvent = ['cs', 'exchange', 'return'];
    app.gioTrack(`pageclick_personalcenter_service_${gioEvent[index]}`)
    this.setData({defaultIndex: index})
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
