const tongji = require('../../utils/tongji.js');
const app = getApp();
const { cdn, brand, isSaleForce } = app.config;
import { URL_CDN, EVENTS, KEYSTORAGE } from '../../src/const.js'
import events from "../../src/events";
import { getCRMInfo } from '../../service/member'
Page({
  data: {
    vipCardBackground: URL_CDN.POINT_VIP_BG,
    banner: {
      img: URL_CDN.MEMBER_CENTER_BANNER,
      history: "显示历史记录+",
      memberRewards: "会员专享>>",
    },
    user: {
      img: URL_CDN.LOGO_BLACK_SQUARE,
    },
    points: "",
    text: "",
    levelTips: '',
    progress: "0",
    progressLeft: "10.1%",
    shop: "去消费>>",
    detail: {},
    chose: '0px',
    levelLeft: '0px',
    moveWidth: '0px',
    active: 0,   //0隐藏会员权益，1显示会员权益
    blinkGif: cdn + '/assets/h5/pub/image/blink-point.gif',
    detaillist: [
      {
        title: "普卡权益",
        logo: URL_CDN.VIP_CARD_BASIC,
        descraption1: '消费者每满500元，获赠1000购物积分，本次累计师傅金额将不再计入下次积分奖励规则',
        descraption2: '等级永久有效，永不降级（除退货原因外）',
        list: [
          {
            logo: URL_CDN.VIP_CARD_SILVER,
            index: '1',
          },
          {
            logo: URL_CDN.VIP_CARD_GOLDEN,
            index: '2',
          }
        ]
      },
      {
        title: "银卡权益",
        logo: URL_CDN.VIP_CARD_SILVER,
        descraption1: '消费者每满500元，获赠1500购物积分，本次累计师傅金额将不再计入下次积分奖励规则',
        descraption2: '等级永久有效，永不降级（除退货原因外）',
        list: [
          {
            logo: URL_CDN.VIP_CARD_BASIC,
            index: '0',
          },
          {
            logo: URL_CDN.VIP_CARD_GOLDEN,
            index: '2',
          }
        ]
      },
      {
        title: "金卡权益",
        logo: URL_CDN.VIP_CARD_GOLDEN,
        descraption1: '消费者每满500元，获赠2000购物积分，本次累计师傅金额将不再计入下次积分奖励规则',
        descraption2: '等级永久有效，永不降级（除退货原因外）',
        list: [
          {
            logo: URL_CDN.VIP_CARD_BASIC,
            index: '0',
          },
          {
            logo: URL_CDN.VIP_CARD_SILVER,
            index: '1',
          }
        ]
      }
    ],
    levelList: [
      {
        value: 0,
        color: '#8dc9f1',
        name: '普卡',
        isShow: true,
        className: 'traditionalCard'
      }, {
        value: 1000,
        color: '#c0c0c0',
        name: '银卡',
        isShow: true,
        className: 'silverCard'
      },
      {
        value: 3000,
        color: '#d9b97b',
        name: '金卡',
        isShow: true,
        className: 'goldenCard'
      }
    ],
    currentBlinkPoint:'',
    currentBuffer:'',
    currentHidePoint:''
  },
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      setTimeout(() => {
        this.getCurUserPoints()
      }, 1000);
    }
  },
  onLoad: function (options) {
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    if (brand === 'JLINDEBERG') {
      let levelList = [
        {
          value: 0,
          color: '#8dc9f1',
          name: '普卡',
          isShow: true,
          className: 'traditionalCard'
        }, {
          value: 10000,
          color: '#c0c0c0',
          name: '银卡',
          isShow: true,
          className: 'silverCard'
        },
        {
          value: 20000,
          color: '#d9b97b',
          name: '金卡',
          isShow: true,
          className: 'goldenCard'
        },
        {
          value: 40000,
          color: '#000000',
          name: '白金卡',
          isShow: true,
          className: 'whiteGoldenCard'
        }
      ];
      this.setData({ levelList })
    }
    if (!app.checkLogin()) {
      return;
    }
    this.getCurUserPoints();

    this.currentBlinkPointFunc();
    this.currentHidePointFunc();
    this.currentBufferFunc();
    /*this.setData({

    })*/
  },
  getCRMInfo: function () {
    getCRMInfo().then(res => {
      let crmKey = KEYSTORAGE.crmInfo;
      isSaleForce ? wx.setStorageSync(crmKey, res) : wx.setStorageSync(crmKey, res[crmKey]);
    }).then(res => {
      this.getCurUserPoints();
    }).catch(err => {
      wx.showToast({
        title: err.message,
      });
    })
  },
  getCurUserPoints: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var user_info = wx.getStorageSync('user_info');
    var amount = Number(user_info.shoppingamount);
    var chose = '';
    var levelTips = '';
    let myLevel = user_info.level;
    let levelList = this.data.levelList;
    levelList.forEach(item => {
      if (amount >= item.value) {
        levelTips = `您已经是${item.name}会员`;
        myLevel = item.name
      }
    })
    this.setData({
      chose: chose,
      text: user_info.upgrades,
      // progress: progress,
      // progressLeft: progressLeft,
      points: parseInt(user_info.availablepoints),
      myLevel,
      memberName: user_info.name,
      levelTips: levelTips,
      // levelLeft: levelLeft,
      // moveWidth: moveWidth,
      user: {
        img: userInfo.avatarUrl,
      },
    });
  },
  onReady: function () {

  },
  onShow: function (options) {

    this.getCRMInfo();
    app.track()
  },
  onHide: function () {
    // 页面隐藏
  },
  toHistory: function (e) {
    wx.navigateTo({
      url: "/pages/fashionID/pointsDetails/pointsDetails"
    });
  },
  toPointsMallCoupon: function (e) {
    app.gioTrack('pageclick_personalcenter_redeemcoupon')
    if ("FOL" !== brand) {
      wx.navigateTo({
        url: "/member/rewardCenter/rcMain/rcMain"
      });
    }
  },
  toPointsMallGifts: function (e) {
    app.gioTrack('pageclick_personalcenter_redeemgift')
    if ("FOL" !== brand) {
      wx.navigateTo({
        url: "/member/rewardCenter/rcMain/rcMain"
      });
    }
  },
  toMemberCenter: function (e) {
    app.gioTrack('pageclick_personalcenter_gocenter');
    wx.switchTab({
      url: "/pages/memberCenter/memberCenter"
    });
  },
  showVip: function (event) {
    const {index} = event.currentTarget.dataset;
    this.setData({ active: 1, detail: this.data.detaillist[index] });
  },
  closemodel: function () {
    this.setData({ active: 0, detail: {} })
  },
  goshop: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  //当前隐藏的点
  currentHidePointFunc: function (item) {
    let previous = 0; //当前所属种类 0 1 2 3 ...
    let sectionSize = this.data.levelList.length; //卡片种类数量 0 1 2 3 ...
    var user_info = wx.getStorageSync('user_info');
    var amount = Number(user_info.shoppingamount);
    if (amount <= 0) {
      // return 0;
      this.setData({ currentHidePoint : 0})
    } else if (amount > this.data.levelList[sectionSize - 1].value) {
      // console.log(`第${sectionSize-1}个点隐藏`)
      // return sectionSize - 1;
      this.setData({ currentHidePoint: sectionSize - 1 })
    } else {
      previous = this.data.levelList.findIndex(item => amount <= item.value);
      let nextValue = this.data.levelList[previous].value; //段尾值
      if (amount < nextValue) {
        // console.log(`第${previous-1}个点隐藏`)
        // return previous - 1;
        this.setData({ currentHidePoint: previous - 1 })
      } else {
        // console.log(`第${previous}个点隐藏`)
        // return previous;
        this.setData({ currentHidePoint: previous })
      }
    }
  },
  //当前闪烁的点
  currentBlinkPointFunc: function () {
    let previous = 0; //当前所属种类 0 1 2 3 ...
    let sectionSize = this.data.levelList.length; //卡片种类数量 0 1 2 3 ...
    var user_info = wx.getStorageSync('user_info');
    var amount = Number(user_info.shoppingamount);
    if (amount <= 0) { //0为普卡等级
      // return 0 - 3; // gif左移3个比例使其居中
      this.setData({ currentBlinkPoint:0-3})
    } else if (amount > this.data.levelList[sectionSize - 1].value) { //超出最高等级上限
      //return 100 - 3; // gif左移3个比例使其居中
      this.setData({ currentBlinkPoint: 100 - 3 })
    } else {
      previous = this.data.levelList.findIndex(item => amount <= item.value);
      let nextValue = this.data.levelList[previous].value; //段尾值
      if (amount < nextValue) {
        // console.log(`小于: ${((previous - 1) / (sectionSize-1)) * 100 - 6}`);
        // return ((previous - 1) / (sectionSize - 1)) * 100 - 4; // gif左移4个比例使其居中
        this.setData({ currentBlinkPoint: ((previous - 1) / (sectionSize - 1)) * 100 - 4 })
      } else {
        // console.log(`整数: ${(previous / (sectionSize-1)) * 100 - 6}`)
        // return (previous / (sectionSize - 1)) * 100 - 4; // gif左移4个比例使其居中
        this.setData({ currentBlinkPoint: (previous / (sectionSize - 1)) * 100 - 4 })
      }
    }
  },
  //当前进度(使用偏移量百分比控制进度)
  currentBufferFunc: function () {
    let previous = 0; //当前所属种类 0 1 2 3 ...
    let sectionSize = this.data.levelList.length; //卡片种类数量 0 1 2 3 ...
    var user_info = wx.getStorageSync('user_info');
    var amount = Number(user_info.shoppingamount);
    if (amount <= 0) { //0为普卡等级
      // return 0;
      this.setData({ currentBuffer: 0  })
    } else if (amount > this.data.levelList[sectionSize - 1].value) { //超出最高等级上限
      // return 100;
      this.setData({ currentBuffer: 100 })
    } else {
      previous = this.data.levelList.findIndex(item => amount <= item.value);
      // console.log(`所属分段: ${previous}`);
      let previousValue = this.data.levelList[previous - 1].value; //段首值
      let nextValue = this.data.levelList[previous].value; //段尾值
      let currentLength = nextValue - previousValue; //当前段长度
      let currentOccupy = amount - previousValue; //当前段占用长度
      let currentOccupyRatio = currentOccupy / currentLength; //当前段占用比例
      let ratio = (previous - 1 + currentOccupyRatio) / (sectionSize - 1); //计算总段数比例值
      // console.log(`段首: ${previousValue}`,`段尾: ${nextValue}`,`段长: ${currentLength}`,`段占用: ${currentOccupy} ,段占用比: ${currentOccupyRatio}`,`总比例值: ${ratio}`);
      // return ratio * 100;
      this.setData({ currentBuffer: ratio * 100 })
    }

  },

  // 积分记录
  toPointRecord: function(){
      wx.navigateTo({
        url: '../pointRecord/pointRecord',
      })
  }
})
