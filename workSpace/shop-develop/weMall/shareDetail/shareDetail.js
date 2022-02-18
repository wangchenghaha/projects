import { URL,KEYSTORAGE, URL_CDN, PAGESTR } from '../../src/const.js';
import { shareGoods, getWxaCodeUnpubAddrQR, getCompoundImg, getShareDetail, shareUpdate, copyShareUrl, getBrandConfig } from '../../service/guide';
import {objToQuery, skuToImg, splitImg, judgeUrl, getCurrentUrl, chuFa, filterStr} from '../../utils/utils'
import { wxShowToast, wxCopyText } from '../../utils/wxMethods'
import {getImageInfo, saveImageToPhotosAlbum, downloadFile, checkNetwork, openAuthor, authorize, checkAuthSetting} from '../../service/saveImg'
import {EVENTS} from "../../src/const";
import events from "../../src/events";
import {fileIsExist, getConfigJSON} from '../../service/init'
const app = getApp();
const {cdn, brand, channel} = app.config;
const shareUser = 'shareCount', shareMoment = 'shareMomentCount';
let userType = 'guide';
let sharePath = 'weMall/openShareDetail/openShareDetail';
const tempSource = 'template_zhuanfa';
let timeStamp = '';
let copyTextArr = [];
let sharePathH5 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareDetail: {},
    exampleImg:{
      shareUserImg: `${cdn}/assets/common/image/dg/shareUser.jpg`,
      friendCircle: `${cdn}/assets/common/image/dg/friendCircle.jpg`,
    },
    shareUserTip:false,
    friendCircle: false,
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
    newId: '',
    newQRImg: '',
    banner: [],
    bannerUp:[],
  },
  async getBrandConfig(){
    const {employeeId } = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let {configJson = {}} = app.globalData;
    if(Object.keys(configJson).length === 0){
      configJson = await getConfigJSON();
      app.globalData.configJson = configJson
    }
    // 判断运营
    let {operateDA = [], banner = [], bannerUp = [], copyText=[], sharePage = ''} = configJson;
    if(operateDA.length && operateDA.includes(employeeId)){
      userType = 'operation'
    }
    // 封面图下面
    if(banner.length){
      banner.forEach(item => item.bannerUrl = judgeUrl(item.bannerUrl));
    }
    // 封面图上面
    if(bannerUp.length){
      bannerUp.forEach(item => item.bannerUrl = judgeUrl(item.bannerUrl));
    }
    // 复制文案
    if(copyText.length){
      copyText.forEach(item => copyTextArr.push(item.text) );
    }
    // H5分享链接
    sharePathH5 = sharePage;
    this.setData({banner, bannerUp})
  },
  async shareUser(){
    const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {newId, shareDetail} = this.data;
    const {createByOpenid} = shareDetail;
    if(employeeId !== createByOpenid && !newId){
      console.log('需要创建*****');
      let newShareDetail = await this.creatShare(shareUser);
    }

    this.setData({
      shareUserTip: true
    })
  },
  shareUpdate(shareType, id){
    const {shareDetail} = this.data;
    shareUpdate({
      id,
      [shareType]: shareDetail[shareType] + 1,
    }).then(res => {}).catch(err => console.log(err.message));
  },
  // 生成二维码
  async creatQRImg(id){
    let {newId, newQRImg} = this.data;
    const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const scene = `zID=${employeeId}${timeStamp}`;
    const param = {
      scene,
      page: sharePath,
    };
    const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
    if(wxWork){
      param.scene += PAGESTR.QY;
    }
    return new Promise((resolve, reject) => {
      if(newQRImg){
        resolve(newQRImg)
      }else{
        getWxaCodeUnpubAddrQR(param).then(res => {
          // res.data = /newminiB/SELECTED_zID=493839575320363009.png
          newQRImg = res;
          this.setData({newQRImg});
          resolve(newQRImg)
        }).catch(err => wxShowToast(err.message));
      }
    })
  },
  async creatShare(shareType){
    let pageUrl = await this.creatQRImg();
    const {nickName= '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const {employeeId, shopCode = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const shareDetail = this.data.shareDetail;
    const param = JSON.parse(JSON.stringify(shareDetail));
    Object.assign(param, {
      portrait: avatarUrl,
      platform: channel,
      pageUrl, // 二维码
      templateId: param.id,
      createTime: timeStamp,
      createBy: `${employeeId}${timeStamp}`,
      createByOpenid: employeeId,
      employeeId,
      shopCode,
      id: `${employeeId}${timeStamp}`, // 生成JSON文件名
      nickname: nickName,
      templateMsgSendTime: '',
      wechatVersion: wx.getStorageSync(KEYSTORAGE.isEnterprise) ? 'enterprise_wechat' : 'wechat',   // 是否企业微信
      type: userType, //是否运营
      shareMomentCount: shareType === shareMoment ? 1 : 0,
      shareCount: shareType === shareUser ? 1 : 0,
    });
    return new Promise((resolve, reject) => {
      shareGoods(param).then(res => {
        if(res){
          this.setData({newId: res.id});
          resolve(res);
        }
      }).catch(err => wxShowToast(err.message));
    })
  },
  closeTip(){
    this.setData({
      friendCircle: false,
      shareUserTip: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id = '', createBy = ''} = options;
    this.getBrandConfig();
    this.getShareDetail(id || createBy);
    timeStamp = Date.now()
  },
  // 分享朋友圈
  shareMomentTip(){
    this.setData({friendCircle: true,})
  },
  // 获取图片
  async confirmSaveImg(){
    console.log('保存图片');
    const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {newId, shareDetail} = this.data;
    wx.showLoading({
      title: '保存图片...',
      mask: true
    });
    try {
      if(shareDetail.createByOpenid !== employeeId && !newId){
        let newShareDetail = await this.creatShare(shareUser);
      }
      let generatedQRAllImg = await this.generateQRImg();
      this.saveImgToLocal(generatedQRAllImg);
    }catch (e) {
      wxShowToast(e.message)
    }
  },
  // 合成图片
  async generateQRImg(){
    const {shareDetail, newQRImg, newId} = this.data;
    const {id, coverPic, pageUrl, wxMomentGoodsPicTheme,createByOpenid = '', wxSharePageSkuLists = [], pageTitle = '', templateId = ''} = shareDetail;
    const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
    const {nickName, avatarUrl} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const {employeeId, shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const goodsPicQr = '_goods_pic_qr';
    let skuArr = [];
    if(wxSharePageSkuLists.length){
      wxSharePageSkuLists.forEach(({sku, originalPrice, discountPrice, discount, goodsName}) => {
        skuArr.push({
          sku,
          price: originalPrice,
          discount_price: discountPrice,
          discount: chuFa(discount, 10),
          description: goodsName
        })
      });
    }
    const utmParam = {
      utmSource: wxWork ? `wxwork${goodsPicQr}` : `wx${goodsPicQr}`,
      utmMedium: "guideshare",
      utmCampaign: trueId,
      utmTerm:employeeId,
    };
    const trueId = newId || id;
    app._collectData2(Object.assign({
      eventName: `分享到朋友圈${id}_${pageTitle}_${timeStamp}_${templateId}`,
      eventValue: '朋友圈',
    }, utmParam));
    this.shareUpdate(shareMoment, trueId);
    // 当自己的模板判断是否已经有二维码 判断文件是否存在
    /*
    let qrCodeUrl = `${cdn}/newminiB/${brand}_zID=${trueId}.png`;
    let isExist = await fileIsExist(qrCodeUrl);
    if(!isExist){
      console.log('文件不存在');
      qrCodeUrl =  await this.creatQRImg(trueId)
    }*/
    wx.showLoading({
      title: '合成图片',
      mask: true
    });
    const param = {
      brand,
      skuArr,
      share_by: employeeId,
      share_by_shop: shopCode,
      nickname: nickName,
      face_image: avatarUrl,
      coverimg_url: coverPic,
      qrcode_url: newQRImg || pageUrl,
      wxMomentGoodsPicTheme: filterStr(wxMomentGoodsPicTheme || 'default'),
      userType: userType === 'guide' ? 1 : 0, // （0，导购；1，运营）
    };
    Object.assign(param, utmParam);
    return new Promise((resolve, reject) => {
      getCompoundImg(param).then(res => {
        if(Array.isArray(res) && res.length){
          const newImgArr = [];
          res.forEach(item => newImgArr.push(`${cdn}/${item}`));
          resolve(newImgArr)
        }else{
          reject(new Error(res.msg))
        }
      }).catch(err => reject(new Error(err.message)))
    });

  },
  // 保存图片到本地
  async saveImgToLocal(imgArr){
    if(imgArr.length){
      let savedImg = await this.saveOneImgToLocal(imgArr[0]);
      // 无论是否成功都去保存下一张图片
      imgArr.shift();
      this.saveImgToLocal(imgArr);
    }else{
      wx.hideLoading();
      this.closeTip();
      //   复制文案
      this.copyUrl();
    }
  },
  // 保存单张图
  async saveOneImgToLocal(imgUrl) {
    // 查询图片信息
    let oneImgInfo = await getImageInfo(imgUrl);
    let saveResult = '';
    if (oneImgInfo) {
      saveResult = await saveImageToPhotosAlbum(oneImgInfo)
    } else {
      saveResult = {
        code: 1,
        msg: '图片不存在'
      };
    }
    return saveResult;
  },
  // 创建模板
  getShareDetail(id){
    getShareDetail(id).then(res => {
      if(res){
        let {goodsInfo} = this.data;
        const {wxSharePageSkuLists} = res;
        //  商品信息
        // goodsInfo = JSON.parse(JSON.stringify(wxSharePageSkuLists));
        this.setData({
          shareDetail: res,
        });
        wx.setNavigationBarTitle({title: res.pageTitle || ''})
        // this.shareUser();
      }
    }).catch(err => wxShowToast(err.message))
  },
  //生成链接并复制
  copyUrl(code){
    const {newId, shareDetail} = this.data;
    const {id, pageTitle} = shareDetail;
    const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
    const {employeeId, shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const momentWeb = '_moment_web';
    const trueId = newId || id;
    let queryStringH5 = {
      fileName: trueId,
      utmSource: wxWork ? `wxwork${momentWeb}`: `wx${momentWeb}`,
      utmMedium: 'guideshare',
      utmTerm: employeeId,
      utmCampaign: trueId,
      share_by: employeeId,
      share_by_shop: shopCode,
      devFlag: app.urlDevFlag(),
    };
    let allCopyText = copyTextArr.length ? `${copyTextArr[0]}${pageTitle}${copyTextArr[1] || ''}` : pageTitle;
    allCopyText += '\n';
    sharePathH5 += objToQuery(queryStringH5);
    // 复制URL
    let shareURLOption = {
      shareUrl: sharePathH5,
      brand: app.config.brand
    };
    copyShareUrl(shareURLOption).then(res=>{
      if(res && res.url){
        wxCopyText(allCopyText + res.url);
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.closeTip();
    const {shareDetail, newId} = this.data;
    const {id, pageTitle, coverPic, templateId=''} = shareDetail;
    const {employeeId, shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {avatarUrl} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const wxWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    let wechatVersion =  wxWork ? 'enterprise_wechat' : 'wechat';
    const shareParam = {
      id: newId || id,
      eId: employeeId,
      utmSource: wxWork ?  `${wechatVersion}_${tempSource}` : tempSource,
      utmMedium:'guideshare',
      utmTerm: employeeId,
      utmCampaign: id,
      wechatVersion: wechatVersion,
      titleLogo:avatarUrl,
      guideTitle: pageTitle,
      devFlag: app.urlDevFlag(),
      shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || '',
      shareByShop:shopCode,
    };
    app._collectData2(Object.assign({
      eventName: `分享给顾客_${id}_${pageTitle}_${timeStamp}_${templateId}`,
      eventValue: '对话框',
    }, shareParam));
    this.shareUpdate(shareUser, newId || id);
    this.copyUrl();
    const path = sharePath + objToQuery(shareParam);
    console.log(path,'***');
    return {
      title: pageTitle,
      path,
      imageUrl: coverPic
    }
  }
})
