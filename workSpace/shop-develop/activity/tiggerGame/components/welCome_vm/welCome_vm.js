/*
 * @Author: your name
 * @Date: 2020-07-02 10:10:16
 * @LastEditTime: 2020-07-02 10:17:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /VEROMODA/activity/tiggerGame/components/welCome_vm/welCome_vm.js
 */ 
// activity/tiggerGame/components/welCome_vm/welCome_vm.js
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

    imagePath : `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/`,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(){
      this.triggerEvent('onClick')
    },
    guize(){
      this.triggerEvent('guize')
    }
  }
})
