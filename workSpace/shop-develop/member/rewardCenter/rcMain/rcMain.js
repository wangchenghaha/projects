
import { getRewardCenterList } from '../../../service/rewardcenter.js';
import {KEYSTORAGE, EVENTS} from '../../../src/const.js'
import events from '../../../src/events';
import {splitImg} from '../../../utils/utils'
import { wxShowToast } from '../../../utils/wxMethods'
const config = require('../../../src/config.js');
//CDN地址
const { URL_CDN } = require('../../../src/const');

var pagePath = "../../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;

var _id;
var touchDot = 0;//触摸时的原点
var nth = 0;// 设置活动菜单的index
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理 时间记录
var tmpFlag = true;// 判断左右滑动超出菜单最大值时不再执行滑动事件
var type ="";
var brandCode = "";
var pointsStart = "";
var pointsEnd = "";
var moneyStart = "";
var moneyEnd = "";
var goodsCouponType = "";
let goodsPicBase = "https://cdn.bestseller.com.cn/assets/point/";
var layoutType = "grid";
//var isOtherJump = false;
var isAbleToBuy = false;
var brandHeader="";


function getGiftList(that, _brand, _type, _brandCode, _pointsStart, _pointsEnd, _moneyStart, _moneyEnd, _goodsCouponType){
  that.setData({
    isGrid: false,
    isList: false,
    showNoCoupon: false,
  });
  var gridInfo = [];
  var listInfo = [];
  var couponInfo = [];
  var _index = 0;
  wx.showLoading();
  console.log("brand ====", _brand);
  getRewardCenterList(_brand, _type, _brandCode, _pointsStart, _pointsEnd, _moneyStart, _moneyEnd, _goodsCouponType)
    .then((data) => {
      wx.hideLoading();
      let datas = [];
      if(data[data.length - 1]){
        datas.push(data[data.length - 1]);
      }
      if(data[data.length - 2]){
        datas.push(data[data.length - 2]);
      }
      for (let i = 0; i < data.length - 2; i++) {
        datas.push(data[i]);
      }
      // Grid布局显示数据
      datas.forEach(element => {
        _index = _index + 1;
        if(element.rewardCenterRelateList[0]){
          gridInfo.push({
            goodsCode: element.goodsCouponCode,
            picBg_01: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_1.jpg" + (element.version ? "?v=" + element.version: ""),
            picBg_02: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_2.jpg" + (element.version ? "?v=" + element.version: ""),
            picBg_03: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_3.jpg" + (element.version ? "?v=" + element.version: ""),
            picBg_04: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_4.png" + (element.version ? "?v=" + element.version: ""),
            brandCode: element.brand,
            goodsName: element.name,
            score: element.rewardCenterRelateList[0].points,
            money: element.rewardCenterRelateList[0].money,
            type: element.type,
            description: element.description,
            goodsPrice: element.hangtagPrice,
            imgLogo: setImageLogo(element.subBrand),
            couponScope: element.couponScope,
            isCounpon:isCoupon(element.type),
            isStock: element.stock !== 0
          })
        }
      });

      data.forEach(element => {
        if(element.rewardCenterRelateList[0]){
          if(element.type == "goods"){
            // 兑换商品数据
            listInfo.push({
              goodsCode: element.goodsCouponCode,
              picBg_01: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_1.jpg" + (element.version ? "?v=" + element.version: ""),
              picBg_02: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_2.jpg" + (element.version ? "?v=" + element.version: ""),
              picBg_03: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_3.jpg" + (element.version ? "?v=" + element.version: ""),
              picBg_04: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_4.png" + (element.version ? "?v=" + element.version: ""),
              brandCode: element.subBrand,
              goodsName: element.name,
              score: element.rewardCenterRelateList[0].points,
              money: element.rewardCenterRelateList[0].money,
              goodsPrice: element.hangtagPrice,
              imgLogo: setImageLogo(element.subBrand),
              isStock: element.stock !== 0
            })
          } else if(element.type == "coupon"){
            // 兑换优惠券数据
            couponInfo.push({
              goodsCode: element.goodsCouponCode,
              couponScope: element.couponScope,
              description: element.description,
              picBg_01: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_1.jpg" + (element.version ? "?v=" + element.version: ""),
              picBg_02: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_2.jpg" + (element.version ? "?v=" + element.version: ""),
              picBg_03: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_3.jpg" + (element.version ? "?v=" + element.version: ""),
              picBg_04: goodsPicBase + element.goodsCouponCode + "/" + element.goodsCouponCode + "_4.png" + (element.version ? "?v=" + element.version: ""),
              brandCode: element.subBrand,
              goodsName: element.name,
              score: element.rewardCenterRelateList[0].points,
              type: element.type == 'coupon'?'活动券':'',
              goodsPrice: element.hangtagPrice,
              imgLogo: setImageLogo(element.subBrand),
            })
          }
        }

      });

      that.setData({
        gridList: gridInfo,
        giftList: listInfo,
        couponList: couponInfo,
    })

      // 判断是否是Grid布局
      if(layoutType == "grid"){
        // 判断Grid布局数据是否为空
        if(gridInfo.length == 0){
          that.setData({
              isGrid: false,
              showNoCoupon: true,
          })
        } else {
          that.setData({
           // gridList: gridInfo,
            isGrid: true,
            showNoCoupon: false,
          })
          showGrid(that, that.data.gridList);
        }

      } else if(layoutType == "list"){ // 判断是否是列表布局
          if(listInfo.length == 0 && couponInfo.length == 0){ //可兑换的商品和优惠券都为空
            that.setData({
              isList: false,
              showNoCoupon: true,
            })
          } else if(listInfo.length != 0 && couponInfo.length == 0){ //有可兑换的商品 没有可兑换的优惠券
            that.setData({
              isList: true,
              showNoCoupon: false,
              //giftList: listInfo,
              isShowGift: true,
              isShowCoupon: false,
            })
          } else if(listInfo.length == 0 && couponInfo.length != 0){ //没有可兑换商品 有可兑换的优惠券
            that.setData({
              isList: true,
              showNoCoupon: false,
              //couponList: couponInfo,
              isShowGift: false,
              isShowCoupon: true,
            })
          } else { // 既有可兑换的优惠券 又有可兑换的商品
            that.setData({
              isList: true,
              showNoCoupon: false,
              isShowGift: true,
              isShowCoupon: true,
            })
          }
      }
    })
};

/**
 * 筛选出商品种类
 * @param {} that
 * @param {*} _brand
 * @param {*} _type
 * @param {*} _brandCode
 * @param {*} _pointsStart
 * @param {*} _pointsEnd
 * @param {*} _moneyStart
 * @param {*} _moneyEnd
 */
function getGoodsClassify(that, _brand, _type, _brandCode, _pointsStart, _pointsEnd, _moneyStart, _moneyEnd, _goodsCouponType){
    wx.showLoading();
    getRewardCenterList(_brand, _type, _brandCode, _pointsStart, _pointsEnd, _moneyStart, _moneyEnd, _goodsCouponType)
      .then((data) => {
        wx.hideLoading();
        // Grid布局显示数据
        var lists = ['全选'];
        data.forEach(element => {
          lists.push(
           element.couponType
          )
        });

        that.setData({
          filterGoods: unique(lists),
        })

    })
};

function unique(arr) {
  if (!Array.isArray(arr)) {
      console.log('type error!')
      return
  }
  let res = []
  for (let i = 0; i < arr.length; i++) {
      if (res.indexOf(arr[i]) === -1) {
          res.push(arr[i])
      }
  }
  return res
}

/**
 * 根据不同品牌 显示不同的logo
 * @param {*品牌} brand
 */
function setImageLogo(brand) {
  var imageLogo = '';
  if ('ONLY' == brand) {
    imageLogo = URL_CDN.POINT_TITLE_OL;
  } else if ('JACKJONES' === brand || 'JACK&JONES' === brand || 'JJ' === brand) {
    imageLogo = URL_CDN.LOGO_BLACK_RECT_JJ;
  } else if ('VEROMODA' == brand|| 'VM' === brand) {
    imageLogo = URL_CDN.POINT_TITLE_VM;
  } else if ('SELECTED' == brand) {
    imageLogo = URL_CDN.LOGO_BLACK_RECT_ST;
  } else if ('BESTSELLER' == brand) {
    imageLogo = URL_CDN.POINT_TITLE_BS;
  }else if('NAMEIT' == brand){
    imageLogo = URL_CDN.POINT_TITLE_NI;
  }else if('J.LINDEBERG' == brand){
    imageLogo = URL_CDN.POINT_TITLE_JL;
  }
  return imageLogo;
}


function isCoupon(type){
  if(type == "coupon"){
    return true;
  } else {
    return false;
  }
};

function showGrid(that, lists){
    switch(lists.length){
      case 1:
        that.setData({
          showCenter: true,
          center: lists[0],
          showLeft:false,
          showLeft01: false,
          showRight01: false,
          showRight:false,

        })
        break;
      case 2:
        that.setData({
          showCenter: true,
          center: lists[0],
          rightIn: lists[1],
          showLeft:false,
          showLeft01: false,
          showRight01: true,
          showRight:false,
        })
        break;
      case 3:
          that.setData({
            showCenter: true,
            center: lists[1],
            leftIn: lists[0],
            rightIn: lists[2],
            showLeft:false,
            showLeft01: true,
            showRight01: true,
            showRight:false,
          })
        break;
      case 4:
        that.setData({
          showCenter: true,
          center: lists[1],
          rightIn: lists[2],
          leftIn: lists[0],
          rightOut: lists[3],
          showLeft:true,
          showLeft01: true,
          showRight01: true,
          showRight:false,
        })
      break;
      default:
        that.setData({
          showCenter: true,
          center: lists[2],
          leftIn: lists[1],
          rightIn: lists[3],
          leftOut: lists[0],
          rightOut: lists[4],
          showLeft:true,
          showLeft01: true,
          showRight01: true,
          showRight:true,
        })
      break
    }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    // 红包雨倒计时
    hbyJson : {
      img : `https://cdn.bestseller.com.cn/assets/common/image/pet_close.png`,
      downNum : 15, //配置15秒
      canTap : false,
      canShow : false
    },
    titleLogo:`${cdn}/assets/common/${brand}/image/logo-black-rect.png`,
    isShowImg: false,
    navi: ['筛选品牌', '筛选礼品', '筛选积分'],
    navi_img: '../../../images/changeSwiper.png',
    filterBrand: ['全选', 'JACK&JONES', 'VEROMODA', 'ONLY', 'SELECTED'],
    filterGift:['全选', '商品', '优惠券'],
    filterContentRange: ['全选', '3000以下', '3000-4000', '4000以上'],
    filterContentAble: ['全部', '我可兑换'],
    filterGoods:[],
    navi_id: 0,
    brand_id: 0,
    gift_id: 0,
    goodsClassify_id:0,
    range_id: 0,
    able_id: 0,
    isShow: false,
    isShow_01: false,
    isShow_01_02: false,
    back: "< 返回上一级",
    isShow_02: false,
    isGrid: true,
    isList: false,
    showNoCoupon: false,
    isShowGift: false,
    isShowCoupon: false,
    giftList: [],
    couponList: [],
    gridList:[],
    isShowNotice: false,
    nothingText:'暂无任何活动',
    showCenter: false,
    showLeft: false,
    showLeft01: false,
    showRight01: false,
    showRight: false,
    center:[],
    leftOut:[],
    leftIn:[],
    rightOut: [],
    rightIn: [],
    notEnghtPoint: splitImg("point_not_enough.png","common"),
  },

  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  // 触摸移动事件
  touchMove: function (e) {
    let touchMove = e.touches[0].pageX;
    //向左滑动
    if(touchMove - touchDot <= -40 && time<10 && tmpFlag) {
      tmpFlag = false;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && time < 10 && tmpFlag) {
      tmpFlag = false;
      this.scrollRight();
    }
  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
  },

  //向左滑动事件
  scrollLeft(){

    this.animation1.translateX(-66).step();
    this.animation2.translateX(-50).scale(0.7, 0.7).step();
    this.animation3.translateX(-20).scale(0.85, 0.85).step();
    this.animation4.translateX(-20).scale(1, 1).step();
    this.animation5.translateX(40).scale(0.85, 0.85).step();

    this.setData({
      animation1: this.animation1.export(),
      animation2: this.animation2.export(),
      animation3: this.animation3.export(),
      animation4: this.animation4.export(),
      animation5: this.animation5.export()
    })

    var that = this;
    setTimeout(function () {
      that.animation1.translateX(-62).scale(0.7, 0.7).step({ duration: 0, timingFunction: 'linear'});
      that.animation2.translateX(-26).scale(0.85, 0.85).step({ duration: 0, timingFunction: 'linear' });
      that.animation3.translateX(14).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation4.translateX(56).scale(0.85, 0.85).step({ duration: 0, timingFunction: 'linear' });
      that.animation5.translateX(90).scale(0.7, 0.7).step({ duration: 0, timingFunction: 'linear' });
      that.setData({
        animation1: this.animation1.export(),
        animation2: this.animation2.export(),
        animation3: this.animation3.export(),
        animation4: this.animation4.export(),
        animation5: this.animation5.export()
      })
    }.bind(this), 150)

    let array = this.data.gridList;
    let shift = array.shift();
    array.push(shift);

    setTimeout(function () {
      this.setData({
        gridList: array
      })
    }.bind(this), 150);
    showGrid(this, this.data.gridList);
  },

  //向右滑动事件
  scrollRight() {

    this.animation1.translateX(-20).scale(0.85, 0.85).step();
    this.animation2.translateX(20).scale(1, 1).step();
    this.animation3.translateX(40).scale(0.85, 0.85).step();
    this.animation4.translateX(66).scale(0.7, 0.7).step();
    this.animation5.translateX(100).step();

    this.setData({
      animation1: this.animation1.export(),
      animation2: this.animation2.export(),
      animation3: this.animation3.export(),
      animation4: this.animation4.export(),
      animation5: this.animation5.export()
    })

    var that = this;
    setTimeout(function () {
      that.animation1.translateX(-62).scale(0.7, 0.7).step({ duration: 0, timingFunction: 'linear'});
      that.animation2.translateX(-26).scale(0.85, 0.85).step({ duration: 0, timingFunction: 'linear' });
      that.animation3.translateX(14).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation4.translateX(56).scale(0.85, 0.85).step({ duration: 0, timingFunction: 'linear' });
      that.animation5.translateX(90).scale(0.7, 0.7).step({ duration: 0, timingFunction: 'linear' });
      that.setData({
        animation1: this.animation1.export(),
        animation2: this.animation2.export(),
        animation3: this.animation3.export(),
        animation4: this.animation4.export(),
        animation5: this.animation5.export()
      })
    }.bind(this), 150)

    let array = this.data.gridList;
    let pop = array.pop();
    array.unshift(pop);

    setTimeout(function () {
      this.setData({
        gridList: array
      })
    }.bind(this), 150);

    showGrid(this, this.data.gridList);
  },

  chooesGoods: function (e) {
    console.log(this.data.center);
    var swp = this.data.center;
    if(swp.type === 'coupon'){
      var _id =  e.currentTarget.id;
      wx.setStorageSync("rcCouponInfo", swp);
      wx.navigateTo({
        url:'../rcGetCoupon/rcGetCoupon'
        });

    } else{
      var goodsCode = swp.goodsCode;
      var money = swp.money;
      var score = swp.score;
      var brand = swp.brandCode;
      if(swp.isStock){
        app.gioTrack('pageclick_personalcenter_points_gift', {
          spu_id: goodsCode
        });
        wx.navigateTo({
          url: '../rcGoodsDetail/rcGoodsDetail?goodsCode=' + goodsCode + '&money=' + money + '&score=' + score + '&id=' + _id + "&brand=" + brand
        });
      } else {
        wxShowToast('该商品库存不足！请选购其他商品。');
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_LOGINED);
    brandHeader = app.config.brand;
    getGiftList(this, brandHeader, '', '', '', '', '', '','');
    let hby_task = wx.getStorageSync('hby_task');
    if (hby_task == '1'){
      wx.removeStorageSync('hby_task');

      //  红包雨 倒计时15秒
      this.hbyInterval = setInterval(() => {
        let hbyJson = this.data.hbyJson
        if (hbyJson.downNum != 0){
          hbyJson.downNum -= 1
          hbyJson.canShow = true
        }
        else{
          hbyJson.img = `https://cdn.bestseller.com.cn/assets/common/image/pet_open.png`
          hbyJson.canTap = true

          wx.setStorageSync('hby_task', '2');
          clearInterval(this.hbyInterval)
        }
        this.setData({hbyJson})
      }, 1000);

    }
  },

  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      getGiftList(this, brandHeader, '', '', '', '', '', '','');

    }
  },
/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

   setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
    }, 1000);

    if('JLINDEBERG' == app.config.brand || "NAMEIT" == app.config.brand){
      this.setData({
        isShowImg: true,
        navi: ['筛选礼品', '筛选积分'],
      });
    }
  },

  onReady: function(){
    this.animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation4 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation5 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
  },

  /**
   * 导航栏切换
   */
  clickNavi: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var content = [];

    if (id == 0) {
      if("NAMEIT" == app.config.brand || 'JLINDEBERG' == app.config.brand ){
        if (that.data.isShow_01 && _id == 0) {
          that.setData({
            isShow: false,
            isShow_01: false,
            isShow_01_02: false,
            isShow_02: false,
          })
        } else {
          that.setData({
            isShow: false,
            isShow_01: true,
            isShow_02: false,
          })
        }
      } else {
        if (that.data.isShow && _id == 0) {
          that.setData({
            isShow: false,
            isShow_01: false,
            isShow_01_02: false,
            isShow_02: false,
          })
        } else {
          that.setData({
            isShow: true,
            isShow_01: false,
            isShow_01_02: false,
            isShow_02: false,
          })
        }
      }
      _id = 0;
    } else if (id == 1) {
      if("NAMEIT" == app.config.brand || 'JLINDEBERG' == app.config.brand ){
        if (that.data.isShow_02 && _id == 1) {
          that.setData({
            isShow: false,
            isShow_01: false,
            isShow_02: false,
            isShow_01_02: false,
          })
        } else {
          that.setData({
            isShow: false,
            isShow_01: false,
            isShow_01_02: false,
            isShow_02: true,
          })
        }
      } else {
        if (that.data.isShow_01 && _id == 1) {
          that.setData({
            isShow: false,
            isShow_01: false,
            isShow_01_02: false,
            isShow_02: false,
          })
        } else {
          that.setData({
            isShow: false,
            isShow_01: true,
            isShow_02: false,
          })
        }
      }
      _id = 1;
    } else if (id == 2) {
      if (that.data.isShow_02 && _id == 2) {
        that.setData({
          isShow: false,
          isShow_01: false,
          isShow_01_02: false,
          isShow_02: false,
        })
      } else {
        that.setData({
          isShow: false,
          isShow_01: false,
          isShow_01_02: false,
          isShow_02: true,
        })
      }
      _id = 2;
    }

    that.setData({
      navi_id: id,
    })
  },

  /**
   * 切换布局
   */
  changeLayout: function () {
    var that = this;
    if (layoutType === "grid") {
      layoutType = "list";
      that.setData({
        navi_img: '../../../images/changeList.png',
        isGrid: false,
      });

      if(that.data.giftList.length == 0 && that.data.couponList.length == 0){ //可兑换的商品和优惠券都为空
        that.setData({
          isList: false,
          showNoCoupon: true,
        })
      } else if(that.data.giftList.length != 0 && that.data.couponList.length == 0){ //有可兑换的商品 没有可兑换的优惠券
        that.setData({
          isList: true,
          showNoCoupon: false,
          isShowGift: true,
          isShowCoupon: false,
        })
      } else if(that.data.giftList.length == 0 && that.data.couponList.length != 0){ //没有可兑换商品 有可兑换的优惠券
        that.setData({
          isList: true,
          showNoCoupon: false,
          isShowGift: false,
          isShowCoupon: true,
        })
      } else { // 既有可兑换的优惠券 又有可兑换的商品
        that.setData({
          isList: true,
          showNoCoupon: false,
          isShowGift: true,
          isShowCoupon: true,
        })
      }
    } else if(layoutType === "list"){
      layoutType = "grid"
      that.setData({
        navi_img: '../../../images/changeSwiper.png',
        isList: false,
      })
      if(that.data.gridList.length == 0){
        that.setData({
            isGrid: false,
            showNoCoupon: true,
        })

      } else {
        that.setData({
          isGrid: true,
          showNoCoupon: false,
      })
      showGrid(that, that.data.gridList);
      }
    }

   // getGiftList(this, type, brandCode, pointsStart, pointsEnd, moneyStart, moneyEnd);
  },

  /**
   * 筛选过滤条件(根据品牌筛选)
   */
  clickFilter: function (e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.id;
    if(id == 0){
      brandCode = '';
    } else if(id == 1){
      brandCode = 'JACKJONES';
    } else {
      brandCode =  that.data.filterBrand[id];
    }
    that.setData({
      brand_id: id,
    })
  },

   /**
   * 筛选过滤条件(根据商品筛选)
   */
  clickFilter_01: function(e){
    var that = this;
    var id = e.currentTarget.id;
    var str = '';
    goodsCouponType = '';
    that.setData({
      goodsClassify_id: 0,
    })
    if(id == 1){
      type = "goods";
      str = '暂无任何商品';
      getGoodsClassify(this, brandHeader, type, brandCode, pointsStart, pointsEnd, moneyStart, moneyEnd, '');
      that.setData({
        isShow_01_02:true,
      });
    }else if(id == 2){
      type = "coupon";
      str = '暂无任何优惠券';
    } else {
      type = "";
      str = '暂无任何活动';
    }

    that.setData({
      gift_id: id,
      nothingText : str,
    })
  },

  /**
   * 筛选过滤条件(根据商品筛选)
   */
  clickFilter_01_02: function(e){
    var that = this;
    var id = e.currentTarget.id;
    var str = '';
    if(id == 0){
      goodsCouponType = '';
    } else {
      goodsCouponType = that.data.filterGoods[id];
    }
    that.setData({
      goodsClassify_id: id,
    })
  },

  close_01_02: function(e){
      this.setData({
        isShow_01_02: false,
      })
  },

   /**
   * 筛选过滤条件(指定积分进行筛选)
   */
  clickFilter_02:function(e){
    var that = this;
    var id = e.currentTarget.id;
    let ablePoint = wx.getStorageSync(KEYSTORAGE.crmInfo).availablepoints;
    // 已选中可兑换
    if(isAbleToBuy){
      switch(id){
        case '1':
          pointsStart = "0";
          if(Number(ablePoint) > 3000){
            pointsEnd = "3000";
          } else {
            pointsEnd = ablePoint;
          }
          that.setData({
            range_id: id,
          })
          break;
        case '2':
          if(Number(ablePoint) < 3000){
            that.setData({
              isShowNotice: true,
              isShow_02: false,
            })
          } else if(Number(ablePoint) > 3000 && Number(ablePoint) < 4000){
            pointsStart = "3000";
            pointsEnd = ablePoint;
            that.setData({
              range_id: id,
            })
          } else {
            pointsStart = "3000";
            pointsEnd = "4000";
            that.setData({
              range_id: id,
            })
          }
          break;
        case '3':
          if(Number(ablePoint) < 4000){
            that.setData({
              isShowNotice: true,
              isShow_02: false,
            })
          } else {
            pointsStart = "4000";
            that.setData({
              range_id: id,
            })
          }
          break;
        default:
          pointsStart = "";
          pointsEnd = "";
          that.setData({
            range_id: id,
          })
          break;
      }
    } else {  // 未选中 可兑换
      switch(id){
        case '1':
          pointsStart = "0";
          pointsEnd = "3000";
          break;
        case '2':
          pointsStart = "3000";
          pointsEnd = "4000";
          break;
        case '3':
          pointsStart = "4000" ;
          pointsEnd = "";
          break;
        default:
          pointsStart = "";
          pointsEnd = "";
          break;
      }
      that.setData({
        range_id: id,
      })
    }
  },

    /**
   * 筛选过滤条件(可用积分)
   */
  clickFilter_03:function(e){
    var that = this;
    var id = e.currentTarget.id;
    let ablePoint = wx.getStorageSync(KEYSTORAGE.crmInfo).availablepoints;
    if(id == 1){
      if(Number(ablePoint) < Number(pointsStart)){
        that.setData({
          isShowNotice: true,
          isShow_02: false,
        })
      } else if(Number(ablePoint) <  Number(pointsEnd)){
        isAbleToBuy = true;
         pointsEnd = ablePoint;
         that.setData({
          able_id: id,
        })
      }else {
        isAbleToBuy = true;
        that.setData({
          able_id: id,
        })
      }
    } else {
      isAbleToBuy = false;
      that.setData({
        able_id: id,
      })
    }
  },
  /**
   * 清除筛选
   */
  btnClear: function (e) {
      var that = this;
      var _type = e.currentTarget.dataset.type;
      switch(_type){
          case "brand":
            that.setData({
              //isShow : false,
              brand_id: -1,
            });
            brandCode = "";
            break;
          case "goods":
            that.setData({
              //isShow_01: false,
              gift_id: -1,
            });
            type ="";
            break;
          case "able":
            that.setData({
              //isShow_02: false,
              range_id: -1,
              able_id: -1,
            });
            pointsStart = "";
            pointsEnd = "";
            break;
          case "classify":
            that.setData({
              goodsClassify_id: -1,
            });
            goodsCouponType = "";
            break;
      }
    //getGiftList(this, brandHeader, type, brandCode, pointsStart, pointsEnd, moneyStart, moneyEnd, goodsCouponType);
  },

  /**
   * 确认你筛选
   */
  btnSubmit: function () {
     getGiftList(this, brandHeader, type, brandCode, pointsStart, pointsEnd, moneyStart, moneyEnd, goodsCouponType);
     this.setData({
        isShow: false,
        isShow_01: false,
        isShow_02: false,
        isShow_01_02: false,
    })
  },

  takeUp: function(){
      this.setData({
        isShow: false,
        isShow_01: false,
        isShow_02: false,
        isShow_01_02: false,
      })
  },

  torcGoodsDetail: function(e){
      console.log(e);
      var _id =  e.currentTarget.id;
      var goodsCode = this.data.giftList[_id].goodsCode;
      var money = this.data.giftList[_id].money;
      var score = this.data.giftList[_id].score;
      var brand =  this.data.giftList[_id].brandCode;
      if(this.data.giftList[_id].isStock){
        wx.navigateTo({
          url: '../rcGoodsDetail/rcGoodsDetail?goodsCode=' + goodsCode + '&money=' + money + '&score=' + score + '&id=' + _id + "&brand=" + brand
        });
      } else {
        wxShowToast('该商品库存不足！请选购其他商品。');
      }

  },

  torcGetCoupon: function(e){
      console.log(e);
      var _id =  e.currentTarget.id;
      wx.setStorageSync("rcCouponInfo", this.data.couponList[_id])
      console.log(this.data.couponList[_id]);
      wx.navigateTo({
        url:'../rcGetCoupon/rcGetCoupon'
      });
  },
  onUnload: function () {
    //取消订阅
    events.unregister(this, EVENTS.EVENT_LOGINED);
    clearInterval(this.hbyInterval)
  },
  hbyTap(){
    wx.navigateBack({
      delta: 1
    });
  },

  toShop:function(){
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  toOther:function(){
    this.setData({
      isShowNotice:false,
    })
  }
})
