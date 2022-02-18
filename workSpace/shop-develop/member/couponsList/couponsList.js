
// pages/main/index.js
import {EVENTS, URL_CDN, KEYSTORAGE} from "../../src/const";
import { getVoucherList } from "../../service/voucher";
import { getCouponList } from "../../service/coupon";
import { getCRMInfo } from "../../service/user";
import events from "../../src/events";

const pagePath = "../../";
const main = require(pagePath + "base/main.js");
const url = require(pagePath + "base/url.js");
const tongji = require('../../utils/tongji.js');
const app = getApp();

const cdn = app.config.cdn;
let brand = '';
const _jj = [ URL_CDN.COUPON_JJBG_1,  URL_CDN.COUPON_JJBG_2,  URL_CDN.COUPON_JJBG_3 ];
const _only = [ URL_CDN.COUPON_OYBG_1,URL_CDN.COUPON_OYBG_2,URL_CDN.COUPON_OYBG_3 ];
const _vm = [ URL_CDN.COUPON_VMBG_1,URL_CDN.COUPON_VMBG_2,URL_CDN.COUPON_VMBG_3,];
const _slt = [ URL_CDN.COUPON_STBG_1,URL_CDN.COUPON_STBG_2,URL_CDN.COUPON_STBG_3];
const _fol = [ URL_CDN.COUPON_FOLBG_1,URL_CDN.COUPON_FOLBG_2,URL_CDN.COUPON_FOLBG_3];

Page({
  data: {
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    coupon1: [],   //优惠券列表（门店）
    coupon2: [],   //优惠券列表（官网）
    coupon3: [],   //优惠券列表（门店官网通用）
    brand: app.config.title,
    hideLoding: true,
    couponImg: []
  },
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      setTimeout(()=>{
        this.computerBrand();
        this._getVoucherList();
        this._getCouponList();
      },1200);
    }
  },
  onLoad: function (options) {
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    if (!app.checkLogin()) {
      return;
    }
    /*wx.showLoading({
      title: '加载中...'
    });*/
    this._getCRMInfo();
    this.computerBrand(options);
    this._getVoucherList();
    this._getCouponList();
  },
  computerBrand: function(options){
    let name = app.config.etoBrand;
    if(options && options.name){
      name = parseInt(options.name);
    }
    let curBrand = '';
    if (name === 1) {
      brand = 'ONLY';
      curBrand = _only;
    } else if (name === 2) {
      brand = 'JACK & JONES';
      curBrand = _jj;
    } else if (name === 3) {
      brand = 'VERO MODA';
      curBrand = _vm;
    } else if (name === 4) {
      brand = 'SELECTED';
      curBrand = _slt
    }else if(name === 6){
      brand = 'BESTSELLER';
      curBrand = _fol
    }
    this.setData({ couponImg: curBrand})
  },
  // 优惠券new
  _getVoucherList: function(){
    let user_info = wx.getStorageSync('user_info');
    let memberno = user_info.memberno || '';
    if(!user_info.phone){
      return
    }
    getVoucherList(memberno).then( res => {
      let type = '优惠券';
      this.handleData(res, type)
    }).catch(e => {
      wx.showToast({
        title: e.message,
        icon: 'none'
      });
    });
  },
  // 活动券new
  _getCouponList: function(){
    let user_info = wx.getStorageSync('user_info');
    if(!user_info.phone){
      return
    }
    let memberno = user_info.memberno || '';
    getCouponList(memberno).then(res => {
      let type = '活动券';
      this.handleData(res, type)
    }).catch(e =>{
      wx.showToast({
        title: e.message,
        icon: 'none'
      });
    })
  },
  handleData:function(res, type){
    let [coupon1,coupon2, coupon3] = [this.data.coupon1, this.data.coupon2, this.data.coupon3];
    const cardImg = `${cdn}/memberImage/`;
    const curTime = new Date().getTime();
    res.forEach(item => {
      item.quanType = type;
      console.log(item.brand, '*', brand,'*', item.brand === brand)
      if(item.brand === brand){
        // 拼接图片路径
        if(item.intergrationid){
          item.cardImg = `${cardImg}${item.intergrationid}.png`
        }
        if(item.promid){
          item.cardImg = `${cardImg}${item.promid}.png`
        }
        if(item.channel){
          if(item.enddate.indexOf(' ') > -1){
            item.enddate = item.enddate.split(' ')[0]
          }
          console.log(item.channel);
          if(item.channel.includes('H5') || item.channel.includes('miniapp') || item.channel.includes('官网')){
            coupon2.push(item)
          }else if(item.channel.indexOf('门店') > -1){
            coupon1.push(item)
          }else if(item.channel.indexOf('通用') > -1){
            coupon3.push(item);
          }
          /*let endTimeArr = item.enddate.split('/');
          let endTime = new Date(`${endTimeArr[2]}/${endTimeArr[0]}/${endTimeArr[1]}`).getTime();
          if(endTime - curTime > 0){

          }*/
        }
      }
    });
    this.setData({coupon1, coupon2, coupon3});
  },
  _getCRMInfo: function(){
    let CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    if(CRMInfo.phone){
      return
    }
    let crmParam = {
      brand: getApp().config.etoBrand,
      unionid: wx.getStorageSync(KEYSTORAGE.unionid) || ''
    };
    getCRMInfo(crmParam).then(res => {
      wx.setStorageSync(KEYSTORAGE.crmInfo, res[KEYSTORAGE.crmInfo])
    }).then( () => {
      this.computerBrand();
      this._getVoucherList();
      this._getCouponList();
    })
  },
  onShow: function () {
    app.track()
  },

  golink: function (event) {
    var id = event.currentTarget.dataset.id;
    if (id == 1) {
      wx.navigateTo({
        url: "/pages/fashionID/lbs/lbs"
      });
    } else {
      wx.switchTab({
        url: "/pages/index/index"
      });
    }
  },

  //打开优惠券
  openQuan: function (e) {
    var that = this;
    var id = parseInt(e.currentTarget.id);
    var index = parseInt(e.currentTarget.dataset.index);
    var this_coupons = {};
    var _Data = {};

    if (id == 1) {
      this_coupons = that.data.coupon1;
    } else if (id == 2) {
      this_coupons = that.data.coupon2;
    } else if (id == 3) {
      this_coupons = that.data.coupon3;
    };


    if( this_coupons[index].quanType == '活动券' ){
      _Data = {
        couponCode: this_coupons[index].couponno,
        couponId: this_coupons[index].promid
      };
    }else if( this_coupons[index].quanType == '优惠券' ){
      _Data = {
        couponCode: this_coupons[index].voucherno,
        couponId: this_coupons[index].intergrationid
      };
    }


    //获取优惠券状态并在微信中打开优惠券
    main.request(
      url.getCouponStatus,
      _Data, 
      function (res) {
        if (res.data.errcode == 0) {

          if (res.data.data.cardList[0].cardExt) {
            var json = JSON.parse(res.data.data.cardList[0].cardExt);
          };

          if (res.data.is_get_card == 0) {
            wx.addCard({
              cardList: [
                {
                  cardId: res.data.data.cardList[0].cardId,
                  cardExt: res.data.data.cardList[0].cardExt
                }
              ],
              success: function (res) {
                wx.openCard({
                  cardList: [{
                    cardId: json.card_id,
                    code: json.code
                  }],
                  success: function (res) {
                  },
                  fail: function (res) {
                  }
                });
              }
            })
          } else {
            wx.openCard({
              cardList: [{
                cardId: res.data.data.cardList[0].cardId,
                code: res.data.data.cardList[0].code
              }],
              success: function (res) {
              },
              fail: function (res) {
              }
            });
          };
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false
          });
        };

      });

  }
})
