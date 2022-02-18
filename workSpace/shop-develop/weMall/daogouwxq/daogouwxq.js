var app = getApp();
const {cdn, WE_MALL_CDN, brand} = app.config;

import { URL,KEYSTORAGE, URL_CDN, PAGESTR } from '../../src/const.js';
import { shareGoods, getWxaCodeUnpubAddrQR, getCompoundImg, getCompoundImgNew, getShareDetail, shareUpdate, copyShareUrl, getBrandConfig } from '../../service/guide';
import {objToQuery, skuToImg, splitImg, judgeUrl, getCurrentUrl, chuFa, filterStr} from '../../utils/utils'
import { wxShowToast } from '../../utils/wxMethods'
import {
  getImageInfo,
  saveImageToPhotosAlbum,
  downloadFile,
  checkNetwork,
  openAuthor,
  authorize, checkAuthSetting
} from '../../service/saveImg'
import {EVENTS} from "../../src/const";
import events from "../../src/events";
import { getConfigJSON } from '../../service/init'
let tempOption ='';
var appCodeImg = '';
var isFromMoban = false;
var isType = '';
var zuheID = '';
var thisIndex = -1;
let QRImg ='';
let _campaign = '';
// 需要复制的文案
let copyText = [];
function collected(eName, value, utmObj){
  let collectParam = Object.assign(tempOption, {
    eventName: eName,
    eventValue: value || '',
    utm_source: '',
    utm_term: '',
    utm_medium: '',
    utmCampaign: ''
  });
  if(utmObj){
    Object.assign(collectParam, utmObj)
  }
  app._collectData2(collectParam)
}
let checked = false;
let isFromList = true;
let newTempId = '';
const openPath = 'weMall/openDaogouPage/openDaogouPage';
const tempSource = 'template_zhuanfa';
const wxWorkSource ='enterpise_wechat_'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    mobanJson: {},
    appCodeImg: '',
    List: [],
    upImage: '',
    wxShare: false,
    sharePageTitle:'',
    copy_url: '',
    show_url: '',
    copyIsShow: false,
    footerIsShow: true,
    imgInfo:[],
    titleLogo: splitImg('logo-black-square.png'),
    // 封面图
    coverImg:'',
    // 亮点元素
    highLight: [],
    QRCodeImg: splitImg('QRCode.jpg'),// 公众号二维码
    bannerImg: splitImg('share-banner.jpg'),// banner 图
    toView:'',
    newDate: '',
    _zID:'',
    //  新加
    isCreated: false,
    wxInfo:wx.getStorageSync(KEYSTORAGE.wxInfo),
    guideInfo: wx.getStorageSync(KEYSTORAGE.guideInfo),
    isShare: false,  // 是否分享
    goodsList:[],
    exampleImg:{
      shareUserImg: `${cdn}/assets/common/image/dg/shareUser.jpg`,
      friendCircle: `${cdn}/assets/common/image/dg/friendCircle.jpg`,
    },
    shareUserChecked:false,
    friendChecked:false,
    shareUserTip:false,
    shareFriendCircle: false,
    isOperate: false,
    sharePageUrl:'',
    saveImgTip: `${cdn}/assets/common/image/dg/save_img_tip.jpg`,
    saveImgTipGif: `${cdn}/assets/common/image/dg/saveImg.gif`,
    tipShow: false,
    isShowGif: true,
    bannerList: [],
    weMall: {},
    checkArr: [
      {text: '我已知晓，7天内不再提醒'}
    ],
    footMask: false,
    // 封面图上面banner
    bannerUpList: [],
    shortVideo: '',
    wxMoment: [],
    modelType: '',
    hasZID: false,
    themeSwipe:{
      saveImgTipList: [
        {
          text: '点击保存图片到相册',
          img: splitImg('save_img_tip_1_03.png','common'),
        },
        {
          text: '在相册选择需要发朋友圈的照片',
          img: splitImg('save_img_tip_2_03.png?v=1','common'),
        },
        {
          text: '点击保存图片到相册',
          img: splitImg('save_img_tip_3_03.png','common'),
        },
        {
          text: '点击保存图片到相册',
          img: splitImg('save_img_tip_5_03.png?v=1','common'),
        },
      ],
      saveImgList: [],
      themeImg: '',
      showTipSwipe: false,
    },
  },
  closeTip(){
    this.setData({
      'themeSwipe.showTipSwipe':false,
    })
  },
  changeShow: function(e){
    this.setData({tipShow: false});
  },

  checkLogin(options) {
    wx.removeStorageSync(KEYSTORAGE.curPath);
    if(options.status !== 'login'){
      wx.setStorage({
        key: KEYSTORAGE.curPath,
        data: `/${getCurrentUrl()}&status=login`,
        success(){
          wx.switchTab({
            url: '/pages/weMember/weMember'
          })
        }
      })
    }
  },
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED || type === EVENTS.EVENT_GUIDE) {
      this.pageInit(tempOption);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*wx.showLoading({
      title: '加载中...',
      mask: true
    });*/
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_GUIDE);
    newTempId = '';
    tempOption = options;
    this.checkLogin(options);
    this.pageInit(options);
    this.getShareData();
    /**/
  },
  pageInit: function(options){
    let mobanJson = this.data.mobanJson;
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    QRImg = '';
    if(!guideInfo){
      wx.showModal({
        title: '提示',
        content: '暂时未登录导购微商城，请前往首页登录！',
        success: res => {
        	app.goBack();
        }
      });
      return;
    }
    // options.tempId = '143674';
    // SLTfrom=list&id=599699&isWeMall=weMall
    /*options.from = 'list';
    options.id = '569139';
    options.isWeMall = 'weMall'*/
    if(options.isWeMall){
      isFromList = false
    }
    if(options.tempId){
      mobanJson.id = options.tempId
      this.setData({
        mobanJson: mobanJson
      })
    }
    isType = options.from;
    let _id = options.id;
    _campaign = options.id;
    this.setData({
      newDate: Date.now(),
      guideInfo: guideInfo,
      wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
      isShowGif: app.config.saveImgGif
    });
    if( isType === 'list' ){
      isFromMoban = true;
      this.getShareDetail(_id)
    }else{
      isFromMoban = false;
      let shareArr = wx.getStorageSync('shareCar');
      this.setData({
        _zID: `${this.data.guideInfo.employeeId}${this.data.newDate}`,
        hasZID: true,
      });
      if (shareArr.length>0){
        let shareArrSku = [];
        shareArr.forEach(item =>{
          shareArrSku.push({
            sku: item.gsColorCode,
            price: item.originalPrice,
            discount_price: item.discountPrice,
            discount: chuFa(item.discount, 10),
            description: item.goodsName
          })
        });
        this.setData({
          imgInfo: shareArrSku,
          mask: false,
        });
      }
    }
  },
  // 生成小程序码
  getWxaCodeUnpubAddrQR: function(zID){
    let getWxCodeQROption = {
      scene: zID ? `zID=${zID}`: `zID=${this.data._zID}`,
      page: openPath,
    };
    const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
    if(wxWork){
      getWxCodeQROption.scene += PAGESTR.QY;
    }
    return new Promise( (resolve, reject) => {
      getWxaCodeUnpubAddrQR(getWxCodeQROption).then(res=>{
        QRImg = res;
        this.setData({
          appCodeImg: QRImg
        });
        resolve(QRImg);
      }).catch(err=>{
        reject(new Error(err.msg))
      });
    })

  },
  // 获取分享详情数据
  getShareDetail:function(id){
    let goodsInfo = [],highLight=[];
    wx.showLoading({
      title: '加载中...'
    });
    getShareDetail(id).then(res=>{
      wx.hideLoading();
      if(!res.id){
        wx.showToast({
          title: '模板已删除！',
          icon: 'success',
          duration: 2000
        });
        setTimeout(()=>{
          this.gotoIndex()
        }, 2000);
        return;
      }
      let skuList = res.wxSharePageSkuLists;
      app.gioTrack('pageclick_share_recommend_article_details', {
        content_Id: id,
        title: res.pageTitle || ''
      })
      skuList.forEach(item=>{
        if(item.skuPic.indexOf('http') === -1){ //该行保留至201808可删
              item.skuPic = `${cdn}${item.skuPic}` //此行保留
            } //该行保留至201808可删
        goodsInfo.push({
          sku: item.sku,
          price: item.originalPrice,
          discount_price: item.discountPrice,
          discount: chuFa(item.discount, 10),
          description: item.goodsName
        })
      });

      // skuList.forEach(item => {
      //   //兼容性代码(注意提交到后台时一定要用相对地址,如果使用绝对地址时，域名出问题会导致所有图片不能显示)
      //   //add 20180421
      //   if(item.skuPic.indexOf('http') === -1){ //该行保留至201808可删
      //     item.skuPic = `${cdn}${item.skuPic}` //此行保留
      //   } //该行保留至201808可删
      // });
      let goodsList = [].concat(JSON.parse(JSON.stringify(skuList)));
      goodsList = this.handleGoodsList(goodsList);
      // 亮点元素图片
      let highLightNew = [];
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
      let fileName = res.createBy;
      const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
      // const pageUrl1 = 'https://cdn.bestseller.com.cn/shareQrImage/miniB/ONLY_zID=DA004239461580478239724.png';
      if(!fileName || !fileName.includes('DA')){
        const pageUrl = res.pageUrl;
        if(pageUrl){
          const subStrIndex = pageUrl.indexOf('DA00');
          if(subStrIndex > -1){
            fileName = pageUrl.substr(subStrIndex, 23); // 23 DA + 时间戳
          }
        }else{
          fileName = employeeId + res.createTime;
        }
      }
      this.setData({
        List: skuList,
        mobanJson: res,
        appCodeImg: judgeUrl(res.pageUrl),
        upImage: judgeUrl(res.coverPic),
        shareTitle: res.pageTitle,
        imgInfo: goodsInfo,
        highLight: highLightNew,
        shareCount: res.shareCount,
        // _zID:`${res.createByOpenid}${res.createTime}`,
        _zID: fileName,
        mask:false,
        goodsList: goodsList,
        shortVideo: shortVideo,
        modelType: modelType,
        hasZID: true,
      });
      setTimeout(res=> {
        wx.hideLoading()
      },1000);
      return res.wxMomentGoodsPicTheme;
    }).then( theme => {
      if(theme){
        this.getBrandConfig(theme);
      }
    }).catch(e => {
      wxShowToast(e.message)
      wx.hideLoading();
      console.log('获取数据',e);
    })
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
      item.brand = brand;
    });
    return goodsList;
  },
  // 创建模板
  shareGoods: function(id,pageUrl, shareMomentCount){
    let mobanJson = this.data.mobanJson;
    let options = {
      id: id,
      portrait: this.data.titleLogo,   //导购头像
      platform: 'MINIPROGRAM',       //平台（微信公众号、小程序）
      coverPic: this.data.upImage,   //封面图
      pageUrl: pageUrl,        //appCodeImg
      region: '全国',               //地区
      type: 'guide',                  //类型(是否运营推荐)
      templateId: mobanJson.id,          //模板ID
      pageTitle: mobanJson.pageTitle || `${this.data.wxInfo.nickName}推荐给您的`,       //分享标题
      createByOpenid: this.data.guideInfo.employeeId,       //导购号
      createTime: this.data.newDate,          //创建时间
      createBy: id,
      shareCount: shareMomentCount ? 0: 1,           //分享次数
      shareMomentCount: shareMomentCount ? 1: 0,
      openCount: 0,              //打开次数
      status: 'normal',               //状态
      wxSharePageSkuLists: this.data.List,    //分享的商品列表
      nickname: this.data.wxInfo.nickName,
      wechatVersion: wx.getStorageSync(KEYSTORAGE.isEnterprise) ? 'enterprise_wechat' : 'wechat',   // 是否企业微信
      pictures: this.data.highLight ? this.data.highLight.join(','): '',   // l亮点元素图片字符串
      author: mobanJson.author || '',
      templateMsgSendTime: '',  //发送模板消息时间
      wxMomentGoodsPicTheme: filterStr(mobanJson.wxMomentGoodsPicTheme || 'default'),
      shortVideo: mobanJson.shortVideo || '', // 短视频
      wxMoment: '',// 推荐理由
      shopCode: wx.getStorageSync(KEYSTORAGE.guideInfo).shopCode || '',
      goodsTemplateId: mobanJson.goodsTemplateId,
    };
    if(mobanJson.wxMoment){
      if(mobanJson.wxMoment !== 'null' || mobanJson.wxMoment !== 'undefined'){
        options.wxMoment = mobanJson.wxMoment;
      }
    }
    this.setData({_zID: id})
    options.wxSharePageSkuLists.forEach(item => {
      if(!!item.brandName){
        delete item.brandName
      }
      if(!!item.gscMaincolPath){
        delete item.gscMaincolPath
      }
      if(!!item.gsColorCode){
        item.sku = item.gsColorCode;
        delete item.gsColorCode;
      }
      if(item.id){
        delete item.id;
      }
    });
    return new Promise((resolve, reject) => {
      shareGoods(options).then(res=>{
        console.log('res=>>>>', res);
        newTempId = res.id;
        this.setData({
          appCodeImg: pageUrl,
          isShare: true,
          // mobanJson: res,
        });
        resolve(res);
      }).catch(e=>{
        reject(new Error(e.message))
      })
    })

  },

  // 更新分享文件
  shareUpdate: function(data){
    shareUpdate(data).then(res =>{}).catch(err=>{
      console.log(err)
    })
  },
  // 品牌配置文件
  getBrandConfig: function(theme){
    getConfigJSON().then(res => {
      // 判断运营
      let operateArr = res.operateDA;
      let {sharePageUrl, themeSwipe} = this.data;
      res.sharePage ? this.setData({sharePageUrl: res.sharePage}) : '';
      for(let operateItem of operateArr){
        let curGuideID = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId;
        if(operateItem.daName === curGuideID){
          this.setData({isOperate: true});
          break;
        }
      }
      // 复制文案
      if(res.copyText && res.copyText.length){
        res.copyText.forEach(item => copyText.push(item.text));
      }
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
      // 弹窗
      let weMall = this.data.weMall;
      if(isFromList){
        let localWeMallTime = wx.getStorageSync('tempWeMallTime');
        let curDate = Date.now();
        if(localWeMallTime && (curDate - localWeMallTime) < 7 * 24 * 60 * 60 * 1000){
          weMall.isShow = false;
        }else{
          if(res.weMall){
            weMall = res.weMall;
            weMall.goodsImg = judgeUrl(weMall.weMallImg);
          }
        }
      }
      //九宫格
      if(theme){
        let themeImg = '';
        res.theme.forEach(item => {
          if(item.value === theme){
            themeImg = item.wxMoment
          }
        })
        themeSwipe.themeImg = themeImg || res.theme[0].wxMoment
      }
      this.setData({bannerList, bannerUpList, weMall, themeSwipe})
    })
  },
  // 7天选中
  checkboxChange: function(e){
    if(e.detail.value.length) {
      checked = true;
      wx.setStorageSync('tempWeMallTime', Date.now())
    }else{
      checked = false;
      wx.removeStorageSync('tempWeMallTime')
    }
  },
  weMallClick: function(){
    let weMall = this.data.weMall;
    app.navigateTo(weMall.linkUrl)
    // app.jumpUrl();
    this.closeWeMall();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('shareCar')
  },
  getShareData: function(){
    var _thisPageTitle = wx.getStorageSync('userInfo').nickName;
    var _titleLogo = wx.getStorageSync('userInfo').avatarUrl;
    this.setData({
      sharePageTitle: _thisPageTitle+'推荐给您的' ,
      titleLogo: _titleLogo,
      friendChecked: wx.getStorageSync('friendChecked'),
      shareUserChecked: wx.getStorageSync('shareUserChecked')
    });
    if( !isFromMoban ){
      appCodeImg = wx.getStorageSync('appCodeImg');
      var list = wx.getStorageSync('shareCar');
      var _upImage = wx.getStorageSync('coverImg');
      if(list.length > 0){
        list.forEach(item => {
          item.skuPic = `${cdn}${item.gscMaincolPath}`;
          item.sku = item.gsColorCode
        });
        let goodsList = [].concat(JSON.parse(JSON.stringify(list)));
        goodsList = this.handleGoodsList(goodsList);
        this.setData({
          List: list,
          upImage: _upImage,
          highLight: wx.getStorageSync('highLight')|| '',
          goodsList: goodsList,
          appCodeImg: appCodeImg,
          mask: false
        });
      }

      wx.hideLoading();
    }
  },
  // 返回首页
  gotoIndex: function(){
    app.gioTrack('pageclick_share_rec_back')
    app.goBack();
  },
  //保存图片
  saveShareImg: function(){
    let mobanJson = this.data.mobanJson;
    mobanJson.pageTitle = mobanJson.pageTitle ? mobanJson.pageTitle : `${this.data.wxInfo.nickName}推荐给您的`;
    mobanJson.templateId = mobanJson.templateId ?  "_" + mobanJson.templateId : "";
    let shareUpdateOption = {
      id: newTempId || this.data.mobanJson.id ,
      shareMomentCount: 1,
      // fileName: this.data._zID
    };
    const {employeeId} = this.data.guideInfo;
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    if(isType === 'list' && !this.data.isShare && this.data.mobanJson.createByOpenid !== employeeId ){
      this.setData({zID: `${employeeId}${this.data.newDate}`});
      console.log('需要创建模板zID=>>>>>>>', this.data.zID);
      let id = employeeId + this.data.newDate;
      shareUpdateOption.fileName = id;
      this.getWxaCodeUnpubAddrQR(this.data.zID).then(res => {
        // 创建JOSN数据
        let pageUrl = QRImg || this.data.appCodeImg;
        this.shareGoods(id,pageUrl, true).then(res=>{
          let tempId = mobanJson.id || _campaign || '';
          let collectedParam = `分享到朋友圈_${tempId}_${mobanJson.pageTitle}_${this.data.newDate}`;
          collected(collectedParam, '朋友圈', {
            utm_source: isWXWork ? wxWorkSource + tempSource :'tempSource',
            utm_campaign: tempId,
            utm_term: employeeId,
          });
          this.isAuthor(QRImg);
        })
      })
    }else{
      console.log('>>>>>>>不需要创建模板<<<<<<<<<<');
      if(QRImg){
        this.isAuthor(QRImg);
      }else{
        this.getWxaCodeUnpubAddrQR(mobanJson.createBy).then(res => {
          this.isAuthor(QRImg);
        })
      }
    }
    let tempId = mobanJson.id || _campaign || '';
    let collectedParam = `分享到朋友圈_${tempId}_${mobanJson.pageTitle}_${this.data.newDate}`;
    collected(collectedParam, '朋友圈', {
      utm_source: isWXWork ? wxWorkSource + tempSource : tempSource,
      utm_campaign: tempId,
      utm_term: employeeId,
    });
    this.shareUpdate(shareUpdateOption);
    try {
      app.tdsdk.share({
        title: mobanJson.pageTitle || '',
        path: tempId || ''
      });
      app.tdSdkEvent('pageclick_share_tofriend', {
        GUIDE_DAID: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId,
        TEMPLATE_ID: mobanJson.pageTitle || ''
      });
      app.gioTrack('pageclick_share_rec_share_moment', {
        content_Id: tempId || this.data.zID,
        title: mobanJson.pageTitle
      })
    }catch (e) { }
  },
  //检查授权
  isAuthor: function(codeImg){
    wx.hideLoading();
    const type = 'scope.writePhotosAlbum';
    // 检查授权
    checkAuthSetting(type).then(isAuthor => {
      return isAuthor
    }).then(isAuthor => {
      if(!isAuthor){
        // 打开弹窗授权
        authorize(type).then(status => {
          return status
        }).then(res => {
          if(res){
            // 点击允许
            this.saveImg(codeImg);
          }else{
            // 拒绝 打开授权
            openAuthor(type, '需要授权相册权限才能保存').then(res => {
              if(res){
                this.saveImg(codeImg)
              }
            });
          }
        })
      }else{
        // 已经授权
        this.saveImg(codeImg);
      }
    }).catch(err => console.log(err))
  },
  saveImg: function(codeImg){
    wx.showLoading({title: '正在保存图片', mask: true});
    const skuArr = this.data.imgInfo;
    if(!skuArr.length){
      wxShowToast('商品SKU为空');
      return;
    }
    this.setData({footMask: true});
    const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
    const {nickName, avatarUrl} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const {employeeId, shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const goodsPicQr = '_goods_pic_qr';
    let saveImgOption = {
      brand: app.config.brand,
      skuArr,
      utmSource: wxWork ? `wxwork${goodsPicQr}` : `wx${goodsPicQr}`,
      utmMedium: "guideshare",
      utmCampaign:this.data.mobanJson.id,
      utmTerm:employeeId,
      share_by: employeeId,
      share_by_shop: shopCode,
      nickname: nickName,
      face_image: avatarUrl,
      coverimg_url: this.data.upImage,
      qrcode_url: codeImg ||this.data.appCodeImg,
      wxMomentGoodsPicTheme: filterStr(this.data.mobanJson.wxMomentGoodsPicTheme || 'default'),
	    userType: this.data.isOperate ? 1 : 0, // （0，导购；1，运营）
    };
    let newImgArr = [];
    getCompoundImgNew(saveImgOption).then(res=>{
      res.forEach(item=>{
        newImgArr.push(`${app.config.cdn}/${item}`)
      });
      this.setData({
        'themeSwipe.saveImgList': newImgArr,
      })
      return newImgArr
    }).then(res=>{
      let codeImgArr = [...res];
      return this.saveImgsToLocal(codeImgArr);
    }).catch(error=>{
      wx.hideLoading();
      this.setData({footMask: false})
      wx.showModal({
        title: error.message,
        showCancel: false
      });
    })
  },
  // 保存图片到本地相册
  /*
  *
  * @param: 图片路径
  * @param: 索引
  * @param: 是否是二维码图片
  * */
  saveOneImgToLocal: async function(imgUrl) {
     // 查询图片信息
     let oneImgInfo = await new Promise((reslove, reject) => {
        wx.getImageInfo({
          src: imgUrl,
          success (res) {
            reslove(res)
          },
          fail (err) {
            reslove({
              code: 1,
              msg: 'fail'
            })
          }
        })
    })
    // 保存图片
    let saveResult = '';
    if (oneImgInfo && oneImgInfo.path) {
      saveResult = await new Promise((reslove, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath: oneImgInfo.path,
          success (res) {
            reslove({
              code: 0,
              msg: 'success'
            })
          },
          fail (err) {
            reslove({
              code: 1,
              msg: 'fail'
            })
          }
        })
      })
    } else {
      saveResult = {
        code: 1,
        msg: '图片不存在'
      };
    }
    return saveResult;
  },
  saveImgsToLocal: async function (imgArr) {
    if (imgArr.length >= 1) {
      // 去保存图片
      let photo = await this.saveOneImgToLocal(imgArr[0]);
      // 无论是否成功都去保存下一张图片
      imgArr.shift();
      this.saveImgsToLocal(imgArr);
    } else {
      // 没有图片了
      wx.hideLoading();
      this.setData({
        // tipShow: true, 显示GIF图
        'themeSwipe.showTipSwipe': true, // 显示帧动画
        wxShare: false,
        footMask: false,
      });
      // 去复制
      let code = this.data.mobanJson.createBy;
      this.copyUrl(code);
    }
  },
  //生成链接并复制
  copyUrl: function(code){
    let optionsUrl = this.data.sharePageUrl || `${app.config.domain_h5}/mvc/guide_share.html`;
    const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
    const momentWeb = '_moment_web';
    let queryStringH5 = {
      fileName: code || this.data._zID,
      utmSource: wxWork ? `wxwork${momentWeb}`: `wx${momentWeb}`,
      utmMedium: 'guideshare',
      utmTerm: this.data.guideInfo.employeeId,
      utmCampaign: this.data.mobanJson.id,
      share_by: this.data.guideInfo.employeeId,
      share_by_shop: this.data.guideInfo.shopCode,
	    devFlag: app.urlDevFlag(),
    };
    let _shareTitle = this.data.mobanJson.pageTitle || this.data.sharePageTitle;
    let aUrl = `${copyText[0]}${_shareTitle}${copyText[1]}\n`;
    if(this.data.guideInfo.employeeId !== this.data.mobanJson.createByOpenid){
      queryStringH5.fileName = this.data.guideInfo.employeeId + this.data.newDate;
      console.log('queryStringH5====>>>>>>>>> if', queryStringH5)
    }
    if (isType === 'list') {
      optionsUrl = `${optionsUrl}${objToQuery(queryStringH5)}`;
    }else{
      let thisZuheID = wx.getStorageSync('zuheID');
      queryStringH5.fileName =  thisZuheID;
      // queryStringH5.utmCampaign =  thisZuheID;
      optionsUrl = `${optionsUrl}${objToQuery(queryStringH5)}`;
    }
    // 复制URL
    let shareURLOption = {
      shareUrl: optionsUrl,
      brand: app.config.brand
    };
    try {
      this.tdSdkEventAgain('pageclick_share_copylink', {path: optionsUrl});
    }catch (e) {

    }
    copyShareUrl(shareURLOption).then(res=>{
      aUrl = `${aUrl}${res.url}`;
      this.setData({
        copy_url: aUrl,
        show_url: aUrl,
      });
      wx.setClipboardData({
        data: aUrl,
        success:res=>{}
      })
    })
  },

  removeCopyBox: function(){
    this.setData({
      copyIsShow: false
    });
  },
  // 去无师自通
  toGuideLearn: function(){
    this.close();
    wx.navigateTo({
      url:`/weMall/daogouVideo/daogouVideo?desc=shareOption`
    })
  },
  // 关闭
  close: function(){
    let curShow = this.data.shareUserTip;
    curShow ? this.setData({shareUserTip: false}) : this.setData({friendCircle: false})
  },
  // 关闭微商城弹窗
  closeWeMall: function(){
    let weMall = this.data.weMall;
    weMall.isShow = false;
    this.setData({weMall})
  },
  // 不在提示此消息
  changeUserCheck: function(){
    let checked = '';
    if(this.data.shareUserTip){
      checked = this.data.shareUserChecked;
      this.setData({shareUserChecked: !checked});
      wx.setStorageSync('shareUserChecked', !checked);
    }else{
      checked = this.data.friendChecked;
      this.setData({friendChecked: !checked});
      wx.setStorageSync('friendChecked', !checked);
    }
  },
  confirm: function(){
    this.setData({shareUserTip: false,});
    this.onShareAppMessage()
  },
  //分享到朋友圈
  shareUser: function(){

    this.setData({shareUserTip: true})
  },
  // 确认保存图片
  confirmSaveImg: function(){
    this.setData({friendCircle: false,});
    this.saveShareImg();
  },
  showShareFC: function(){

    this.setData({friendCircle: true,});
  },
  //转发给朋友
  onShareAppMessage: function (res) {
    this.setData({
      shareUserTip: false
    });
    let mobanJson = this.data.mobanJson;
    mobanJson.pageTitle = mobanJson.pageTitle ? mobanJson.pageTitle : `${this.data.wxInfo.nickName}推荐给您的`;
    mobanJson.templateId = mobanJson.templateId ?  "_" + mobanJson.templateId : "";
    let tempId = mobanJson.id || mobanJson.templateId || '';
    const wxWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    let wechatVersion =  wxWork ? 'enterprise_wechat' : 'wechat';  // 是否企业微信
    let _titlelogo = wx.getStorageSync('userInfo').avatarUrl;
    const fileName = this.data._zID;
    let shareUpdateOption = {
      id: newTempId || mobanJson.id ,
      shareCount: mobanJson.shareCount+1 || 1,
      // fileName
    };
    const {employeeId, shopCode} = this.data.guideInfo;
    let queryString = {
      zID: fileName,
      cID: employeeId,
      utmSource: wxWork ?  `${wechatVersion}_${tempSource}` : tempSource,
      utmMedium:'guideshare',
      utmTerm: employeeId,
      utmCampaign: mobanJson.id,
      wechatVersion: wechatVersion,
      titleLogo:_titlelogo,
      guideTitle: mobanJson.pageTitle || wx.getStorageSync('userInfo').nickName+'推荐给您的',
	    devFlag: app.urlDevFlag(),
	    shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || '',
      shareByShop:shopCode
    };
    const newQueryString = JSON.parse(JSON.stringify(queryString));
    let collectedParam = `分享给顾客_${tempId}_${mobanJson.pageTitle}_${this.data.newDate}_${mobanJson.templateId}`;
    collected(collectedParam, '对话框', newQueryString);
    // 由您的专属导购雷推荐-夏日潮装换新
    let title = `由您的专属导购${wx.getStorageSync('userInfo').nickName}推荐`;
    if(mobanJson.pageTitle){
      title = mobanJson.pageTitle
    }
    let path = `/${openPath}`;
    let imageUrl = '';
    let id = this.data.guideInfo.employeeId + this.data.newDate;
    if((mobanJson.type ==='operation' ||  mobanJson.type ==='retail') && !this.data.isShare && this.data.guideInfo.employeeId !== this.data.mobanJson.createByOpenid){
      this.setData({zID: id})
      queryString.zID = id;
      queryString.cID = this.data.guideInfo.employeeId;
      this.getWxaCodeUnpubAddrQR(id).then(res => {
        console.log('queryString=>>>>>>>>>>>>>>>>>>>>>>>', queryString);
        shareUpdateOption.fileName = id;
        if(isType === 'list'){
          let pageUrl = QRImg || this.data.appCodeImg;
          this.shareGoods(id, pageUrl).then(res=>{
            let collectedParam = `分享给顾客_${tempId}_${mobanJson.pageTitle}_${this.data.newDate}_${mobanJson.templateId}`;
            collected(collectedParam, '对话框', newQueryString);
            this.shareUpdate(shareUpdateOption);
            queryString.utmCampaign = this.data.mobanJson.id
            this.copyUrl(id)
          });
        }
      })
      console.log('分享需要创建=>>>>>>>>>', queryString);
      console.log(this.data.appCodeImg);
    }else{
      this.shareUpdate(shareUpdateOption);
      this.copyUrl(this.data._zID);
      console.log('分享不需要创建=>>>>>>>>>', queryString)
    }



    if(isType === 'list'){
      //模版页跳转过来的
      // title = `${title}${queryString.guideTitle}`;
      path = `${path}${objToQuery(queryString)}`;
      imageUrl = this.data.mobanJson.coverPic;
      console.log('if path=>>>>>>', path)
    }else{
      let shareTitle = wx.getStorageSync('shareTitle');
      queryString = {
        zID: wx.getStorageSync('zuheID'),
        cID: this.data.guideInfo.employeeId,
        utmSource: wxWork ?  wechatVersion : tempSource,
        utmMedium: 'guideshare',
        utmTerm: this.data.guideInfo.employeeId,
        utmCampaign: this.data.mobanJson.id,
        wechatVersion: wechatVersion,
        titleLogo:_titlelogo,
        guideTitle: shareTitle
      };
      path = `${path}${objToQuery(queryString)}`;
      // title = `${title}${shareTitle}`;
      title = shareTitle || title;
      imageUrl = wx.getStorageSync('coverImg');
      console.log('else path=>>>>>>', path)
    }
    console.log('path=>>', path);
    try {
      app.tdShare(title, path);
      this.tdSdkEventAgain('pageclick_share_tocustmor', {title,path});
      this.tdSdkEventAgain('pageclick_guide_share_all', {title,path});
      app.gioTrack('wemall_shopperbindShare', {
        STAFF_NO: employeeId,
        count_Type: '推荐模板',
        share_ID: this.data.zID,
        share_Name: title,
      })
    }catch (e) { }
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: res=>{
        // 转发成功
        wx.showToast({
          title: '推荐成功',
          icon: 'success',
          duration: 500
        });
        console.log('分享路径===>>>>>', path);
        // wx.navigateTo({url: path});
        // this.copyUrl();   // 复制文案
        this.setData({wxShare: false});
        try{app.tdsdk.share({
          title: title,
          path: path,
          shareTickets: res.shareTickets
        });
        }catch (e) {}
      },
      fail: err=>{
        console.log('转发失败！')
      }
    };
  },
  // 再次封装
  tdSdkEventAgain: function (tdEventName, param) {
    let tdParam = {
      GUIDE_DAID: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId,
      TEMPLATE_ID: this.data.mobanJson.id
    };
    Object.assign(tdParam, param);
    app.tdSdkEvent(tdEventName, tdParam);
  }

})
