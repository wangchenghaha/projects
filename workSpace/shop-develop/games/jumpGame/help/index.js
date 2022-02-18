// pages/help/index.js
// const imgPath = `../jumpGames/`
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/jumpGames/`

import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";

import {searchUser,createUser,activiGameTime,addZhuli} from '../netWorking'
var isCreateUser = false

var userData = {}

const brand = getApp().config.brand
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    zhanweiView : false,

    myIcon : '',
    otherIcon : ''
    
  },

  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    this.setData({zhanweiView : true})
  }
  else if (type == EVENTS.EVENT_LOGINED && event){

    if (!wx.getStorageSync('isMember')){
      getApp().isMemberETO()
    }
    else{
      getApp().getCRMInfoFn()
    }
  }
  else if (type === EVENTS.EVENT_CRMINFO && event){
     //  获取手机号成功
       if (JSON.stringify(userData) === '{}'){
        this.nextTap()
       }
  }
},
nextTap(callback){
  let zhanweiView = this.data.zhanweiView
  zhanweiView = false
  this.setData({zhanweiView})

  isCreateUser = false

  let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
  let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)


  let myIcon = this.data.myIcon
  let otherIcon = this.data.otherIcon
  
  myIcon = wxInfo.avatarUrl
  otherIcon = userData.picUrl
  this.setData({myIcon,otherIcon})

  let params = `openId=${wxInfo.openId}`
  console.log(`crm信息助力页:${JSON.stringify(userInfo)}`)
  searchUser(params).then(e=>{
    if (!e){
      // 创建新用户
      let json = {
        phone : userInfo.phone,
        openid : wxInfo.openId,
        facePic : wxInfo.avatarUrl,
        nickName : wxInfo.nickName,
        points : 0,
        memberno : userInfo.memberno
      }

      createUser(json).then(res =>{
        // console.log(`创建用户信息:${JSON.stringify(res)}`)
        isCreateUser = true
        if (callback){
          callback()
        }
      })
    }
    else{
      // console.log(`查询用户信息:${JSON.stringify(e)}`)
      isCreateUser = true
      if (callback){
        callback()
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    isCreateUser = false

    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);

    let json = JSON.parse(options.params)
    userData.userid = json.userid
    userData.picUrl = json.picUrl
    userData.openid = json.openid
    

    let shareBy = json.share_by
    let shareByShop = json.share_by_shop

    let utmJson = {
      utm_source: json.utm_source,
      utm_medium: json.utm_medium,
      utm_term: json.utm_term,
      utm_campaign: json.utm_campaign
    }
    let collectParam = Object.assign(utmJson, { eventName: `打开跳一跳助力页_${json.userid}` });
    getApp()._collectData2(collectParam)


    let orderSaveShare = {
      shareBy,
      shareByShop
    };
    getApp().setShareInfo(orderSaveShare);
  },
  // 返回
  backTap(){
    console.log(`返回`)

    var pageList = getCurrentPages();
    if (pageList.length > 1){
      wx.navigateBack({
        delta: 1
      });
    }
    else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    
    
      
  },
  goHome(){

    wx.switchTab({
      url: '/pages/index/index'
    })
    
  },

  tiaozhan(){

    if (userData.openid == ''){
      wx.showModal({
        title: '提示',
        content: '分享参数有误,请重新分享',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F'
      });
      return
    }
    

    if (!isCreateUser){
      this.nextTap(() => {
        console.log(`调用查询或创建用户完成`)
        this.goWelCome()
      })
    }
    else{
      this.goWelCome()
    }
  },
  goWelCome(){

    activiGameTime().then(res => {
      // console.log(`活动时间:${JSON.stringify(res)}`)
      let currentTime = new Date().getTime()
      let startTime = new Date(res.activityStartTime.replace(/-/g,'/')).getTime()
      let endTime = new Date(res.activityEndTime.replace(/-/g,'/')).getTime()


      if (currentTime > startTime && currentTime < endTime){
        // 活动开启

        let openID = wx.getStorageSync('wxOpenID');
        // 助力
        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let json = {
          userid : userData.userid,
          friendOpenid : openID,
          friendFacePic : wxInfo.avatarUrl,
          nickName : escape(wxInfo.nickName)
        }
        addZhuli(json).then(res => {})
        
        wx.redirectTo({
          url: '../welCome/index'
        })

      }
      else{
        let _this = this
        wx.showModal({
          title: '提示',
          content: '活动已结束',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              _this.backTap()
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
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

    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    setTimeout(() => {
      wx.hideLoading();
      
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
      else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{
          getApp().getCRMInfoFn()
        }
      }
      else{
        _this.nextTap()
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