// order/components/ratingItem/ratingItem.js
import {objToQuery} from "../../../utils/utils";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 订单号
    orderCode: String,
    // 商品信息
    goodsItem: {
      type: Object,
      value: {}
    },
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
    prevImg(e){
      const {goodsItem} = this.properties;
      const {url} = e.currentTarget.dataset;
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: goodsItem.showImgList // 需要预览的图片http链接列表
      })
    },
    evaluate(e){
      const {goodsItem, orderCode} = this.properties;
      const {gcsSku, goodsName = '', colorName = '', sizeName = '', goodsId = ''} = goodsItem;
      const queryString = objToQuery({gcsSku, goodsName, colorName, sizeName, bigorderCode: orderCode, goodsId});
      wx.navigateTo({
        url: `/order/buyerShow/evaluate/evaluate${queryString}`
      });
    }
  }
})
