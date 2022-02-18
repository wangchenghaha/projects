import { splitImg, objToQuery, getCurrentUrl, judgeUrl } from '../../utils/utils'
import { wxShowToast } from '../../utils/wxMethods'
import { couponImg } from '../../service/guide'
import { awardActivity } from '../../service/order'
import {authorize, checkAuthSetting, getImageInfo, openAuthor, saveImageToPhotosAlbum} from '../../service/saveImg'
import { getSendCoupon } from '../../service/wsc'
const wxBarCode   = require('../../utils/wxbarcode');
const app = getApp();
const BRAND = app.config.brand;
const cdn = app.config.cdn;
const shareUser = 'shareUser', downLoad = 'downLoad';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: splitImg('send_coupon_banner.jpg'),
    couponList:  [],
    couponInfo:{},
    couponRule: '',
    // 二维码icon
    qrCodeIcon: splitImg('qrCode-icon.png', 'common'),
    cardBg: splitImg('card_bg.png', 'common'),
    sendCouponImg: splitImg('send_coupon.jpg'),
    logoImg: splitImg('logo-black-rect.png'),
    showCard: false,
    shareMethod: [
      {
        icon: splitImg('share_user_icon.png', 'common'),
        text: '分享给顾客',
        bgColor: '#ea231c',
        type: shareUser
      },
      {
        icon: splitImg('download_icon.png', 'common'),
        text: '保存到相册',
        bgColor: '#000000',
        type: downLoad
      }
    ],
    writePhotosAlbum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupon();
    this.getAwardActivity();
  },
  getAwardActivity: function(){
    let param ={
      orderType: 0,
      pageType:1,
      pageAddress: getCurrentUrl()
    };
    awardActivity(param).then(res => {
      if(res.length){
        res.forEach(item => {
          item.codeImg = judgeUrl(item.pageRuleLink);
          item.startTime = item.startTime.substr(0, item.startTime.indexOf(' '));
          item.endTime = item.endTime.substr(0, item.endTime.indexOf(' '))
        });
        this.setData({
          couponList:res,
          couponRule: res[0].pageRule,
          banner: judgeUrl(res[0].imgUrl)
        })
      }
    })
  },
  getCoupon: function(){
    getSendCoupon().then( res => {
      /*this.setData({
        couponList: res.sendCoupon.list,
        couponRule: res.sendCoupon.explain,
      })*/
    })
  },
  onClick: function(e){
    let clickType = e.currentTarget.dataset.type;
    switch (clickType){
      case 'qrCode':
        this.generateCode(e);
        break;
      case 'close':
        this.closeCard(e);
        break;
      case 'couponItem':
        this.openCoupon(e);
        break;
      case downLoad:
        this.isAuthor();
        break;
    }
  },
  // closeCard
  closeCard: function(e){
    this.setData({showCard: false})
  },
  openCoupon: function(e){
    let dataIndex = e.currentTarget.dataset.index;
    let couponList = this.data.couponList;
    let couponInfo = couponList[dataIndex];
    this.setData({
      couponInfo,
      showCard: true
    });
    // this.generateCode(couponUrl);
  },
  // 生成二维码
  generateCode: function(url){
    try {
      wxBarCode.qrcode('qrcode', url, 220, 220);
    }catch (e) {}
  },
  //检查授权
  isAuthor: function(){
    let _this = this;
    app.isAuthor({
      type: 'scope.writePhotosAlbum',
      title: '需要授权相册权限才能保存',
      callBack: _this.downloadImg,
    })
  },
  // 保存图片
  downloadImg: function(e){
    let couponInfo = this.data.couponInfo;
    let couponImgParam = {
      brand: BRAND,
      full_value: couponInfo.promotionId.toString(),
      minus_value: couponInfo.orderPrice.toString(),
      begin_time: couponInfo.startTime,
      end_time: couponInfo.endTime,
      qrcode_url: couponInfo.codeImg
    };
    wx.showLoading({ title: '正在保存图片', mask: true });
    couponImg(couponImgParam).then(res => {
      // 图片路径
      return `${cdn}/${res}`;
    }).then(imgPath => {
      // 获取需要保存的地址
      return getImageInfo(imgPath).then(res => {
        return res
      })
    }).then( imgInfo => {
      saveImageToPhotosAlbum(imgInfo).then(res => {
        wxShowToast('图片保存成功');
        app._collectData2({eventName: '导购发券保存图片'});
        this.closeCard();
      })
    }).catch(err => wxShowToast(err.message))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let path = 'weMall/openCoupon/openCoupon';
    const couponInfo = this.data.couponInfo;
    let options = {
      pageTilte: couponInfo.pageTilte,
      orderPrice: couponInfo.orderPrice,
      promotionId: couponInfo.promotionId,
      linkUrl: encodeURIComponent(couponInfo.linkUrl),
      startTime: encodeURIComponent(couponInfo.startTime),
      endTime: encodeURIComponent(couponInfo.endTime),
      imgUrl: encodeURIComponent(couponInfo.imgUrl),
    };
    path += objToQuery(options);
    let imageUrl = options.shareCoverImg ? splitImg(options.shareCoverImg) : splitImg('sendCouponCover.jpg');
    console.log(objToQuery(options),'***')
    app._collectData2({eventName: '导购发券给好友'});
    return{
      title: app.config.publicName || '',
      path,
      imageUrl,
      success: res=>{
        console.log(res);
      }
    }
  }
});