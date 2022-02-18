/*
 * @Author: yxw
 * @Date: 2020-11-01 15:27:29
 * @LastEditTime: 2020-11-01 23:54:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /JACKJONES/order/giftList/giftList.js
 */

import { wxShowToast } from '../../utils/wxMethods'
import { promotionGoods } from '../../service/promotion'
import { getGoodsDetail } from '../../service/goods'
import { animateShow, animateHide, skuToImg, chengfa } from '../../utils/utils'
import { URL_CDN } from '../../src/const'
const app = getApp();
const { cdn } = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList: [],
    // 购买数量
    count: 1,
    // 是否显示详情
    showDetail: false,
    // 选中商品
    selectColorList: [],
    // 选中商品命
    goodsName: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { ruleId = '' } = options;
    this.pageData.ruleId = ruleId;
    this.getGiftList();
  },
  // 分页数据
  pageData: {
    totalPage: 1,
    currPage: 1,
    pageSize: 10,
    ruleId: ''
  },
  getGiftList() {
    promotionGoods(this.pageData).then(res => {
      let { giftList } = this.data;
      wx.hideLoading();
      if (res && res.totalCount) {
        let { list, totalPage } = res;
        if (list && list.length) {
          const skuToImgParam = {
            size: URL_CDN.IMGSIZE7201280
          };
          list.forEach(item => {
            skuToImgParam.sku = item.gsColorCode;
            item.goodsImg = cdn + skuToImg(skuToImgParam);
            if (item.discount === 9) {
              item.newDiscount = '一口价';
            } else {
              item.newDiscount = `${chengfa(item.discount, 10)}折`;
            }
          });
          giftList = giftList.concat(list);
          this.pageData.totalPage = totalPage;
          this.setData({
            giftList,
          })
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  closeDetail() {
    this.setData({
      showDetail: false,
    })
  },
  selectedGoods(e) {
    const { index } = e.currentTarget.dataset;
    const { gsColorCode = '' } = this.data.giftList[index];
    wx.showLoading({
      title: '加载中...',
      mask:true,
    });
    getGoodsDetail(gsColorCode).then(res => {
      wx.hideLoading();
      if(res && Array.isArray(res.color) && res.color.length){
        const selectColorList = res.color.filter(item => item.colorCode === gsColorCode);
        this.setData({
          goodsName: res.goodsName,
          selectColorList,
          showDetail: true
        })
      }
    }).catch(err => wxShowToast(err.message))

  },
  selectSize(e){
    const { index } = e.currentTarget.dataset;
    const { selectColorList } = this.data;
    if (selectColorList[0].sizes[index].sellStock > 0) {
      selectColorList[0].sizes.forEach((item, ind) => item.myActive = index === ind)
      this.setData({ selectColorList });
      return;
    } 
    wxShowToast('库存不足，请选择其他尺码')
  },
  confirmBuy() {
    const { selectColorList, count, goodsName } = this.data;
    const selectColor = selectColorList[0]
    const selectSize = selectColor.sizes.filter(item => item.myActive);
    if(selectSize.length === 0){
      wxShowToast('请选择尺码');
      return;
    }
    
    let selectGoods = {
      color: selectColor,
      size: selectSize[0],
      goodsName,
      nums: count,
      goodsCode: selectColor.colorCode.slice(0,9),
      goodsSku: selectSize[0].sku,
      discount: selectColor.discount,
      onePrice: selectColor.price.toFixed(2),
      allPrice: (selectColor.price * count).toFixed(2),
      isGift: 'Y'
    };
    wx.setStorageSync('isJiajiagou', selectGoods);
    wx.navigateBack({ delta: 1 });
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
    let pageData = this.pageData;
    let {currPage, totalPage} = pageData;
    if(currPage >= totalPage){
      wxShowToast('数据加载完毕');
      return;
    }
    pageData.currPage = currPage +1;
    this.getGiftList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})