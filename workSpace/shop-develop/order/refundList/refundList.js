import {splitImg, skuToImg, orderStatus, throttle} from '../../utils/utils'
import {URL_CDN} from '../../src/const'
import {wxShowToast} from '../../utils/wxMethods'
import {refundList, submitWayBill} from '../../service/refund'
import {closeExOrder, getExchangeOrderList} from '../../service/order'
const app = getApp();
const {brand, cdn, isStoreOption} = app.config;
let isPullRefund = true, isPullExchange = true;
const REFUND_TYPE = 'refund', EXCHANGE_TYPE = 'exchange';
let curNavType = REFUND_TYPE;
Page({
  data: {
    logo: splitImg('logo-black-rect.png'),
    navList: [
      {
        active: true,
        text: '退货',
        type:REFUND_TYPE,
      },
      {
        text: '换货',
        type: EXCHANGE_TYPE
      }
    ],
    refundList: [],
    exchangeList: [],
    // 返回顶部
    showGoTop: false,
    // 没有订单
    noOrderImg: `${cdn}/assets/common/pub/image/order_empty.png`

  },
  onLoad(options) {
    this.getAllList()
  },
  getAllList(){
    const {refundList, exchangeList} = this.data;
    if(curNavType === REFUND_TYPE){
      if(!refundList.length){
        this.getRefundList();
      }
    }else if(curNavType === EXCHANGE_TYPE){
      if(!exchangeList.length){
        this.getExchangeOrderList();
      }
    }
  },
  // 换货参数
  exchangeParam:{
    currentPage: 1,
  },
  // 换货列表
  getExchangeOrderList(){
    const {currentPage} = this.exchangeParam;
    let param = {
      brandCode:brand,
      currentPage,
    };
    wx.showLoading({
      title:'加载中',
      mask: true
    });
    getExchangeOrderList(param).then(res => {
      wx.hideLoading()
      if(res){
        const {list = [], currPage = 1, totalPage = 1 } = res;
        isPullExchange = totalPage >= currentPage;
        if(list.length){
          list.forEach(item => {
            const {mainPicPath = ''} = item;
            if(mainPicPath && mainPicPath.includes('/')){
              const skuArr = mainPicPath.split('/');
              if(skuArr && skuArr.length){
                const sku = skuArr[skuArr.length - 2];
                item.goodsImg = cdn + skuToImg({
                  size: URL_CDN.IMGSIZE240400,
                  sku
                })
              }
            }
            // 是否显示取消换货
            const hideCancelArr = ['SHIPPED', 'CHECK_FAIL', 'COMPLETE', 'CLOSED'];
            item.showCancel = !hideCancelArr.includes(item.status);
            // 重置订单状态
            item.myStatus = item.status === 'CONFIRM_TYPE' ? '到店换货': orderStatus(item.status)
          });
          this.setData({
            exchangeList: list
          })
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  cancelExchange(e){
    const {index} = e.currentTarget.dataset;
    const {exchangeCode} = this.data.exchangeList[index];
    const _this =this;
    wx.showModal({
      title: '提示',
      content: '确认取消换货？',
      success(res){
        if(res.confirm){
          _this.closeExchange(exchangeCode)
        }
      }
    })
  },
  orderStatusNew(exchangeCode){
    wx.navigateTo({
      url: `/exchangeGoods/orderStatusNew/orderStatusNew?exchangeCode=${exchangeCode}`,
    });
  },
  closeExchange(exchangeCode){
    closeExOrder(exchangeCode).then(res => {
        wx.hideLoading();
       this.orderStatusNew(exchangeCode)
      }).catch(e => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: e.message,
          showCancel: false,
        })
      });
  },
  goDetail(e){
    const {code} = e.currentTarget.dataset;
    if(code){
      this.orderStatusNew(code);
    }
  },
  // 无实际意义，解决wxml的warning
  copy(){},
  // 退单列表
  refundListParam:{
    currentPage: 1
  },
  getRefundList(){
    let {currentPage} = this.refundListParam;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    refundList(currentPage).then(res => {
      wx.hideLoading();
      if(res){
        const {totalCount, totalPage = 1, list = []} = res;
        isPullRefund = totalPage >= currentPage;
        if(list.length){
          list.forEach(item => {
            const {refundGsOrderPoList = [], refundStatus} = item;
            // refundCategory 1.退货2.退款（已付款未发货）
            if(refundGsOrderPoList.length){
              // 根据自提只展示退款成功和退款中 2020-06-23
              let myOrderStatus = '退款中';
              if(refundStatus === 'RefundSuccess'){
                myOrderStatus = '退款成功'
              }else if(refundStatus === 'RefundClose'){
                myOrderStatus = '退款关闭'
              }else if(refundStatus === 'WaitingRefundGoods'){
                // 显示到店退
                if(isStoreOption){
                  item.showStoreRefund = true;
                }
              }
              item.myOrderStatus = myOrderStatus;
              // 是否显示更多
              item.showMore = item.refundGsOrderPoList.length > 1;
              refundGsOrderPoList.forEach(goodsItem => {
                goodsItem.goodsImg = cdn + skuToImg({
                  size: URL_CDN.IMGSIZE240400,
                  sku: goodsItem.sku
                })
              })
            }
          });
          let {refundList} = this.data;
          refundList = refundList.concat(list);
          this.setData({refundList})
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  // 切换tab
  changeNav(e){
    const {index} = e.currentTarget.dataset;
    const {navList} = this.data;
    navList.forEach((item, ind) => {
      if(index === ind){
        item.active = true;
        curNavType = item.type;
        this.getAllList()
      }else{
        item.active = false;
      }
    });
    this.setData({navList})
  },
  onPullDownRefresh(e){
    wx.stopPullDownRefresh();
    if(curNavType === REFUND_TYPE){
      this.refundListParam.currentPage = 1;
      isPullRefund = true;
      this.setData({refundList: []});
      this.getRefundList();
      return
    }
    if(curNavType === EXCHANGE_TYPE){
      this.exchangeParam.currentPage = 1;
      isPullExchange = true;
      this.setData({exchangeList: []});
      this.getExchangeOrderList();
    }

  },

  onReachBottom(){
    // 退货
    if(curNavType === REFUND_TYPE){
      if(isPullRefund){
        this.refundListParam.currentPage += 1;
        this.getRefundList()
      }else{
        wxShowToast('数据加载完成')
      }
      return
    }
    // 换货
    if (curNavType === EXCHANGE_TYPE){
      if(isPullExchange){
        this.exchangeParam.currentPage += 1;
        this.getExchangeOrderList()
      }else{
        wxShowToast('数据加载完成')
      }
    }

  },

  onPageScroll: function(e){
    if(throttle()){
      let scrollTop = e.scrollTop;
      let showGoTop = scrollTop > 500;
      this.setData({ showGoTop })
    }
  },
  goBack(){
    app.goBack();
  },
  goTop(){
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({ showGoTop: false })
  },
});