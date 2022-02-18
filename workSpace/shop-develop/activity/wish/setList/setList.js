import {splitImg, skuToImg, jiafa} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
import {URL_CDN, KEYSTORAGE} from '../../../src/const'
import {getAddress} from "../../../service/member";
import {wishGoodsList, wishGoodsRemove, generateWish} from "../../service/wish";
const app = getApp();
const {cdn, brand, wishMsg = [], wishColor = ''} = app.config;
Page({
  data: {
    banner: splitImg('xinfeng@2x.png?v=1102'),
    locationIcon: splitImg('location@2x.png', 'common'),
    noGoodsImg: splitImg('no-goods@2x.png?v=1'),
    goodsList: [],
    msg: wishMsg.length ? wishMsg[0] : '',
    showMsg: false,
    textColor: wishColor
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWishGoodsList();
  },
  goMyWish() {
    wx.navigateTo({
      url: '../myWishList/myWishList'
    })
  },
  changeMsg(){
    let {msg} = this.data;
    const curMsgIndex = wishMsg.findIndex(item => item === msg);
    if (curMsgIndex === -1 || curMsgIndex === wishMsg.length - 1){
      msg = wishMsg[0]
    }else{
      msg = wishMsg[curMsgIndex + 1]
    }
    this.setData({msg})
  },
  createWish(){
    const { goodsList, address, showMsg, msg } = this.data;
    if (goodsList.length === 0) {
      wxShowToast('请添加商品！');
      return;
    }
    const selectGoods = goodsList.filter(item => item.myChecked);
    if(selectGoods.length === 0){
      wxShowToast('请选择商品！');
      return
    }
    // if(!showMsg){
    //   this.setData({showMsg: true});
    //   return;
    // }
    const {phone, userName, province, city, area, detailAddress} = address;
    if(!phone || !userName || !province || !city || !area || !detailAddress){
      wxShowToast('请选择地址！');
      return;
    }
    const {nickName, avatarUrl, unionId, openId} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let totalPrice = 0, goodsTotalCount = 0;
    selectGoods.forEach(item => {
      totalPrice += jiafa(totalPrice, item.discountPrice || 0);
      goodsTotalCount += 1;
      delete item.goodsImg
    });
    const param = {
      brand,
      unionId,
      openId,
      nickName,
      totalPrice,
      goodsTotalCount,
      province,
      city,
      detailAddress,
      phone,
      msg,
      faceImg: avatarUrl,
      district: area,
      consignee: userName,
      skuList:selectGoods,
    };
    generateWish(param).then(res => {
      if(res && res.xinyuandanId){
        wx.navigateTo({
          url: `../list/list?id=${res.xinyuandanId}`
        })
      }
    }).catch(err => wxShowToast(err.message))
  },
  goBack(){
    app.goBack();
  },
  changeCheck(e){
    const index = e.detail;
    const {goodsList} = this.data;
    goodsList[index].myChecked = !goodsList[index].myChecked;
    this.setData({goodsList})
  },
  inputMsg(e){
    this.setData({msg:e.detail.value});
  },
  // 获取心愿单商品列表
  getWishGoodsList(){
    // {"code":0,
    // "skuList":[
    // {"colorName":"Eggnog蜜乳白色","discount":1,"discountPrice":699,"gcsSku":"32047C004A06380","goodsName":"亮丝混纺复古印花雪纺连衣裙","gsColorCode":"32047C004A0","originalPrice":699,"sizeName":"165/84A/M"},{"colorName":"Midnight blue深蓝色","discount":1,"discountPrice":699,"gcsSku":"32047C004E39380","goodsName":"亮丝混纺复古印花雪纺连衣裙","gsColorCode":"32047C004E3","originalPrice":699,"sizeName":"165/84A/M"},{"colorName":"Black黑色","discount":1,"discountPrice":699,"gcsSku":"32047D006S59380","goodsName":"复古风荷叶碎花长袖雪纺连衣裙","gsColorCode":"32047D006S5","originalPrice":699,"sizeName":"165/84A/M"}],"status":"success"}
    wishGoodsList(brand).then(res => {
      if(res){
        const {skuList = []} = res;
        if(Array.isArray(skuList) && skuList.length){
          skuList.forEach(item => {
            const param = {
              size: URL_CDN.IMGSIZE240400,
              sku: item.gcsSku
            };
            item.goodsImg = cdn + skuToImg(param)
          });
          this.setData({goodsList: skuList})
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  emptyGoods(e){
    const {goodsList} = this.data;
    console.log(e);
    goodsList.splice(e.detail, 1);
    this.setData({ goodsList })
  },
  // 删除商品
  deleteGoods(e){
    const {index} = e.currentTarget.dataset;
    const {goodsList} = this.data;
    const param = {
      gcsSku: goodsList[index].gcsSku,
      brand
    };
    wishGoodsRemove(param).then(res => {
      if(res.code === 0){
        wxShowToast('删除成功');
        goodsList.splice(index, 1);
        this.setData({goodsList})
      }
    }).catch(err => wxShowToast(err.message))
  },
  _getAddress(){
    let localAddress = wx.getStorageSync('dingdanAddress');
    if(localAddress && localAddress.phone){
      if(localAddress.city.includes('行政')){
        localAddress.city = localAddress.area;
        wx.setStorageSync('dingdanAddress', localAddress);
      }
      if(localAddress.city === '县' || localAddress.province === '重庆市'){
        localAddress.city = localAddress.province;
        wx.setStorageSync('dingdanAddress', localAddress);
      }
      this.setData({address: localAddress});
      return;
    }
    getAddress().then(res => {
      if(res.length){
        let addressObj = {}, num = 0;
        res.forEach(item => {
          item.defaultAddress === 'Y' ? addressObj = item : num++;
        });
        res.length === num ? addressObj = res[0] : '';
        wx.setStorageSync('dingdanAddress', addressObj);
        this.setData({address: addressObj});
      }
    });
  },
  selectAddress(){
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getAddress();
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