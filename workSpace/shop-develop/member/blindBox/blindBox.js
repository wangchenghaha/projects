import {chengfa, splitImg} from '../../utils/utils'
import { wxShowToast } from '../../utils/wxMethods'
import { blindBoxGoods, blindBoxStock } from '../service/blindBox'
import { goodsColorList } from '../../service/goods'
const app = getApp();
const {brand, cdn} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: splitImg('blind_box_02.jpg'),
    boxList: [
      {
        imgList: [
          splitImg('blind_box_05.jpg'),
          splitImg('blind_box_08.jpg'),
        ],
        text: '恋爱杂货店联名宽松\n圆领印花T恤',
        price: 299,
        type: 'column'
      },
      {
        imgList: [
          splitImg('blind_box_11.jpg'),
          splitImg('blind_box_14.jpg'),
        ],
        text: '简约时尚圆领小黄鸭\n卡通印花T恤',
        price: 109.5,
        type: 'column'
      },
      {
        imgList: [
          splitImg('blind_box_17.jpg'),
          splitImg('blind_box_19.jpg'),
        ],
        text: '时尚气质镭射印花撞色\n条纹半高筒袜子',
        price: 109.5,
        type: 'row'
      },
      {
        imgList: [
          splitImg('blind_box_23.jpg'),
          splitImg('blind_box_24.jpg'),
        ],
        text: '防紫外线光\n墨镜太阳镜',
        price: 249,
        type: 'row'
      }
    ],
    // 盲盒商品
    goodsList: {},
    // 图片列表
    imgList: [],
    // 盲盒1
    type: 1,
    // 促销ID
    ruleId: ''
  },

  /**
   * {ruleId, type}
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlindBoxImg(options)
    this.getBlindBoxGoods(options);
  },
  getBlindBoxImg(options){
    const boxImgCount = [7, 7, 8, 8, 8, 8, 10]
    const { type = 1, ruleId} = options;
    const curBoxCount = boxImgCount[type - 1];
    if(curBoxCount){
      const imgList = []
      for(let i = 1; i <= curBoxCount; i ++){
        imgList.push(`${cdn}/assets/common/${brand}/image/blind_box${type}_0${i}.jpg`)
      }
      this.setData({imgList, type, ruleId})
    }
  },
  async onClick(e){
    if(!app.checkLogin()){
      return
    }
    // const { index } = e.currentTarget.dataset;
    const {goodsList, type, ruleId} = this.data;
    if(goodsList && Array.isArray(goodsList) && goodsList.length){
      const orderData = [];
      if(!ruleId){
        wxShowToast('没有相关促销')
        return
      }
      // 判断库存
      wx.showLoading({
        title: '请稍后',
        mask: true
      })
      const res = await blindBoxStock(ruleId);
      wx.hideLoading()
      if(res && res.stock <= 0){
        wx.showModal({
          title: '提示',
          content: ' 活动太火爆了，已经抢完了',
          showCancel: false,
          success(res) {
          }
        })
        return
      }
      goodsList.forEach(item => {
        orderData.push({
          goodsName: item.goodsName,
          nums: item.quantity,
          goodsCode: item.goodsCode,
          goodsColorCode: item.gsColorCode,
          colorName: item.colorName,
          sizeName: item.sizeName,
          goodsSku: item.goodsSku,
          discount: item.discount,
          onePrice: Number(item.discountPrice).toFixed(2),
          allPrice: chengfa(item.discountPrice, item.quantity),
          gscolPicPath: item.gscPicmainPath,
          originalPrice: item.originalPrice,
          promotionData: {
            name: '盲盒',
            typeCode: '1002',
            id: ruleId
          }
        })
      })
      wx.setStorageSync('dingdanCon', orderData);
      wx.navigateTo({
        url: '/pages/orderSave/orderSave'
      });
    }
  },
  getBlindBoxGoods(options){
    const {type} = options;
    wx.showLoading({
      title: '加载中'
    })
    blindBoxGoods().then(res => {
      if(res){
        // 当前盒子
        const curBox = res[`mysteryBox${type}`];
        if(curBox && curBox.proList && Array.isArray(curBox.proList) && curBox.proList.length){
          // 当前盒子商品
          let goodsList = curBox.proList;
          const goodsColorArr = [];
          goodsList.forEach(item => goodsColorArr.push(item.gsColorCode));
          goodsColorList(goodsColorArr).then(goods => {
            wx.hideLoading()
            if(Array.isArray(goods) && goods.length){
              goods.forEach(newItem => {
                const curIndex = goodsList.findIndex(item => item.gsColorCode === newItem.gsColorCode);
                const { discountPrice, originalPrice, discount} = newItem;
                // 更新价格
                Object.assign(goodsList[curIndex], {discountPrice, originalPrice, discount})
              })
            }
            this.setData({goodsList})
          }).catch(err => wxShowToast(err.message))

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: `${brand}惊喜盲盒 限时首发`
    })
    app.checkLogin()
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
