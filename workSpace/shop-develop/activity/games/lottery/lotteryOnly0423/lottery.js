import { EVENTS, KEYSTORAGE } from '../../../../src/const'
import events from '../../../../src/events'
import {splitGameImg, hideStr, splitImg} from '../../../../utils/utils'
import { wxShowToast } from '../../../../utils/wxMethods'
import { getGiftList, startlottery, getGiftRecords, getMyGiftList } from '../../../service/lottery' // 奖品详情，及抽奖,

const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
let num = 1; //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
let lotteryArrLen = 0; //放奖品的数组的长度
let lotterys = '';
let isHasPhone = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryBg: splitImg("cj_bg.jpg?v="+Math.floor(Math.random()*10000, 10000)),
    drawPointer: splitImg("turnplate-pointer.png"),
    brandTitle:  splitGameImg('lottery_title2.png', 'lottery'),
    ruleTitleImg:  splitGameImg('rule_title.png', 'lottery'),
    marqueeText: '',
    points: "",
    phone: "",
    tanShow: false,
    inputValue: '',
    showDetail: false,
    drawNoticePic:'',
    bigBackGround: '#76c0e7',
    midBackGround: '#e88605',
    smallBackGround: '#e88605',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);

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
    let shoppingamount =  wx.getStorageSync(KEYSTORAGE.crmInfo).shoppingamount
    if(lotteryNum < 2){
      if( Number(shoppingamount) === 0){
        json = {
          phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
          gameCode: "BeiFuXiaoYuan"
        }
        this.getLottery(json);
      } else {
        this.setData({
          blackBgShow: true,
          isShare: false,
          shareGetChance: true,
          getChancePic: splitImg('notNewMember.png', 'common'),
        })
      }
     
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
    getGiftRecords('BeiFuXiaoYuan').then(res =>{
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
      url: '/member/myCouponList/myCouponList?name=' + name
    })
  },

  //跳转首页
  goShop: function () {
    wx.switchTab({url: '/pages/index/index'});
  },

  goCoupon: function(){
    if(this.data.giftInfo.prizeType === 'no'){
      this.clickClose();
    } else{
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        url: '/member/myCouponList/myCouponList?name=' + name
      })
    }
   
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
    getGiftList('BeiFuXiaoYuan').then(res => {
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
  }
})