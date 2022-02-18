import {splitImg} from '../../../utils/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 大小
    size: {
      type: Number,
      value: 50
    },
    // 星数
    value:{
      type: Number,
      value: 5
    },
    // 是否可以点击
    disabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    starLight: splitImg('icon_star_light.png', 'common'),
    starHalf: splitImg('icon_star_half.png', 'common'),
    starDark: splitImg('icon-star_dark.png', 'common')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      const {disabled} = this.properties;
      // 不可点击
      if(disabled){
        return
      }
      const {index} = e.currentTarget.dataset;
      const value = index + 1;
      this.triggerEvent('changeValue', value);
      this.setData({ value })
    }
  }
})
