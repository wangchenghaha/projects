

var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const TYPE_EXCHANGE = "exchange";
import { request } from '../../utils/request.js'
import {getDateByOrder,  do_encrypt, objToQuery} from "../../utils/utils";
import {wxShowToast} from "../../utils/wxMethods";
import { paymentNew ,payment,wxRequestPayment} from '../../service/pay'
import { wxSubscription } from '../../utils/wxSubscribe'

// 获取团所有参与人
const getFaceAndIconApi = `${getApp().config.domain}/rest/bigOrder/getPintuanOrderLists?`
// 详情页拼团数据
const detailPintuanApi = `${getApp().config.domain}/rest/pintuan/detail?`
// 当前团人数
var tuanNum = 0;
Page({
  // 拼团人数
  pintuanPersonNum : 0,

  //页面的初始数据
  data: {
    titleLogo:`${cdn}/assets/common/${brand}/image/logo-black-rect.png`,
    payCon:{},
    // 是否是拼团订单
    isPintuan : false
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options);
    this.setData({
      payCon: options
    });
    // 预售
    if(options.orderType && options.orderType === 'preSale'){
    	this.payment();
    	return;
    }
    let pintuan = wx.getStorageSync('isPintuan');
    wx.removeStorageSync('isPintuan');

    if (pintuan){
      this.setData({
        isPintuan : true
      })
      let djson = wx.getStorageSync('detailData');
      if (djson.pintuanOrderType == '1'){
        var str = ''
        let orderJson = wx.getStorageSync('orderData');

        this.PTGetFaceAndIcon(orderJson.bigorderCode).then( item => {
          tuanNum = item.length

            // 活动是否结束
            this.PTGetGoodsDetailPinTuan(options.sku).then(aaa=>{
              let e = aaa[options.sku]
              if(e){
                this.setData({pintuanPersonNum : e.personRequire})

                if (e.endTime < new Date().getTime()){
                  str = '活动已结束'
                  this.showAlter(str)
                }
                else{

                  // 可以支付
                  this.zhifu();
                  try {
                    app.tdSdkEvent('flow_purchase_order_pay_3', {
                      ORDER_ID: options.bigorderCode || '',
                      ORDER_PAY: options.amountPaid || ''
                    })
                  }catch (e) {

                  }

                }
              }
            })
        })

      }
      else{

          // 可以支付
          this.zhifu();
          try {
            app.tdSdkEvent('flow_purchase_order_pay_3', {
              ORDER_ID: options.bigorderCode || '',
              ORDER_PAY: options.amountPaid || ''
            })
          }catch (e) {

          }
      }
    }
    else{

      this.zhifu();
      try {
        app.tdSdkEvent('flow_purchase_order_pay_3', {
          ORDER_ID: options.bigorderCode || '',
          ORDER_PAY: options.amountPaid || ''
        })
      }catch (e) {

      }
    }

  },
  showAlter:function(str){

    wx.showModal({
      title: '提示', //提示的标题,
      content: str, //提示的内容,
      showCancel: false, //是否显示取消按钮,

      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3CC51F', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {
    var that = this;

    wx.setStorageSync('isJiajiagou', {});
    wx.setStorageSync('storageCuxiao', {});
    wx.removeStorageSync('xuanzeQuan');

    app.track();

  },
  //立即支付
  zhifu : function(){
    var _payCon = this.data.payCon;
    // let pintuan = this.data.isPintuan;

    try {
      app.tdSdkEvent('flow_purchase_order_paynow_4', {
        ORDER_ID: _payCon.bigorderCode || '',
        ORDER_PAY: _payCon.amountPaid || ''
      })
    }catch (e) {}

    let params_pintuan = {
      payToken: _payCon.payToken,
      payTokenTime: _payCon.payTokenTime,
      bigorderCode: _payCon.bigorderCode
    }
    payment(params_pintuan).then(res => {

      var Data = res;
      let exchangeCode =_payCon.exchangeCode;
      let intentType = _payCon.intentType;
      wxRequestPayment(Data).then(res => {

        if(res.errMsg && res.errMsg.includes('fail')){

            console.log(" requestPayment >>>>>>>>>  failed >>>>");
            console.log(res);
            if(_payCon.orderType==TYPE_EXCHANGE){
              wx.redirectTo({
                url: `/exchangeGoods/wxPayResult/wxPayResult?exchangeCode=${exchangeCode}&intentType=${intentType}`,
              });
            }else{
            wx.setStorageSync('payConStatus', false);
            wx.redirectTo({
              url: '../wxPayCon/wxPayCon?id=' + _payCon.id + '&orderToken=' + _payCon.orderToken + '&bigorderCode=' + _payCon.bigorderCode
            });
          }
        }else{

          console.log(" requestPayment >>>>>>>>>  success >>>>");
          console.log(res);
          if (getApp().config.jumpGameTemplateIds){
              wxSubscription("pintuanPaySuccess").then(res => {
                this.pintuanNextTap()
              }).catch(err => {
                this.pintuanNextTap()
              });
          }
          else{
            this.pintuanNextTap()
          }
        }

      })
    })

  },

  pintuanNextTap(){

    wx.removeStorageSync('pintuan-utm');
    wx.removeStorageSync('pintuanDetailPage_s');
    wx.removeStorageSync('pintuanDetailPage_nomal');
    // 拼团订单
    wx.showLoading({
      title: 'loading……',
      mask: true
    });
    setTimeout(() => {
      wx.hideLoading();
      let djson = wx.getStorageSync('detailData');
      if (djson.pintuanOrderType == '1'){
        if (tuanNum + 1 < this.data.pintuanPersonNum){
          wx.redirectTo({ url: `/pintuan/pintuanOrder/pintuanOrder` });
        }
        else{
          wx.redirectTo({ url: '/pintuan/pintuan_paySuccess/pintuan_paySuccess' });
        }
      }
      else {
        wx.redirectTo({ url: `/pintuan/pintuanOrder/pintuanOrder` });
      }
    }, 1000);
  },
// 获取团所有的参与人
 PTGetFaceAndIcon : function(bigorderCode){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${getFaceAndIconApi}pintuanOrderPerson=${bigorderCode}`
    }).then(res=>{
      wx.hideLoading();
      if(res.code == 0){
        let arrs = []
        res.data.forEach(es => {

          if (es.status == 'WaitingShipment'){
            arrs.push(es)
          }

        });
        resolve(arrs)
      }
      else{
        reject(new Error(res.msg))
      }
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
},
// 获取商品详情页拼团数据
 PTGetGoodsDetailPinTuan:function(gsColorCode){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:`${detailPintuanApi}goodsCode=${gsColorCode}`
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}


})
