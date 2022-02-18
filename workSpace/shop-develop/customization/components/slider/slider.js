// pages/components/slider/slider.js
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
    top : 40,
    right : 50,
    width : 10,
    height : 228, //380 * 0.6
    value : 0

  },

  ready : function(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    end : function(e){
      this.triggerEvent('sliderEnd')
    },
    move:function(e){
      this.setData({value:e.detail.y})

      this.triggerEvent('sliderMove',parseFloat(e.detail.y.toFixed(0)))
    }
  }
})
