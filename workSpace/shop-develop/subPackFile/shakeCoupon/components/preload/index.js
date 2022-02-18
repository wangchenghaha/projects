

let len = 0
const BaseUrl = 'https://tc.woaap.com/lingzhi/fol_shop'
import Images from '../../common/image/image'
import Utils from '../../common/utils/index'
Component({
  properties: {
    preload: {
      type: Boolean,
      value: true
    }
  },

  data: {
    isBigPhone: Utils.isBigPhone(),
    imageList:[],
    isEnd: false,
    percent: 0
  },

  ready() {
    let { imageList } = this.data
    let startbg = ''
    if (Utils.isBigPhone()) {
      startbg = '/big.png'
    } else {
      startbg = '/mini.png'
    }
    for (const k in Images) {
      if (Images.hasOwnProperty(k)) {
        imageList.push(Images[k])
      }
    }
    imageList.push(`${BaseUrl}${startbg}`)
    this.setData({
      imageList,
      percent: 0
    })
  },

  methods: {
    onload() {
      len++
      this.setData({
        percent: (len / this.data.imageList.length * 100).toFixed(2)
      })
      if (len >= this.data.imageList.length) {
        setTimeout(() => {
          this.setData({
            isEnd: true
          })
        }, 500)
        setTimeout(() => {
            this.setData({
              percent: 0,
            })
            len = 0
            this.triggerEvent('imageAllLoad')
        }, 1000)

      }
    }
  }
})
