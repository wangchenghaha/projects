// pintuan/pintuan_paySuccess/pintuan_paySuccess.js
import {KEYSTORAGE,EVENTS} from "../../src/const";
import{PTGetFaceAndIcon,PTGetGoodsDetailPinTuan} from '../netWork/pintuanRquest.js'
import {
  yipinNumber
} from '../../utils/utils'

import events from "../../src/events";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 几人团
    personRequire : 0,
    // 已拼件数
    yipinNumber : 0,
    // 详情数据
    detailData:{},
    // 分享的数据
    isShare : {},
    faceAndIcon : {
      face : '',
      icon : '',
      otherIcons : []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // if (options.shareJson){
    //   let json = JSON.parse(options.shareJson)
    //   wx.setStorageSync('detailData',json.detailData)
    //   wx.setStorageSync('orderData',json.orderData)
    //   wx.setStorageSync('pintuanGsColorCode',json.pintuanGsColorCode)
    // }
    events.register(this, EVENTS.EVENT_LOGINED);


    if (wx.getStorageSync(KEYSTORAGE.loginInfo)){
      this.requstData()
    }

  },
  requstData:function(){
    var detailData = this.data.detailData
    Object.assign(detailData,wx.getStorageSync('detailData'))

    let djson = wx.getStorageSync('orderData');


    let personRequire = this.data.personRequire

    
    this.setData({
      detailData
    })

    setTimeout(() => {
      PTGetGoodsDetailPinTuan(wx.getStorageSync('pintuanGsColorCode')).then(a=>{
        let eee = a[wx.getStorageSync('pintuanGsColorCode')]
        personRequire = eee.personRequire
        
        console.log(`拼团数据:${JSON.stringify(eee)}`)
        this.setData({
          yipinNumber : yipinNumber(eee.startTime),
          personRequire
        })


        // 获取团所有参与人
        PTGetFaceAndIcon(djson.bigorderCode).then(e=>{
          if (e){
            var faceAndIcon = this.data.faceAndIcon
            faceAndIcon.otherIcons = ['']
            e.forEach(item=>{
              if (item.pintuanOrderType == 0){
                faceAndIcon.face = item.customerNickname
                faceAndIcon.icon = item.customerFaceImg
  
              }
              else{
                if (personRequire > faceAndIcon.otherIcons.length){

                  faceAndIcon.otherIcons.push(item.customerFaceImg)
                }
              }
            })

        if (detailData.pintuanOrderType == '1' && personRequire == 2){
          faceAndIcon.otherIcons = ['']

          var wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
          faceAndIcon.otherIcons.push(wxInfo.avatarUrl)
          if (wxInfo.nickName == '' || wxInfo.avatarUrl == ''){
            faceAndIcon.otherIcons = ['']
            var that = this
            wx.getUserInfo({
              success: (res) => {
                if(res.errMsg === 'getUserInfo:ok'){
                  Object.assign(wxInfo, res.userInfo);
                  wx.setStorageSync(KEYSTORAGE.wxInfo, wxInfo)
                  faceAndIcon.otherIcons.push(wxInfo.avatarUrl)
      
                  that.setData({
                    faceAndIcon
                  })
                }
              }
            })
          }

        }
            this.setData({
              faceAndIcon
            })
          }
        })

      })
        
    }, 2000);
  }, 
  //回到首页
  gotoIndex : function(e){
    wx.switchTab({
      url: '/pages/index/index'
    })

  },
  // 订单详情页
  toOrderDetail:function(e){
    wx.navigateTo({ url: `../pintuanOrder_success/pintuanOrder_success` });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {
      //用户登录成功
      if (this.data.faceAndIcon.icon == ''){
        this.requstData()
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
      else{
        
        var timer = setInterval(() => {
          if (this.data.faceAndIcon.otherIcons.length == 1){
            this.requstData()
          }
          else{
            clearInterval(timer)
          }
        }, 5000);
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  //   let detailData = wx.getStorageSync('detailData')
  //   let orderData = wx.getStorageSync('orderData')
  //   let pintuanGsColorCode = wx.getStorageSync('pintuanGsColorCode')

  //   var shareJson = {
  //     detailData,
  //     orderData,
  //     pintuanGsColorCode
  //   }
  //   let path = `/pintuan/pintuan_paySuccess/pintuan_paySuccess?shareJson=${JSON.stringify(shareJson)}`
  //   console.log(`分享地址:${path}`)
  //   return{
  //     title: '',
  //     path : path,
  //     imageUrl : '',
  //     success:function(e){
  //       console.log(`分享成功`)
  //     },
  //     fail:function(e){
  //       console.log(`分享失败`)
  //     }
  //   }
  // }
})