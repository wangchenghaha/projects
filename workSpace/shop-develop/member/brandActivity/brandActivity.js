// pages/main/index.js
var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
var mCard = require(pagePath + "base/memberCard.js");
var tongji = require('../../utils/tongji.js');
var app = getApp();

const { URL_CDN } = require('../../src/const.js');

var system = app.getAppSysInfo()

Page({
    data: {
        tabs: ["官网活动", "门店活动"],
        activeIndex: 0,
      imgSrc:URL_CDN.BRAND_ACTIVITY_BG
    },
    onLoad: function () {
        var that = this;
    },
    onshow: function(){
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
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    toLbs: function(){
        wx.navigateTo({
            url: "/pages/fashionID/lbs/lbs"
        });
    },
    tonet:function () {
        wx.switchTab({
            url: "/pages/index/index"
        });
    }
});