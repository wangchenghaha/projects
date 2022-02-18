import {getVoucherList} from "../../service/voucher";


var Util = require('../../utils/utils.js');   //网络请求，传参必用
var http = require('../../utils/httpclient.js');
var url = require("../../base/url.js");
var main = require("../../base/main.js");
var tongji = require('../../utils/tongji.js');

var app = getApp();

var allPrice = 0;


//获取优惠券
function getMyYhqList(that, _allMoneys) {
  /* 获取优惠券 开始 */
  var user_info = wx.getStorageSync('user_info');
  var memberno = user_info.memberno;
  
  http.req(
    'voucher/list?memberno=' + memberno,
    {},
    {
      token: wx.getStorageSync('token'),
      
      'content-type': 'application/json'
    },
    'GET',
    function (res) {
      var Data = res.data;
      if (Data.code == 0) {
        var listvoucher = Data.data;
        var app_brand = app.config.brand;
        var str = app_brand == 'VEROMODA' ? 'VERO MODA' : app_brand == 'JACKJONES' ? 'JACK & JONES' : app_brand;   //确定品牌名称
        var tBrand_nums = new Array();
        for (var i = 0; i < listvoucher.length; i++) {
          var thisBrand = listvoucher[i].brand;

          if (thisBrand == str) {
            if (parseInt(_allMoneys) >= parseInt(listvoucher[i].threshold)) {
              var _startTime = listvoucher[i].startdate;
              var _endTime = listvoucher[i].enddate;
              if (Util.timeIsTrue(_startTime, _endTime)) {
                listvoucher[i].enddate = Util.changeTime(listvoucher[i].enddate);
                tBrand_nums.push(listvoucher[i]);
              };
            };
          };
        };
        that.setData({
          myCoupons: tBrand_nums
        });
      } else {
        that.setData({
          myCoupons: 0
        });
      };
    },
    function () {

    }
  );
  /* 获取优惠券 结束 */
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCoupons : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    allPrice = parseInt(options.allPrice);

    // getMyYhqList(this, allPrice);
    this._getVoucherList(allPrice)
  },
  _getVoucherList: function(AllMoneys){
    let user_info = wx.getStorageSync('user_info');
    let memberno = user_info.memberno;

    if (!memberno){
      return;
    }
    const curTime = new Date().getTime();
    let tBrand_nums = 0;
    getVoucherList(memberno).then( res => {
      let voucherList = res;
      let myCoupons = [];
      if(voucherList.length > 0){
        voucherList.forEach( item => {
          if(item.brand === 'JACK & JONES'){
            item.brand = 'JACKJONES'
          }else if(item.brand === 'VERO MODA'){
            item.brand = 'VEROMODA'
          }else if(item.brand === 'BESTSELLER'){
            item.brand = 'FOL'
          }
          if(item.brand === app.config.brand){
            if(parseInt(AllMoneys) >= parseInt(item.threshold)){
              let endTimeArr = item.enddate.split('/');
              if(endTimeArr[2].indexOf(' ') > -1){
                endTimeArr[2] = endTimeArr[2].split(' ')[0]
              }
              let endTime = new Date(`${endTimeArr[2]}/${endTimeArr[0]}/${endTimeArr[1]}`).getTime();
              // 判断过期时间
              if(endTime - curTime > 0){
                myCoupons.push(item)
              }
            }
          }
        });
        console.log(tBrand_nums);
        this.setData({ myCoupons});

      }else {
        this.setData({
          myCoupons: 0,
        });
      }

    });

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
    app.track();
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
  
  gotoUse: function(e){
    var index = e.currentTarget.dataset.index;
    var _myCoupons =  this.data.myCoupons;

    wx.setStorageSync('useMyCoupons', _myCoupons[index]);
    wx.navigateBack({
      delta : 1
    });
  }
})