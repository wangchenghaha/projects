import{getJLVoucherList, getVoucher} from '../../service/voucher.js';
import {KEYSTORAGE, URL_CDN} from '../../src/const.js'
var Util = require('../../utils/utils.js');   //网络请求，传参必用
import {wxShowToast} from '../../utils/wxMethods'
const app = getApp();
const voucherChannel = {
  T: '通用',
  P: '门店',
  MiniApp: '小程序'
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    isUsed: false,
    leftImage:URL_CDN.JLCOUPONBG,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getVoucherList();
  },
  openCard(e){
    const couponList = this.data.couponList;
    const dataIndex = e.currentTarget.dataset.index;
    const curCoupon = couponList[dataIndex];
    const couponInfo = {
      couponCode: curCoupon.voucherno,
      couponId: curCoupon.intergrationId
    };
    app.openVoucherCard(couponInfo);
  },
  // 优惠券new
  _getVoucherList: function(){
    let phone =wx.getStorageSync(KEYSTORAGE.crmInfo).phone;
    if(app.config.newCRM){
      // 新的查询优惠券
      wx.showLoading({
        title:'加载中'
      });
      getVoucher({phone}).then(res => {
        wx.hideLoading();
        this.handleVoucher(res)
      }).catch(err => wxShowToast(err.message));
      return;
    }
    getJLVoucherList(phone).then( res => {
      this.handleVoucher(res)
    }).catch(e => wxShowToast(e.message));
  },
  handleVoucher(voucherList){
    let list = [];
    voucherList.forEach(element => {
      list.push({
        voucherno: element.voucherno,
        intergrationId: element.intergrationId || element.promotioncode,
        amount: parseInt(element.amount || element.value),
        threshold: this.showThreshold(element.threshold),
        channel: voucherChannel[element.channel],
        startdate: Util.formatCRMDate(element.startdate, '.'),
        enddate: Util.formatCRMDate(element.enddate, '.'),
      })
    });
    this.setData({
      couponList: list,
    })
  },
  showThreshold: function(threshold){
    if(Number(threshold) === 0){
      return "无门槛使用";
    } else{
      return "满" + Number(threshold) + "可以使用"
    }
  },

  showChannel: function(channel){
    var web = '';
    var h5 = '';
    var stores = '';
    var general = '';
    if(channel.includes('General')){
      general = "通用"
    }
    if(channel.includes('Website')){
      web = "门店"
    }
    if(channel.includes('Stores')){
      stores = "网店"
    }
    if(channel.includes('H5')){
      h5 = "H5"
    }

    return general + " " + web + " " + stores + " " +h5;
  },

})