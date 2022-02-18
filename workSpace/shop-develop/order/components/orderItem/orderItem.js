// order/components/orderItem/orderItem.js
import {skuToImg} from '../../../utils/utils'
import {URL_CDN} from '../../../src/const'
const app = getApp();
const {cdn, brand, } = app.config;

Component({
  options: {
    multipleSlots: true, // 使用多个插槽
  },
  /**
   * 组件的属性列表
   */
  properties: {
      order: Object,
  },
  lifetimes:{
    attached: function () {
      // this.handleOrder()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleOrder(){
      console.log(this.properties.order,'***');
      const order = this.properties;
      if(!order.goodsImg){
        order.goodsImg = cdn + skuToImg({
          sku: order.sku,
          size:URL_CDN.IMGSIZE240400
        })
      }
      this.setProperty({
        order
      })
    }
  }
})
