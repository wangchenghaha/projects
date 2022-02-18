import { getExOrderDetail } from '../ex'
const { URL_CDN } = require('../../src/const');
let queryParam = {};
let timer = null;
let refreshCount = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrap: 'none',
    headerImg: URL_CDN.STATUS_ORDER_OK,
    description: '',
    intentType: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let { exchangeCode, intentType } = options;
    wx.setNavigationBarTitle({ title: getApp().config.title });
    wx.showLoading({
      title: '加载中...'
    });
    if (intentType) {
      this.setData({ intentType: intentType });
    }

    if (exchangeCode) {
      this.setData({
        exchangeCode: exchangeCode,
      });
      queryParam = {
        brandCode: getApp().config.brand,
        exchangeCode: exchangeCode
      }
    }
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
    setTimeout(() => {
      this.showPayResult();
    }, 3000);
  },

  showPayResult: function () {
    getExOrderDetail(queryParam)
      .then(res => {
        this.setData({
          exDetailBean: res,
          wrap: 'block',
        });
        let orderStatus = res.status;
        if (orderStatus == 'RECEIVED') {
          //支付失败，还是已入库状态
          this.setData({
            titleTip: "换货单支付未完成",
            description: '请您稍后再次尝试支付',
            headerImg: URL_CDN.STATUS_ORDER_NO,
          });
          timer = setInterval(() => {
            ++refreshCount > 3 ? clearInterval(timer) : getExOrderDetail(queryParam);
          }, 1500);
        } else {
          this.setData({
            titleTip: "换货单支付成功",
            description: '我们将会在第一时间响应您的订单',
            headerImg: URL_CDN.STATUS_ORDER_OK,
          });
          clearInterval(timer);
        }
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: `${e.message}`,
        });
        ++refreshCount > 3 ? clearInterval(timer) : getExOrderDetail(queryParam);
      });
  },

  lookOrder: function (e) {
    //TODO: 进入订单详情页
    console.log(" this.data.intentType ==  " + this.data.intentType);
    console.log(" this.data.intentType==fromExOrderDetailPage?????" + this.data.intentType == "fromExOrderDetailPage");
    // if (this.data.intentType == "fromExOrderDetailPage" || this.data.intentType == "fromOrderList") {
    wx.navigateBack({
      delta: 1,
    });
    // } else if (this.data.intentType == "fromOrderDetail") {

    // }
  },

  gotoHomePage: function (e) {
    wx.navigateBack({
      delta: 10,
    });
  }

})