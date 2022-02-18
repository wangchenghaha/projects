import {pages} from '../server/album'
import {wxShowToast} from '../../utils/wxMethods'
let curPage = 1, isPull = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curPage = 1
    this.getPages();
  },
  getPages() {
    wx.showLoading({
      title: '请求中',
    })
    pages(curPage).then(res => {
      wx.hideLoading()
      if(res && res.records && res.records.length){
        isPull = curPage !== res.pages;
        let { list } = this.data;
        list.push(...res.records)
        this.setData({ list  })
      }
    }).catch(err => wxShowToast(err.message))
  },
  onClick(e){
    const { url } = e.currentTarget.dataset;
    if(url){
      getApp().navigateTo(url)
    }
  },
  goTop: function(){
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  onPullDownRefresh: function () {
    this.setData({list: []});
    curPage = 1;
    isPull = true;
    this.getPages();
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(isPull){
      curPage++;
      this.getPages();
    }else{
      wxShowToast('数据加载完成')
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
