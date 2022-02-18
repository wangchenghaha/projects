// pages/components/prize/index.js.js
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
    img : `${imgPath}myPrize.png`,
    yhqImgs : [],
    bgAnimate : 'bouncedBgAnimation',
    animate : 'animate'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setImgs(imgs){
      this.setData({
        yhqImgs : imgs
      })
    },
    closed(){
      let {bgAnimate,animate} = this.data
      bgAnimate = 'bouncedBgAnimation1'
      animate = 'animate1'
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
