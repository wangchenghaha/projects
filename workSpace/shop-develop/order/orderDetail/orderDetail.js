import {splitImg, skuToImg, orderStatus, objToQuery, throttle, getDateByOrder} from '../../utils/utils'
import {wxShowToast, wxCopyText} from '../../utils/wxMethods'
import {orderDetail, orderCancel, confirmOrder} from '../../service/order'
import {URL_CDN, KEYSTORAGE, EVENTS} from '../../src/const'
import events from "../../src/events";
const app = getApp();
const {brand, cdn, ORDER_TOKEN} = app.config;
let curOptions = {};
const footerList = [{
    status: 'WaitingPay',
    text: '取消订单',
    type: 'cancel',
    orderType: 2
  },
  {
    status: 'WaitingPay',
    text: '立即支付',
    type: 'pay',
  },
  {
    status: 'WaitingReceive',
    text: '确认收货',
    type: 'confirmReceive',
    orderType: 1,
  },
  {
    status: 'WaitingShipment',
    text: '提醒发货',
    type: 'remind',
    orderType: 3,
  }
];
const REFUND_GOODS = 'refundGoods', CHANGE_GOODS = 'changeGoods';
const orderBtnList = [{
  status: 'WaitingReceive',
  text: '申请换货',
  type: CHANGE_GOODS,
  },
  {
    status: 'WaitingReceive',
    text: '申请退货',
    type: REFUND_GOODS,
  }];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    footer: [],
    orderBtnList,
    expressCar: splitImg('wattingReceiveCart.png', 'common'),
    noExpressCar: splitImg('wattingShipmentCart.png', 'common'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
  },
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      this.getOrderDetail()
    }
  },
  getOrderDetail(){
    const {id, orderToken = ORDER_TOKEN, bigorderCode = ''} = curOptions;
    const param = {
      bigorderCode,
      orderToken,
    };
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    orderDetail(param).then(res => {
      wx.hideLoading();
      // isHaveRefund : 0:无，1，有，2，全退
      if(res){
        const { goodsOrderList = [], status, expressPoList, isHaveRefund} = res;
        if(goodsOrderList.length){
          goodsOrderList.forEach(item => {
            const param = {
              sku: item.gcsSku,
              size: URL_CDN.IMGSIZE240400
            };
            item.goodsImg = cdn + skuToImg(param);
            // 物流
            if (expressPoList && expressPoList.length){
              expressPoList.forEach(expressItem => {
                if(expressItem.goodsOrderId === item.goodsId){
                  item.expressInfo = expressItem;
                }
              })
            }
          })
        }
        // 订单状态
        res.orderStatus = orderStatus(status);
        const isHaveRefundStr  = String(isHaveRefund);
        if(isHaveRefundStr === '1' || isHaveRefundStr === '2'){
          res.orderStatus += '(有退)'
        }
        let footer = footerList.filter(item => item.status === status);
        if(footer.length){

        }
        this.setData({orderDetail: res, footer});
      }
    }).catch(err => wxShowToast(err.message));
  },
  onClick(e){
    const {type} = e.currentTarget.dataset;
    switch (type) {
      case 'cancel':
        this.cancelOrderFn(e);
        break;
      case 'pay':
        this.payment();
        break;
      case 'express':
        this.goExpress(e);
        break;
      case REFUND_GOODS:
        this.refundGoods();
        break;
      case CHANGE_GOODS:
        this.goChangeGoods();
        break;
      case 'confirmReceive':
        this.confirmReceive();
        break;
    }
  },
  // 确认收货
  confirmReceive(){
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success(res){
        if(res.confirm){
          _this.confirmOrder();
        }
      }
    })
  },
  confirmOrder(){
    let {orderDetail, footer} = this.data;
    const {id = '', orderToken = ''} = orderDetail;
    confirmOrder(id, orderToken).then(res => {
      if(res){
        wxShowToast('确认收货成功');
        orderDetail.orderStatus = '交易成功';
        footer = [];
        this.setData({orderDetail, footer})
      }
    }).catch(err => wxShowToast(err.message));
  },
  refundGoods(){
    // isHaveRefund : 0:无，1，有，2，全退
    const {orderDetail} = this.data;
    try {
      app.tdSdkEvent('flow_purchase_order_pay_success_orderdetail_return_7aab', {
        ORDER_ID: dingdanCon.bigorderCode || '',
        ORDER_PAY: dingdanCon.payPrice || ''
      })
    }catch (e) {}
    if(orderDetail.isHaveRefund && orderDetail.isHaveRefund === '2'){
      wxShowToast('该笔订单已申请全部退款，不可再次退款')
    }else{
      wx.setStorageSync(KEYSTORAGE.orderInfo, orderDetail);
      wx.navigateTo({
        url: '../refundGoods/refundGoods'
      });
    }
  },
  goChangeGoods(){

  },
  goExpress(e){
    const {index} = e.currentTarget.dataset;
    const {orderDetail} = this.data;
    const {bigorderCode = ''} = orderDetail;
    const {expressInfo = {}} = orderDetail.goodsOrderList[index];
    if(expressInfo.expressOrderNo){
      wx.setStorageSync(KEYSTORAGE.expressInfo, Object.assign(expressInfo, {
        bigorderCode,
      }));
      wx.navigateTo({
        url: `/pages/lookDdAdress/lookDdAdress?dingdan_code=${expressInfo.expressOrderNo}`
      });
    }else{
      wxShowToast('暂无物流信息')
    }
  },
  payment(){
    const {id, bigorderCode, orderToken, payToken, payTokenTime, payPrice} = this.data.orderDetail;
    const payParam = {
      id,
      orderToken,
      payToken,
      payTokenTime,
      amountPaid: payPrice,
      bigOrderCode: bigorderCode,
    };
    wx.hideLoading();
    wx.navigateTo({
      url: `/pages/wxPay/wxPay${objToQuery(payParam)}`
    })
  },
  cancelOrder(e){
    const {id = '',orderToken = ORDER_TOKEN, payIntegral = ''} = this.data.orderDetail;
    const userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    if(!userInfo || !userInfo.phone){
      wx.showModal({
        title: '提示',
        content: '您还不是我们的会员，不能使用该功能',
        showCancel: false
      });
      return;
    }
    const param = {
      bigOrderId: id,
      orderToken: orderToken,
      payIntegral: payIntegral,
      phone: userInfo.phone,
    };
    orderCancel(param).then(res => {
      if(res){
        // 一分钱活动用
        wx.setStorageSync('aPennyReplace',true);
        this.getOrderDetail();
        wxShowToast('成功取消该订单');
        try{
          // 微信数据上报
          const orderInfo = {
            page_title: '微信支付',
            order: {
              order_id: id,
              order_time: getDateByOrder(res.bigOrderCode),
              order_status: 'cancel_give_order',
              cancel_time: Date.now(),
            }
          };
          app.WXReport('custom_order', orderInfo);
        }catch (e) { }
        events.post(true, EVENTS.EVENT_OREDERCOUNT);
      }
    }).catch(err => wxShowToast(err.message))
  },
  cancelOrderFn(){
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗？',
      success(res){
        if(res.confirm){
          _this.cancelOrder();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!app.checkLogin()){
      return;
    }
    this.getOrderDetail();
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