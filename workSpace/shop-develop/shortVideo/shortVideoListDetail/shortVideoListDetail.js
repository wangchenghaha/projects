// pages/index/shortVideos/shortVideoListDetail/shortVideoListDetail.js
import {
  getShortVideoDetail,
  priseShortVideo,
  shareVideo
} from '../netWork/shortVideoRquest'
import{numToWan} from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 动画参数
    animationBol:false,
    // 控制弹框
    isBounces : false,
    // 分享弹框
    share:false,
    // 详情数据
    detailData : {}
  },
  // 弹框事件
  bouncesTap : function(){
    this.setData({

      animationBol:true

    })
    setTimeout(() => {
      this.setData({

        isBounces : true
      })
    }, 100);
  },
  shareTap:function(){
    this.setData({
      share : true
    })
  },
  shareOnClick:function(){
    this.setData({
      share : false
    })
  },
  onClick:function(e){
    setTimeout(() => {
      this.setData({

        animationBol:false
      })
    }, 100);
    setTimeout(() => {
      this.setData({
        isBounces : false
      })
      
      if (e.detail.codeStr == 'total'){
        // 全部美衣
        wx.navigateTo({ url: '../shortVideoTotalView/shortVideoTotalView' });
      }
      else if (e.detail.codeStr == 'kankan'){
        console.log(`aaa:${e.detail.detailParam.gsColorCode}`)
        wx.navigateTo({
          url: `/pages/content/content?colorCode=${e.detail.detailParam.gsColorCode}`
          // url: `/pages/content/content?colorCode=419201614C13`
        })
      }
    }, 200);

    
  },
  zan : function(e){


    if(!this.data.detailData.isPrise){
      var detailData = this.data.detailData
      detailData.priseCount = parseInt(detailData.priseCount) + 1
      detailData.isPrise = true

      this.setData({
        detailData
      })

      let json = {
        openId : wx.getStorageSync('wxOpenID'),
        videoId : detailData.id
      }
      priseShortVideo(json).then(item=>{
        console.log(`点赞结果:${JSON.stringify(item)}`)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let utm_source = 'shortVideo'
    var utm_medium = 'shortVideo_view'
    var eveName = `打开短视频_`
    
    if (options.shareJson){
      let json = JSON.parse(options.shareJson)
      wx.setStorageSync('shortVideoDetailParams',json.detailData)
      utm_medium = 'shortVideo_share'
      eveName = `打开分享的短视频_`
    }

    var detailData = wx.getStorageSync('shortVideoDetailParams');
    console.log(`接收的参数:${JSON.stringify(detailData)}`)
    detailData.priseCount = numToWan(detailData.priseCount)

    let fileNames = detailData.videoUrl.split('/')
    var fileName = ''
    fileNames.forEach(item => {
      fileName = item
    });
    let utm_term = fileName
    let utm_campaign = detailData.videoTitle
    let utmJson = {
      utm_source,
      utm_medium,
      utm_term,
      utm_campaign
    }
    getApp().setUtmOptions(utmJson);
    eveName = `${eveName}${detailData.videoTitle}_${fileName}`

    let collectParam = Object.assign(utmJson, {eventName: eveName});
    getApp()._collectData2(collectParam)

    wx.setNavigationBarTitle({ title: detailData.videoTitle });
    

    // 详情数据
    getShortVideoDetail(detailData.id,wx.getStorageSync('wxOpenID')).then(item=>{
      detailData.isPrise = item.isPrise
      detailData.priseCount = numToWan(item.priseCount)
      this.setData({
        detailData
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.shareOnClick()

    let detailData = wx.getStorageSync('shortVideoDetailParams')
    let fileNames = detailData.videoUrl.split('/')
    var fileName = ''
    fileNames.forEach(item => {
      fileName = item
    });

    var shareJson = {
      detailData
    }
    let path = `/shortVideo/shortVideoListDetail/shortVideoListDetail?shareJson=${JSON.stringify(shareJson)}`
    console.log(`分享地址:${path}`)
    return{
      title: detailData.videoTitle,
      path : path,
      imageUrl : detailData.coverImgUrl,
      success:function(e){
        console.log(`分享成功`)
        shareVideo(detailData.id).then(item=>{
          console.log(`分享结果:${JSON.stringify(item)}`)
        })
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  }
})