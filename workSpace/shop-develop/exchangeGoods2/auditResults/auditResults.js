import { getExOrderDetail, closeExOrder, culcRemainingTime } from '../ex'
import { DEBUG, auditTestBean, refundShopTestBean } from '../exCons'
import { getShopInfo } from '../../service/shop'
const URL_AUDITING = `https://cdn.bestseller.com.cn/assets/common/pub/image/icon_auditing.png`
const URL_AUDIT_FAIL = `https://cdn.bestseller.com.cn/assets/common/pub/image/icon_audit_fail.png`
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonStr: '暂无',
    flagSuccess: false,
    imgUrl: URL_AUDITING,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let exchangeCode = options.exchangeCode
    this.exchangeCode = exchangeCode
    console.log(">>>>>>>>>>>>> onLoad   exchangeCode = " + exchangeCode);
    let queryParam = {
      brandCode: getApp().config.brand,
      exchangeCode: exchangeCode,
    }

    if (DEBUG) {
      setTimeout(() => {
        this._setOrderBean(refundShopTestBean)
      }, 1500)
      return
    }

    getExOrderDetail(queryParam)
      .then(exOrderBean => {
        var bean = exOrderBean
        this._setOrderBean(bean)
      })
      .catch(e => {
        wx.showToast({
          title: `${e.message}`,
        })
      });



  },

  _setOrderBean: function (exOrderBean) {
    let remainTimeArray = exOrderBean.updateTime ? culcRemainingTime(exOrderBean.updateTime) : []
    this.setData({
      flagSuccess: true,
      exOrderBean: exOrderBean,
      imgUrl: exOrderBean.status == 'CHECK_FAIL' ? URL_AUDIT_FAIL : URL_AUDITING,
      remainTimeArray: remainTimeArray,
    });

    if (exOrderBean.refundShop || exOrderBean.applyShop) {
      //todo:到店换货
      getShopInfo(exOrderBean.refundShop || exOrderBean.applyShop)
        .then(res => {
          this.setData({
            shopBean: res,
          });
        })
        .catch(e => {
          wx.showToast({
            title: `${e.message}`,
          })
        });
    }
  },

})