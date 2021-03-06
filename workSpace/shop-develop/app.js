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
      // ????????????-??????????????????????????????????????????
      openSdkShareDepth: true,
      // ????????????-???????????????????????????????????????????????????tap???change???longpress???confirm
      autoTrack: true,
      //????????????-???????????????openId??????????????????????????????????????????openId
      openAutoTrackOpenId: true,
    });
  }
}catch (e) {
  console.error(e);
}

App({
  sr, // ?????????App?????????
  wxappSdk,
  //?????????????????????????????????????????? onLaunch???????????????????????????
  onLaunch: function (options) {
    initConfig();
    //?????????????????????App???
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

    // ???????????????
    this._AccelerometerChange()

    //??????????????????
    wx.setNavigationBarTitle({ title: config.title });

    //??????401??????
    events.register(this, EVENTS.EVENT_401);

    this.getConfig()
  },
  // ?????????????????? json
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
      console.log('??????', Date.now() - homeDataTime)
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
  // ????????????????????????????????????
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
  // ????????????
  _browsePage(curPageThis){
    /*try {
      curPageThis.showTime = Date.now();
      console.log(curPageThis.showTime,'curPageThis.showTime')
      let page = getCurrentUrl() ;
      const type = 'browse_wxapp_page';
      sr.track(type, {
        page: page,
        page_title: curPageThis.pageTitle || config.title, // ???????????????????????????????????????????????????????????????????????????????????????page_title???
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
        page_title: curPageThis.pageTitle || config.title, // ???????????????????????????????????????????????????????????????????????????????????????page_title???
        refer_page: getApp().refer_page,
        is_newly_open: true,
      });
      this.refer_page = page;
      // this.WXReport(type, { page, keyword })
    }catch (e) {}
  },
  // ????????????
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
  // ????????????
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
  // ????????????????????????
  wxPaymentReport(bigorderCode = '', status = '', payPrice = 0){
    if(!config.wxReportAppid){
      return;
    }
    try{
      // ??????????????????
      const orderInfo = {
        page_title: '????????????',
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
  // ??????????????????
  WXReport: function(type, data){
    if(!config.wxReportAppid){
      return;
    }
    try{
      sr.track(type, data)
    }catch (e) {}
  },
  // ??????????????????????????????
  setWXReportUserInfo(open_id){
    if(!config.wxReportAppid){
      return;
    }
    try {
      // ???????????????????????????
      sr.setUser({
        app_id: config.wxAppid || '',
        open_id,
      });
      // ????????????
      sr.startReport()
    }catch (e) {}
  },
  // ???????????????
  setShareMoment(){
    try {
      // ????????????
      if(brand !== 'FOL'){
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
      }
    }catch (e) { }
  },
  /**
   * GIO??????
   * @param eventId ???????????????
   * @param eventLevelVariables ????????????????????????????????????????????? {}
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
   * ??????401??????(?????????????????????????????????)
   */
  handleEvent: function (event, type) {

    //??????????????????
    wx.removeStorageSync(KEYSTORAGE.loginInfo);
    wx.removeStorageSync(KEYSTORAGE.token);
    wx.removeStorageSync('dingdanAddress');

    if (type === EVENTS.EVENT_401) {
        initSDK().then((token) => { //???????????????
          this.initApp();  //????????????
        }).catch(e => { });
    }

  },
  /**
   * ?????????????????????????????????
   */
  initApp: function () {

    let that = this;

    let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo); //????????????
    let token = wx.getStorageSync(KEYSTORAGE.token); //????????????
    if (loginInfo && token) { //?????????
      wx.checkSession({ //????????????????????????
        success: () => console.log('????????????????????????'),
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
            // res = {"code":"200","data":"{\"VIDEO_CARD\":\"{\\\"code\\\":1,\\\"msg\\\":\\\"????????????????????????\\\"}\",\"page\":\"/orderComplete\",\"openMethod\":\"page\",\"order\":{\"unionid\":\"ozYoQs53Ni9hIaF0p8S3rVzX1PqQ\",\"orderId\":340200126616174593,\"orderItemList\":[{\"goodsCount\":1,\"bigOrderId\":1656227,\"goodsStatus\":\"WaitingShipment\",\"bigOrderCode\":\"91420190528183324008\",\"orderItemId\":1133320470151675906,\"price\":1.00,\"discount\":0.50,\"goodsColorCode\":\"418105502A06\",\"sku\":\"418105502A06380\"}],\"payTime\":1559039630798,\"openid\":\"oEQ4S0fBoWUT8-WK8rr59Q6T-G9A\",\"shareBy\":\"\",\"shareShop\":\"\",\"orderStatus\":0,\"payWay\":\"WeChatPay\",\"isLift\":false,\"miniOpenid\":\"oEQ4S0fBoWUT8-WK8rr59Q6T-G9A\",\"bigOrderCode\":\"91420190528183324008\",\"createTime\":1559039630798,\"phone\":\"18813068824\",\"payPrice\":1.0,\"expressFare\":0.0,\"id\":1656227,\"shopGuideId\":\"\",\"brand\":\"SELECTED\",\"goodsTotalCount\":1,\"channelCode\":\"MINIPROGRAM\",\"memberId\":\"718515\",\"status\":\"WaitingShipment\"}}","success":true};
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
      title: '?????????...'
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
        // ???????????? office?????????retail
        res.shopCode = res.STAFF_TYPE === 'OFFICE' ? '0000' : res.SHOPCODE;
        res.shopName = res.STAFF_TYPE === 'OFFICE' ? '????????????' : res.DEPT_NAME;
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
    // ?????????id????????????
    if(setRoomIdDate && dateIsOverDue(setRoomIdDate, roomIdOverDay)){
      wx.removeStorageSync(KEYSTORAGE.roomId);
      wx.removeStorageSync(KEYSTORAGE.setRoomIdDate)

    }
    // ???????????????utm??????????????????
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
  // ?????????????????????
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
    console.log(data,'******????????????');
  },
  // ??????UTM??????
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
  // ??????UTM??????
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
    // GIO ??????
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
    // ??????
    this.setWXReportUserInfo(openId);
    // ??????
    this.tdSdkEvent('login_uploadopenid_openid',{});
    // ?????????????????? ???????????????
    if(brand === 'JACKJONES' || brand === 'VEROMODA'){
      let data = [];
      data.push({
        action_type:'INIT',
        action_param:{}
      });
      wxUserActions(data);
    }
  },
  //????????????
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
        // ????????????
        this.isMemberETO()
      }
    }
  },
  //????????????????????????crm
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
    wx.showLoading({title:'????????????...', mask: true});
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
  // ???????????????
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
  // ?????????????????????????????????
  changeLocalCart: function(cartNum){
    let localCartList = wx.getStorageSync(KEYSTORAGE.cartList) || {};
    localCartList.totalCounts = cartNum;
    wx.setStorageSync(KEYSTORAGE.cartList, localCartList);
  },
  loginETO: function(){
    console.log('????????????*****************');
    wx.navigateTo({url: '/pages/etoLogin/etoLogin'})
  },
  /*
  * openCard ???????????????????????????
  * */
  isMemberETO: function(openCard){
    const unionid = wx.getStorageSync(KEYSTORAGE.unionid);
    // ???????????????????????????????????????
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
        title: '?????????...',
        mask: true,
      })
    }, 800);
    isMember(getApp().config.etoBrand).then( res => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      console.log('?????????????????????', res,'errcode' ,typeof(res.errcode) );
      if(res.errcode === 0){
        wx.setStorageSync('isGetCard', res.is_get_card);
        if(res.is_member){
          wx.setStorageSync('isMember', 1);
          const loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
          if(!loginInfo){
            // ?????? ??? ETO????????????2s????????????????????????
            wx.showLoading({
              title: '??????...',
              mask: true
            });
            let loginTime = setTimeout(() => {
              this.lzInfo();
              clearTimeout(loginTime);
            }, 2000)
          }
          if(res.is_get_card === 0){
            console.log('?????????????????????');
            console.log(res.activatemembercard_url,'?????????????????????,res.activatemembercard_url***');
            if(openCard){
              this.registerMember(res.activatemembercard_url)
            }
          }else{
            console.log('?????????????????????');
            wx.setStorageSync('isMember', 1);
            wx.setStorageSync('memberData', res.data);
            if(openCard){
              let cardList = res.data.cardList;
              this.openMemberCard(cardList);
            }
          }
        }else{
          // ????????????
          console.log('?????????????????????');
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
        console.log('????????????opencard');
      },
      fail: function (res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  // ??????????????? 20190221  --yxw
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
          appId: config.openCardAppId, // ???????????? appid???????????????
          extraData: data, // ?????? encrypt_card_id, outer_str, biz????????????????????? step3 ?????????????????????????????????
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
    }) //????????????
  },
  // ?????????????????????
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
          title: '?????????...',
          mask: true
        });
        wxLogin().then(resCode => {
          getMiniOpenid(resCode, config.brand).then(res => {
            // ???????????????????????????unionid
            wx.hideLoading();
            if(res.unionid){
              wx.setStorageSync(KEYSTORAGE.unionid, res.unionid);
              this.register(isGetVoucher);
            }else{
              // ????????????
              this.goSetting()
            }
          });
        })
      }else{
        this.register(isGetVoucher);
      }
    }
  },
  // ????????????
  register: function(isGetVoucher){
    if(!this.config.singleBrand){
      return;
    }
    wx.showLoading({
      title: '?????????...',
      mask: true
    });
    isMember(getApp().config.etoBrand).then(res => {
      wx.hideLoading();
      if(res.errcode === 0){
        wx.setStorageSync('isMember', res.is_member);
        if(!res.is_member){
          if(res.is_get_card){
            // ?????????????????????
            const cardList = [{
              cardId: res.data.cardList[0].cardId,
              code: res.data.cardList[0].code,
            }];
            this.activeMemberCard(cardList, isGetVoucher);
          }else{
            // ?????????
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
              // ?????????
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
  * ???????????????
  * param1 ??? ???????????????
  * param: ?????????????????????
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
  * ???????????????
  * param1: ????????????
  * param2???????????????????????????????????????
  * */
  getMemberCard: function(cardList, isGetVoucher){
    wx.addCard({cardList,
      success: ()=> {
        //????????????????????????
        isMember(getApp().config.etoBrand).then( res => {
          if(res.errcode === 0){
            if(!res.is_member && res.is_get_card){
              // ?????????????????????
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
  // ??????url
  jumpUrl: function(url){
    if(typeof url !== 'string'){
      return
    }
    (!url.startsWith('/')) ? url = `/${url}` : '';
    wx.navigateTo({url})
  },
  ifWXWork: function (iswitchTab) {
    // iswitchTab  ??????????????????????????????
    if (wx.getStorageSync(KEYSTORAGE.isEnterprise)) {
      iswitchTab ? this.goBack() : '';
      return false;
    }
  },
	urlDevFlag(){
		return wx.getStorageSync(KEYSTORAGE.isEnterprise) ? config.WX_WORK : 'wxPeople'
	},

  //???????????????????????????unionid?????????????????????
  getUnionid: function () {
    //?????????????????????unionid,?????????????????????????????????????????????unionid???????????????????????????
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
  //????????????
  globalData: {
    gio,
    // getConfigJSON????????????
    configJson : {},
    //add eto
    hasLogin: false,
    openid: null,
    couponCode: null,  //??????????????????????????????????????????
    cardCode: null,  //??????????????????????????????????????????
    couponsInfo: null,  //???????????????
    cardData: null, //???????????????

    lastTimeMillis:0,

    showIconBackToShopDetail:false,
    // ?????????
    showWish: false,
    // ?????????????????????
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
      // ?????????????????????????????????
      // console.log('?????????????????????????????????',res)
    });

    updateManager.onUpdateReady(function () {
      // ???????????????????????????????????? applyUpdate ????????????????????????
      updateManager.applyUpdate()
      /*wx.showModal({
        title: '????????????',
        content: '????????????????????????????????????????????????',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // ???????????????????????????????????? applyUpdate ????????????????????????
            updateManager.applyUpdate()
          }
        }
      })*/
    })

    updateManager.onUpdateFailed(function () {
      // ?????????????????????
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
            //????????????????????????
            //???????????????????????????isLoginNew
            //???????????????????????????????????????registerCallBack??????,?????????????????????????????????????????????registerCallBack????????????????????????????????????
    //??????????????? alex ---update 2019-01-22
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
        // ????????????
        //??????uinionid??????
        console.log('??????????????????');
        var needRegister = wx.getStorageSync('isLogin');
        var needRegisternew = wx.getStorageSync('isLoginNew');
        if(needRegister || needRegisternew){
          console.log("????????????");
          var unionid = wx.getStorageSync("unionid");
          if(unionid){
            var urlRegister = data.referrerInfo.extraData.wx_activate_after_submit_url;
            var reg = /https/;
            if(!reg.test(urlRegister)){
              urlRegister = urlRegister.replace(/http/,'https'); //????????????????????????
            }
            // ?????????????????? 18-06-19 by golan
            main.request(urlRegister, { activate_ticket: data.referrerInfo.extraData.activate_ticket, register_source: 'miniapp',unionid}, function (res) {
              if (res.data.errcode == 0) {
                wx.setStorageSync('isMember', 1);
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                try{
                  sr.track('register_wxapp', {
                    "page": currentPage.route,
                    "page_title": "???????????????",
                    "time": Date.now(),
                  });
                }catch (e) {}
                if (wx.getStorageSync('isLoginNew')) {
                    let pages = getCurrentPages();
                    let currentPage = pages[pages.length - 1] || {};
                    let currentPageRoute = currentPage.route || currentPage.__route__;
                    console.log("???????????????????????????", currentPageRoute);
                    //??????????????????????????????registerCallBack?????????????????????????????????????????????????????????????????????????????????????????????????????????
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
                  console.log('????????????????????????')
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
                  console.log("app.js??????8")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/mickeyCustom/mickeyTiger/index?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==9) {
                  console.log("app.js??????9")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/mickeyCustom/mickeyMyGift/index?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==10) {
                  console.log("app.js??????10")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  wx.redirectTo({
                    url: '/mickeyCustom/luckDraw/luckDraw?membercard=1'
                  })
                } else if (wx.getStorageSync('isStart')==11) {
                  console.log("app.js??????11")
                  wx.removeStorageSync('isStart');
                  wx.removeStorageSync('isLogin');
                  let key = wx.getStorageSync('shakeCouoponHandler');
                  // ??????????????????????????????
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
                  console.log('????????????????????????');
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
                    console.log(url,'??????????????????????????????')
                    wx.redirectTo({
                      url: url,
                      success: function(res){
                        // success
                        console.log("????????????")
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
                  console.log('????????????');
                  // main.link("/pages/fashionID/memberCenter/memberCenter",2)
                  if (currentPage.route.indexOf('getcoupon/getcoupon/getcoupon') >= 0) {
                    wx.redirectTo({
                      url: '/getcoupon/getcoupon/getcoupon',
                      success: function(res){
                        // success
                        console.log("????????????")
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
                        console.log("????????????")
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
                  title: '??????',
                  content: res.data.errmsg,
                  showCancel: false,
                });
              }
            })
          }else{
            //???????????????????????????(eto??????unionid)
            wx.navigateTo({url: '/pages/etoLogin/etoLogin'})
          }
        }else{
            console.log("????????????");
        }
      } else {
        // ????????????
        wx.showLoading({
          title:"?????????",
        })
        wx.removeStorageSync('isStart');
        wx.removeStorageSync('isLogin');
        wx.removeStorageSync('isLoginNew');
        console.log("????????????");
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
  // ????????????
  track: function(){
    let _pages = getCurrentPages();
    let _this_page = _pages[_pages.length - 1].route;
    let _prevPage = wx.getStorageSync('prevPage');
    let _url = wx.getStorageSync('appInitData');
    _prevPage ? tongji(_this_page, _prevPage, '') : tongji(_this_page, _url.scene, '');
    wx.setStorageSync('prevPage', _this_page);
  },
  //?????????????????????
  storageInit: function (options) {
    // wx.setStorage({ key: KEYSTORAGE.wxScene, data: options.scene });
    wx.setStorageSync(KEYSTORAGE.wxScene, options.scene)//?????????
    wx.setStorage({ key: "addCard", data: "" });
    wx.setStorage({ key: "newCard", data: "" });
    wx.setStorage({ key: "requestList", data: {} });
    wx.setStorage({ key: "isMember", data: "" });
    wx.setStorage({ key: "sourceUrl", data: ["", ""] });//????????????
    wx.removeStorageSync('isStart');
    wx.removeStorageSync('isLogin');
    wx.removeStorageSync('isLoginNew');


    // ???chan_id ????????????
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
    // ???????????????ID
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
  //??????????????????
  getNetworkType: function () {
    wx.getNetworkType({
      success: function (res) {
        // ??????????????????, ????????????
        // wifi/2g/3g/4g/unknown(Android???????????????????????????)/none(?????????)
        var networkType = res.networkType
        if (networkType == 'none') {
          wx.showToast({
            title: '???????????????',
            icon: 'loading',
            duration: 4000
          })
        }
      }
    })
  },
  //????????????????????????
  networkStatus: function (callback) {
    if (!callback) { var callback = function () { } }
    var self = this;
    wx.onNetworkStatusChange(function (res) {
      if (res.isConnected == false) {
        wx.showToast({
          title: '???????????????',
          icon: 'loading',
          duration: 4000
        })
      } else {
        wx.showToast({
          title: '???????????????',
          icon: 'success',
          duration: 2000
        })
        callback(200)
      }
    })
  },
  //???????????????????????????
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
  //??????????????????
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
        let placeholder = searchList.length ? searchList[0].value : (res[0].keyword || '??????????????????/??????');
        that.setData({
          searchKeyWord: res,
          placeholder
        })
      }
    })
  },
  /*
  * ???????????????
  * type: ????????????
  * title: ????????????
  * callback: ????????????
  * */
  isAuthor: function(config){
    // ????????????
    checkAuthSetting(config.type).then(isAuthor => {
      return isAuthor
    }).then(isAuthor => {
      if(!isAuthor){
        // ??????????????????
        authorize(config.type).then(status => {
          return status
        }).then(res => {
          if(res){
            // ????????????
            config.callBack()
          }else{
            // ?????? ????????????
            openAuthor(config.type, config.title).then(res => {
              if(res){
                config.callBack()
              }
            });
          }
        })
      }else{
        // ????????????
        config.callBack()
      }
    }).catch(err => console.log(err))
  },
  saveImage(url){
    // ????????????
    const authed = {
      type: 'scope.writePhotosAlbum',
      title: '????????????????????????????????????',
    }
    checkAuthSetting(authed.type).then(isAuthor => {
      return isAuthor
    }).then(isAuthor => {
      if (!isAuthor) {
        // ??????????????????
        authorize(authed.type).then(status => {
          return status
        }).then(res => {
          if (res) {
            // ????????????
            this.useWXSaveImg(url);
          } else {
            // ?????? ????????????
            openAuthor(authed.type, authed.title).then(res => {
              if (res) {
                this.useWXSaveImg(url);
              }
            });
          }
        })
      } else {
        // ????????????
         this.useWXSaveImg(url);
      }
    }).catch(err => console.log(err))
  },
  useWXSaveImg(url){
    wx.showLoading({
      title: '?????????...',
      mask: true
    });
    if(url.toLocaleLowerCase().includes('mp4')){
      downloadFile(url).then(tempFilePath => {
        saveVideoToPhotosAlbum(tempFilePath).then(res => {
          events.post(true, EVENTS.EVENT_SAVE);
          wxShowToast('????????????')
        })
      }).catch(err => {
        wxShowToast(err.message);
        wx.hideLoading();
      });
      return;
    }
    getImageInfo(url).then(res => {
      saveImageToPhotosAlbum(res).then(res => {
        wxShowToast('????????????')
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
      })
    })
  },
  //????????????????????????
  isFictitiousGuide(da){
    return /[A-Za-z]/.test(da.substr(-6))
  },
  //??????????????????
  setStorage: function (key, obj) {
    wx.setStorageSync(key, obj);
  },
  //??????????????????
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
  // ????????????
  openVoucherCard: function(voucherInfo){
    if(voucherInfo.couponCode && voucherInfo.couponId){
      let param = {
        couponCode: voucherInfo.couponCode,
        couponId: voucherInfo.couponId
      };
      getCouponStatus(param).then(res => {
        if(res.is_get_card){
          // ?????????
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
      wxShowToast('????????????????????????');
    }
  },
  // ??????????????????
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
    let pages = getCurrentPages(); //?????????????????????
    let currentPage = pages[pages.length-1]; //???????????????????????????
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
      latitude: data.latitude || '', // ??????
      longitude: data.longitude || '',   // ??????
      clickId: data.clickId || '',
      viewTime: data.viewTime || '',
      orderPrice: data.orderPrice || '',
      liveRoomNo,
      path: curPage,
      options: curOptions
    };
    collectData2(param).then(res => {}).catch(err => console.log(err))
  },

  // ??????webView
  goToWebView: function(url){
    const utmOptions = getQueryStringArgs(url);
    let linkUrl = encodeURIComponent(url);
    const params = Object.assign(utmOptions, {linkUrl});
    wx.navigateTo({
      url: `/pages/webview/webview?linkUrl=${linkUrl}`
    });
  },
  // ????????????
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
//   TD?????? new
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
  // ??????
  tdShare: function (title, path) {
    try{
      this.tdsdk.share({
        type: 'WeappShare',
        title, path });
    }catch (e) { }
  },
  // ????????????
  goSetting: function () {
    wx.navigateTo({url: '/pages/setting/requestPermission'});
  },
  // ????????????
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
  //  ???????????????
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
 * ???????????? ?????????????????????  ?????????????????????
 *
 {
  "pagePath": "pages/memberCard/activateCard/activateCard",
  "iconPath": "images/bar2.png",
  "selectedIconPath": "images/bar2_hover.png",
  "text": "?????????"
 },
 * **/
