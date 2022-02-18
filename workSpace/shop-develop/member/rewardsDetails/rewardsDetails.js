// pages/main/index.js
var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
var mCard = require(pagePath + "base/memberCard.js");
var tongji = require('../../utils/tongji.js');
var app = getApp();
//CDN地址
const { URL_CDN } = require('../../src/const');

var system = app.getAppSysInfo();
var _brandIndex = 0;

Page({
    data: {
        Coupon:{
          
            activityURL:URL_CDN.HYZX_ACTIVITY_OY,
            couponCard:"",
            ruleIntroduction:[
                "购买正价品满￥1000减￥100",
                "本券仅限手机官网使用",
                "AA系列不能使用本券",
                "退货则优惠券作废"
            ],
            couponNumber:"",
            type:"优惠券"
        },
        user:{
          header: '',
            name:"冬瓜茶"
        },
        ShowRule:0,
        showIconDownload:1,
        showCoupon:0,
        brand:"jj",
        actindex:0
    },
    onLoad: function(options) {
        this.setData({
            brand:options.brand,
            actindex:options.actindex
        })
    },
    onReady: function() {

    },
    onShow: function(options) {
      _brandIndex = 0;
        wx.setStorageSync("requestList",{});
        var that = this;
        var brand = this.data.brand;
        var actindex = this.data.actindex;
        var userInfo = wx.getStorageSync('userInfo')
        this.setData({
            user:{
                header:userInfo.avatarUrl,
                name:userInfo.nickName
            },
        })
        if (brand == "jj") {
          _brandIndex = 2;
          if (wx.getStorageSync('couponJJ')) {
            let couponJJ = wx.getStorageSync('couponJJ');
            that.setData({
              Coupon: couponJJ
            })
          } else {
            main.request(URL_CDN.COUPON_DETAILS_JJ, {}, function (res) {
              var length = res.data.couponMsg.JJ.length;
              if (length == 0) {
                var _data = that.data.Coupon;
                _data.activityURL = URL_CDN.HYZX_ACTIVITY_JJ;
                that.setData({
                  Coupon: _data
                });
                return;
              };
              let couponJJ = res.data.couponMsg.JJ;
              for(let i=0;i<couponJJ.length;i++){
                if (couponJJ[i].channel.indexOf('MINIWX')>=0) {
                  wx.setStorageSync("couponJJ", couponJJ[i]);
                  that.setData({
                    Coupon: couponJJ[i]
                  });
                  return;
                } else {
                  if( i == (couponJJ.length-1) ){
                    var _data = that.data.Coupon;
                    _data.activityURL = URL_CDN.HYZX_ACTIVITY_JJ;
                    that.setData({
                      Coupon: _data
                    });
                  };
                };
              };
            })
          }
        } else if (brand == "only") {
          _brandIndex = 1;
          if (wx.getStorageSync('couponOL')) {
            let couponOL = wx.getStorageSync('couponOL');
            that.setData({
              Coupon: couponOL
            });
          } else {
            main.request(URL_CDN.COUPON_DETAILS_OL, {}, function (res) {
              var length = res.data.couponMsg.ONLY.length;
              if (length == 0) {
                var _data = that.data.Coupon;
                _data.activityURL = URL_CDN.HYZX_ACTIVITY_OY;
                that.setData({
                  Coupon: _data
                });
                return;
              };
              let couponOL = res.data.couponMsg.ONLY;
              for (let i = 0; i < couponOL.length; i++) {
                if (couponOL[i].channel.indexOf('MINIWX') >= 0) {
                  wx.setStorageSync("couponOL", couponOL[i]);
                  that.setData({
                    Coupon: couponOL[i]
                  });
                } else {
                  var _data = that.data.Coupon;
                  _data.activityURL = URL_CDN.HYZX_ACTIVITY_OY;
                  that.setData({
                    Coupon: _data
                  });
                };
              };

            })
          }
        } else if (brand == "vm") {
          _brandIndex = 3;
          if (wx.getStorageSync('couponVM')) {
            let couponVM = wx.getStorageSync('couponVM');
            that.setData({
              Coupon: couponVM
            })
          } else {
            main.request(URL_CDN.COUPON_DETAILS_VM, {}, function (res) {
              var length = res.data.couponMsg.VM.length;
              if (length == 0) {
                var _data = that.data.Coupon;
                _data.activityURL = URL_CDN.HYZX_ACTIVITY_VM;
                that.setData({
                  Coupon: _data
                });
                return;
              };
              let couponVM = res.data.couponMsg.VM;
              for (let i = 0; i < couponVM.length; i++) {
                if (couponVM[i].channel.indexOf('MINIWX') >= 0) {
                  wx.setStorageSync("couponVM", couponVM[i]);
                  that.setData({
                    Coupon: couponVM[i]
                  });
                } else {
                  var _data = that.data.Coupon;
                  _data.activityURL = URL_CDN.HYZX_ACTIVITY_VM;
                  that.setData({
                    Coupon: _data
                  });
                };
              };


            })
          }
        } else {
          _brandIndex = 4;
          if (wx.getStorageSync('couponSE')) {
            let couponSE = wx.getStorageSync('couponSE');
            that.setData({
              Coupon: couponSE
            })
          } else {
            main.request(URL_CDN.COUPON_DETAILS_SE, {}, function (res) {
              var length = res.data.couponMsg.SLT.length;
              if (length == 0) {
                var _data = that.data.Coupon;
                _data.activityURL = URL_CDN.HYZX_ACTIVITY_ST;
                that.setData({
                  Coupon: _data
                });
                return;
              };

              let couponSE = res.data.couponMsg.SLT;
              for (let i = 0; i < couponSE.length; i++) {
                if (couponSE[i].channel.indexOf('MINIWX')>=0) {
                  wx.setStorageSync("couponSE", couponSE[i]);
                  that.setData({
                    Coupon: couponSE[i]
                  });
                } else {
                  var _data = that.data.Coupon;
                  _data.activityURL = URL_CDN.HYZX_ACTIVITY_ST;
                  that.setData({
                    Coupon: _data
                  });
                };
              };
            })
          }
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
    onHide: function() {
        // 页面隐藏:
    },
    //显示活动规则
    showRule: function(){
      if (!this.data.Coupon) {
        return;
      } else {
        if(this.data.Coupon.couponNumber == ''){
            return false;
        }
        if(this.data.ShowRule == 1){
            this.setData({
                ShowRule:0,
                showIconDownload:1
            })
        }else{
            this.setData({
                ShowRule:1,
                showIconDownload:0
            })
        }
      };  
    },
    //显示优惠券
    showCoupon: function(){
      if (!this.data.Coupon) {
        return;
      } else {
        if (this.data.Coupon.couponNumber == ''){
            return false;
        }
        this.setData({
            showCoupon: 1,
        })
      };
    },
    //隐藏优惠券
    hideCoupon: function(){
        this.setData({
            showCoupon: 0,
        })
    },
    //领取优惠券
    getCoupon: function(e){
        var that = this;
        var num = e.currentTarget.dataset.coupon_number;
        var type = e.currentTarget.dataset.type;
        var data = {
            type:type,
            coupon_id:num,
            brand: _brandIndex,
            callback_url:"",
        };
        
        main.request(url.getCoupon,data,function(res){
            if(res.data.errcode == 0){
                var cardList = res.data.data.cardList;
                wx.addCard({
                    "cardList": cardList,
                    'success': function(_res) {
                        that.setData({
                            ShowRule:0,
                            showIconDownload:1,
                            showCoupon:0
                        });
                    }
                });
            }else{
                wx.showModal({
                    title: '提示',
                    content: res.data.errmsg,
                })
            }
        },"","POST")
    }
})