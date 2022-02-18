// weMall/components/guideAllMember/guideAllMember.js
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
    showScreen: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    screen(){
      this.setData({showScreen: true})
    },
    hideScreen(){
      this.setData({showScreen: false})
    }
  }
})
