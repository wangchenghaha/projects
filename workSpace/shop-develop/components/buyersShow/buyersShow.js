import {buyerShowImage, splitImg} from '../../utils/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pinglunData: Object,
    buyerShowData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath : `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/buyerShow/`,
    pinglunData: {},
    buyerShowData: {},
    userImage: '',
    userNickName: '',
    buyerShows: [],
  },

  ready: function(){
    let {pinglunData, buyerShowData} = this.properties;
    if(pinglunData.list[0]){
      this.setData({
        pinglunData: pinglunData,
        buyerShowData: buyerShowData,
        userImage: pinglunData.list[0].headimgurl? pinglunData.list[0].headimgurl: splitImg('evaluate _default_icon.png','common'),
        userNickName: pinglunData.list[0].nickname? pinglunData.list[0].nickname: '匿名用户',
      })
      this.getBuyerShows();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getBuyerShows(){
      let {buyerShowData ,buyerShows, pinglunData} = this.data;
      let buyerNum = 0;
      if(buyerShowData.list.length >= 4){
        buyerNum = 4
      } else {
        buyerNum = buyerShowData.list.length
      }
      if(buyerShowData.list[0].buyerShowImgs){
        for (let i = 0; i < buyerNum; i++) {
          buyerShows[i] = buyerShowImage(buyerShowData.list[i].buyerShowImgs, true)[0] 
        }
        pinglunData.list[0].evaluateImgs =  buyerShowImage(pinglunData.list[0].buyerShowImgs, true)
      }
      this.setData({
        buyerShows,
        pinglunData
      })      
    },


    onClick(e){
      let type = e.currentTarget.dataset.type
      this.triggerEvent('onClick',type)
    }
  }
})
