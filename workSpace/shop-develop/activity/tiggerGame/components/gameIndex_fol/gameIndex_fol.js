/*
 * @Author: your name
 * @Date: 2020-07-02 11:03:42
 * @LastEditTime: 2020-07-03 11:19:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /VEROMODA/activity/tiggerGame/components/gameIndex_fol/gameIndex_fol.js
 */ 
// activity/tiggerGame/components/gameIndex_fol/gameIndex_fol.js
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
      "三个金币图案  ：获得2倍投币金额奖励；",
      "三个口罩图案：获得4倍投币金额奖励；",
      "三个数字6图案：获得6倍投币金额奖励；",
      "三个数字8图案：获得8倍投币金额奖励；",
      "三个黄金汤圆图案：获得16倍投币金额奖励；",
      "三个不同图案：未中奖",
    ],
    // 游戏说明
    youxiguize : [
      "首次进入游戏后，您将获得5000金币作为初始资金；",
      "设置好投币金额后，点击页面中央“抽奖”按钮即可开始游戏；",
      "每次游戏投币金额最低为2000金币，最高为10000金币，投币金额设定需为2000的倍数；",
      "当画面中央出现三个相同图案即为中奖；",
      "当金币不足2000时可以邀请朋友为你助力，可随机获得1000、2000、3000、5000金额不等的金币。"
    ],
    // 抽奖规则
    choujiangguize : [
      {pic1 : '2.png',pic2 : '2bei.png'},
      {pic1 : '4_tyg.png',pic2 : '4bei.png'},
      {pic1 : '6.png',pic2 : '6bei.png'},
      {pic1 : '8.png',pic2 : '8bei.png'},
      {pic1 : '16_tyg.png',pic2 : '16bei.png'}
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
    myPrize(){
      this.triggerEvent('myPrize')
    }
  }
})
