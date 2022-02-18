// import tdweapp from './mickeyCustom/sdk/tdweapp.js'


// var TD = require('utils/tdweapp.js');//app.js
const tdweapp  = require('utils/tdweapp-sdk.js');//app.js
var mCard = require("base/memberCard.js");
var main = require("base/main.js");
var url = require("base/url.js");
const config = require('src/config.js')
const brand = config.brand;
let timeStamp = null;
let crmTimeStamp = null;
//add new
import { getQueryStringArgs, dateIsOverDue, getCurrentUrl, objToQuery, getDateByOrder, formatDate, chengfa, isToday, getBrandBySku } from './utils/utils'
import { tongji } from './utils/tongji'
import { URL, KEYSTORAGE, EVENTS } from './src/const.js'
import {  collectData2, wxUserActions} from './service/collect.js'
import { initConfig, resetConfig, wxSubscribeCollection, getConfigJSON } from './service/init.js'
import { initSDK } from './service/service.js';
import {getMiniOpenid,  saveSubscribe} from './service/mini';
import {  wxLogin,  getLzInfo, getWeChatInfo, isMember,getGameInfo, unionIdByCode } from './service/user.js'
import { getCRMInfo } from './service/member'
import events from './src/events';
import { getCouponStatus } from './service/coupon'
import {getCartList} from "./service/cart";
import {getSysUser} from "./service/weMember";
import { wxShowToast } from "./utils/wxMethods"
import { getImageInfo, saveImageToPhotosAlbum, getVideoInfo, saveVideoToPhotosAlbum, downloadFile, authorize, checkAuthSetting, openAuthor } from './service/saveImg'
import {searchKeyWord} from "./service/goods";
let gio = require("./utils/gio-minp.js").default;
const systemInfo = wx.getSystemInfoSync();
console.log(systemInfo, 'systemInfo***')
try {
  if(config.GIO_ONLINE){
    gio('init', config.GIO_PROJECT_ID, config.GIO.SOURCE_ID, config.wxAppid, {
      scheme: 'https',
      host: 'analytics-data.bestseller.com.cn',
      version: config.versionName
      // host: 'analytics-data-uat.bestseller.com.cn'
    });
  }

}catch (err){
  console.error(err)
}
initSDK().then(() => { }).catch(e => { });
initConfig();
let wxappSdk = '', sr = '';
try {
  if(config.wxReportAppid && systemInfo.brand !== 'devtools'){
    wxappSdk = require('./utils/sr-sdk-wxapp.js');
    sr = wxappSdk.init({
      appid: config.wxAppid,
      token: config.wxReportAppid || '',
      debug: false,
      proxyPage: true,
      proxyComponent: true,
      // 建议开启-是否开启页面分享链路自动跟踪
      openSdkShareDepth: true,
      // 建议开启-元素事件跟踪，自动上报元素事件，入tap、change、longpress、confirm
      autoTrack: true,
      //建议开启-自动化获取openId，授权过的小程序可自动化获取openId
      openAutoTrackOpenId: true,
    });
  }
}catch (e) {
  console.error(e);
}

App({
  sr, // 挂载到App实例上
  wxappSdk,
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function (options) {
    initConfig();
    //配置信息挂载再App中
    this.config = config;
    this.checkiPhoneX();
    //add eto
    this.storageInit(options);
    this.checkVersion();
    this.networkStatus();
    this.getNetworkType();
    this.getSDKVersion();
    // this.initApp();
    // this.getWXUserInfo();

    // this.WXReport('app_launch');

    // 摇一摇活动
    this._AccelerometerChange()

    //显示默认标题
    wx.setNavigationBarTitle({ title: config.title });

    //订阅401事件
    events.register(this, EVENTS.EVENT_401);

    this.getConfig()
  },
  // 获取配置信息 json
  getConfig(){
    let _this = this
    return new Promise((resolve,reject)=>{
      getConfigJSON().then(res => {
        _this.globalData.configJson = res;
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    })
  },
  homePageCache(){
    let cacheStatus = false
    const homeDataTime = wx.getStorageSync(KEYSTORAGE.HOME_DATA_TIME);
    const homeData = wx.getStorageSync(KEYSTORAGE.HOME_DATA);
    if(homeData && homeDataTime && Date.now() - homeDataTime <= 2 * 60 * 1000){
      wx.hideLoading();
      console.log('缓存', Date.now() - homeDataTime)
      cacheStatus = true
    }
    return  cacheStatus
  },
  watch(ctx, obj){
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  // 监听属性，并执行监听函数
  observer (data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get () {
        return val
      },
      set (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  },
  setIsNewlyOpen(curPageThis, options){
    curPageThis.is_newly_open = true;
    curPageThis.options = options;
  },
  _getPageTitle(page) {
    return page
      && __wxConfig
      && __wxConfig.page
      && __wxConfig.page[`${page.html}`]
      && __wxConfig.page[`${page.html}`].window
      && __wxConfig.page[`${page.html}`].window.navigationBarTitleText
  },
  // 页面浏览
  _browsePage(curPageThis){
    /*try {
      curPageThis.showTime = Date.now();
      console.log(curPageThis.showTime,'curPageThis.showTime')
      let page = getCurrentUrl() ;
      const type = 'browse_wxapp_page';
      sr.track(type, {
        page: page,
        page_title: curPageThis.pageTitle || config.title, // 若没有标题栏或标题是动态设置，则此方法可能无效需要自己记录page_title值
        refer_page: getApp().refer_page,
        is_newly_open: true,
      });
      this.refer_page = page;
      // this.WXReport(type, { page })
    }catch (e) {}*/
  },
  wxReportSearch(curPageThis, keyword){
    if(!config.wxReportAppid){
      return;
    }
    try {
      curPageThis.showTime = Date.now();
      let page = getCurrentUrl() ;
      const type = 'search';
      sr.track(type, {
        keyword,
        page: page,
        page_title: curPageThis.pageTitle || config.title, // 若没有标题栏或标题是动态设置，则此方法可能无效需要自己记录page_title值
        refer_page: getApp().refer_page,
        is_newly_open: true,
      });
      this.refer_page = page;
      // this.WXReport(type, { page, keyword })
    }catch (e) {}
  },
  // 页面离开
  _leavePage(curPageThis){
    /*if(!config.wxReportAppid){
      return;
    }
    try {
      const  stay_time = Date.now() - curPageThis.showTime
      sr.track('leave_wxapp_page', {stay_time})
      curPageThis.is_newly_open = false;
    }catch (e) {
      console.error(e,'error')
    }*/
  },
  // 页面分享
  _sharePage(param){
    /*if(!config.wxReportAppid){
      return;
    }
    const shareParam = {
      from_type: 'menu',
      share_title: config.title,
    }
    Object.assign(shareParam, param)
    sr.track('page_share_app_message', shareParam);*/
    // this.WXReport(type, param)
  },
  // 微信支付数据上报
  wxPaymentReport(bigorderCode = '', status = '', payPrice = 0){
    if(!config.wxReportAppid){
      return;
    }
    try{
      // 微信数据上报
      const orderInfo = {
        page_title: '微信支付',
        order: {
          order_id: bigorderCode,
          order_time: getDateByOrder(bigorderCode),
          order_status: status,
        },
        sub_orders: [{
          sub_order_id: bigorderCode,
          order_amt: Number(payPrice),
          pay_amt: Number(payPrice)
        }]
      };
      sr.track('custom_order', orderInfo);
    }catch (e) { }
  },
  // 微信数据上报
  WXReport: function(type, data){
    if(!config.wxReportAppid){
      return;
    }
    try{
      sr.track(type, data)
    }catch (e) {}
  },
  // 数据上报设置用户信息
  setWXReportUserInfo(open_id){
    if(!config.wxReportAppid){
      return;
    }
    try {
      // 设置必要的用户信息
      sr.setUser({
        app_id: config.wxAppid || '',
        open_id,
      });
      // 开启上报
      sr.startReport()
    }catch (e) {}
  },
  // 分享朋友圈
  setShareMoment(){
    try {
      // 零售要求
      if(brand !== 'FOL'){
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
      }
    }catch (e) { }
  },
  /**
   * GIO埋点
   * @param eventId 事件标识符
   * @param eventLevelVariables 必填，如果没有可以填一个空对象 {}
   */
  gioTrack(eventId, eventLevelVariables = {}){
    try {
      const {spu_id = '' } = eventLevelVariables
      if(spu_id && spu_id.length >= 9){
        const brand = getBrandBySku(spu_id);
        const productyear = spu_id.slice(1, 3);
        const productySeason = spu_id.slice(1, 4);
        const category = spu_id.slice(4,6)
        Object.assign(eventLevelVariables, {brand , productyear, productySeason, category})
      }
      const { openId, unionId } = wx.getStorageSync(KEYSTORAGE.wxInfo);
      Object.assign(eventLevelVariables, {
        BS_OPEN_ID: openId || wx.getStorageSync(KEYSTORAGE.openid) || '',
        BS_UNION_ID: unionId
      })
      gio('track', eventId, eventLevelVariables);
    }catch (err){}
  },
  /**
   * 接收401事件(自有平台用户登录态失效)
   */
  handleEvent: function (event, type) {

    //删除登录信息
    wx.removeStorageSync(KEYSTORAGE.loginInfo);
    wx.removeStorageSync(KEYSTORAGE.token);
    wx.removeStorageSync('dingdanAddress');

    if (type === EVENTS.EVENT_401) {
        initSDK().then((token) => { //获取新令牌
          this.initApp();  //重新登录
        }).catch(e => { });
    }

  },
  /**
   * 首次进入程序初始化操作
   */
  initApp: function () {

    let that = this;

    let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo); //登录内容
    let token = wx.getStorageSync(KEYSTORAGE.token); //登录凭证
    if (loginInfo && token) { //已登录
      wx.checkSession({ //检查小程序会话期
        success: () => console.log('小程序登录态有效'),
        fail: () => {
          resetConfig();
          initSDK().then((token) => {
            that.login()
          }).catch(e => { });
        }
      })
    } else {
      if (wx.getStorageSync(KEYSTORAGE.authed) === false) {
        wx.navigateTo({ url: '/pages/setting/requestPermission', });
      } else {
        that.login()
      }
    }
  },
  wxWebSocket: function(data){
    let socketOpen = false;
    !data ? data = '' : '';
    wx.connectSocket({
      url: `wss://couponfol.bestseller.com.cn?param=${wx.getStorageSync(KEYSTORAGE.token)}`
    });
    return new Promise((resolve, reject) => {
      wx.onSocketOpen(res => {
        socketOpen = true;
        if(socketOpen){
          wx.sendSocketMessage({ data });
          wx.onSocketMessage(res => {
            // res = {"code":"200","data":"{\"VIDEO_CARD\":\"{\\\"code\\\":1,\\\"msg\\\":\\\"不满足发券条件！\\\"}\",\"page\":\"/orderComplete\",\"openMethod\":\"page\",\"order\":{\"unionid\":\"ozYoQs53Ni9hIaF0p8S3rVzX1PqQ\",\"orderId\":340200126616174593,\"orderItemList\":[{\"goodsCount\":1,\"bigOrderId\":1656227,\"goodsStatus\":\"WaitingShipment\",\"bigOrderCode\":\"91420190528183324008\",\"orderItemId\":1133320470151675906,\"price\":1.00,\"discount\":0.50,\"goodsColorCode\":\"418105502A06\",\"sku\":\"418105502A06380\"}],\"payTime\":1559039630798,\"openid\":\"oEQ4S0fBoWUT8-WK8rr59Q6T-G9A\",\"shareBy\":\"\",\"shareShop\":\"\",\"orderStatus\":0,\"payWay\":\"WeChatPay\",\"isLift\":false,\"miniOpenid\":\"oEQ4S0fBoWUT8-WK8rr59Q6T-G9A\",\"bigOrderCode\":\"91420190528183324008\",\"createTime\":1559039630798,\"phone\":\"18813068824\",\"payPrice\":1.0,\"expressFare\":0.0,\"id\":1656227,\"shopGuideId\":\"\",\"brand\":\"SELECTED\",\"goodsTotalCount\":1,\"channelCode\":\"MINIPROGRAM\",\"memberId\":\"718515\",\"status\":\"WaitingShipment\"}}","success":true};
            resolve(res.data)
          })
        }
      });
    })
  },
  getCRMInfoFn: function(){
    let param = {
      brand: config.etoBrand,
      unionId: wx.getStorageSync(KEYSTORAGE.unionid) || ''
    };
    const curTime = Date.now();
    if(crmTimeStamp && curTime - crmTimeStamp < 1000){
      wx.hideLoading();
      return
    }
    crmTimeStamp = curTime;
    wx.showLoading({
      title: '加载中...'
    });
    getCRMInfo(param).then(res =>{
      wx.hideLoading();
       wx.setStorageSync(KEYSTORAGE.crmInfo, res);
      events.post(true, EVENTS.EVENT_CRMINFO);
    }).catch(err => wxShowToast(err.message));
  },
  getGuideInfo: function(data){
    return new Promise( (resolve, reject) => {
      getSysUser(data).then( res => {
        // 员工类型 office公司、retail
        res.shopCode = res.STAFF_TYPE === 'OFFICE' ? '0000' : res.SHOPCODE;
        res.shopName = res.STAFF_TYPE === 'OFFICE' ? '内部员工' : res.DEPT_NAME;
        res.employeeId = res.STAFF_NO;
        const {avatarUrl, nickName} = wx.getStorageSync(KEYSTORAGE.wxInfo);
        Object.assign(res, {portraitPic: avatarUrl, nickName});
        wx.setStorageSync(KEYSTORAGE.guideInfo, res);
        resolve(res)
      }).catch( err => {
        reject(new Error(err.message))
      })
    })
  },
  getWxPhone: function(encryptedData, iv){
    return new Promise((resolve, reject) => {
      wxLogin().then(jsCode => {
        return jsCode;
      }).then( js_code => {
        const wxInfoParam = { brand, js_code, encryptedData, iv};
        getWeChatInfo(wxInfoParam).then( phoneRes => {
          resolve(phoneRes.phoneNumber)
        }).catch(err => {
          reject(new Error(err))
        })
      })
    })
  },
  setRoomId(roomId, start_time){
    if(roomId && start_time){
      const {ETO_BRAND, brand} = config;
      const startTime = formatDate(start_time * 1000, '');
      const date = startTime.replace(/-/g, '');
      wx.setStorageSync(KEYSTORAGE.setRoomIdDate, Date.now());
      wx.setStorageSync(KEYSTORAGE.orderRoomId, `${ETO_BRAND[brand]}${roomId}${date}LIVE`)
    }
  },
  cleanUtmOption: function(){
    const daogouLists = wx.getStorageSync('daogouLists');
    const openShareTime = wx.getStorageSync('openShareTime');
    const setRoomIdDate = wx.getStorageSync(KEYSTORAGE.setRoomIdDate);
    const roomIdOverDay = 1;
    // 直播间id保存一天
    if(setRoomIdDate && dateIsOverDue(setRoomIdDate, roomIdOverDay)){
      wx.removeStorageSync(KEYSTORAGE.roomId);
      wx.removeStorageSync(KEYSTORAGE.setRoomIdDate)

    }
    // 微商城以及utm参数过期时间
    const overDay = 15;
    if(daogouLists && daogouLists.length){
      const storeTime = daogouLists[0].times;
      if(storeTime){
        if(dateIsOverDue(storeTime, overDay)){
          wx.removeStorageSync('daogouLists')
        }
      }
    }
    if(openShareTime){
      if(dateIsOverDue(openShareTime, overDay)){
        wx.removeStorageSync('openShareTime');
        wx.removeStorageSync('shareFromDaogouID');
        wx.removeStorageSync('shareFromDaogouInfo');
      }
    }
  },
  // 设置分享的数据
  setShareInfo(data){
    if(data && data.share_by){
      let wxScene = wx.getStorageSync(KEYSTORAGE.wxScene);
      try{
        const onLaunchOptions = wx.getEnterOptionsSync();
        if(onLaunchOptions && onLaunchOptions.scene){
          wxScene = onLaunchOptions.scene;
        }
      }catch (e) {}
      Object.assign(data, {wxScene});
      wx.setStorageSync('shareFromDaogouInfo', data);
      wx.setStorageSync('openShareTime', Date.now())
    }
    console.log(data,'******分享数据');
  },
  // 设置UTM参数
  setUtmOptions: function(options){
    let daogouLists = [];
    if (options.utm_medium || options.utmMedium) {
      daogouLists.push(
        {
          key: 'utmMedium',
          value: options.utm_medium || options.utmMedium,
          times: Date.now()
        }
      );
    }
    if (options.utm_source || options.utmSource) {
      daogouLists.push(
        {
          key: 'utmSource',
          value: options.utm_source || options.utmSource,
          times: Date.now()
        }
      );
    }
    if (options.utm_campaign || options.utmCampaign) {
      daogouLists.push(
        {
          key: 'utmCampaign',
          value: options.utm_campaign || options.utmCampaign,
          times: Date.now()
        }
      );
    }
    if (options.utm_term || options.utmTerm) {
      daogouLists.push(
        {
          key: 'utmTerm',
          value: options.utm_term || options.utmTerm,
          times: Date.now()
        }
      );
    }
    if (daogouLists.length > 0) {
      wx.setStorageSync('daogouLists', daogouLists);
    }
  },
  // 获取UTM参数
  getUtmOptions(){
    const utm = {};
    const utmOptions = wx.getStorageSync(KEYSTORAGE.utmOptions);
    if(utmOptions && utmOptions.length){
      utmOptions.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          utm[item.key] = item.value;
        }
      })
    }
    return utm
  },
  async setUserOpenId(){
    let { nickname, avatarUrl, gender, country, province, city, language} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let openId = wx.getStorageSync(KEYSTORAGE.openid);
    let unionId = wx.getStorageSync(KEYSTORAGE.unionid);
    if(!openId || !unionId){
      let code = await wxLogin();
      let res = await unionIdByCode(code);
      unionId = res.unionid;
      openId = res.openid
      wx.setStorageSync(KEYSTORAGE.openid, openId);
      wx.setStorageSync(KEYSTORAGE.unionid, unionId);
    }
    // GIO 埋点
    gio('identify', openId)
    gio('setUserId', openId);
    gio('setUserAttributes', {
      $wechat_openId: openId,
      $wechat_unionId: unionId,
      $wechat_nickName: nickname || '',
      $wechat_avatarUrl: avatarUrl || '',
      $wechat_gender: gender || '',
      $wechat_country: country || '',
      $wechat_province: province || '',
      $wechat_city: city || '',
      $wechat_languag: language || '',
    });
    // 有数
    this.setWXReportUserInfo(openId);
    // 埋点
    this.tdSdkEvent('login_uploadopenid_openid',{});
    // 微信用户行为 打开小程序
    if(brand === 'JACKJONES' || brand === 'VEROMODA'){
      let data = [];
      data.push({
        action_type:'INIT',
        action_param:{}
      });
      wxUserActions(data);
    }
  },
  //登录逻辑
  login: function (isGuide) {
    let isEnterprise = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    if(isGuide){
      wx.setStorageSync(KEYSTORAGE.openid, wxInfo.openId);
      wx.setStorageSync('wxOpenID', wxInfo.openId);

      events.post(true, EVENTS.EVENT_GUIDE)
      this.gameLogin();
      return
    }
    if(wxInfo.openId && !isGuide){
      wxInfo.unionId ? wx.setStorageSync(KEYSTORAGE.unionid, wxInfo.unionId) : '';
      wx.setStorageSync(KEYSTORAGE.openid, wxInfo.openId);
      wx.setStorageSync('wxOpenID', wxInfo.openId);

      let isMember = wx.getStorageSync('isMember');
      if(isMember || this.config.useWXPhone || brand === 'BESTSELLER'){
        this.lzInfo();
      }else{
        // 注册会员
        this.isMemberETO()
      }
    }
  },
  //手机号查询并注册crm
  gameLogin(){
    let utmData = wx.getStorageSync('daogouLists');
    let json = {
      brand,
      phone : wx.getStorageSync(KEYSTORAGE.wxPhone) || ''
    }
    if(utmData && utmData.length){
      utmData.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          json[item.key] = item.value;
        }
      })
    }
    let _this = this
    getGameInfo(json).then(res => {
      if (res){
        if (!res.joindate){
            res.joindate = formatDate(new Date().getTime(),true)
        }
        if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
          _this.lzInfo(res)
        }
        else{
          wx.setStorageSync(KEYSTORAGE.gameCRMInfo, res);
          events.post(true, EVENTS.EVENT_GAMECRMINFO)
        }
      }
    })
  },
  lzInfo: function(gameRes){
    let {openId = '', unionId = '', nickName = '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let param = { openId, unionId, nickName, avatarUrl};
    if(config.useWXPhone){
      param = {
        phone: wx.getStorageSync(KEYSTORAGE.wxPhone) || '',
        unionid: unionId,
        openid: openId,
        channelCode: config.CHANNEL_ID,
        brand,
      }
    }
    const curTime = Date.now();
    if(timeStamp && curTime - timeStamp < 1500){
      return
    }
    timeStamp = curTime;
    wx.showLoading({title:'正在登录...', mask: true});
    getLzInfo(param).then(res => {
      wx.hideLoading();
      wx.setStorageSync(KEYSTORAGE.loginInfo, res);
      events.post(true, EVENTS.EVENT_LOGINED);
      if (gameRes){

        wx.setStorageSync(KEYSTORAGE.gameCRMInfo, gameRes);
        events.post(true, EVENTS.EVENT_GAMECRMINFO)
      }
      const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      !crmInfo ? this.getCRMInfoFn() : ''
    }).catch(err => wxShowToast(err.message))
  },
  // 购物车列表
  getCart: function(currentPage){
    const loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    let param = {
      pageSize: 10,
      currentPage,
      memberId: loginInfo.id || ''
    };
    return new Promise((resolve, reject) => {
      const curTime = Date.now();
      if(timeStamp && curTime - timeStamp < 1500){
        wx.hideLoading();
        return
      }
      timeStamp = curTime;
      getCartList(param).then(res => {
        resolve(res);
        wx.setStorageSync(KEYSTORAGE.cartList, res);
      }).catch(err => {
        reject(new Error(err.message))
      })
    })
  },
  // 购物车改变更新本地缓存
  changeLocalCart: function(cartNum){
    let localCartList = wx.getStorageSync(KEYSTORAGE.cartList) || {};
    localCartList.totalCounts = cartNum;
    wx.setStorageSync(KEYSTORAGE.cartList, localCartList);
  },
  loginETO: function(){
    console.log('授权登录*****************');
    wx.navigateTo({url: '/pages/etoLogin/etoLogin'})
  },
  /*
  * openCard 非必填，打开会员卡
  * */
  isMemberETO: function(openCard){
    const unionid = wx.getStorageSync(KEYSTORAGE.unionid);
    // 只有打开卡券的时候才掉接口
    if(config.useWXPhone && !openCard){
      return;
    }
    if(brand === 'BESTSELLER'){
      return;
    }
    if(!unionid){
      this.goSetting();
      return
    }
    let loadingTime = setTimeout( ()=> {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
    }, 800);
    isMember(getApp().config.etoBrand).then( res => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      console.log('判断是否是会员', res,'errcode' ,typeof(res.errcode) );
      if(res.errcode === 0){
        wx.setStorageSync('isGetCard', res.is_get_card);
        if(res.is_member){
          wx.setStorageSync('isMember', 1);
          const loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
          if(!loginInfo){
            // 登录 柴 ETO的接口在2s之后才会返回数据
            wx.showLoading({
              title: '登录...',
              mask: true
            });
            let loginTime = setTimeout(() => {
              this.lzInfo();
              clearTimeout(loginTime);
            }, 2000)
          }
          if(res.is_get_card === 0){
            console.log('是会员，未领卡');
            console.log(res.activatemembercard_url,'是会员，未领卡,res.activatemembercard_url***');
            if(openCard){
              this.registerMember(res.activatemembercard_url)
            }
          }else{
            console.log('是会员，已领卡');
            wx.setStorageSync('isMember', 1);
            wx.setStorageSync('memberData', res.data);
            if(openCard){
              let cardList = res.data.cardList;
              this.openMemberCard(cardList);
            }
          }
        }else{
          // 不是会员
          console.log('不是会员，注册');
          if(res.is_get_card === 0){
            console.log(res.activatemembercard_url,'res.activatemembercard_url***');
            this.registerMember(res.activatemembercard_url)
          }else{
            if(res.data && res.data.cardList){
              let cardList = res.data.cardList;
              this.getMemberCard(cardList);
              // this.openMemberCard(cardList);
            }
          }
        }
      }else{

      }
    }).catch(err => {
      wx.showToast({
        title: err.message
      })
    })
  },
  openMemberCard: function(cardList){
    wx.openCard({
      cardList: cardList,
      success: function () {
        console.log('成功进入opencard');
      },
      fail: function (res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  // 注册会员新 20190221  --yxw
  registerMember: function(url){
    let queryObj = getQueryStringArgs(url);
    let data = {
      biz: queryObj.biz,
      encrypt_card_id: queryObj.encrypt_card_id,
      outer_str: queryObj.outer_str
    };
    wx.setStorage({
      key: 'isLogin',
      data: true,
      success: function(){
        console.log('registerMember2222222222', data);
        wx.navigateToMiniProgram({
          appId: config.openCardAppId, // 固定为此 appid，不可改动
          extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
          success: function (res) {
            wx.setStorageSync('isStart', 1);
	          wx.setStorageSync(KEYSTORAGE.openCardPage, getCurrentUrl());

          },
          fail: function (res) {
            console.log(res, "navigateToMiniProgram-fail");
            wx.hideLoading();
          }
        })
      },
      fail: function() {
        // fail
      }
    }) //设置参数
  },
  // 判断是否是会员
  isMember: function(isGetVoucher){
    let unionid = wx.getStorageSync(KEYSTORAGE.unionid);
    let isMember = wx.getStorageSync('isMember');
    if(!this.config.singleBrand){
      return;
    }
    if(isMember){
      isGetVoucher ? this.goToWebView(isGetVoucher): ''
    }else{
      if(!unionid){
        wx.showLoading({
          title: '加载中...',
          mask: true
        });
        wxLogin().then(resCode => {
          getMiniOpenid(resCode, config.brand).then(res => {
            // 没有关注公众号没有unionid
            wx.hideLoading();
            if(res.unionid){
              wx.setStorageSync(KEYSTORAGE.unionid, res.unionid);
              this.register(isGetVoucher);
            }else{
              // 授权页面
              this.goSetting()
            }
          });
        })
      }else{
        this.register(isGetVoucher);
      }
    }
  },
  // 注册会员
  register: function(isGetVoucher){
    if(!this.config.singleBrand){
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    isMember(getApp().config.etoBrand).then(res => {
      wx.hideLoading();
      if(res.errcode === 0){
        wx.setStorageSync('isMember', res.is_member);
        if(!res.is_member){
          if(res.is_get_card){
            // 已领卡，未激活
            const cardList = [{
              cardId: res.data.cardList[0].cardId,
              code: res.data.cardList[0].code,
            }];
            this.activeMemberCard(cardList, isGetVoucher);
          }else{
            // 未领卡
            const cardList = [{
              cardId: res.data.cardList[0].cardId,
              cardExt: res.data.cardList[0].cardExt
            }];
            this.getMemberCard(cardList, isGetVoucher)
          }
        }else{
          wx.setStorageSync('isMember', 1);
          if(isGetVoucher){
            if(res.is_get_card){
              this.goToWebView(isGetVoucher)
            }else {
              // 未领卡
              const cardList = [{
                cardId: res.data.cardList[0].cardId,
                cardExt: res.data.cardList[0].cardExt
              }];
              this.activeMemberCard(cardList, isGetVoucher);
            }
          }
          isGetVoucher ? this.goToWebView(isGetVoucher): ''
        }
      }
    })
  },
  //
  /*
  * 激活会员卡
  * param1 ： 会员卡签名
  * param: 是否领取优惠券
  * */
  activeMemberCard: function(cardList, isGetVoucher){
    wx.openCard({cardList,
      success: (e) => {
        wx.setStorage({
          key: "isMember",
          data: 1
        });
        isGetVoucher ? this.goToWebView(isGetVoucher): ''
      }
    })
  },
  //
  /*
  * 领取会员卡
  * param1: 卡券签名
  * param2：是否领取优惠券（非必填）
  * */
  getMemberCard: function(cardList, isGetVoucher){
    wx.addCard({cardList,
      success: ()=> {
        //领卡成功直接激活
        isMember(getApp().config.etoBrand).then( res => {
          if(res.errcode === 0){
            if(!res.is_member && res.is_get_card){
              // 已领卡，未激活
              const cardList = [{
                cardId: res.data.cardList[0].cardId,
                code: res.data.cardList[0].code,
              }];
              this.activeMemberCard(cardList, isGetVoucher);
            }
          }
        });
      }
    });
  },
  // 跳转url
  jumpUrl: function(url){
    if(typeof url !== 'string'){
      return
    }
    (!url.startsWith('/')) ? url = `/${url}` : '';
    wx.navigateTo({url})
  },
  ifWXWork: function (iswitchTab) {
    // iswitchTab  判断是否是底部导航栏
    if (wx.getStorageSync(KEYSTORAGE.isEnterprise)) {
      iswitchTab ? this.goBack() : '';
      return false;
    }
  },
	urlDevFlag(){
		return wx.getStorageSync(KEYSTORAGE.isEnterprise) ? config.WX_WORK : 'wxPeople'
	},

  //调用一下，为了获取unionid，并存在缓存中
  getUnionid: function () {
    //为了获取用户的unionid,便于用户提交订单时，根据用户的unionid判断用户是不是会员
    var isCallbackCard = wx.getStorageSync('isCallbackCard')
    if (1 != isCallbackCard) {
      mCard.isMember(function (isMember) {
        if (isMember == 200) {
          var _user_info = wx.getStorageSync("user_info")
          if (!_user_info.name) {
            main.request(url.getUserinfo, { brand: this.config.etoBrand }, function (res) {
              wx.setStorageSync("user_info", res.data.data.user_info);
            }, 1);
          }
        }
      }, 1, 1);
      wx.setStorageSync("isCallbackCard", "");
    };
  },

  getOpenId: function(){
    const openid = wx.getStorageSync(KEYSTORAGE.openid) || wx.getStorageSync(KEYSTORAGE.loginInfo).openid || wx.getStorageSync("wxOpenID")||'';
    return openid;
  },
  checkWeMallLogin() {
    wx.removeStorageSync(KEYSTORAGE.curPath);
    const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    if(!guideInfo.employeeId){
      wx.setStorageSync(KEYSTORAGE.curPath, `/${getCurrentUrl()}`);
      wx.switchTab({
        url: '/pages/weMember/weMember'
      })
    }
  },
  checkLogin: function () {
    let authed = !!wx.getStorageSync(KEYSTORAGE.authed);
    const authPath = config.useWXPhone ? '/member/login/login' : '/pages/setting/requestPermission';
    if(!authed){
      wx.navigateTo({url: authPath});
      return authed;
    }else{
      let isLogin = !!wx.getStorageSync(KEYSTORAGE.loginInfo);
      if(!isLogin){
        this.login()
      }
      return isLogin;
    }
    /*if(!config.singleBrand){
      if (!authed) {
        wx.navigateTo({url: '/pages/setting/requestPermission'});
        return authed;
      } else {
        let isPermisssion = wx.getStorageSync(KEYSTORAGE.loginInfo).openid;
        if(!isPermisssion){
          wx.navigateTo({url: '/pages/registerVip/registerVip'});
        }
        return isPermisssion;
      }
    } else {

    }*/
  },
  //全局属性
  globalData: {
    gio,
    // getConfigJSON配置文件
    configJson : {},
    //add eto
    hasLogin: false,
    openid: null,
    couponCode: null,  //优惠券核销时，给后台传递参数
    cardCode: null,  //会员卡核销时，给后台传递参数
    couponsInfo: null,  //优惠卷信息
    cardData: null, //会员卡信息

    lastTimeMillis:0,

    showIconBackToShopDetail:false,
    // 心愿单
    showWish: false,
    // 添加小程序提示
    addTipShow: false,
    tabBarList: ['pages/index/index', "pages/memberCenter/memberCenter", 'pages/weMember/weMember', 'pages/informatNew/informat', "pages/informat/informat", "pages/guide/guide", ]
  },
  setCartNum(num){
    if(brand !== 'FOL'){
      wx.setTabBarBadge({
        index: brand === 'BESTSELLER' ? 1 : 2,
        text: `${num}`
      })
    }

  },
  checkVersion: function(){
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log('请求完新版本信息的回调',res)
    });

    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
      /*wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })*/
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  //add eto
  onShow: function (data) {
    let subscriptionType = {
      isCoupon: false,
      isShopCart: false,
      isOrderPay: false,
      isRefund: false,
      isActivity: false,
      isPaySuccess: false,
      isPintuanPaySuccess : false,
      isNewGoodsNotice: false,
      isJumpGame: false
    }
    wx.setStorageSync('wxSubscriptions', subscriptionType);
    wx.setStorageSync('appInitData', data);
    wx.setStorageSync('recommed', false);
    try {
      const res = wx.getSystemInfoSync();
      wx.setStorageSync('systemData', res);
    } catch (e) {}
    console.log("apponshow", data)
    //update jiraiya 2020/7/3
            //处理开卡成功回调
            //新的注册时只要储存isLoginNew
            //注册完成时会调用当前页面的registerCallBack方法,所以可以再需要注册的页面里添加registerCallBack方法来处理自己的业务逻辑
    //新开卡提交 alex ---update 2019-01-22
    // console.log('isStart app.js',wx.getStorageSync('isStart'))
    // setTimeout(() => {
    //   if(wx.getStorageSync('isStart') == 5) {
    //     wx.removeStorageSync('isStart');
    //     wx.removeStorageSync('isLogin');
    //     wx.setStorageSync('ismember', true)
    //     wx.redirectTo({
    //       url: '/fightgroup/coupon/coupon'
    //     })
    //   }
    // },3000)
    // return false
    if (typeof data.referrerInfo != "undefined" && data.referrerInfo && data.referrerInfo.appId) {
      if (data.referrerInfo.extraData && data.referrerInfo.extraData.wx_activate_after_submit_url) {
        // 开卡成功
        //获取uinionid判断
        console.log('准备进入注册');
        var needRegister = wx.getStorageSync('isLogin');
        var needRegisternew = wx.getStorageSync('isLoginNew');
        if(needRegister || needRegisternew){
          console.log("进入注册");
          var unionid = wx.getStorageSync("unionid");
          if(unionid){
            var urlRegister = data.referrerInfo.extraData.wx_activate_after_submit_url;
            var reg = /https/;
            if(!reg.test(urlRegister)){
              urlRegister = urlRegister.replace(/http/,'https'); //卡券激活地址勿改
            }
            // 修改入会渠道 18-06-19 by golan
            main.request(urlRegister, { activate_ticket: data.referrerInfo.extraData.activate_ticket, register_source: 'miniapp',unionid}, function (res) {
              if (res.data.errcode == 0) {
                wx.setStorageSync('isMember', 1);
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                try{
                  sr.track('register_wxapp', {
                    "page": currentPage.route,
                    "page_title": "注册登陆页",
                    "time": Date.now(),
                  });
                }catch (e) {}
                if (wx.getStorageSync('isLoginNew')) {
                    let pages = getCurrentPages();
                    let currentPage = pages[pages.length - 1] || {};
                    let currentPageRoute = currentPage.route || currentPage.__route__;
                    console.log("开卡成功，调用页面", currentPageRoute);
                    //需要注册的页面先写好registerCallBack方法，注册成功后会手动调用这个方法，在这个方法里再去处理页面的业务逻辑
                    currentPage.registerCallBack && currentPage.registerCallBack()
                    wx.removeStorageSync('isLoginNew');
                    return false
                }
                if(wx.getStorageSync('isStart')==2){
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                } else if (wx.getStorageSync('isStart')==3) {
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.setStorageSync('ismember', true)
                  wx.setStorageSync('backCustomService', 1)
                  console.log('回到页面重新开始')
                  wx.redirectTo({
                    url: '/CustomService/index/index'
                  })
                }else if(wx.getStorageSync('isStart')=='etoGetCoupon'){
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: wx.getStorageSync('etoSendCouponPath')
                  })
                }else if (wx.getStorageSync('isStart')==6) {
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/getcoupon/getcoupon/getcoupon',
                  })
                }else if (wx.getStorageSync('isStart')==5) {
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.setStorageSync('ismember', true)
                  wx.redirectTo({
                    url: '/fightgroup/coupon/coupon'
                  })
                }else if (wx.getStorageSync('isStart')==7) {
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/advancesale/index/index?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==8) {
                  console.log("app.js进入8")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/mickeyCustom/mickeyTiger/index?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==9) {
                  console.log("app.js进入9")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/mickeyCustom/mickeyMyGift/index?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==10) {
                  console.log("app.js进入10")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/mickeyCustom/luckDraw/luckDraw?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==11) {
                  console.log("app.js进入11")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  let key = wx.getStorageSync('shakeCouoponHandler');
                  // 跳转回去继续执行流程
                  let pages = getCurrentPages();
                  let currentPage = pages[pages.length -1] || [];
                  let currentPageRoute = currentPage.route || currentPage.__route__;
                  if (currentPageRoute&&currentPageRoute.indexOf("subPackFile/shakeCoupon/pages/index/index") > -1) {
                    if (key === 'handleSendCoupon') {
                      currentPage.handleSendCoupon && currentPage.handleSendCoupon();
                    } else if (key === 'getSecAward'){
                      currentPage.getSecAward && currentPage.getSecAward();
                    }
                  } else if (currentPageRoute&&currentPageRoute.indexOf("crayongame/pages/last/index") > -1) {
                    if (key === 'getCoupon') {
                      currentPage.getCoupon && currentPage.getCoupon();
                    }
                  } else if (currentPageRoute&&currentPageRoute.indexOf("crayongame/pages/turntable/index") > -1) {
                    if (key === 'handleCoupon') {
                      currentPage.handleCoupon && currentPage.handleCoupon();
                    }
                  } else if (currentPageRoute&&currentPageRoute.indexOf("subPackFile/prc/p/d/index") > -1) {
                    if (key === 'getCoupon') {
                      currentPage.getCoupon && currentPage.getCoupon();
                    }
                  } else if (currentPageRoute&&currentPageRoute.indexOf("crayongame/pages/doraemon/index") > -1) {
                    if (key === 'handleCoupon') {
                      currentPage.handleCoupon && currentPage.handleCoupon();
                    }
                  }

                } else if (wx.getStorageSync('isStart')==4) {
                  console.log('分享裂变注册成功');
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  let pages = getCurrentPages();
                  let currentPage = pages[pages.length - 1]
                  if (currentPage.route.indexOf('/share/share') >= 0) {
                    let parms = ''
                    for (let i in currentPage.options) {
                      parms += (i.substr(i.indexOf("?")+1)+'='+currentPage.options[i]+'&')
                    }
                    let url = '/'+currentPage.route + '?' + parms.slice(0,parms.length)+'isStart=4'
                    console.log(url,'分享裂变注册成功跳转')
                    wx.redirectTo({
                      url: url,
                      success: function(res){
                        // success
                        console.log("跳转成功")
                      },
                      fail: function(res) {
                        // fail
                        console.log(res)
                      }
                    })
                  }
                }else{
                  const openCardPrePage = wx.getStorageSync(KEYSTORAGE.openCardPage);
                  if(openCardPrePage){
                    wx.redirectTo({
                      url: openCardPrePage,
                      success: function(res){
                        wx.removeStorageSync(KEYSTORAGE.openCardPage)
                        wx.removeStorageSync('isStart');
                        wx.removeStorageSync('isLogin');
                      },
                      fail: function(res) {// fail
                        console.log(res)
                      }
                    })
                    return
                  }

                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  console.log('注册成功');
                  // main.link("/pages/fashionID/memberCenter/memberCenter",2)
                  if (currentPage.route.indexOf('getcoupon/getcoupon/getcoupon') >= 0) {
                    wx.redirectTo({
                      url: '/getcoupon/getcoupon/getcoupon',
                      success: function(res){
                        // success
                        console.log("跳转成功")
                      },
                      fail: function(res) {
                        // fail
                        console.log(res)
                      }
                    })
                  }else{
                    wx.redirectTo({
                      url: '/pages/whitePage/whitePage',
                      success: function(res){
                        // success
                        console.log("跳转成功")
                      },
                      fail: function(res) {
                        // fail
                        console.log(res)
                      }
                    })
                  }
                }
              } else {
                wx.removeStorageSync('isStart');
                wx.removeStorageSync('isLogin');
                wx.removeStorageSync('isLoginNew');
                wx.showModal({
                  title: '提示',
                  content: res.data.errmsg,
                  showCancel: false,
                });
              }
            })
          }else{
            //如果没有就跳去授权(eto获取unionid)
            wx.navigateTo({url: '/pages/etoLogin/etoLogin'})
          }
        }else{
            console.log("无需重复");
        }
      } else {
        // 左划返回
        wx.showLoading({
          title:"加载中",
        })
        wx.removeStorageSync('isStart');
        wx.removeStorageSync('isLogin');
        wx.removeStorageSync('isLoginNew');
        console.log("清除成功");
        wx.hideLoading();
        wx.navigateBack({delta: 1});
      }
    }else{
      console.log("!!!!apponshow", data)
    }
    this.setUserOpenId();
    if(config.FULL_SCREEN){
      this.globalData.tabBarList.push('pages/shoppingCart/shoppingCart')
    }
  },
  // 统计代码
  track: function(){
    let _pages = getCurrentPages();
    let _this_page = _pages[_pages.length - 1].route;
    let _prevPage = wx.getStorageSync('prevPage');
    let _url = wx.getStorageSync('appInitData');
    _prevPage ? tongji(_this_page, _prevPage, '') : tongji(_this_page, _url.scene, '');
    wx.setStorageSync('prevPage', _this_page);
  },
  //本地存储初始化
  storageInit: function (options) {
    // wx.setStorage({ key: KEYSTORAGE.wxScene, data: options.scene });
    wx.setStorageSync(KEYSTORAGE.wxScene, options.scene)//场景值
    wx.setStorage({ key: "addCard", data: "" });
    wx.setStorage({ key: "newCard", data: "" });
    wx.setStorage({ key: "requestList", data: {} });
    wx.setStorage({ key: "isMember", data: "" });
    wx.setStorage({ key: "sourceUrl", data: ["", ""] });//来源路径
    wx.removeStorageSync('isStart');
    wx.removeStorageSync('isLogin');
    wx.removeStorageSync('isLoginNew');


    // 获chan_id 腾讯有数
    const {query = {}} = options
    query.chan_id ? wx.setStorageSync(KEYSTORAGE.chanId, query.chan_id) : '';
    this.handleRoomId(query);
    this.setUtmOptions(query);
    this.setShareInfo(query);
    this.cleanUtmOption();
    console.log(options,'onLaunch***********')
    this.globalData.addTipShow = true;
  },
  handleRoomId(options){
    // 获取视频号ID
    if(options.live_room_no || options.liveRoomNo){
      wx.setStorageSync(KEYSTORAGE.wxVideoLiveRoom, {
        id: options.live_room_no || options.liveRoomNo,
        date: Date.now(),
      })
    }
    const wxVideoLiveRoom = wx.getStorageSync(KEYSTORAGE.wxVideoLiveRoom) ;
    if(wxVideoLiveRoom && wxVideoLiveRoom.date){
      if(dateIsOverDue(wxVideoLiveRoom.date, config.differDay)){
        wx.removeStorageSync(KEYSTORAGE.wxVideoLiveRoom)
      }
    }
  },
  onPageNotFound(res) {
    this.goBack()
  },
  //获取网络类型
  getNetworkType: function () {
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if (networkType == 'none') {
          wx.showToast({
            title: '请检查网络',
            icon: 'loading',
            duration: 4000
          })
        }
      }
    })
  },
  //监听网络状态变化
  networkStatus: function (callback) {
    if (!callback) { var callback = function () { } }
    var self = this;
    wx.onNetworkStatusChange(function (res) {
      if (res.isConnected == false) {
        wx.showToast({
          title: '请检查网络',
          icon: 'loading',
          duration: 4000
        })
      } else {
        wx.showToast({
          title: '已打开网络',
          icon: 'success',
          duration: 2000
        })
        callback(200)
      }
    })
  },
  //判断微信基础库版本
  getSDKVersion: function () {
    var self = this;
    var SDKVersion = self.getAppSysInfo().SDKVersion
    if (SDKVersion < '1.2.3') {
      if (SDKVersion < '1.1.1') {
        wx.navigateTo({
          url: "/pages/common/sdkVersion/sdkVersion",
        })
      } else {
        wx.reLaunch({
          url: "/pages/common/sdkVersion/sdkVersion",
        })
      }

    }
  },
  //获取设备信息
  getAppSysInfo: function () {
    return wx.getSystemInfoSync()
  },
  px2rpx(value){
    const {windowWidth} = wx.getSystemInfoSync();
    const scale = 750 / windowWidth;
    return `${chengfa(value, scale)}`
  },
  getSearchKeyWords(that){
    searchKeyWord().then(res => {
      if(Array.isArray(res) && res.length){
        const searchList = wx.getStorageSync(KEYSTORAGE.SEARCH_LIST) || [];
        let placeholder = searchList.length ? searchList[0].value : (res[0].keyword || '搜索商品名称/编码');
        that.setData({
          searchKeyWord: res,
          placeholder
        })
      }
    })
  },
  /*
  * 检查授权，
  * type: 事件类型
  * title: 提示信息
  * callback: 回调函数
  * */
  isAuthor: function(config){
    // 检查授权
    checkAuthSetting(config.type).then(isAuthor => {
      return isAuthor
    }).then(isAuthor => {
      if(!isAuthor){
        // 打开弹窗授权
        authorize(config.type).then(status => {
          return status
        }).then(res => {
          if(res){
            // 点击允许
            config.callBack()
          }else{
            // 拒绝 打开授权
            openAuthor(config.type, config.title).then(res => {
              if(res){
                config.callBack()
              }
            });
          }
        })
      }else{
        // 已经授权
        config.callBack()
      }
    }).catch(err => console.log(err))
  },
  saveImage(url){
    // 检查授权
    const authed = {
      type: 'scope.writePhotosAlbum',
      title: '需要授权相册权限才能保存',
    }
    checkAuthSetting(authed.type).then(isAuthor => {
      return isAuthor
    }).then(isAuthor => {
      if (!isAuthor) {
        // 打开弹窗授权
        authorize(authed.type).then(status => {
          return status
        }).then(res => {
          if (res) {
            // 点击允许
            this.useWXSaveImg(url);
          } else {
            // 拒绝 打开授权
            openAuthor(authed.type, authed.title).then(res => {
              if (res) {
                this.useWXSaveImg(url);
              }
            });
          }
        })
      } else {
        // 已经授权
         this.useWXSaveImg(url);
      }
    }).catch(err => console.log(err))
  },
  useWXSaveImg(url){
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    if(url.toLocaleLowerCase().includes('mp4')){
      downloadFile(url).then(tempFilePath => {
        saveVideoToPhotosAlbum(tempFilePath).then(res => {
          events.post(true, EVENTS.EVENT_SAVE);
          wxShowToast('保存成功')
        })
      }).catch(err => {
        wxShowToast(err.message);
        wx.hideLoading();
      });
      return;
    }
    getImageInfo(url).then(res => {
      saveImageToPhotosAlbum(res).then(res => {
        wxShowToast('保存成功')
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
      })
    })
  },
  //判断是否虚拟工号
  isFictitiousGuide(da){
    return /[A-Za-z]/.test(da.substr(-6))
  },
  //保存本地数据
  setStorage: function (key, obj) {
    wx.setStorageSync(key, obj);
  },
  //获取本地数据
  getStorage: function (key) {
    return wx.getStorageSync(key);
  },
  onHide:function () {
    wx.removeStorageSync('indexData');
    wx.removeStorageSync(KEYSTORAGE.chanId);
    wx.removeStorageSync(KEYSTORAGE.wxUserAction);
  },

  saveFormIdFn: function(formId){
    /*const param = {
      formId,
      appid: config.wxAppid
    };
    saveFormId(param).then(res => console.log).catch(err => console.log(err.message, 'saveFormId**'))*/
  },
  // 打开卡券
  openVoucherCard: function(voucherInfo){
    if(voucherInfo.couponCode && voucherInfo.couponId){
      let param = {
        couponCode: voucherInfo.couponCode,
        couponId: voucherInfo.couponId
      };
      getCouponStatus(param).then(res => {
        if(res.is_get_card){
          // 已领卡
          let carList = [{
            cardId: res.data.cardList[0].cardId,
            code: res.data.cardList[0].code
          }];
          this.openMemberCard(carList)
        }else{
          let cardItem = {};
          if(res.data.cardList[0].cardExt){
            cardItem = JSON.parse(res.data.cardList[0].cardExt)
          }
          let cardList = [{
            cardId: res.data.cardList[0].cardId,
            cardExt: res.data.cardList[0].cardExt
          }];
          const _this = this;
          wx.addCard({
            cardList,
            success (res) {
              let openCardList = [{
                cardId: cardItem.card_id,
                code: cardItem.code
              }];
              _this.openMemberCard(openCardList);
            }
          })
        }
      }).catch(err => wxShowToast(err.message))
    }else{
      wxShowToast('优惠券信息不完整');
    }
  },
  // 收集用户行为
  _collectData2: function (data) {
    let unionId =  wx.getStorageSync('unionid');
    let guideInfo = wx.getStorageSync('daogouInfo');
    let shareBy = guideInfo.employeeId || data.shareBy;
    let shareByShop = guideInfo.shopCode || data.shareByShop;
    /*const utmOptions = wx.getStorageSync('daogouLists');
    if(utmOptions && utmOptions.length){
      let utmObj = {};
      utmOptions.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          utmObj[item.key] = item.value
        }
      });
      Object.assign(data, utmObj)
    }*/
    let liveRoomNo = '';
    const wxVideoLiveRoom = wx.getStorageSync(KEYSTORAGE.wxVideoLiveRoom) ;
    if(wxVideoLiveRoom && wxVideoLiveRoom.date && wxVideoLiveRoom.id){
      if(isToday(wxVideoLiveRoom.date)){
        liveRoomNo = wxVideoLiveRoom.id;
      }
      // if(!dateIsOverDue(wxVideoLiveRoom.date, config.differDay)){
      //   liveRoomNo = wxVideoLiveRoom.id;
      // }
    }
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length-1]; //获取当前页面的对象
    let curOptions = currentPage.options;
    let curPage = currentPage.route;
    let param = {
      unionId: unionId || '',
      openId : this.getOpenId(),
      shareBy ,
      shareByShop,
      eventName : data.eventName || '',
      eventValue : data.eventValue || '',
      utm_source : data.utm_source || data.utmSource || 'guideshare',
      utm_medium : data.utm_medium || data.utmMedium || 'miniprogram',
      utm_campaign : data.utm_campaign || data.utmCampaign || '',
      utm_term : data.utm_term || data.utmTerm || '',
      utm_wx_scene: wx.getStorageSync(KEYSTORAGE.wxScene) || '',
      TDChannelId: data.TDChannelId || '',
      brand: config.brand,
      channel: config.channel,
      orderCode: data.orderCode || '',
      latitude: data.latitude || '', // 维度
      longitude: data.longitude || '',   // 经度
      clickId: data.clickId || '',
      viewTime: data.viewTime || '',
      orderPrice: data.orderPrice || '',
      liveRoomNo,
      path: curPage,
      options: curOptions
    };
    collectData2(param).then(res => {}).catch(err => console.log(err))
  },

  // 打开webView
  goToWebView: function(url){
    const utmOptions = getQueryStringArgs(url);
    let linkUrl = encodeURIComponent(url);
    const params = Object.assign(utmOptions, {linkUrl});
    wx.navigateTo({
      url: `/pages/webview/webview?linkUrl=${linkUrl}`
    });
  },
  // 打开首页
  goBack: function () {
    wx.switchTab({url: '/pages/index/index'})
  },
  navigateTo: function(url){
    let urlArr = [ "/pages/memberCenter/memberCenter", '/pages/weMember/weMember', '/pages/informatNew/informat', "/pages/informat/informat", "/pages/guide/guide", "/pages/nearbyShops/main/main"];
    if(config.FULL_SCREEN){
      urlArr.push('/pages/shoppingCart/shoppingCart')
    }
    if(url){
      url = url.trim();
      if(url.startsWith('https') && url.includes('https')){
        this.goToWebView(url);
      }else{
        !url.startsWith('/') ? url = `/${url}` : '';
        if(urlArr.includes(url)){
          wx.switchTab({url});
          return;
        }
        wx.navigateTo({url})
      }
    }
  },
//   TD埋点 new
  tdSdk: function (id, param) {
    try{
      this.tdsdk.event({
        id: id,
        label: '',
        params: param
      });
    }catch (e) {}

  },
  tdSdkEvent: function(id, params){
    try {
      let obj = {
        BS_OPEN_ID: this.getOpenId(),
        BS_UNION_ID: wx.getStorageSync(KEYSTORAGE.unionid) || '',
      };
      if(params){
        if(params.OPEN_ID){
          delete params.OPEN_ID
        }
        if(params.UNION_ID){
          delete params.UNION_ID;
        }
      }
      Object.assign(obj, params);
      this.tdsdk.event({
        id,
        label: '',
        params: obj,
      });
    }catch (e) {}
  },
  // 分享
  tdShare: function (title, path) {
    try{
      this.tdsdk.share({
        type: 'WeappShare',
        title, path });
    }catch (e) { }
  },
  // 授权页面
  goSetting: function () {
    wx.navigateTo({url: '/pages/setting/requestPermission'});
  },
  // 领卡领券
  getCardPage: function (url) {
    // wx.navigateTo({url: `/pages/whitePage/whitePage?${data}`})
    console.log(url);
    wx.navigateTo({url})
  },

  checkiPhoneX: function(){
    var that = this;
    wx.getSystemInfo({
        success: function(res){
          if(res.model.indexOf('iPhone X')>=0||res.model.indexOf('iPhone 11 Pro')>=0){
            that.globalData.isIPhoneX = true;
          }
          else {
            that.globalData.isIPhoneX = false;
          }
        }
    })
  },

  wxSubscription: function (templateType, pageUrl){
    let templateIds = [];
    let subscriptionType = {
      isCoupon: false,
      isShopCart: false,
      isOrderPay: false,
      isRefund: false,
      isPaySuccess : false,
      isPintuanPaySuccess : false,
      isJumpGame: false
    }
    let wxSubscriptions = wx.getStorageSync("wxSubscriptions") || subscriptionType;
    switch(templateType){
      case 'coupon':
          wxSubscriptions.isCoupon = true;
          templateIds = config.couponTemplateIds;
        break
      case 'shopCart':
          wxSubscriptions.isShopCart = true;
          templateIds = config.shopCartTemplateIds;
        break;
      case 'orderPay':
        wxSubscriptions.isOrderPay = true;
        templateIds = config.orderPayTemplateIds;
        break;
      case 'refund':
        wxSubscriptions.isRefund = true;
        templateIds = config.refundTemplateIds;
      break
      case 'paySuccess':
        wxSubscriptions.isPaySuccess = true;
        templateIds = config.paySuccessTemplateIds;
      break
      case 'pintuanPaySuccess':
        wxSubscriptions.isPintuanPaySuccess = true;
        templateIds = config.pintuanPaySuccessTemplateIds;
      break
    }
    console.log(templateIds);
	  return new Promise((resolve, reject) => {
		  wx.requestSubscribeMessage({
			  tmplIds: templateIds,
			  success(res) {
				  console.log('subSuccess', res);
				  wxSubscribeCollection(res).then(data => { });
				  wx.setStorageSync("wxSubscriptions", wxSubscriptions);
				  if(url){
					  wx.navigateTo({url });
				  }
				  try {
            const saveSubscribeParam = {
              appid: config.wxAppid,
              openid: wx.getStorageSync(KEYSTORAGE.openid),
              template_id: templateIds
            };
            saveSubscribe(saveSubscribeParam).then(res => {});
          }catch (e) { }
				  resolve(res)
			  },
			  fail(err){
				  reject(new Error(err.message));
				  console.log('subError', err);
			  }
		  })
	  })
 },
  //  摇一摇活动
 _AccelerometerChange(){
  wx.onAccelerometerChange(function (res) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length -1] || {};
    let currentPageRoute = currentPage.route || currentPage.__route__;
    if (currentPageRoute&&currentPageRoute.indexOf("subPackFile/shakeCoupon/pages/index/index") > -1) {
      currentPage.onAccelerometerChange(res)
    }
  });
 },
});





/**
 * 导航栏内 礼品卡项等功能  暂时去掉的部分
 *
 {
  "pagePath": "pages/memberCard/activateCard/activateCard",
  "iconPath": "images/bar2.png",
  "selectedIconPath": "images/bar2_hover.png",
  "text": "礼品卡"
 },
 * **/
