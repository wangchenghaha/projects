
var http = require('../../utils/httpclient.js');
var main = require("../../base/main.js");
var url = require("../../base/url.js");
var tongji = require('../../utils/tongji.js');
var app = getApp();
var index_index = 0;
const cdn = app.config.cdn;
const brand = app.config.brand;

//CDN地址
const { URL_CDN } = require('../../src/const');

//获取我的优惠券列表
function getPoints(that) {

  //SELECTED
  main.request(URL_CDN.COUPON_DETAILS_SE, {}, function (res) {
    if (res.statusCode == 200) {
      var Data = res.data.couponMsg.SLT;
      var _arr = new Array();
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].channel.indexOf('MINIWX') >= 0) {
          _arr.push(Data[i]);
        };
      };
        if(_arr.length > 0){
            that.setData({
                brand_slt: _arr,
                syQh: false
            });
        }
    };
  });

  //ONLY
  main.request(URL_CDN.COUPON_DETAILS_OL, {}, function (res) {
    if (res.statusCode == 200) {
      var Data = res.data.couponMsg.ONLY;
      var _arr = new Array();
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].channel.indexOf('MINIWX') >= 0) {
          _arr.push(Data[i]);
        };
      };
        if(_arr.length > 0){
            that.setData({
                brand_only: _arr,
                syQh: false
            });
        }
    };
  });

  //JACKJONES
  main.request(URL_CDN.COUPON_DETAILS_JJ, {}, function (res) {
    if (res.statusCode == 200) {
      var Data = res.data.couponMsg.JJ;
      var _arr = new Array();
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].channel.indexOf('MINIWX') >= 0) {
          _arr.push(Data[i]);
        };
      };
        if(_arr.length > 0){
            that.setData({
                brand_jj: _arr,
                syQh: false
            });
        }
    };
  });

  //VEROMODA
  main.request(URL_CDN.COUPON_DETAILS_VM, {}, function (res) {
    if (res.statusCode == 200) {
      var Data = res.data.couponMsg.VM;
      var _arr = new Array();
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].channel.indexOf('MINIWX') >= 0) {
          _arr.push(Data[i]);
        };
      };
        if(_arr.length > 0){
            that.setData({
                brand_vm: _arr,
                syQh: false
            });
        }
    };
  });



};


//获取积分兑换的商品列表
function getPointList(that){
  http.req(
    'point/goodsList',
    { platform: 'H5'},
    {
      token: wx.getStorageSync('token'),
      
      'content-type': 'application/json'
    },
    'GET',
    function (res) {

      if (res.data.code == 0) {
        var _list = res.data.data;
        for( var i=0;i<_list.length;i++ ){
          var nine = _list[i].goodsCode.substr(0,9);
          var onetwo = _list[i].goodsCode;
          if(app.config.brand === 'NAMEIT'){
            _list[i].picimg = `${cdn}/goodsImagePC/${brand}/${nine}/${onetwo}/${onetwo}_p7.jpg`;
          }else{
            _list[i].picimg = `${cdn}/goodsImagePC/${brand}/${nine}/${onetwo}/${onetwo}_p3.jpg`;
          }

        };
        
        that.setData({
          sp_list: _list
        });
      };
      wx.hideLoading();
    },
    function () {
      wx.hideLoading();
    }
  );
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      img: URL_CDN.LOGO_BLACK_SQUARE
    },
    squareLogo: {
      jj: URL_CDN.LOGO_BLACK_SQUARE_JJ,
      oy: URL_CDN.LOGO_BLACK_SQUARE_OL,
      slt: URL_CDN.LOGO_BLACK_SQUARE_ST,
      vm: URL_CDN.LOGO_BLACK_SQUARE_VM
    },
    vip_con: {},

    vip_cards:[ 
      URL_CDN.VIP_CARD_BASIC,   //普卡
      URL_CDN.VIP_CARD_SILVER,  //银卡
      URL_CDN.VIP_CARD_GOLDEN   //金卡
    ],
    vip_cardImg: URL_CDN.VIP_CARD_BASIC,   //普卡
    syQh: true,

    sp_list: [],
    imgSrc: URL_CDN.POINT_TOP_BG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    index_index = 0;
    if( options.index ){
      if( options.index == '1' ){
        index_index = 1;
      };
    }else{
      index_index = 0;
    };
    wx.showLoading({
      title: '加载中'
    });
      if(options.coupon){
          getPoints(this)
          this.setData({
              syQh: false
          });
      }else if(options.gifts){
          getPointList(this)
          this.setData({
              syQh: true
          });
      }else {
          getPoints(this)
          getPointList(this)
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //TODO brand 硬编码
    main.request(url.getUserinfo, { brand: getApp().config.etoBrand }, function (res) {
      wx.setStorageSync('user_info', res.data.data.user_info);
      var user_con = res.data.data.user_info;
      var userInfo = wx.getStorageSync('userInfo');
      if (user_con.name) {
        var _index = 0;
        if (user_con.level == '普通会员') {
          _index = 0;
        } else if (user_con.level == '银卡会员') {
          _index = 1;
        } else if (user_con.level == '金卡会员') {
          _index = 2;
        };
        that.setData({
          vip_con: user_con,
          vip_cardImg: that.data.vip_cards[_index],
          'user.img': userInfo.avatarUrl 
        });
      };
    }, 1);

    getPointList(that);

    if( index_index == 1 ){
      getPoints(that);
      that.setData({
        syQh: false
      });
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
  
  },

  //去我的积分页面
  toMyPoints: function () {
    wx.navigateTo({
      url: '/pages/fashionID/myPoints/myPoints'
    });
  },

  //商品优惠券按钮点击切换
  syqh: function(e){
    var that = this;
    var _index = parseInt(e.currentTarget.dataset.index);
    if( _index == 0 ){
      that.setData({
        syQh : true
      });
    }else{
      getPoints(that);
      that.setData({
        syQh: false
      });
    };
  },

  //goToIndex
  goToIndex: function(){
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  toJifenBuyContent: function(e){
    var goodsCode = e.currentTarget.dataset.code;
    var id = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    var score = e.currentTarget.dataset.score;
    
    wx.navigateTo({
      url: '../jifenBuyContent/jifenBuyContent?goodsCode=' + goodsCode + '&money=' + money + '&score=' + score + '&id=' + id
    });
  },


  toLingqu: function (e) {
    var json = e.currentTarget.dataset.json;
    json._brand = e.currentTarget.dataset.brand;
    wx.setStorageSync('couponCon', json);

    wx.navigateTo({
      url: '../getCoupon/getCoupon'
    });
  }

})