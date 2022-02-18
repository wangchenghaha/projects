// activity/components/wishGoodsList/wishGoodsList.js
import {KEYSTORAGE, URL_CDN} from "../../../src/const";
import {skuToImg, orderStatus} from "../../../utils/utils";
import {wxCopyText} from '../../../utils/wxMethods'
const app = getApp();
const {brand, cdn} = app.config;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recevieList: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    donorImg: "",
    
  },
  lifetimes:{
    ready(){
      const {recevieList} = this.properties;
      this.setData({recevieList})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 复制订单号
    copyText(e) {
      const {orderid} = e.currentTarget.dataset;
      wxCopyText(orderid);
    },
    queryExpress(e) {
      const { index } = e.currentTarget.dataset;
      const curOrder = this.properties.recevieList[index];
      const {bigorderCode = '', expressCompany = '', expressNo = ''} = curOrder;
      if(bigorderCode && bigorderCode !== 'None' &&
        expressCompany && expressCompany !== 'None' &&
        expressNo && expressNo !== 'None'
      ){
        wx.setStorageSync(KEYSTORAGE.expressInfo, {
          expressOrderNo: expressNo,
          expressCompany
        })
        wx.navigateTo({
          url: `/pages/lookDdAdress/lookDdAdress?dingdan_code=${bigorderCode}`
        });
      }

    },
  }
})
