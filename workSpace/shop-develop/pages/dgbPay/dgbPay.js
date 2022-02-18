import {KEYSTORAGE, EVENTS, URL_CDN} from "../../src/const";
import {getReceipt, orderDetail} from "../../service/order.js";
import events from '../../src/events';
import {objToQuery, skuToImg} from "../../utils/utils";
import {payment, wxRequestPayment} from "../../service/pay";
import {wxShowToast} from "../../utils/wxMethods";


const app = getApp();
const {cdn, ORDER_TOKEN} = app.config
var scene = '';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    logo: URL_CDN.DGBPAY_LOGO,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_LOGINED);
    scene = decodeURIComponent(options.scene);
    if(app.checkLogin()){
      this.getOrderDetail(scene);
    }
  },

  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      if (scene) {
        this.getOrderDetail(scene);
      } else {
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/index/index'
        });
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

  },

  //获取订单详细信息
  getOrderDetail(dingdanCode) {
    const param = {
      orderToken: ORDER_TOKEN,
      bigorderCode: dingdanCode
    }
    orderDetail(param).then(res => {
      wx.hideLoading();
      if(res && Object.keys(res).length){
        const {goodsOrderList} = res;
        goodsOrderList.forEach(item => {
          let skuToImgParam = {
            sku: item.gcsSku,
            size: URL_CDN.IMGSIZE240400
          };
          item.goodsImg = cdn + skuToImg(skuToImgParam);
        })
        this.setData({
          orderDetail: res,
        });
      }

      //对商品信息的图片地址进行变换
      // res.goodsOrders.forEach(goodsInfo => goodsInfo.gscolPicPath = `${cdn}/${goodsInfo.gscolPicPath}`);

    }).catch(err => {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: err.msg,
        showCancel: false,
        success: function (ress) {
          if (ress.confirm) {
            app.goBack();
          }
        }
      })
    });
  },

  //继续逛逛
  toIndex: function (e) {
    app.goBack();
  },
  wxPay(){
    const {bigorderCode, payToken, payTokenTime, orderToken, id} = this.data.orderDetail
    const param = { bigorderCode, payToken, payTokenTime };
    const paramString = { orderToken, bigorderCode, id };
    payment(param).then(res => {
      if (res) {
        wxRequestPayment(res).then(payRes => {
          if (payRes) {
            app.wxPaymentReport(bigorderCode, res.code? 'cancel_pay': 'pay');
            wx.navigateTo({
              url: '../wxPayCon/wxPayCon' + objToQuery(paramString)
            });
          }
        });
      }
    }).catch(err => wxShowToast(err.message))
  }
})