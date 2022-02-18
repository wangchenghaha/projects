// weMall/components/shareTempFooter/shareTempFooter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareUserText:String,
    shareSync: {
      type: Boolean,
      value: false,
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
    shareMoment(){
      this.triggerEvent('shareMoment', true);
    },
    shareUser(){
      this.triggerEvent('shareUser', true);
    }
  }
})
