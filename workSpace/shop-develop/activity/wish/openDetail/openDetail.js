import { wishDetail} from "../../service/wish";
import { chengfa } from "../../../utils/utils";
import {wxShowToast } from "../../../utils/wxMethods";
import {URL_CDN} from "../../../src/const";
import {skuToImg} from "../../../utils/utils";
const app = getApp();
const {brand, cdn} = app.config;
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo:{},
    wishDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    this.handleScene();
    this.getWishDetail();
  },
  handleScene(){
    if(curOptions.scene){
      const scene = decodeURIComponent(curOptions.scene);
      curOptions.id = scene.split('=')[1];
      console.log(curOptions,'****')
    }

  },
  joinWish(){
    app.goBack();
  },
  getWishDetail(){
    const param = {
      xinyuandanId: curOptions.id,
      brand
    };
    wishDetail(param).then(res => {
      if(res){
        res.skuList.forEach(item => {
          const param = {
            size: URL_CDN.IMGSIZE240400,
            sku: item.gcsSku
          };
          item.goodsImg = cdn + skuToImg(param)
        });
        this.setData({wishDetail: res})
      }
    }).catch(err => wxShowToast(err.message))
  },
  finish(){
    const {wishDetail} = this.data;
    const checkGoods = wishDetail.skuList.filter(item => item.myChecked);
    if(!app.checkLogin()){
      return;
    }
    if(!checkGoods.length){
      wxShowToast('请选择商品');
      return
    }
    /*allPrice: 699
    colorName: "Black黑色"
    delId: "5f3bd5bd765d2c5e3724fcdd"
    discount: 1
    goodsCode: "32047D006"
    goodsColorCode: "32047D006S59"
    goodsName: "复古风荷叶碎花长袖雪纺连衣裙"
    goodsSku: "32047D006S59380"
    gscolPicPath: "/goodsImagePC/VEROMODA/32047D006/32047D006S59/32047D006S59_p3.jpg"
    nums: 1
    onePrice: "699.00"
    originalPrice: "699.00"
    sizeName: "165/84A/M"*/
    
    checkGoods.forEach((item, index) => {
      const goodsCode = item.gcsSku.substr(0,9), colorCode = item.gcsSku.substr(0,12);
      const goodsCount = 1;
      if(index === 0){
        const simpleWish = {};
        for(let key in wishDetail){
          if(typeof wishDetail[key] === 'string' || typeof wishDetail[key] === 'number'){
            simpleWish[key]= wishDetail[key];
          }
        }
        item.wishDetail = simpleWish;
      }
      item.allPrice = chengfa(item.discountPrice, goodsCount);
      item.goodsCode = goodsCode;
      item.goodsColorCode = colorCode;
      item.goodsSku = item.gcsSku;
      item.gscolPicPath = `/goodsImagePC/${brand}/${goodsCode}/${colorCode}/${colorCode}_p3.jpg`;
      item.nums = goodsCount;
      item.onePrice = item.discountPrice;
      // item.sizeName, item.colorName, discount, originalPrice, goodsName
    });
    console.log(checkGoods,'*****');
    wx.setStorageSync('dingdanCon',checkGoods);
    wx.navigateTo({
      url: '/pages/orderSave/orderSave',
    });
  },
  changeCheck(e){
    const checkIndex = e.detail;
    const {wishDetail} = this.data;
    wishDetail.skuList[checkIndex].myChecked = !wishDetail.skuList[checkIndex].myChecked;
    this.setData({wishDetail});
    // console.log(e.detail)
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