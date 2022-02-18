// pages/userDaogou/daogouMoban/daogouMoban.js
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
//CDN地址
const { URL_CDN } = require('../../src/const');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picSrc: `/images/logo-black-${brand}-square.png`,
    wxShare: false,
    List: [
      {
        gscMaincolPath: URL_CDN.SAA_MB_COVER,
        goodsName: '巴萨足球俱乐部授权男装秋羽绒服外套',
        discount: 5,
        discountPrice: '1499.50',
        originalPrice: '2999.00'
      },

      {
        gscMaincolPath: URL_CDN.SAA_MB_COVER,
        goodsName: '巴萨足球俱乐部授权男装秋羽绒服外套',
        discount: 5,
        discountPrice: '1499.50',
        originalPrice: '2999.00'
      },

      {
        gscMaincolPath: URL_CDN.SAA_MB_COVER,
        goodsName: '巴萨足球俱乐部授权男装秋羽绒服外套',
        discount: 5,
        discountPrice: '1499.50',
        originalPrice: '2999.00'
      },
      {
        gscMaincolPath: URL_CDN.SAA_MB_COVER,
        goodsName: '巴萨足球俱乐部授权男装秋羽绒服外套',
        discount: 5,
        discountPrice: '1499.50',
        originalPrice: '2999.00'
      },
      {
        gscMaincolPath: URL_CDN.SAA_MB_COVER,
        goodsName: '巴萨足球俱乐部授权男装秋羽绒服外套',
        discount: 5,
        discountPrice: '1499.50',
        originalPrice: '2999.00'
      },
      {
        gscMaincolPath: URL_CDN.SAA_MB_COVER,
        goodsName: '巴萨足球俱乐部授权男装秋羽绒服外套',
        discount: 5,
        discountPrice: '1499.50',
        originalPrice: '2999.00'
      }
    ],
    scrollLeft: 0
  },

  leftClick: function () {
    var now_scrollLeft = this.data.scrollLeft;
    var scrollLeftLen = (this.data.List.length - 4) * 76;

    if ((now_scrollLeft + 76) <= scrollLeftLen) {
      now_scrollLeft += 76;
      this.setData({
        scrollLeft: now_scrollLeft
      });
    } else {
      this.setData({
        scrollLeft: scrollLeftLen
      });
    };
  },

  scrolling(e) {
    this.setData({
      scrollLeft: e.detail.scrollLeft
    });
  },

  rightClick: function () {
    var now_scrollLeft = this.data.scrollLeft;
    var scrollLeftLen = this.data.List.length * 76;

    if ((now_scrollLeft - 76) >= 0) {
      now_scrollLeft -= 76;
      this.setData({
        scrollLeft: now_scrollLeft
      });
    } else {
      this.setData({
        scrollLeft: 0
      });
    };
  },

  //选择 分享给朋友／分享朋友圈
  shareToTanchu: function () {
    this.setData({
      wxShare: true
    });
  },

  //点击取消分享弹出框
  shareToCancel: function () {
    this.setData({
      wxShare: false
    });
  },

  //转发给朋友
  onShareAppMessage: function (res) {
    var that = this;
    var _dgId = wx.getStorageSync('daogouInfo').employeeId;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    };
    let title = '我是分享出来的标题';
    let path = '/weMall/openDaogouPage/openDaogouPage?dgId=' + _dgId
    return {
      title: title,
      path: path,
      imageUrl: that.data.picSrc,
      success: function (res) {
        // 转发成功
        try{app.tdsdk.share({
          title: title,
          path: path,
          shareTickets: res.shareTickets
        });
        }catch (e) {}
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //分享到朋友圈
  toShareWxq: function () {
    var _upImage = this.data.picSrc;
    wx.setStorageSync('upImage', _upImage);
    wx.navigateTo({
      url: '/weMall/daogouwxq/daogouwxq'
    });
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
  
  }
})