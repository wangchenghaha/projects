// weMall/pages/userService/userService.js
import {getUserService} from '../../service/user'
const app = getApp();
const { cdn, brand } = app.config;
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    banner: `${cdn}/assets/h5/${brand}/image/Protocol.jpg`,
    text: '欢迎您来到绫致时装欢迎您来到绫致',
    userService: {},
    userList: [],
    isLine: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserServiceJson();
    curOptions = options;
  },
  getUserServiceJson: function(){
    let loadingTime = setTimeout(() => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      }, 800)
    });
    getUserService().then(res => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      const tabIndex = curOptions.tab || 0;
      res[tabIndex].active = 'active';
      this.setData({
        userList: res,
        userService: res[tabIndex].content,
      });
    }).catch( err => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    })
  },
  onClick: function(e){
    const dataIndex = e.currentTarget.dataset.index;
    let userList = this.data.userList;
    this.setData({isLine: dataIndex === 0});
    userList.forEach((item, index) =>{
      if(dataIndex === index){
        item.active = 'active';
        this.setData({userService: item.content})
      }else{
        item.active = '';
      }
    });
    this.setData({userList});
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
