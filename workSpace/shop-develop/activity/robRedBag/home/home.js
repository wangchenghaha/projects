/*
 * @Author: yxw
 * @Date: 2020-11-13 13:29:10
 * @LastEditTime: 2020-11-24 19:09:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SELECTED/activity/robRedBag/home/home.js
 */

import { splitImg, getImgUrlBySystem, objToQuery } from '../../../utils/utils'
import { wxShowToast } from '../../../utils/wxMethods'
import {EVENTS, KEYSTORAGE} from '../../../src/const';
import { KEYSTORAGE_ACTIVITY } from '../../service/const';
import {addActivity, redBagList, creatGameUser, gameUserInfo, robRedBag, myRedBag, grabCouponRecords} from '../../service/robRedBag'
import events from "../../../src/events";
import {createRedBag, shareUser} from "../common";
// 抢 红包背景
const bgImg = splitImg('rob_red_bag@2x.png', 'common');
const app = getApp();
const {brand, ETO_BRAND} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 不需要抢的背景图
    bgImg: getImgUrlBySystem('red_bag_bg@2x.jpg?v=1', 'common'),
    noRedBag: getImgUrlBySystem('icon_red_bag_null@2x.png', 'common'),
    myRedBagHeader: getImgUrlBySystem('my_red_bag_header@2x.png', 'common'),
    robImg: '',
    // 红包列表
    redBagList: [],
    // 是否显示我的红包🧧
    showMyRedBag: false,
    // 转发弹窗
    sharePopup: false,
    // 收到的分享的信息
    shareInfo: {},
    // 创建分享的ID
    shareToId: '1329268457011777537',
    // 用户信息
    gameUser: {},
    // 活动规则
    ruleList: [
      '1. 活动时间：2020年12月4日-12月7日',
      '2. 活动期间内下单即可分享红包给好友或者微信群；',
      '3. 发起用户和被分享用户可以点击领取分享链接中的拼手气红包；获得的红包可在【Bestseller折扣店小程序-会员中心-我的优惠券】查看；',
      '4. 下单后获得的抢红包链接可以被无限制次转发，每个分享的抢红包链接仅限5个人领取；',
      '5. 同一用户每天有3次抢红包机会，同一登录账号或同一手机号或同一手机号绑定微信号均视为同一用户；',
      '6. 每一个红包链接中有5种不同的固定金额优惠券，分别为5元、8元、10元、12元、15元，随机发放。红包仅限Bestseller折扣店官网购买商品时在线支付使用，不找零，不兑现；',
      '7. 红包有效期为领取时起7天之内有效，同一订单仅限使用一个红包券，红包券可以和促销活动叠加使用。',
    ],
    // 返回按钮样式
    menuStyle: '',
    // 是否显示返回菜单
    showBack: true,
    // 是否过活动参加
    joinActivity: false,
  },
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && event) {
      this.getGameUserInfo();
    }
  },
  // 查询游戏用户信息
  getGameUserInfo(){
    const openId = wx.getStorageSync(KEYSTORAGE.openid);
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    if(!crmInfo){
      return;
    }
    const gameUser = wx.getStorageSync(KEYSTORAGE_ACTIVITY.robRedBagUserInfo);
    if(gameUser && gameUser.id){
      this.setData({gameUser})
      return;
    }
    wx.showLoading({title: '加载中。', mask: true})
    gameUserInfo(openId).then(res => {
      wx.hideLoading()
      if(res){
        wx.setStorageSync(KEYSTORAGE_ACTIVITY.robRedBagUserInfo, res);
        this.setData({gameUser: res})
        return
      }
      this.creatGameUserInfo();
    }).catch(err => wxShowToast(err.message))
  },
  // 创建用户信息
  creatGameUserInfo(){
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    if(!crmInfo){
      return
    }
    const {phone, memberno} = crmInfo;
    const {avatarUrl, nickName, openId} = wx.getStorageSync(KEYSTORAGE.wxInfo)
    const param = {
      phone,
      memberno,
      nickName,
      openid: openId,
      facePic: avatarUrl,
    };
    wx.showLoading({
      title: '创建用户',
      mask: true
    })
    creatGameUser(param).then(res => {
      if(res){
        wx.hideLoading();
        wx.setStorageSync(KEYSTORAGE_ACTIVITY.robRedBagUserInfo, res);
        this.setData({gameUser: res});
        return
      }
      wxShowToast(res.msg);
    }).catch(err => wxShowToast(err.message));
  },
  getTitlePos(){
    // 获取右上角胶囊的大小
    const {top} = wx.getMenuButtonBoundingClientRect();
    const router = getCurrentPages();
    this.setData({
      menuStyle: `top: ${top}px;`,
      showBack: getCurrentPages().length > 1
    })
  },
  goBack(){
    wx.navigateBack({delta: 1});
  },
  goHome(){
    app.goBack();
  },
  onClick(e){
    const {type} = e.currentTarget.dataset;
    if(!app.checkLogin()){
      return;
    }
    switch (type) {
      case 'robRedBag':
        this.robBag();
        break;
      case 'myRedBagClick':
        this.myRedBagList();
        break;
      case 'shareRedBag':
        this.shareRedBag();
        break;
      case 'myCouponList':
        this.goMyCouponList();
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, nickName, avatarUrl } = options;
    //订阅登录事件
    events.register(this, EVENTS.EVENT_CRMINFO);
    if (id) {
      this.setData({
        bgImg,
        robImg: splitImg('gif_rob.png', 'common'),
        shareInfo: {id, nickName, avatarUrl},
      });
      this.getRedBagList(id);
    }
    this.getTitlePos();
  },
  goMyCouponList(){
    wx.navigateTo({
      url: `/member/myCouponList/myCouponList?name=${ETO_BRAND[brand]}`,
    })
  },
  // 抢红包
  robBag(){
    const {gameUser, shareInfo, joinActivity, redBagList} = this.data;
    const {id, phone} = gameUser;
    const param = {
      activityId: shareInfo.id, 
      userid: id,
      phone: phone.substr(0,11),
    }
    wx.showLoading({
      title: '抢红包',
      mask: true
    })
    robRedBag(param).then(res => {
      wx.hideLoading();
      switch (res.code) {
        case 1:
          this.lookDetail(param.activityId, res.msg || '');
          break;
        case 0:
          this.lookDetail(param.activityId);
          break;
        default:
          wxShowToast(res.msg)
      }
    }).catch(err => wxShowToast(err.message));
  },
  // 查看详情
  lookDetail(id, msg){
    const paramObj = { id};
    if(msg){
      paramObj.msg = msg;
    }
    wx.navigateTo({
      url: `../detail/detail${objToQuery(paramObj)}`
    })
  },
  // 我的红包
  async myRedBagList(){
    let  {gameUser, shareInfo, redBagList} = this.data;
    const param = {
      userid:gameUser.id
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    try{
      let res = [];
      // if( shareInfo.id){
      //   Object.assign(param, {activityId: shareInfo.id});
      //   res = await myRedBag(param);
      // }
      res = await grabCouponRecords(param.userid)
      wx.hideLoading();
      if(Array.isArray(res) && res.length){
        redBagList = res;
      }
      this.setData({
        redBagList,
        showMyRedBag: true
      })
    }catch (e) {
      wxShowToast(e.message)
    }
  },
  closePopup() {
    this.setData({
      showMyRedBag: false,
      sharePopup: false,
    })
  },
  // 获取红包列表
  getRedBagList(id){
    redBagList(id).then(res => {
      if(Array.isArray(res) && res.length){
        this.setData({
          redBagList: res,
          joinActivity: true,
        });
      }
    }).catch(err => wxShowToast(err.message))
  },

  // 创建红包
  shareRedBag(){
    createRedBag().then(res =>{
      this.setData({
        shareToId: res,
        sharePopup: true,
      })
    }).catch(err => wxShowToast(err.message))
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGameUserInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.closePopup();
    return shareUser(this.data.shareToId);
  }
})