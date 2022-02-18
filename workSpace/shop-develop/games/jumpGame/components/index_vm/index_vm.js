// activity/jumpGame/components/index_jj/index_jj.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indexImgBG : String,
    showTwoGame : Boolean,
    cssAnimateTime : Number,
    top : Number,
    datas : Array,
    imgPath : String,
    currentLeved : Number,
    currentIndex : Number,
    duration : Number,
    yunDatas : Array,
    life : Number,
    jinbiAnimate : String,
    currentNumber : Number,
    zongNumber : Number,
    imgWidth : Number,
    jumpTop : Number,
    transformY : Number,
    transformX : Number,
    currentImg : String,
    oneBounces : Boolean,
    fenshu : Number,
    chenghaoJson : Object,
    twoBounces : Boolean,
    icon : String
  },

  /**
   * 组件的初始数据
   */
  data: {
    indexImgBG : '',
    showTwoGame : false,
    cssAnimateTime : 0,
    top : 0,
    datas : [],
    imgPath : '',
    currentLeved : 0,
    currentIndex : 0,
    duration : 0,
    yunDatas : [],
    life : 0,
    jinbiAnimate : '',
    currentNumber : 0,
    zongNumber : 0,
    imgWidth : 0,
    jumpTop : 0,
    transformY : 0,
    transformX : 0,
    currentImg : '',
    oneBounces : false,
    fenshu : 0,
    chenghaoJson : {},
    twoBounces : false,
    icon : ''
  },
  ready(){
    this.setData({
      indexImgBG : this.properties.indexImgBG,
      showTwoGame : this.properties.showTwoGame,
      cssAnimateTime : this.properties.cssAnimateTime,
      top : this.properties.top,
      datas : this.properties.datas,
      imgPath : this.properties.imgPath,
      currentLeved : this.properties.currentLeved,
      currentIndex : this.properties.currentIndex,
      duration : this.properties.duration,
      yunDatas : this.properties.yunDatas,
      life : this.properties.life,
      jinbiAnimate : this.properties.jinbiAnimate,
      currentNumber : this.properties.currentNumber,
      zongNumber : this.properties.zongNumber,
      imgWidth : this.properties.imgWidth,
      jumpTop : this.properties.jumpTop,
      transformY : this.properties.transformY,
      transformX : this.properties.transformX,
      currentImg : this.properties.currentImg,
      oneBounces : this.properties.oneBounces,
      fenshu : this.properties.fenshu,
      chenghaoJson : this.properties.chenghaoJson,
      twoBounces : this.properties.twoBounces,
      icon : this.properties.icon
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getImgHeight(e){

      this.triggerEvent('getImgHeight',e.detail)
    },
    touchstart(e){
      this.triggerEvent('touchstart')
    },
    touchmove(e){
      this.triggerEvent('touchmove')
    },
    touchend(e){
      this.triggerEvent('touchend')
    },
    agin(){
      this.triggerEvent('agin')
    },
    backTap(){
      this.triggerEvent('backTap')
    }
  }
})
