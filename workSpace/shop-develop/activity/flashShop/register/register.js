// activity//flashShop/register/register.js

import { splitImg } from '../../../utils/utils'
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";

import {searchUser,createUser} from '../netWork'
var splashImgList = [];

var canTap = true
var isFinish = true  //获取crm后只调1次跳转逻辑
Page({

  /**
   * 页面的初始数据
   */
  data: {
    splashImg : '',
    logoImg : ''
  },

    /**
    * 订阅的事件回调
    */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && event){
      //  获取手机号成功
      this.goQuestions()
    }
  },
  getSystemInfo: function(){

    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
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
        console.log(this.data.splashImg,'***init');
      }
      else{
        this.setData({
          splashImg: `${splashImgList[1].img}`
        })
        console.log(this.data.splashImg,'***init00000');
      }
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    canTap = true
    isFinish = true

    const  version = Date.now();
    splashImgList = [
      {
        scale: 5622,
        img: splitImg(`flashShop750.jpg?v=${version}`), // 375/667 iphone 7
      },
      {
        scale: 4618,
        img: splitImg(`flashShop1125.jpg?v=${version}`),  // 375/812 iphoneX
      },
      {
        scale: 4620,
        img: splitImg(`flashShop828.jpg?v=${version}`),   // 414/896  iphoneXR
      },
    
    ];
    
    let logoImg = this.data.logoImg

    logoImg = splitImg(`vmlogo.png?v=${version}`)

    this.setData({logoImg})

    events.register(this, EVENTS.EVENT_CRMINFO);
    this.getSystemInfo()
  },
  registerTap(){
    if (canTap){
      canTap = false
      setTimeout(() => {
        canTap = true
      }, 10000);

      if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){

        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{
          getApp().getCRMInfoFn()
        }
      }
      else{
        this.goQuestions()
      }

    }
  },
  goQuestions(){
    canTap = true
    if (isFinish){
      isFinish = false

      // 调查询并注册接口

          // 调用查询并创建接口
          let type = wx.getStorageSync('flashShopType');
          let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
          let json = {
            openid : getApp().getOpenId(),
            phone : userInfo.phone,
            location : type
          }
          searchUser(json).then(res => {
            console.log(`查询用户:${JSON.stringify(res)}`)
            if (res){
              // 已有用户
              this.goNextPath(res)
            }
            else{
              // 创建用户
              json = {
                location : type,
                memberno : userInfo.memberno,
                openid : getApp().getOpenId(),
                phone : userInfo.phone,
                unionid : userInfo.unionid
              }
              createUser(json).then(res => {
                console.log(`创建用户:${JSON.stringify(res)}`)
                this.goNextPath(res)
              })
            }
          })

    }

  },
  goNextPath(res){
    wx.setStorageSync('flashShopUserInfo', res);

    wx.showToast({
      title: '注册成功',
      icon: 'none'
    });
    let type = wx.getStorageSync('flashShopType');
    setTimeout(() => {

      if (type == 'hangzhou' || type == 'shanghai' || type == 'beijing'){
        wx.redirectTo({
          url: '../questions/questions'
        });
      }
      else{
        wx.redirectTo({
          url: '../otherQuestion/otherQuestion'
        });
      }

    }, 1500);

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
      
      if (wx.getStorageSync('isMember')){
        if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
          getApp().getCRMInfoFn()
        }
      }
    }, 2000);
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