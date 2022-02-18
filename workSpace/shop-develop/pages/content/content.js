import { KEYSTORAGE, URL_CDN } from '../../src/const.js'
import { shoppingAdd, addSkuToWish} from "../../service/cart";
import {  getWxaCodeUnpubAddrQR} from "../../service/guide";
import { checkAndGetProvincesInfo, cutProvince } from '../../service/location';
import { getGoodsDetail, queryIsPintuan, getActivityPic, getDetailPage } from "../../service/goods";
import { promotionByGoodsColorList, addCoupons } from "../../service/promotion";
import { unionIdToOpenId } from "../../service/mini";
import { goodsDetailgetCouponList, queryGetCouponRecord } from "../../service/coupon";
import events from '../../src/events';
import { EVENTS, PAGESTR } from "../../src/const";
import { wxUserActions } from '../../service/collect.js'
import { optionGoodsCollection, isGoodsQuery } from '../../service/collection.js'
import { wxSubscription } from '../../utils/wxSubscribe'
import { wxShowToast, wxReportGoods } from '../../utils/wxMethods'
import { getImageInfo } from "../../service/saveImg";
import { addTrack } from "../../service/track"
import { getGoodsComment } from "../../service/comment"
import { getQueryString, getBrandBySku, splitImg, chengfa, isJSONStr, formatDate, getNineSku, countDown, skuToImg, objectArraySort, objToQuery, getThumbnailNormPath, deteleObject, getCurrentUrl, animateShow, animateHide, throttle } from '../../utils/utils'

var ShopUtil = require('../../service/shop.js');
const config = require('../../src/config.js');
const app = getApp();
const { brand, cdn, goodsMark = false, isCollection,  SHOW_DISCOUNT, WX_WORK, SHOW_BIND_GUIDE } = app.config;
let curOptions = {};
var scrollTops = 0;
var contentID = '';
var contentColorID = '';
let GOODS_SPU = "";
var imgArr = [];
var color_num = 0;
var chicun = '';   //15位：款（9位）+ 颜色（3位）+ 尺码（3位）
var kucuns = 0;
var isHaveClassifyId = false;
var thisContentCon = {};
var intentType = null;
var intentShopCode = null;
let SPU_ID = '';
//获取竖向滚动焦点图
function getPicUrl(url_obj, index, size) {
  var Slider = [];
  var brand = getBrandBySku(contentID)
  for (var i = 0; i < 5; i++) {
    Slider.push({
      picUrl: `${cdn}/goodsImagePC/${brand}/${contentID}/${url_obj[index].colorCode}/${size}/${url_obj[index].colorCode}_T0${(i + 1)}.jpg`,
    });
  };
  return Slider;
}
const activeType = 'wish';
Page({
  isONLY: app.config.brand.indexOf('ONLY') >= 0,
  // 页面的初始数据
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    // 红包雨倒计时
    hbyJson : {
      // img : `https://cdn.bestseller.com.cn/assets/common/image/hby_hb_close.png`,
      img : `https://cdn.bestseller.com.cn/assets/common/image/pet_close.png`,
      downNum : 15, //配置15秒
      canTap : false,
      canShow : false
    },
    //用户信息
    userInfo: {},
    //用户id
    user_id: '',
    product: {},
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
      joinCar: {
        display: 'none',
      },
      goumai: {
        display: 'none',
      }
    },

    flagHideMap: true,
    flagHaveStock: true,
    // 处理map置顶的bug
    flagMapAnchor: true,
    nearbyShopEnabled: config.NEARBY_SHOP_ENABLED,

    //楼层数
    imgIndex: 0,
    leftNav: true,

    //轮播图
    slider: [],
    // 轮播图
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    // 缩略图
    thumbnail: '',

    //导购分享模块
    isFromDaogou: false,
    isChecked: false,

    //商品详情信息
    contentCon: {},

    //颜色分类
    b_li: ['350洗水牛仔蓝350JeansBlue'],
    color_list_num: 0,

    //请选择尺码
    xzChicun: '请选择尺码',



    //尺码
    c_li: ['155/60A/XSR', '160/64A/SR'],
    chima_list_num: -1,
    chimaList: [],
    colorKucuns: [],

    //动画效果
    animationOpacity: {},
    animationBottom: {},

    //库存剩余
    kucun_nums: 0,

    //件数
    nums: 1,

    //回到顶部
    goTop_show: false,
    // 详情页是否显示，更改495行，默认不显示
    detailShow: true,

    //是否显示库存弹出页
    flagShowStockDetail: false,

    guideId: '',
    setList: [],

    toView: 'red',
    scrollTop: 100,
    goodsSizeSku: '',

    noWMall: true,

    coupon_display: false,

    // 是否有优惠券活动
    hasCoupon: false,
    // // 优惠券列表
    // couponList: [],
    // 活动列表
    activityInfo: [],
    // 是否领取过优惠券
    hasReceive: false,
    goArrow: splitImg('goArrow.png', 'common'),
    couponTitle: splitImg('coupon_title.png', 'common'),
    recommendIcon: splitImg('recommend_icon.jpg', 'common'),
    fixedRightArr: [
      {
        type: 'goCart',
        img: splitImg('cart_icon.png', 'common'),
        isShow: true,
      },
      {
        type: 'collection',
        img: splitImg('icon_collect.png', 'common'),
        isShow: false,
      },
      {
        type: 'deleteCollection',
        img: splitImg('icon_collected.png', 'common'),
        isShow: false,
      },
      {
        type: 'share',
        img: splitImg('icon_share.png', 'common'),
        isShow: true,
      },
      {
        type: 'home',
        img: splitImg('icon_home.png', 'common'),
        isShow: true,
      },
      {
        type: 'recommend',
        img: splitImg('icon_recommend.png', 'common'),
        isShow: !app.globalData.configJson.goodsdetailwishlist,
      },
      {
        type: activeType,
        img: splitImg('add_wish_icon.png', 'common'),
        isShow: app.globalData.configJson.goodsdetailwishlist,
        style: 'transform:scale(2.2)'
      }
    ],
    noticeAct: false,
    wxIcon: splitImg('wxpay_icon.png', 'common'),
    isShowActivityTag: app.config.isShowActivityMark,
    hasActivity: false,
    activityImage: '',
    inputUrl: '/pages/content',
    showOfficial: false, // 是否显示关注公众号
    bodyContent: '',
    projeckName: app.config.brand === 'SELECTED' ? 'detail-gender' : 'detailPage',
    itemId: '',
    markWashing: app.config.markWashing ? `${cdn}/assets/h5/${app.config.brand}/image/markWashing.jpg` : '',
    videoSrc: '', //视频源
    swiperShow: true, // 轮播图是否展示
    startTime: 0, //视频开始播放的时间
    currentTime: 0,//实时播放的视频进度
    videoBtnShow: false,// 是否展示切换视频轮播图的按钮
    durationTime: 0,
    showShare: false,
    goodsMarkText: '',
    subGoodsName:'', // 商品副标题
    subGoodsLink: '', // 商品副标题跳转
    addWishList: false,
    showWishIcon: {
      show: app.globalData.configJson.goodsdetailwishlist,
      img: splitImg('wish_home-icon.png')
    },
    //  颜色对应的促销
    colorListPromotion: {},
    // 促销列表
    promotionList: [],
    classify: {
      icon: splitImg('icon_classify.png', 'common'),
      text: '',
      linkUrl: ''
    },
    pinglunData:{},
    buyerShowData: {},
    SHOW_DISCOUNT,
    isSeckill: false,
    timeObj : {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },
    SHOW_BIND_GUIDE,
    showBindGuidePop: false,
    // 领券促销
    promotionCoupons: []
  },
  changeShowBind(){
    this.setData({
      showBindGuidePop: true
    })
  },
  promotionClick(e){
    const {id} = e.currentTarget
     wx.navigateTo({
      url: `../goodsList/goodsList?ruleId=${id}`,
    })
  },
  onClick: function (e) {
    const dataType = e.currentTarget.dataset.type;
    const wxVideoLiveRoom  = wx.getStorageSync(KEYSTORAGE.wxVideoLiveRoom)
    switch (dataType) {
      case 'collection':
        if (!app.checkLogin()) {
          return;
        }
        this.optionsCollection("0");
        break;
      case 'deleteCollection':
        this.optionsCollection("1");
        break;
      case 'home':
        this.gio_track('pageclick_goodsdetail_tohome', {
          liveRoomNo: wxVideoLiveRoom ? wxVideoLiveRoom.id : ''
        });
        app.goBack();
        break;
      case 'goCart':
        if (!app.checkLogin()) {
          return;
        }
        app.navigateTo('/pages/shoppingCart/shoppingCart')
        break;
      case 'share':
        this.generateQR();
        break;
      case activeType:
        this.joinCar(e, activeType);
        break

    }
  },
  saveShareImg(){
    const {pic} = this.data;
    app.saveImage(pic);
    this.cancelShare();
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let collectParam = Object.assign(curOptions, {
      eventName: `单品转发_${contentID}`,
      eventValue: '朋友圈'
    });
    if(guideInfo && guideInfo.employeeId){
      collectParam.eventName += `_${guideInfo.employeeId}`
    }
    if(isWXWork){
      Object.assign(collectParam, {utm_source: PAGESTR.wxWorkSource})
    }
    app._collectData2(collectParam);
    this.gio_track('pageclick_goodsdetail_share_moment')
  },
  cancelShare(){
    this.setData({showShare: false});
  },
  copySuccess(data){
    const {detail} = data;
    const param = {}
    if(detail && detail.length === 15){
      param.sku_id = detail;
    }
    this.gio_track('pageclick_goodsdetail_copysku', param)
  },
  async shareMoment(){
    this.setData({showShare: true});
    const {shareGoodsQR, slider, contentCon, color_list_num} = this.data;
    const goodsImg = slider[0].picUrl;
    const goodsBrand = getBrandBySku(contentCon.projectCode);
    const logo = goodsBrand !== 'TRUU' ? splitImg('logo-black-rect.png', goodsBrand) : ''
    try{
      const {path, width, height} = await getImageInfo(goodsImg, true);
      const pathQR = await getImageInfo(shareGoodsQR);
      const ctx = wx.createCanvasContext('myCanvas');
      // 上下空白区域高度
      const whiteHeight = 280;
      const canvasWidth = width, canvasHeight = height + (whiteHeight * 2);
      const QRWidth = 250, QRHeight = 250;
      ctx.rect(0, 0, canvasWidth, canvasHeight);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      // 填充背景
      ctx.setFillStyle('white');
      ctx.fill();
      // 写文字
      ctx.font="50px Arial";
      ctx.setFillStyle('red');
      ctx.fillText(`￥${contentCon.color[color_list_num].price}`, 10, height + whiteHeight  + 140);
      ctx.font="40px Arial";
      ctx.setFillStyle('black');
      const goodsName = contentCon.goodsName;
      let goodsName1 = '', wrap = false;
      goodsName.split('').forEach((item, index) => {
        if((index + 1) * 40 < 460){
          goodsName1 += item
        }else{
          wrap = true
        }
      });
      ctx.fillText( wrap ? `${goodsName1}...` : goodsName1, 20, height + whiteHeight + 200);
      // 画图
      ctx.drawImage(path, 0, whiteHeight, width, height);
      // 放置二维码
      const QRX = canvasWidth - (QRWidth + 10), QRY = height + whiteHeight;
      ctx.drawImage(pathQR, QRX, QRY, QRWidth, QRHeight);
      // 放置logo
      if(logo){
        let {path: logoPath, width: logoWidth, height: logoHeight} = await getImageInfo(logo, true);
        logoWidth = logoWidth * 2;
        logoHeight = logoHeight * 2;
        // logo 位置
        const logoX = (canvasWidth - logoWidth)/2 , logoY = (whiteHeight - logoHeight) / 2;
        ctx.drawImage(logoPath, logoX, logoY, logoWidth, logoHeight);
      }
      // 写文字
      ctx.font="26px Arial";
      ctx.setFillStyle('gray');
      ctx.fillText('详情长按图片扫码', QRX + QRWidth/2 - 120, QRY + QRHeight + 20);
      ctx.font="20px Arial";
      ctx.setFillStyle('gray');
      ctx.fillText(`该图片于${formatDate(Date.now())}合成，实际价格以商品详情页为主`, 10, canvasHeight -40);
      const _this= this;
      wx.showLoading({
        title: '正在合成...',
        mask: true
      });
      ctx.draw(true, function(e) {
        // 保存到本地
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            let pic = res.tempFilePath;
            _this.setData({pic});
          },
          fail(err){
            console.log(err,'保存失败');
            wxShowToast('合成失败');
          },
        });
      });
    }catch (e) {
      console.error(e)
      wxShowToast(e.message)
    }
  },

  async generateQR(){
    // newminiB/SELECTED_colorCode=420206508S01.png
    const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {contentCon, color_list_num} = this.data;
    const goodsColorCode = contentCon.color[color_list_num].colorCode
    let scene = `sku=${goodsColorCode}`;
    if(guideInfo && guideInfo.employeeId){
      scene += `_da=${guideInfo.employeeId}`
    }
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    if(isWXWork){
      scene += '_Q'
    }
    const param = {
      scene,
      page: 'pages/content/content',
      is_hyaline: true
    };
    wx.showLoading({
      title: '加载中...'
    });
    getWxaCodeUnpubAddrQR(param).then(res => {
      wx.hideLoading();
      this.setData({
        shareGoodsQR: res,
      });
      this.shareMoment();
    }).catch(err => wxShowToast(err.message));
    app.gioTrack('pageclick_goodsdetail_share', {
      spu_id: goodsColorCode
    });
  },

  onReady: function () {
    if ("fromShopDetailPage" == intentType && !this.isONLY) {
      this.setData({
        flagHideMap: false,
      });
      this.onMapShows();
    }


    var animation_bottom = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    var animation_oapcity = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })

    this.animation_bottom = animation_bottom;
    this.animation_oapcity = animation_oapcity;

  },
  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {

    }
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log('content.js options', options);
    console.log('onLoad,content.js=>>>>', wx.getStorageSync('shareFromDaogouInfo'))
    curOptions = options;
    //订阅登录事件
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    app.setUtmOptions(options);
    app.track();
    // 微信数据上报
    app.setIsNewlyOpen(this, options);
    if (options.nickName) {
      wx.setStorageSync('shareFromNickName', options.nickName);
    }

    if (options.isWMall === "true") {
      this.setData({
        noWMall: false,
      })
    }
    if (options.devFlag) {
      wx.setStorageSync(KEYSTORAGE.devFlag, options.devFlag)
    }
    // 分享设备
    if (options.shareDevice) {
      wx.setStorageSync(KEYSTORAGE.shareDevice, options.shareDevice)
    }
    // weMall 打开详情拼团
    if (options.prevPage === 'weMall') {
      this.queryIsPT(options.colorCode)
    }
    // 记录live_room_id
    app.handleRoomId(options);
    let wxScene = wx.getStorageSync(KEYSTORAGE.wxScene) || '';
    let collectParam = Object.assign(curOptions, {
      eventName: curOptions.share_by ? '单品转发' : '打开详情页',
      eventValue: curOptions.share_by ? '对话框' : '',
      shareBy: curOptions.share_by || '',
      shareByShop: curOptions.share_by_shop || '',
      chanId: options.chan_id ? `${options.chan_id}_腾讯有数` : ''
    });
    if (JSON.stringify(options) != "{}") {
      let _user_info = wx.getStorageSync('user_info');
      wx.setStorageSync('prevpageIscoutent', !_user_info);
      contentID = options.conCode;
      contentColorID = options.colorCode;
      if (contentColorID) {
        wx.setStorageSync('contentColorID', options.colorCode);
        GOODS_SPU = contentColorID.substr(0, 9);
      } else {
        contentID = "";
        contentColorID = "";
      }
      if (options.share_by) {
        wx.setStorageSync('shareFromDaogouID', options.share_by);
        wx.setStorageSync('openShareTime', Date.now());
        let shareFromDaogouPageInfo = options;
        shareFromDaogouPageInfo.type = 'zhuanfa';
        app.setShareInfo(shareFromDaogouPageInfo, shareFromDaogouPageInfo);
      }

      if (options.q) {
        wx.setStorageSync('prevpageIscoutent', true);
        var codeUrl = options.q;
        if (codeUrl.indexOf('classifyId') >= 0) {
          var _arr = codeUrl.split('classifyId');
          var _listID = _arr[1].substring(3, 9);
          wx.setStorageSync('listID', _listID);
          wx.setStorageSync('listUpdate_num', 1);
          /*wx.redirectTo({
            url: '/pages/list/list'
          });*/
          wx.redirectTo({ url: `/pages/goodsList/goodsList?list=${_listID}` })

          isHaveClassifyId = true;
          return;
        } else {
          isHaveClassifyId = false;
          let decodeUrl = decodeURIComponent(codeUrl);
          console.log('原始URL', codeUrl);
          console.log('解码的URL', decodeUrl);
          wx.setStorageSync('targetUrl', decodeUrl);
          contentColorID = decodeUrl.split('?')[0].split('.cn/')[1];
          console.log('十二位码', contentColorID);
          SPU_ID = contentColorID;
          contentID = getNineSku(contentColorID)
          wx.setStorageSync('contentColorID', contentColorID);
          wx.setStorageSync('contentID', contentColorID.substr(0, 9));
          let search = decodeUrl.split(contentColorID)[1];
          this.setData({ guideId: getQueryString(search, 'share_by') });
          let storeCode = {
            type: 'friendCircle',
            utmSource: getQueryString(search, 'utmSource') || getQueryString(search, 'utm_source'),
            utmMedium: getQueryString(search, 'utmMedium') || getQueryString(search, 'utm_medium'),
            utmCampaign: getQueryString(search, 'utmCampaign') || getQueryString(search, 'utm_campaign'),
            utmTerm: getQueryString(search, 'utmTerm') || getQueryString(search, 'utm_term'),
            share_by: getQueryString(search, 'share_by'),
            share_by_shop: getQueryString(search, 'share_by_shop'),
          };
          Object.assign(collectParam, {
            eventValue: '朋友圈',
            shareBy: storeCode.share_by,
            shareByShop: storeCode.share_by_shop,
          }, storeCode);
          app.setShareInfo(storeCode);
          wx.setStorageSync('shareFromDaogouID', storeCode.share_by)
          console.log('if=>>>>>>>>>>>');
          app.setUtmOptions(storeCode);
          this.queryIsPT(contentColorID);
        }
      } else {
        wx.setStorageSync('prevpageIscoutent', false);
      }
    } else {//小程序码
      wx.setStorageSync('prevpageIscoutent', false);
      isHaveClassifyId = false;
    };

    intentType = options.intentType;
    intentShopCode = options.shopCode;
    this.setData({
      intentShopCode: intentShopCode || '',
      itemId: getNineSku(options.colorCode)
    });
    if (intentType === `fromShopDetailPage`) {
      contentColorID = options.colorCode;
      contentID = contentColorID.substr(0, 9);
      wx.setStorageSync('contentID', contentID);
      wx.setStorageSync('contentColorID', contentColorID);
    }
    if (intentType === `DAILY_CHECKIN`) {
      this._startDailyCheckInMission(options)
    }
    this.removeLocal();
    // 正常连接
    if (options.colorCode) {
      SPU_ID = options.colorCode;
      contentID = getNineSku(options.colorCode);
    } else {
      //  B类二维码  colorCode%3D420206508S01_ _da%3D423946"
      // options.scene = 'colorCode%3D420206508S01_da%3D423946';
      if (options.scene) {
        const equalMark = '=', connectMark = '_';
        let sceneData = decodeURIComponent(options.scene);
        if(sceneData){
          const utmParam = {
            utm_source: 'wx_goods_pic_qr',
            utm_medium: 'guideShare',
            utm_campaign: '',
            utm_term: ''
          };
          //  企业微信
          if(sceneData.endsWith('_Q')){
            utmParam.utm_source = PAGESTR.wxWorkSource;
            wx.setStorageSync(KEYSTORAGE.devFlag, WX_WORK);
          }
          if(sceneData.includes(connectMark)){
            const sceneObj = {};
            const sceneArr = sceneData.split(connectMark);
            sceneArr.forEach(item => {
              if(item.includes('=')){
                const itemArr = item.split('=');
                sceneObj[itemArr[0]] = itemArr[1];
              }
            });
            if(Object.keys(sceneObj).length){
              if(sceneObj.colorCode || sceneObj.sku){
                contentID = getNineSku(sceneObj.colorCode || sceneObj.sku);
              }
              if(sceneObj.da){
                const share_by = sceneObj.da .length === 6 ? `DA00${sceneObj.da}`: sceneObj.da;
                utmParam.utm_term = share_by;
                app.setShareInfo({share_by});
              }
            }
          }else if(sceneData.includes(equalMark)){
            let sceneArr = sceneData.split(equalMark);
            if (sceneArr && sceneArr[1]) {
              SPU_ID = sceneArr[1]
              contentID = getNineSku(sceneArr[1]);
            }
          }
          app.setUtmOptions(utmParam)
        }
      }
    }
    this.isSubscribe();

    // options.chan_id = 'wx_chan_id_app_123456789'
    //获chan_id
    options.chan_id ? wx.setStorageSync(KEYSTORAGE.chanId, options.chan_id) : '';
    //获取商品信息
    this._getGoodsDetail();
    if (app.config.isShowActivityMark) {
      this.isGetActivityPic();
    }
    // 商品评论 30号上线临时注销
    // this._getGoodsComment('N');

    // 秒杀
    // console.log("options********************", options);

    this.setFixedRight();
    // 判断是收藏
    if (isCollection && wx.getStorageSync(KEYSTORAGE.loginInfo)) {
      this.isGoodCollection();
    }
    app._collectData2(collectParam)
    // 视频相关
    this.videoContext = wx.createVideoContext('myVideo');
    app.setShareMoment();

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
  setSecKill(colorCode){
    const {seckillInfo} = this.data.contentCon
    if(seckillInfo && seckillInfo.endTime){
      if(Array.isArray(seckillInfo.seckillGoodsList) && seckillInfo.seckillGoodsList.length){
        const seckillIndex = seckillInfo.seckillGoodsList.findIndex(item => item.spu === colorCode)
        this.setData({
          isSeckill: seckillIndex >= 0
        })
      }
      const endTime = seckillInfo.endTime.trim()
      this.activityCountDown(decodeURIComponent(endTime));
    }

  },
  // 设置心愿单
  setFixedRight(){
    const {fixedRightArr, showWishIcon} = this.data;
    const {goodsdetailwishlist} = app.globalData.configJson;
    fixedRightArr.forEach(item => {
      if(item.type === activeType){
        item.isShow = goodsdetailwishlist
      }
      if(item.type === 'recommend'){
        item.isShow = !goodsdetailwishlist
      }
    });
    showWishIcon.show = goodsdetailwishlist;
    this.setData({fixedRightArr, showWishIcon});
  },
  // 查询是否拼团
  queryIsPT: function (goodsColorCode) {
    //https://m.veromoda.com.cn/319408510E12  319199519C16
    queryIsPintuan(goodsColorCode).then(res => {
      if (res && res.gsColorCode) {
        if (res.status !== 'stop' && res.endTime > Date.now()) {
          wx.redirectTo({
            url: `/pintuan/pintuanDetail/pintuanDetail?gsColorCode=${res.gsColorCode}&productCode=${res.gsColorCode.substr(0, 9)}`
          })
        }
      }
    })
  },
  removeLocal: function () { // 删除本地导购账号
    let curTime = Date.now();
    let openShareTime = wx.getStorageSync('openShareTime');
    let differDay = Math.floor((curTime - openShareTime) / (1000 * 60 * 60 * 24));
    if (differDay < app.config.differDay) {
      this.setData({ guideId: wx.getStorageSync('shareFromDaogouID') });
    } else {
      wx.removeStorageSync('shareFromDaogouID')
    }
  },
  //导购加入分享收藏
  joinShareCar: function () {
    var isChecked = this.data.isChecked;
    var shareCar = wx.getStorageSync('shareCar');
    isChecked = !isChecked;
    var _contentCon = this.data.contentCon;
    if (isChecked) {
      shareCar.push({
        brandName: _contentCon.brand,
        goodsName: _contentCon.goodsName,
        gsColorCode: thisContentCon.colorCode,
        originalPrice: thisContentCon.originalPrice,
        discountPrice: thisContentCon.price,
        gscMaincolPath: thisContentCon.picurls[0],
        discount: chengfa(thisContentCon.discount, 10)
      });
    } else {
      shareCar.forEach((item, index) => {
        if (item.gsColorCode == contentColorID) {
          shareCar.splice(index, 1);
        }
      });
    }
    this.setData({
      isChecked: isChecked
    });
    wx.setStorageSync('shareCar', shareCar);

  },

   // 倒计时
   activityCountDown:function(objeckTime){
    let year =  objeckTime.substring(0, 4) + '/' + objeckTime.substring(5, 7) + '/' + objeckTime.substring(8, 11);
    let time = objeckTime.substring(11)
    setInterval(() => {
     let objeckTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
      let countTimer = countDown(objeckTime);
      this.setData({
        timeObj: countTimer
      })
    }, 1000);
  },

  toZiyou: function () {
    var _pages = getCurrentPages();
    wx.setStorageSync('isFromDaogou', false);
    wx.navigateBack({
      delta: 2
    });
  },
  isSubscribe() {
    const scene = wx.getStorageSync(KEYSTORAGE.wxScene);
    console.log(scene, '场景值***');
    const sceneArr = [1047, 1124, 1089, 1038];
    if (scene && sceneArr.includes(scene)) {
      let param = {
        unionId: wx.getStorageSync(KEYSTORAGE.unionid),
        brand: app.config.brand
      };
      if (app.config.subscribe && param.unionId) {
        unionIdToOpenId(param).then(res => {
          // subscribe = 1 关注
          this.setData({ showOfficial: res.subscribe !== 1 })
        });
      }
    }

  },
  officialSuccess(e) {
    console.log('officialSuccess****************', e)
  },
  officialError(e) {
    console.log('officialError*******************', e)
  },
  appLogin() {
    const authed = wx.getStorageSync(KEYSTORAGE.authed);
    const loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    if (authed && !loginInfo) {
      // 已经授权，静默登录
      app.login();
    }
  },
  //生命周期函数--监听页面显示
  onShow: function (options) {
    // 获取优惠活动
    this.getCouponList();
    // 微信数据上报
    this.showTime = + new Date();
    app._browsePage(this);
  },
  /*加载底部详情页*/
  loadDetailPage: function () {
    getDetailPage(contentID).then(res => {
      this.setData({
        detailShow: true,  // 详情页是否显示
        bodyContent: res
      })
    })
  },
  // 判断商品是否下架
  goodsStatus(colors){
    // 是否全部下架
    const allOutShelf = colors.every(item => item.status !== 'InShelf');
    if(allOutShelf){
      const router = getCurrentPages();
      wx.showModal({
        title: '提示',
        content: '商品已下架',
        showCancel: false,
        success(){
          if(router.length > 1){
            wx.navigateBack({
              delta: 1,
            })
          }else{
            app.goBack();
          }
        }
      })
    }
  },
  /*请求JOSN数据*/
  _getGoodsDetail: function () {

    wx.setStorageSync('listUpdate', false);
    wx.setStorageSync('isJiajiagou', {});
    wx.setStorageSync('storageCuxiao', {});

    let that = this;
    color_num = 0;
    if (isHaveClassifyId) {
      return;
    }

    //导购分享模块
    let isFromDaogou = false;
    if (that.data.noWMall) {
      isFromDaogou = wx.getStorageSync('isFromDaogou');
      this.setData({
        isFromDaogou,
      });
    }
    const {share_by = ''} = wx.getStorageSync('shareFromDaogouInfo');
    this.setData({ guideId: share_by });
    var shareCar = wx.getStorageSync('shareCar');
    if (shareCar.length > 0) {
      var filterArr = shareCar.filter(item => item.gsColorCode == contentColorID);
      filterArr.length > 0 ? that.setData({ isChecked: true }) : that.setData({ isChecked: false });
    }
    var status_onOff = true;
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    if(goodsMark){
      if(contentID.slice(1,3) === '19'){
        this.setData({ goodsMarkText: '折扣店款仅服装，无图片配件'})
      }
    }
    getGoodsDetail(contentID, '').then(res => {
      wx.hideLoading();
      // 微信用户行为收集 进入详情页
      if (app.config.brand === 'JACKJONES' || app.config.brand === 'VEROMODA') {
        this._wxUserAction('CLICK_PRODUCT');
      }
      // 是否全部下架
      this.goodsStatus(res.color);
      let colors = res.color.filter(({status}) =>  status === 'InShelf') || [];
      this.setData({ contentCon: Object.assign(res, {color: colors}) });
      // 视频数据--start
      let videoBtnShow = false;
      let videoSrc = '';
      let durationTime = 0;
      if (res.reminderPc && res.reminderPc.length) {
        videoSrc = res.reminderPc.split('|')[0];
        durationTime = res.reminderPc.split('|')[1];
        videoBtnShow = true;
      }
      this.setData({
        videoBtnShow,
        videoSrc,
        durationTime
      })
      // 视频数据--end
      const colorCodeList = [];
      let setList = [];
      if (contentColorID !== '') {
        colors.forEach((item, index) => {
          const colorCode = item.colorCode;
          colorCodeList.push(colorCode);
          let skuToImgParam = {
            size: URL_CDN.IMGSIZE108178,
            sku: colorCode,
          };
          item.goodsImg = cdn + skuToImg(skuToImgParam)
          if (colorCode === contentColorID) {
            color_num = index;
            if (item.status !== 'InShelf') {
              color_num = -1;
            }
            this.setData({
              color_list_num: index,
              goodsSizeSku: item.colorCode
            })
          }
          if (item.setList.length) {
            setList.push(...item.setList);
          }
        })
      }
      // 当前12位下架状态
      if(color_num === -1){
        color_num = colors.findIndex(({status}) => status === 'InShelf');
        const goodsSizeSku = colors.find(({status}) => status === 'InShelf');
        this.setData({
          color_num,
          goodsSizeSku
        })
      }

      let sellStock = this.data.kucun_nums;

      // 20200729----商品副标题
      let subGoodsNameTemp = colors[this.data.color_list_num].subGoodsName;
      let subGoodsName = '', subGoodsLink = '';
      if(subGoodsNameTemp && subGoodsNameTemp.indexOf('subtitle') > -1){
        subGoodsName = JSON.parse(subGoodsNameTemp) ? JSON.parse(subGoodsNameTemp).subtitle : '';
        subGoodsLink = JSON.parse(subGoodsNameTemp) ? JSON.parse(subGoodsNameTemp).sublinkMini : '';
      }else{
        subGoodsName = subGoodsNameTemp ? subGoodsNameTemp : '';
      }
      this.setData({
        subGoodsName,
        subGoodsLink
       })
      // 20200729----商品副标题跳转end
      let slider = getPicUrl(colors, this.data.color_list_num, URL_CDN.IMGSIZE750750)
      let c_li = colors[color_num].sizes;
      thisContentCon = colors[that.data.color_list_num];
      if(res.seckillInfo && res.seckillInfo.endTime){
        this.setSecKill(thisContentCon.colorCode)
      }
      // 库存
      let chimaList = [];
      if (c_li && c_li.length) {
        c_li.forEach(item => {
          sellStock += item.sellStock;
          chimaList.push(item.sellStock <= 0)
        })
      }
      /*缩略图*/
      let skuToImgParam = {
        size: URL_CDN.IMGSIZE240400,
        sku: colors[this.data.color_list_num].colorCode,
      };
      let thumbnail = `${cdn}${skuToImg(skuToImgParam)}`;
      thisContentCon = colors[color_num];
      /**
       * 如果只有一种尺寸，也可以支付
       */
      chicun = '';
      if (c_li.length === 1) {
        this.setData({ xzChicun: c_li[0].sizeAlias });
        chicun = c_li[0].sku;
      }
      let shouye = 'block';
      let param = {
        size: URL_CDN.IMGSIZE360640,
      };

      if (setList.length) {
        setList = deteleObject(setList);
        /*推荐搭配*/
        setList.forEach((item, index) => {
          if(!item.colorCode){
            setList.splice(index, 1)
          }else{
            param.sku = item.colorCode;
            item.newImg = `${cdn}${skuToImg(param)}`
          }
        });
      }
      this.setData({
        colorList: colors,
        sizeList: colors[color_num].sizes,
        goodsDetailBean: res,
        slider, c_li, setList, shouye, thumbnail,  kucun_nums: sellStock, chimaList });
      this.getPromotionList(colorCodeList, thisContentCon.colorCode);
      this.setGoodsProduct(colors);
      return thisContentCon;
    }).then(thisContentCon => {
      this.addTrackFn(thisContentCon);
      this.loadDetailPage()
      this.setClassify(thisContentCon);
      const {goodsName} = this.data.contentCon;
      const {originalPrice, discount, price} = thisContentCon;
      wxReportGoods('browse_sku_page', Object.assign(thisContentCon, {goodsName}) );
      this.gio_track('wemall_goodsdetail', {
        productName: goodsName,
        originalPrice,
        currentPrice: price,
        discountRate: discount,
        sourcePageName: this.prevPageTitle(),
      })
    }).catch(err => {
      console.log(err, '***')
      wx.hideLoading();
      // this.gotoIndex();
    })
  },
  prevPageTitle(){
    const pages = getCurrentPages();
    if(pages.length >= 2){
      return pages[pages.length - 2].pageTitle || '';
    }
    return '';
  },
  previewImg(e){
    const {goodsSizeSku, thumbnail} = this.data;
    const imgArr = [];
    const param = {
      size: URL_CDN.IMGSIZE7201280,
      sku: goodsSizeSku
    };
    for(let i = 1 ; i <= 5; i++){
      param.suffix  = `p${i}`;
      imgArr.push(cdn + skuToImg(param))
    }
    wx.previewImage({
      current: thumbnail, // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },
  previewShareImg(){
    const {pic} = this.data;
    wx.previewImage({
      urls: [pic] // 需要预览的图片http链接列表
    })
  },
  // 设置微信好物圈
  setGoodsProduct(colorList){
    // 好物圈
    let {product, contentCon} = this.data;
    const itemCode = thisContentCon.colorCode;
    const nineCode = itemCode.substr(0, 9);
    product = {
      item_code: itemCode, //物品的唯一标识 是
      title: contentCon.goodsName || '', // 物品的名称 是
      desc: thisContentCon.classifyNames,
      category_list: [thisContentCon.categoryName],
      image_list: [],// 是
      src_mini_program_path: getCurrentUrl(),
      brand_info: {
        name: app.config.appName,
        logo: splitImg('logo-black-square.png')
      },
      sku_list: [],
    };
    for (let i = 0; i <= 5; i++) {
      product.image_list.push(
        `${cdn}/goodsImagePC/${app.config.brand}/${nineCode}/${itemCode}/${itemCode}_T0${i + 1}.jpg`
      )
    }
    colorList.forEach(item => {
      product.sku_list.push({
        sku_id: item.colorCode,
        price: chengfa(item.price, 100),
        original_price: chengfa(item.originalPrice, 100),
        status: item.status === 'InShelf' ? 1 : 2,
        sku_attr_list: [
          {
            name: '颜色',
            value: item.colorAlias || ''
          },
          {
            name: '尺码',
            value: item.sizes[0].sizeAlias
          }
        ]
      })
    });
    this.setData({product})
  },
  // 设置好物推荐
  setClassify(thisContentCon){
    if(isJSONStr(thisContentCon.classifyUnitedwebsiteIds)){
      const { recommendtitle = '', recommendlinkMini = ''} = JSON.parse(thisContentCon.classifyUnitedwebsiteIds);
      if(recommendtitle){
        let {classify} = this.data;
        classify.text =  recommendtitle;
        classify.linkUrl = recommendlinkMini;
        this.setData({classify})
      }
    }
  },
  classifyClick(){
    let {linkUrl} = this.data.classify;
    if(linkUrl){
      app.navigateTo(linkUrl)
    }
  },
  redirect: function (e) {
    let dataCode = e.currentTarget.dataset.code;
    this.gio_track('pageclick_goodsdetail_rec', {
      tospu_Id: dataCode,
      sourceId: ''
    });
    wx.redirectTo({
      url: `/pages/content/content?colorCode=${dataCode}`
    })
    // this.onShow();
  },
  // 获取促销列表
  getPromotionList(colorCodes, colorCode){
    const {phone = ''} = wx.getStorageSync(KEYSTORAGE.crmInfo);
    const param = {
      colorCodes,
      phone
    };
    promotionByGoodsColorList(param).then(res => {
      if(res && Object.keys(res).length){
        this.setData({
          colorListPromotion: res,
          promotionList: res[colorCode] || [],
          // 暂无UI
          // promotionCoupons: res[`${colorCode}_coupons`] || []
        })
      }
    });
  },
  setPromotionList(colorCode){
    const {colorListPromotion} = this.data;
    let promotionList = [], promotionCoupons = [];
    if(Object.keys(colorListPromotion).length){
      promotionList = colorListPromotion[colorCode] || [];
      // 暂无UI
      // promotionCoupons = colorListPromotion[`${colorCode}_coupons`] || '';
    }
    this.setData({promotionList, promotionCoupons})
  },
  addCouponByPhone(){
    const {phone} = wx.getStorageSync(KEYSTORAGE.crmInfo)
    const { promotionCoupons } = this.data;
    const param = {
      couponList: [],
      phone,
    }
    if(Array.isArray(promotionCoupons) && promotionCoupons.length){
      promotionCoupons.forEach(({couponNumber}) => param.couponList.push(couponNumber))
    }else{
      return
    }
    // 获取utm参数
    const optionList = wx.getStorageSync(KEYSTORAGE.utmOptions);
    if(optionList && optionList.length){
      optionList.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          param[item.key] = item.value;
        }
      })
    }
    const _this = this;
    wx.showLoading({title: '领取中...'})
    addCoupons(param).then(res => {
      wx.hideLoading()
      this.goOrderSave();
    }).catch(err => {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: err.message,
        confirmText: '继续购买',
        cancelText: '重新领取',
        success (res) {
          if (res.confirm) {
            _this.goOrderSave();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      console.log(err)
    })
  },
  addTrackFn(thisContentCon){
    if(app.config.brand === 'FOL' && wx.getStorageSync(KEYSTORAGE.loginInfo)){
      let jsonData={
        brandCode: app.config.brand,
        browsePrice: thisContentCon.price,
        colorName: thisContentCon.color || '',
        goodsCode: contentID,
        goodsName:  thisContentCon.goodsName || '',
        goodsSku: thisContentCon.sizes[0].sku,
        gsColorCode: thisContentCon.colorCode || '',
        sizeName: thisContentCon.sizes[0].sizeAlias,
      };
      addTrack(jsonData).then(res => {})
    }
  },

  //轮播图的切换事件
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  //导购
  daogou: function (e) {
    if ("BESTSELLER" === app.config.brand || "NAMEIT" === app.config.brand) {
      wx.showModal({
        title: '提示',
        content: '此功能正在开发中，敬请期待。',
        showCancel: false
      });
    } else {
      if (wx.getStorageSync('isWXWork')) {
        return;
      }
      if (!app.checkLogin()) {
        return;
      }
      this.setData({
        flagHideMap: true,
        daogou_display: 'block',
        daogou_number: ''
      });
      app.tdSdkEvent('pageclick_goodsdetail_shopperbind', {});
      app.gioTrack('pageclick_goodsdetail_shopperbind', {spu_id: this.data.goodsSizeSku})
    }
  },

  //选择尺寸 - 开启
  xuanze: function (e) {
    try {
      app.tdSdkEvent('pageclick_goodsdetail_choosecolorsize', {});
    } catch (e) { }
    this.setData({
      details_display: 'block',
      bottom: {
        joinCar: {
          display: 'block',
        },
        goumai: {
          display: 'block',
        }
      }
    });

    //动画调用
    animateShow(this);
  },

  //选择尺寸 - 关闭
  chicunHide: function (e) {

    animateHide(this);

  },

  //选择尺寸 - 关闭1 - 上一页是购物车
  chicunHide1: function (e) {

    this.setData({
      details_display1: false
    });

  },

  //加入购物清单
  joinCar: function (e) {
    if (wx.getStorageSync('isWXWork')) {
      return;
    }

    if (!app.checkLogin()) {
      return;
    }
    var that = this;
    var id = e.currentTarget.id;
    const { type = '' } = e.currentTarget.dataset;
    this.setData({ addWishList: type === activeType })
    if (id == 'joinCar1') {
      this.setData({
        flagHideMap: true,
        details_display: 'block',
        bottom: {
          joinCar: {
            display: 'block',
          },
          goumai: {
            display: 'none',
          }
        }
      });
      //动画调用
      animateShow(this);
      return;
    };
    if (chicun == '' && id == 'joinCar2') {
      wx.showModal({
        title: '提示',
        content: '请您选择尺码后添加',
        showCancel: false
      });
      return;
    };
    const {xzChicun, nums} = this.data;
    if (nums == 0) {
      wx.showModal({
        title: '提示',
        content: '请您选择有效尺码',
        showCancel: false
      });
      return;
    };
    if (chicun != '' && id == 'joinCar2') {
      var content_data = that.data.contentCon;


      //加入购物车
      var shoppingAddOption = [];
      let categoryList = [];
      if (thisContentCon.classifyNames) {
        if (thisContentCon.classifyNames.includes(',')) {
          categoryList = thisContentCon.classifyNames.split(',')
        } else {
          categoryList.push(thisContentCon.classifyNames)
        }
        if (!categoryList[categoryList.length - 1]) {
          categoryList.splice(categoryList.length - 1, 1)
        }
      }

      shoppingAddOption = {
        "goodsName": content_data.goodsName,
        "goodsCode": content_data.projectCode,
        "gsColorCode": chicun.substr(0, 12),
        "gscPicmainId": "",
        "gscPicmainPath": thisContentCon.picurls[0],
        "goodsSku": chicun,
        "sizeName": xzChicun,
        "colorName": thisContentCon.colorAlias,
        "quantity": nums,
        category_list: categoryList,  //Array
        price: thisContentCon.price * 100,   // Number  售价精确到分
        original_price: thisContentCon.originalPrice * 100,   // Number  原价精确到分
      };

      if (this.data.addWishList) {
        const addWishParam = {
          brand,
          gcsSku: chicun,
          discountPrice: thisContentCon.price,
          goodsName: content_data.goodsName,
          originalPrice: thisContentCon.originalPrice,
          discount: thisContentCon.discount,
          colorName: thisContentCon.colorAlias,
          sizeName: this.data.xzChicun
        };
        this.addWish(addWishParam);
        return;
      }
      let collectParam = Object.assign(curOptions, { eventValue: shoppingAddOption.goodsSku, eventName: '点击添加购物车' });
      app._collectData2(collectParam);
      const {goodsName} = this.data.contentCon;
      const addGoodsInfo = Object.assign(thisContentCon,
        {goodsName,
          sku_num: nums,
          goodsSku:chicun
        })

      try {
        wxReportGoods('add_to_cart', addGoodsInfo, 'append_to_cart_in_cart');
        const wxVideoLiveRoom  = wx.getStorageSync(KEYSTORAGE.wxVideoLiveRoom)
        app.tdSdkEvent('pageclick_goodsdetail_addtoshoppingcar', { GOODS_ID: chicun });
        this.gio_track('wemall_addToCartResult', {
          sku_id: chicun,
          spu_id: chicun.substr(0, 12),
          addToCartTime: formatDate(Date.now()).replace(/-/g, '/'),
          productName: goodsName,
          originalPrice: thisContentCon.originalPrice,
          currentPrice: thisContentCon.price,
          discountRate: thisContentCon.discount,
          num: nums,
          pagename: '商详',
          liveRoomNo: wxVideoLiveRoom ? wxVideoLiveRoom.id : ''
        })
      } catch (e) {}
      wx.showLoading({
        title: "Loading....",
        mask: true
      });
      shoppingAdd(shoppingAddOption).then(res => {
        wx.hideLoading();
        this.chicunHide();
        if (res.msg === '成功') {
          // 微信用户行为“加入购物车”
          if (app.config.brand === 'JACKJONES' || app.config.brand === 'VEROMODA') {
            this._wxUserAction('ADD_CART');
          }
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
            duration: 500
          });
          let localCartList = wx.getStorageSync(KEYSTORAGE.cartList);
          let changeNum = localCartList.totalCounts + 1;
          app.changeLocalCart(changeNum);
        } else if (res === '已添加！') {
          wx.showToast({
            title: '商品已添加，详见购物车',
            image: '../../images/joinFalse.png',
            duration: 500
          });
        }
      }).catch(err => {
        wx.showToast({
          title: err,
          duration: 2000
        })
      });
    }
  },
  addWish(param) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    addSkuToWish(param).then(res => {
      if (res) {
        wxShowToast('添加心愿单成功');
        this.chicunHide();
      }
    }).catch(err => wxShowToast(err.message));
  },
  formSubmit: function (e) {
    const formId = e.detail.formId;
    try {
      app.tdSdkEvent('pageclick_goodsdetail_buynow', {
        FORM_ID: formId
      });
    } catch (e) { }
    this.goumai(e);
  },
  //购买
  goumai: function (e) {
    if (!app.checkLogin()) {
      return;
    }
    var id = e.currentTarget.id;
    if (id === 'goumai1') {
      this.setData({
        flagHideMap: true,
        details_display: 'block',
        bottom: {
          joinCar: { display: 'none', },
          goumai: { display: 'block', }
        }
      });
      //动画调用
      animateShow(this);
      this.gio_track('pageclick_goodsdetail_buynow')
      return;
    }
    if (chicun == '' && id == 'goumai2') {
      app.ifWXWork(false)
      wx.showModal({
        title: '提示',
        content: '请您选择尺码后购买',
        showCancel: false
      });
      return;
    }
    const {nums, chima_list_num, intentShopCode, contentCon, c_li, promotionCoupons, isSeckill} = this.data;
    if (nums === 0) {
      wx.showModal({
        title: '提示',
        content: '请您选择购买数量',
        showCancel: false
      });
      return;
    }
    if (chicun != '' && c_li.length == 1) {
      this.setData({
        chima_list_num: 0
      });
    }
    var ddJson = {
      color: contentCon.color[color_num],
      size: contentCon.color[color_num].sizes[chima_list_num],
      goodsName: contentCon.goodsName,
      nums: nums,
      goodsCode: contentCon.projectCode,
      goodsSku: chicun,
      discount: contentCon.color[color_num].discount,
      onePrice: contentCon.color[color_num].price.toFixed(2),
      allPrice: chengfa(contentCon.color[color_num].price, nums).toFixed(2),
      bindReason: isSeckill ? (contentCon.seckillInfo.title || '秒杀') : ''
    };
    let arr = [];
    arr.push(ddJson);
    wx.setStorageSync('dingdanCon', arr);
    wx.setStorageSync('useMyCoupons', {});
    wx.setStorageSync('isJiajiagou', {});
    if (wx.getStorageSync('isWXWork')) {  //判断企业微信
      return;
    }
    if (intentShopCode) {
      wx.setStorageSync(KEYSTORAGE.NEARBY_SHOP_CODE, intentShopCode);
    }
    let collectParam = Object.assign(curOptions, { eventValue: 'buynow', eventName: '点击立即购买' });
    try {
      app.tdSdkEvent('pageclick_goodsdetail_choosecolorsize_buynow', {
        COLOR_TYPE: contentCon.color[color_num],
        SIZE_CODE: contentCon.color[color_num].sizes[chima_list_num],
        NUMS: nums
      })
      app._collectData2(collectParam);
      this.gio_track('pageclick_goodsdetail_choosecolorsize_buynow', {
        color: ddJson.color.colorAlias,
        sizeTags: ddJson.size.sizeAlias,
        num: ddJson.nums,
        sku_id: chicun,
        discountRate: ddJson.color.discount,
        currentPrice: ddJson.color.price,
        originalPrice: ddJson.color.originalPrice,
        productName: ddJson.color.goodsName
      })
    }catch (err){}
    if(Array.isArray(promotionCoupons) && promotionCoupons.length){
      this.addCouponByPhone();
      return;
    }
    this.goOrderSave();
  },
  goOrderSave(){
    wx.redirectTo({
      url: '../orderSave/orderSave'
    });
  },
  gio_track(name, options){
    const {goodsSizeSku, colorList, color_list_num} = this.data;
    const param = {
      spu_id: SPU_ID
    }
    if(!param.spu_id){
      param.spu_id = goodsSizeSku ? goodsSizeSku.substr(0, 12) : colorList[color_list_num].colorCode
    }
    if(options){
      Object.assign(param, options)
    }
    app.gioTrack(name, param)
  },

  //颜色点击切换
  color_list: function (e) {
    let id = e.currentTarget.id;
    let dataCode = e.currentTarget.dataset.code;
    let goodsSizeSku = dataCode;
    this.setPromotionList(goodsSizeSku);
    this.setSecKill(dataCode)
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku: dataCode,
    };
    let thumbnail = `${cdn}${skuToImg(skuToImgParam)}`;
    let con_data = this.data.contentCon;
    color_num = Number(id);
    thisContentCon = con_data.color[id];

    let Slider = getPicUrl(con_data.color, id, URL_CDN.IMGSIZE750750);
    let arr = [];
    let cLi = con_data.color[id].sizes;
    kucuns = 0;

    //区分库存为0的尺码样式
    cLi.forEach(item => {
      if (item.sellStock <= 0) {
        arr.push(true);
      } else {
        kucuns += item.sellStock;
        arr.push(false);
      }
    });
    let curNum = 0;
    kucuns === 0 ? curNum = 0 : curNum = 1;
    this.setData({
      color_list_num: id,
      xzChicun: '请选择尺码',
      chima_list_num: -1,
      c_li: cLi,
      slider: Slider,
      kucun_nums: kucuns,
      chimaList: arr,
      nums: curNum,
      thumbnail: thumbnail,
      goodsSizeSku
    });
    chicun = '';

     // 20200729----商品副标题
     let subGoodsNameTemp = thisContentCon.subGoodsName;
     let subGoodsName = '',subGoodsLink = '';
     if(subGoodsNameTemp && subGoodsNameTemp.indexOf('subtitle') > -1){
       subGoodsName = JSON.parse(subGoodsNameTemp) ? JSON.parse(subGoodsNameTemp).subtitle : '';
       subGoodsLink = JSON.parse(subGoodsNameTemp) ? JSON.parse(subGoodsNameTemp).sublinkMini : '';
     }else{
       subGoodsName = subGoodsNameTemp ? subGoodsNameTemp : '';
     }
     this.setData({
      subGoodsName,
      subGoodsLink
     })
     // 20200729----商品副标题
    if (cLi.length == 1) {
      this.setData({
        xzChicun: cLi[0].sizeAlias,
        chima_list_num: 0
      });
      chicun = cLi[0].sku;
    }
     try{
       app.gioTrack('pageclick_goodsdetail_choosecolorsize', {
         spu_id: dataCode
       })
     }catch (e){}
  },


  //尺码点击切换
  chima_list: function (e) {
    let id = Number(e.currentTarget.id);
    let con_data = this.data.contentCon;
    const curColorSize = con_data.color[color_num].sizes[id];
    let kucun_nums = curColorSize.sellStock;
    let nums = 1;
    if (kucun_nums <= 0) {
      nums = 0;
      wxShowToast('请选择其他尺码');
      return;
    }
    chicun = curColorSize.sku;
    this.setData({
      chima_list_num: id,
      xzChicun: curColorSize.sizeAlias,
      goodsSizeSku: chicun,
      kucun_nums,
      nums,
    });
    app.gioTrack('pageclick_goodsdetail_choosecolorsize', {
      spu_id: chicun.substr(0, 12),
      sku_id: chicun
    })
  },

  //件数增加
  add_number: function (e) {
    var numm = this.data.nums;
    if (this.data.addWishList) {
      // 心愿单
      return;
    }
    if (numm >= this.data.kucun_nums) {
      return;
    };
    numm++;
    this.setData({
      nums: numm
    });
  },

  //件数减少
  jian_number: function (e) {
    var numm = this.data.nums;
    if (numm === 1) {
      return;
    }
    numm--;
    this.setData({
      nums: numm
    });
  },

  //图片加载完成
  loadImg: function (event) {

    var tTop = event.currentTarget.offsetTop;

    imgArr.push({
      id: event.currentTarget.id,
      offsetTop: tTop
    });
    imgArr.sort(objectArraySort('id'));
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

  //回到顶部
  goTopFun: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      goTop_show: false
    });
    try {
      app.tdSdkEvent('pageclick_goodsdetail_totop', {})
      app.gioTrack('pageclick_goodsdetail_totop', {
        spu_id: this.data.goodsSizeSku.substr(0, 12)
      })
    } catch (e) { }
  },

  //到底部
  toDown: function (e) {
    wx.pageScrollTo({
      scrollTop: 20000
    });
  },

  //回到首页
  gotoIndex: function (e) {
    try {
      app.tdSdkEvent('pageclick_goodsdetail_tohome', {});
      this.gio_track('pageclick_goodsdetail_tohome');
    } catch (e) { }
    app.goBack()
  },

  //转发给朋友
  onShareAppMessage: function (res) {
    var contentXinxi = this.data.contentCon;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    };
    this.cancelShare()
    let path = '/pages/content/content';
    let title = contentXinxi.goodsName;
    let shareOptions = {
      colorCode: contentXinxi.color[color_num].colorCode,
      conCode: contentXinxi.projectCode,
      devFlag: app.urlDevFlag(),
    };
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let guideId = guideInfo.employeeId || '';
    let guideShop = guideInfo.shopCode || '';
    if (guideId) {
      let guideOptions = {
        share_by: guideId,
        share_by_shop: guideShop,
        utm_medium: 'guideshare',
        utm_source: 'miniprogram_zhuanfa',
        utm_term: guideId,
        nickName: wx.getStorageSync(KEYSTORAGE.wxInfo).nickName || '',
        shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || ''
      };
      Object.assign(shareOptions, guideOptions);
    }
    // let path = '/pages/content/content?colorCode=' + contentXinxi.color[color_num].colorCode + '&conCode=' + contentXinxi.projectCode;
    let collectParam = Object.assign(curOptions, {
      eventName: `单品转发_${contentID}_${guideId}`,
      eventValue: '对话框'
    });
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    if(isWXWork){
      const wxWorkSource = {utm_source: PAGESTR.wxWorkSource}
      Object.assign(collectParam, wxWorkSource);
      Object.assign(shareOptions, wxWorkSource);
    }
    console.log(path + objToQuery(shareOptions), '********');
    let sharePath = path + objToQuery(shareOptions);
    try {
      app.tdSdkEvent('pageclick_goodsdetail_share', {
        TITLE: title,
        PATH: path
      });
      app.tdShare(title, sharePath);
      /*app.gioTrack('pageclick_goodsdetail_share_guest', {
        spu_id: shareOptions.colorCode
      })*/
      app.gioTrack('wemall_shopperbindShare', {
        STAFF_NO: guideId,
        count_Type: '详情页',
        share_ID: shareOptions.colorCode,
        share_Name: title,
      })
      app._collectData2(collectParam);
    } catch (e) {console.error(e) }
    return {
      title: title,
      path: sharePath,
      imageUrl: this.data.slider[0].picUrl,
      success: function (res) { },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onMapShows: function (e) {
    this.gio_track('pageclick_goodsdetail_store');
    if (this.isONLY) {
      checkAndGetProvincesInfo()
        .then(result => {
          this.mCurrLongitude = result.location.lng;
          this.mCurrLatitude = result.location.lat;
          this.currProvince = result.ad_info.province;
          this.currCity = result.ad_info.city;
          this.currDist = result.ad_info.district;
          this.onShopInStockBarClick()
        })
      return
    }

    if (!this.data.flagHideMap) {
      this.setData({ flagHideMap: true });
      return
    }

    wx.showLoading({
      title: '加载中...'
    });
    checkAndGetProvincesInfo()
      .then(result => {
        this.mCurrLongitude = result.location.lng;
        this.mCurrLatitude = result.location.lat;
        this.currProvince = result.ad_info.province;
        this.currCity = result.ad_info.city;
        this.currDist = result.ad_info.district;
        let postBean = {
          brandCode: getApp().config.brand,
          latitude: this.mCurrLatitude,
          longitude: this.mCurrLongitude,
          province: cutProvince(this.currProvince),
          sku: wx.getStorageSync('contentColorID'),
          pageNum: 1,
          pageSize: 1,
          distance: 40,
        }
        console.log(postBean);
        return ShopUtil.getNearbyShops(postBean);
      })
      .then(backBean => {
        console.log(`>>>>>>>>>>>>>>>>>>> backBean ====================================`);
        console.log(backBean);
        let currShopBean = backBean.list[0];
        let { longitude, latitude, shopNameCn, shopCode } = currShopBean;
        let marker0 = ShopUtil.getMarkerDefault(0, longitude, latitude, shopNameCn);
        let markersList = new Array();
        markersList.push(marker0);
        let pointsList = [{
          longitude: longitude,
          latitude: latitude,
        }];
        this.setData({
          currentShopBean: currShopBean,
          shopCode: shopCode,
          flagHideMap: false,
          flagHaveStock: true,
          flagMapAnchor: true,
          includePoints: pointsList,
          markers: markersList
        })
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
        console.log(`>>>>>>>>>>>>>>>>>>> catch ee <<<<<<<<`);
        console.log(e);
        this.setData({
          flagHideMap: false,
          flagHaveStock: false,
        });
      });
  },

  onTmplStockBagClick: function (e) {
    //弹出库存pop页
    wx.showLoading({
      title: '加载中...'
    });
    let postB = {
      shopCode: this.data.shopCode,
      sku: GOODS_SPU,
    };
    let thumbnailUrl0 = getThumbnailNormPath(this.data.colorList, GOODS_SPU, 0);
    this.setData({
      thumbnailUrl: thumbnailUrl0,
      colorIndex: 0,
      flagShowStockDetail: true,
      flagMapAnchor: false,
    });
    ShopUtil.getShopStock(postB)
      .then(processed => {
        this.setData({
          goodsStockBean: processed,
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.showToast({
          title: `${e.message}`,
        });
        wx.hideLoading();
      });

  },


  onTmplColorItemClick: function (e) {
    let id = e.currentTarget.id;
    let picUrlNew = getThumbnailNormPath(this.data.colorList, GOODS_SPU, id);
    let sizeListNew = this.data.colorList[id].sizes;//该颜色下的尺寸集合
    this.setData({
      thumbnailUrl: picUrlNew,
      colorIndex: id,
      // stockTip: '请选择尺码',
      sizeIndex: -1,
      sizeList: sizeListNew,
    });
  },

  onTmplSizeItemClick: function (e) {
    this.setData({
      sizeIndex: e.currentTarget.id,
    });
    console.log(`sizeIndex = ${this.data.sizeIndex}`);
    console.log(`sizeList[sizeIndex] = ${this.data.sizeList[this.data.sizeIndex]}`);
    console.log(`sizeList[sizeIndex].sku = ${this.data.sizeList[this.data.sizeIndex].sku}`);
    console.log(`goodsStockBean[sizeList[sizeIndex].sku] = ${this.data.goodsStockBean[this.data.sizeList[this.data.sizeIndex].sku]}`);
  },


  onTmplNavToShopClick: function (e) {
    if (throttle()) {
      wx.openLocation({
        name: this.data.currentShopBean.shopNameCn,
        address: this.data.currentShopBean.address,
        latitude: this.data.currentShopBean.latitude,
        longitude: this.data.currentShopBean.longitude,
        scale: 28
      });
    }

    // let that = this;
    // let navBeanRaw = {
    //   mCurrLongitude: that.data.mCurrLongitude,
    //   mCurrLatitude: that.data.mCurrLatitude,
    //   shopBean: that.data.currentShopBean,
    // }
    // let navBean = JSON.stringify(navBeanRaw);
    // console.log(`navBean===========${navBean}`);
    // wx.navigateTo({
    //   url: `/pages/nearbyShops/navMap/navMap?navBean=${navBean}`,
    // })
  },

  onMapHideClick: function (e) {
    this.setData({ flagHideMap: true });
  },
  onShopInStockBarClick: function (e) {
    let sku = wx.getStorageSync('contentColorID');
    let sku15Temp = this.data.contentCon.color[0].sizes[0].sku;
    let currLongi = this.mCurrLongitude;
    let currLati = this.mCurrLatitude;
    let currProvince = this.currProvince;
    let currCity = this.currCity;
    let currDist = this.currDist;
    if (throttle()) {
      wx.navigateTo({
        url: `/pages/nearbyShops/shopInStock/shopInStock?currLongi=${currLongi}&currLati=${currLati}&sku=${sku}&sku15Temp=${sku15Temp}&currProvince=${currProvince}&currCity=${currCity}&currDist=${currDist}`,
      })
    }
  },

  onTmplPopGoodsStockClose: function (e) {
    this.setData({
      flagShowStockDetail: false,
      flagMapAnchor: true,
      colorIndex: -1,
      sizeIndex: -1,
    });
  },

  _wxUserAction: function (action) {
    let data = [];
    console.log(this.data.contentCon.goodsName);

    data.push({
      action_type: action,
      action_param: {
        'product_id': contentColorID,
        'industry_id': '',
        'product_name': this.data.contentCon.goodsName,
      }
    });
    wxUserActions(data);
  },


  getCouponList: function () {
    let beanJson = {
      brandCode: app.config.brand,
      channelCode: 'MINIPROGRAM',
    }
    // 获取优惠券
    goodsDetailgetCouponList(beanJson).then(data => {
      if (data.promotionActionList.length === 0) {
        return
      }
      let actionCouponList = data.promotionActionList[0];
      let curTime = new Date().getTime();
      if (curTime < (new Date(actionCouponList.actionStartDate).getTime() - 288000000)
        || (new Date(actionCouponList.actionEndDate).getTime() + 57600000) < curTime) {
        return
      }
      if (actionCouponList) {
        this.setData({
          hasCoupon: true,
          CoupontitleImage: cdn + actionCouponList.actionLogo
        })
        let actionList = actionCouponList.actionCouponList;
        for (let i = 0; i < actionList.length; i++) {
          actionList[i].imgUrl = cdn + actionList[i].imgUrl
        }

        this.setData({
          activityInfo: actionCouponList,
          //couponList: actionList,
        })

      } else {
        this.setData({
          hasCoupon: false,
        })
      }

    }).catch(err => {

    })
    // .then(res =>{
    //   let _phone = wx.getStorageSync('user_info').phone;
    //   // 判断actionId是否存在
    //   if(this.data.activityList && this.data.activityList.actionId && _phone){
    //     let jsonRec = {
    //       actionId: this.data.activityList.actionId,
    //       phone: _phone,
    //     }
    //     this.checkHasGoupon(jsonRec);
    //   }

    // })
  },


  getCoupon: function (e) {
    wx.hideLoading();
    if (!getApp().checkLogin()) {
      return;
    } else {
      if (wx.getStorageSync('user_info').phone) {
        if (!wx.getStorageSync('wxSubscriptions').isCoupon) {
          wxSubscription("coupon").then(res => {
            this.setData({
              coupon_display: true,
            })
          }).catch(err => {
            this.setData({
              coupon_display: true,
            })
          });
        } else {
          this.setData({
            coupon_display: true,
          })
        }
      } else {
        app.getCRMInfoFn();
      }
    }
  },

  checkHasGoupon: function (_data) {
    // 判断是否领取过优惠券
    queryGetCouponRecord(_data).then(res => {
      let hasReceived = false;
      if (res) {
        // res 有数据代表已经领取过了  res =null 代表没有领取过
        hasReceived = true
      } else {
        hasReceived = false
      }
      this.setData({
        hasReceive: hasReceived,
      })
    })
  },

  /**
   * 判断是否收藏过
   */
  isGoodCollection: function () {
    let jsonData = {
      goodsCode: contentColorID,
      //unionId: wx.getStorageSync('unionid'),
      unionId: "", // wx.getStorageSync('unionid'),
    }
    isGoodsQuery(jsonData).then(res => {
      console.log("isCollection =================== ", res);
      let arrs = this.data.fixedRightArr;
      arrs[1].isShow = isCollection && !res;
      arrs[2].isShow = isCollection && res;
      this.setData({
        fixedRightArr: arrs,
      })
    })
  },

  isGetActivityPic: function () {
    if (contentColorID) {
      getActivityPic(contentColorID).then(res => {
        this.setData({
          hasActivity: !!res.linkPic,
          activityImage: res.linkPic ? res.linkPic : '',
        })
      }).catch(err => {

      })
    }
  },

  /**
   * 添加删除收藏夹
   * @param _status
   * _status = 0 添加收藏夹 _status=1 取消收藏
   */
  optionsCollection: function (_status) {
    const {color_list_num, colorList, contentCon} = this.data;
    const {goodsName} = contentCon
    let jsonData = {
      goodsCode: contentColorID,
      deleteStatus: _status,
      goodsName,
      unionId: "", // wx.getStorageSync('unionid'),
    }
    const {originalPrice, price, discount } = colorList[color_list_num];
    this.gio_track('pageclick_goodsdetail_collect', {
      addToFavorTime: formatDate(Date.now()).replace(/-/g, '/'),
      productName: goodsName,
      originalPrice,
      currentPrice: price,
      discountRate: discount
    });
    optionGoodsCollection(jsonData).then(res => {
      let arrs = this.data.fixedRightArr;
      let iscollection = _status === '0';
      arrs[1].isShow = app.config.isCollection && !iscollection;
      arrs[2].isShow = app.config.isCollection && iscollection;
      this.setData({
        fixedRightArr: arrs,
      })
      wx.showToast({
        title: _status === "0" ? '收藏成功' : '收藏取消'
      })

      // 埋点 添加收藏夹
      if (_status === "0") {
        let collectParam = Object.assign(curOptions, { eventValue: contentColorID, eventName: '详情页添加收藏夹' });
        app._collectData2(collectParam);
      }
    })
  },

  closeCoupon: function () {

    this.setData({
      coupon_display: false,
    })
  },

  // 去掉优惠券弹窗
  changeShow: function (e) {
    this.setData({
      coupon_display: false,
    });
  },

  goCoupon: function () {
    wx.navigateTo({
      url: '../../member/couponsList/couponsList'
    })
  },

  _startDailyCheckInMission:function(options){
    let dailyMissionSec = options.countDownSec
    this.dailyCheckInTimer = setInterval(() =>{
      --dailyMissionSec
      this.setData({dailyMissionSec: dailyMissionSec<=0? 0:dailyMissionSec})
      if(dailyMissionSec<=0)
      wx.navigateBack({
        delta: 1
      });
    },1000);
  },

  // jumpMiniCard: function(){
  //   app.navigateTo(this.data.activityList.minipageUrl);
  // },


  _getGoodsComment: function(){
      let {pinglunData, buyerShowData} = this.data;
      let jsData = {
        goodsCode: contentID,
      }
      getGoodsComment(jsData).then(res =>{
        pinglunData = res;
        this.setData({
          pinglunData,
        })
        return pinglunData;
      }).then(data =>{
        console.log("data =====", data)
        if(data){
          let jsData = {
            goodsCode: contentID,
            isBuyerShow: 'Y'
          }
          getGoodsComment(jsData).then(res =>{
            buyerShowData = res;
            this.setData({
              buyerShowData
            })
          })
        }
      }).catch(err=>{
        wxShowToast(err)
      })
  },

  buyersOnClick: function(e){
    console.log("e=====", e)
    let type = e.detail;
    let jumpUrl = '';
    switch(type){
      case 'evaluate':
        jumpUrl = '/order/buyerShow/evaluateList/evaluateList?goodCode='+ contentID;
        break;
      case 'buyerShow':
        jumpUrl = '/order/buyerShow/buyerShowList/buyerShowList?goodCode=' + contentID + '&colorCode=' + contentColorID;
        break;
    }
    wx.navigateTo({
      url: jumpUrl
    })
  },
  pageTitle: '商品详情',
  onHide: function () {
    app._leavePage(this);
    events.unregister(this, EVENTS.EVENT_LOGINED);
  },

  // 视频播放相关
  // 视频暂停
  videoPause(e) {
    this.videoContext.pause();
    let startTime = this.data.currentTime;
    this.setData({
      startTime
    })
  },
  // 视频播放
  videoPlay() {
    setTimeout(() => {
      this.videoContext.play();
    }, 500)
  },
  // 改变视频显示与否
  changeSwiperShow() {
    let swiperShow = this.data.swiperShow;
    if (swiperShow) {
      this.videoPlay();
    } else {
      this.videoPause();
    }
    this.setData({
      swiperShow: !swiperShow
    })
  },
  // 获取视频的播放信息
  getVideoInfo(e) {
    let currentTime = e.detail.currentTime;
    this.setData({
      currentTime,
    })
  },
  // 副标题跳转
  subGoodsJump() {
    const {subGoodsLink = ''} = this.data
    if(subGoodsLink){
      app.navigateTo(subGoodsLink)
    }
  },

  onUnload: function () {
    app._leavePage(this);
    clearInterval(this.hbyInterval)
    clearInterval(this.dailyCheckInTimer)
  },
  hbyTap(){
    wx.navigateBack({
      delta: 1
    });
  }
})
