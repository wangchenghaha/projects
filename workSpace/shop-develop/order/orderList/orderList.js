import {splitImg, skuToImg, orderStatus, objToQuery, throttle} from '../../utils/utils'
import {wxShowToast, wxCopyText} from '../../utils/wxMethods'
import {barcode}  from '../../utils/wxbarcode.js';
import {getOrderList, orderDetail, remindExpress, confirmOrder} from '../../service/order'
import {URL_CDN} from '../../src/const'
import {payment, wxRequestPayment} from "../../service/pay";

const app = getApp();
const {brand, cdn, ORDER_TOKEN} = app.config;
let isPull = true;
const btnList = [
  {
    className: 'pay',
    status: 'WaitingPay',
    text: '立即支付',
  },
  {
    className: 'remind',
    status: 'WaitingShipment',
    text: '提醒发货',
  },
  {
    className: 'refund',
    status: 'TransactionSuccess',
    text: '退货/售后'
  }
];
let requestTime = Date.now();
const nextRequest = 2000;
Page({
  data: {
    brandLogo: splitImg('logo-black-rect.png'),
    orderImg: splitImg('order_empty.png', 'pub'),
    orderList: [],
    status: '',
    pickup: {
      show: false,
      bigorderCode: '',
      checkcode: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {status = 'WaitingShipment'} = options;
    this.listParam.status = status;
    this.setData({status});
    this.getOrderList();
  },
  onClick(e) {
    const {type} = e.currentTarget.dataset;
    switch (type) {
      case 'pay':
        this.payment(e);
        break;
      case 'goBack':
        app.goBack();
        break;
      case 'goOrderDetail':
        this.goOrderDetailFn(e);
        break;
      case 'remind':
        this.remindDeliverGoods(e);
        break;
      case 'voucher':
        this.openPickup(e);
        break;
    }
  },
  changePickup(status){
    this.setData({'pickup.show': !status})
  },
  // 打开提货码
  openPickup(e){
    const {index} = e.currentTarget.dataset;
    const {bigorderCode, checkcode = ''} = this.data.orderList[index];
    const {pickup} = this.data;
    Object.assign(pickup, {
      bigorderCode, checkcode
    });
    barcode('orderCode', bigorderCode, 500, 100);
    barcode('checkCode', checkcode, 500, 100);
    this.setData({pickup});
    this.changePickup();
  },
  goOrderDetailFn(e) {
    const {index} = e.currentTarget.dataset;
    const {id, orderToken = ORDER_TOKEN, bigorderCode} = this.data.orderList[index];
    const param = {
      bigorderCode, orderToken
    };
    wx.navigateTo({
      url: `../orderDetail/orderDetail${objToQuery(param)}`
    })
  },
  remindDeliverGoods(e) {
    const {orderList} = this.data;
    const {index} = e.currentTarget.dataset;
    const {id = '', warning = '', orderToken = ORDER_TOKEN, bigorderCode, payPrice, createTime} = orderList[index];
    try {
      app.tdSdkEvent('flow_purchase_order_pay_success_orderdetail_shipreminder_7aaa', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      })
    } catch (e) { }
    if (warning === "N") {
      this.curOrderConfirm(index, 3);
    } else {
      this.remindNotice(createTime);
    }
  },
  // 催单图片展示
  remindNotice() {

  },
  /**
   *
   * @param index 订单索引
   * @param type 类型 1:确认,2:取消,3:提醒发货
   */
  curOrderConfirm(index, type){
    const {orderList} = this.data;
    const curOrderItem = orderList[index];
    const {id = '', warning = '', orderToken = ORDER_TOKEN, bigorderCode='', payPrice, createTime} = curOrderItem;
    const param = { orderToken, bigorderCode, type };
    const titleArr = ['确认收货成功', '取消成功','提醒成功'];
    confirmOrder(param).then(res => {
      wxShowToast(titleArr[type - 1]);
      switch (type) {
        case 1:
          console.log(type);
          break;
        case 3:
          // 提醒发货
          curOrderItem.warning = 'Y';
          curOrderItem.btnList.forEach(item => {
            if(item.status === 'WaitingShipment'){
              item.text = '已提醒发货'
            }
          });
          break;
      }
      orderList.splice(index, 1, curOrderItem);
      this.setData({orderList})
    }).catch(err => wxShowToast(err.message));
  },
  payment(e) {
    const {orderList} = this.data;
    const {index} = e.currentTarget.dataset;
    const {id = '', orderToken = ORDER_TOKEN, payPrice = '', payToken = '', payTokenTime = '', bigorderCode = ''} = orderList[index];
    const paramString = {orderToken, bigorderCode, id};
    const payParam = {
      bigorderCode,
      payToken,
      payTokenTime,
    };
    try {
      app.tdSdkEvent('flow_purchase_order_paynow_4', {
        ORDER_ID: bigorderCode || '',
        ORDER_PAY: payPrice || ''
      })
    }catch (e) {}
    wx.showLoading({
      title: '加载中...',
    });
    payment(payParam).then(res => {
      wx.hideLoading();
      if(res){
        wxRequestPayment(res).then(payRes => {
          if(payRes){
            wx.navigateTo({
              url: '/pages/wxPayCon/wxPayCon' + objToQuery(paramString)
            });
          }
        });
      }
    }).catch(err => wxShowToast(err.message))
  },
  // 切换导航
  onChangeNav(e) {
    const curNav = e.detail;
    const param = {
      status: curNav,
      currentPage: 1,
    };
    Object.assign(this.listParam, param);
    if (curNav === 'refund') {
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    isPull = true;
    const diffTime = Date.now() - requestTime;
    const timeout = diffTime > nextRequest ? 0 : nextRequest - diffTime;
    let time = setTimeout(_ => {
      clearInterval(time);
      this.getOrderList(true);
    }, timeout)
  },
  // 列表请求参数
  listParam: {
    currentPage: 1,
    status: ''
  },
  /**
   *
   * @param isNull 是否清空list
   */
  getOrderList(isNull) {
    let param = this.listParam;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    getOrderList(param).then(res => {
      wx.hideLoading();
      requestTime = Date.now();
      const {list = [], totalPage} = res;
      let {orderList} = this.data;
      if (res.totalPage === this.listParam.currentPage) {
        isPull = false;
      }
      if (list.length) {
        list.forEach(item => {
          let goodsItem = item.goodsOrderList[0];
          goodsItem.goodsImg = cdn + skuToImg({
            size: URL_CDN.IMGSIZE240400,
            sku: goodsItem.gcsSku,
          });
          item.goodsItem = goodsItem;
          const status = item.status;
          item.orderStatus = orderStatus(status);
          // 显示按钮
          item.btnList = JSON.parse(JSON.stringify(btnList.filter(btnItem => btnItem.status === status)));
          if(item.btnList.length){
            item.btnList.forEach(btnItem => {
              if(btnItem.status === 'WaitingShipment' && item.warning === 'Y'){
                btnItem.text = '已提醒发货'
              }
            })
          }
        });
        orderList = isNull ? list : orderList.concat(list);
        this.setData({
          orderList
        })
      }


    }).catch(err => wxShowToast(err.message))
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
    let {currentPage} = this.listParam;
    if (isPull) {
      this.listParam.currentPage = currentPage + 1;
      this.getOrderList();
    } else {
      wxShowToast('数据加载完成');
    }

  },

})