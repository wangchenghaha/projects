import { splitImg, splitGameImg } from '../../../utils/utils'
import { wxShowToast } from '../../../utils/wxMethods'
import { hongBaoConfig, hongBaoCards, cardAdd, createUser, queryUser} from '../../service/redBagCover'
import events from "../../../src/events";
import { EVENTS, KEYSTORAGE} from "../../../src/const";
const { screenWidth, screenHeight } = wx.getSystemInfoSync();
const bgImgName = screenWidth/screenHeight < 0.5 ? 'red_bag_bg@3x.png' : 'red_bag_bg@2x.png'
const imgFileName = 'redBag';
const app = getApp();
const { brand } = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    rotate: false,
    // 显示卡片弹窗
    showGift: false,
    // 奖品旋转
    rotateGift: false,
    // 背景图
    bgImg: splitGameImg(bgImgName, imgFileName),
    // 新年底图
    newYearImg: splitGameImg('new_year@2x.png', imgFileName),
    // 红包图
    redBagImg: splitGameImg('red_bag.png', imgFileName),
    // 游戏配置
    gameConfig: {},
    // gameUser
    gameUser: {},
    // 奖品
    giftItem: { cardPic : ''},
    // 品牌
    brandGift: splitGameImg('brand_gift.png', imgFileName),
    // 奖品主图
    giftImg: splitGameImg('gift_img.png', imgFileName),
  },
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO) {
      console.log('注册用户...');
      this.queryGameUser();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_CRMINFO);
    this.getRedBagConfig();
    this.getCardList();
    this.queryGameUser();
  },
  // 查询用户
  async queryGameUser(){
    const { openId } = wx.getStorageSync(KEYSTORAGE.wxInfo);
    if(openId){
      try {
        const gameUser =  await queryUser(openId);
        if(gameUser){
          this.setData({ gameUser });
          return
        }
        this.createUser();
      }catch (err){
        this.createUser();
      }
    }
  },
  // 注册游戏用户
  async createUser(){
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    if(!crmInfo){
      return
    }
    const { joindate, memberno, phone} = crmInfo
    const { nickName, avatarUrl, openId } = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const param = {
      crmRegTime: joindate,
      crmid: memberno,
      facePic: avatarUrl,
      openid: openId,
      nickName,
      phone
    }
    const user = await createUser(param);
    if(user){
      this.setData({
        gameUser: user
      })
    }
  },
  // 游戏配置
  async getRedBagConfig(){
    const res = await hongBaoConfig();
    if(res && res.id){
      const time = {
        endTimeStamp: new Date(res.endTime.replaceAll('-', '/')).getTime(),
        startTimeStamp: new Date(res.startTime.replaceAll('-', '/')).getTime(),
      };
      this.setData({
        gameConfig: Object.assign(res, time)
      })
    }
  },
  // 卡券列表
  async getCardList(){
    const cardList = await hongBaoCards();
    if(cardList){
      // 旋转角度倍数
      const n = 30;
      cardList.forEach((item, index) => {
        if(index){
          const eveNum = Math.ceil(index / 2);
          item.rotateDeg = eveNum * (index % 2 ? n : -n)
        }else {
          item.rotateDeg = 0
        }
        item.zIndex = (cardList.length - index) * n
      })
      setTimeout(() => {
        this.setData({ cardList })
        this.rotate();
      }, 800)
    }
  },
  // 弹窗过渡动画结束
  rotateCard(){
    this.setData({
      rotateGift: true
    })
  },
  // animationend结束，显示实际奖品
  animationend(){
    this.setData({
      showGift: true
    })
  },
  // 扇形旋转
  rotate() {
    this.setData({ rotate: true })
  },
  // 抽奖
  async open(e){
    if(!app.checkLogin()){
      return
    }
    const { cardList, gameUser, gameConfig } = this.data;
    const curDate = Date.now();
    if(gameConfig.startTimeStamp > curDate || gameConfig.endTimeStamp < curDate){
      wxShowToast('活动未开始');
      return
    }
    if(gameConfig.endTimeStamp < curDate){
      wxShowToast('活动已结束');
      return
    }

    try{
      // let res = await cardAdd(gameUser.id)
      let res = {
        brand: "ONLY",
        cardCode: "ONLY-card-2",
        cardId: 2,
        cardName: "ONLY卡片2",
        cardPic: "https://cdn.bestseller.com.cn/assets/common/ONLY/redBag/red_bag.png",
        cardUrl: "",
        createTime: null,
        id: "1465975171466743810",
        updateTime: null,
        userId: "1465964709576527874",
      }
      this.setData({ giftItem: res})
    }catch(err){

    }

  },
  // 一键领取
  getReceive(){
    const { cardUrl } = this.data.giftItem;
    if(cardUrl){
      app.navigateTo(cardUrl);
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {gameUser, cardList} = this.data;
    const imageUrl= cardList[0].cardPic
    return {
      title: '好友助力',
      imageUrl,
      path: `member/redBagCover/help/help?userId=${gameUser.id}`
    }
  }
})
