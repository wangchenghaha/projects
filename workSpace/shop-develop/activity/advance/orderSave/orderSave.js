import {skuToImg ,chengfa, jiafa, jianfa, toDecimal, getDateByOrder, formatCRMDate, objToQuery, filterStr, formatDate,filterPickupActTip, splitImg, compareArr} from '../../../utils/utils';
import {URL_CDN, KEYSTORAGE, REGEXP, EVENTS} from "../../../src/const";
import { wxShowToast } from "../../../utils/wxMethods";
import { getAddress} from '../../../service/member'
import { sendTmpInfo } from '../../../service/mini'
import { ruleListBySku } from '../../../service/promotion'
import { getVoucher } from "../../../service/voucher";
import {newOrderSave, getNewExpressFare, preSaleOrderSave} from "../../../service/order";
import {checkLocation,getCurrLocation,getProvincesThroughIP, getProvincesThroughCoordinate } from "../../../service/location";
import {pickupStoreList} from "../../../service/pickup";
import { orderCouponList, queryNumCoupon} from "../../../service/coupon";
import events from '../../../src/events';
import {wxRequestPayment} from "../../../service/pay";
const app = getApp();
const {brand, cdn, ORDER_TYPE} = app.config;
let cityArr = [];
// 加价购， 满即赠， 满减， 满折
const addPriceType = '1000', giveType = '1001', reduceType = '1002', discountType = '1003';
const strReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
const JLBrand = 'JLINDEBERG';
const isJL = brand === JLBrand;
let isUsePromotion = false;
// 是否赠品
const IS_GIFT = 'Y';
// 取优惠最大
const maxPriceRule = 'priceRule';

//
let modifyPromotionItem = null;

let goodsOrderList = [], orderSaveParam = {};

let zitiReduction = 0;
const JLCouponType = {
  coupon: '优惠券',
  active: '活动券'
}
// 经度，纬度(NUMBER)
let latitude = 0, longitude = 0;
const DELIVERY_MODE = 'pickup';
// 折扣商品是够使用优惠券
const discountGoodsUseVoucher = app.config.discountGoodsUseVoucher;
let isHaveDiscountGoods = false;
let curOptions ={};
let isAddExpress = true;
const regionProvince = '省(自治区)', regionCity = '市', regionArea = '区(县)';
let expressPrice = 0;
let CRMInfo = {};
Page({
  // 是否授权定位
  isAuthor:'0',

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    orderGoods:[],
    orderGoodsNum: 0,
    // 配送方式
    shippingMethods:[
      {
        text:'邮寄到家',
        selected: true,
        isShow: true,
      }
      // {
      //   text:'到店自提',
      //   selected: false,
      //   isShow: app.config.isStoreOption ,
      // }
    ],
    // 地址信息
    address:{},
    // 优惠券数量
    cardNum: 0,
    goodsPrice: 0, // 商品总额
    expressFare: 0, // 运费
    voucherPrice: 0, // 优惠
    payPrice:0,  // 实际支付
    cardShow: false, // 优惠券活动券列表展示
    voucherList: [], // 优惠券列表
    couponList: [], // 活动券列表
    // 显示优惠券loading
    voucherLoading: true,
    // 促销列表
    promotion: {
      list: [],
      show: true
    },
    usingCardVoucher:{},
    usingCoupon:{},
    selectText: '请选择',
    // 自提
    pickupList: [],
    showPickupList: true,
    pickupStore: {},
    region: {
      list: [regionProvince, regionCity, regionArea],
      selected: false,
    },
    customItem: '全部',
    pickupShow: false,
    // 提货人手机号
    pickupUserPhone: '',
    // 支付按钮
    disabled: false,
    // JL活动
    cardPromotion: [],
    inputStatus: false,
    couponNum: '',
    noNameCouponValue: 0,
    noNameCouponDesc: '',
    showNoNameCoupon: app.config.showNoNameCoupon || false,
    popup:{
      show: false,
      bgColor: '#fef4f3'
    },
    childList: [],
    isPost: true,
    pickupImg: [splitImg('point_left.png' ,'common'), splitImg('postself.gif' ,'common') ],
    isActivity: app.config.IS_PICKUP || false,
    phoneArray: [],
    isSlected: true,
    selectedPhone: "",
    noticeAct: false,
    wxIcon: splitImg('wxpay_icon.png', 'common'),
	  preSaleInfo: {
    	step: [{
    		  active: true,
			    name: '阶段1',
			    payName: '定金',
			    payPrice: '50'
		    },{
			    name: '阶段2',
			    payName: '尾款',
			    payPrice: '50'
		    }
	    ],
    	endTime: '12月10日 00:00:00开始支付尾款',
		  isAgree: false
	  },
	  prePayPrice: 0, // 预售付款金额
	  isShowNotice: false,
	  ruleList: [],
    activityTitle: '预售规则'
  },
	closeThisPop() {
  	this.setData({isShowNotice: false})
	},
  handleEvent: function(event, type){
    if(type === EVENTS.EVENT_CRMINFO){
      CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      orderSaveParam.phone = CRMInfo.phone;
      this.getRuleListBySku();
      // this.orderCouponList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    this.pageInit();
    const isMember = wx.getStorageSync('isMember');
    !isMember ? app.isMemberETO() : '';
    this.guideShare();
    this.getGoodsList();
    if(CRMInfo.phone){
      this.getRuleListBySku();
    }else{
      app.getCRMInfoFn();
    }
    zitiReduction = 0;
    // this.computerNewExpress('SP',1);  预售不要运费
    try {
      app.tdSdkEvent('flow_purchase_order_1', {});
    }catch (e) {}
    //订阅登录事件
    events.register(this, EVENTS.EVENT_CRMINFO);
    this.collectDate('提交订单页面')
    this.checkAndGetLocation();
    // 微信数据上报
    app.setIsNewlyOpen(this, options);
  },
  pageInit: function(){
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const unionid = wx.getStorageSync(KEYSTORAGE.unionid);
    // 微信广告用户行为信息
    const wxUserAction = wx.getStorageSync(KEYSTORAGE.wxUserAction);
    const chanId = wx.getStorageSync(KEYSTORAGE.chanId) || '';
    goodsOrderList = [];
    orderSaveParam = {
      channelId: 1,
      channelCode: app.config.channel,
      realSellPrice: '',
      payPrice: '',
      goodsTotalCount: '',
      gscPicmianId: "1",
      picUrl: '',
      province: '',
      city: '',
      area: '',
      detailAddress: '',
      contactTel: '',
      consignee: '',
      goodsOrderList: goodsOrderList,
      bigOrderAppendix: {
        targetUrl: '',
        utmCampaign: '',
        utmMedium: '',
        utmSource: '',
        utmTerm: ''
      },
      crmId: CRMInfo.memberno || '',
      utmWxScene: wx.getStorageSync('scene') || '',
      expressFare: 0,
      unionid: unionid,
      customerNickname: wxInfo.nickName || '',
      customerFaceImg: wxInfo.avatarUrl || '',
      latitude:'', // 维度
      longitude: '',   // 经度
      phone: CRMInfo.phone || '',
      openId: app.getOpenId(),
      //微信广告用户行为信息
      wxUserAction: {
        url: wxUserAction ? wxUserAction.url : '',
        clickId: wxUserAction ? wxUserAction.clickId : '',
      },
      // 微信订单来源渠道
      wxChanInfo: {
        chanId,
        chanReferAppId: chanId ? app.config.gygAPPid : '',
      },
      devFlag: wx.getSystemInfoSync().model || '',
      orderType: ORDER_TYPE['PRESELL'],
      bindReason: '预售',
    };
    const device = wx.getSystemInfoSync().model || '';
    const devFlag = wx.getStorageSync(KEYSTORAGE.devFlag);
    const shareDevice = wx.getStorageSync(KEYSTORAGE.shareDevice);
    let orderDevFlag = `设备型号：${device}`;
    if(devFlag && devFlag === app.config.WX_WORK){
      orderDevFlag += `_分享设备：${devFlag}`
    }
    if(shareDevice){
      orderDevFlag += `_${shareDevice}`
    }
    // 分享信息
    orderSaveParam.devFlag = orderDevFlag;
    let daogouLists = wx.getStorageSync('daogouLists');
    if(daogouLists && daogouLists.length){
      let utmObj = {};
      daogouLists.forEach(item =>  utmObj[item.key] = item.value )
      Object.assign(orderSaveParam.bigOrderAppendix, utmObj)
    }
    wx.removeStorageSync('isJiajiagou');
    wx.removeStorageSync('promoteItem');
    // 满即赠删除状态
    wx.removeStorageSync('giveType');
    goodsOrderList = [];
    orderSaveParam.ruleId = ''
  },
  collectDate: function(eventName, value){
    let curParam = {eventName,};
    value ? curParam.eventValue = value : '';
    let collectParam = Object.assign(curOptions, curParam);
    app._collectData2(collectParam);
  },
  //补充地址
  buchongAddress:function(){
    
    wx.setStorageSync('getWxAddress', 2);
    if (this.data.address.isLocation){
      wx.setStorageSync('zidongAddress',this.data.address)
    }
    wx.navigateTo({ url: '../addAddress/addAddress' });
  },
  // 获取经纬度
  checkAndGetLocation(){
    var address = this.data.address
    address.isLocation = false
    this.setData({
      address
    })
    wx.getSetting({ success: res => {

      if (!res.authSetting['scope.userLocation']){
        wx.authorize({
          scope:
            'scope.userLocation',
          success: res => {

            this.getLocation()

          },
          fail: () => {
            wx.showModal({
              title: '获取你的位置信息', //提示的标题,
              content: '您的位置信息将用于快速帮您填写收货地址', //提示的内容,
              showCancel: true, //是否显示取消按钮,
              cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
              cancelColor: '#000000', //取消按钮的文字颜色,
              confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({ success: res => {
                    if (res.authSetting['scope.userLocation']){
                      
                      this.getLocation()

                    }
                    else{
                      this.setData({
                        isAuthor : '0'
                      })
                      if(getApp().config.PICKUP_ACT_ENABLED){
                        getProvincesThroughIP().then(item=>{
                          wx.setStorageSync('dingwei', {'jingdu': item.location.lng, 'weidu': item.location.lat});
                          let cityNow = item.ad_info.city;
                          let tipStr = filterPickupActTip(cityNow);
                          this.setData({
                              pickupActivitiesTip:tipStr
                          });
                        })
                        .catch(e=>{
                          wx.hideLoading();
                          console.log(e);
                        })
                      }
                    }
                  } });
                }
                else{
                  this.setData({
                    isAuthor : '0'
                  })
                  if(getApp().config.PICKUP_ACT_ENABLED){
                    getProvincesThroughIP().then(item=>{
                      wx.setStorageSync('dingwei', {'jingdu': item.location.lng, 'weidu': item.location.lat});
                      let cityNow = item.ad_info.city;
                      let tipStr = filterPickupActTip(cityNow);
                      this.setData({
                          pickupActivitiesTip:tipStr
                      });
                    })
                    .catch(e=>{
                      wx.hideLoading();
                      console.log(e);
                    })
                  }
                } 
              }
            });
          }
        });
      }
      else{

        this.getLocation()

      }
    } });
  },
  getLocation: function(){
    this.setData({
      isAuthor : '1'
    });
    getCurrLocation().then(res => {
      let location = {
        latitude: res.latitude ? res.latitude.toString() : '', // 维度
        longitude: res.longitude ? res.longitude.toString() : '',   // 经度
      };
      Object.assign(orderSaveParam, location);
      let param = Object.assign(curOptions, {
        eventName: '经纬度'
      },location);
      app._collectData2(param);
      getProvincesThroughCoordinate(res.longitude,res.latitude).then(item=>{
        // console.log(`转换结果:${JSON.stringify(item)}`)
        var address = this.data.address
        if (!address.userName){
          let locationAddress = {
            province : item.address_component.province,
            city : item.address_component.city,
            area : item.address_component.district,
            detailAddress : item.address_component.street_number,
            isLocation : true
          }
          Object.assign(address, locationAddress);
          this.setData({
            address
          })
        }
        if(getApp().config.PICKUP_ACT_ENABLED){
          wx.setStorageSync('dingwei', {'jingdu': item.location.lng, 'weidu': item.location.lat});
          let cityNow = item.ad_info.city;
          let tipStr = filterPickupActTip(cityNow);
          this.setData({
              pickupActivitiesTip:tipStr
          });
        }
      })


    })
  },
  // 省市区选择
  bindRegionChange: function (e) {
    let region = this.data.region;
    let customItem = this.data.customItem;
    cityArr = e.detail.value;
    let selected = true;
    cityArr.forEach((item, index) => {
      if(item === region[index] || item === customItem){
        wx.showToast({
          title: '请选择完整省市区',
          icon: 'none'
        });
        selected = false;
      }
    });
    if(selected){
      region = {
        list: cityArr,
        selected: true
      };
      this.setData({region})
    }
  },
  // 导购分享提交参数
  guideShare:function(){
    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    let {wxScene, share_by, share_by_shop} = shareFrom;
    let orderSaveShare = {
      shareBy: share_by || '',
      shareByShop: share_by_shop || '',
    };
    if(wxScene){
      wxScene += '';
      if(wxScene === '1007' || wxScene === '1008'){
        orderSaveParam.devFlag = `场景值：${wxScene}_${orderSaveParam.devFlag}`;
      }
    }
    let bigOrderAppendix = {targetUrl: wx.getStorageSync('targetUrl') || ''};
    const optionList = wx.getStorageSync('daogouLists');
    if(optionList && optionList.length){
      optionList.forEach(item => {
        bigOrderAppendix[item.key] = item.value;
      })
    }
    let guideId = wx.getStorageSync('shareFromDaogouID');
    if(guideId && orderSaveShare.shareByShop){
      orderSaveParam.channelCode = 'WEMALL';
      orderSaveParam.shareByTime = wx.getStorageSync('openShareTime') || Date.now();
      orderSaveParam.bigOrderAppendix = bigOrderAppendix;
      Object.assign(orderSaveParam, orderSaveShare)
    }
  },
  // 获取商品列表
  getGoodsList: function(){
    let orderGoods = wx.getStorageSync('dingdanCon');
    let wxData = this.data;
    let goodsPrice = 0, payPrice = 0, orderGoodsNum = 0;
    let {preSaleInfo, prePayPrice, ruleList} = wxData;
    goodsOrderList = [];
    let balanceDeposit = '',
	    balancePayment = 0,
	    bookActivityId = '',
	    originalTotalPrice = 0,
	    presellFlag = 0; // 1： 定金 2：尾款
    if(Array.isArray(orderGoods)){
      orderGoods.forEach(item => {
        const actualPrice = jiafa(item.size.prePrice, item.size.endPrice)
        item.goodsSku = item.goodsSku ||item.goodsColorCode;
        let skuParam = {
          sku: item.goodsSku,
          size: URL_CDN.IMGSIZE240400
        };
        // 购物车数据改变的判断
        item.nums = item.nums || item.goodsCount;
        item.allPrice = item.allPrice || item.price;
        // 拼接图片
        item.goodsImg = `${cdn}${skuToImg(skuParam)}`;
        // 计算折扣
	      isHaveDiscountGoods = item.discount !== 1;
        item.discount = chengfa(item.discount, 10);
        item.actualPrice = actualPrice;
        item.allActualPrice = chengfa(item.nums, actualPrice);
        goodsPrice = jiafa(goodsPrice, item.allPrice);
        payPrice = jiafa(payPrice, item.allPrice);
        orderGoodsNum = orderGoodsNum + item.nums;
        // 预售参数
	      originalTotalPrice = jiafa(originalTotalPrice, item.allPrice);
        preSaleInfo.step[0].payPrice = item.depPrice;
        preSaleInfo.step[1].payPrice = item.lastPrice;
        preSaleInfo.endTime = item.preInfo.oneStageEnd;
        preSaleInfo.activityEndTime = item.preInfo.twoStageEnd;
	      balancePayment = item.lastPrice;
	      bookActivityId = item.preInfo.id;
	      ruleList = JSON.parse(item.preInfo.ruleExplain);
        // 订单参数
        this.goodsOrderPushList(item)
      });
	    preSaleInfo.step.forEach((item, index) => {
		    if(item.active){
			    presellFlag = index + 1;
			    prePayPrice = item.payPrice;
		    }
	    });
      payPrice = toDecimal(prePayPrice);
      goodsPrice = toDecimal(goodsPrice);
      this.setData({orderGoods, goodsPrice, payPrice, orderGoodsNum, preSaleInfo, prePayPrice, ruleList});
      // 添加到提交订单参数
      let orderSavePrice = {
	      bookActivityId,
	      balancePayment, // 尾款剩余金额
	      presellDeadline: preSaleInfo.activityEndTime, // 预售结束时间
	      presellFlag,
        payPrice: prePayPrice,
        realSellPrice: prePayPrice,
        goodsTotalCount: orderGoodsNum,
        picUrl: orderGoods[0].color ? orderGoods[0].color.picurls[0] : orderGoods[0].gscolPicPath,
	      originalTotalPrice
      };
      // 合并提交订单参数
      Object.assign(orderSaveParam, orderSavePrice);
    }
  },
  // 添加订单参数商品列表
  goodsOrderPushList: function(item, isGift){
    let originalPrice = item.depPrice;
    let price = item.depPrice;
    if(wx.getStorageSync('giveType')){
      price = 0
    }
    let usingCoupon = this.data.usingCoupon;
    if(usingCoupon.promotion){
      if(usingCoupon.promotion.typeCode === addPriceType){
        price = usingCoupon.promotion.markupPrice;
      }
    }
    goodsOrderList.push({
      colorName: item.color ? item.color.colorAlias : item.colorName, //
      gcsSku: item.goodsSku,
      goodsName: item.goodsName, //
      goodsCount: item.nums || item.goodsCount, //
      goodsColorCode: item.color ? item.color.colorCode : item.goodsColorCode,
      gscolPicPath: item.color ? item.color.picurls[0] : item.gscolPicPath,
      originalPrice: chengfa(item.onePrice, item.nums),
      sizeName: item.size ? item.size.sizeAlias : item.sizeName,
      price: item.depPrice,
      isGift: isGift || "N"
    });
  },
  // 到店自提
  pickupStore: function(){
    wx.showLoading({'title': '加载中...'});
    checkLocation()
    .then(res=>{
        return res ? getCurrLocation():getProvincesThroughIP();
    })
    .then(locationRes=>{
      if(locationRes.longitude){
        latitude = locationRes.latitude;
        longitude = locationRes.longitude;//正式
      }else{
        latitude = locationRes.location.lat;
        longitude = locationRes.location.lng;//正式
      }
      wx.setStorageSync('dingwei', {'jingdu': longitude, 'weidu': latitude});
      let param = {
        coordinate: `${longitude},${latitude}`,
      };
      this.pickupStoreList(param);
    })
    .catch(e=>{
      wx.hideLoading();
      console.log(e);
    })
  },
  // 禁用支付按钮
  payBtnDis: function(){
    this.setData({disabled: true});
  },
  // 支付按钮正常
  payBtnDefault: function(){
    this.setData({disabled: false});
  },
  // 请求门店列表
  pickupStoreList: function(option){
    let orderGoods = this.data.orderGoods;
    let scStoreEntryInfos = [];
    orderGoods.forEach(item => {
      scStoreEntryInfos.push({
        productCode: item.goodsSku,
        quantity: item.nums
      });
    });
    let param = {scStoreEntryInfos};
    Object.assign(param, option);
    pickupStoreList(param).then(res => {
      wx.hideLoading();
      if(res.length > 0){
        let listRaw = res;
        let listNew =[];
        let nearbyShopCode = wx.getStorageSync(KEYSTORAGE.NEARBY_SHOP_CODE);
        listRaw.forEach(ele => {
          if (ele.storeCode === nearbyShopCode) {
            ele.isChoosenShop = true;
            listNew.unshift(ele);
          } else {
            ele.isChoosenShop = false;
            listNew.push(ele);
          }
        });
        this.setData({pickupList: listNew});
      }else{
        wx.showModal({
          title: '提示',
          content: '您定位的地区暂时没有可自提门店，您可自行选择其他区域或更换为邮寄发货，谢谢您的理解！',
          showCancel: false
        });
        this.setData({
          pickupStore: {},
          pickupList: [],
        });
      }
    }).catch(err => {
      wx.hideLoading();
    })
  },
  // 搜索门店
  searchShop: function(){
    let region = this.data.region;
    if(region.selected){
      let cityParam = {
        region: region.list[0],
        city: region.list[1],
        cityDistrict: region.list[2],
      };
      this.pickupStoreList(cityParam);
    }else{
      wx.showToast({
        title: '请选择完整省市区',
        icon: 'none'
      });
    }
  },
  openLocation: function(e){
    let curLatitude = e.currentTarget.dataset.latitude;
    let curLongitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude: Number(curLatitude),
      longitude: Number(curLongitude)
    });
  },
  // 提货人手机号
  inputPhone: function(e){
    let text = e.detail.value;
    if(text.length === 11){
      this.setData({pickupUserPhone: text});
      this.payBtnDefault()
    }else{
      this.payBtnDis();
    }
  },
  // 获取地址
  _getAddress: function () {
    let localAddress = wx.getStorageSync('dingdanAddress');
    if(localAddress && localAddress.phone){
      this.handleAddress(localAddress);
      return;
    }
    getAddress().then(res => {
      if(res.length){
        let addressObj = {}, num = 0;
        res.forEach(item => {
          item.defaultAddress === IS_GIFT ? addressObj = item : num++;
        });
        res.length === num ? addressObj = res[0] : '';
        this.handleAddress(addressObj)
      }
    })
  },
  handleAddress: function(addressObj){
    this.setData({address: addressObj});
    let addressOrder = {
      province: this.data.address.province,
      city: this.data.address.city,
      area: this.data.address.area,
      detailAddress: this.data.address.detailAddress,
      contactTel: this.data.address.phone,
      consignee: this.data.address.userName,
    };
    Object.assign(orderSaveParam, addressOrder);
  },
  // 切换配送方式
  changeShipping: function(e){
    let dataText = e.currentTarget.dataset.text;
    let shippingMethods = this.data.shippingMethods;
    // if(dataText === shippingMethods[1].text){
	  //   wxShowToast('暂不支持')
		// }
  },
  // 选择自提店铺
  selectStore: function(e){
    let dataIndex =e.currentTarget.dataset.index;
    let pickupList = this.data.pickupList;
    let region = this.data.region;
    let pickupStore = this.data.pickupStore;
    pickupStore = pickupList[dataIndex];
    region = {
      list: [pickupStore.region || regionProvince, pickupStore.city || regionCity, pickupStore.district || regionArea],
      selected: true
    };
    this.setData({pickupStore, region })
    // 选择自提门店后调用
    this.computerNewExpress('ZT',0);
  },
  // 获取优惠券列表
  _getVoucherList: function () {
    let user_info = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let phone = user_info.phone;
    if (!phone) {
      return;
    }
    let wxData = this.data;
    let cardNum = wxData.cardNum,
      payPrice = wxData.payPrice,
      voucherList = wxData.voucherList;
    const reqParam = {
    	phone,
	    type: 'time',
	    channelType: 'P', // 需要过滤的渠道，
	    returnListFlag: '0' // 0: 可用券 2: 全部券
    };
    getVoucher(reqParam).then(res => {
    	this.hideVoucherLoading();
      if(Array.isArray(res) && res.length){
        if(app.config.isSaleForce){
          let cardPromotion = this.data.cardPromotion;
          let couponJL = [], voucherJL = [];
          // 过滤未到使用时间的优惠券
	        voucherList = res.filter(item => (Date.now() >= new Date(item.startdate).getTime() && Date.now() <= new Date(item.enddate).getTime()));
          voucherList.forEach((item, index) => {
	          item.type = JLCouponType[item.type];
            // 优惠券
            if(item.type === JLCouponType.coupon){
              voucherJL.push(item)
            }else if(item.type === JLCouponType.active){
              // 暂无活动券测试
              if(cardPromotion.length){
                cardPromotion.forEach(promoteItem => {
                  if(item.promotioncode === promoteItem.couponNumber){
                    switch (promoteItem.typeCode) {
                      case reduceType:
                        item.newValue = `￥${Number(promoteItem.markupPrice)}`;
                        break;
                      case discountType:
                        item.newValue = `${chengfa(10, promoteItem.discount)}折`;
                        break;
                      case giveType:
                        item.newValue = '满即赠';
                        break;
                      case addPriceType:
                        item.newValue = '加价购';
                        break;
                    }
                    item.threshold = Number(item.threshold);
                    couponJL.push(item)
                  }
                })
              }
            }
          });
          let allVoucher = [...couponJL, ...voucherJL];
          cardNum += allVoucher.length;
          this.setData({cardNum, voucherList: allVoucher})
        }else{
	        res.forEach(item => {
		        // let voucherBrand = judgeETOBrand(item.brand);
		        if(app.config.VOUCHER_BRAND[brand] === item.brand){
			        if(item.channel.includes('H5') ||
				        item.channel.includes('miniapp') ||
				        item.channel.includes('官网') ||
				        item.channel.includes('通用') ||
				        item.channel.includes('General') ||
				        item.channel.includes('T')) {
				        app.config.isSaleForce ? item.type = JLCouponType[item.type] : '';
				        // 门槛校验
				        if(parseFloat(payPrice) >= parseFloat(item.threshold) || !(item.threshold)){
					        item.newStartTime = item.startdate ? `${formatCRMDate(item.startdate, '.')}${item.startdate.substr(10)}` : '2019.01.01';
					        item.newEndTime = formatCRMDate(item.enddate, '.') + item.enddate.substr(10);
					        item.endTime = formatCRMDate(item.enddate).replace(new RegExp('-', 'g'), '');
					        voucherList.push(item)
				        }
			        }
		        }
	        });
	        // 优惠券排序，先按照优惠价格，价格相同按照过期时间排序
	        voucherList.sort(compareArr('value', 'endTime'));
	        wx.setStorageSync('voucherList', voucherList);
          cardNum += voucherList.length;
          this.setData({cardNum, voucherList})
        }
      }
    }).catch(err => {
	    this.hideVoucherLoading();
    });

  },
  hideVoucherLoading: function(){
    this.setData({voucherLoading: false});
  },
  // 获取当前订单所需的活动券
  orderCouponList: function(){
    let phone = CRMInfo.phone;
    if (!phone) {
      this.hideVoucherLoading();
      return;
    }
    let orderGoods = this.data.orderGoods, param = [];
    orderGoods.forEach( item => {
      param.push({
        sku12: item.color ? item.color.colorCode : item.goodsColorCode,
        sku15: item.goodsSku,
        quantity: item.nums
      })
    });
    orderCouponList(phone, param).then(res => {
      let wxData = this.data;
      let couponList = wxData.couponList, cardNum = wxData.cardNum;
      if(Array.isArray(res) && res.length){
        res.forEach( item => {
          item.coupon.newStartTime = formatDate(item.promotion.startTime, true);
          item.coupon.newEndTime = formatDate(item.promotion.endTime, true);
          item.endTime = formatDate(item.promotion.endTime).replace(new RegExp('-', 'g'), '');
          item.value = item.promotion.markupPrice;
          item.promotion.newDiscount = chengfa(item.promotion.discount, 10);
          cardNum ++;
          couponList.push(item);
        });
        couponList.sort(compareArr('value', 'endTime'));
        wx.setStorageSync('couponList', couponList);
        this.setData({couponList, cardNum})
      }
    })
  },
  goIndex: function(){
    wx.switchTab({ url: '/pages/index/index'})
  },
  // 事件汇总
  onClick: function(e){
    let dataType = e.currentTarget.dataset.type;
    switch (dataType){
      case 'shipping':
        this.changeShipping(e);
        break;
      case 'goAddress':
        this.goAddress();
        break;
      case 'card':
        // 打开优惠（活动）券列表
        this.openCardDetail();
        break;
      case 'closeVoucher':
        this.closeCard();
        break;
      case 'useVoucher':
        this.userVoucher(e);
        break;
      case 'useVoucherJL':
        this.useVoucherJL(e);
        break;
      case 'promote':
        this.promote(e);
        break;
      case 'useCoupon':
        this.useCoupon(e);
        break;
      case 'search':
        this.searchShop();
        break;
      case 'map':
        this.openLocation(e);
        break;
      case 'selectStore':
        this.selectStore(e);
        break;
      case 'inputCoupon':
        this.showInput();
        break;
      case 'queryCoupon':
        this.queryCoupon();
        break;
      case 'cancel':
        // 取消不记名券
        this.cancelCoupon();
        break;
      case 'modify':
        this.modifyPromotion(e);
        break;
      case 'change':
        this.changePromotion(e);
        break;
      case 'showPhoneList':
        this.queryPhone();
        break;  
      case 'selectedPhone':
        this.selectedPhone(e);
        break;
      case 'sltInputPhone':
        this.sltInputPhone(e);
        break;
	    case 'notice':
	    	this.setData({isShowNotice: true});
	    	break
    }
  },
  // 改变促销活动
  changePromotion: function(e){
    let childIndex = e.currentTarget.dataset.index;
    let typeCode = e.currentTarget.dataset.code;
    let childList = this.data.childList;
    let childItem = childList[childIndex];
    let promotion = this.data.promotion;
    let popup = this.data.popup;
    let childTypeCode = childItem.typeCode;
    // 替换现有显示的促销活动
    let deleteArr = [], delIndex = 0;
    promotion.list.forEach((item, index) => {
      if(item.typeCode === childTypeCode){
        delIndex = index;
        deleteArr = promotion.list.splice(index, 1, childItem);
        childList.splice(childIndex, 1, JSON.parse(JSON.stringify(deleteArr[0])));
      }
    });
    promotion.list[delIndex].childList = JSON.parse(JSON.stringify(childList));
    popup.show = false;
    this.setData({promotion, popup, childList});
    this.promote(typeCode);
  },
  // 修改促销活动
  modifyPromotion: function(e){
    let dataId = e.currentTarget.dataset.id;
    let promotion = this.data.promotion;
    let popup = this.data.popup;
    this.closeNoCard();
    for(let item of promotion.list){
      if(item.id === dataId){
        modifyPromotionItem = item;
        if(item.childList && item.childList.length){
          this.setData({childList: item.childList})
        }
        popup = {
          show: true,
          bgColor: '#fef4f3'
        };
        this.setData({popup});
        break;
      }
    }
  },
  cancelCoupon: function(){
    let noNameCouponValue = this.data.noNameCouponValue;
    let payPrice = this.data.payPrice;
    let voucherPrice = this.data.voucherPrice;
    if(noNameCouponValue){
      payPrice = toDecimal(jiafa(payPrice, noNameCouponValue));
    }
    noNameCouponValue = voucherPrice = 0;
    this.setData({noNameCouponValue, voucherPrice, payPrice});
    // 删除订单信息当中的不记名参数
    delete orderSaveParam.numCoupon;
    delete orderSaveParam.ruleId;
  },
  // showInput
  showInput: function(){
    let usingCardVoucher = this.data.usingCardVoucher;
    let usingCoupon = this.data.usingCoupon;
    if(usingCardVoucher.voucherno || usingCoupon.promotion){
    	wxShowToast('您已使用优惠券，暂不可用');
      return;
    }
    if(orderSaveParam.ruleId){
    	wxShowToast('您已参加活动，暂不可用');
      return;
    }
    this.closePromotion();
    let inputStatus = this.data.inputStatus;
    let popup = this.data.popup;
    inputStatus = true;
    if(inputStatus){
      popup = {
        show: true,
        bgColor: '#fff'
      };
      this.setData({couponNum: ''})
    }
    this.setData({inputStatus, popup})
  },
  inputNum: function(e){
    this.setData({couponNum: e.detail.value})
  },
  // 查询券号
  queryCoupon: function(){
    let couponNum = this.data.couponNum;
    if(!couponNum){
    	wxShowToast('请填写券号');
      return;
    }
    let orderGoods = this.data.orderGoods, skuArr = [];
    orderGoods.forEach( item => {
      skuArr.push({
        sku12: item.color ? item.color.colorCode : item.goodsColorCode,
        sku15: item.goodsSku,
        quantity: item.nums
      })
    });
    /*N12SQF038660YYT 无门槛减1元
N12SQGIGS8B258A 满1000减1元*/
    let orderAmount = this.data.payPrice;
    let t1 = setTimeout(()=>{
      wx.showLoading({title: '加载中...'});
    },800);
    queryNumCoupon(couponNum, skuArr, orderAmount).then(res => {
      if(Array.isArray(res) && res.length){
        for(let item of res){
          let markupPrice = item.markupPrice;
          let noNameCouponDesc = item.description;
          if(markupPrice){
            let payPrice = this.data.payPrice;
            payPrice = jianfa(payPrice, markupPrice);
            // 判断是否是自提订单
            if(zitiReduction < 0){
              payPrice = jiafa(payPrice,zitiReduction);
            }
            payPrice = toDecimal(payPrice);
            this.setData({
              noNameCouponValue: markupPrice,
              noNameCouponDesc,
              voucherPrice: markupPrice,
              inputStatus: false,
              payPrice
            });
            Object.assign(orderSaveParam,{
              numCoupon: couponNum,
              ruleId: item.id
            });
            break;
          }
        }
      }else {
        wx.showToast({
          title: '订单金额或购买商品不符合使用条件!',
          icon: 'none'
        })
      }
      clearTimeout(t1);
      wx.hideLoading();
    }).catch(err => {
      clearTimeout(t1);
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: err.message,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  // 使用活动券
  useCoupon: function(e){
    let couponNum = e.currentTarget.dataset.number;
    let wxData = this.data;
    let couponList = wxData.couponList,
      usingCoupon = wxData.usingCoupon,
      selectText = wxData.selectText,
      voucherPrice = wxData.voucherPrice,
      payPrice = wxData.payPrice,
      orderGoodsNum = wxData.orderGoodsNum,
      orderGoods = wxData.orderGoods;
    orderGoods.forEach( (item, index) => {
      if(item.isGift === IS_GIFT){
        orderGoods.splice(index, 1);
        orderGoodsNum--;
        wxShowToast('两档活动不能叠加使用');
      }
    });
    goodsOrderList.forEach( (item, index) => item.isGift === IS_GIFT ? goodsOrderList.splice(index, 1) : '');
    if(voucherPrice){
      payPrice = jiafa(payPrice, voucherPrice);
      voucherPrice = 0;
    }
    payPrice = toDecimal(payPrice);
    voucherPrice = toDecimal(voucherPrice);
    this.setData({payPrice, orderGoods, orderGoodsNum, voucherPrice});
    let orderParam = {
      payPrice:payPrice,
      realSellPrice: payPrice,
      goodsTotalCount: orderGoodsNum,
    };
    Object.assign(orderSaveParam,orderParam);
    couponList.forEach(item => {
      if(item.coupon.couponno === couponNum){
        item.coupon.selected = true;
        usingCoupon = item;
        switch (item.promotion.typeCode) {
          case reduceType:
            selectText = `已使用满${item.promotion.priceRule}减${item.promotion.markupPrice}券`;
            this.promoteReduce(usingCoupon.promotion);
            break;
          case discountType:
            selectText = `已使用${chengfa(item.promotion.discount, 10)}折券`;
            this.promoteDiscount(usingCoupon.promotion);
            break;
          case addPriceType:
            selectText = `已使用加价购活动券`;
            this.goPromote(item.promotion);
            break;
          case giveType:
            selectText = `已使用满即赠活动券`;
            const _this = this;
            wx.setStorage({
              key: 'giveType',
              data: true,
              success(){
                _this.goPromote(item.promotion);
              }
            });
            break;
        }
      }else{
        item.coupon.selected = false;
      }
    });
    this.setData({usingCoupon, couponList, selectText});
    this.closeCard();
    orderParam = {
      ticketNo: couponNum,
      phone: CRMInfo.phone || ''
    };
    Object.assign(orderSaveParam,orderParam);
  },
  handleActive(item, selectText){
    switch (item.typeCode) {
      case reduceType:
        selectText = `已使用满${item.priceRule}减${item.markupPrice}券`;
        this.promoteReduce(item);
        break;
      case discountType:
        selectText = `已使用${chengfa(item.discount, 10)}折券`;
        this.promoteDiscount(item);
        break;
      case addPriceType:
        selectText = `已使用加价购活动券`;
        this.goPromote(item);
        break;
      case giveType:
        selectText = `已使用满即赠活动券`;
        const _this = this;
        wx.setStorage({
          key: 'giveType',
          data: true,
          success(){
            _this.goPromote(item);
          }
        });
        break;
    }
    let promotion = this.data.promotion;
    promotion.list.forEach(item => item.active = false);
    this.setData({selectText, promotion})
  },
  // JL 使用活动券
  useVoucherJL: function(e){
    let couponNum = e.currentTarget.dataset.number;
    let wxData = this.data;
    let voucherList = wxData.voucherList,
      usingCoupon = wxData.usingCoupon,
      selectText = wxData.selectText;
    voucherList.forEach(item => {
      item.voucherno === couponNum ? usingCoupon = item : '';
      if(item.voucherno === couponNum){
        usingCoupon = item;
        item.selected = true;
      }
    });
    let cardPromotion = this.data.cardPromotion;
    let promotionItem = {};
    cardPromotion.forEach(item => item.couponNumber === usingCoupon.promotioncode ? promotionItem = item : '');
    this.handleActive(promotionItem, selectText);
    this.closeCard();
    this.setData({usingCoupon, voucherList});
    let orderParam = {
      ticketNo: couponNum,
      phone: CRMInfo.phone || ''
    };
    Object.assign(orderSaveParam,orderParam);
  },
  // 展示优惠券
  openCardDetail: function(){
    let cardNum = this.data.cardNum;
    let noNameCouponValue = this.data.noNameCouponValue;
    if(noNameCouponValue){
    	wxShowToast('你已使用不记名券，优惠券暂不可用');
      return;
    }
    if(!discountGoodsUseVoucher){
      if(isHaveDiscountGoods){
      	wxShowToast('该订单有折扣商品不能使用优惠券');
        return
      }
    }
    if(cardNum === 0){
    	wxShowToast('暂无优惠券可用');
    }else{
      this.setData({cardShow: true});
      try {
        app.tdSdkEvent('flow_purchase_order_coupon', {});
      }catch (e) {}
    }

  },
  // 使用优惠券
  userVoucher: function(e){
    let wxData = this.data;
    let voucherNum = e.currentTarget.dataset.number;
    let voucherList = wxData.voucherList,
      payPrice = wxData.payPrice,
      voucherPrice = wxData.voucherPrice,
      usingCardVoucher = wxData.usingCardVoucher,
      usingCoupon = wxData.usingCoupon;
    let selectText = '';
    voucherList.forEach(item => {
      if(voucherNum === item.voucherno){
        if(item.threshold){
          if (parseFloat(payPrice) < parseFloat(item.threshold)) {
          	wxShowToast('不满足使用条件');
            return;
          }
        }
        // 是否已经使用优惠券，已使用优惠券则清除优惠价
        if(usingCardVoucher.voucherno){
          payPrice = jiafa(payPrice, usingCardVoucher.value);
          voucherPrice = jianfa(voucherPrice, usingCardVoucher.value);
        }
        // 已经使用活动券
        if(usingCoupon.coupon && usingCoupon.coupon.selected){
          payPrice = jiafa(payPrice, voucherPrice);
          voucherPrice = 0
        }
        item.selected = true;
        usingCardVoucher = item;
        payPrice = jianfa(payPrice, item.value);
        voucherPrice = jiafa(voucherPrice, item.value);
        selectText = `已使用${item.value}元优惠券`;
        payPrice = toDecimal(payPrice);
        voucherPrice = toDecimal(voucherPrice);
        this.setData({payPrice, voucherPrice, selectText});
        this.closeCard();
        let orderParam = {
          couponNo: voucherNum,
          couponValue: parseFloat(item.value),
          couponType: '现金券',
          couponName: item.channel,
          phone: CRMInfo.phone,
          payPrice: payPrice,
          realSellPrice: payPrice
        };
        Object.assign(orderSaveParam, orderParam);
      }else{
        item.selected = false;
      }
    });
    this.setData({ voucherList, usingCardVoucher })
  },
  // 关闭优惠券
  closeCard: function(){
    this.setData({cardShow: false});
  },
  // 过滤地址中的特殊字符
  filterStr: function(str) {
    let filterString = "";
    if (str) {
      filterString = filterStr(str);
    } else {
      wx.showModal({
        title: '提示',
        content: '您的收货地址不存在详细地址，请添加后再次提交订单！',
        showCancel: false
      });
      wx.hideLoading();
      return false;
    }
    if (!REGEXP.STRREG2.test(filterString)) {
      wx.showModal({
        title: '提示',
        content: '您的收货地址中存在特殊字符，请修改地址后，再次提交订单！',
        showCancel: false
      });
      wx.hideLoading();
      return false;
    } else {
      return true;
    }
  },
	// 同意预售
	agreeSale(e){
  	let {preSaleInfo} = this.data;
  	preSaleInfo.isAgree = e.detail.value;
  	this.setData(preSaleInfo);
	},
  // 提交订单
	orderSubmit: function(e){
    // 企业微信
    if (wx.getStorageSync('isWXWork')) {
      return;
    }

    wx.setStorageSync(KEYSTORAGE.NEARBY_SHOP_CODE, "");
    let wxData = this.data;
    let {address, payPrice, expressFare, preSaleInfo } = wxData;
		if(!preSaleInfo.isAgree){
			wxShowToast('请同意协议');
			return;
		}
    // 自提订单
    if(orderSaveParam.deliveryMode === DELIVERY_MODE){
      let pickupStore = wxData.pickupStore;
      let regionList = wxData.region.list;
      let pickupUserPhone = wxData.pickupUserPhone;
      let pickupParam = {
        bigOrderStore: {
          address: pickupStore.address,
          businessHours: pickupStore.businessHours,
          city: pickupStore.city,
          distance: pickupStore.distance,
          district: pickupStore.district,
          latitude: pickupStore.latitude,
          longitude: pickupStore.longitude,
          minInv: pickupStore.minInv,
          name: pickupStore.name,
          phone1: pickupStore.phone1,
          region: pickupStore.region,
          storeCode: pickupStore.storeCode,
        },
        province: regionList[0],
        city: regionList[1],
        area: regionList[2],
        detailAddress: pickupStore.address,
        consignee: pickupStore.name,
        deliveryStore: pickupStore.storeCode,
        contactTel: pickupUserPhone
      };
      if(pickupParam.province === regionProvince || pickupParam.city === regionCity || pickupParam.area === regionArea){
      	wxShowToast('请选择完整省市区');
        return
      }
      Object.assign(orderSaveParam, pickupParam);
    }else {
      let param = {
        payPrice,
        expressFare,
        realSellPrice: jianfa(payPrice, expressFare), // 不包含运费
        province: address.province,
        city: address.city,
        area: address.area,
        detailAddress: address.detailAddress,
        consignee: address.userName,
        contactTel: address.phone
      };
      if(parseFloat(param.realSellPrice) === 0){
        param.realSellPrice = param.payPrice;
      }
      Object.assign(orderSaveParam, param);
      if(orderSaveParam.deliveryStore){
        delete orderSaveParam.deliveryStore;
        delete orderSaveParam.bigOrderStore;
      }
    }
    Object.assign(orderSaveParam.goodsOrderList, goodsOrderList);
    // 校验unionID
    if(orderSaveParam.unionid){
      const isMember = wx.getStorageSync(KEYSTORAGE.isMember);
      if(app.config.singleBrand){
        // 单品牌校验会员
        if(isMember){
          if(CRMInfo.phone){
            orderSaveParam.phone = CRMInfo.phone
          }else{
            app.getCRMInfoFn();
            return;
          }
        }else{
          app.isMember();
          return;
        }
      }
    }else{
      wx.clearStorage();
      wx.removeStorageSync(KEYSTORAGE.authed);
      wx.removeStorageSync(KEYSTORAGE.unionid);
      wx.removeStorageSync(KEYSTORAGE.loginInfo);
      wx.removeStorageSync(KEYSTORAGE.crmInfo);
      app.goSetting();
      return;
    }
    
    // 校验手机号
    if(!orderSaveParam.phone){
      orderSaveParam.phone = wx.getStorageSync(KEYSTORAGE.crmInfo).phone
    }
    // 地址校验
    if(!orderSaveParam.detailAddress || !orderSaveParam.consignee){
	    wxShowToast('请填写收货人信息');
      return
    }
    // 手机号校验
    if(!(REGEXP.PHONEREG.test(orderSaveParam.contactTel))){
    	wxShowToast('请填写正确的11位手机号');
      return;
    }
    wx.showLoading({
      title: '提交中',
      mask: true,
    });
		newOrderSave(orderSaveParam).then( res => {
      wx.hideLoading();
      if(res){
        let queryString = {
          amountPaid: res.payPrice,
          bigorderCode : res.bigorderCode,
          orderType: 'preSale'
        };
        this.collectDate('点击提交订单', 'summit');
        const {payPrice} = res;
        if(payPrice <= 0){
          const param = {
            orderToken: res.orderToken,
            bigorderCode: res.bigorderCode,
            id: res.bigOrderId
          };
          this.goWXPayCon(param);
        }else{
          this.orderPayment(res);
        }
      }
    }).catch( e => {
      wx.hideLoading();
      wxShowToast(e.message);
    });
    try {
      let COUPON_CODE = '';
      if(orderSaveParam.ticketNo){
        COUPON_CODE = orderSaveParam.ticketNo;
      }else if(orderSaveParam.couponNo){
        COUPON_CODE = orderSaveParam.couponNo
      }
      app.tdSdkEvent('flow_purchase_order_summit_2', { COUPON_CODE })
    }catch (e) {}
    // 发送模板消息
    // this.sendTmpInfo(formId,'','');

  },
  orderPayment(orderRes){
    const {orderToken, bigorderCode, bigOrderId, payPrice} = orderRes;
    const param = {orderToken, bigorderCode, id: bigOrderId};
    try {
      app.tdSdkEvent('flow_purchase_order_paynow_4', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      })
    }catch (e) {}
    wxRequestPayment(orderRes).then(res => {
      console.log(res,'**payment');
      if(res){
        this.goWXPayCon(param);
      }
    }).catch(err => wxShowToast(err.message));
  },

  //
  goWXPayCon(param){
    const queryString = objToQuery(param);
    wx.navigateTo({
      url: '../wxPayCon/wxPayCon' + queryString
    })
  },
  // 查询促销规则列表
  getRuleListBySku: function(){
    let wxData = this.data;
    let orderGoods = wxData.orderGoods, param = [], promotion = wxData.promotion;
    orderGoods.forEach( item => {
      param.push({
        sku: item.color ? item.color.colorCode : item.goodsColorCode,
        quantity: item.nums
      })
    });
    ruleListBySku(param).then( res => {
      if(Array.isArray(res) && res.length > 0){
        let noCardPromotion = [], cardPromotion = [];
        if(app.config.isSaleForce){
          // JL用券活动
          cardPromotion = res.filter(item => item.validbyCoupon === IS_GIFT);
          noCardPromotion = res.filter(item => item.validbyCoupon !== IS_GIFT);
        }else{
          // 过滤不需要用券的
          console.log(res,'noCardPromotion*****')
          noCardPromotion = res.filter(item => item.validbyCoupon !== IS_GIFT);
        }
        // 加价购 (1000)，满折 (1003)，满减(1002)，满即赠(1001)
        let addPriceItem = {}, discountItem = {}, reduceItem = {}, giveItem = {};
        let addPriceArr = [], discountArr = [], reduceArr = [], giveArr = [];
        // priceRule  取优惠最大，
        noCardPromotion.forEach( item => {
          switch (item.typeCode){
            case addPriceType:
              addPriceArr.push(item);
              break;
            case giveType:
              giveArr.push(item);
              break;
            case reduceType:
              reduceArr.push(item);
              break;
            case discountType:
              discountArr.push(item);
              break;
          }
        });
        if(discountArr.length){
          this.promotionSort(discountArr, promotion);
        }
        if(reduceArr.length){
          this.promotionSort(reduceArr, promotion);
        }
        if(addPriceArr.length){
          this.promotionSort(addPriceArr, promotion);
        }
        if(giveArr.length){
          this.promotionSort(giveArr, promotion);
        }
        this.setData({promotion, cardPromotion})
      }
    }).then(res => {
      // this.orderCouponList();
      if(app.config.isSaleForce){
        this._getVoucherList()
      }
    })
  },
  // 促销活动整理排序
  promotionSort: function(arr,promotion){
    let shopActivity = []; // 商场活动
    arr.forEach((item, index) => item.type !== '公司活动' ? shopActivity.push(...arr.splice(index, 1)) : '');
    let curItem = this.getArrayMaxItem(arr, maxPriceRule);
    const filterItem = arr.filter(item => item.id !== curItem.id);
    if(curItem.id) {
      curItem.childList = filterItem.concat(shopActivity);
    }else{
      if(shopActivity.length){
        curItem = shopActivity.shift();
        if(shopActivity.length){
          curItem.childList = filterItem.concat(shopActivity);
        }
      }
    }
    promotion.list.push(curItem)
  },
  /*
  * 发送模板消息
  * formId
  * orderParam: 提交订单参数
  * orderRes: 提交订单返回的信息
  * */
  sendTmpInfo: function(formId, orderParam, orderRes){
    let page = 'pages/dingdanToPay/dingdanToPay';
    const pageParam = {
      bigOrderId: orderRes.bigOrderId,
      orderToken: orderRes.orderToken
    };
    page = `${page}${objToQuery(pageParam)}`;
    const param = {
      brand: app.config.brand,
      openId: wx.getStorageSync(KEYSTORAGE.openid),
      templateId: "orderSave",
      form_id: formId,
      page,
      data: {
        price: orderRes.order.amountPaid,
        bigOrderCode: orderRes.bigOrderCode,
        createOrderTime: orderRes.order.orderDate,
        tip: "亲，您已下单成功，请尽快完成支付。",
        detailAddress: `${orderParam.province}${orderParam.city}${orderParam.area}${orderParam.detailAddress}`,
        consignee: orderParam.consignee,
      }
    };
    sendTmpInfo(param).then(res => {})
  },

  // 促销活动
  promote: function(e){
    let typeCode = e.currentTarget ? e.currentTarget.dataset.code : e;
    let wxData = this.data;
    let orderGoods = wxData.orderGoods;
    // goodsOrderList = [];
    let usingCoupon = wxData.usingCoupon;
    if(usingCoupon.coupon && usingCoupon.coupon.couponno){
      this.getGoodsList();
      if(orderSaveParam.ticketNo){
        delete orderSaveParam.ticketNo
      }
    }
    let promotion = wxData.promotion,
      voucherPrice = wxData.voucherPrice,
      payPrice = wxData.payPrice,
      goodsPrice = wxData.goodsPrice,
      promoteItem = {},
      usingCardVoucher = wxData.usingCardVoucher,
      couponList = wxData.couponList,
      voucherList = wxData.voucherList,
      orderGoodsNum = wxData.orderGoodsNum,
      expressFare = wxData.expressFare,
      cardNum = voucherList.length;
    let selectText = '请选择';
    promotion.list.forEach( item => {
      if(item.typeCode === typeCode){
        promoteItem = item;
        isUsePromotion = true;
        item.active = !item.active
      }else{
        item.active = false;
      }
    });
    // 是否有选中促销
    let isActive = false;
    for(let item of promotion.list){
      if(item.active){
        isActive = true;
        break;
      }
    }
    // 已经使用促销活动
    if(isUsePromotion){
      goodsOrderList.forEach((item, index) => {
        if(item.isGift === IS_GIFT){
          goodsOrderList.splice(index, 1);
          orderGoodsNum--;
        }
      });
      orderGoods = orderGoods.filter(item => item.isGift !== IS_GIFT);
      // 促销规则
      const loCalPromoteItem = wx.getStorageSync('promoteItem');
      if(loCalPromoteItem && loCalPromoteItem.markupPrice){
        goodsPrice = jianfa(goodsPrice, loCalPromoteItem.markupPrice);
        wx.removeStorageSync('promoteItem');
      }
      if(voucherPrice > 0){
        payPrice = jiafa(payPrice, voucherPrice);
        voucherPrice = 0;
      }
      voucherList = wx.getStorageSync('voucherList') || [];
      couponList = wx.getStorageSync('couponList') || [];
      cardNum = [...voucherList, ...couponList].length;
      payPrice = toDecimal(payPrice);
      goodsPrice = toDecimal(goodsPrice);
      this.setData({promotion, orderGoods, payPrice, voucherList, couponList, voucherPrice, orderGoodsNum, goodsPrice, cardNum});
      orderSaveParam.goodsTotalCount = orderGoodsNum;
      delete orderSaveParam.ruleId;
      if(!isActive){
        return;
      }
    }
    payPrice = parseFloat(expressFare) > 0 ? jiafa(goodsPrice, expressFare) : goodsPrice;

    voucherPrice = 0;
    // 优惠券订单所需参数
    const voucherOrderParamArr = ['couponNo', 'couponValue', 'couponType', 'couponName'];
    voucherOrderParamArr.forEach(item => delete orderSaveParam[item]);
    // 清空正在使用的优惠券
    usingCardVoucher = {};
    usingCoupon = {};
    couponList = [];
    payPrice = toDecimal(payPrice);
    voucherPrice = toDecimal(voucherPrice);
    this.setData({promotion, payPrice, voucherPrice, usingCardVoucher, couponList, cardNum, usingCoupon, selectText});
    switch (typeCode){
      case reduceType:
        this.promoteReduce(promoteItem);
        break;
      case discountType:
        this.promoteDiscount(promoteItem);
        break;
      case addPriceType:
        this.goPromote(promoteItem);
        break;
      case giveType:
        wx.setStorageSync('giveType', true);
        this.goPromote(promoteItem);
        break;
    }
    // 过滤不满足的优惠券
    let newVoucher = voucherList.filter(item => {
      if(!item.threshold){
        item.threshold = 0;
      }
      return this.data.payPrice >= item.threshold
    });
    this.setData({
      voucherList: newVoucher,
      cardNum: newVoucher.length
    });
  },
  // 满减
  promoteReduce: function(promoteItem){
    let markupPrice = promoteItem.markupPrice;
    let wxData = this.data;
    let payPrice = wxData.payPrice, voucherPrice = wxData.voucherPrice;
    // 是否已经使用活动券
    if(voucherPrice > 0 && (orderSaveParam.couponNo || orderSaveParam.ruleId)){
      payPrice = jiafa(payPrice, voucherPrice);
      voucherPrice = 0;
    }
    payPrice = jianfa(payPrice, markupPrice);
    voucherPrice = jiafa(voucherPrice, markupPrice);
    // 判断是否是自提订单
    if(voucherPrice === 0 && zitiReduction < 0){
      payPrice = jiafa(payPrice,zitiReduction);
    }
    payPrice = toDecimal(payPrice);
    voucherPrice = toDecimal(voucherPrice);
    this.setData({payPrice, voucherPrice});
    // 合并保存订单参数
    let orderParam = {
      payPrice: payPrice,
      realSellPrice: payPrice,
      ruleId: promoteItem.id,
    };
    Object.assign(orderSaveParam, orderParam);
  },
  // 满折
  promoteDiscount: function(promoteItem){
    let wxData = this.data;
    let orderGoods = wxData.orderGoods,
      voucherPrice = wxData.voucherPrice,
      payPrice =wxData.payPrice;
    // 是否已经使用活动券
    if(voucherPrice > 0 && (orderSaveParam.couponNo || orderSaveParam.ruleId)){
      payPrice = jiafa(payPrice, voucherPrice);
      voucherPrice = 0;
    }
    // 促销商品
    let discountGoods = [];
    orderGoods.forEach(item => {
      promoteItem.prgList.forEach(promItem => {
        if(item.goodsSku.includes(promItem.sku)){
          discountGoods.push(item)
        }
      })
    });
    discountGoods.forEach(item => {
      // 打折之后价格
      let discountPrice = chengfa(item.allPrice, promoteItem.discount);
      let curDiscountPrice = jianfa(item.allPrice, discountPrice);
      payPrice = jianfa(payPrice, curDiscountPrice);
      voucherPrice = jiafa(voucherPrice, curDiscountPrice);
    });

    // // 判断是否是自提订单
    if(zitiReduction < 0){
      payPrice = jiafa(payPrice,zitiReduction);
    }
    payPrice = toDecimal(payPrice);
    voucherPrice = toDecimal(voucherPrice);
    this.setData({payPrice, voucherPrice});
    let orderParam = {
      payPrice,
      ruleId: promoteItem.id
    };
    Object.assign(orderSaveParam, orderParam);
  },
  // 去促销列表
  goPromote:function(promoteItem){
    wx.setStorageSync('promoteItem', promoteItem);
    let orderGoods = this.data.orderGoods;
    // 删除加价购商品
    if(goodsOrderList.length){
      goodsOrderList.forEach((item, index) => {
        item.isGift === IS_GIFT ? goodsOrderList.splice(index, 1) : '';
      })
    }
    // 删除加价购商品
    orderGoods.forEach((item, index) => {
      item.isGift === IS_GIFT ? orderGoods.splice(index, 1) : '';
    });
    wx.removeStorageSync('isJiajiagou');
    promoteItem.typeCode === addPriceType ? wx.removeStorageSync('giveType') : ''; // 加价购删除
    wx.navigateTo({ url: `/pages/cuxiao/cuxiao?ruleId=${promoteItem.id}`});
  },
  // 加价购
  promoteAddPrice: function(){
    /*判断是否有参活商品，有的话不在添加*/
    let orderListHasGift = false;
    let wxData = this.data;
    if(goodsOrderList.length){
      goodsOrderList.forEach(item => {
        item.isGift === IS_GIFT ? orderListHasGift = true : '';
      })
    }
    if(orderListHasGift){
      return;
    }
    // 参活商品
    let promoteAddPriceItem = wx.getStorageSync('isJiajiagou');
    if(!promoteAddPriceItem){
      let promotion = wxData.promotion;
      if(promotion.list.length){
        promotion.list.forEach(item => item.active = false);
        this.setData({promotion})
      }
      return;
    }
    // 促销规则
    const promoteItem = wx.getStorageSync('promoteItem');

    let payPrice = wxData.payPrice,
      voucherPrice = wxData.voucherPrice,
      orderGoods = wxData.orderGoods,
      orderGoodsNum = wxData.orderGoodsNum,
      goodsPrice = wxData.goodsPrice;
    if(promoteAddPriceItem.goodsSku){
      let skuParam = {
        sku: promoteAddPriceItem.goodsSku,
        size: URL_CDN.IMGSIZE240400
      };
      // 拼接图片
      promoteAddPriceItem.goodsImg = `${cdn}${skuToImg(skuParam)}`;
      promoteAddPriceItem.discount = chengfa(promoteAddPriceItem.discount, 10);
      promoteAddPriceItem.allPrice = promoteItem.markupPrice;
      // 加价购的商品添加到订单商品中
      orderGoods.push(promoteAddPriceItem);

      payPrice = jiafa(payPrice, promoteItem.markupPrice);
      // 判断是否是自提订单
      if(zitiReduction < 0){
        payPrice = jiafa(payPrice,zitiReduction);
      }
      orderGoodsNum = orderGoodsNum + promoteAddPriceItem.nums;
      // voucherPrice = jianfa(promoteAddPriceItem.allPrice, promoteItem.markupPrice);
      goodsPrice = jiafa(goodsPrice, promoteItem.markupPrice);
      payPrice = toDecimal(payPrice);
      voucherPrice = toDecimal(voucherPrice);
      goodsPrice = toDecimal(goodsPrice);
      this.setData({orderGoods, payPrice, orderGoodsNum, voucherPrice, goodsPrice});

      this.goodsOrderPushList(promoteAddPriceItem, IS_GIFT);
      let orderParam = {
        payPrice:payPrice,
        realSellPrice: payPrice,
        goodsTotalCount: orderGoodsNum,
        ruleId: promoteItem.id
      };
      Object.assign(orderSaveParam, orderParam)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 取数组中最大的一项
  getArrayMaxItem: function (arr, key) {
    let maxItem = {};
    let maxValue = Math.max.apply(Math, arr.map(item => item[key]));
    arr.forEach(item => item[key] === maxValue ? maxItem = item : '');
    return maxItem;
  },
  goAddress: function(){

    wx.setStorageSync('isAuthor',this.data.isAuthor)
    try {
      app.tdSdkEvent('flow_purchase_order_address', {});
    }catch (e) {}
    wx.navigateTo({
      url: '/pages/address/address?dingdan=200'
    });
  },

 // 新的计算邮费
 computerNewExpress: function(epressType, postType){
  let expressParam = {
    expressMark: epressType,
    purchaseType: 0,
    sendingMode: postType,
    numberCourieres: this.data.orderGoodsNum
  };
  getNewExpressFare(expressParam).then( res => {
    let payPrice = this.data.payPrice;
    let expressFare;
    if(res){
      expressFare = res.price ? res.price : 0;
    } else {
      expressFare = 0;
    }
    let isPost = true;
    postType ? isPost = true : isPost = false
    if(postType === 1 && zitiReduction < 0){
      payPrice = jianfa(payPrice, zitiReduction);
    }

    zitiReduction = expressFare;
    expressPrice = expressFare;
    payPrice = toDecimal(jiafa(payPrice, expressFare));
    this.setData({payPrice, expressFare, isPost});
    let orderParam = {
      payPrice:payPrice,
      realSellPrice: payPrice,
    };
    Object.assign(orderSaveParam, orderParam)
  });
},
  
  queryPhone: function(){
    let phoneArray = this.data.phoneArray;
    let array = [];
    let popup = this.data.popup;
    popup.show = true;
    if(phoneArray.length > 0){
      array = phoneArray;
      this.setData({
        popup,
        isShowPhone : true,
        phoneArray: array,
      })
    } else {
      getAddress().then(res => {
        if(res.length){
          res.forEach(item => {
            array.push({phone: item.phone});
          });
          this.setData({
            popup,
            isShowPhone : true,
            phoneArray: array,
          })
        }
      })
    }
  },

  selectedPhone: function(e){
    let index = e.currentTarget.dataset.index;
    let sltPhone = this.data.phoneArray[index].phone;
    let popup = this.data.popup;
    popup.show = false;  
    this.setData({
      selectedPhone: sltPhone,
      pickupUserPhone: sltPhone,
      isSlected: true,
      popup,
    })
    this.payBtnDefault();
  },

  sltInputPhone: function(e){
    this.payBtnDis();
    let popup = this.data.popup;
    popup.show = false;  
    this.setData({
      pickupUserPhone: '',
      popup,
      isSlected: false,
    })
  },

  closePopup: function(e){
    let popup = this.data.popup;
    popup.show = e.detail;
    this.setData({
      popup,
      isShowPhone: false
    });
  },
  // 关闭促销弹窗组件
  closePromotion: function(){
    this.setData({childList: []});
  },
  // 关闭不记名券组件
  closeNoCard: function(){
    this.setData({inputStatus: false});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取地址信息每次进来请求
    this._getAddress();
    // 加价购
    this.promoteAddPrice();
    // if(this.data.shippingMethods[1].selected){
    //     this.pickupStore();
    // };
    // 微信数据上报
    app._browsePage(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 微信数据上报
    app._leavePage(this);
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
    wx.stopPullDownRefresh();
    wx.redirectTo({ url: '/pages/orderSave/orderSave'})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 微信数据上报
    app.WXReport('page_reach_bottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //两个定位合并，没错误的话删除该注释方法
  // getLocationInfo:function(){
  //   console.log("PICKUP_ACT_ENABLED >>>>>>>>>>>>>>>>>  == "+getApp().config.PICKUP_ACT_ENABLED);
  //   if(!getApp().config.PICKUP_ACT_ENABLED){
  //     return
  //   }
  //   checkAndGetProvincesInfo()
  //   .then(r => {
  //     latitude = r.location.lat;
  //     longitude = r.location.lng;//正式
  //     wx.setStorageSync('dingwei', {'jingdu': longitude, 'weidu': latitude});
  //     let cityNow = r.ad_info.city;
  //     let tipStr = filterPickupActTip(cityNow);
  //     this.setData({
  //         pickupActivitiesTip:tipStr
  //     });
  //   })
  //   .catch(e=>{
  //     wx.hideLoading();
  //     console.log(e);
  //   })
  // }
})