// pages/components/noCharged/index.js.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/redRain_charged/`
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
    img : `${imgPath}bigPrize.png`,
    bgAnimate : 'bouncedBgAnimation',
    animate : 'bouncedAnimation',
    yhqImg : ''

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setImgs(image,type){
      let img = this.data.img
      if (type === 3){
        img = `${imgPath}prize3.png`
      } else if (type === 6) { 
        img = `${imgPath}prize6.png`
      } else if (type === 10) { 
        img = `${imgPath}prize10.png`
      } else if (type === 13) { 
        img = `${imgPath}prize13.png`
      }
      this.setData({
        yhqImg : image,
        img
      })
    },
    closed(){
      let {bgAnimate,animate} = this.data
      bgAnimate = 'bouncedBgAnimation1'
      animate = 'bouncedAnimation1'
      this.setData({
        bgAnimate,
        animate
      })
      setTimeout(() => {
        this.triggerEvent('closed')
      }, 300);
    }
  }
})
