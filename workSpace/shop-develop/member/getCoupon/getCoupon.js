
var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var util = require(pagePath + "utils/utils.js");
var url = require(pagePath + "base/url.js");
var tongji = require('../../utils/tongji.js');
var app = getApp();
var _brandIndex = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCoupon : {},

    onOff: false
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
    _brandIndex = 0;
    var json = wx.getStorageSync('couponCon');
    json.activityURL = json.activityURL;
    json.couponCard = json.couponCard;
    this.setData({
      getCoupon: json
    });

    if( json._brand == 'only' ){
      _brandIndex = 1;
    }else if( json._brand == 'jj' ){
      _brandIndex = 2;
    }else if( json._brand == 'vm' ){
      _brandIndex = 3;
    }else if( json._brand == 'slt' ){
      _brandIndex = 4;
    };

    /* 统计代码 */
    var _pages = getCurrentPages();
    var _this_page = _pages[_pages.length - 1].route;
    var _prevPage = wx.getStorageSync('prevPage');
    var _url = wx.getStorageSync('appInitData');
    if (_prevPage == '') {
      tongji.tongji(_this_page, _url.scene, '');
    } else {
      tongji.tongji(_this_page, _prevPage, '');
    };
    wx.setStorageSync('prevPage', _this_page);
    /* 统计代码 */

  },

  duihuan: function(){

    this.setData({
      onOff: true
    });

  },

  duihuan_false: function(){
    this.setData({
      onOff : false
    });
  },

  duihuan_true: function(){
    wx.showLoading({
      title: '加载中...'
    });

    var quan = this.data.getCoupon;

    var data = {
      type: quan.type,
      coupon_id: quan.couponNumber,
      brand: _brandIndex,
      callback_url: "",
    };

    main.request(url.getCoupon, data, function (res) {
      if (res.data.errcode == 0) {
        var cardList = res.data.data.cardList;
        wx.addCard({
          "cardList": cardList,
          'success': function (_res) {
            that.setData({
              ShowRule: 0,
              showIconDownload: 1,
              showCoupon: 0
            });
          }
        });
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.errmsg,
          showCancel: false
        });
      }
    }, "", "POST");

    /*if ( _type== '优惠券' ){
      http.req(
        'voucher/exchangeVoucher?phone=' + _user_phone,
        {
          "intergrationid": quanId,
          "quantity": 1
        },
        {
          token: wx.getStorageSync('token'),

          'content-type': 'application/json'
        },
        'POST',
        function (res) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          });
        },
        function () {
          wx.hideLoading();
        }
      );
    }else if( _type == '活动券' ){
      http.req(
        {
          "promotionCode": quanId
        },
        {
          token: wx.getStorageSync('token'),

          'content-type': 'application/json'
        },
        'POST',
        function (res) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          });
        },
        function () {
          wx.hideLoading();
        }
      );
    };*/
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
