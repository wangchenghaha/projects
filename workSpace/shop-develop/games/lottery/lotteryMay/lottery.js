import { EVENTS, KEYSTORAGE } from '../../../src/const'
import events from '../../../src/events'
import {splitGameImg, hideStr, splitImg, objToQuery} from '../../../utils/utils'
import { wxShowToast } from '../../../utils/wxMethods'
import {lotteryAdaperMay} from '../lotteryAdapter'
import { getGiftList, startlottery, getGiftRecords, getMyGiftList } from '../../service/lottery'
import {getVoucher} from "../../../service/voucher"; // 奖品详情，及抽奖,

const app = getApp();
const {brand, ETO_BRAND} = app.config;
let num = 1; //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
let lotteryArrLen = 0; //放奖品的数组的长度
let lotterys = '';
let isHasPhone = false;
let utmData = {
  utm_campaign: '',
  utm_medium:'',
  utm_source:'',
  utm_term:''
}

const splashImgList = [
  {
    scale: 6218,
    //lotteryBg: splitGameImg("lottery_0501_bg.jpg", 'lottery'),
    turnTop: "30%",
    btnTop: "90%",
    contentTop: '100%'
  },
  {
    scale: 5179,
    //lotteryBg: splitGameImg("lottery_0501_bg_new.jpg", 'lottery'),
    turnTop: "25%",
    btnTop: "76%;",
    contentTop: '85%'
  },
  {
    scale: 5064,
    // lotteryBg: splitGameImg("lottery_0501_bg_new.jpg", 'lottery'),
    turnTop: "25%",
    btnTop: "76%;",
    contentTop: '85%'
  }
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryBg: splitGameImg("lottery_may_bg.jpg?v=0512", 'lottery'),
    turnTop: "25%",
    btnTop: "76%;",
    contentTop: '85%',
    drawPointer: splitGameImg("lottery_may_go.png?v=05121", 'lottery'),
    brandTitle:  splitGameImg('lottery_0501_title.png?v=0512', 'lottery'),
    ruleTitleImg:  splitGameImg('rule_title.png?v=0512', 'lottery'),
    marqueeText: '',
    points: "",
    phone: "",
    tanShow: false,
    inputValue: '',
    showDetail: false,
    drawNoticePic:'',
    adapter:{},
    noticeBrand: '',
    errTanShow: false,
    errPic: '',
    blackBgShow: false,
    lotterys: [],
    cheatsShow: false,
    changeAnim: true,
    cheatsNoticePic:'',
    shareGetChance: false,
    getChancePic: splitGameImg('share_notice.png?v=0512', 'lottery'),
    closeImg: splitImg('icon_close.png?v=0512', 'common'),
    isShare: false,
    giftInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    app.setUtmOptions(options)
    if(options.utm_source){
      utmData = {
        utm_campaign: options.utm_campaign,
        utm_medium:options.utm_medium,
        utm_source:options.utm_source,
        utm_term:options.utm_term
      }
    }
    this.setData({
      adapter: lotteryAdaperMay()
    })
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
    this.getTitlePos()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.getSystemInfo();
  },

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let turnTop = '' ,btnTop = '', contentTop = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        console.log("scale =========",scale);
        if(diff < 100){
          //lotteryBg = item.lotteryBg
          turnTop = item.turnTop
          btnTop = item.btnTop
          contentTop = item.contentTop
        }
      });
      if(turnTop){
        that.setData({
          turnTop,
          btnTop,
          contentTop
        })
      }
    }catch (e) {}
  },

  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && event){
      //  获取手机号成功
      this._getGiftRecords();
    }
  },

  //===============GO按钮================
  startRollTap() {
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    setTimeout(() => {
      wx.hideLoading();

      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
      else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{
          getApp().getCRMInfoFn()
        }
      }
      else{
        _this.startLottery()
      }

    }, 1000);

  },

  startLottery(){
    let json;
    let lotteryNum = wx.getStorageSync('lotteryNum');
    if(lotteryNum < 10){
        json = {
          phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
          gameCode: "EnterpriseWechat"
        }
        if(utmData.utm_source){
          Object.assign(json, utmData);
        }
        this.getLottery(json);
    } else{
      this.setData({
        blackBgShow: true,
        isShare: false,
        shareGetChance: true,
        getChancePic: splitImg('memberDay_noChance.png', 'common'),
      })
    }

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
    getGiftRecords('EnterpriseWechat').then(res =>{
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
    let name = brand === 'BESTSELLER'? "" : ETO_BRAND[brand];
    wx.navigateTo({
      url: '/member/myCouponList/myCouponList?name=' + name
    })
  },

  //跳转首页
  goShop: function () {
    app.goBack();
  },
  getTitlePos(){
    // 获取右上角胶囊的大小
    const {top} = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuStyle: `top: ${top}px;`,
    })
  },
  goCoupon: function(){
    if(this.data.giftInfo.prizeType === 'no'){
      this.clickClose();
    } else{
      let name = brand === 'BESTSELLER'? "" : ETO_BRAND[brand];

      const {prizeCode} = this.data.giftInfo;
      const reqParam = {
        phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      };
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getVoucher(reqParam).then(res => {
        wx.hideLoading();
        if(Array.isArray(res) && res.length){
          const curCoupon = res.find(item => item.promotioncode === prizeCode);
          if(curCoupon){
            const couponInfo = {
              name,
              couponCode: curCoupon.couponno || curCoupon.voucherno || curCoupon.voucherno,
              couponId: curCoupon.promid || curCoupon.intergrationid || curCoupon.promotioncode,
            };
            wx.navigateTo({
              url: `/member/myCouponList/myCouponList${objToQuery(couponInfo)}`
            })
          }else{
            wxShowToast('暂无奖品')
          }
        }
        this.handleData(res);
      }).catch(err => {
      });
    }

  },
  handleData(res){

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
    getGiftList('EnterpriseWechat').then(res => {
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
        title: res.msg,
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
      aniData.rotate(2880 * num - 360 / lotteryArrLen * Number(currentIndex)).step(); //设置转动的圈数
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
      }.bind(this), 3000)

    }).catch(err => {
      wx.hideLoading()
    });
  }
})
