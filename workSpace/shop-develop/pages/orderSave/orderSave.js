import {skuToImg ,chengfa, jiafa, jianfa, chuFa, toDecimal, formatCRMDate, objToQuery, filterStr, filterPickupActTip, splitImg, compareArr, formatDate} from '../../utils/utils'
import { wxShowToast} from '../../utils/wxMethods'
import {URL_CDN, KEYSTORAGE, REGEXP, EVENTS} from "../../src/const";
import { getAddress} from '../../service/member'
import { ruleListBySku, orderGift } from '../../service/promotion'
import { getVoucher } from "../../service/voucher";
import {newOrderSave, getNewExpressFare} from "../../service/order";
import {checkLocation,getCurrLocation,getProvincesThroughIP, getProvincesThroughCoordinate } from "../../service/location";
import {pickupStoreList} from "../../service/pickup";
import { queryNumCoupon} from "../../service/coupon";
import { getDAInfo } from "../../service/guide";
import {  wxRequestPayment, storedValueCard } from "../../service/pay";
import { wxSubscription } from '../../utils/wxSubscribe';
import events from '../../src/events';
import {distributorInfoByFxId} from "../../service/index";
const app = getApp();
const {brand, cdn, discountGoodsUseVoucher, isStoreOption, showNoNameCoupon, IS_PICKUP,channel, gygAPPid, WX_WORK, ORDER_TYPE, CHANNEL_ID, STORE_VALUE} = app.config
let cityArr = [];
// 加价购， 满即赠， 满减， 满折， 整单满减，整单满折,整单满赠
const addPriceType = '1000', giveType = '1001', reduceType = '1002', discountType = '1003', allReduceType = '1004', allDiscountType = '1005', allGiveType = '1006', threeToOne = '1007';
let useAllGiveType = false;
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
let isHaveDiscountGoods = false;
let curOptions ={};
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
    STORE_VALUE,
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
      },
      {
        text:'到店自提',
        selected: false,
        isShow: brand === 'FOL'? true : isStoreOption ,
      }
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
    showNoNameCoupon: showNoNameCoupon || false,
    popup:{
      show: false,
      bgColor: '#fef4f3'
    },
    childList: [],
    isPost: true,
    pickupImg: [splitImg('point_left.png' ,'common'), splitImg('postself.gif' ,'common') ],
    isActivity: IS_PICKUP || false,
    phoneArray: [],
    isSlected: true,
    selectedPhone: "",
    noticeAct: false,
    wxIcon: splitImg('wxpay_icon.png', 'common'),
    wishDetail:{},
    msg: '',
    orderGiftGoods: [],
    totalBalance: 0,
    payMethods: {
      storeCard: {
        text: '储值卡',
        value: '0',
        subText: '储值更多优惠'
      }  ,
      wxPay: {
        text: '微信支付',
        active: true
      }
    },
    storedValueCardOnline: app.globalData.configJson.storedValueCardOnline
  },
  handleEvent: function(event, type){
    if(type === EVENTS.EVENT_CRMINFO){
      CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      orderSaveParam.phone = CRMInfo.phone;
      orderSaveParam.crmId = CRMInfo.memberno;
      this.getRuleListBySku();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.configJson.storedValueCardOnline){
      this.setData({
        storedValueCardOnline: true,
      })
    }
    curOptions = options;
    CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    this.pageInit();
    const isMember = wx.getStorageSync('isMember');
    if(!isMember){
      if(!app.config.useWXPhone){
        app.isMemberETO()
      }
    }
    // !isMember ? app.isMemberETO() : '';
    this.guideShare();
    this.getGoodsList();
    if(CRMInfo.phone){
      this.getRuleListBySku();
    }else{
      app.getCRMInfoFn();
    }
    zitiReduction = 0;
    this.computerNewExpress('SP',1);
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
  watchPayPrice(){
    app.watch(this, {
      payPrice(newVal){
        console.log(newVal, 'watch****')
      }
    })
  },
  pageInit: function(){
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const unionid = wx.getStorageSync(KEYSTORAGE.unionid);
    // 微信广告用户行为信息
    const wxUserAction = wx.getStorageSync(KEYSTORAGE.wxUserAction);
    const chanId = wx.getStorageSync(KEYSTORAGE.chanId) || '';
    goodsOrderList = [];
    orderSaveParam = {
      orderType: ORDER_TYPE.NORMAL,
      channelId: CHANNEL_ID, // 接口更改
      channelCode: channel,
      realSellPrice: '',
      originalTotalPrice: 0,
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
        chanReferAppId: chanId ? gygAPPid : '',
      },
      devFlag: '',
    };
    this.removeLocalStore();
    goodsOrderList = [];
    orderSaveParam.ruleId = ''
  },
  removeLocalStore(){
    wx.removeStorageSync('isJiajiagou');
    wx.removeStorageSync('promoteItem');
    // 满即赠删除状态
    wx.removeStorageSync('giveType');
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
    try {
      app.gioTrack('pageclick_order_deliver_expressadd')
    }catch (err){}
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
          scope: 'scope.userLocation',
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
      }else{
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
        wxShowToast('请选择完整省市区');
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
    let {share_by, share_by_shop} = shareFrom;
    let orderSaveShare = {
      shareBy: share_by || '',
      shareByShop: share_by_shop || '',
    };
    if(orderSaveShare.shareBy || orderSaveShare.shareByShop){
      Object.assign(orderSaveShare, {
        channelCode: 'WEMALL',
        shareByTime:  wx.getStorageSync('openShareTime') || Date.now()
      });
      Object.assign(orderSaveParam, orderSaveShare);
      this.getGuideInfo(orderSaveShare.shareBy)
    }
  },
  async getGuideInfo(DANum){
    if(DANum){
      try {
        if(DANum.startsWith('DA')){
          let guideInfo = await getDAInfo(DANum);
          if(guideInfo){
            orderSaveParam.shareByShop = guideInfo.zzDpdm || '0000';
          }
          return
        }
        if(DANum.startsWith('FX')){
          orderSaveParam.orderType = ORDER_TYPE['FENXIAO'];
          let distributorInfo = await distributorInfoByFxId(DANum);
          if(distributorInfo){
            orderSaveParam.shareByShop = distributorInfo.virtualShopCode || 'FFFFFF';
          }
        }
      }catch (e) { }
    }
  },
  // 获取商品列表
  getGoodsList: function(){
    let orderGoods = wx.getStorageSync('dingdanCon');
    let goodsPrice = 0, payPrice = 0, orderGoodsNum = 0;
    goodsOrderList = [];
    if(Array.isArray(orderGoods)){
      orderGoods.forEach(item => {
        item.isGift = 'N';
        item.goodsSku = item.goodsSku ||item.goodsColorCode;
        let skuParam = {
          sku: item.goodsSku,
          size: URL_CDN.IMGSIZE240400
        };
        // 心愿单
        if(item.wishDetail){
          this.setData({wishDetail: item.wishDetail});
        }
        // 购物车数据改变的判断
        item.nums = item.nums || item.goodsCount;
        item.allPrice = item.allPrice || item.price;
        // 拼接图片
        item.goodsImg = `${cdn}${skuToImg(skuParam)}`;
        // 计算折扣
        if(item.discount !== 1){
          isHaveDiscountGoods = true
        }
        item.discount = chengfa(item.discount, 10);
        goodsPrice = jiafa(goodsPrice, item.allPrice);
        payPrice = jiafa(payPrice, item.allPrice);
        orderGoodsNum = orderGoodsNum + item.nums;
        // 订单参数
        this.goodsOrderPushList(item);
        app.gioTrack('flow_purchase_order_1', {
          spu_id: item.goodsSku
        });
      });
      payPrice = toDecimal(payPrice);
      goodsPrice = toDecimal(goodsPrice);
      this.setData({orderGoods, goodsPrice, payPrice, orderGoodsNum});
      // 添加到提交订单参数
      let orderSavePrice = {
        payPrice,
        realSellPrice: payPrice,
        goodsTotalCount: orderGoodsNum,
        picUrl: orderGoods[0].color ? orderGoods[0].color.picurls[0] : orderGoods[0].gscolPicPath
      };
      // 合并提交订单参数
      Object.assign(orderSaveParam, orderSavePrice);
    }
  },
  // 添加订单参数商品列表
  goodsOrderPushList: function(item, isGift){
    let originalPrice = item.color ? item.color.originalPrice : item.onePrice;
    let price = item.onePrice;
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
      originalPrice: originalPrice,
      sizeName: item.size ? item.size.sizeAlias : item.sizeName,
      price: price,
      isGift: item.isGift || isGift || "N",
      discount: item.discount === 90 ? 9 : chuFa(item.discount, 10)
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
      try {
        app.gioTrack('pageclick_order_deliver_storesearch', {
          province: cityParam.region,
          city: cityParam.city,
          district: cityParam.cityDistrict,
        })
      }catch (err){}
    }else{
      wxShowToast('请选择完整省市区');
    }
  },
  openLocation: function(e){
    const {longitude, latitude, store} = e.currentTarget.dataset;
    const {storeCode} = this.data.pickupStore
    try {

      this.data.orderGoods.forEach(item => {
        app.gioTrack('pageclick_order_deliver_storemap', {
          store_Id: store,
          spu_id: item.goodsSku.substr(0, 12)
        })
      })
    }catch (err){}
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude)
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
    const {wishDetail} = this.data;
    if(wishDetail.phone){
      // 心愿单地址
      const {consignee, province, city, district, detail_address, phone} = wishDetail;
      const address = {
         province, city,phone, consignee,
         contactTel: phone,
        userName: consignee,
        area: district,
        detailAddress: detail_address
      };
      this.handleAddress(address);
      return;
    }
    let localAddress = wx.getStorageSync('dingdanAddress');
    if(localAddress && localAddress.phone){
      if(localAddress.city.includes('行政')){
        localAddress.city = localAddress.area;
        wx.setStorageSync('dingdanAddress', localAddress);
      }
      if(localAddress.city === '县' || localAddress.province === '重庆市'){
        localAddress.city = localAddress.province;
        wx.setStorageSync('dingdanAddress', localAddress);
      }
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
    wx.setStorageSync('dingdanAddress', addressObj);
    let addressOrder = {
      province: addressObj.province,
      city: addressObj.city,
      area: addressObj.area,
      detailAddress: addressObj.detailAddress,
      contactTel: addressObj.phone,
      consignee: addressObj.userName,
    };
    Object.assign(orderSaveParam, addressOrder);
  },
  // 切换配送方式
  changeShipping: function(e){
    let dataText = e.currentTarget.dataset.text;
    let {payPrice, shippingMethods, voucherPrice} = this.data;
    if(dataText === shippingMethods[1].text){
      if(shippingMethods[1].selected){
        return;
      }
      this.setData({pickupShow: true});
      if(expressPrice > 0){
        payPrice = toDecimal(jianfa(payPrice, expressPrice));
        this.setData({
          payPrice,
          expressFare: 0
        })
      }
      this.pickupStore();
      // 是否自提
      orderSaveParam.deliveryMode = DELIVERY_MODE;
      this.payBtnDis();
      this.setData({
        selectedPhone: '',
        pickupUserPhone: '',
        isSlected: true,
      })

    }else{
      if(shippingMethods[0].selected){
        return;
      }
      this.setData({
        pickupShow: false,
        pickupStore: {},
        pickupList: [],
      });
      this.computerNewExpress('SP', 1);
      this.payBtnDefault();
      if(orderSaveParam.deliveryMode === DELIVERY_MODE){
        delete orderSaveParam.deliveryMode;
      }
    }
    shippingMethods.forEach(item => {
      item.selected = item.text === dataText;
    });
    this.setData({shippingMethods});
    try {
      app.gioTrack('pageclick_order_deliver', {distribution: DELIVERY_MODE})
    }catch (e){}
  },
  // 选择自提店铺
  selectStore: function(e){
    let dataIndex =e.currentTarget.dataset.index;
    let {pickupList, region, pickupStore} = this.data;
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
  _getVoucherList: function (isSelect) {
    let user_info = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let phone = user_info.phone;
    if (!phone) {
      return;
    }
    let {cardNum, payPrice, voucherList} = this.data;
    const reqParam = {
    	phone,
	    type: 'time',
	    channelType: 'P', // 需要过滤的渠道，
	    returnListFlag: '0' // 0: 可用券 2: 全部券
    };
    getVoucher(reqParam).then(res => {
    	this.hideVoucherLoading();
      if(Array.isArray(res) && res.length){
        // 新增字段：固定周期有效状态availabledaystatus, 有效描述availabledaydescription
        /*res = res.filter(item => {
          if(item.hasOwnProperty('availabledaystatus')){
            if(item.availabledaystatus){
              return item;
            }
          }else{
            return item;
          }
        })*/
        let {cardPromotion} = this.data;
        let couponJL = [], voucherJL = [];
        // 过滤未到使用时间的优惠券
        voucherList = res.sort((a, b)=>{ return a.value - b.value});
        voucherList.forEach((item, index) => {
          item.type = JLCouponType[item.type];
          // 优惠券
          if(item.type === JLCouponType.coupon){
            // 2020-06-10 sicong and penny require modify 不展示不满足金额的优惠券
            // item.myDisabled = item.threshold > payPrice;
            if(payPrice >= item.threshold){
              item.myShow = true;
              voucherJL.push(item)
            }
          }else if(item.type === JLCouponType.active){
            // 暂无活动券测试
            if(cardPromotion.length){
              cardPromotion.forEach(promoteItem => {
                item.myShow = !isSelect
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
        cardNum += allVoucher.filter(item => item.myShow).length;
        this.setData({cardNum, voucherList: allVoucher})
      }
    }).catch(err => {
	    this.hideVoucherLoading();
    });

  },
  hideVoucherLoading: function(){
    this.setData({voucherLoading: false});
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
    let {noNameCouponValue, payPrice, voucherPrice} = this.data;
    if(noNameCouponValue){
      payPrice = toDecimal(jiafa(payPrice, noNameCouponValue));
    }
    noNameCouponValue = voucherPrice = 0;

    this.setData({noNameCouponValue, voucherPrice, payPrice});
    // 删除订单信息当中的不记名参数
    delete orderSaveParam.ticketNo;
    this.clearVoucher()
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
    let { payPrice, couponNum} = this.data;
    if(!couponNum){
      wxShowToast('请填写券号');
      return;
    }
    /*N12SQF038660YYT 无门槛减1元
N12SQGIGS8B258A 满1000减1元*/
    wx.showLoading({title: '加载中...'});
    queryNumCoupon(couponNum).then(res => {
      wx.hideLoading();
      if(res && res.Value){
        if(res.Threshold > payPrice){
          wxShowToast('金额不满足');
          return;
        }
        let markupPrice = res.Value;
        let noNameCouponDesc = `使用${markupPrice}元不记名券`
        if(markupPrice){
          payPrice = jianfa(payPrice, markupPrice);
          // 判断是否是自提订单
          if(zitiReduction < 0){
            payPrice = jiafa(payPrice,zitiReduction);
          }
          payPrice = toDecimal(payPrice);
          this.setData({
            noNameCouponValue: markupPrice,
            voucherPrice: markupPrice,
            inputStatus: false,
            payPrice,
            noNameCouponDesc
          });
          // V-1585570782021WY8Q8  V-1585570992021GT9HR
          Object.assign(orderSaveParam,{
            couponNo: couponNum,
            ticketNo: `H5|${couponNum}`,
            couponValue: parseFloat(markupPrice),
            // hou 要求H5 => 不记名券
            couponName: '不记名券',
            couponType: '不记名券',
          });
        }
      }else{
        wxShowToast('优惠券不可用')
      }
    }).catch(err => {
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
    app.gioTrack('pageclick_order_couponinput', {
      code: couponNum
    })
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
      case allReduceType:
        selectText = `已使用整单满减券`;
        this.promoteReduce(item);
        break;
      case allDiscountType:
        selectText = '已使用整单满折券';
        this.promoteDiscount(item, true);
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
  // 使用活动券
  useVoucherJL: function(e){
    let couponNum = e.currentTarget.dataset.number;
    let {voucherList, usingCoupon, selectText} = this.data;
    voucherList.forEach(item => {
      if(item.voucherno === couponNum){
        usingCoupon = item;
        item.selected = true;
      }else{
	      item.selected = false;
      }
    });
    let cardPromotion = this.data.cardPromotion;
    let promotionItem = {};
    cardPromotion.forEach(item => item.couponNumber === usingCoupon.promotioncode ? promotionItem = item : '');
    this.handleActive(promotionItem, selectText);
    this.closeCard();
    const voucherChannel = usingCoupon.channel || '';
    this.setData({usingCoupon, voucherList});
    let orderParam = {
      ticketNo: `${voucherChannel}|${couponNum}`,
      couponType: JLCouponType.active,
      couponName: JLCouponType.active, // hou 要求和 couponType 一致
      phone: CRMInfo.phone || ''
    };
    Object.assign(orderSaveParam,orderParam);
    app.gioTrack('pageclick_order_couponuse', {
      code: couponNum
    })
  },
  // 展示优惠券
  openCardDetail: function(){
    let {cardNum, noNameCouponValue, promotion} = this.data;
    // disableCoupon
    if(promotion.list.length){
      const disableCoupon = promotion.list.some(item => item.active && item.rcmPromotionCode === 'disableCoupon');
      if(disableCoupon){
        wxShowToast('当前促销不可使用优惠券！');
        return;
      }
    }
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
        app.gioTrack('flow_purchase_order_coupon');
      }catch (e) {}
    }

  },
  // 使用优惠券
  userVoucher: function(e){
    let wxData = this.data;
    let voucherNum = e.currentTarget.dataset.number;
    let {usingCoupon, usingCardVoucher, voucherPrice, payPrice, voucherList} = this.data;
    let selectText = '';
    const curVoucherIndex = voucherList.findIndex(item => voucherNum === item.voucherno);
	  if(voucherList[curVoucherIndex].myDisabled){
	    wxShowToast('不满足使用条件');
		  return;
	  }
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
        if(usingCoupon.voucherno){
          payPrice = jiafa(payPrice, voucherPrice);
          voucherPrice = 0;
          orderSaveParam.ruleId = '';
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
          couponName: `${item.channel || ''}|${item.promotionname || ''}`,
          phone: CRMInfo.phone,
          payPrice: payPrice,
          realSellPrice: payPrice,
        };
        Object.assign(orderSaveParam, orderParam);
      }else{
        item.selected = false;
      }
    });
    this.setData({ voucherList, usingCardVoucher })
    app.gioTrack('pageclick_order_couponuse', {
      code: voucherNum
    })
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
  wxSubscribe: function(e){
    if(!wx.getStorageSync('wxSubscriptions').isOrderPay){
      wxSubscription("orderPay").then(res => {
	      this.formSubmit(e)
        app.gioTrack('pageclick_order_sub', {
          notice: true
        })
      }).catch(err => {
      	this.formSubmit(e);
        app.gioTrack('pageclick_order_sub', {
          notice: false
        })
      });
    }else{
	    this.formSubmit(e)
      app.gioTrack('pageclick_order_sub', {
        notice: false
      })
    }
  },
  inputMsg(e){
    console.log(e.detail);
    this.setData({msg: e.detail.value})
  },

  // 提交订单
  formSubmit: function(e){
    // 企业微信
    if (wx.getStorageSync('isWXWork')) {
      return;
    }

    wx.setStorageSync(KEYSTORAGE.NEARBY_SHOP_CODE, "");
    // const formId = e.detail.formId;
    let wxData = this.data;
    let {address, payPrice, expressFare, orderGoods, orderGiftGoods, totalBalance, payMethods } = this.data;
    if(orderGiftGoods.length){
      const orderGiftRuleItem = orderGiftGoods.find(item => item.orderGiftRuleId);
      if(orderGiftRuleItem && orderGiftRuleItem.orderGiftRuleId && orderGiftRuleItem.goodsSku){
        // 订单赠品
        Object.assign(orderSaveParam, {
          orderGiftRuleId: orderGiftRuleItem.orderGiftRuleId,
          orderGiftSku: orderGiftRuleItem.goodsSku
        })
      }
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
        contactTel: pickupUserPhone,
        expressFare: 0,
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
        contactTel: address.phone,
        bindReason: ''
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
    const loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    const wxPhone = wx.getStorageSync(KEYSTORAGE.wxPhone);
    // 校验unionID
    if(orderSaveParam.unionid){
      const isMember = wx.getStorageSync(KEYSTORAGE.isMember);
      if(!app.config.useWXPhone){
        // 单品牌校验会员
        if(isMember || brand === 'BESTSELLER'){
          if(CRMInfo.phone && CRMInfo.memberno){
            orderSaveParam.phone = CRMInfo.phone;
            orderSaveParam.crmId = CRMInfo.memberno;
          }else{
            app.getCRMInfoFn();
            return;
          }
        }else{
          app.isMemberETO();
          return;
        }
      }else{
        if(!orderSaveParam.phone){
          orderSaveParam.phone = CRMInfo.phone || loginInfo.phone ||wxPhone;
          orderSaveParam.crmId = CRMInfo.memberno || loginInfo.crmId || '';
          if(!loginInfo){
            app.login();
          }
          return;
        }
      }
    }else{
      // wx.clearStorage();
      wx.removeStorageSync(KEYSTORAGE.authed);
      wx.removeStorageSync(KEYSTORAGE.unionid);
      wx.removeStorageSync(KEYSTORAGE.loginInfo);
      wx.removeStorageSync(KEYSTORAGE.crmInfo);
      app.goSetting();
      return;
    }


    var json = wx.getStorageSync('pintuanDetailPage_nomal');
    if (json.bigorderCode){
      //来自分享页
      let jsons = {
        pintuanOrderPerson : json.bigorderCode,
        pintuanOrderType : '1',
        pintuanStatus : ''
      }
      Object.assign(orderSaveParam,jsons);
      wx.removeStorageSync('pintuanDetailPage_nomal')
    }

    // 校验手机号
    if(!orderSaveParam.phone){
      orderSaveParam.phone = CRMInfo.phone || loginInfo.phone || wxPhone;
    }
    // 校验crmId
    if(!orderSaveParam.crmId){
      orderSaveParam.crmId = CRMInfo.memberno || loginInfo.crmId || ''
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
    // 详细地址校验
    if(orderSaveParam.detailAddress.length < 10){
      wxShowToast('详细地址不能少于10位');
      return;
    }
    if( orderSaveParam.deliveryMode !== DELIVERY_MODE && orderSaveParam.detailAddress.length > 50){
      wxShowToast('详细地址超过50位，请修改详细地址！');
      return;
    }
    // 白色情人节甜蜜来袭
    if(orderSaveParam.ruleId){
      const {promotion} = this.data;
      const {list} = promotion;
      if(list && list.length){
        const {description} = list[0];
        if(description &&
          (description === '白色情人节甜蜜来袭' ||
            description.includes('任意两件499') ||
            description.includes('任意两件699'))){
          let canSubmit = false;
          let nineSkuArr =[];
          orderSaveParam.goodsOrderList.forEach(item => {
            const nineSku = item.gcsSku.substr(0,9);
            if(nineSkuArr.includes(nineSku)){
              canSubmit = true;
            }else{
              nineSkuArr.push(nineSku);
            }
            if(item.goodsCount >= 2){
              canSubmit = true;
            }
          });
          if(canSubmit){
            wxShowToast('当前活动不可购买相同商品');
            return;
          }
        }
      }
    }
    // 计算originalTotalPrice, 实际商品总价realSellPrice 20200909， chai
    let originalTotalPrice = 0, realSellPrice = 0, goodsTotalCount = 0;
    orderSaveParam.goodsOrderList.forEach(item => {
      originalTotalPrice = jiafa(originalTotalPrice, chengfa(item.originalPrice, item.goodsCount));
      realSellPrice = jiafa(realSellPrice, chengfa(item.price, item.goodsCount));
      goodsTotalCount = jiafa(goodsTotalCount, item.goodsCount)
    });
    Object.assign(orderSaveParam, {
      originalTotalPrice, realSellPrice, goodsTotalCount
    });
    // 计算bindReason FOL chai 让添加
    let addReason = '';
    if(orderSaveParam.ruleId){
      const {cardPromotion} = this.data;
      const {list} = this.data.promotion;
      const temp = list.concat(cardPromotion);
      if(temp.length){
        temp.forEach(({id, description}) => {
          if(id === orderSaveParam.ruleId){
            addReason= description;
          }
        })
      }
    }
    // 心愿单
    const {msg, wishDetail} = this.data;
    const {xinyuandanId = ''} = wishDetail;
    if(xinyuandanId){
      const param = {
        orderType: ORDER_TYPE['WISH'],
        backMemberIdStr: `${xinyuandanId} || ${msg}`
      };
      Object.assign(orderSaveParam, param)
    }
    // 储值卡
    if(payMethods.storeCard.active){
      orderSaveParam.isGiftCardPaid = 'Y'
    }
    orderSaveParam.bindReason += addReason;
    // 秒杀商品绑定原因
    let localGoodsInfo = wx.getStorageSync('dingdanCon');
    const bindReasonGoods = localGoodsInfo.find(item => item.bindReason);
    if(bindReasonGoods){
      if(!orderSaveParam.bindReason.includes(bindReasonGoods.bindReason)){
        orderSaveParam.bindReason = bindReasonGoods.bindReason
      }
    }
    wx.showLoading({
      title: '提交中',
      mask: true,
    });
    newOrderSave(orderSaveParam).then( res => {
      wx.hideLoading();
      if(res){
        this.collectDate('点击提交订单', 'summit');
        this.removeLocalStore();
        const {payPrice, orderToken, bigorderCode, bigOrderId} = res;
        app.gioTrack('flow_purchase_order_summit_2', {
          order_id: bigorderCode,
          order_amount: payPrice
        })
        if(payPrice <= 0){
          const param = {
            orderToken,
            bigorderCode,
            id: bigOrderId
          };
          this.goWXPayCon(param);
        }else{
          this.orderPayment(res);
        }
      }else{
        wxShowToast('提交订单失败，请重试');
      }
    }).catch( e => {
      if(orderSaveParam.bindReason && addReason){
        orderSaveParam.bindReason = orderSaveParam.bindReason.replace(addReason, '');
      }
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
  },
  orderPayment(orderRes){
    const {orderToken, bigorderCode, bigOrderId, payPrice} = orderRes;
    const param = {orderToken, bigorderCode, id: bigOrderId};
    try {
      app.tdSdkEvent('flow_purchase_order_paynow_4', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      })
      const {voucherPrice, expressFare, usingCardVoucher, usingCoupon} = this.data;
      const {goodsOrderList, orderType, payPrice, couponName = '', goodsTotalCount, couponNo = '', bindReason} = orderSaveParam;
      const createOrderTime = formatDate(Date.now()).replace(/-/g, '/');
      app.gioTrack('flow_purchase_order_paynow_4', {
        orderTime: createOrderTime,
        order_id: bigorderCode,
        orderType: orderType,
        order_amount: payPrice,
        reduce_price: voucherPrice,
        ship_price: expressFare,
        ifUseCoupon: (usingCoupon.promotioncode || couponNo) ? '是' : '否',
        couponID: couponNo || usingCoupon.voucherno || '',
        couponName: usingCoupon.promotionname || couponName || '',
        couponCode: usingCardVoucher.promotioncode || usingCoupon.promotioncode || '',
        couponGetType : usingCardVoucher.type || usingCoupon.type || '',
        commodity_number: goodsOrderList.length,
        num: goodsTotalCount,
      });
      goodsOrderList.forEach(({goodsColorCode, gcsSku, goodsCount, goodsName, discount = '', originalPrice, price}) => {
        app.gioTrack('flow_purchase_order_paynow_4_goods', {
          orderTime: createOrderTime,
          order_id: bigorderCode,
          orderType,
          originalPrice,
          currentPrice: price,
          discountRate: discount,
          spu_id: goodsColorCode,
          sku_id: gcsSku,
          productName: goodsName,
          num: goodsCount,
          campaignName: bindReason,
          order_amount: payPrice,
        })
      })
    }catch (e) {console.error(e)}
    wxRequestPayment(orderRes).then(res => {
      console.log(res,'**payment');
      /*
      * {errMsg: "requestPayment:ok", code: 0} 成功
      * {errMsg: "requestPayment:fail cancel", code: 1} 失败
      * */
      if(res){
        if(res.code === 0){
          try{
            const {voucherPrice, expressFare} = this.data;
            const {goodsOrderList, orderType, payPrice, couponName = '', goodsTotalCount, couponNo = '', bindReason} = orderSaveParam;
            const payTime = formatDate(Date.now()).replace(/-/g, '/');
            const payMethod = '微信';
            /*app.gioTrack('flow_purchase_order_pay_success_5a', {
              payTime,  payMethod, orderType,
              order_id: bigorderCode,
              order_amount: payPrice,
              ship_price: expressFare,
              ifUseCoupon: couponNo ? '是' : '否',
              commodity_number: goodsOrderList.length,
              num: goodsTotalCount,
              reduce_price: voucherPrice
            });*/
            goodsOrderList.forEach(({goodsColorCode, gcsSku, goodsCount, goodsName, discount = '', originalPrice, price}) => {
              app.gioTrack('wemall_productPaySuccess', {
                payTime,  payMethod, originalPrice, orderType,
                spu_id: goodsColorCode,
                sku_id: gcsSku,
                productName: goodsName,
                orderID: bigorderCode,
                payAmount: price,
                currentPrice: price,
                discountRate: discount,
                num: goodsCount,
                campaignName: bindReason
              })
            })
          }catch {}
          if(!wx.getStorageSync('wxSubscriptions').isPaySuccess){
            wxSubscription("paySuccess").then(res => {
            })
          }
        }
        this.goWXPayCon(param);
      }
    }).catch(err => wxShowToast(err.message));
  },

  goWXPayCon(param){
    const queryString = objToQuery(param);
    wx.navigateTo({
      url: '../wxPayCon/wxPayCon' + queryString
    })
  },
  // 查询促销规则列表
  getRuleListBySku: function(){
    let param = [];
    let {orderGoods, promotion} = this.data;
    console.log(orderGoods,'*****');
    let cartPromotionList = [], cartPromotionId = '', useSameCartPromote = false, cartPromotionTypeCode = '';
    // 是否盲盒
    let blindBox = false;
    // 订单赠品
    const orderGiftParam = {
      phone: CRMInfo.phone,
      skuList: []
    };
    orderGoods.forEach( item => {
      param.push({
        sku: item.color ? item.color.colorCode : item.goodsColorCode,
        quantity: item.nums
      })
      orderGiftParam.skuList.push({
        sku: item.goodsSku,
        quantity: item.nums
      })
      if(item.promotionData && item.promotionData.id){
        blindBox = item.promotionData.name === '盲盒';
        cartPromotionList.push(item.promotionData);
        // 第一个促销ID
        cartPromotionId = cartPromotionId || item.promotionData.id;
        // 第一个促销类型
        cartPromotionTypeCode = cartPromotionTypeCode || item.promotionData.typeCode
      }
    });
    if(cartPromotionList.length){
      // 是否是相同的促销
      useSameCartPromote = cartPromotionList.every(item => cartPromotionId === item.id)
    }
    ruleListBySku(param).then( res => {
      // 是否选中促销
      let isSelect = false;
      if(Array.isArray(res) && res.length){
        let noCardPromotion = [], cardPromotion = [];
        cardPromotion = res.filter(item => item.validByCoupon === IS_GIFT);
        noCardPromotion = res.filter(item => item.validByCoupon !== IS_GIFT);
        if(blindBox){
          noCardPromotion = res.filter(item => item.description.includes('盲盒'))
        }
        // 加价购 (1000)，满折 (1003)，满减(1002)，满即赠(1001), 整单满减（1004），整单满折（1005）
        const promotionType = {
          [addPriceType]: [],// 加价购 (1000)
          [giveType]: [],// 满即赠(1001)
          [reduceType]: [], // 满减(1002)
          [discountType]: [], // 满折 (1003)
          [allReduceType]: [], // 整单满减（1004
          [allDiscountType]: [], // 整单满折（1005）
          [allGiveType]: [], // 整单满赠1006
          [threeToOne]: [], // 单品满件免一1007
        };
        // priceRule  取优惠最大，
        noCardPromotion.forEach( item => promotionType[item.typeCode].push(item));
        for(let key in promotionType){
          if(promotionType[key].length){
            this.promotionSort(promotionType[key], promotion);
          }
        }
        this.setData({promotion, cardPromotion});
        // 默认选中促销
        for(let item of  promotion.list){
          const {typeCode} = item;
          // 整单免一
          if(typeCode === allGiveType){
            isSelect = true;
            this.promote(typeCode);
            break;
          }
          // 购物车促销
          if(useSameCartPromote && cartPromotionTypeCode){
            isSelect = true;
            this.promote(cartPromotionTypeCode);
            break;
          }
        }
      }
      this._getVoucherList(isSelect);
      this.getOrderGift(orderGiftParam);
      this.storedValueCard();
    }).catch(err => {
      this.hideVoucherLoading();
    })
  },
  storedValueCard(){
    // 提交订单如果是储值卡支付，增加一个字段 isGiftCardPaid = Y，不是则不传
    storedValueCard(CRMInfo.memberno).then(res => {
      if(res && res.total_balance){
        this.setData({
          'payMethods.storeCard.value':  res.total_balance
        })
      }
    })
  },
  changePayMethod(e){
    const {index} = e.currentTarget.dataset;
    let {payMethods, payPrice} = this.data;
    if(payPrice > payMethods.storeCard.value){
      wxShowToast('储值卡余额不足')
      return
    }
    for(const key in payMethods){
      payMethods[key].active = key === index
    }
    this.setData({payMethods})
  },
  getOrderGift(param){
    orderGift(param).then(res => {
      if(res && Object.keys(res).length){
        const {colorAlias, colorName, discount, discountPrice, goodsName, gscMaincolPath, orderGiftRuleId, originalPrice, salePrice, sku, spu, sizeAlias} = res;
        let skuParam = {
          sku: spu,
          size: URL_CDN.IMGSIZE240400
        };
        const orderGiftGoods = [];
        const goodsItem = {
          goodsName,
          nums: 1,
          goodsCode: spu,
          colorName,
          sizeName: sizeAlias,
          goodsSku: sku,
          discount: chengfa(discount, 10),
          onePrice: discountPrice,
          allPrice: salePrice,
          gscolPicPath: gscMaincolPath,
          goodsColorCode: spu,
          originalPrice,
          orderGiftRuleId,
          isGift: 'Y',
          goodsImg:`${cdn}${skuToImg(skuParam)}`
        }
        orderGiftGoods.push(goodsItem);
        this.setData({orderGiftGoods});

      }
    })
  },
  // 促销活动整理排序
  promotionSort(arr,promotion){
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
  // 活动券的显示隐藏
  changeVoucherShow(hide){
    let {voucherList} = this.data;
    if(voucherList.length){
      let cardNum = voucherList.length;
      voucherList.forEach(item => {
        if(hide){
          // 隐藏活动券
          if(item.type === JLCouponType.active){
            item.myShow = false;
            cardNum -=1
          }
        }else{
          item.myShow = true;
        }
        this.setData({voucherList, cardNum})
      })
    }
  },
  // 促销活动
  promote(e){
    let typeCode = e.currentTarget ? e.currentTarget.dataset.code : e;
    if(isUsePromotion){
      this.resetOrderGoods();
    }
    let {usingCoupon, promotion, voucherPrice, payPrice, goodsPrice, promoteItem = {}, usingCardVoucher, couponList, voucherList, orderGoodsNum, expressFare} = this.data;
    if(usingCoupon.coupon && usingCoupon.coupon.couponno){
      this.getGoodsList();
      if(orderSaveParam.ticketNo){
        delete orderSaveParam.ticketNo
      }
    }
    // 清空正在使用的优惠券
    this.clearVoucher();
    const {list = []} = promotion;
    const {ruleId = ''} = orderSaveParam;
    let selectText = '请选择';
    // 是否有选中促销
    let isActive = false;
    list.forEach( item => {
      if(item.typeCode === typeCode){
        promoteItem = item;
        if(ruleId !== item.id){
          item.active = isUsePromotion =isActive = true;
        }else{
          item.active = !item.active
        }
      }else{
        item.active = false;
      }
    });
    this.removeLocalStore();
    // 已经使用促销活动
    if(isUsePromotion){
      // 促销规则
      const loCalPromoteItem = wx.getStorageSync('promoteItem');
      if(loCalPromoteItem && loCalPromoteItem.markupPrice){
        goodsPrice = jianfa(goodsPrice, loCalPromoteItem.markupPrice);
        wx.removeStorageSync('promoteItem');
      }
      if(voucherPrice > 0){
        // payPrice = jiafa(payPrice, voucherPrice);
        voucherPrice = 0;
      }

	    // voucherList = voucherList.filter(item => item.type === JLCouponType.coupon);
      // cardNum = voucherList.length;
      payPrice = toDecimal(payPrice);
      goodsPrice = toDecimal(goodsPrice);
      this.setData({promotion, payPrice, voucherPrice, orderGoodsNum, goodsPrice});
      orderSaveParam.goodsTotalCount = orderGoodsNum;
      delete orderSaveParam.ruleId;
      if (!isActive){
        // 过滤优惠券
        this.changeVoucherShow(false);
        return;
      }
    }
    this.changeVoucherShow(true);
    payPrice = parseFloat(expressFare) !== 0 ? jiafa(goodsPrice, expressFare) : goodsPrice;

    voucherPrice = 0;
    usingCoupon = {};
    couponList = [];
    payPrice = toDecimal(payPrice);
    voucherPrice = toDecimal(voucherPrice);
    this.setData({promotion, payPrice, voucherPrice,  couponList, usingCoupon, selectText});

    switch (typeCode){
      case reduceType:
      case allReduceType:
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
      case allDiscountType:
        this.promoteDiscount(promoteItem, true);
        break;
      case allGiveType:
        this.allOrderGive(promoteItem);
        break;
      case threeToOne:
        this.allOrderGive(promoteItem);
        break;
    }
    app.gioTrack('pageclick_order_promotion', {
      check: true
    })
  },
  // 清空订单优惠券
  clearVoucher(){
    // 优惠券订单所需参数 selectText
    const voucherOrderParamArr = ['couponNo', 'couponValue', 'couponType', 'couponName'];
    let {selectText, voucherList} = this.data;
    if(selectText.length > 3){
      voucherList.map(item => item.selected = false)
      this.setData({
        selectText: '请选择',
        voucherList,
        usingCardVoucher: {}
      });
    }
    voucherOrderParamArr.forEach(item => delete orderSaveParam[item]);
  },
  resetOrderGoods(){
    let {orderGoods } = this.data;
    // 订单商品
    goodsOrderList= [];
    // 页面展示商品
    orderGoods = orderGoods.filter(item => item.isGift !== IS_GIFT);
    let payPrice = 0, goodsPrice = 0;
    orderGoods.forEach(item => {
      this.goodsOrderPushList(item);
      goodsPrice = jiafa(goodsPrice, item.allPrice)
    });
    payPrice = goodsPrice;
    this.setData({orderGoods, goodsPrice, payPrice, voucherPrice: 0});
    Object.assign(orderSaveParam, {goodsOrderList, bindReason:'', ticketNo: ''});
  },
  // 整单满赠
  allOrderGive(promotionItem){
    let {orderGoods, payPrice, voucherPrice} = this.data;
    const {giftList = [], id = '', typeCode = ''} = promotionItem;
    if(giftList.length){
      // 赠品
      const giftArr = [];
      goodsOrderList.forEach((item, index) => {
        giftList.forEach(goodsItem => {
          // giftArr.length 目前只有一个SKU
          if(item.goodsColorCode === goodsItem.gsColorCode && giftArr.length === 0){
            giftArr.push(JSON.parse(JSON.stringify(item)));
            item.goodsCount -= 1;
            // item.allPrice = chengfa(item.nums, item.price)
            if(item.goodsCount < 1){
              goodsOrderList.splice(index, 1)
            }
          }
        })
      });
      if(giftArr.length){
        giftArr.forEach(item => {
          voucherPrice = item.price
          payPrice = jianfa(payPrice, voucherPrice)
          const modify = {
            goodsCount: 1,
            price: 0,
            isGift: 'Y',
          }
          Object.assign(item, modify)
        })
        goodsOrderList.push(...giftArr);
        orderSaveParam.ruleId = id;
        this.setData({orderGoods, payPrice, voucherPrice});
        // 使用整单满赠
        useAllGiveType = true
      }
    }
  },
  // 满减
  promoteReduce: function(promoteItem){
    let markupPrice = promoteItem.markupPrice;
    let {payPrice, voucherPrice} = this.data;
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
      payPrice,
      realSellPrice: payPrice,
      ruleId: promoteItem.id,
    };
    Object.assign(orderSaveParam, orderParam);
  },
  /**
   * 满折促销
   * @param promoteItem
   * @param isAllOrder 是否整单满折
   */
  promoteDiscount: function(promoteItem, isAllOrder){
    let {goodsPrice, orderGoods, voucherPrice, payPrice, expressFare} = this.data;
    const {prgList = [], id = '', discount = 1} = promoteItem;
    // 是否已经使用活动券
    if(voucherPrice > 0 && (orderSaveParam.couponNo || orderSaveParam.ruleId)){
      payPrice = jiafa(payPrice, voucherPrice);
      voucherPrice = 0;
    }
    let tempDisPrice = 0;
    if(isAllOrder){
      tempDisPrice = chengfa(payPrice, discount);
    }else{
      // 促销商品
      let discountGoods = [], noDiscountGoods = [], discountSku = [];
      orderGoods.forEach(item => {
        for(let promItem of prgList){
          if(item.goodsSku.includes(promItem.sku)){
            discountGoods.push(item);
            discountSku.push(item.goodsSku);
            return;
          }
        }
      });
      noDiscountGoods = orderGoods.filter(item => !discountSku.includes(item.goodsSku));
      noDiscountGoods.forEach(item => {
        // 不打折商品的价钱
        tempDisPrice = jiafa(item.allPrice, tempDisPrice);
      });
      discountGoods.forEach(item => {
        // 打折之后价格
        let discountPrice = chengfa(item.allPrice, discount);
        tempDisPrice = jiafa(discountPrice, tempDisPrice);
      });
    }
    const tempPrice = tempDisPrice + '';
    // 待优化
    if(tempPrice.includes('.')){
      const priceArr = tempPrice.split('.')
      if(priceArr[1].length >= 3 && priceArr[1].charAt(2) >= 5){
        payPrice = priceArr[0] +'.'+ priceArr[1].slice(0,2) + '6';
      }else{
        payPrice = tempPrice;
      }
    }else{
      payPrice = tempPrice
    }

    // // 判断是否是自提订单
    if(zitiReduction < 0){
      payPrice = jiafa(payPrice,zitiReduction);
    }else{
      payPrice = jiafa(payPrice, expressFare);
    }
    payPrice = toDecimal(payPrice);
    voucherPrice = toDecimal(jianfa(goodsPrice, payPrice));

    this.setData({payPrice, voucherPrice});
    let orderParam = {
      payPrice,
      ruleId: id
    };
    Object.assign(orderSaveParam, orderParam);
  },
  // 去促销列表
  goPromote:function(promoteItem){
    wx.setStorageSync('promoteItem', promoteItem);
    let {orderGoods, orderGoodsNum} = this.data;
    // 删除加价购商品 参数的list
    if(goodsOrderList.length){
      goodsOrderList.forEach((item, index) => {
        item.isGift === IS_GIFT ? goodsOrderList.splice(index, 1) : '';
      })
    }
    // 删除加价购商品 data的list
    orderGoods.forEach((item, index) => {
      if(item.isGift === IS_GIFT){
        orderGoods.splice(index, 1);
        orderGoodsNum-=1;
      }
    });
    this.setData({orderGoodsNum, orderGoods});
    wx.removeStorageSync('isJiajiagou');
    promoteItem.typeCode === addPriceType ? wx.removeStorageSync('giveType') : ''; // 加价购删除
    wx.navigateTo({ url: `/order/giftList/giftList?ruleId=${promoteItem.id}`});
  },
  // 加价购
  promoteAddPrice: function(){
    /*判断是否有参活商品，有的话不在添加*/
    let orderListHasGift = false;
    if(goodsOrderList.length){
      orderListHasGift = goodsOrderList.some(item => item.isGift === IS_GIFT);
    }
    if(orderListHasGift){
      return;
    }
    let {payPrice, voucherPrice, orderGoods, orderGoodsNum, goodsPrice, promotion} = this.data;
    // 参活商品
    let promoteAddPriceItem = wx.getStorageSync('isJiajiagou');
    if(!promoteAddPriceItem){
      // isUsePromotion = false;
      if(promotion.list.length){
        promotion.list.forEach(item => {
          if(item.active){
            // 加价购，满即赠 如果没有的话取消选中
            const cancelTypeList = [addPriceType, giveType];
            if(cancelTypeList.includes(item.typeCode)){
              item.active = false;
              this.changeVoucherShow(false);
            }
          }
        });
        this.setData({promotion});
        wx.removeStorageSync('promoteItem');
      }
      return;
    }
    // 促销规则
    const promoteItem = wx.getStorageSync('promoteItem');
    if(promoteAddPriceItem.goodsSku){
      let skuParam = {
        sku: promoteAddPriceItem.goodsSku,
        size: URL_CDN.IMGSIZE240400
      };
      // 拼接图片
      promoteAddPriceItem.goodsImg = `${cdn}${skuToImg(skuParam)}`;
      promoteAddPriceItem.discount = chengfa(promoteAddPriceItem.discount, 10);
      promoteAddPriceItem.allPrice = promoteAddPriceItem.onePrice = promoteItem.markupPrice;
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
  // 取数组中最大的一项
  getArrayMaxItem: function (arr, key) {
    let maxItem = {};
    let maxValue = Math.max.apply(Math, arr.map(item => item[key]));
    arr.forEach(item => item[key] === maxValue ? maxItem = item : '');
    return maxItem;
  },
  buriedpoint(){
    app.gioTrack('flow_purchase_order_address')
  },
  goAddress: function(){
    wx.setStorageSync('isAuthor',this.data.isAuthor)
    try {
      app.tdSdkEvent('flow_purchase_order_address', {});
      this.data.orderGoods.forEach(item => {
        app.gioTrack('pageclick_order_deliver_expresschoice', {
          spu_id: item.goodsSku.substr(0, 12)
        })
      })

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
      bindReason: `自提${expressFare}元`
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
    } else {
      getAddress().then(res => {
        if(res.length){
          res.forEach(item => {
            array.push({phone: item.phone});
          });
        }
      })
    }
    this.setData({
      popup,
      isShowPhone : true,
      phoneArray: array,
    })
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
    if(this.data.shippingMethods[1].selected){
        this.pickupStore();
    };
    // 微信数据上报
    app._browsePage(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 微信数据上报
    app._leavePage(this);
    events.unregister(this, EVENTS.EVENT_CRMINFO);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    events.unregister(this, EVENTS.EVENT_CRMINFO);
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

})
