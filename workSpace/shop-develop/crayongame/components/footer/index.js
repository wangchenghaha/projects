import Utils from '../../common/utils/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    needAnimate: {
      type: Boolean,
      value: false
    },
    preload: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isBigPhone: Utils.judgeBigScreen()
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
