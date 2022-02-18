// weMall/components/redBookVideoAllGoods/redBookVideoAllGoods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: Array
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
    hideGoods(){
      this.triggerEvent('hideGoods', true)
    }
  }
})
