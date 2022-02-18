// components/popup/popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgColor: String
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
    closePopup(){
      this.triggerEvent('closePopup', false);
      console.log(false,'***')
    }
  }
})
