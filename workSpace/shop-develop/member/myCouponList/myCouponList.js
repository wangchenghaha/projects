// member//myCouponList/myCouponList.js
import {getVoucher} from "../../service/voucher";
import {dateIsOverDue, handleCouponDate, splitImg} from "../../utils/utils";
import {wxShowToast} from "../../utils/wxMethods";
import {EVENTS, KEYSTORAGE} from "../../src/const";
import events from "../../src/events";
//============齐数修改start============
// import DEV from '../../config/main'
// import request from '../../utils/request'
import { getCouponStatus } from '../../service/coupon'
// const couponDomain = DEV ? 'https://bestseller-wechat-test.woaap.com' : 'https://bestseller-wechat.woaap.com'
// GET_COUPON_UPDATE: `${couponDomain}/page/mini-update-coupon`, // 更新优惠券
// ===============齐数修改============


const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
let curOptions = {};
const voucherChannel = {
  T: '通用',
  P: '门店',
  MiniApp: '小程序'
};
/**
 *
 * @param id 活动ID
 */
function splitCouponImg(id, curBrand){
	return `${cdn}/memberImage/${curBrand}/${id}.jpg`
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdn,
    brand,
    newAddCoupon: [],
    swiperIndex: 1,
    couponKind: [
      {
        title: "门店专享优惠券",
        coverImg: splitImg('store.png', 'common'),
        showMore: false,
        couponList: []
      },
      {
        title: "官网专享优惠券",
        coverImg: splitImg('Officialwebsite.png', 'common'),
        showMore: false,
        couponList: []
      },
      {
        title: "门店&官网专享优惠券",
        coverImg: splitImg('currency.png', 'common'),
        showMore: false,
        couponList: []
      }
    ],
    noCouponImg: '',
    cardNum: 0,
  },

  // 获取优惠券列表
  getAllCard(){
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo) || '';
    const memberno = crmInfo.memberno;
    const couponKind = this.data.couponKind;
    let newAddCoupon = [];
    const optionBrand = this.handleBrand();
    wx.showLoading({
        title: '加载中',
    });
    if(app.config.isSaleForce){
    	const phone = crmInfo.phone;
    	const reqParam = {
        phone,
		    brandCode: this.handleBrand(),
	    };
	    getVoucher(reqParam).then(res => {
        wx.hideLoading();
        this.handleData(res);
      }).catch(err => {
        wxShowToast(err.message);
        console.log(err,'***');
      });
    }
  },
  handleData(allCoupon){
    const optionBrand = this.handleBrand();
    let newAddCoupon = this.data.newAddCoupon;
    const couponKind = this.data.couponKind;
    const curDate = Date.now();
    const curBrand = app.config.VOUCHER_BRAND[optionBrand];
    // const curBrand = 'ONLY';
    let curBrandCoupon = allCoupon;
    const effectDays = 30; // 30天之内
    curBrandCoupon.forEach(item => {
      const newStartDate = new Date(handleCouponDate(item.startdate)).getTime();
      const newEndDate = new Date(handleCouponDate(item.enddate)).getTime();
      item.imgUrl = splitCouponImg(item.intergrationid || item.promid || item.promotioncode, optionBrand);
      /*
      * member_bg 官网
      * member_shop 门店
      * member_shop_web 门店官网通用
      *
      * */
      // 渠道分类
	    const curChannel = this.handleFolChannel(item.channel);
      if(curChannel){
        if(curChannel === 'P' || curChannel.includes('P')){
          item.bgImg = splitCouponImg('member_shop', optionBrand);
          couponKind[0].couponList.push(item)
        }else if (curChannel === 'H5' || curChannel ==='MiniApp' || curChannel.includes('H5') || curChannel.includes('MiniApp')){
          item.bgImg = splitCouponImg('member_bg', optionBrand);
          couponKind[1].couponList.push(item)
        }else if(curChannel === 'T' || curChannel.includes('T')){
          item.bgImg = splitCouponImg('member_shop_web', optionBrand);
          couponKind[2].couponList.push(item)
        }
      }

      // 有效天数
      item.effectDay = dateIsOverDue(newEndDate) * 1 + 1;
      // 30天之内的优惠券
      if(!dateIsOverDue(newStartDate, effectDays) && curDate <= newEndDate){
        newAddCoupon.push(item)
      }
    });
	  let cardNum = couponKind.reduce((total, item) => (total + item.couponList.length), 0);
    this.setData({couponKind, newAddCoupon, cardNum})
  },
	// FOL渠道
	handleFolChannel(channel){
  	if(channel.includes(';')){
  		channel = channel.split(';')
	  }
  	const channelFOL = {
		  'FOL-On': 'MiniApp', // 官网
		  'FOL-H5': 'H5', // H5
		  'FOL-Off': 'P', //门店
		  'FOL-Both': 'T', // 通用
		  'P': 'P'
	  };
  	if(Array.isArray(channel)){
  		return channel
	  }
	  return channelFOL[channel] || channel;
		// U：联合官网、FOL-On：fol官网、FOL-Off：FOL门店、FOL-Both：FOL通用、FOL-H5：FOL-H5

	},
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      setTimeout(()=>{
        this.getAllCard()
      },1200);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
	  this.handleNoCoupon();
	  app.setUtmOptions(options);
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    if (!app.checkLogin()) {
      return;
    }
    this.getAllCard();
	  app.track();
	  this.autoOpenCard();
  },
  autoOpenCard(){
    const {couponCode = '', couponId = ''} = curOptions;
    if(couponCode && couponId){
      this.openVoucherCard({couponCode, couponId})
    }
  },
	handleNoCoupon(){
  	const systemInfo = wx.getSystemInfoSync();

  	let fileName = 'conNotime@2X';
  	if(systemInfo.pixelRatio > 2){
		  fileName = 'conNotime@3X';
  	}
		console.log(systemInfo,'systemInfo', fileName);
		this.setData({
			noCouponImg: splitCouponImg(fileName, this.handleBrand()),
		});
	},
  // 图片404处理
  handleImgErr(e){
    // console.log(e,'***')
  },
  /**
   * 通过option.name 获取品牌
   * @returns {string}
   */
  handleBrand(){
    let curBrand = brand;
    const etoBrand = app.config.ETO_BRAND;
    for(let item in etoBrand){
      if(etoBrand[item] === curOptions.name * 1){
        curBrand =  item ;
      }
    }
    this.setData({brand, curBrand});
    return curBrand
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onClick(e){
    const dataType = e.currentTarget.dataset.type;
    switch (dataType){
      case 'swiper':
        this.onSwiper(e);
        break;
      case 'slider':
        this.sliderChange(e);
        break;
      case 'changShow':
        this.changShow(e);
        break;
      case 'card':
        this.openCard(e);
        break;
    }
  },
  // 打开卡券
  openCard(e){
    const dataIndex = e.currentTarget.dataset.index;
    const dataIn = e.currentTarget.dataset.in;
    const newAddCoupon = this.data.newAddCoupon;
    const couponKind = this.data.couponKind;
    const curCoupon = (typeof dataIn === 'undefined') ? newAddCoupon[dataIndex] : couponKind[dataIn].couponList[dataIndex];
    const couponInfo = {
      couponCode: curCoupon.couponno || curCoupon.voucherno || curCoupon.voucherno,
      couponId: curCoupon.promid || curCoupon.intergrationid || curCoupon.promotioncode,
    };
    app.gioTrack('pageclick_personalcenter_myCoupons_brand_kabao', {brand,code: couponInfo.couponCode })
    //============齐数修改start============
    // app.openVoucherCard(couponInfo);
    this.openVoucherCard(couponInfo)
    //============齐数修改end============
  },
  // 显示隐藏
  changShow(e){
    const dataIndex = e.currentTarget.dataset.index;
    let couponKind = this.data.couponKind;
    couponKind[dataIndex].showMore = !(couponKind[dataIndex].showMore);
    this.setData({couponKind})
  },
  sliderChange(e){
    this.setData({
      swiperIndex: e.detail.value || 1
    })
  },
  // 滑动
  onSwiper(e){
    this.setData({
      swiperIndex: e.detail.current + 1
    })
  },
  //========================齐数修改start==========================================
  opencard (cardList) {
    console.log(cardList, 'opencard开卡数据============')
    wx.openCard({
      cardList,
      success: function() {
        console.log('成功进入opencard');
      },
      fail: function(res) {
        wx.showToast({
            title: res,
            icon: 'none'
        })
      }
    })
  },
  openVoucherCard: function(voucherInfo){
    let { couponCode, couponId } = voucherInfo
    if(couponCode && couponId){
      let param = {
        couponCode,
        couponId
      }
      getCouponStatus(param).then(res => {
        let { is_get_card, coupon_type, data: { cardList } , } = res
        if(is_get_card){
          this.opencard(cardList)
          return
        }
        if (coupon_type == 1) {
          console.log( '是商家券============')

          this.selectComponent('#sellert-ticket').openHandle({
            sellerticket: {
              isAddCard: 0, // 是否已经领取到卡包
              couponDetail: cardList, // 商家券数据
            },
            success: (res) => {
              console.log(res, '商家券领取成功回调')
            }
          })
          return
        }
        console.log( '不是商家券============')

        const _this = this
        wx.addCard({
          cardList,
          success (res) {
            setTimeout(() => {
              _this.opencard(cardList);
            }, 100);
          }
        })

      }).catch(err => wxShowToast(err.message))
    }else{
      wxShowToast('优惠券信息不完整');
    }
  },

  //================================齐数修改end========================================
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
