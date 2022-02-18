var ShopUtil = require('../../../service/shop.js');
Page({

  /**
   * 页面的初始数据
   */

  data: {
    markers: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   --------------------需要接受如下的 navBean--------------------
    //   {
    //     "mCurrLatitude": 39.90469,
    //     "mCurrLongitude": 116.40717,
    //     "shopBean": {
    //         "address": "北京市海淀区清河永泰庄25号泰鑫源商厦四层思莱德专柜",
    //         "latitude": 116.219688,
    //         "longitude": 40.120438,
    //         "mapList": [],
    //         "shopCode": "39D0",
    //         "shopNameCn": "北京_海淀泰鑫源商厦_SLT"
    //     }
    // }
    console.log(`options.navBean===${options.navBean}`);
    let navBean = JSON.parse(options.navBean);
    this.setData({
      navBean: navBean,
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("|||||||||||| onReady ");
    let navBean = this.data.navBean;
    let pointsList = [{
      longitude: navBean.mCurrLongitude,
      latitude: navBean.mCurrLatitude,
    }, {
      longitude: navBean.shopBean.longitude,
      latitude: navBean.shopBean.latitude
    }];
    console.log(`pointsList=======${pointsList}`);
    this.setData({
      includePoints: pointsList,
    });
    // setTimeout(() => {
    //   this.mapCtx = wx.createMapContext('mMap');
    //   this.mapCtx.includePoints({
    //     padding: [10],
    //     includePoints: pointsList,
    //   });
    // }, 3000);


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("|||||||||||| onShow ");
    // let mCurrLongitude = this.data.navBean.mCurrLongitude;
    // let mCurrLatitude = this.data.navBean.mCurrLatitude;
    let { mCurrLongitude, mCurrLatitude, shopBean } = this.data.navBean;
    console.log(`mCurrLongitude===${mCurrLongitude}`);
    console.log(`mCurrLatitude===${mCurrLatitude}`);
    console.log(`shopBean===${shopBean}`);
    let shopName = shopBean.shopNameCn;
    let shopLongi = shopBean.longitude;
    let shopLati = shopBean.latitude;


    let marker = ShopUtil.getMarkerDefault(0, shopLongi, shopLati, shopName);
    let markersList = new Array();
    markersList.push(marker);
    this.setData({ markers: markersList });
    console.log("this.markers changed =>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(this.data.markers);


    ShopUtil.getNavPath(mCurrLongitude, mCurrLatitude, shopLati, shopLongi)
      // ShopUtil.getNavPath(this.data.mLatitude, this.data.mLongitude, latitude, longitude)
      .then(polyList => {
        this.setData({
          polyline: polyList,
        });
      })
      .catch(e => {
        console.log(e);
      });
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

})