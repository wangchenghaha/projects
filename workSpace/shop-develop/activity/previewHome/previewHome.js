// pages/test/test.js
const config = require('../../src/config.js');
import { request } from '../../utils/request.js'
import {
  getGuideInfoByOpenId,
  bindGuide
} from '../../service/guide'
import {
  getImageInfo,
  saveImageToPhotosAlbum,
} from '../../service/saveImg'
import { getIndexPage, unionIdToOpenId } from '../../service/mini';
import {
  EVENTS,
  KEYSTORAGE,
  URL_CDN
} from '../../src/const.js'
import {
  translateArray,
  objToQuery,
  judgeUrl,
  dateIsOverDue,
  splitImg, getCurrentUrl, formatDate, handleCouponDate, skuToImg, throttle, isJSONStr, getQueryStringArgs
} from '../../utils/utils'
import {wxShowToast} from '../../utils/wxMethods'
import events from '../../src/events';
import { getConfigJSON } from '../../service/init'
import { awardActivity } from '../../service/order'
import { getCouponList,goodsDetailgetCouponList} from '../../service/coupon'
import { getVoucherList, JLVoucherList, getVoucher } from '../../service/voucher'
import { retailRecNew } from '../../service/goods'
import { liveRoom, roomReplay } from '../../service/livePlayer'
import { wxSubscription } from '../../utils/wxSubscribe'
import { getCRMInfo } from '../../service/member'
import { queryUserPoints} from '../../service/myPets'
const app = getApp();
const {brand, cdn, homeLiveCount = 2, homeLiveReplay, showWish, ETO_BRAND} = app.config;
let loadingTime = null;
let curOptions = {};
let shareTitle = '';

const pageModule = {
  // 大轮播
  largeLoop: 'largeLoop',
  // 小轮播
  loop: 'loop',
  // 2个
  category: 'category',
  // 4个
  categoryFour: 'categoryFour',
  categorySix: 'categorySix',
  categoryThree: 'categoryThree',
  categoryFive: 'categoryFive',
  leftFourRightSix: 'leftFourRightSix',
  leftSixRightFour: 'leftSixRightFour',
  newDragTwo: 'newDragTwo',
  newDragThree: 'newDragThree',
  tuangouBanner: 'tuangouBanner',
  shortVideo: 'shortVideo',
  new: 'new', // 上新
  hot: 'hot',
  flow: 'flow',
  alubm: 'alubm',
  video: 'video',
  guessLike: 'guessLike',
  recommendSale: 'recommendedSale',
  getCoupon: 'getCoupon',
  jumpMiniProgram: 'jumpMiniProgram',
  gifAnimation: 'gifAnimation', // gif动画
  textAnnouncement: 'textAnnouncement',
  rollHorizontally: 'rollHorizontally'
};
const dmpModule = {
  userLike: 'firstPage',
  hotSale: 'firstPageHot'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endTimeObjs : [
      {day: '',hou: '',min: '',sec: '',canShow: -1},
      {day: '',hou: '',min: '',sec: '',canShow: -1}
    ],
    // 配置游戏信息
    games : [],

    // 红包雨倒计时
    hbyJson : {
      img : `https://cdn.bestseller.com.cn/assets/common/image/pet_close.png`,
      downNum : 15, //配置15秒
      canTap : false,
      canShow : false
    },


    // help弹框图片
    helpData:{
      bouncedImage : splitImg('helpBounced.jpg'),
      qrCode : splitImg('helpBouncedQrCode.png'),
      // 2019.06.08 周六临时FOL修改
      wxNum : brand === 'FOL' ? false :config.CUSTOMER_WX_NAME
    },
    // 首页顶部图片
    indexTopImg: splitImg('index_top.jpg'),
    // 搜索框内容
    searchValue: '',
    // 导航列表
    navList: [{
      image: '/images/nav1.jpg',
      text: '会员码',
      isShow: true,
      code: 'memberCode'
    },
      {
        image: '/images/nav2.jpg',
        text: '分类',
        isShow: true,
        code: 'category'
      },
      {
        image: '/images/nav3.jpg',
        text: '购物车',
        isShow: true,
        code: 'cart'
      },
      {
        image: '/images/nav4.jpg',
        text: '绑定导购',
        isShow: true,
        code: 'guide'
      },
      {
        image: '/images/icon-live.jpg',
        text: '直播间',
        isShow: false,
        code: 'navLive'
      }
    ],
    // 轮播图
    swiper: {
      data: [],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 500,
    },
    swiperList: [],
    pageModule: [],
    // 视频图片
    videoTopImg: URL_CDN.VIDEO_TOP,
    shoppingCar: 0, // 购物车商品
    guideLoginPopup: false,
    guideText: '',
    noScroll: false, // 禁止滚动
    indexHeight: '',
    tipShow: false,
    phoneIcon: `${cdn}/assets/common/pub/image/phone.gif`,

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
    customerIcon: splitImg('customer_icon.png', 'common'),
    onlineServiceEnabled:config.onlineServiceEnabled,


    goToTop:{
      isShow: false,
      img: `${cdn}/assets/common/pub/image/2top_red.png`
    },
    guideId:'',
    nickName:'',
    showOfficial: false, //  显示是否关注公众号
    versionName: '',
    advertisement: {
      show: false,
    },
    cardList:[{
      cardId: 'p_4-_jlnCJuWYntMWVPXB7jne7SM',
      code: '038555629331'
    }],
    miniPath: "/pages/index/index",
    miniProgram: {
      appId: 'wx5d6942270983f43b',
      path: 'pages/home/feature/index?alias=yl8D5ghcog ',
      extraData: {
        alias: 'yl8D5ghcog'
      }
    },
    // 营业执照
    business: {
      show: false,
      img: `${cdn}/assets/h5/${brand}/image/Businesslicense.jpg`,
    },
    topBannerShow: false,
    // 新增优惠券
    newAddCoupon:{
      num: 0,
      img: splitImg('coupon_popup.png'),
      show: true,
      checkArr: [
        {text: '我已知晓，7天内不再提醒'}
      ],
      etoBrand: app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand]
    },
    userLikeArr: [],// 猜你喜欢
    hotSaleArr: [], // 热销
    showNickName: false,
    coupon_display: false,
    hasCoupon: false,
    activityInfo:[],
    inputUrl: '/pages/index',
    roomInfo: [],
    showRePlayer: false,
    isFOL: brand === 'FOL',
    projeckName: 'firstPage',
    searchKeyWord: [],
    showSearchKeyWord: false,
    isHomePageLive: false,
    placeholder : '请输入关键词',
    // 群二维码下载
    qunQrCode : false,
    // 群二维码图片
    qunerweima : '',
    // 群下载
    qunxiazaiImg: splitImg('qunxiazai.png','common'),
    memberLevel: '0', // 0 :新人， 1： 普卡， 2: 银卡， 3： 金卡
    showServe: false,
    showWishIcon: {
      show: false,
      img: splitImg('wish_home-icon.png')
    },
    paddingTop: 27,
    keyWordTop: 58,
    // 轮播视频静音按钮
    icon_voice: splitImg('icon_voice.png', 'common'),
    icon_voice_no: splitImg('icon_voice_no.png', 'common'),
    // 是否显示遮罩层
    showMask: true,
    // 显示搜索热词的索引
    showSearchIndex: 10,
    // 显示顶部
    showFixedTop: false,
    searchPos: 20,
    brandLogo: splitImg('logo-black-rect.png?v=1'),
    brandLogoTop: 20
  },
  onSearchKey(e){
    const {text} = e.currentTarget.dataset;
    if(text){
      wx.navigateTo({
        url: `/pages/goodsList/goodsList?listGoodsSelect=${text}`,
      })
    }
  },
  changeVoice(e){
    const {row, index} = e.currentTarget.dataset;
    let {pageModule} = this.data;
    const curSwiperItem = pageModule[row].detailList[index]
    curSwiperItem.videoMuted = !curSwiperItem.videoMuted;
    this.setData({pageModule})

  },
  // 计算轮播进度条宽度
  computeProgress(list = [], curIndex = 0){
    const size = list.length;
    return  ((curIndex + 1) / size) * 100 + '%';
  },
  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {
      //用户登录成功
      this.getCartList();
    }
  },
  _getPage() {
    let pages = getCurrentPages();
    return pages.length && pages[pages.length - 1].route;
  },
  showNickName(e){
    const showNickName = this.data.showNickName;
    this.setData({
      showNickName: !showNickName
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    // 微信数据上报
    app.setIsNewlyOpen(this, options);
    //订阅登录事件
    events.register(this, EVENTS.EVENT_LOGINED);
    // 广告图
    this.advertisement();
    app.setUtmOptions(options);


    if(wx.getStorageSync(KEYSTORAGE.token)){
      const scene = wx.getStorageSync(KEYSTORAGE.wxScene);
      console.log(scene,'场景值**');
      const sceneArr = [1047, 1124, 1089, 1038];
      if(scene && sceneArr.includes(scene)){
        this._getMiniOpenid()
      }
    }
    let wxUserInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    // 获取当前版本号
    this.setData({versionName: app.config.versionName,wxUserInfo})
    // this.awardActivity();
    app.getSearchKeyWords(this);
    app.setShareMoment()
    let param = Object.assign(curOptions, {
      eventName: '打开首页',
      chanId: curOptions.chan_id ? `${curOptions.chan_id}_腾讯有数` : ''
    });
    app._collectData2(param);

  },
  handleOptions: function(options){
    console.log(options,'首页options***************');
    if(options.share_by){
      wx.setStorageSync('shareFromDaogouID', options.share_by);
      wx.setStorageSync('openShareTime', Date.now());
      let shareFromDaogouPageInfo = options;
      shareFromDaogouPageInfo.type = 'zhuanfa';
      app.setShareInfo(shareFromDaogouPageInfo);
    }

    if(options.share_by_shop){
      wx.setStorageSync('shareFromDaogouShop', options.share_by_shop)
    }
    if(options.nickName){
      wx.setStorageSync('shareFromNickName', options.nickName);
    }
    if(options.devFlag){
      wx.setStorageSync(KEYSTORAGE.devFlag, options.devFlag)
    }
    // 分享设备
    if(options.shareDevice){
      wx.setStorageSync(KEYSTORAGE.shareDevice, options.shareDevice)
    }
    // 获chan_id 腾讯有数
    options.chan_id ? wx.setStorageSync(KEYSTORAGE.chanId, options.chan_id) : '';
  },
  // 删除导购分享存储本地的数据
  removeGuideShare: function(){
    wx.getStorageSync('shareCar') ? wx.removeStorageSync('shareCar') : '';
    wx.removeStorageSync('isFromDaogou')

  },
  getMemberGift(e){
    if(!app.checkLogin()){
      return;
    }
    const {link} = e.currentTarget.dataset;
    if(link){
      app.navigateTo(link)
    }
  },
  // 获取用户新增优惠券  待优化
  getNewAddVoucher: function(){
    if(!app.config.showCouponTip){
      return;
    }
    let CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let newCouponTip = wx.getStorageSync(KEYSTORAGE.newCouponTip);
    let newAddCoupon = this.data.newAddCoupon;
    const days = 7; // 7天有效期
    if(newCouponTip && !dateIsOverDue(newCouponTip, days)){
      newAddCoupon.show = false;
      this.setData({newAddCoupon});
      return
    }
    if(CRMInfo){
      const memberno = CRMInfo.memberno;
      const phone = CRMInfo.phone;
      const reqParam = {phone}
      if(app.config.isSaleForce){
        if(phone){
          getVoucher(reqParam).then(res => res ? this.handleVoucherData(res) : '')
        }
        return;
      }
      if(!memberno){
        return
      }
      getVoucherList(memberno).then(voucher => {
        getCouponList(memberno).then(coupon => {
          let allCoupon = [...voucher, ...coupon];
          this.handleVoucherData(allCoupon)
        })
      })
    }
  },
  handleVoucherData(allCoupon){
    let newAddCoupon = this.data.newAddCoupon;
    const curDate = Date.now();
    allCoupon.forEach(item => {
      const newStartDate = new Date(handleCouponDate(item.startdate)).getTime();
      const newEndDate = new Date(handleCouponDate(item.enddate)).getTime();
      const effectDays = 30; // 30天之内
      if(curDate >= newStartDate && !dateIsOverDue(newStartDate, effectDays) && curDate <= newEndDate){
        newAddCoupon.num++;
      }
    });
    this.setData({newAddCoupon});
  },
  checkboxChange: function(e){
    if(e.detail.value.length) {
      wx.setStorageSync(KEYSTORAGE.newCouponTip, Date.now())
    }else{
      wx.removeStorageSync(KEYSTORAGE.newCouponTip)
    }
  },
  closeNewCoupon: function(){
    let newAddCoupon = this.data.newAddCoupon;
    newAddCoupon.show = false;
    this.setData({newAddCoupon})
  },
  goMyCouponList(){
    let {newAddCoupon} = this.data;
    if(newAddCoupon.etoBrand){
      this.closeNewCoupon();
      wx.navigateTo({
        url: `/member/myCouponList/myCouponList?name=${newAddCoupon.etoBrand}`,
      })
    }
  },

  // 获取首页的活动优惠券
  advertisement: function(){
    getConfigJSON().then(res => {
      this.indexImageShow(res.gameListArr);
      app.globalData.configJson = res;
      let bannerTop = res.homeBanner;
      // 顶部banner
      if(bannerTop && bannerTop.isShow){
        this.setData({
          topBannerShow: true,
          indexTopImg: cdn + bannerTop.homeBannerUrl,
        })
      }
      const {isHomePageLive, homewishlist = false, tip = {}} = res;
      let {advertisement, showWishIcon} = this.data;
      // 心愿单
      app.globalData.showWish = showWishIcon.show = homewishlist;
      // 首页弹窗
      if(tip && tip.isShow){
        advertisement = {
          show: tip.isShow,
          imgURL: judgeUrl(tip.imgUrl),
          // imgURL: splitImg('index_activity.jpg'),
          isJump: tip.isJump,
          linkUrl: tip.linkUrl,
        };
      }else{
        this.getNewAddVoucher()
      }

      shareTitle = res.shareTitle || '';
      this.setData({
        showWishIcon,
        isHomePageLive,
        advertisement,
        noScroll: tip.isShow,
        indexHeight: wx.getSystemInfoSync().windowHeight * 2 + 'rpx',
      });
    });
  },
  //获取购物车中的商品个数
  getCartList: function () {
    let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    if(loginInfo){
      let localCartList = wx.getStorageSync(KEYSTORAGE.cartList);
      if(localCartList){
        if(localCartList.data.length){
          app.setCartNum(localCartList.data.length)
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: app.config.title
    });
    this.getSystem();
  },
  getSystem(){
    // 获取右侧胶囊大小
    const {top, height, bottom } = wx.getMenuButtonBoundingClientRect();
    this.setData({
      searchPos: top + (height/4),
      fixedTopHeight: bottom + 20,
    })
  },
  appTDSdkEvent: function(id, params){
    app.tdSdkEvent(id, params);
  },
  /*
   * 点击事件
   */
  onClick: function (e) {
    let dataCode = e.currentTarget.dataset.code || '';
    let dataLink = e.currentTarget.dataset.link || '';
    let dataModule = e.currentTarget.dataset.module || '';
    let dataIndex = e.currentTarget.dataset.index || 0;
    let description = e.currentTarget.dataset.description || '';
    let curModule = this.data.pageModule.filter( item =>{
      return item.moduleType === dataModule
    });
    if (dataLink) {
      // 打开webview pageclick_home_feed
      if(dataLink.includes('https')){
        this.gotoWebView(dataLink);
      }else{
        app.navigateTo(dataLink)
      }
    }

    if(description === 'getCoupon'){  // 专辑页
      if (!getApp().checkLogin()) {
        return;
      } else {
        if( wx.getStorageSync('user_info').phone){
          if(!wx.getStorageSync('wxSubscriptions').isActivity){
            wxSubscription("activity").then(res => {
              this.setData({
                coupon_display: true,
              })
            }).catch(err => {
              this.setData({
                coupon_display: true,
              })
            });
          }else{
            this.setData({
              coupon_display: true,
            })
          }
        }else{
          app.getCRMInfoFn();
        }
      }
      return;
    }
    /* 导航 */
    if (dataCode === 'memberCode') { // 会员卡
      this.openMemberCard();
    } else if (dataCode === 'category') { // 分类
      this.gotoCategory();
    } else if (dataCode === 'cart') { // 购物车
      this.gotoCart();
    } else if (dataCode === 'guide') { //  导购弹窗
      this.guideLoginPopup();
    } else if (dataCode === 'toGuide') { // 进微商城
      this.guideShop();
    }  else if (dataCode === 'cancleBtn') { // 导购弹窗取消
      this.setData({
        guideLoginPopup: false,
        noScroll: false,
      })
    }else if(dataCode === 'tel'){
      this.dialing()
    }else if(dataCode === 'navLive'){
      wx.navigateTo({
        url: '/livePlayer/listView/listView'
      })
    }else if(dataCode === 'help'){
      this.openHelp()
    }else if(dataCode === 'goToTop'){
      this.goToTop()
    }else if(dataCode === 'close'){
      this.closeAdvertisement();
    }else if(dataCode === 'advertisement'){
      this.advertisementClick();
    }else if(dataCode === 'noClose'){
      this.noClose();
    }else if(dataCode.indexOf('rcMain')>-1){
      try {
        this.appTDSdkEvent('pageclick_home_to_mallgoods', {})
      }catch (e) {}
      this.gotoPoints();
    }else if (dataCode === 'businessShow'){
      this.businessShow(true);
    }else if (dataCode === 'businessHide'){
      this.businessShow(false);
    }else if (dataCode.length === 6) { // 列表页
      this.gotoList(dataCode, dataIndex)
    }else if (dataCode.length === 12 || dataCode.length === 9) { // 详情页
      this.gotoDetail(dataCode);
    }
  },
  // 营业执照
  businessShow: function(flag){
    let business = this.data.business;
    flag ? business.show = true : business.show = false;
    this.setData({business})
  },
  // 首页广告点击
  advertisementClick: function(){
    let advertisement = this.data.advertisement;
    if(advertisement.isJump){
      app.jumpUrl(advertisement.linkUrl);
    }
  },
  // 关闭广告
  closeAdvertisement: function(){
    let advertisement= this.data.advertisement;
    advertisement.show = false;
    this.setData({advertisement, noScroll: false,})
  },
  noClose: function(){
    let advertisement= this.data.advertisement;
    advertisement.show = true;
    this.setData({advertisement, noScroll: true,})
  },
  closeServe(){
    this.setData({showServe: false})
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


  /*
  * 客服
  * */
  openHelp: function(){
    try {
      app.tdSdkEvent('pageclick_home_customerservice', {});
    }catch (e) {}
    this.setData({
      // tipShow: true,
      showServe: true,
      // noScroll: true,
      // indexHeight: wx.getSystemInfoSync().windowHeight * 2 + 'rpx',
    });
  },
  // 拨打电话
  callPhone :function(){
    wx.makePhoneCall({ phoneNumber: '400-862-8888' });
  },
  // 复制微信号
  bouncedCopy : function(){

    wx.setClipboardData({
      data: this.data.helpData.wxNum,
      success(res) {
        wx.showToast({
          title: '复制成功', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      }
    })
  },
  // 群二维码
  qunerweimaTap(e){
    // console.log(`群二维码:${JSON.stringify(e)}`)
    let url = e.currentTarget.dataset.detail
    this.setData({qunQrCode : true,qunerweima : url})
  },
  qunCloesd(){
    this.setData({qunQrCode : false})
  },
  qunxiazaiTap(){
    this.qunCloesd()
    app.saveImage(this.data.qunerweima);
  },
  saveHelpImg(){
    app.saveImage(this.data.helpData.bouncedImage);
  },
  saveImage:function(){
    app.saveImage(this.data.helpData.qrCode);
  },
  /*
   * 搜索框的输入值
   * */
  searchInput: function (e) {
    /*this.setSearchValue(e.detail.value);*/
    try {
      this.appTDSdkEvent('pageclick_home_search', {})
    }catch (e) { }
    wx.navigateTo({
      url: '../searchHistory/searchHistory'
    })
  },

  /*
   * 进入导购微商城列表
   *  */
  guideShop: function () {
    this.setData({guideLoginPopup: false, noScroll: false});
    wx.switchTab({
      url:'/pages/weMember/weMember'
    });
  },
  /*
   * 导购弹窗
   * */
  guideLoginPopup: function () {

  },
  /*
   * 跳转购物车
   *  */
  gotoCart: function () {

    // 企业微信
    if (wx.getStorageSync('isWXWork')) {
      return;
    }
    try {
      this.appTDSdkEvent('pageclick_home_shoppingcar', {})
    } catch (e) {}
    //未登录不让进
    if (!app.checkLogin()) {
      return;
    }
    //   if (!wx.getStorageSync(KEYSTORAGE.loginInfo)) {
    //     wx.navigateTo({
    //       url: '/pages/setting/requestPermission'
    //     });
    //     return;
    //   }
    wx.navigateTo({
      // url: '/pages/qingdan/qingdan'
      url: '/pages/shoppingCart/shoppingCart'
    });
  },
  /*
   * 跳转分类
   * */
  gotoCategory: function () {
    try {
      this.appTDSdkEvent('pageclick_home_categoryall', {});
    }catch (e) {}
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  /*
   * 跳转商品列表页
   */
  gotoList: function (dataCode,index) {
    try {
      app.tdSdkEvent(`pageclick_home_feed${index+1}`, {
        AD_CON: dataCode
      });
      app.tdSdkEvent(`pageclick_home_feed`, {
        AD_CON: dataCode
      });
    }catch (e) {

    }
    // wx.navigateTo({ url: `/pages/list/list?list=${dataCode}` })
    wx.navigateTo({ url: `/pages/goodsList/goodsList?list=${dataCode}` })
  },
  /*
   * 跳转商品详情页
   */
  gotoDetail: function (dataCode) {
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${dataCode}`
    })
  },
  /*
   *  打开webview
   */
  gotoWebView: function (linkUrl) {
    this.openWebView(linkUrl);
  },
  openWebView: function(url){
    const utmOptions = getQueryStringArgs(url);
    let linkUrl = encodeURIComponent(url);
    const params = Object.assign(utmOptions, {linkUrl});
    wx.navigateTo({
      url: `/pages/webview/webview${objToQuery(params)}`
    });
  },
  /* 积分商城 */
  gotoPoints: function () {
    wx.navigateTo({url: "/pages/rewardCenter/rcMain/rcMain"});
  },
  /*
   * 打开小程序
   * */
  openMiniProgram: function (appId) {
    wx.navigateToMiniProgram({
      appId: appId,
      path: 'pages/index/index',
      success(res) {},
      fail(res) {}
    });
  },
  /*
   * 扫描二维码
   *  */
  scanning: function () {
    try {
      this.appTDSdkEvent('pageclick_home_qrcode', {})
    } catch (err) {}
    wx.scanCode({
      success: res => {
        res = res.result;
        if (res.indexOf('http://m.') > -1 || res.indexOf('https://m.') > -1) {
          let skuIndex = res.lastIndexOf('/');
          let sku = res.substr(skuIndex + 1);
          if (sku.length >= 12) {
            sku = sku.substr(0, 12);
            this.gotoDetail(sku);
          } else {
            wx.showModal({
              title: '提示',
              content: '扫码无效',
              showCancel: false
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '扫码无效',
            showCancel: false
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.checkGameActivitys() //检测活动

    this.removeLocal();
    this.removeGuideShare();
    this.getCartList();
    this.handleOptions(curOptions);
    app.track();
    // 微信数据上报
    app._browsePage(this);


    let hby_task = wx.getStorageSync('hby_task');
    let folMetTask = wx.getStorageSync('folMetTask');

    if (hby_task == '1' || folMetTask && folMetTask.index == '1'){
      wx.removeStorageSync('hby_task');
      wx.removeStorageSync('folMetTask');

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

          if (hby_task == '1'){
            wx.setStorageSync('hby_task', '2');
          }
          else if (folMetTask && folMetTask.index == '1'){
            wx.setStorageSync('folMetTask', {index : '2', id : folMetTask.id});
          }

          clearInterval(this.hbyInterval)
        }
        this.setData({hbyJson})
      }, 1000);

    }
  },
  _getMiniOpenid:function(){
    let unionid = wx.getStorageSync('unionid');
    if(unionid){
      if(app.config.subscribe){
        let data = {
          unionId: unionid,
          brand: app.config.brand
        };
        unionIdToOpenId(data).then( res =>{
          // subscribe = 1 关注
          this.setData({showOfficial: res.subscribe !== 1})
        })
      }
    } else {

    }
  },

  removeLocal: function(){ // 删除本地导购账号
    let curTime = Date.now();
    let openShareTime = wx.getStorageSync('openShareTime');
    let differDay = Math.floor((curTime - openShareTime) / (1000*60*60*24));
    let shareFromDaogouID = wx.getStorageSync('shareFromDaogouID');
    let shareFromNickName = wx.getStorageSync('shareFromNickName');
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    if(differDay < app.config.differDay){
      if(shareFromDaogouID && guideInfo){
        // this.setData({
        //   guideId:shareFromDaogouID,
        //   nickName: shareFromNickName || ''
        // });
      }
    }else{
      wx.removeStorageSync('shareFromDaogouID');
      wx.removeStorageSync('shareFromNickName')
    }
  },
  onPageScroll: function(e){
    if(throttle(50)){
      const {screenHeight} = wx.getSystemInfoSync();
      let scrollTop = e.scrollTop;
      let {goToTop, showFixedTop} = this.data;
      goToTop.isShow = showFixedTop = scrollTop >= screenHeight;
      this.setData({ goToTop , showFixedTop})
    }
  },
  goToTop: function(){
    wx.pageScrollTo({
      scrollTop: 0
    });
    let goToTop = this.data.goToTop;
    goToTop.isShow = false;
    this.setData({goToTop: goToTop});
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
    app.WXReport('page_reach_bottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let sharePath = '/pages/index/index';
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let guideId = guideInfo.employeeId || '';
    let guideShop = guideInfo.shopCode || '';
    let shareOptions = {
      share_by: guideId,
      share_by_shop: guideShop,
      utm_medium: 'guideshare',
      utm_source: 'miniprogram_zhuanfa',
      utm_term: guideId,
      nickName:wx.getStorageSync(KEYSTORAGE.wxInfo).nickName || '',
      from_share_open_id: app.getOpenId() || '',
      devFlag: app.urlDevFlag(),
      shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || ''
    };
    sharePath = sharePath + objToQuery(shareOptions );
    try {
      app.tdSdkEvent('pageclick_user_share_all', {
        title: app.config.title,
        path: sharePath
      });
      app.tdShare(app.config.title, sharePath);
      const param = {
        from_type: 'menu',
        share_title: app.config.title,
        share_path: sharePath,
        share_image_url: URL_CDN.COVER_SHARE
      };
      app._sharePage(param);
    }catch (e) {

    }

    // share_by=员工编号, share_by_shop=员工所在店铺代码, utm_medium=guideshare,utm_source=miniprogram_zhuanfa,utm_term=员工编号
    return {
      title: shareTitle || app.config.title,
      path: sharePath,
      imageUrl: URL_CDN.COVER_SHARE,
      success: res =>{}
    }
  },
  pageTitle: '首页',
  wxLeavePage(){
    app._leavePage(this);
  },
  onHide:function () {
    wx.removeStorageSync('indexData');
    this.wxLeavePage();
  },
  onUnload: function () {
    wx.removeStorageSync('indexData');
    this.wxLeavePage();
  },

  checkGuide: function () {
    // if(!config.singleBrand){
    let isAuthed = !!wx.getStorageSync(KEYSTORAGE.authed);
    if (!isAuthed) {
      wx.navigateTo({url: '/pages/setting/requestPermission?guide='+"guide" });
    }
    return isAuthed;
    // } else {
    //   let isLogin = !!wx.getStorageSync(KEYSTORAGE.loginInfo);
    //   if (!isLogin) {
    //     wx.navigateTo({url: '/pages/setting/requestPermission'});
    //   }
    //   return isLogin;
    // }
  },
  //测试跳转地址
  // testJump(){
  //   wx.navigateTo({
  //     url: '/pages/share/share?channel=15487443307417&delivery_id=10',
  //   })
  // }



  // 秒杀
  miaosha(e){

    let dataCode = e.currentTarget.dataset.code || '';
    let dataLink = e.currentTarget.dataset.link || '';
    if (dataCode != ''){
      wx.navigateTo({ url: `/pages/goodsList/goodsList?list=${dataCode}` })
    }
    else if (dataLink != ''){
      getApp().navigateTo(dataLink)
    }

  },
  // 检测游戏活动
  checkGameActivitys:function(){

    let gamePath = `${cdn}/assets/wechat/JSON/secondSkill.json`
    this.getSecondSkillJSON(gamePath).then(res=>{


      if (res['games']){
        let arrs = []
        res['games'].forEach(item => {
          if (item.brand.includes(getApp().config.brand)){

            let currentTime = new Date().getTime()
            let startTime = new Date(item.startTime).getTime()
            let endTime = new Date(item.endTime).getTime()
            if (startTime <= currentTime && endTime > currentTime){
              let json = {
                hbyGameImg : item.picUrl,
                gamePath : item.path,
                type: item.type
              };
              arrs.push(json)

            }

          }

        });
        this.setData({games : arrs})
      }

    })
  },

  //悬浮图配置
  indexImageShow: function(gameConfigList){
    if(gameConfigList){
      let {games} = this.data;
      for (let i = 0; i < gameConfigList.length; i++) {
        let json = {
          hbyGameImg : gameConfigList[i].gameImgUrl,
          gamePath :  gameConfigList[i].gameLinkUrl,
          type:  gameConfigList[i].gameAppid,
          isShow:  gameConfigList[i].isgame
        };
        games.push(json)
      }
      this.setData({games})
    }
  },

  // 获取秒杀活动时间json
  getSecondSkillJSON : function(path){
    return new Promise((resolve, reject)=>{
      request({ url:path}).then(res=>{
        resolve(res)
      }).catch((e)=>{
        wx.showToast({
          title: '获取秒杀json失败', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
  },
  timeFormat : function(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param.toString();
  },
  countDown : function(endTime,from){
    let newTime = new Date().getTime();
    let obj = null;

    if (endTime - newTime > 0){
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time / (60 * 60));
      // let hou = parseInt(time % (60 * 60 * 24) % 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        canShow: 1
      }
    }else{//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00',
        canShow: 0
      }
    }
    // console.log('剩余时间:',obj);
    let endTimeObjs = this.data.endTimeObjs
    if (from == 'fenlei'){
      endTimeObjs[0] = obj
    }
    else if (from == 'danzhang'){
      endTimeObjs[1] = obj
    }
    this.setData({
      endTimeObjs
    })
  },
  // 红包雨游戏
  goGame(e){
    let type =  e.currentTarget.dataset.type
    let path = e.currentTarget.dataset.detail
    if(type === 'myPet'){
      if (!app.checkLogin()) {
        return;
      }
      queryUserPoints(app.getOpenId()).then(res =>{
        if(res && res.petInfo){
          wx.navigateTo({
            url: '/activity/myPet/myPet/myPet',
          })
        }else{
          wx.navigateTo({
            url: '/activity/myPet/adoptPet/adoptPet',
          })
        }
      })
    }else{
      app.navigateTo(path)
    }

  },

  hbyTap(){
    if (!app.checkLogin()) {
      return;
    }
    queryUserPoints(app.getOpenId()).then(res =>{
      if(res && res.petInfo){
        wx.navigateTo({
          url: '/activity/myPet/myPet/myPet',
        })
      }else{
        wx.navigateTo({
          url: '/activity/myPet/adoptPet/adoptPet',
        })
      }
    })
  }

});
