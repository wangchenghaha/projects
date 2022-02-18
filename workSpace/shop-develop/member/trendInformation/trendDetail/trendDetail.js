import {bindVistor, getTrendDetail, trendFocus,trendPraise, trendCancelFoucs, trendCancelPraise} from '../../service/trendinfo'
import {wxShowToast} from '../../../utils/wxMethods'
import { splitImg , skuToImg, numToThousand, getCurrentUrl} from '../../../utils/utils'
import { KEYSTORAGE, URL_CDN, EVENTS} from '../../../src/const'
import events from '../../../src/events'
const app = getApp();
const {brand, cdn} = app.config;
let skuToImgParam = {
  size: URL_CDN.IMGSIZE240400
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailId: 0,
    detailData: {},
    goodsImg:'',
    praise: splitImg('praise_nor.png', 'common'),
    praised: splitImg('praise_sel.png', 'common'),
    shareImg: splitImg('share_trend.png', 'common'),
    rightArrImg: splitImg('next_trend.png', 'common'),
    visitorId: 0,
    autoplay: true,
    interval: 3000,
    duration: 500,
    goodsImgs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_CRMINFO)
    this.setData({
      detailId: options.id,
      visitorId: options.visitorid
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
    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
      getApp().checkLogin()
    }
    else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
      console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{

        wx.showLoading({
          title: '加载中……',
          mask: true
        });
        setTimeout(() => {
          wx.hideLoading();
          getApp().getCRMInfoFn()
        }, 2000);

      }
    }
    else{
      if(wx.getStorageSync('trendVisiorId')){
        this.setData({
          visitorId: wx.getStorageSync('trendVisiorId')
        })
        this._getTrendDetail();
      } else {
        this._bindVistor()
      }
    }
  },

  /**
 * 接受授权成功刷新页面
 */
  handleEvent: function (event, type) {
    if (type == EVENTS.EVENT_CRMINFO) {
      if(wx.getStorageSync('trendVisiorId')){
        this.setData({
          visitorId: wx.getStorageSync('trendVisiorId')
        })
        this._getTrendDetail();
      } else {
        this._bindVistor()
      }
    }
  },


  _bindVistor(){
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let json = {
      avatarUrl: wxInfo.avatarUrl || '',
      nickname: wxInfo.nickName || '',
      openid: wxInfo.openId,
      phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      unionid: wxInfo.unionId
    }
    bindVistor(json).then(res =>{
      this.setData({
        visitorId: res.id
      })
      wx.setStorageSync('trendVisiorId', res.id)
      this._getTrendDetail();
    })
  },


  _getTrendDetail(){
    let {detailId, visitorId, goodsImgs} = this.data
    let json = {
      trendId: detailId,
      visitorId: visitorId
    }
    getTrendDetail(json).then(res =>{
      skuToImgParam.sku = res.skus;
      this.setData({
        detailData: res,
        goodsImg: `${cdn}${skuToImg(skuToImgParam)}`,
        goodsImgs: res.imgs ? JSON.parse(res.imgs) : []
      })
    })
  },

  onClick(e){
    let { visitorId, detailData} = this.data;
    let type = e.currentTarget.dataset.type;
    switch(type){
      case 'foucs':
        if(detailData.isFocusAuthor){
          this._trendCancelFoucs();
        } else {
          this._trendFocus();
        }
        break;
      case 'praise':
        if(detailData.isPraise){
          this._trendCancelPraise(detailData.id)
        } else {
          this._trendPraise(detailData.id)
        }
        app.gioTrack('pageclick_trendyzone_article_like', {
          content_Id: detailData.id,
          title: detailData.title
        })
        break;
      case 'goods':
        app.gioTrack('pageclick_trendyzone_article_viewproduct', {
          content_Id: detailData.id,
          title: detailData.title,
          spu_id: detailData.skus
        })
        wx.navigateTo({
          url: '/pages/content/content?colorCode=' + detailData.skus
        })
        break;
      case 'author':
        wx.navigateTo({
          url: '../autorCenter/autorCenter?authorId='+ detailData.authorId + '&visitorid=' + visitorId
        })
        break;
    }

  },

  _trendPraise(){
    let { visitorId, detailData} = this.data;
    let json = {
      trendId: detailData.id,
      visitorId: visitorId
    }
    trendPraise(json).then(res =>{
      detailData.isPraise = true
      detailData.praiseTotal = numToThousand(detailData.praiseTotal  + 1)
      this.setData({
        detailData
      })
    })
  },

  _trendCancelPraise(){
    let {visitorId, detailData} = this.data;
    let json = {
      trendId: detailData.id,
      visitorId: visitorId
    }
    trendCancelPraise(json).then(res =>{
      detailData.isPraise = false
      detailData.praiseTotal = numToThousand(detailData.praiseTotal  - 1)
      this.setData({
        detailData
      })
    })
  },

  _trendFocus(){
    let { visitorId, detailData} = this.data;
    let json={
      authorId: detailData.authorId,
      visitorId: visitorId
    }
    wx.showLoading({
      title: '关注中...',
      mask: true,
    })
    trendFocus(json).then(res => {
      wx.hideLoading()
      wxShowToast("关注成功！");
      detailData.isFocusAuthor = true;
      this.setData({
        detailData
      })

    }).catch(err =>{
      wx.hideLoading()
    })
  },

  _trendCancelFoucs(){
    let {autorId, visitorId, detailData} = this.data;
    let json={
      authorId: detailData.authorId,
      visitorId: visitorId
    }
    wx.showLoading({
      title: '取关中...',
      mask: true,
    })
    trendCancelFoucs(json).then(res => {
      wx.hideLoading();
      wxShowToast("已取消关注！");
      detailData.isFocusAuthor = false;
      this.setData({
        detailData
      })
    }).catch(err =>{
      wx.hideLoading();
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let pagePath = getCurrentUrl()
    let { detailData } = this.data;
    // pageclick_trendyzone_article_share
    app.gioTrack('pageclick_trendyzone_article_share', {
      content_Id: detailData.id,
      title: detailData.title
    })
    return {
      path: `/${pagePath}`
    }
  }
})
