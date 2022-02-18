/*
 * @Author: your name
 * @Date: 2020-07-03 18:23:22
 * @LastEditTime: 2020-07-03 19:07:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /VEROMODA/activity/tiggerGame/components/helpView_vm/helpView_vm.js
 */ 
// activity/tiggerGame/components/helpView_vm/helpView_vm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canShow : Boolean,
    fridendData : Object,
    zhuliArrs : Array,
    points : String,
    canClose : Boolean,
    zhuliAnimationData : Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imagePath : `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/`,
    canShow : false,
    fridendData : {},
    zhuliArrs : [],
    points : '',
    canClose : false,
    zhuliAnimationData : {}
  },
  ready(){
    this.setData({
      canShow : this.properties.canShow,
      fridendData : this.properties.fridendData,
      zhuliArrs : this.properties.zhuliArrs,
      points : this.properties.points,
      canClose : this.properties.canClose,
      zhuliAnimationData : this.properties.zhuliAnimationData
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bottomTap(e){
      
      let type = e.currentTarget.id
      this.triggerEvent('bottomTap',type)
    },
    bouncedTap(){
      this.triggerEvent('bouncedTap')
      
    }
  }
})
