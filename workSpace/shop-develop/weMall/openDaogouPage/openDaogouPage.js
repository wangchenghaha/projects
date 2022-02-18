import { EVENTS,KEYSTORAGE, URL_CDN, PAGESTR} from '../../src/const.js'
import {skuToImg, judgeUrl, splitImg, debounce} from '../../utils/utils'
import { getGuideInfo, getShareGoodsList,  getShareJSON, shareUpdate,getBrandConfig } from '../../service/guide'
import events from '../../src/events';
import {getMiniOpenid } from "../../service/mini";
import {getConfigJSON} from "../../service/init";

var app = getApp();
const brand = app.config.brand;
const cdn = app.config.cdn;
const goTop = 'goTop', goIndex = 'goIndex'
var shareTitle = '';
var daogouID = '';
var zuheID = '';
let type = 'qr';
let shareInfo ={};
let tempOption = {};
const maxScroll = 600;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    List: [],
    upImage: '',
    wrapIsShow: false,
    daogouImage: `/images/logo-black-${brand}-square.png`,
    daogouInfo: {},
    shareJson: {},
    shareTitle: '',
    titleLogo: splitImg('logo-black-square.png'),
    // 亮点元素
    highLight: [],
    QRCodeImg: splitImg('QRCode.jpg'),// 公众号二维码
    // bannerImg: `${cdn}/assets/common/${brand}/image/member_banner.jpg`,// banner 图
    bannerImg: splitImg('share-banner.jpg'),// banner 图
    pageTitle:'',
    wechatVersion:'wechat',
    toView:'',
    goodsList:[],
    guideId:'',
    bannerUpList: [],
    bannerList: [],
    shortVideo: '',
    modelType: '',
    fixBottom: {
      show: false,
      list: [
        {
          text: '返回顶部',
          icon: splitImg('icon_arrow.png', 'common'),
          type: goTop
        },
        {
          text: '去商城逛逛',
          icon: splitImg('icon_wemall.png', 'common'),
          type: goIndex
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //未登录不让进
    /*if (!wx.getStorageSync(KEYSTORAGE.loginInfo)) {
      wx.navigateTo({url: '/pages/setting/requestPermission'});
      return;
    }*/
    //   VM
    /*options={
     cID:"DA00423946",
     guideTitle:'null推荐给你的',
     titleLogo:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJuaEtWcdQ4DfrwXupqgHxTiap6LYibmJ3Nat5jM5ibDWL8Uiaexadp1t6b3DyJYdiaDwmegeaKmDv8L2w/132',
     zID:"DA004239461555212403595"
    };*/
    //标题
    wx.setNavigationBarTitle({ title: getApp().config.title });
    wx.setStorageSync('openPageOnoff', true);
    let nowTime = Date.now();
    wx.setStorageSync('openShareTime', nowTime);
    let wechatVersion= wx.getStorageSync(KEYSTORAGE.isEnterprise) ? 'enterprise_wechat' : 'wechat';  // 是否企业微信
    if (options.zID) {
      console.log('通过导购分享进入options=>>>>',options);
      type = 'shareUser';
      daogouID = options.cID;
      zuheID = options.zID;
      wx.setStorageSync('shareFromDaogouPageInfo', options);
      const shareParam = {
        type,
        share_by : daogouID,
        share_by_shop: options.shareByShop,
      };
      tempOption = options;
      app.setShareInfo(shareParam);
      app.setUtmOptions(options)
    } else {
      console.log('小程序码进入options=>>>>', options);
      type = 'qr';
      let scene = decodeURIComponent(options.scene);
      let strLen = scene.split('=')[1];
      let utmSource = 'wx_cover_pic_qr';
      if(strLen && strLen.includes(PAGESTR.QY)){
        console.log(strLen,'before***');
        strLen = strLen.replace(PAGESTR.QY,'');
        console.log(strLen,'after***');
        utmSource = 'wxwork_cover_pic_qr'
      }
      daogouID = strLen.substring(0, 10);
      let shareGuideID={
        storeTime: Date.now(),
        guideId: daogouID,
      };
      zuheID = strLen;
      let utmOption = {
        utmCampaign: zuheID,
        utmMedium: 'guideshare',       //  'guideshare'
        utmSource,
        utmTerm: daogouID,
      };
      Object.assign(tempOption, utmOption);
      app.setUtmOptions(utmOption);
      wx.setStorageSync(KEYSTORAGE.shareGuideID, shareGuideID);
      this.getGuideInfo(daogouID);
    }
    wx.setStorageSync('shareFromDaogouID', daogouID);  // 存储导购号
    wx.showLoading({title: '加载中...'});
    let list = wx.getStorageSync('shareCar');
    this.setData({
      List: list,
      wechatVersion: wechatVersion,
    });
    console.log('!!options.titleLogo=>>>', !!options.titleLogo)
    if(!!options.titleLogo){
      this.setData({pageTitle: options.guideTitle});
    }
	  if(options.devFlag){
		  wx.setStorageSync(KEYSTORAGE.devFlag, options.devFlag)
	  }
	  // 分享设备
	  if(options.shareDevice){
		  wx.setStorageSync(KEYSTORAGE.shareDevice, options.shareDevice)
	  }
    if(!!options.guideTitle){
      this.setData({daogouImage: options.titleLogo});
    }
    //PWT: 如果用户通过分享链接打开小程序(用户拒绝授权未登录成功时)不应该调用高权限接口
    //onLoad时 注册一个登录成功的事件,登录成功后再去获取
    //onUnLoad时 释放事件
    /*;
    getShareGoodsList()*/
    // 获取JOSN文件
    this.getShareJSON(zuheID);
    this.getBrandConfig();
    this.getUnionid();
    /*if(!wx.getStorageSync('login_entiry')){
      //订阅登录事件
      events.register(this, EVENTS.EVENT_LOGINED);
      app.initApp();
    }*/
  },
  // 品牌配置文件
  getBrandConfig: function(){
    getConfigJSON().then(res => {
      // 封面图下面的图片
      let bannerList = this.data.bannerList, bannerUpList = this.data.bannerUpList;
      if(res.banner && res.banner.length){
        bannerList = res.banner;
        bannerList.forEach(item => item.bannerUrl = judgeUrl(item.bannerUrl));
      }
      // 封面图上面
      if(res.bannerUp && res.bannerUp.length){
        bannerUpList = res.bannerUp;
        bannerUpList.forEach(item => item.bannerUrl = judgeUrl(item.bannerUrl));
      }
      this.setData({bannerList, bannerUpList})
    })
  },
  getUnionid: function(){
    wx.login({
      success: wxRes =>{
        if (wxRes.code) {
          //发起网络请求
          getMiniOpenid(wxRes.code, brand).then(res => {
            if(res.unionid){
              wx.setStorageSync('unionid', res.unionid);
            }
          })
        }
      }
    })
  },
  onClick: function(e){
    let dataType = e.currentTarget.dataset.type;
    switch (dataType){
      case goTop:
        this.goTopFn();
        break;
      case goIndex:
        app.goBack();
        break;
    }
    // this.openWebView(dataIndex)
  },
  goTopFn: function(){
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  onPageScroll(e){
    let {fixBottom} = this.data;
    fixBottom.show = e.scrollTop > maxScroll;
    this.setData({fixBottom})
  },
  handleGoodsList: function(goodsList){
    let skuPicParam1 = {
      size: URL_CDN.IMGSIZE360640
    };
    let skuPicParam2 = {
      size: URL_CDN.IMGSIZE240400,
      suffix:'p7'
    };
    goodsList.forEach(item => {
      skuPicParam1.sku = skuPicParam2.sku = item.sku;
      skuPicParam1.brand = skuPicParam2.brand = brand;
      item.brandLogo = URL_CDN.LOGO_BLACK_RECT;  // 品牌logo
      item.skuPic1 = `${cdn}${skuToImg(skuPicParam1)}`;
      item.skuPic2 = `${cdn}${skuToImg(skuPicParam2)}`;
    });
    return goodsList;
  },
  getGuideInfo(guideID){
    if(app.isFictitiousGuide(guideID)){
      // 虚拟工号
      this.handleShare(guideID, guideID.substr(-4));
      return
    }
    getGuideInfo(guideID.substr(-6)).then(res=>{
      this.handleShare(guideID, res.storeCode)
    })
  },
  handleShare(shareBy, shareByShop){
    const daogouInfo =  {
      employeeId: shareBy,
      shopCode: shareByShop
    };
    this.setData({daogouInfo});
    app.setShareInfo({
      type,
      share_by: shareBy,
      share_by_shop: shareByShop,
      utmCampaign: zuheID,
      utmTerm: shareBy,
      targetUrl: ''
    });
  },
  // 获取JOSN文件
  getShareJSON: function(fileName){
    getShareJSON(fileName).then(res => {
      let wxSharePageSkuLists = res.wxSharePageSkuLists || [];
      wxSharePageSkuLists.forEach(item=>{
        //兼容性代码(注意提交到后台时一定要用相对地址,如果使用绝对地址时，域名出问题会导致所有图片不能显示)
        //add 20180421
        if(item.skuPic.indexOf('http') === -1){ //该行保留至201808可删
          item.skuPic = `${cdn}${item.skuPic}` //此行保留
        } //该行保留至201808可删
      });
      let goodsList = [].concat(JSON.parse(JSON.stringify(wxSharePageSkuLists)));
      goodsList = this.handleGoodsList(goodsList);
      /*goodsList.forEach(item => {
        item.brandLogo = URL_CDN.LOGO_BLACK_RECT  // 品牌logo
      });*/
      // 亮点元素图片
      let highLightNew = [], highLight=[];
      if(res.wxMoment){
        let wxMoment = JSON.parse(res.wxMoment);
        try {
          for (let item of wxMoment) {
            item.wxPic = judgeUrl(item.wxPic);
            (!item.miniUrl.startsWith('/')) ? item.miniUrl = `/${item.miniUrl}` : '';
          }
          this.setData({wxMoment})
        }catch (e) {}
      }else if(res.pictures){
        res.pictures.includes(',') ? highLight = res.pictures.split(',') : highLight.push(res.pictures);
        if(highLight.length){
          highLight.forEach(item => highLightNew.push(judgeUrl(item)))
        }
      }

      let modelType ;
      if(res.goodsTemplateId){
        modelType = res.goodsTemplateId;
      }
      let shortVideo = {};
      try {
        if(res.shortVideo){
          if(res.shortVideo.includes('{')){
            shortVideo = JSON.parse(res.shortVideo);
            shortVideo.url = judgeUrl(shortVideo.url);
            shortVideo.shortVideoBg = judgeUrl(shortVideo.shortVideoBg);
          }else{
            shortVideo = {
              url: judgeUrl(res.shortVideo),
              shortVideoBg: '',
              height: '',
              width: ''
            }
          }
        }
      }catch (e) {}

      this.setData({
        upImage: judgeUrl(res.coverPic),
        daogouImage: res.portrait,
        List: wxSharePageSkuLists,
        shareJson: res,
        wrapIsShow: true,
        highLight: highLightNew,
        pageTitle: res.nickname+"推荐给您的",
        goodsList: goodsList,
        guideId: res.createByOpenid,
        shortVideo: shortVideo,
        modelType: modelType,
      });
      wx.hideLoading();
      wx.setStorageSync('shareFromMobanID', res.id);    // 存储模板ID
      wx.setStorageSync('shareFromNickName', res.nickname);  //存储导购昵称
      if(res.id){
        let collectedParam = `打开模板_${res.id}_${res.pageTitle}`;
        setTimeout( () => {
          app._collectData2(Object.assign(tempOption, {
            eventName: `打开模板_${res.id}_${res.pageTitle}`,
            eventValue: type === 'shareUser' ? '对话框' : '朋友圈'
          }));
        }, 1000)
      }
      try {
        app.tdSdkEvent('pageclick_guide_share',{})
      }catch (e) { }
      return {
        id: res.id,
        openCount: res.openCount + 1,
        fileName:fileName,
      }
      // wx.getStorageSync('openPageOnoff')? this.shareGoodsList(fileName,'open'):''
    }).then(options => {
      // this.shareGoodsList(fileName,'open')
      this.shareUpdate(options);
    });
  },
  shareGoodsList: function(id,type){
    let shareJSON = this.data.shareJson;
    let options = {
      employeeId: 'ALL',
      region: shareJSON.region,
      page: 1,
      pageSize: 100,
      sortBy: 'create_time.desc'
    };
    getShareGoodsList(options).then(res => {
      res.forEach(item =>{
        let thisCreateID = `${item.createByOpenid}${item.createTime}`;
        if(thisCreateID === id){
          wx.setStorageSync('shareFromMobanID', item.id);
          let count = item.openCount
          let options= {
            id: item.id,
            openCount: count + 1
          };
          this.shareUpdate(options)
        }
      })
    })
  },
  // 更新分享文件
  shareUpdate: function(data){
    shareUpdate(data).then(res =>{}).catch(err=>{
      console.log(err)
    })
  },

  onUnload: function(){
    events.unregister(this,EVENTS.EVENT_LOGINED); //取消订阅登录事件
  },

  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event){
      //用户登录成功
      // this.getDaogouInfo(daogouID);
      // this.getShareList(zuheID);
    }
  },

  //生命周期函数--监听页面显示
  onShow: function (options) {
  },

  //去详情页面
  toContent: function(e){
    let sku = e.currentTarget.dataset.sku;
    wx.setStorageSync('contentID', sku.substring(0,9));
    wx.setStorageSync('contentColorID', sku);
    wx.setStorageSync('IWantBuy', false);
    wx.navigateTo({ url: '/pages/content/content'});
  },

  onShareAppMessage: function () {
    var _dgId = this.data.shareJson.createByOpenid;
    var _upImage = this.data.shareJson.coverPic;
    var _openid = wx.getStorageSync('login_entiry').openid || wx.getStorageSync(KEYSTORAGE.openid) || '';
   var _titleLogo = this.data.daogouImage;
   var _shareTitle = this.data.pageTitle;

    return {
      title: "由您的专属时尚导购—" + _shareTitle,
      path: `/weMall/openDaogouPage/openDaogouPage?zID=${zuheID}&shareOpenid=${_openid}&cID=${daogouID}&utmSource=${this.data.wechatVersion}&utmMedium=guideshare&utmTerm=${daogouID}&utmCampaign=${zuheID}&titleLogo=${_titleLogo}&guideTitle=${_shareTitle}`,
      imageUrl: _upImage,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '推荐成功',
          icon: 'success',
          duration: 500
        });
        this.setData({wxShare: false});
        wx.setStorageSync('shareCar', []);
        this.getShareJSON(zuheID);
      },
      fail: function (res) {}
    };

  }


})
