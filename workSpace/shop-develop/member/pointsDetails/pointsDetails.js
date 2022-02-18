// pages/main/index.js
var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
var mCard = require(pagePath + "base/memberCard.js");
var tongji = require('../../utils/tongji.js');
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
//CDN地址
const { URL_CDN } = require('../../src/const');

var system = app.getAppSysInfo()

Page({
    data: {
        banner:{
          img: URL_CDN.MEMBER_CENTER_BANNER,
          memberRewards:"会员专享>>",
        },
        user:{
            img: URL_CDN.LOGO_BLACK_SQUARE,
        },
        ponintsCanUse:"100",
        pointsTotal:"0",
        pointsCost:"0",
        memLevel:"普通会员",
        text:"截止到2017年8月4日前，仅需1000元您就能升级为银卡会员"
    },
    onLoad: function(options) {
        var that = this;
        var user_info = wx.getStorageSync('user_info');
        var userInfo = wx.getStorageSync('userInfo')
        that.setData({
            ponintsCanUse:user_info.availablepoints,
            memLevel:user_info.level,
            text:user_info.upgrades,
            user:{
                img:userInfo.avatarUrl,
            },
        })
    },
    onReady: function() {

    },
    onShow: function(options) {
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
        // 页面隐藏
    },
    toMemberRewards: function(){
        wx.navigateTo({
            url: "/pages/fashionID/memberRewards/memberRewards"
        });
    }
})