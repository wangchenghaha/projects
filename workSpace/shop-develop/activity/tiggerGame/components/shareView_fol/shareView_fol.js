/*
 * @Author: your name
 * @Date: 2020-07-03 15:03:58
 * @LastEditTime: 2020-07-03 19:23:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /VEROMODA/activity/tiggerGame/components/shareView_vm/shareView_vm.js
 */ 
// activity/tiggerGame/components/shareView_vm/shareView_vm.js
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
    imagePath : `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/`

  },
  ready(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    shareImage(){
      this.triggerEvent('shareImage')
    },
    backView(){
      this.triggerEvent('backView')
    },
    guize(){
      this.triggerEvent('guize')
    }
  }
})
