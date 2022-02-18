import img from '../model/img.model'
Page({
  data: {
    showloading : false,
    img,
    clotheslist : [
      {
        imgurl : img.clothes1,
        name : '轻薄户外夹克',
        price : '349.5'
      },
      {
        imgurl : img.clothes2,
        name : '轻薄户外夹克',
        price : '349.5'
      }
    ]
  },
  onShow: function () {
    wx.createSelectorQuery().select('#animation-item1').boundingClientRect(function(rect){
      console.log(rect)
    }).exec()
  },
  onReady: function () {
  },
  onLoad(options) {
    console.log('options',options)
  },
  //重新预约
  newrecord() {
    wx.redirectTo({
      url: `/advancesale/index/index`
    })
  }
})