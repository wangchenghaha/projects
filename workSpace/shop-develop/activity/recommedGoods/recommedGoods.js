import { retailRecGoods ,getGoodsList} from '../../service/goods'
import { URL_CDN } from '../../src/const.js'
import {skuToImg, translateArray, splitImg} from '../../utils/utils'
const app = getApp();
const brand = app.config.brand;
const cdn = app.config.cdn;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSaleArr: [],
    goHomeImg: splitImg('icon_home.png', 'common'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if(app.config.brand === 'FOL'){
      this._getGoodsList();
    } else {
      this.getRetailRecGoods();
    }
    wx.setStorageSync('recommed', true);
  },

  getRetailRecGoods: function(){
    let param = {
      projectName: 'retailRec',
      brand: brand,
      token:"bsjl",
    };
    retailRecGoods(param).then(res => {
      let result = res.filter(item => item.colorCode);
      let skuParam = {
        size: URL_CDN.IMGSIZE7201280
      };
      result.forEach(item => {
        skuParam.sku = item.colorCode;
        item.goodsImg  = cdn + skuToImg(skuParam)
      });
      this.setData({
        hotSaleArr: translateArray(result, 2)
      })
    })
  },

  _getGoodsList: function(){
    let goodsListParam = {
      classifyIds:'',
      currentpage: 1,
      goodsHighPrice: '',
      goodsLowPrice: '',
      goodsSelect: '',
      userBrand : '',
      sortDirection: 'desc',  // 排序方式 asc正、desc倒序 默认倒序
      sortType:  1,
      size: '',
    };
    getGoodsList(goodsListParam).then(res =>{
     
      let result = [];
      res.data.forEach(item => {
        result.push({
          colorCode: item.gsColorCode,
          goodsName: item.goodsName,
          price: item.discountPrice,
          originalPrice: item.originalPrice,
        })
      });
      let skuParam = {
        size: URL_CDN.IMGSIZE7201280
      };
      result.forEach(item => {
        skuParam.sku = item.colorCode;
        item.goodsImg  = cdn + skuToImg(skuParam)
      });
      this.setData({
        hotSaleArr: translateArray(result, 2)
      })
    })
  },

  onClick: function(e){
    let colorCode = e.currentTarget.dataset.code; 
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    })
  },

  goback: function(){
    app.goBack();
  },

})