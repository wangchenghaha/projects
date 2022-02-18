import { EVENTS, KEYSTORAGE } from '../../../../src/const'
import events from '../../../../src/events'
import {splitGameImg, hideStr} from '../../../../utils/utils'
import { wxShowToast } from '../../../../utils/wxMethods'
import { getGiftList, startlottery, getGiftRecords, getMyGiftList } from '../../../service/lottery' // 奖品详情，及抽奖,

const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
let num = 1; //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
let lotteryArrLen = 0; //放奖品的数组的长度
let lotterys = '';
let isHasPhone = false;
const cheatsArr = [
                  [ splitGameImg('one_cheats_1.jpg', 'lottery'),
                    splitGameImg('one_cheats_2.jpg', 'lottery'),
                    splitGameImg('one_cheats_3.jpg', 'lottery'),
                    splitGameImg('one_cheats_4.jpg', 'lottery'),
                    splitGameImg('one_cheats_5.jpg', 'lottery')],
                  [ splitGameImg('two_cheats_1.jpg', 'lottery'),
                    splitGameImg('two_cheats_2.jpg', 'lottery'),
                    splitGameImg('two_cheats_3.jpg', 'lottery'),
                    splitGameImg('two_cheats_4.jpg', 'lottery'),
                    splitGameImg('two_cheats_5.jpg', 'lottery')],
                  [ splitGameImg('three_cheats_1.jpg', 'lottery'),
                    splitGameImg('three_cheats_2.jpg', 'lottery'),
                    splitGameImg('three_cheats_3.jpg', 'lottery'),
                    splitGameImg('three_cheats_4.jpg', 'lottery'),
                    splitGameImg('three_cheats_5.jpg', 'lottery')],
                  [ splitGameImg('four_cheats_1.jpg', 'lottery'),
                    splitGameImg('four_cheats_2.jpg', 'lottery'),
                    splitGameImg('four_cheats_3.jpg', 'lottery'),
                    splitGameImg('four_cheats_4.jpg', 'lottery'),
                    splitGameImg('four_cheats_5.jpg', 'lottery')],
                  [ splitGameImg('five_cheats_1.jpg', 'lottery'),
                    splitGameImg('five_cheats_2.jpg', 'lottery'),
                    splitGameImg('five_cheats_3.jpg', 'lottery'),
                    splitGameImg('five_cheats_4.jpg', 'lottery'),
                    splitGameImg('five_cheats_5.jpg', 'lottery')]    
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryBg: splitGameImg('lottery_bg.jpg?v=100', 'lottery'),
    drawPointer: splitGameImg('lottery_go.png', "lottery"),
    brandTitle: splitGameImg('lottery_title.png', 'lottery'),
    marqueeText: '',
    points: "",
    phone: "",
    tanShow: false,
    inputValue: '',
    showDetail: false,
    drawNoticePic:'',
    bigBackGround: '#ff8c9f',
    midBackGround: '#ed5c79',
    smallBackGround: '#ed5c79',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
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
    let lotteryNum = wx.getStorageSync('lotteryNum');
    if(lotteryNum < 4){
      let isShare = wx.getStorageSync('isLotteryShare')
      if(isShare){
        if(true){
          json = {
            phone: '18187654321'
          }
          this.getLottery(json);
        } else {
          app.getCRMInfoFn();
          isHasPhone = true;
        }
      } else {
        this.setData({
          blackBgShow: true,
          shareGetChance: true,
          isShare: true,
          getChancePic: splitGameImg('share_notice.png', 'lottery'),
        })
      }
    } else{
      this.setData({
        blackBgShow: true,
        isShare: false,
        shareGetChance: true,
        getChancePic: splitGameImg('nochance_notice.png', 'lottery'),
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
    getGiftRecords().then(res =>{
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
    let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
    wx.navigateTo({
      url: '../../../member/myCouponList/myCouponList?name=' + name
    })
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
    getGiftList().then(res => {
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
    let {changeAnim, cheatsNoticePic} = this.data;
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
      if(currentIndex != 5){
        cheatsNoticePic = cheatsArr[currentIndex][Math.floor(Math.random()* 5)]
      }
      this.setData({ 
        aniData: aniData.export(),
        cheatsNoticePic
      })
      setTimeout(function () {
        changeAnim = !changeAnim;
        if(currentIndex != 5){
          this.setData({
            tanShowWhite: false,
            blackBgShow: true,
            cheatsShow: true ,
            drawNoticePic: res.prizeWinPicUrl,
            changeAnim
          })
        } else {
          this.setData({
            tanShowWhite: false,
            blackBgShow: true,
            cheatsShow: false ,
            tanShow: true,
            drawNoticePic: res.prizeWinPicUrl,
            changeAnim
          })
        }
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