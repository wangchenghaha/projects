import {getGuideQR, fictitiousGuideQR} from '../../service/guide.js'
import {splitImg} from '../../utils/utils'
import {wxCopyText, wxShowToast} from '../../utils/wxMethods'
import {URL_CDN, KEYSTORAGE} from '../../src/const'

const app = getApp();
const {cdn, brand, WE_MALL_CDN} = app.config
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo: {},
    qrCode: '',
    qr_background: splitImg('guider_qrcode_bg.jpg'),
    qr_discount: URL_CDN.GUIDE_QRCODE_DISCOUNT,
    qr_gift: URL_CDN.GUIDE_QRCODE_GIFT,
    qr_superise: URL_CDN.GUIDE_QRCODE_SUPERISE,
    marks: [{
      image: splitImg('guide_icon_discount.png', 'common'),
      text: '专属折扣'
    },
      {
        image: splitImg('guide_icon_suprise.png', 'common'),
        text: '精美好礼'
      },
      {
        image: splitImg('guide_icon_gift.png', 'common'),
        text: '惊喜礼品'
      }],

    reLoading: false,
    errMsg: '',
    brandLogo: splitImg('logo-black-rect.png'),
    titleWidth: brand === 'FOL' ? '75%' : '100%',
    titleMt: brand === 'FOL' ? '340' : '5',
    guideInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.getQRImage();
  },

  //获取微信用户信息
  getUserInfo: function () {
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    this.setData({
      guideInfo,
      wxInfo,
    });
  },

  close: function () {
    wx.navigateBack({
      delta: -1
    });
  },

  reLoading: function (e) {
    const {employeeId} = this.data.guideInfo;
    if(app.isFictitiousGuide(employeeId)){
      this.getFictitiousGuideQR();
      return
    }
    wx.showLoading();
    getGuideQR(employeeId).then((url) => {
      this.handleGuideQR(url);
    }).catch(e => {
      this.setData({
        reLoading: true,
        errMsg: e.message
      });
      wx.hideLoading();
    });
  },
  handleGuideQR(url){
    wx.hideLoading();
    const {guideInfo} = this.data;
    url = url.replace('.png', '.jpg') + `?v=${Date.now()}`;
    guideInfo.guideQR = WE_MALL_CDN + url;
    this.setData({guideInfo, reLoading: false,});
    wx.setStorageSync(KEYSTORAGE.guideInfo, guideInfo);
  },
  getFictitiousGuideQR() {
    let {employeeId,shopCode, MOBILE_PHONE, STAFF_NAME, EMAIL = '', STAFF_ENAME = '', POSITION = ''} = this.data.guideInfo;
    const param = {
      email: EMAIL,
      phone: MOBILE_PHONE,
      positionCode: shopCode,
      positionName: POSITION,
      staffCnName: STAFF_NAME,
      staffEnName: STAFF_ENAME,
      staffId: employeeId,
    };
    wx.showLoading({title: '加载中'});
    fictitiousGuideQR(employeeId.substr(-6), param).then(res => {
      if(res && res.url){
        this.handleGuideQR(res.url);
      }
    }).catch(err => wxShowToast(err.message))
  },

  getQRImage: function () {
    const {guideInfo} = this.data;
    // if (guideInfo.guideQR) {
    //   return;
    // }
    this.reLoading();
  },
  copyOpenId() {
    const openId = app.getOpenId();
    wxCopyText(openId)
  },

  previewImage: function (e) {
    wx.previewImage({
      urls: this.data.qrCode.split(',')
    })
  }
})