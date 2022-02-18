// pages/help/index.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/redRain_charged/`
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events"
import {renwuAction} from '../renwu'

import{getGameConfig,searchUserInfo,createUserInfo,help} from '../../service/redRain_charged'
// 游戏开始/结束日期
let startTime = 0
let endTime = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:`${imgPath}help.jpg`,
    goHomeImg : `${imgPath}/goHome1.png`,
    // 来自分享的数据
    userData : {},
    // 当前用户的信息
    myUserData : {}
  },
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
      if (type == EVENTS.EVENT_GAMECRMINFO && event) {
          //  获取手机号成功
              
          if (startTime === 0){
            this.getDatas()
          }
      } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    startTime = 0
    endTime = 0
    events.register(this, EVENTS.EVENT_GAMECRMINFO)

    const json = JSON.parse(options.params)
    this.setData({
        userData : json
    })

  },
  taps(e){
    if (!renwuAction.checkGameTime(startTime,endTime)){
      return
    }
    const type = parseInt(e.currentTarget.id)
    // console.log(type)
    if (type === 1){
      // 支援
      if (Object.keys(this.data.userData).length > 0){
          var openID = wx.getStorageSync('wxOpenID');
          help({
              friendOpenid : openID,   //打开链接人的openid
              userId : this.data.userData.userid,   //发链接人的is
              friendFacePic : this.data.myUserData.facePic,  //打开链接人的openid
              nickName : this.data.myUserData.nickName  //打开连接人的nickname
          })
      }

    } else {
      wx.navigateTo({
        url: '../index/index'
      });
    }
  },
  getDatas(){
    // 用户信息
    if (startTime === 0){
      getGameConfig().then(e => {
          startTime = new Date(e.data.activityStartTime.replace(/-/g, '/')).getTime()
          endTime = new Date(e.data.activityEndTime.replace(/-/g, '/')).getTime()
      })
    }
    let openID = wx.getStorageSync('wxOpenID');
    searchUserInfo({openid : openID}).then(e => {
      
        if (!e.data) {
          let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
          let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
          let phone = userInfo.phone
          if (phone.length == 12) {
              phone = phone.substr(0, 11)
          }

          // 创建用户
          let json = {
              phone: phone,
              openid: openID,
              nickName: wxInfo.nickName,
              facePic: wxInfo.avatarUrl,
              memberno: userInfo.memberno,
              crmRegTime: userInfo.joindate
          }
          
          createUserInfo(json).then(e => {
            this.makeData(e.data)
          })

      } else {
        this.makeData(e.data)
      }
    })
  },
  makeData(json){
    this.setData({
      myUserData : json
    })
  },

  goHome(){
    getApp().goBack()
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
    wx.showLoading({
        title: '加载中……',
        mask: true
      });
      setTimeout(() => {
        wx.hideLoading();
        if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
          getApp().navigateTo('member/login/login?game=true')
          return;
        }
        else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
            this.getDatas()
        }
       
      }, 1000);

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