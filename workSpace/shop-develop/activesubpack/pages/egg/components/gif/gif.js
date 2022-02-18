// activesubpack/pages/egg/components/gif/gif.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gifConfig: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    imgUrl: '',
  },

  observers: {
    gifConfig(newVal){
      let { isShow, imgUrl } = newVal
      this.setData({
        isShow, imgUrl
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
