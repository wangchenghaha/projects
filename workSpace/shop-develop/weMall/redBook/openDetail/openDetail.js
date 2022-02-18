// weMall/redBook/openDetail/openDetail.js
import {redBookDetail, redBookUpdate} from "../../service/redBook";
import {wxShowToast} from "../../../utils/wxMethods";
const app = getApp();
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    avatarUrl: '',
    //
    share_by: '',
    bookDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id='', nickName, avatarUrl = '', share_by = ''} = options;
    this.getRedBooKDetail(id);
    app.setShareInfo(options);
    app.setUtmOptions(options);
    if(nickName || avatarUrl){
      this.setData({nickName, avatarUrl})
    }
    this.setData({share_by})
    curOptions = options
  },
  getRedBooKDetail(id){
    redBookDetail(id).then(res => {
      if(res && Object.keys(res).length){
        const {matchJson, id, openCount} = res;
        if(matchJson){
          res.matchJson = JSON.parse(matchJson);
          this.setData({bookDetail: res, nickName: res.nickname, avatarUrl: res.portrait});
          this.updateCount(res)
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  updateCount(res){
    const param = {
      id: res.id,
      openCount: res.openCount + 1
    };
    redBookUpdate(param).then(res => {
    }).catch(err => console.error(err.message))
    app._collectData2(Object.assign(curOptions, {
      eventName: `打开模板_${res.id}_${res.pageTitle}`,
      eventValue: (curOptions.utm_source && curOptions.utm_source.includes('miniLink')) ? '朋友圈' : '对话框'
    }));
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
