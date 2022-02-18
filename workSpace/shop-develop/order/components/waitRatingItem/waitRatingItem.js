// order/components/ratingItem/ratingItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderList: {
      type: Array,
      value: []
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
    showMore(e){
      const {index, row} = e.currentTarget.dataset;
      this.triggerEvent('showMore', {index, row})
    }
  }
})
