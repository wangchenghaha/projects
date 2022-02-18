import { KEYSTORAGE } from '../../src/const.js'
var Util = require('../../utils/utils.js');   //网络请求，传参必用
var http = require('../../utils/httpclient.js');
var tongji = require('../../utils/tongji.js');
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
var scrollTops = 0;
var contentID = '';
var contentColorID = '';
var lunboImgs = 0;
var imgArr = [];
var daogou_value = '';
var color_num = 0;
var chicun = '';   //15位：款（9位）+ 颜色（3位）+ 尺码（3位）
var kucunList = new Array();
var kucuns = 0;

//获取竖向滚动焦点图
function getPicUrl(url_obj, index) {
  var Slider = [];
  for (var i = 0; i < 4; i++) {
    Slider.push({
      picUrl: `${cdn}/goodsImagePC/${brand}/${contentID}/${url_obj[index].colorCode}/${url_obj[index].colorCode}_p${(i + 1)}.jpg`,
    });
  };
  return Slider;
};


Page({

  // 页面的初始数据
  data: {
    //用户信息
    userInfo: {},
    //用户id
    user_id: '',

    //轮播图显示索引
    swiperCurrent: 0,

    shouye: 'none',
    daogou_display: 'none',
    daogou_tishi: false,
    daogou_number: '',
    daogou_text: '',

    details_display1: false,
    details_display: 'none',
    bottom: {
      daogou: {
        display: 'none',
        width: '55%'
      },
      joinCar: {
        display: 'none',
        width: '45%'
      },
      goumai: {
        display: 'none',
        width: '45%'
      }
    },

    //楼层数
    imgIndex: 0,
    leftNav: true,

    //轮播图
    slider: [],

    //商品详情信息
    contentCon: {},

    //颜色分类
    b_li: [],
    color_list_num: 0,

    //请选择尺码
    xzChicun: '请选择尺码',



    //尺码
    c_li: [],
    chima_list_num: -1,
    chimaList: new Array(),
    colorKucuns: new Array(),

    //动画效果
    animationOpacity: {},
    animationBottom: {},

    //库存剩余
    kucun_nums: 0,

    money: '',
    score: '',

    //件数
    nums: 1,

    //回到顶部
    goTop_show: false,
  },

  onReady: function () {
    var animation_bottom = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    var animation_oapcity = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    this.animation_bottom = animation_bottom;
    this.animation_oapcity = animation_oapcity;
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;

    //提示信息
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    });

    if (JSON.stringify(options) != "{}") {
      contentColorID = options.goodsCode;
      contentID = contentColorID.substr(0,9);

      that.setData({
        score: options.score,
        money: options.money,
        id: options.id,
      });

    } else {
      contentID = '';
      contentColorID = '';
    };

  },

  //生命周期函数--监听页面显示
  onShow: function (options) {

    var that = this;
    color_num = 0;

    //获取商品信息
    http.reqcdn(
      '/detail/' + app.config.brand + '/' + contentID + '.json',
      {},
      {
        token: wx.getStorageSync('token'),
        
        'content-type': 'application/json'
      },
      'GET',
      function (res) {
        var Data = res.data; 
        if (res.data.msg == '请求成功') {
          that.setData({
            contentCon: Data.data
          });

          if (contentColorID != '') {
            var colors = Data.data.color;
            for (var i = 0; i < colors.length; i++) {
              if (contentColorID == colors[i].colorCode) {
                color_num = i;
                that.setData({
                  color_list_num: i
                });
              };
            };
          };

          var Slider = getPicUrl(Data.data.color, that.data.color_list_num);
          var _c_li = that.data.contentCon.color[that.data.color_list_num].sizes;
          that.setData({
            slider: Slider,
            c_li: _c_li
          });

          /**
           * 如果只有一种尺寸，也可以支付
          */
          chicun = '';
          if (_c_li.length == 1) {
            that.setData({
              xzChicun: _c_li[0].sizeAlias
            });
            chicun = _c_li[0].sku;
          };

          var Color = Data.data.color;

          that.setData({
            shouye: 'block'
          });
          wx.hideToast();


          //获取库存 
          http.req(
            'goods/getStock',
            { goodsCode: contentID },
            {
              token: wx.getStorageSync('token'),
              
              'content-type': 'application/json'
            },
            'GET',
            function (res) {
              var Data = res.data;
              if (Data.msg == 'OK') {
                kucunList = Data.data;
                kucuns = 0;
                var cLi = Color[color_num].sizes;
                var arr = new Array();
                //区分库存为0的尺码样式
                for (var i = 0; i < cLi.length; i++) {
                  var IsOrNo = kucunList[cLi[i].sku];
                  if (IsOrNo == 0) {
                    arr.push(true);
                  } else {
                    kucuns += parseInt(IsOrNo);
                    arr.push(false);
                  };
                };
                that.setData({
                  chimaList: arr,
                  kucun_nums: kucuns
                });
                if (kucuns == 0) {
                  that.setData({
                    nums: 0
                  });
                } else {
                  that.setData({
                    nums: 1
                  });
                }
              } else {
              };
            },
            function () {
            }
          );

        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '没有找到该商品',
            showCancel: false,
            success: function () {
              wx.navigateBack({
                delta : 1
              });
            }
          })

        };
      },
      function () {
      }
    );



    lunboImgs = that.data.slider.length;
    imgArr = [];
    for (var i = 0; i < 4; i++) {
      imgArr.push({
        id: i + 1,
        offsetTop: 500 * (i + 1)
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





  //轮播图的切换事件  
  swiperChange: function (e) {
    var that = this;
    //只要把切换后当前的index传给<swiper>组件的current属性即可  
    that.setData({
      swiperCurrent: e.detail.current
    });
  },
  //点击指示点切换  
  chuangEvent: function (e) {
    var that = this;
    that.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  //点击logo跳转到首页
  toIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  //导购
  daogou: function (e) {
    var that = this;

    that.setData({
      daogou_display: 'block',
      daogou_number: ''
    });
    //查看是否绑定了导购号
    http.req(
      'guide/bindStatus',
      {},
      {
        token: wx.getStorageSync('token'),
        
        'content-type': 'application/json'
      },
      'GET',
      function (res) {


        if (res.data.code == 0) {
          if (res.data.data.status) {
          } else {
          };
        };
      },
      function () {
      }
    );
  },

  //获取员工号
  numberInput: function (e) {
    daogou_value = e.detail.value;
    this.setData({
      daogou_number: daogou_value
    });
    /*if (daogou_value.length == 6) {
      this.setData({
        daogou_tishi: false
      });
    };*/
  },

  //导购-确定
  daogou_true: function () {
    if (daogou_value.length == 0) {
      this.setData({
        daogou_tishi: true,
        daogou_text: '请输入员工号'
      });
    /*} else if (daogou_value.length != 6) {
      this.setData({
        daogou_tishi: true,
        daogou_text: '员工号格式不正确'
      });*/
    } else {
      this.setData({
        daogou_display: 'none'
      });
      
      var myUnionid = wx.getStorageSync('unionid');
      http.req(
        'guide/bind?unionid=' + myUnionid,
        {
          shopGuideId: daogou_value
        },
        {
          token: wx.getStorageSync('token'),
          
          'content-type': 'application/json'
        },
        'POST',
        function (res) {


          if (res.data.code == 0) {
            wx.showToast({
              title: '绑定导购成功',
              icon: 'success',
              duration: 500
            });
          } else if (res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
              image: '../../images/joinFalse.png',
              duration: 500
            });
          };
        },
        function () {
          wx.showToast({
            title: '绑定导购失败',
            image: '../../images/joinFalse.png',
            duration: 500
          });
        }
      );
    };
  },

  //绑定导购-取消
  daogou_false: function (e) {
    this.setData({
      daogou_display: 'none'
    });
  },

  //选择尺寸 - 开启
  xuanze: function (e) {
    var that = this;
    that.setData({
      details_display: 'block',
      bottom: {
        daogou: {
          display: 'none',
          width: '55%'
        },
        goumai: {
          display: 'block',
          width: '50%'
        }
      }
    });

    //动画调用
    Util.animateShow(this);
  },

  //选择尺寸 - 关闭
  chicunHide: function (e) {

    Util.animateHide(this);

  },

  //选择尺寸 - 关闭1 - 上一页是购物车
  chicunHide1: function (e) {

    this.setData({
      details_display1: false
    });

  },

  checkLogin: function () {
    let isLogin = !!wx.getStorageSync(KEYSTORAGE.loginInfo);
    if (!isLogin) {
      wx.navigateTo({ url: '/pages/setting/requestPermission' });
    }
    return isLogin;
  },

  //购买
  goumai: function (e) {
    if (!this.checkLogin()) {
      return;
    }
    var that = this;
    var id = e.currentTarget.id;

    if (id == 'goumai1') {
      this.setData({
        details_display: 'block',
        bottom: {
          daogou: {
            display: 'block',
            width: '55%'
          },
          goumai: {
            display: 'block',
            width: '45%'
          }
        }
      });

      //动画调用
      Util.animateShow(this);
      return;
    };


    if (chicun == '' && id == 'goumai2') {
      wx.showModal({
        title: '提示',
        content: '请您选择尺码后购买',
        showCancel: false
      });
      return;
    };

    var nnnum = this.data.nums;
    if (nnnum == 0) {
      wx.showModal({
        title: '提示',
        content: '请您选择购买数量',
        showCancel: false
      });
      return;
    };

    var _c_li = this.data.c_li;
    if (chicun != '' && _c_li.length == 1) {
      that.setData({
        chima_list_num: 0
      });
    };

    var chimaListNum = this.data.chima_list_num;

    var ddShuju = this.data.contentCon;


    var ddJson = {
      color: ddShuju.color[color_num],
      size: ddShuju.color[color_num].sizes[chimaListNum],
      goodsName: ddShuju.goodsName,
      nums: that.data.nums,
      goodsCode: ddShuju.projectCode,
      goddsSku: chicun,
      discount: ddShuju.color[color_num].discount,
      onePrice: ddShuju.color[color_num].price.toFixed(2),
      allPrice: that.data.money,
      score: that.data.score,
      money: that.data.money,
      id: that.data.id

    };
    var arr = new Array();
    arr.push(ddJson);

    wx.setStorageSync('jifenBuyDingdan', arr);
    wx.setStorageSync('jifenUseMyCoupons', {});
    wx.redirectTo({
      url: '../jifenBuyDingdan/jifenBuyDingdan'
    });
  },

  //颜色点击切换
  color_list: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var con_data = this.data.contentCon;
    color_num = Number(id);


    var Slider = getPicUrl(that.data.contentCon.color, id);
    var arr = new Array();
    var cLi = con_data.color[id].sizes;
    kucuns = 0;


    //区分库存为0的尺码样式
    for (var i = 0; i < cLi.length; i++) {
      var IsOrNo = kucunList[cLi[i].sku];
      if (IsOrNo == 0) {
        arr.push(true);
      } else {
        kucuns += parseInt(IsOrNo);
        arr.push(false);
      };
    };
    if (kucuns == 0) {
      that.setData({
        nums: 0
      });
    } else {
      that.setData({
        nums: 1
      });
    }

    this.setData({
      color_list_num: id,
      xzChicun: '请选择尺码',
      chima_list_num: -1,
      c_li: cLi,
      slider: Slider,
      kucun_nums: kucuns,
      chimaList: arr
    });
    chicun = '';


    if (cLi.length == 1) {
      this.setData({
        xzChicun: cLi[0].sizeAlias,
        chima_list_num: 0
      });
      chicun = cLi[0].sku;
    };
  },


  //尺码点击切换
  chima_list: function (e) {
    var that = this;
    var id = Number(e.currentTarget.id);
    var con_data = this.data.contentCon;
    this.setData({
      chima_list_num: id,
      xzChicun: con_data.color[color_num].sizes[id].sizeAlias
    });
    chicun = con_data.color[color_num].sizes[id].sku;
    this.setData({
      kucun_nums: kucunList[chicun]
    });

    if (kucunList[chicun] == 0) {
      that.setData({
        nums: 0
      });
    } else {
      that.setData({
        nums: 1
      });
    };
  },


  //图片加载完成
  loadImg: function (event) {

    var tTop = event.currentTarget.offsetTop;

    imgArr.push({
      id: event.currentTarget.id,
      offsetTop: tTop
    });
    imgArr.sort(Util.objectArraySort('id'));
  },


  //页面滚动事件
  onPageScroll: function (e) {
    var ImgIndex = 0;
    scrollTops = e.scrollTop;

    if (scrollTops > 800) {//触发gotop的显示条件
      this.setData({
        goTop_show: true
      });
    } else {
      this.setData({
        goTop_show: false
      });
    };

    for (var i = 0; i < imgArr.length; i++) {
      if (scrollTops > imgArr[i].offsetTop) {
        ImgIndex = (i + 1);
      };
    };
    if (ImgIndex >= imgArr.length) {
      this.setData({
        leftNav: false
      });
    } else {
      this.setData({
        imgIndex: ImgIndex,
        leftNav: true
      });
    };

  },

  //回到顶部
  goTopFun: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      goTop_show: false
    });
  },

  //到底部
  toDown: function (e) {
    wx.pageScrollTo({
      scrollTop: 20000
    });
  },

  //回到首页
  gotoIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  //转发给朋友
  onShareAppMessage: function (res) {
    var that = this;
    var contentXinxi = this.data.contentCon;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    };
    let title = contentXinxi.goodsName;
    let path = '/pages/content/content?colorCode=' + contentXinxi.color[color_num].colorCode + '&conCode=' + contentXinxi.projectCode;
    return {
      title: title,
      path: path,
      imageUrl: that.data.slider[0].picUrl,
      success: function (res) {
        // 转发成功
        try{
          app.tdsdk.share({
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
  }





})