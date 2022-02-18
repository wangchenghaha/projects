// pages/main/index.js
import {EVENTS, KEYSTORAGE, URL_CDN} from '../../src/const.js'
import events from '../../src/events';
import {getMemberSwiper, getFreeLogin} from '../../service/member';
import {orderCount, getOrderList} from '../../service/order.js';
import { distributorUnionId } from '../../service/index';
import {splitImg , judgeUrl} from '../../utils/utils'
import {wxShowToast} from '../../utils/wxMethods'
import {
  getImageInfo,
  saveImageToPhotosAlbum,
} from '../../service/saveImg'
import {bindGuide} from "../../service/guide";
const app = getApp();
const {cdn, brand, domain_h5, isCollection, duibaEntry, showFX, OFFICIAL_ACCOUNT, STORE_VALUE, STORE_VALUE_PATH} = app.config;
//CDN地址
const pluginTitle = '抽惊喜福利';
const bindGuideText = '绑定导购';
Page({
  data: {
    STORE_VALUE,
    STORE_VALUE_PATH,
    showPintuan : false,
    banner: {
      img: URL_CDN.MEMBER_CENTER_BANNER,
      goshop: "< 去购物"
    },
    TXT_BACK_TO_SHOP_DETAIL:"< 返回门店",
    TXT_GOTO_DAILY_CHECK_IN:"签到有礼 >",
    user: {
      defaultImg: '/images/user_icon.png',
      defaultText: '点击登录账户',
      avatarUrl: '',
      nickName: ''
    },
    nav: {
      mycard: "会员卡",
      myorder: "全部订单>"
    },
    swiperCurrent: 0,
    //联系客服
    callHelp: false,
    helpPhone: '400-862-8888',
    //轮播图
    slider: app.config.memberLoop,
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,

    phoneIcon: `${cdn}/assets/common/pub/image/phone.gif`,

    // help弹框图片
    helpData:{
      bouncedImage : '',
      qrCode : splitImg('helpBouncedQrCode.png'),
      wxNum : ''
    },

    serverList:[
      {
        text:'订购热线',
        phone: '400-862-8888'
      },
      {
        text:'售后热线',
        phone: '400-862-8888'
      }
    ],
    sales: [{
      img: "/images/pay.png",
      shoppingCar: 0,
      text: "待付款",
      status: 'WaitingPay',
      tdEventName: 'pageclick_personalcenter_orderstopay',
      gioName: 'pageclick_personalcenter_orderstopay',
    }, {
      img: "/images/icon1.png",
      shoppingCar: 0,
      text: "待发货",
      status: 'WaitingShipment',
      tdEventName: 'pageclick_personalcenter_orderstodeliver',
      gioName: 'pageclick_personalcenter_orderstodeliver',
    }, {
      img: "/images/shipped.png",
      shoppingCar: 0,
      text: "待收货",
      status: 'WaitingReceive',
      tdEventName: 'pageclick_personalcenter_orderstoreceive',
      gioName: 'pageclick_personalcenter_orderstoreceive',
    }, {
      img: "/images/customer.png",
      shoppingCar: 0,
      text: "退货/售后",
      status: 'isTuihuo',
      tdEventName: 'pageclick_personalcenter_ordersreturn&aftersale',
      gioName: 'pageclick_personalcenter_ordersreturnANDaftersale',
    }],

    list: [
      // 30号上线临时注销
      // {
      //   arrow: '>',
      //   tips: '',
      //   alert: '',
      //   img: '/images/customer_icon.png',
      //   contents: '我的评价',
      //   link: "/order/buyerShow/evaluateCenter/evaluateCenter",
      //   isShow: true,
      //   tdEventName: 'pageclick_personalcenter_integration'
      // },
      /*{
        arrow: '>',
        alert: '',
        img: '/images/icon_bind.png',
        contents: bindGuideText,
        link: "/member/myPoints/myPoints",
        isShow: true,
        tdEventName: 'pageclick_personalcenter_bindGuide',
        needLogin: true,
      },*/
      {
        arrow: '>',
        alert: '',
        img: '/images/icon_nearby.png',
        contents: '附近门店',
        link: "/pages/nearbyShops/main/main",
        isShow: true,
        tdEventName: 'pageclick_personalcenter_nearbyShops',
        gioName: 'pageclick_personalcenter_stores',
      },
      {
        arrow: '>',
        tips: '/images/new.png',
        alert: '',
        img: '/images/myPoints.png',
        contents: '我的积分',
        link: "/member/myPoints/myPoints",
        isShow: true,
        tdEventName: 'pageclick_personalcenter_integration',
        needLogin: true,
        gioName: 'pageclick_personalcenter_integration'
      }, {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/myCupon.png',
        contents: '我的优惠券',
        link: brand ===  'JLINDEBERG' ? '/member/mycouponJL/mycouponJL' : "/member/myCoupons/myCoupons",
        isShow: true,
        tdEventName:'pageclick_personalcenter_myCoupons',
        needLogin: true,
        gioName: 'pageclick_personalcenter_myCoupons',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/zuji.png',
        contents: '我的足迹',
        link: '/activity/scannedTrack/scannedTrack',
        isShow: brand ===  'FOL',
        tdEventName:'pageclick_personalcenter_zuji',
        needLogin: true,
        gioName: '',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/xin_def.png',
        contents: '我的心愿单',
        link: "/activity/wish/myWishList/myWishList",
        isShow: false,
        tdEventName:'pageclick_personalcenter_xinyuandan',
        style:"filter:grayscale(100%); transform:scale(1.2)",
        needLogin: true,
        gioName: '',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/icon_peace.png',
        contents: pluginTitle,
        link: "/activity/mercPlugin/index",
        isShow: false,
        tdEventName:'pageclick_personalcenter_wangzhe',
        needLogin: false,
        gioName: '',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/icon_fx.png',
        contents: '推广收益',
        link: "/weMall/distributor/login/login",
        isShow: false,
        tdEventName:'pageclick_personalcenter_tuiguangshouyi',
        needLogin: true,
        gioName: '',
      },
      {
        arrow: '>',
        tips: '/images/alert.png',
        alert: '完善收货地址',
        img: '/images/address.png',
        contents: '收货地址',
        link: "/pages/address/address",
        isShow: true,
        tdEventName: 'pageclick_personalcenter_addressmanagement',
        needLogin: true,
        gioName: 'pageclick_personalcenter_addressmanagement',
      },
      {
        arrow: '>',
        tips: '/images/alert.png',
        alert: '完善个人资料',
        img: '/images/detail.png',
        contents: '更新资料',
        link: "/member/profileUpdates/profileUpdates",
        isShow: true,
        tdEventName: 'pageclick_personalcenter_memberUpdate',
        needLogin: true,
        gioName: 'pageclick_personalcenter_memberUpdate',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/help.png',
        contents: '客服帮助',
        link: "",
        isShow: true,
        needLogin: false,
        gioName: 'pageclick_personalcenter_cs',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/customer_icon.png',
        contents: '顾客服务',
        link: '/member/contact/contact',
        isShow: false,
        needLogin: false,
        gioName: 'pageclick_personalcenter_service',
      },
      {
        arrow: '>',
        tips: '',
        alert: '',
        img: '/images/user_service.png',
        contents: '用户服务协议及隐私政策',
        link: '/weMall/userService/userService',
        isShow: app.config.showUserServer,
        needLogin: false,
        gioName: 'pageclick_personalcenter_legal',
      }
    ],
    bannerInfo: {},
    swiperInfo: [],
    bottomInfo: {},
    miniProgramPath: '',
    isBestseller: true,
    brand: brand,
    shoppingCars: 0,
    shopCartImage: splitImg('member_shopcart_new_0415.png' ,'common'),
    collectionImage: splitImg('member_collection_new_0415.png' ,'common'),
    pointMallImage: splitImg('member_pointmall_new.png' ,'common'),
    memberCardImage: splitImg('member_vipcard_new_0415.png' ,'common'),
    duibaImage: splitImg('member_exchange.png', 'common'),
    isCollection,
    duibaEntry,
    showServe: false,
    distributorInfo: {},
    // 关注公众号
    officialAccount: splitImg('official-account-0608.jpg'),
    OFFICIAL_ACCOUNT,

    storeValueCard: splitImg('icon_store_value.png', 'common')
  },
  closeServe(){
    this.setData({showServe: false})
  },
  officialAccount(){
    app.gioTrack('pageclick_personalcenter_tofollow');
    app.navigateTo(OFFICIAL_ACCOUNT)
  },
  onTabItemTap(item){
    app.gioTrack('pageclick_home_personalcenter')
  },
  onLoad: function (options) {
    this.searchPintuan()
    if(app.globalData.configJson.storedValueCardOnline){
      this.setData({
        storedValueCardOnline: true,
      })
    }
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_OREDERCOUNT);
    if(options.open && options.open ==='card'){
      this.openCard();
    }else{
      let fromwhitepage = wx.getStorageSync('fromwhitepage')
      if(fromwhitepage == 1) {
        wx.removeStorageSync('fromwhitepage')
        this.openCard();
      }
    }
    app.setUtmOptions(options);
    app.track();
    this.customerServer();
    this.getPics();
  },
  getDistributorUnionId(){
    const unionId = wx.getStorageSync(KEYSTORAGE.unionid);
    distributorUnionId(unionId).then(res => {
      console.log(Object.keys(res))
      if(res && Object.keys(res).length){
        const {list} = this.data;
        list.forEach(item => {
          if(item.contents.includes('推广')){
            item.isShow = true;
          }
        });
        let distributorInfo = res;
        this.setData({list, distributorInfo});
      }
    }).catch(err => console.log(err))
  },
  // 查询是否展示拼团模块
  async searchPintuan(){
    let {list, showPintuan, sales} = this.data;
    let {configJson} = app.globalData;
    if (!Object.keys(configJson).length){
      configJson = await app.getConfig();
    }
    showPintuan = configJson.showPintuan
    if (showPintuan){
      let saleItem = {
        img: "/images/renqun.png",
        shoppingCar: 0,
        text: "待拼购",
        status: 'WaitingPintuan',
        tdEventName: 'pageclick_personalcenter_orderstoWaitingPintuan'
      };
      sales.splice(1, 0, saleItem);
      this.setData({sales,showPintuan});
    }
    const {memberwishlist, memberCenterShowPlugin} = configJson
    list.forEach(item => {
      if(item.contents === '我的心愿单'){
        item.isShow = memberwishlist;
      }
      if(item.contents === pluginTitle){
        item.isShow = memberCenterShowPlugin
      }
    })
    this.setData({list})

  },
  // 顾客服务
  customerServer: function(){
    let list = this.data.list;
    list.forEach((item,index) => {
      if( item.contents === "顾客服务"){
        if(app.config.singleBrand || brand === 'BESTSELLER'){
          item.isShow = true;
        }
      }
    });
    this.setData({list})
  },
  sliderUrl: function (id) {
    wx.redirectTo({url: `/pages/goodsList/goodsList?list=${id}`});
  },
  // 设置头像
  setUseAvatar: function(){
    let user = this.data.user;
    const {avatarUrl, nickName} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    user.avatarUrl = avatarUrl || '';
    user.nickName = nickName || '';
    this.setData({user})
  },

  onShow: function (options) {
    app.ifWXWork(true);  //企业微信跳转
    if (wx.getStorageSync(KEYSTORAGE.isEnterprise) === true) {
      return;
    }
    this.setUseAvatar();
    if(showFX){
      this.getDistributorUnionId();
    }
    let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    if(!loginInfo){
      return;
    }
    wx.setStorageSync('openOtherMiniprogram', true);
    app.isMemberETO();
    this.getCartList();
    this.getOrderCount();
    app.getCRMInfoFn();
    this.awardActivity();
    this.setData({
      isBestseller: true,
      flagShowIconBackToShopDetail:getApp().globalData.showIconBackToShopDetail,
    })
  },

  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      // 设置头像
      this.setUseAvatar();
      if(app.config.singleBrand){
        // app.getCRMInfoFn();
      }
      this.getOrderCount();
      this.getCartList();
    }
    if(type === EVENTS.EVENT_OREDERCOUNT){
      this.getOrderCount();
    }

    if(type === EVENTS.EVENT_SHOPCOUNT){
      this.getCartList();
    }
  },

 //获取购物车中的商品个数
 getCartList: function () {
  let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
  if(loginInfo){
    let localCartList = wx.getStorageSync(KEYSTORAGE.cartList);
    if(localCartList){
      this.setData({
        shoppingCars: localCartList.data.length
      })
    }
  }
},

  //我的会员卡
  openCard: function () {
    if (!app.checkLogin()) {
      return;
    }
    try {
      app.tdSdkEvent('pageclick_personalcenter_VIPcard', {});
      app.gioTrack('pageclick_personalcenter_VIPcard')
    } catch (e) { }
    let memberData = wx.getStorageSync('memberData');
    let isGetCard = wx.getStorageSync('isGetCard');
    if(isGetCard){
      memberData.cardList ? app.openMemberCard(memberData.cardList) : app.isMemberETO(true);
    }else{
      app.isMemberETO(true)
    }
  },
  toDetailPage: function (e) {
    const {link, index} = e.currentTarget.dataset
    let {list,distributorInfo} = this.data;
    const {needLogin, tdEventName, gioName} = list[index];
    if (needLogin && !app.checkLogin()) {
      return;
    }

    if(tdEventName){
      try {
        app.tdSdkEvent(tdEventName, {})
      }catch (e) {}
    }
    if(gioName){
      app.gioTrack(gioName);
    }
    if(list[index].contents === '客服帮助'){
      this.openHelp();
      return;
    }
    if(list[index].contents.includes('推广')){
      const {distributorId, virtualShopCode} = distributorInfo
      wx.setStorageSync(KEYSTORAGE.guideInfo, Object.assign(distributorInfo, {
        employeeId: distributorId,
        shopCode:virtualShopCode
      }))
    }
    wx.navigateTo({ url: link});
  },
  //去购物
  goshop: function () {
    try {
      app.tdSdkEvent('pageclick_personalcenter_tohomepage', {})
      app.gioTrack('pageclick_personalcenter_tohomepage')
    }catch (e) { }
    app.goBack();
  },
  saveImg(){
    app.gioTrack('pageclick_personalcenter_cs_saveQR');
  },
  copyName(){
    app.gioTrack('pageclick_personalcenter_cs_copywxh')
  },

  //全部订单
  all: function (e) {
    if (!app.checkLogin()) {
      return;
    }
    try {
      app.tdSdkEvent('pageclick_personalcenter_orders', {});
      app.gioTrack('pageclick_personalcenter_orders')
    }catch (e) { }

    wx.setStorageSync('dingdanStatus', {
      index: 0,
      status: ''
    });
    this.goOrderList();
    /*wx.navigateTo({
      url: '../../allDingdan/allDingdan'
    });*/
  },
  goOrderList: function(){
    wx.navigateTo({url: '/pages/allDingdan/allDingdan'})
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: Number(e.currentTarget.id)
    })
  },
  //导航点击
  salesClick: function (e) {
    if (!app.checkLogin()) {
      return;
    }

    let Index = e.currentTarget.id;
    let sales = this.data.sales;
    let tdEventName = sales[Index].tdEventName;
    let orderStatus = sales[Index].status;
    try {
      app.tdSdkEvent(tdEventName, {})
      app.gioTrack( sales[Index].gioName || '')
    }catch (e) {}
    wx.setStorageSync('dingdanStatus', {
      index: Number(Index)+1,
      status: orderStatus
    });
    this.goOrderList();
  },
  toPointsMall: function (e) {
    const {type} = e.currentTarget.dataset
    if (!app.checkLogin()) {
      return;
    }
    const url = "/member/rewardCenter/rcMain/rcMain"
    try {
      app.tdSdkEvent('pageclick_personalcenter_exclusiveMembership', {});
      let eventName = 'pageclick_personalcenter_poionts', eventParam = {}
      if(type === 'bottom'){
        eventName = 'pageclick_personalcenter_downbanner';
        eventParam = {
          slideIdx: 0,
          url
        }
      }
      app.gioTrack(eventName, eventParam)
    }catch (e) {

    }
    wx.navigateTo({url});
  },


  toCollection: function(){
    if (!app.checkLogin()) {
      return;
    }
    app.gioTrack('pageclick_personalcenter_collection')
    wx.navigateTo({
      url: '/pages/collection/collection'
    });

  },

  //购物清单
  toQingdan: function () {
    if (!app.checkLogin()) {
      return;
    }

    try {
      app.tdSdkEvent('pageclick_personalcenter_shoppingcar', {});
      app.gioTrack('pageclick_personalcenter_shoppingcar')
    }catch (e) {

    }
    app.navigateTo('/pages/shoppingCart/shoppingCart')

  },

  //地址管理
  toAdress: function () {
    if (!app.checkLogin()) {
      return;
    }
    try {
      app.tdSdkEvent('pageclick_personalcenter_addressmanagement', {});
    }catch (e) {

    }

    wx.navigateTo({
      url: '/pages/address/address'
    });

  },

  jumpUrl: function (e) {
    const {swiperInfo} = this.data;
    let {index} = e.currentTarget.dataset;
    let {link = ''} = swiperInfo[index];
    try {
      app.tdSdkEvent('pageclick_personalcenter_memberActivity', {});
      app.gioTrack('pageclick_personalcenter_swiper', {
        slideIdx: index,
        url: link
      })
    }catch (e) { }
    if (link){
      app.navigateTo(link)
    }
  },
  //一键拨电话
  toPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-862-8888'
    })
  },

  //联系客服 - 关闭
  closeHelp: function () {
    this.setData({
      callHelp: false
    });
  },

  // 获取其他订单数量
  getOrderCount :function(){
    orderCount().then(res => {
      if(res){
        let  {sales} = this.data;
        sales.forEach(item => {
          item.shoppingCar = res[item.status] || 0
        });
        this.setData({ sales });
      }
    })
  },

  //获取图片素材
  getPics: function() {
    var bannerInfo = {};
    var swiperInfo = [];
    var bottomInfo = {};
    getMemberSwiper().then(res => {
      if(Array.isArray(res) && res.length){
        res.forEach(item => {
          const {type} = item;
          switch (type) {
            case 'swiper':
              swiperInfo.push(item);
              break;
            case 'top':
              bannerInfo = item;
              break;
            case 'bottom':
              bottomInfo = item;
              break;
          }
        });
        this.setData({bannerInfo, swiperInfo, bottomInfo})
      }
    })

  },
  onBackToShopDetail:function(e){
    wx.getStorage({
      key: 'shop_detail_shopBeanList',
      success: (result)=>{
        let transmitList = JSON.stringify(result.data);
        wx.navigateTo({
            url: '/nearbyShops2/shopDetail/shopDetail?shopBeanList=' + transmitList
        })
      },
    });
  },


// 客服二维码
awardActivity: function(){
  let customerService = wx.getStorageSync("customerService");
  let helpData = this.data.helpData;
  if(customerService && customerService.length){
    for(let item of customerService){
      if(item.pageRule){
        helpData.bouncedImage = judgeUrl(item.imgUrl);
        helpData.wxNum = item.pageRule;
        break;
      }
    }
    this.setData({helpData});
  }
},

  /*
    * 客服
    * */
  openHelp: function(){
    try {
      app.tdSdkEvent('pageclick_home_customerservice', {});
    }catch (e) {}
    this.setData({showServe: true})
  },

   // 去掉客服弹窗
   changeShow: function(e){
    this.setData({
      tipShow: false,
      noScroll: false,
    });
  },

  // 20200624------兑吧
  jumpDuiba:function(){
    if (!app.checkLogin()) {
      return;
    }
    let crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let availablepoints = crmInfo.availablepoints ? Math.floor(crmInfo.availablepoints) : 0
    let memberno = crmInfo.memberno  || ''
    let params = {
      credits: availablepoints,
      uid: memberno,
      redirect : ''
    }
    app.gioTrack('pageclick_personalcenter_redeem')
    getFreeLogin(params).then(res=>{
      if (res.data){
        app.goToWebView(res.data)
      }
    })
  },
/*

  * 拨打电话

  * */

 dialing: function(){

  let telPhone = this.data.serverList[0].phone;

  wx.makePhoneCall({

    phoneNumber: telPhone

  })

},

  onDailyCheckInClick:function(){
    wx.navigateTo({
      url: '/dailyCheckIn/main/main',
    });
  },

  onHide: function () {
    getApp().globalData.showIconBackToShopDetail = false;
  },
  onUnload: function () {
    //取消订阅
    console.log("执行取消事件===========");
    events.unregister(this, EVENTS.EVENT_LOGINED);
  }
})
