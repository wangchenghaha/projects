import { EVENTS, KEYSTORAGE } from '../../../src/const.js'
import { trendAutorCenter, trendFocus,trendPraise, trendCancelFoucs, trendCancelPraise} from '../../service/trendinfo'
import {wxShowToast} from '../../../utils/wxMethods'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarImg:'',
    nickName: '',
    listData: [], 
    autorId:'',
    publishTotal: 0,
    autorData: {},
    vistorId: '',
    personalProfile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      autorId: options.authorId,
      vistorId: options.visitorid
    })
    this._trendAutorCenter();
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


  _trendAutorCenter(){
    let {autorId, vistorId} = this.data;
    let json={
      authorId: autorId,
      visitorId: vistorId
    }
   
    trendAutorCenter(json).then(res =>{
      this.setData({
        autorData: res,
        avatarImg: res.avatarUrl,
        nickName: res.nickname,
        listData: res.works,
        publishTotal: res.publishTotal,
        personalProfile: res.personalProfile
      })
    })
  },

  onClick(e){
    let {autorData} = this.data;
    if(autorData.isFocusAuthor){
      this._trendCancelFoucs();
    } else {
      this._trendFocus();
    }

    autorData.isFocusAuthor = !autorData.isFocusAuthor;
    this.setData({
      autorData
    })
  },


  clickPraise(e){
    let detail = e.detail;
    if(detail.isPraise){
      this._trendCancelPraise(detail.id)
    } else {
      this._trendPraise(detail.id)
    }
  },

  _trendPraise(_trendId){
    let {listData, vistorId} = this.data;
    let json = {
      trendId: _trendId,
      visitorId: vistorId
    }
    trendPraise(json).then(res =>{
      for (let i = 0; i < listData.length; i++) {
          if(listData[i].id === _trendId){
            listData[i].isPraise = true
            listData[i].praiseTotal = listData[i].praiseTotal + 1
          }
      }
      this.setData({
        listData
      })
    })
  },

  _trendCancelPraise(_trendId){
    let {listData, vistorId} = this.data;
    let json = {
      trendId: _trendId,
      visitorId: vistorId
    }
    trendCancelPraise(json).then(res =>{
      for (let i = 0; i < listData.length; i++) {
        if(listData[i].id === _trendId){
          listData[i].isPraise = false
          listData[i].praiseTotal = listData[i].praiseTotal - 1
        }
      }
      this.setData({
        listData
      })
    })
  },

  _trendFocus(){
    let {autorId, vistorId} = this.data;
    let json={
      authorId: autorId,
      visitorId: vistorId
    }
    wx.showLoading({
      title: '关注中...',
      mask: true,
    })
    trendFocus(json).then(res => {
      wx.hideLoading()
      wxShowToast("关注成功！");
    }).catch(err =>{
      wx.hideLoading()
    })
  },

  _trendCancelFoucs(){
    let {autorId, vistorId} = this.data;
    let json={
      authorId: autorId,
      visitorId: vistorId
    }
    wx.showLoading({
      title: '取关中...',
      mask: true,
    })
    trendCancelFoucs(json).then(res => {
      wx.hideLoading();
      wxShowToast("已取消关注！");
    }).catch(err =>{
      wx.hideLoading();
    })
  }


})