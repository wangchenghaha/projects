var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
var mCard = require(pagePath + "base/memberCard.js");
var tongji = require('../../utils/tongji.js');
var app = getApp();
var system = app.getAppSysInfo()

Page({
    data: {
        list:[]
    },
    regionchange(e) {
    },
    markertap(e) {
    },
    controltap(e) {
    },
    onLoad: function () {
        var that = this;  
        that.getStoreList();      
    },
    onShow: function() {
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
    //获取门店列表
    getStoreList:function(){
        var that = this; 
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                var data = {
                    //TODO brand 硬编码
                    brand:getApp().config.etoBrand,
                    longitude : res.longitude,
                    latitude : res.latitude
                }
                main.request(url.getStoreList,data,function(res){
                    if(res.errcode == 0){
                        wx.showModal({
                            title: '提示',
                            content: '没有获取到您附近的门店信息',
                            showCancel:false,
                            success: function(res) {
                                wx.navigateBack();
                            }
                        })
                    }else{
                        that.setData({
                            list:res.data,
                        })
                    }

                })
            }
        })
    },

    //跳转地图
    getMap:function(e){
        var longitude = e.currentTarget.dataset.lg ,latitude = e.currentTarget.dataset.lt ,name = e.currentTarget.dataset.name ,address = e.currentTarget.dataset.address;
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name:name,
            address:address,
            scale: 28
        })
    }
})
