import {KEYSTORAGE} from '../../../src/const'
import {splitImg} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
import {distributorOrder, distributorCustomer, distributorCustomerList} from '../../service/distributor'
const app = getApp();
const homePath = 'pages/index/index';
const allLevel = [
  {
    level: 1,
    cardImg: splitImg('FX_bronze.png', 'common')
  },
  {
    level: 2,
    cardImg: splitImg('FX_silver.png', 'common')
  },
  {
    level: 3,
    cardImg: splitImg('FX_gold.png', 'common')
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo: {},
    guideInfo: {},
    guideLevel: {},
    fxQRImg: splitImg('icon_fx_qr.png', 'common'),
    toolList: [
      {
        icon: splitImg('icon_collection.png','common'),
        text: '我的收藏',
        url: 'pages/collection/collection'
      },
      {
        icon: splitImg('icon_fx_recommend.png','common'),
        text: '推荐搭配',
        url: 'weMall/daogouMbList/daogouMbList'
      },
      {
        icon: splitImg('icon_zhuanfa.png','common'),
        text: '单品转发',
        url: homePath
      }
    ],
    noticeIcon: splitImg('icon_notice.png', 'common'),
    order: [
      {
        type: 'day',
        value: 0,
        goodsCount: 0,
        text: '今日订单',
        profitText: '今日预估'
      },
      {
        type: 'yesterDay',
        value: 0,
        goodsCount: 0,
        text: '昨日订单',
        profitText: '昨日预估'
      },
      {
        type: 'month',
        value: 0,
        goodsCount: 0,
        text: '本月订单',
        profitText: '本月预估'
      },
      {
        type: 'years',
        value: 0,
        goodsCount: 0,
        text: '今年订单',
        profitText: '今年预估'
      }
    ],
    customer: [
      {
        type: 'dayCount',
        value: 0,
        text: '今日新增'
      },
      {
        type: 'yesterDayCount',
        value: 0,
        text: '昨日新增'
      },
      {
        type: 'monthCount',
        value: 0,
        text: '本月新增'
      },
      {
        type: 'yearsCount',
        value: 0,
        text: '今年新增'
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setGuideInfo();
    this.getDistributorCustomer();
    this.getDistributorOrder();
    this.getCustomerList();
  },
  // 顾客统计
  getDistributorCustomer(){
    let {employeeId} = this.data.guideInfo;
    distributorCustomer(employeeId).then(res => {
      if(res){
        const {customer} = this.data;
        customer.forEach(item => item.value = res[item.type] || 0);
        this.setData({customer})
      }
    }).catch(err => wxShowToast(err.message))
  },
  // 订单和收益统计
  getDistributorOrder(){
    let {employeeId} = this.data.guideInfo;
    distributorOrder(employeeId).then(res => {
      if(res){
        const {order} = this.data;
        order.forEach(item => {
          const curType = res[item.type];
          if(curType){
            item.value = curType.orderValue || 0;
            item.goodsCount = curType.totalGoodsCount || 0;
          }
        });
        this.setData({order})
      }
    }).catch(err =>wxShowToast(err.message))
  },
  getQRImg(){
    let {employeeId} = this.data.guideInfo;
    distributeQRImg(employeeId).then(res => {

    }).catch(err => wxShowToast(err.message))
  },
  getCustomerList(){
    let {employeeId} = this.data.guideInfo;
    distributorCustomerList(employeeId).then(res => {
      if(res){

      }
    }).catch(err => wxShowToast(err.message));
  },
  setGuideInfo(){

    /* guideInfo
    * {"distributorId":"FX00000002","brand":"FOL","virtualShopCode":"FFFFFF","nameCn":"杨小伟","nameEn":"yangxiaowei","gender":1,"province":"北京","city":"北京市","district":"朝阳区","address":"光华路5号","phone":"18813068824","email":"chrisi@bestseller.com.cn","accountBank":"3","bankNumber":"2","level":1,"profitPercentage":0.5,"balance":0,"wxOpenid":"onV0v1k7G8ZYH3aZJjCVXVpskMJE","wxMiniOpenid":"olJQ95WuNfSV2Sl3DQmHVNkZrmuI","wxUnionid":"ozYoQs53Ni9hIaF0p8S3rVzX1PqQ","wxFaceImg":"","groupId":"","manager":"","idCard":"1","idCardFront":"/assets/db/SELECTED/image/12.jpg","idCardBack":"/assets/db/SELECTED/image/we.jpg","photo":"","saleQrCode":"","status":"valid","createTime":1595241919000,"createBy":"杨","updateTime":1595920236000,"updateBy":"bestseller","shopCode":"FFFFFF","employeeId":"FX00000002"}
    * */
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {employeeId = '', level = 1} = guideInfo;
    // if(!employeeId || !employeeId.startsWith('FX')){
    //   wx.redirectTo({ url: '../login/login' })
    //   return;
    // }
    let guideLevel = allLevel.filter(item => item.level === level);
    this.setData({wxInfo, guideInfo, guideLevel: guideLevel.length ? guideLevel[0] : allLevel[0]})
  },
  toolClick(e){
    const {index} = e.currentTarget.dataset;
    const {toolList} = this.data;
    const url = toolList[index].url;
    if(url){
      if(url === homePath){
        app.goBack();
      }else{
        app.navigateTo(url);
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})