/*
 * @Author: yxw
 * @Date: 2020-11-13 13:29:10
 * @LastEditTime: 2020-11-27 18:02:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SELECTED/activity/robRedBag/detail/detail.js
 */
import { KEYSTORAGE } from "../../../src/const";
import { splitImg, getImgUrlBySystem, objToQuery } from '../../../utils/utils'
import { wxShowToast } from "../../../utils/wxMethods";
import {redBagDetail, addActivity} from '../../service/robRedBag'
import {KEYSTORAGE_ACTIVITY} from "../../service/const";
import {shareUser, createRedBag} from '../common'
const app = getApp();
const {brand, ETO_BRAND} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo: {},
    // 顶部背景
    headerBg: splitImg('bg_lingqu@2x.png', 'common'),
    // 优惠券背景
    couponBg: getImgUrlBySystem('bg_coupon@2x.png', 'common'),
    // 用户抢到的优惠券icon_best_luck
    userCouponBg: splitImg('bg_coupon_user.png', 'common'),
    // 手气最佳
    bestLuckIcon: getImgUrlBySystem('icon_best_luck@2x.png', 'common'),
    // 抢红包人员
    redBagDetail: {},
    userList: [1, 2, 3, 4],
    // 分享弹窗
    sharePopup: false,
    // 品牌
    etoBrand: ETO_BRAND[brand],
    // 总红包数量
    allRedBagCount: 5,
    // 标题位置
    titleStyle: '',
    // 领取提示
    msg: '',
    // 领取底部banner
    detailBanner: getImgUrlBySystem('red_bag_banner@2x.png'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id = '', msg = ''} = options;
    this.setData({msg})
    this.getRedBagDetail(id);
    this.getTitlePos();
  },
  getRedBagDetail(id){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    redBagDetail(id).then(res => {
      wx.hideLoading();
      if(res && Array.isArray(res.giftOrderList)){
        const gameUser = wx.getStorageSync(KEYSTORAGE_ACTIVITY.robRedBagUserInfo);
        const myCoupon = res.giftOrderList.filter(item => item.userId === gameUser.id)[0];
        // const myCoupon = res.giftOrderList[0];
        this.setData({redBagDetail: Object.assign(res, {myCoupon})});
      }
    }).catch(err => wxShowToast(err.message));
  },
  // 设置标题位置
  getTitlePos(){
    // 获取右上角胶囊的大小
    const {top, height} = wx.getMenuButtonBoundingClientRect();
    this.setData({
      titleStyle: `margin-top: ${top}px; line-height: ${height}px`
    })
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
  // 关闭弹窗
  closePopup() {
    this.setData({ sharePopup: false });
  },
  // 回首页
  goHome(){
    app.goBack();
  },
  // 返回
  goBack(){
    wx.navigateBack({delta: 1});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    this.setData({ wxInfo})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.closePopup();
    return shareUser(this.data.shareToId);
  }
})
