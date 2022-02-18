import { EVENTS, KEYSTORAGE } from '../../../../src/const'
import events from '../../../../src/events'
import {splitGameImg, hideStr,getQueryStringArgs} from '../../../../utils/utils'
import { wxShowToast } from '../../../../utils/wxMethods'
import { getGiftList, startlottery, getGiftRecords } from '../../../service/lottery' // 奖品详情，及抽奖,

const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
let num = 1; //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
let lotteryArrLen = 0; //放奖品的数组的长度
let lotterys = '';
let utmData = {
  utm_campaign: '',
  utm_medium:'',
  utm_source:'',
  utm_term:''
}
let activityName = ''
const ruleBrand = {
  ONLY: [
    '注册成为ONLY品牌会员即可免费参与抽奖；',
    '活动时间：即日起—2021年8月15日；',
    '每位会员有一次免费抽奖机会；',
    '权益的使用和兑换，请遵循权益说明在指定平台活动渠道使用，优惠券将在使用时自动核销；',
    '奖品数量有限，兑完为止；',
    '最终活动解释权归绫致集团所有。'
  ],
  VEROMODA: [
    '活动时间：2021年9月7日-2021年10月31日期间的每周二00:00-23:59；',
    '每位用户每周仅可参与一次抽奖；',
    '抽奖所得优惠券仅限小程序商城及官网使用，有效期为领取优惠券之日起7天内，过期将自动核销；取消订单或退货，优惠券均无法退回；',
    '此优惠券不与其他优惠券叠加使用；',
    '实物需要支付0.01元并填写地址，于7个工作日内寄出，奖品不抵现不退换；',
    '活动最终解释权归绫致时装所有。',
  ]
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryBg: splitGameImg(`lottery_bg_0817.jpg?v=${new Date().getDate()}1`, 'lottery'),
    drawPointer: splitGameImg(`lottery_go.png?v=${new Date().getDate()}1`, "lottery"),
    ruleTitleImg: splitGameImg('lottery_title.png', 'lottery'),
    marqueeText: '',
    points: "",
    phone: "",
    tanShow: false,
    inputValue: '',
    showDetail: false,
    drawNoticePic:'',
    bigBackGround: '#cdcdcd',
    midBackGround: '#cdcdcd',
    smallBackGround: '#cdcdcd',
    noticeBrand: '',
    errTanShow: false,
    errPic: '',
    blackBgShow: false,
    lotterys: [],
    cheatsShow: false,
    changeAnim: true,
    cheatsNoticePic:'',
    shareGetChance: false,
    getChancePic: splitGameImg('share_notice.png', 'lottery'),
    isShare: false,
    giftInfo: {},
    ruleList: ruleBrand[brand] || ruleBrand['VEROMODA']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    let option
    if(options.q){
      option = getQueryStringArgs(decodeURIComponent(options.q));
      if (option) {
        app.setUtmOptions(option);
        wx.setStorageSync(KEYSTORAGE.devFlag, option.devFlag)
        const share = {
          share_by: option.share_by,
          share_by_shop: option.share_by_shop || '0000',
        };
        app.setShareInfo(share);
      }
    } else {
      option = options
      app.setUtmOptions(option)
    }
    activityName = option.actname
    if(option.utm_source){
      utmData = {
        utm_campaign: option.utm_campaign,
        utm_medium:option.utm_medium,
        utm_source:option.utm_source,
        utm_term:option.utm_term
      }
    }
    // 动态获取背景颜色
    if(option.bgColor){
      const bgColor = `#${option.bgColor}`
      this.setData({
        bigBackGround: bgColor,
        midBackGround: bgColor,
        smallBackGround: bgColor
      })
    }
    if(option.centerBg){
      this.setData({
        midBackGround: `#${option.centerBg}`
      })
    }
    let aniData = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease-in-out'
    });
    let isShare = wx.getStorageSync('isLotteryShare')
    if(isShare){
      wx.setStorageSync('isLotteryShare', isShare);
    } else {
      wx.setStorageSync('isLotteryShare', true);
    }
    this.aniData = aniData;
    this.getZPgoods();
    this._getGiftRecords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  handleEvent: function (event, type) {
    if (type == EVENTS.EVENT_GAMECRMINFO && event) {
      this.getZPgoods();
      this._getGiftRecords();
    }
  },

  //===============GO按钮================
  startRollTap() {
    if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
      app.navigateTo('member/login/login?game=true')
      return;
    }
    else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
      this.startLottery();
    }
  },

  startLottery(){
    let json;
    json = {
      phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      gameCode: activityName
    }
    if(utmData.utm_source){
      Object.assign(json, utmData);
    }
    this.getLottery(json);
  },

  clickClose() {
    this.setData({
      tanShowWhite: false,
      errTanShow: false,
      tanShow: false,
      cheatsShow: false,
      blackBgShow: false,
      shareGetChance: false
    })
  },

  goBack(){
    app.goBack();
  },
  // 中奖记录
  _getGiftRecords(){
    let {marqueeText} = this.data;
    getGiftRecords(activityName).then(res =>{
       for (let i = 0; i < res.length; i++) {
          marqueeText = marqueeText + ' 恭喜  ' + hideStr(res[i].phone, 3,7) + '     获得' + res[i].prizeName + ';'
        }
       this.setData({marqueeText})
    })
  },

  //跳转crm链接
  gotoWebView: function (linkUrl) {
    let deCodeURL = encodeURIComponent(linkUrl);
    wx.navigateTo({
      url: `/pages/webview/webview?linkUrl=${deCodeURL}`
    })
  },
  //点击弹窗领取券
  clickLQ:function(){
    let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
    wx.navigateTo({
      url: '../../../member/myCouponList/myCouponList?name=' + name
    })
  },

  //跳转首页
  goShop: function () {
    wx.switchTab({url: '/pages/index/index'});
  },

  goCoupon: function(){
    // if(this.data.giftInfo.prizeType === 'no'){
    //   this.clickClose();
    // } else{
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        url: '../../../../member/myCouponList/myCouponList?name=' + name
      })
    // }

  },

  seeCoupon(){
    this.setData({
      cheatsShow: false,
      tanShow: true
    })
  },

  //奖品列表
  getZPgoods: function () {
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    getGiftList(activityName).then(res => {
      wx.hideLoading();
      console.log('==============================奖品？？？？')
      console.log(res)
      this.setData({
        lotterys: res
      })
      lotterys = res
      lotteryArrLen = res.length
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: err,
        duration: 2000
      });
    });
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  showDetails: function(e){
    this.setData({
      showDetail: true
    });
  },

  closeDetails: function(e){
    this.setData({
      showDetail: false
    });
  },

  getLottery: function(_data){
    let {changeAnim} = this.data;
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    startlottery(_data).then(res => {
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      this.setData({ tanShowWhite: true })//防止重复调用接口
      let aniData = this.aniData; //获取this对象上的动画对
      let currentIndex = 0;
      for (let i = 0; i < lotterys.length; i++) {
        if(res.id === lotterys[i].id){
          currentIndex = i
        }
      }
      aniData.rotate(1440 * num - 360 / lotteryArrLen * Number(currentIndex)).step(); //设置转动的圈数
      num++
      wx.setStorageSync('lotteryNum',num)
      wx.setStorageSync('isLotteryShare', false);
      // if(currentIndex != 5){
      //   cheatsNoticePic = cheatsArr[currentIndex][Math.floor(Math.random()* 5)]
      // }
      this.setData({
        aniData: aniData.export(),
        //cheatsNoticePic
      })
      setTimeout(function () {
        changeAnim = !changeAnim;
        this.setData({
          tanShowWhite: false,
          blackBgShow: true,
          cheatsShow: false ,
          tanShow: true,
          drawNoticePic: res.prizeWinPicUrl,
          changeAnim,
          giftInfo: res
        })
        // if(currentIndex != 5){
        //   this.setData({
        //     tanShowWhite: false,
        //     blackBgShow: true,
        //     cheatsShow: true ,
        //     drawNoticePic: res.prizeWinPicUrl,
        //     changeAnim
        //   })
        // } else {
        //   this.setData({
        //     tanShowWhite: false,
        //     blackBgShow: true,
        //     cheatsShow: false ,
        //     tanShow: true,
        //     drawNoticePic: res.prizeWinPicUrl,
        //     changeAnim
        //   })
        // }
      }.bind(this), 3000)

    }).catch(err => {
      wx.hideLoading()
      return
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    setTimeout(()=>{
      that.clickClose()
    }, 2000)
    wx.setStorageSync('isLotteryShare', true);
  }
})
