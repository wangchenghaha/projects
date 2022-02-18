var Util = require('../../utils/utils.js');   //网络请求，传参必用
var http = require('../../utils/httpclient.js');
var mCard = require("../../base/memberCard.js");
var main = require("../../base/main.js");
var url = require("../../base/url.js");
var cityJS = require('../../utils/city.js');
var tongji = require('../../utils/tongji.js');
var app = getApp();

var dingdanCon = new Array();
var submitOnoff = true;
var proviceData = new Array(), cityData = new Array(), districtData = new Array();
var proviceNum = 0, cityNum = 0, districtNum = 0;


//调用一下，为了获取unionid，并存在缓存中
function is_Member(that, AllMoneys) {
  //为了获取用户的unionid,便于用户提交订单时，根据用户的unionid判断用户是不是会员
  var isCallbackCard = wx.getStorageSync('isCallbackCard')
  if (1 != isCallbackCard) {
    mCard.isMember(function (isMember) {
      if (isMember == 200) {
        var _user_info = wx.getStorageSync("user_info")
        if (!_user_info.name) {
          main.request(url.getUserinfo, { brand: getApp().config.etoBrand }, function (res) {
            wx.setStorageSync("user_info", res.data.data.user_info);
            //获得优惠券
            getMyYhqList(that, AllMoneys);
          }, 1);
        }
      }
    }, 1, 1);
    wx.setStorageSync("isCallbackCard", "");
  };
};


//获取优惠券
function getMyYhqList(that, _allMoneys) {
  /* 获取优惠券 开始 */
  var user_info = wx.getStorageSync('user_info');
  var memberno = user_info.memberno;
  main.request(url.getCouponList, { memberno: memberno }, function (res) {
    if (!res.data.data.DetailInfo.msg) {
      that.setData({
        myCoupons: 0
      });
    } else {
      var listvoucher = res.data.data.DetailInfo.msg.voucher;
      var app_brand = app.config.brand;
      var str = app_brand == 'VEROMODA' ? 'VERO MODA' : app_brand == 'JACKJONES' ? 'JACK & JONES' : app_brand;   //确定品牌名称
      var tBrand_nums = 0;
      for (var i = 0; i < listvoucher.length; i++) {
        var thisBrand = listvoucher[i].brand;
        if (thisBrand == str) {
          if (parseInt(_allMoneys) >= parseInt(listvoucher[i].threshold)) {
            var _startTime = listvoucher[i].startdate;
            var _endTime = listvoucher[i].enddate;
            if (Util.timeIsTrue(_startTime, _endTime)) {
              tBrand_nums += 1;
            };
          }
        };
      };
      var List = that.data.dingdanList;

      var _ishavediscount = 0;
      for (var i = 0; i < List.length; i++) {
        if (List[i].discount != 1) {
          tBrand_nums = 0;
        };
      };

      that.setData({
        myCoupons: tBrand_nums
      });
      if (tBrand_nums > 0) {
        var jifenUseMyCoupons = wx.getStorageSync('jifenUseMyCoupons');
        if (jifenUseMyCoupons.value) {
          var _couponMore = parseInt(useMyCoujifenUseMyCouponspons.value);
          var data_AllPrice = parseFloat(that.data.AllPrice);
          var _shifu = (data_AllPrice - _couponMore).toFixed(2);
          that.setData({
            couponMore: _couponMore,
            AllPrice: _shifu
          });
        };
      };
    };
    wx.hideLoading();
  });
  /* 获取优惠券 结束 */
};


Page({

  //页面的初始数据
  data: {
    dingdanList: new Array(),

    address: {},

    //总件数和总价
    Nums: 0,
    AllPrice: 0,

    myCoupons: 0,
    couponMore: 0,   //优惠了多少？

    youji: true,     //邮寄方式

    index1: 0,
    index2: 0,
    index3: 0

  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    });
    cityJS.init(this);
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {


    var that = this;
    dingdanCon = wx.getStorageSync('jifenBuyDingdan');

    that.setData({
      couponMore: 0
    });

    var Numbers = 0;
    var AllMoneys = 0;
    //计算得出总件数和总价
    for (var i = 0; i < dingdanCon.length; i++) {
      Numbers += dingdanCon[i].nums;
      AllMoneys += Number(dingdanCon[i].allPrice);
    };

    if (dingdanCon) {
      this.setData({
        dingdanList: dingdanCon,
        Nums: Numbers,
        AllPrice: AllMoneys.toFixed(2)
      });
    };

    //获取unionid
    var unionid = wx.getStorageSync('unionid');
    if (unionid == '') {
      is_Member(that, AllMoneys);
    } else {
      //获得优惠券
      getMyYhqList(that, AllMoneys);
    };


    var pageList = getCurrentPages();
    var prevPageUrl = pageList[pageList.length - 1].route; 
    if (prevPageUrl == 'pages/content/content') {
      wx.removeStorageSync('dingdanAddress');
    };

    //取本地订单地址
    var dingdanAddress = wx.getStorageSync('dingdanAddress');
    if (dingdanAddress.userName) {
      that.setData({
        address: dingdanAddress
      });
      return;
    };

    //获取地址
    http.req(
      'member/addressGet',
      {},
      {
        token: wx.getStorageSync('token'),
        
        'content-type': 'application/json'
      },
      'GET',
      function (res) {
        if (res.data.msg == 'OK') {
          var Data = res.data;
          var address = {};
          var num = 0;
          for (var i = 0; i < Data.data.length; i++) {
            if (Data.data[i].defaultAddress == 'Y') {
              address = Data.data[i];
            } else {
              num++;
            };
          };
          if (num == Data.data.length) {
            address = Data.data[0];
          };
          if (Data.data.length != 0) {
            that.setData({
              address: address
            });
          };
        };

        //隐藏提示框 同时显示该页面
        that.setData({
          wrap_hidden: 'block'
        });
        wx.hideToast();
      },
      function () {
      }
    );

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

  //收货信息
  shouhuoxinxi: function (e) {

    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  //提交订单
  submit: function (e) {

    var that = this;
    wx.showLoading({
      title: '加载中...'
    });
    var Dingdan = this.data.dingdanList;
    var Address = this.data.address;


    if (JSON.stringify(Address) == "{}") {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '请填写收货信息',
        showCancel: false
      });
      return;
    };

    /* 提交订单的准备数据 开始 */
    var goodsOrderLists = new Array();
    for (var i = 0; i < Dingdan.length; i++) {
      goodsOrderLists.push({
        "clearingType": 3,
        "colorName": Dingdan[i].color.colorAlias,
        "gcsSku": Dingdan[i].size.sku,
        "goodsName": Dingdan[i].goodsName,
        "goodsCount": Dingdan[i].nums,
        "goodsColorCode": Dingdan[i].color.colorCode,
        "gscolPicPath": Dingdan[i].color.picurls[0],
        "originalPrice": Number(Dingdan[i].color.originalPrice) * Number(Dingdan[i].nums),
        "sizeName": Dingdan[i].size.sizeAlias,
        "price": Dingdan[i].allPrice,
        "isGift": "N"
      });
    };
    var user_phone = wx.getStorageSync('user_info').phone;
    var dingdanJson = {

      "activityId": parseInt(Dingdan[0].id),
      "payIntegral": parseInt(Dingdan[0].score),
      "ruleId": '',

      "channelId": 5,
      "channelCode": 'MINIPROGRAM',
      "realSellPrice": Dingdan[0].money,
      "payPrice": Dingdan[0].money,
      "goodsTotalCount": that.data.Nums,
      "gscPicmianId": "1",
      "picUrl": Dingdan[0].color.picurls[0],
      "province": Address.province,
      "city": Address.city,
      "area": Address.area,
      "detailAddress": Address.detailAddress,
      "contactTel": Address.phone,
      "consignee": Address.userName,
      "goodsOrderList": goodsOrderLists,
      "bigOrderAppendix": {
        "targetUrl": "",
        "utmCampaign": "",
        "utmMedium": "",
        "utmSource": "",
        "utmTerm": ""
      }

    };

    //导购分享参数添加
    var daogouList = wx.getStorageSync('daogouLists');
    var nowTimes = Date.now();
    if (daogouList && daogouList.length > 0) {
      var thisItem = daogouList[0];
      var runTime = parseInt((nowTimes - thisItem.times) / 1000);
      var day = Math.floor(runTime / 86400);
      if (day <= 15) {
        for (let k = 0; k < daogouList.length; k++) {
          dingdanJson.bigOrderAppendix[daogouList[k].key] = daogouList[k].value;
        };
      };
    };
    

    //判断是否是会员，如果不是就绑卡
    var unionid = wx.getStorageSync('unionid');
    if (unionid == '') {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '您不是会员，不能提交该订单',
        showCancel: false
      });
      return;
    } else {
      wx.request({
        url: url.memberIsMember,
        data: {
          unionid: unionid,
          //TODO brand 硬编码
          brand: getApp().config.etoBrand
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          var _Data = res.data;
          if (_Data.errcode == 0) {
            var isAgreeToOpencard = wx.getStorageSync('dingdanToOpencard');
            if (_Data.is_member != 1) {
              //用户走过非会员开卡流程 - 可以提交订单
              if (isAgreeToOpencard == 1) {
                submitDingdan();
              } else {
                wx.hideLoading();
                //提示框
                wx.showModal({
                  title: '提示',
                  content: '您还不是会员，去领卡？',
                  success: function (res) {
                    if (res.confirm) {
                      wx.setStorageSync('dingdanToOpencard', 1);
                      var cardId = _Data.data.cardList[0].cardId;
                      var cardCode = _Data.data.cardList[0].code;

                      wx.openCard({
                        cardList: [{
                          cardId: cardId,
                          code: cardCode
                        }],
                        success: function (ret) {
                        }
                      });
                    } else if (res.cancel) {
                    }
                  }
                });
              };
            } else {
              submitDingdan();
            };
          };



        },
        fail: function (err) {
        }
      });
    };



    //保存订单
    function submitDingdan() {
      http.req(
        `point/orderSave?unionid=${unionid}&phone=${user_phone}`,
        dingdanJson,
        {
          token: wx.getStorageSync('token'),
          
          'content-type': 'application/json'
        },
        'POST',
        function (res) {
          var Data = res.data;
          if (Data.code == 0) {

            let bigOrderCode = Data.data.bigOrderCode;
            let orderToken = Data.data.orderToken;
            let payToken = Data.data.payToken;
            let payTokenTime = Data.data.payTokenTime;
            let amountPaid = Data.data.order.amountPaid;
            let id = Data.data.bigOrderId;

            let querystring = `id=${id}&bigOrderCode=${bigOrderCode}&orderToken=${orderToken}&payToken=${payToken}&payTokenTime=${payTokenTime}&amountPaid=${amountPaid}`;

            wx.hideLoading();
            wx.navigateTo({
              url: '../../wxPay/wxPay?' + querystring
            });

          } else {
            wx.hideToast();
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: Data.msg
            });
          };
        },
        function () {
        }
      );
    };

  },

  //去我的优惠券列表页
  toCoupon: function (e) {
    var that = this;
    var _myCoupons = this.data.myCoupons;
    var _allPrice = this.data.AllPrice;
    var List = this.data.dingdanList;

    var _ishavediscount = 0;
    for (var i = 0; i < List.length; i++) {
      if (List[i].discount == 1) {
        _ishavediscount += 1;
      };
    };
    if (_ishavediscount == List.length) {
      if (_myCoupons == 0) {
        wx.showModal({
          title: '提示',
          content: '您还没有优惠券可以使用',
          showCancel: false
        });
      } else {
        wx.navigateTo({
          url: '/pages/coupon/coupon?allPrice=' + _allPrice
        });
      };
    } else {
      wx.showModal({
        title: '提示',
        content: '该订单内有打折商品，不能使用优惠券',
        showCancel: false
      });
    };
  },

  //配送方式切换
  fangshi: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.id);
    if (index == 0) {
      that.setData({
        youji: true
      });
    } else {
      that.setData({
        youji: false
      });
    }
  },

  //省/市 的 选择
  bindPickerChange1: function (e) {
    this.setData({
      index1: Number(e.detail.value),
      index2: 0,
      index3: 0
    });
    const current_value = e.detail.value;
    cityJS.change(1, current_value, this);
  },

  //城市 的 选择
  bindPickerChange2: function (e) {
    this.setData({
      index2: Number(e.detail.value),
      index3: 0
    });
    const current_value = e.detail.value;
    cityJS.change(2, current_value, this);
  },

  //地区 的 选择
  bindPickerChange3: function (e) {
    this.setData({
      index3: Number(e.detail.value)
    });
    const current_value = e.detail.value;
    cityJS.change(3, current_value, this);
  },

})