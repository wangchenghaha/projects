import {  KEYSTORAGE } from '../../../src/const.js'
import {getDetailPage, getGoodsDetail} from '../../../service/goods'
import {wxShowToast} from '../../../utils/wxMethods'
var Util = require('../../../utils/utils.js');   //网络请求，传参必用
var http = require('../../../utils/httpclient.js');
var tongji = require('../../../utils/tongji.js');
const { URL_CDN } = require('../../../src/const');
var app = getApp();
const cdn = app.config.cdn;
var scrollTops = 0;
var contentID = '';
var contentColorID = '';
var imgArr = [];
var daogou_value = '';
var color_num = 0;
var chicun = '';   //15位：款（9位）+ 颜色（3位）+ 尺码（3位）
var kucunList = new Array();
var kucuns = 0;
var brander= '';


Page({

  // 页面的初始数据
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    //用户信息
    userInfo: {},
    //用户id
    user_id: '',
    //品牌
    brand:'',

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

    isShowExplain : false,

    pictitle: URL_CDN.PRICE_TIP,
    isSell: true,
    bodyContent: ''
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
        brand: options.brand,
      });

    } else {
      contentID = '';
      contentColorID = '';
    };

  },

  //生命周期函数--监听页面显示
  onShow: function (options) {
    color_num = 0;
    this._getGoodsDetail();
    imgArr = [];
    for (var i = 0; i < 4; i++) {
      imgArr.push({
        id: i + 1,
        offsetTop: 500 * (i + 1)
      });
    };
    app.track();

  },


  _getGoodsDetail: function(){
    if(app.config.brand === "FOL" || app.config.brand === "BESTSELLER"){
      brander = app.config.brand;
    } else {
      brander = Util.getBrandBySku(contentID);
    }
    const data = this.data;
    let color_list_num = data.color_list_num;
    getGoodsDetail(contentID, brander).then(res => {
      wx.hideLoading();
      let contentCon = res;
      if (contentColorID != '') {
        var colors = res.color;
        for (var i = 0; i < colors.length; i++) {
          if (contentColorID == colors[i].colorCode) {
            color_list_num = i;
            color_num = i;
          };
        };
      };
      let slider = [];
      for (let i = 0; i < 4; i++) {
        slider.push({
          picUrl: cdn + contentCon.color[color_list_num].picurls[i],
        });
      }
      let c_li = contentCon.color[color_list_num].sizes;
      /**
       * 如果只有一种尺寸，也可以支付
      */
      chicun = '';
      let kucun_nums = 0;
      let isSell =  contentCon.color[color_list_num].status === 'InShelf';
      if (c_li.length == 1) {
        this.setData({
          xzChicun: c_li[0].sizeAlias,
        });
        chicun = c_li[0].sku;
        kucun_nums = c_li[0].sellStock;

      } else{
        for (let i = 0; i < contentCon.color[color_list_num].sizes.length; i++) {
          kucun_nums +=  contentCon.color[color_list_num].sizes[i].sellStock;
        }
      }
      this.setData({
        slider,
        c_li,
        color_list_num,
        contentCon,
        shouye: 'block',
        kucun_nums,
        isSell
      });
      this.loadDetailPage(contentID)
    })
  },
  /*加载底部详情页*/
  loadDetailPage: function (contentID) {
    getDetailPage(contentID).then(res => {
      this.setData({
        bodyContent: res
      })
    })
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

  //获取员工号
  numberInput: function (e) {
    daogou_value = e.detail.value;
    this.setData({
      daogou_number: daogou_value
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


    if (!chicun && id == 'goumai2') {
      wx.showModal({
        title: '提示',
        content: '请您选择尺码后购买',
        showCancel: false
      });
      return;
    };

    var nnnum = this.data.kucun_nums;
    if (nnnum == 0) {
      wx.showModal({
        title: '提示',
        content: '暂无库存！',
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

    if(ddShuju.color[color_num].status === 'OutShelf'){
      wx.showModal({
        title: '提示',
        content: '该商品已下架！',
        showCancel: false
      });
      return;
    }

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
    };
    let arr = [];
    arr.push(ddJson);
    app.gioTrack('pageclick_personalcenter_mall_gift_buynow', {
      spu_id: ddShuju.color[color_num].colorCode
    })
    wx.setStorageSync('jifenBuyDingdan', arr);
    wx.setStorageSync('jifenUseMyCoupons', {});
    wx.redirectTo({
      url: '../rcOrderSave/rcOrderSave'
    });
  },

  //颜色点击切换
  color_list: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var con_data = this.data.contentCon;
    color_num = Number(id);
    let Slider = [];
    for (let i = 0; i < 4; i++) {
      Slider.push({
        picUrl: cdn + that.data.contentCon.color[id].picurls[i],
      });
    }

    let isSell = that.data.contentCon.color[id].status  === "InShelf";
    if(!isSell){
      wxShowToast("该款颜色已下架");
      return;
    }
     var cLi = con_data.color[id].sizes;
    kucuns = 0;
    //区分库存为0的尺码样式
    for (var i = 0; i < cLi.length; i++) {
      kucuns += cLi[i].sellStock;
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
    const colorObj = con_data.color[color_num]
    this.setData({
      chima_list_num: id,
      xzChicun: colorObj.sizes[id].sizeAlias,
      kucun_nums:  colorObj.sizes[id].sellStock,
    });
    chicun = colorObj.sizes[id].sku;
    app.gioTrack('pageclick_personalcenter_mall_gift_choosecolorsize', {
      sku_id: colorObj.colorCode,
      spu_id: chicun
    })
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


  //到底部
  toDown: function (e) {
    wx.pageScrollTo({
      scrollTop: 20000
    });
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
  },

  priceExplain: function(){
      this.setData({
        isShowExplain: true,
      })
  },

  hideExplain: function(){
    this.setData({
      isShowExplain: false,
    })
  }
})
