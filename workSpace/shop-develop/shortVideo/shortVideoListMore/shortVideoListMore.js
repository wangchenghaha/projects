// pages/index/shortVideos/shortVideoListMore/shortVideoListMore.js

import {
  getShortVideoList
} from '../netWork/shortVideoRquest'
import{numToWan} from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTitles:[{
      name : '热门',
      select : true
    },{
      name : '最新',
      select : false
    }],
    // 数据
    listData : [],
    // 请求参数
    requstData : {
      brandCode : getApp().config.brand,
      pageNumber : 1, //页数
      pageSize : 12, //每页数据
      isIndex : 0
    },
    // 全部页数
    totalPage : 0,
    // 滚动到顶部
    goTopShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({ title: '精选短视频' });


    this.requst()
  },
  requst:function(){
    var requstData = this.data.requstData
    var totalPage = this.data.totalPage
    var goTopShow = this.data.goTopShow
    getShortVideoList(
      JSON.stringify(requstData)
      .replace(/:/g,'=')
      .replace(/,/g,'&')
      .replace(/\"/g,'')
      .replace(/{/g,'')
      .replace(/}/g,'')
      ).then(res=>{
        // console.log(`请求requst:${JSON.stringify(res)}`)
        var listData = this.data.listData
        if(requstData.pageNumber == 1){
          listData = res.videoList
          goTopShow = false
        }
        else{
          goTopShow = true
          listData = listData.concat(res.videoList)
        }
        totalPage = res.totalCount
        listData.forEach(item => {
          item.priseCount = numToWan(item.priseCount)
        });

        this.setData({
          listData,
          totalPage,
          goTopShow
        })
      })
  },
  onClick:function(e){
    let selectIndex = e.target.id
    let type = e.target.dataset.type
    if (type == 'top'){
      var topTitles = this.data.topTitles
      topTitles.forEach((item,index) => {
        if (index == selectIndex){
          item.select = true
        }
        else{
          item.select = false
        }
      });

      var requstData = this.data.requstData

      requstData.pageNumber = 1
      requstData.isIndex = parseInt(selectIndex)
      this.setData({
        requstData,
        topTitles
      })
      this.requst()
    }
    else{
      var item = e.target.dataset.item
      // console.log(`点击的数据是:${JSON.stringify(item)}`)
      // 处理没用的字段，防止分享时候出现414http错误
      item.goodsList.forEach(a => {
        a.classifyIds = ''
        a.classifyNames = ''
        a.gscolorCodes = ''
        a.brandName = ''
        a.categoryName = ''
        a.colorName = ''
        a.goodsType = ''
        a.colorName = ''
        a.colorName = ''
        a.colorName = ''
      });
      item.putOnTime = ''
      item.createdTime = ''
      item.putOffTime = ''
      item.updatedTime = ''
      item.author = ''
      item.createdBy = ''

      wx.setStorageSync('shortVideoDetailParams',item)
      wx.navigateTo({ url: '../shortVideoListDetail/shortVideoListDetail' });
    }
  },
  gotoTop:function(){

    wx.pageScrollTo({scrollTop: 0 });
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
    console.log('上拉')
    var requstData = this.data.requstData

    if (this.data.listData.length < this.data.totalPage){
      requstData.pageNumber += 1
      this.setData({
        requstData
      })
      this.requst()
    }
    else{
      wx.showToast({
        title: '暂无数据', //提示的内容,
        icon: 'none', //图标,
        duration: 1000, //延迟时间,
        mask: false, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})