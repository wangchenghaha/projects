// components/authorize/authorize.js
const app = getApp();
const brand = app.config.brand;
const cdn = app.config.cdn;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    brand,
    bannerImg: `${cdn}/assets/common/${brand}/image/authorize_banner.jpg`
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
});
