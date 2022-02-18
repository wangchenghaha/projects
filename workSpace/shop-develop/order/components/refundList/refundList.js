// order/components/refundList/refundList.js
import {objToQuery} from "../../../utils/utils";
const app = getApp();
const {ORDER_TOKEN, isStoreOption} =app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 是否到店退
    isStoreOption
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showMore(e){
      const {index} = e.currentTarget.dataset;
      const {list} = this.properties;
      list.forEach((item, ind) => {
        if(index === ind){
          item.showMore = !item.showMore
        }
      });
      this.setData({list})
    },
    goRefundDetail(e){
      const {refund} = e.currentTarget.dataset;
      const param = {
        refundOrderCode: refund,
      };
      wx.navigateTo({
        url: `../refundDetail/refundDetail${objToQuery(param)}`
      })
    },
    storeRefund(e){
      const {index} = e.currentTarget.dataset;
      const curOrderItem = this.properties.list[index];
      const {refundSkus = [], refundCode, oriorderCode, address} = curOrderItem;
      wx.setStorageSync('allToDingdan', curOrderItem);
      wx.setStorageSync('isTuihuo', true);
      wx.setStorageSync('tuikuanCode', '');

      wx.setStorageSync('oriordercode', oriorderCode);
      wx.setStorageSync('address', address);
      wx.setStorageSync('refundskus', refundSkus[0]);
      wx.setStorageSync('refundcode', refundCode);
      wx.navigateTo({
        url: '/pages/returned/returned'
      })
    }
  }
})
