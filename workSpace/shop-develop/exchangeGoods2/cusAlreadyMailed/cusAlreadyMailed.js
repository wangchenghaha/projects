import { getExOrderDetail, culcRemainingTime } from '../ex'
import { getOrderExpressInfo } from '../../service/order'
import { getShopInfo } from '../../service/shop';
import { DEBUG, auditTestBean, refundShopTestBean } from '../exCons'
var Utils = require('../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TIP_0: `如果商家确认收货，将会退款给你。
    如果商家拒绝收货，您可以修改退货物流信息或联系客服处理。
    如果商家逾期处理，系统将自动确认收获并退款给您。`,

    TIP_1: `如果您逾期未到预约门店办理退货，系统将自动默认退货失败。
    如有发票，请将发票一并寄回。
    如您不想到店退货，可选择邮寄退货。
    `

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //exOrderStatus === BUYER_MAILED
    let { exchangeCode } = options
    this.exchangeCode = exchangeCode
    let queryParam = {
      brandCode: getApp().config.brand,
      exchangeCode: exchangeCode,
    }

    if (DEBUG) {
      this._processDetail(refundShopTestBean)
      return
    }
    getExOrderDetail(queryParam)
      .then(res => {
        console.log(res)
        this._processDetail(res)
      })
      .catch(e => {
        console.log(e)
      })
  },

  _processDetail: function (res) {
    let total = parseFloat(res.applyTargetList[0].price).toFixed(2)
    let totalArr = total.toString().split(".")
    let int0 = totalArr[0]
    let decimalPart = totalArr[1]
    let expressInfo = "暂无"
    if (res.expressCompany && res.expressNo) {
      expressInfo = res.expressCompany.concat("(").concat(res.expressNo).concat(")")
    }
    let remainTimeArray = res.updateTime ? culcRemainingTime(res.updateTime) : []
    this.setData({
      exDetailBean: res,
      hasRefundShop: res.refundShop ? true : false,
      int0: int0,
      decimalPart: decimalPart,
      expressInfo: expressInfo,
      remainTimeArray: remainTimeArray,
    })
    if (res.refundShop) {
      getShopInfo(res.refundShop)
        .then(res => {
          this.setData({
            shopBean: res,
          })
        })
        .catch(e => {
          console.log(e)
        })
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


})