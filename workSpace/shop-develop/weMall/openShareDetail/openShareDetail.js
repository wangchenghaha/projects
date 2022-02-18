import { shareGoods, getCompoundImg, getShareDetail, shareUpdate,  getBrandConfig } from '../../service/guide';
import {wxShowToast} from '../../utils/wxMethods'
import {KEYSTORAGE, PAGESTR} from "../../src/const";
const app = getApp();
const {brand, cdn} = app.config;
const utmOptions = {
  utmCampaign: '', // ID
  utmMedium: 'guideshare',       //  'guideshare'
  utmSource: 'wx_cover_pic_qr',
  utmTerm: '', // DA
};
const shareUser = 'shareCount', shareMoment = 'shareMomentCount';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id, scene='', devFlag = '', shareDevice = '', utmSource = ''} = options;
    if(id){
      console.log('好友分享',options);
      Object.assign(utmOptions,{
        utmTerm:id,
        utmSource
      });
      if(devFlag){
        wx.setStorageSync(KEYSTORAGE.devFlag, devFlag)
      }
      // 分享设备
      if(shareDevice){
        wx.setStorageSync(KEYSTORAGE.shareDevice, shareDevice)
      }
      this.getShareDetail(id, shareUser);
    }else{
      console.log('二维码进入', options)
      // scene = zID%3D493847051038097409
      scene = decodeURIComponent(scene);
      id = scene.split('=')[1];
      // 处理utm参数
      if(id && id.includes(PAGESTR.QY)){
        id = id.replace(PAGESTR.QY,'');
        Object.assign(utmOptions, {
          utmSource: 'wxwork_cover_pic_qr'
        })
      }
      utmOptions.utmTerm = id;
      this.getShareDetail(id, shareMoment)
    }
  },
  async handleOptions(options){

  },
  getShareDetail(id, shareType){
    wx.showLoading({title: '加载中'});
    getShareDetail(id).then(res => {
      wx.hideLoading();
      if(res){
        const {createByOpenid = '', shopCode = '', pageTitle = ''} = res;
        this.setData({shareDetail: res});
        this.shareUpdate(res);
        // 设置utm参数
        app.setUtmOptions(utmOptions);
        // 设置分享信息
        app.setShareInfo({
          share_by: createByOpenid,
          share_by_shop: shopCode,
        });
        setTimeout( () => {
          app._collectData2(Object.assign(utmOptions, {
            eventName: `打开模板_${id}_${pageTitle}`,
            eventValue: shareType === shareUser ? '对话框' : '朋友圈',
            shareBy:createByOpenid,
            shareByShop:shopCode
          }));
        }, 1000)
      }
    }).catch(err => wxShowToast(err.message))
  },
  shareUpdate(detail){
    const {id = '', openCount} = detail;
    const param = {
      id,
      openCount: openCount + 1,
    };
   shareUpdate(param).then(res => {})
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

})