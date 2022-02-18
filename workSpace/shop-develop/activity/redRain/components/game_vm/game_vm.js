// activity/redRain/components/game_fol/game_fol.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath : String,
    datas : Array,
    yudianDatas : Array,
    jifenNum : Number,
    bouncedAnimate : String,
    bouncedText : Number,
    bouncedImg : String,
    animationPlayState : String,
    gameDownNum : Number,
    gameDownNumSlider : Number,
    jinbiOffset : Object,
    endGame : Boolean,
    canPlayNum : Number,
    canBaozha : Boolean,
    showTwoBounced : Boolean

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath : '',
    datas : [],
    yudianDatas : [],
    jifenNum : 0,
    bouncedAnimate : '',
    bouncedText : 0,
    bouncedImg : '',
    animationPlayState : '',
    gameDownNum : 0,
    gameDownNumSlider : 0,
    jinbiOffset : {},
    endGame : false,
    canPlayNum : 0,
    canBaozha : false,
    showTwoBounced : false
  },
  ready(){
    this.setData({
      imgPath : this.properties.imgPath,
      datas : this.properties.datas,
      yudianDatas : this.properties.yudianDatas,
      jifenNum : this.properties.jifenNum,
      bouncedAnimate : this.properties.bouncedAnimate,
      bouncedText : this.properties.bouncedText,
      bouncedImg : this.properties.bouncedImg,
      animationPlayState : this.properties.animationPlayState,
      gameDownNum : this.properties.gameDownNum,
      gameDownNumSlider : this.properties.gameDownNumSlider,
      jinbiOffset : this.properties.jinbiOffset,
      endGame : this.properties.endGame,
      canPlayNum : this.properties.canPlayNum,
      canBaozha : this.properties.canBaozha,
      showTwoBounced : this.properties.showTwoBounced
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapss(e){
      // console.log(`aaaaaaaaaaaa:${JSON.stringify(e)}`)
      let id = e.currentTarget.dataset.id
      let jifen = e.currentTarget.dataset.jifen
      let pageX = e.touches[0].pageX
      let pageY = e.touches[0].pageY
      let detail = {
        id,
        jifen,
        pageX,
        pageY
      }
      
      this.triggerEvent('tapss',detail)
    },
    bottomTap(){this.triggerEvent('bottomTap')},
    oneClosed(){this.triggerEvent('oneClosed')},
    closed(){this.triggerEvent('closed')},
    twoClosed(){this.triggerEvent('twoClosed')},
    backTap(){this.triggerEvent('backTap')}
  }
})
