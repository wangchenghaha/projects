/*
 * @Author: your name
 * @Date: 2020-07-02 11:03:42
 * @LastEditTime: 2020-07-02 19:38:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /VEROMODA/activity/tiggerGame/components/gameIndex_vm/gameIndex_vm.js
 */ 
// activity/tiggerGame/components/gameIndex_vm/gameIndex_vm.js
import {splitImg } from '../../../../utils/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colors : Array,
    myNumber : Number,
    animationViewHeightPX : Number,
    number : Number,
    canShow : Boolean,
    bouncedStatues : Object,
    activityTimeJson : Object,
    myPrize : Boolean,
    paihangData : Array,
    jiluDatas : Array,
    tiggersData : Object

  },

  /**
   * 组件的初始数据
   */
  data: {
    imagePath : `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/`,
    colors : [],
    myNumber : 0,
    fixedRightArr: [
      {
        type: 'home',
        img: splitImg('icon_home.png', 'common'),
        isShow: true,
      }
    ],
    animationViewHeightPX : 0,
    number : 0,
    canShow : false,
    bouncedStatues : {},
    activityTimeJson : {},
    myPrize : false,
    paihangData : [],
    jiluDatas : [],
    tiggersData : {},
    // 中奖规则
    zhongjiangguize : [
      "",
      "三个苹果图案：获得1倍投币金额奖励；",
      "三个神灯图案：获得2倍投币金额奖励；",
      "三个水晶鞋图案：获得3倍投币金额奖励；",
      "三个皇冠图案：获得4倍投币金额奖励；",
      "三个不同图案：未中奖",
    ],
    // 游戏说明
    youxiguize : [
      "用户首次进入游戏后，可获得600筹码作为初始资金",
      "设置好投币金额后，点击页面中央“抽奖”按钮即可开始游戏；",
      "每次游戏投币金额最低为200筹码，最高为600筹码，投币金额设定100筹码；",
      "当画面中央出现三个相同图案即为中奖；",
      "当筹码不足200时可以邀请朋友为你助力，可随机获得50、200、300、400金额不等的筹码。"
    ]
  },
  ready(){
    this.setData({
      colors : this.properties.colors,
      myNumber : this.properties.myNumber,
      animationViewHeightPX : this.properties.animationViewHeightPX,
      number : this.properties.number,
      bouncedStatues : this.properties.bouncedStatues,
      activityTimeJson : this.properties.activityTimeJson,
      paihangData : this.properties.paihangData,
      jiluDatas : this.properties.jiluDatas,
      tiggersData : this.properties.tiggersData
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    searCh(){
      this.triggerEvent('searCh')
    },
    guize(){
      this.triggerEvent('guize')
    },
    duihuan(){
      this.triggerEvent('duihuan')
    },
    goHome(){
      this.triggerEvent('goHome')
    },
    share(){
      this.triggerEvent('share')
    },
    onClick(e){

      let type = e.currentTarget.id
      this.triggerEvent('onClick',type)

    },
    bouncedTap(){
      this.triggerEvent('bouncedTap')
    },
    replaceStatus(){
      this.triggerEvent('replaceStatus')
    },
    closed(){
      this.triggerEvent('closed')
    },
  }
})
