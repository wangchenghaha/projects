// pages/main/index.js
var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
var tongji = require('../../utils/tongji.js');

var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;

//CDN地址
const { URL_CDN } = require('../../src/const');

Page({
    data: {
      brandlist: [{
        brand: "jj",
        logo: URL_CDN.LOGO_BLACK_RECT_JJ,
        width: "121px",
        height: "11px",
        imglist: []
      },{
        brand: "only",
        logo: URL_CDN.LOGO_BLACK_RECT_OL,
        width: "53px",
        height: "12px",
        imglist: []
      }, {
          brand:"vm",
          logo:URL_CDN.LOGO_BLACK_RECT_VM,
          width:"115px",
          height:"12px",
          imglist:[]
      },{
          brand:"sel",
          logo:URL_CDN.LOGO_BLACK_RECT_ST,
          width:"112px",
          height:"12px",
          imglist:[]
      }]
    },
    onLoad: function(options) {
        var that = this;
        var _brandlist = that.data.brandlist;
        main.request(URL_CDN.LOOP_HYZX_OL, {}, function (res) {

            if (res.data.imgList.ONLY != '') {
              _brandlist[1].imglist[0] = res.data.imgList.ONLY[0];
              _brandlist[1].onOff = true;
            } else {
              _brandlist[1].onOff = false;
              _brandlist[1].imglist = [ URL_CDN.EXPECT_OL];
            };
            that.setData({
                brandlist: _brandlist
            });
        }, 1);
        main.request(URL_CDN.LOOP_HYZX_JJ, {}, function (res) {
          if (res.data.imgList.JJ != '') {
            _brandlist[0].imglist[0] = res.data.imgList.JJ[0];
            _brandlist[0].onOff = true;
          } else {
            _brandlist[0].onOff = false;
            _brandlist[0].imglist = [ URL_CDN.EXPECT_JJ];
          };
          that.setData({
            brandlist: _brandlist
          });
        }, 1);
        main.request(URL_CDN.LOOP_HYZX_VM, {}, function (res) {
            if(res.data.imgList.VM != ''){
              _brandlist[2].imglist[0] = res.data.imgList.VM[0];
              _brandlist[2].onOff = true;
            }else{
              _brandlist[2].onOff = false;
              _brandlist[2].imglist = [ URL_CDN.EXPECT_VM];
            };
          that.setData({
            brandlist: _brandlist
          });
        }, 1);
        main.request(URL_CDN.LOOP_HYZX_SE,{},function(res){
            if(res.data.imgList.SLT != ''){
              _brandlist[3].imglist[0] = res.data.imgList.SLT[0];
                _brandlist[3].onOff = true;
            }else{
                _brandlist[3].onOff = false;
                _brandlist[3].imglist = [ URL_CDN.EXPECT_SE];
            };
            that.setData({
                brandlist:_brandlist
            });
        },1);
            
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
      // 页面隐藏:
    },
    toRewardsDetails: function(e){
      var brand = e.currentTarget.dataset.brand;
      var actindex = e.currentTarget.dataset.index;
      var onOff = e.currentTarget.dataset.onoff;
      
      if( onOff ){
        main.link("/pages/fashionID/rewardsDetails/rewardsDetails?brand=" + brand + "&actindex=" + actindex);
      };
      
    }
})