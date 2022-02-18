import { KEYSTORAGE, URL_CDN } from '../../src/const.js'
import { getTrack, removeTrack} from '../../service/track' 
import {wxShowToast} from '../../utils/wxMethods'
import {wxUserActions} from "../../service/collect";
var Util = require('../../utils/utils.js');   //网络请求，传参必用
var app = getApp();
const CDN = app.config.cdn;
let goodsDetail;
let colorlist = {};  // 颜色列表
let sizelist ={};    // 尺码列表
let delGood;
let skuToImgParam = {
  size: URL_CDN.IMGSIZE240400
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    //删除商品确认
    remove_display : 'none',
    haveGoods: true,
    noGoods: false,
    trackList:[],
    isEdit: false,
    isSeacher: false,
    collectionNums: 0,
    seacherText: '',
    editText: "编辑",
    isAllSelected: false,
    goodsImg: '',
    goodsSku: '',
    addAndDelGoodsId: "",
    isSelDel: false, // 判断是否是删除操作
    //弹框显示/隐藏
    details_display : 'none',
    isStock: false,
    currentPage: 1,
    projeckName:  app.config.brand === 'SELECTED' ? 'detail-gender':'detailPage',
    isFol: app.config.brand === 'FOL',
    currentPrice:'',
    originalPrice: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this._getTrack();
  },

  onReady: function(){
    var animation_bottom = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    var animation_oapcity = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })

    this.animation_bottom = animation_bottom;
    this.animation_oapcity = animation_oapcity;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //删除事件
  del: function (e) {
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
  },

  _getTrack: function(){
      wx.showLoading({
        title: "加载中...",
        mask:true,
      })
      getTrack().then(res => {
          wx.hideLoading();
          let tracks = res;
          let trackList = this.data.trackList;
          for (let i = 0; i < tracks.length; i++) {
            let skuToImgParam = {
              size: URL_CDN.IMGSIZE240400,
              sku: tracks[i].gsColorCode,
            };
            tracks[i].imagePic =`${CDN}${ Util.skuToImg(skuToImgParam)}`;
            if(this.data.isAllSelected){
              tracks[i].isSelected = true;
            }
          }
          trackList = tracks;
          if(trackList.length > 0){
            this.setData({
              trackList,
              haveGoods: true,
              noGoods: false,
              collectionNums: trackList.length,
            })
          } else {
            this.setData({
              haveGoods: false,
              noGoods: true,
              isBottom: false,
              isEdit: false,
              collectionNums: 0,
            })
          }
          
      }).catch( err=>{
        wx.hideLoading();
        wxShowToast(err.message);
        console.log("err ========== ",err.message);
      })
  },

  collectionEdit: function(){
    let isEdit = this.data.isEdit;
    if(this.data.trackList.length > 0){
      isEdit = !isEdit;
      this.setData({
        isEdit: isEdit,
        editText: isEdit? '完成':'编辑',
      })
    } 
  },

  
  collectionSeacher: function(){
    if(this.data.trackList.length > 0){
      this.setData({
        isSeacher: true,
      })
    }
  },

  canncelSeacher: function(){
    this.setData({
      isSeacher: false,
      currentPage: 1,
      trackList:[],
      searchValue: '',
    })
    this._queryGoodsCollection(1, '');
  },

  // 单选
  checked: function(e){
    let index = e.currentTarget.dataset.index;
    let trackList = this.data.trackList;
    let isSelected = trackList[index].isSelected;
    trackList[index].isSelected = !isSelected;
    let selects = 0;
    let isAllSelected = this.data.isAllSelected;
    for (let i = 0; i < trackList.length; i++) {
       if(trackList[i].isSelected){
          selects++;
       }           // 改变所有商品状态
    }     
    if(selects === trackList.length){
      isAllSelected = true;
    }else {
      isAllSelected = false;
    }       // 改变状态
    this.setData({
      trackList,
      isAllSelected,
    })
  },

  goDetail: function(e){
    let index = e.currentTarget.dataset.index;
    let trackList = this.data.trackList;
    let colorCode = trackList[index].goodsCode;
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    })
  },

  // 全选
  allCheckGood: function(){
    let isAllSelected = this.data.isAllSelected;
    let trackList = this.data.trackList;
    isAllSelected = !isAllSelected;
    for (let i = 0; i < trackList.length; i++) {
      trackList[i].isSelected = isAllSelected;
    }
    this.setData({
      isAllSelected,
      trackList,
    })
  },


  //提示框取消按钮
  remove_false : function(){
    this.setData({
      remove_display: 'none'
    });
  },

  // 批量删除收藏
  deleteSel: function(){
    this.setData({
      isSelDel: true,
    })
    this.removeTrack();
  },

  // 隐藏搜索
  hideToast: function(){
    this.setData({
      isSeacher: false,
    })
  },

  removeTrack: function(){
    let goodsIds = [];
    let goods = this.data.trackList;
    for (let i = 0; i < goods.length; i++) {
      if(goods[i].isSelected){
        goodsIds.push(goods[i].gsColorCode);
      }
  }
    removeTrack(goodsIds).then(res => {
      this.setData({
        isSeacher: false,
        currentPage: 1,
        trackList:[],
        searchValue: '',
      })
      this._getTrack();
      if(this.data.isSelDel){
        wx.showToast({
          title: "删除成功！",
        })
        this.setData({
          remove_display: 'none',
        })
      }
    })
  },


  toIndex: function(){
    app.goBack();
  },

  // 微信用户行为
  _wxUserAction: function(param){
    let data = [];
    data.push({
      action_type: 'ADD_CART',
      action_param: {
        'product_id': param.gsColorCode,
        'industry_id':'',
        'product_name':param.goodsName,
      }
    });
    wxUserActions(data);
  },

})