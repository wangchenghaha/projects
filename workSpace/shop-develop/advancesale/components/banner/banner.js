//轮播图组建
let nowtime = new Date().getTime()
console.log('nowtime---->',nowtime)
Component({
  options: {
  },
  properties: {
    type : {
      type : Number,
      value : 1
    }
  },
  data: {
    imgUrls: [
      `https://tc.woaap.com/lingzhi/sale/banner1.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner2.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner3.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner4.jpg?nowtime=${nowtime}`
    ],
    imgUrls2: [
      `https://tc.woaap.com/lingzhi/sale/banner-bot.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner-bot1.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner-bot2.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner-bot3.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner-bot4.jpg?nowtime=${nowtime}`,
      `https://tc.woaap.com/lingzhi/sale/banner-bot5.jpg?nowtime=${nowtime}`
    ],
    loadCount1 : 0,
    loadCount2 : 0,
    currentIndex : 0
  },
  attached() {
    console.log(this.data.type)
  },
  methods: {
    handlechange(e) {
      this.setData({
        currentIndex: e.detail.current
      })
    },
    bindload1() {
      this.data.loadCount1++
      this.setData({
        loadCount1 : this.data.loadCount1
      })
      if(this.data.loadCount1 == 4) {
         this.triggerEvent('bindloadok1')
      }
    },
    binderror1() {
      this.data.loadCount1++
      this.setData({
        loadCount1 : this.data.loadCount1
      })
      if(this.data.loadCount1 == 4) {
        this.triggerEvent('bindloadok1')
      }
    },
    bindload2() {
      this.data.loadCount2++
      this.setData({
        loadCount2 : this.data.loadCount2
      })
      if(this.data.loadCount2 == 6) {
         this.triggerEvent('bindloadok2')
      }
    },
     binderror2() {
      this.data.loadCount2++
      this.setData({
        loadCount2 : this.data.loadCount2
      })
      if(this.data.loadCount2 == 6) {
        this.triggerEvent('bindloadok2')
      }
    }
  }
})