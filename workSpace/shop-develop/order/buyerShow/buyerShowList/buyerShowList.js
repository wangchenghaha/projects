import {getGoodsComment} from '../../service/buyerShow'
import {wxShowToast} from '../../../utils/wxMethods'
import {buyerShowImage, splitImg, skuToImg} from '../../../utils/utils'
import { KEYSTORAGE, URL_CDN } from '../../../src/const.js'
var app = getApp();

  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage: 1,
    goodsCode: '',
    listData: '',
    replyIcon: splitImg('reply_icon.png','common'),
    agreeIcon: splitImg('agree_icon.png?v=1','common'),
    picIcon: splitImg('picNum_icon.png','common'), 
    isBottom: false,
    goodsImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku: options.colorCode,
    };
    this.setData({
      goodsCode: options.goodCode,
      goodsImg :`${app.config.cdn}${skuToImg(skuToImgParam)}`
    })
    this._getGoodsComment();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  _getGoodsComment: function(){
    let {goodsCode, curPage, listData, isBottom} = this.data;
    let jsData = {
      goodsCode: goodsCode,
      currentPage: curPage,
      isBuyerShow: 'Y'
    }
    getGoodsComment(jsData).then(res =>{
      if(curPage >= res.totalPage){
        isBottom = true;
      }
      for (let i = 0; i < res.list.length; i++) {
        res.list[i].headimgurl = res.list[i].headimgurl?res.list[i].headimgurl : splitImg('evaluate _default_icon.png','common')
        res.list[i].evaluateImgs =  buyerShowImage(res.list[i].buyerShowImgs, false)
      }
      if(listData && listData.list.length > 0){
        listData.list = listData.list.concat(res);
      } else {
        listData = res;
      }

      this.setData({
        listData,
        isBottom
      })
    }).catch(err=>{
      wxShowToast(err)
    })
  },

  onClick: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../buyerShowDetail/buyerShowDetail?id='+ id
    })
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
    let {curPage, isBottom} = this.data;
    if(isBottom){
      return;
    }
    curPage = curPage + 1;
    this.setData({
      curPage,
    })
    this._getGoodsComment();
  },

  goDetail: function(e){
    wx.navigateBack({
      delta: 1
    })
  }
})