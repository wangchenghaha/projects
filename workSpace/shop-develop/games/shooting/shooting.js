import { EVENTS, KEYSTORAGE, URL_CDN } from '../../src/const.js'
import { getVoteList, doVote, shareVote, getRulesJson } from "../service/shooting";
import {
  objToQuery,
  getQueryStringArgs,
} from '../../utils/utils'
const config = require('../../src/config.js');
const cdn = config.cdn; //内容分发网络主机地址
const app = getApp();
import events from '../../src/events';
let phone = ''
let nickname = ''
let openid = ''
let unionid = ''
let todayVoteRecordId = ''
let canBtn = true
let accessWay = ''
Page({
  data: {
    url1: `${cdn}/assets/h5/JACKJONES/image/part1.png?v=20210909`,
    url2: `${cdn}/assets/h5/JACKJONES/image/part2.png?v=20210909`,
    url3: `${cdn}/assets/h5/JACKJONES/image/part3.png?v=20210909`,
    swiperImgs: [
      `${cdn}/assets/h5/JACKJONES/image/shooting1.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting2.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting3.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting4.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting5.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting6.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting7.png?v=20210909`,
      `${cdn}/assets/h5/JACKJONES/image/shooting8.png?v=20210909`
    ],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    showTips: false,
    cityList: [],
    todayRemainCount: '',
    rulesData: {},
    current: 0
  },
  onLoad(query) {
    accessWay = query.accessWay || ''
    events.register(this, EVENTS.EVENT_CRMINFO);
  },
  onShow() {
    // 判断是否登录
    if (!getApp().checkLogin()) {
      return;
    } else {
      this.getUserInfo()
      this.getList()
      this.getRulesJsonFn()
    }
  },
  /**
 * 接受授权成功刷新页面
 */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO) {
      this.getUserInfo()
      this.getList()
      this.getRulesJsonFn()
    }
  },
  // 获取用户信息
  getUserInfo() {
    let user_info = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    openid = wx.getStorageSync(KEYSTORAGE.openid) || '';
    unionid = wx.getStorageSync(KEYSTORAGE.unionid) || '';
    nickname = wxInfo.nickName || '';
    phone = user_info.phone || '';
  },
  // 获取打投城市列表
  getList() {
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    let params = {
      "configId": 1,
      "nickname": nickname,
      "openid": openid,
      "phone": phone,
      "targetId": 0,
      "todayVoteRecordId": 0,
      "unionid": unionid,
      "accessWay": accessWay || ''
    }
    let cityList = []
    getVoteList(params).then(res => {
      cityList = res.targetList
      let todayRemainCount = res.todayVoteRecord.todayRemainCount || 0
      todayVoteRecordId = res.todayVoteRecord.id || ''
      this.setData({
        cityList,
        todayRemainCount
      })
    }).catch(e => {
      console.log(e)
    })

    wx.hideLoading();
  },
  // 点击打投
  clickVote(e) {
    if (!canBtn) {
      return
    }
    canBtn = false
    let targetId = e.currentTarget.dataset.item.id
    let params = {
      "configId": 1,
      "nickname": nickname,
      "openid": openid,
      "phone": phone,
      "targetId": targetId,
      "todayVoteRecordId": todayVoteRecordId,
      "unionid": unionid
    }

    doVote(params).then(res => {
      let cityList = []
      cityList = res.targetList
      let todayRemainCount = res.todayVoteRecord.todayRemainCount || 0
      todayVoteRecordId = res.todayVoteRecord.id || ''
      this.setData({
        cityList,
        todayRemainCount
      })
      canBtn = true
    }).catch(e => {
      canBtn = true
      wx.showModal({
        title: '提示',
        content: e,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  // 分享打投
  shareVoteCount() {
    let params = {
      "configId": 1,
      "nickname": nickname,
      "openid": openid,
      "phone": phone,
      "targetId": 0,
      "todayVoteRecordId": todayVoteRecordId,
      "unionid": unionid
    }
    shareVote(params).then(res => {
      console.log('分享获得次数')
    }).catch(e => {
      console.log(e)
    })
  },
  // 打开规则
  openTips() {
    let showTips = true
    this.setData({
      showTips
    })
  },
  // 关闭规则
  closeTips() {
    let showTips = false
    this.setData({
      showTips
    })
  },
  // 跳转领券
  getCoupon1() {

    app.navigateTo('/businessCouponSubpack/pages/index/index?channel=channel61388af38e7a9&delivery_id=9409')

  },

  getCoupon2() {
    app.navigateTo('/businessCouponSubpack/pages/index/index?channel=channel61388b39eff56&delivery_id=9410')

  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

    let title = '快来投票！帮我成为JACK&JONES大魔王'
    let path = `/games/shooting/shooting`
    let imageUrl = `${cdn}/assets/h5/JACKJONES/image/shareShooting.jpg?v=${Date.now()}`
    this.shareVoteCount()
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  },
  // 获取打投规则
  getRulesJsonFn() {
    getRulesJson().then(res => {
      let rulesData = {}
      rulesData = res
      this.setData({
        rulesData
      })
    })
  },
  // 点击上一张轮播图
  prevImg() {
    let current = this.data.current;
    let swiperImgs = this.data.swiperImgs;
    if (current > 0) {
      current = current - 1
    } else {
      current = swiperImgs.length - 1;
    }
    this.setData({
      current
    })
  },
  // 点击下一张轮播图
  nextImg() {
    let current = this.data.current;
    let swiperImgs = this.data.swiperImgs;
    if (current < (swiperImgs.length - 1)) {
      current = current + 1
    } else {
      current = 0
    }
    this.setData({
      current
    })
  },
  /* 这里实现控制中间凸显图片的样式 */
  handleChange(e) {
    this.setData({
      current: e.detail.current
    })
  },

  /*
   *  打开webview
   */
  gotoWebView() {
    let linkUrl = 'https://m.jackjones.com.cn/customPage/JACKJONES/JJXNBAD9/index.html'
    this.openWebView(linkUrl);
  },

  openWebView: function (url) {
    const utmOptions = getQueryStringArgs(url);
    let linkUrl = encodeURIComponent(url);
    const params = Object.assign(utmOptions, { linkUrl });
    wx.navigateTo({
      url: `/pages/webview/webview${objToQuery(params)}`
    });
  },
})