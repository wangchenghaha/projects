import { wxShowToast } from '../../utils/wxMethods'
import {perOrderCancal, preSaleOrderSave} from '../../service/order'
import {timeStamp ,formatPreTimer, objToQuery} from '../../utils/utils'
import {	KEYSTORAGE } from '../../src/const.js'
const app = getApp();
const CDN = app.config.cdn;



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderItem: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    deposit: '',
    balance: '',
    orderNums: "1234567890",
    orderStatus: '待支付',
    timerShow: '',
    depPrice:  "定金待支付：  ￥50",
    lastPrice: '尾款待支付：  ￥50',
    depPay: '支付定金',
    lastPay: '支付尾款',
    goodPic: 'https://cdn.bestseller.com.cn/goodsImagePC/JACKJONES/220121527/220121527E39/7201280/220121527E39_p3.jpg',
    goodsName: '【预售】衣服衣服衣服衣服衣服衣服',
    goodsColor: '蓝色',
    goodsSize: '160/84A/M',
    goodsPrice: '500',
    isdepStage: false,// 是否是支付过定金
    isLastPayStage: false, // 是否是支付尾款阶段
    isShowLastPayTime: false,
    // 订单参数
    orderSaveParam: {
      presellFlag: 2,
      channelId: 1,
      channelCode: app.config.channel,
      realSellPrice: '',
      payPrice: '',
      goodsTotalCount: '',
      gscPicmianId: "",
      picUrl: "",
      province: "",
      city: "",
      area: "",
      detailAddress: "",
      contactTel: "",
      consignee: "",
      goodsOrderList: [{
        colorName: "",
        gcsSku: "",
        goodsName: "",
        goodsCount: 0,
        goodsColorCode: "",
        gscolPicPath: "",
        originalPrice: '',
        sizeName: "",
        price: '',
        isGift: "N"
      }],
      bigOrderAppendix: {"targetUrl": "", "utmCampaign": "", "utmMedium": "", "utmSource": "", "utmTerm": ""},
      crmId: "",
      utmWxScene: '',
      expressFare: 0,
      unionid: wx.getStorageSync(KEYSTORAGE.unionid),
      customerNickname: "",
      customerFaceImg: "",
      latitude: "",
      longitude: "",
      phone: "",
      openId: "",
      bookActivityId: "",
      balancePayment: '',
      presellDeadline: "",
    },
  },



  ready: function(){
    let orderInfo = this.properties.orderItem;
    let deposit = orderInfo.deposit; // 定金信息
    let balance = orderInfo.balance; // 尾款信息
    let goodsInfo = deposit.goodsOrderList[0];
    let orderStatus = this.preOrderStatus(deposit.status, balance.status, deposit.presellDeadline);
    this.setData({
      deposit,
      balance,
      orderNums: deposit.bigorderCode, // 总订单号按定金订单号为主
      orderStatus: orderStatus,
      goodPic: CDN + goodsInfo.gscolPicPath,
      goodsName: goodsInfo.goodsName,
      goodsColor: goodsInfo.colorName,
      goodsSize: goodsInfo.sizeName,
      goodsPrice: deposit.payPrice + balance.payPrice,
      lastPrice: "尾款待支付：   ￥" + balance.payPrice,
      depPrice: orderStatus === '待付定金' ? '定金待支付：   ￥' + deposit.payPrice : '定金已支付：   ￥' + deposit.payPrice,
      isdepStage:  orderStatus === '待付定金' ? true : false,
      isLastPayStage: orderStatus === '待付尾款' ? true : false,
      isShowLastPayTime: orderStatus != '待付定金' ? true : false,
      timerShow: formatPreTimer(balance.balanceStartTime, balance.balanceEndTime),
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

     

    // 取消订单
    cancleBtn: function(){
      let orderId = this.data.deposit.id;
      perOrderCancal(orderId).then(res => {
        wx.showToast({
          title:'已取消！'
        })
        this.triggerEvent('refreOrderList', orderId);
      })
    },

    // 支付定金
    depPayBtn: function(){
      this.payOrder(this.data.deposit);
    },

    // 支付尾款
    lastPayBtn: function(){
      this.lastPay();
      // if(this.data.isLastPayStage){
      //   lastPay();
      // } else {
      //   wx.showModal({
      //     title: "提示",
      //     content: '亲！还未到支付尾款时间，请耐心等待。',
      //     showCancel: false,
      //   })
      // }
    },

    goOrderDetail: function(){
      let bigOrderCode = this.data.deposit.bigorderCode;
      wx.navigateTo({
        url: '/activity/advance/orderDetail/orderDetail?bigOrderCode='+ bigOrderCode,
      })
    },

    copyOrderNum: function(e){
      let text = e.currentTarget.dataset.text;
      wx.setClipboardData({
        data: text,
        success:res=>{
          wxShowToast('复制成功！')
        }
      })
    },

    preOrderStatus: function(depositStatus, balanceStatus, presellDeadline){
      let status = '';
      console.log("presellDeadline =======",presellDeadline);
      var preDeadTime = timeStamp(presellDeadline);
      let times = Date.parse(new Date());  
      times = times / 1000; 
      if(depositStatus === 'WaitingPay' && balanceStatus === 'WaitingPay' && times < preDeadTime){
        status = '待付定金'
      } else if(depositStatus === 'AlreadyPay' && balanceStatus === 'WaitingPay' && times < preDeadTime){
        status = '已付定金'
      } else if(depositStatus === 'AlreadyPay' && balanceStatus === 'WaitingPay' && times > preDeadTime){
        status = '待付尾款'
      }
      return status;
    },

    lastPay(){
      let orderInfo = this.data.deposit;
      
      let orderSaveParam = this.data.orderSaveParam;
      for(let key in orderSaveParam){
        orderSaveParam[key] = orderSaveParam[key] || orderInfo[key];
        if(key === 'bigOrderAppendix'){
          // UTM参数
          const utmObj = orderSaveParam[key]
          for(let utmKey in utmObj){
            utmObj[utmKey] =  orderInfo[utmKey]
          }
        }else if(key === 'goodsOrderList'){
          const goodsOrderList = orderSaveParam[key];
          const goodsKey = goodsOrderList[0];
          console.log(goodsKey,'***')
          // 商品信息
          orderSaveParam[key] = []
          orderInfo[key].forEach(item => {
            const goodsItem = {};
            for(let goods in goodsKey){
              goodsItem[goods] = item[goods];
            }
            orderSaveParam[key].push(goodsItem)
          })
        }
      }
      const balance = this.data.balance;
      let {payPrice, realSellPrice, bigorderCode, status} = balance;
      Object.assign(orderSaveParam, {payPrice, realSellPrice, bigorderCode, status});
      wx.showLoading({
        title: '提交中...'
      });
      preSaleOrderSave(orderSaveParam).then(res => {
        wx.hideLoading();
        if(res){
          this.payOrder(res, 'lastPay');
        }
      }).catch(err => wxShowToast(err.message))
    },

    // 支付
    payOrder(payOrderInfo, orderType) {
      let queryString = {
        amountPaid: payOrderInfo.payPrice,
        bigorderCode: payOrderInfo.bigorderCode,
        orderType: 'preSale'
      };
      wx.navigateTo({
        url: `../../../pages/wxPay/wxPay${objToQuery(queryString)}`
      });
    },
  }
})
