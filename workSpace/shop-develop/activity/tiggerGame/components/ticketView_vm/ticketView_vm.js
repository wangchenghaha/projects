/*
 * @Author: your name
 * @Date: 2020-07-03 16:56:40
 * @LastEditTime: 2020-07-03 17:41:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings EditBo
 * @FilePath: /VEROMODA/activity/tiggerGame/components/ticketView_vm/ticketView_vm.js
 */ 
// activity/tiggerGame/components/ticketView_vm/ticketView_vm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canShow : Boolean,
    myNumber : Number,
    prizeDatas : Array,
    jiluDatas : Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    imagePath : `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/`,
    canShow : false,
    myNumber : 0,
    prizeDatas : [],
    jiluDatas : []
  },
  ready(){
    this.setData({
      canShow : this.properties.canShow,
      myNumber : this.properties.myNumber,
      prizeDatas : this.properties.prizeDatas,
      jiluDatas : this.properties.jiluDatas,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    duijiangTap(){
      this.triggerEvent('duijiangTap')
    },
    share(){
      this.triggerEvent('share')
    },
    duihuan(e){

      let detail = e.currentTarget.dataset.detail
      this.triggerEvent('duihuan',detail)
    },
    backView(){
      this.triggerEvent('backView')
    },
    closed(){
      this.triggerEvent('closed')
    }
  }
})
