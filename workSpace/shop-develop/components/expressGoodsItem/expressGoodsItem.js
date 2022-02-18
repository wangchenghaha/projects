const app = getApp();
const CDN = app.config.cdn;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageCDN: CDN,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoDetail:function(){
      let sku = this.properties.goodsInfo.gcsSku;
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${sku}`
      });
    },
  }
})
