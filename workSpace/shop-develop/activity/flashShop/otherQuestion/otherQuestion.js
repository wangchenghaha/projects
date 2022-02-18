// activity//flashShop/otherQuestion/otherQuestion.js
import { splitImg } from '../../../utils/utils'
import {updateFlash} from '../netWork'
var splashImgList = [];
// 下一页用到的数据
var nextPageJson = {
  userInfo : {},
  locationType : '',
  havePrize : false,
  bgImg : '',
  question : ''
}
// 是否拍照过
var isPaizhao = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoJson : {
      top : '完成趣味小测试',
      bottom : '领取专属RIO'
    },
    splashImg : '',
    logoImg : ''
  },

  getSystemInfo: function(){

    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
      let nextImg = ''
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100 && splashImg == ''){
          splashImg = item.img
        }
      });
      if(splashImg){
        this.setData({
          splashImg: `${splashImg}`
        })
        nextImg = splashImg
        console.log(this.data.splashImg,'***init');
      }
      else{
        this.setData({
          splashImg: `${splashImgList[1].img}`
        })
        nextImg = splashImgList[1].img
        console.log(this.data.splashImg,'***init00000');
      }
      nextPageJson.bgImg = nextImg
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const  version = Date.now();
    splashImgList = [
      {
        scale: 5622,
        img: splitImg(`flashShop750.jpg?v=${version}`), // 375/667 iphone 7
        nextImg : ''
      },
      {
        scale: 4618,
        img: splitImg(`flashShop1125.jpg?v=${version}`),  // 375/812 iphoneX
        nextImg : ''
      },
      {
        scale: 4620,
        img: splitImg(`flashShop828.jpg?v=${version}`),   // 414/896  iphoneXR
        nextImg : ''
      },
    
    ];
    
    let logoImg = this.data.logoImg

    logoImg = splitImg(`vmlogo.png?v=${version}`)

    this.setData({logoImg})

    this.getSystemInfo()
    this.checkAttribute()
  },
  checkAttribute(){
    let userInfo = wx.getStorageSync('flashShopUserInfo');
    let locationType = wx.getStorageSync('flashShopType');
    
    nextPageJson.locationType = locationType
    nextPageJson.userInfo = userInfo

    wx.removeStorageSync('flashShopUserInfo');

    if (userInfo.acUserOperation){
      // 有打卡状态
      let json = userInfo.acUserOperation
      
      if (json.labQuestion){
        isPaizhao = true
        if (json.labQuestion.split('|').length > 3){
          // 判断是否领过奖
          if (userInfo.acUserAward && userInfo.acUserAward.hasReceive == 'Y'){
            nextPageJson.havePrize = true
          }
        }
        nextPageJson.question = json.labQuestion.split('|')
        

      }
      else if (json.picShare == 1){
        // 拍照过
        isPaizhao = true
      }
    }
  },
  goNextPage(){
    wx.setStorageSync('nextPageJson', nextPageJson);
    if (isPaizhao){
      wx.redirectTo({
        url: `../questionAndFinish/questionAndFinish`
      });

    }
    else{
      let requestJson = {
        picShare : 1,
        labQuestion : '',
        location : nextPageJson.locationType,
        userId : nextPageJson.userInfo.userId
      }
      updateFlash(requestJson).then(res => {
        
        wx.redirectTo({
          url: `../questionAndFinish/questionAndFinish`
        });
      })
    }




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