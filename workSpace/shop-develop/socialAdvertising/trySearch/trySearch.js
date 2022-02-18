// socialAdvertising/trySearch/trySearch.js
const app = getApp();
const brand = app.config.brand;
import { splitImg } from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: splitImg(''),
    videoUrl: `https://cdn.bestseller.com.cn/assets/common/${brand}/video/`,
    isOnly: false,
    randomMilli: Math.random(),
    swiperImgList: [],
    autoplay: true,
    interval: 3000,
    duration: 500,
    onlyList: [
      "120207116A09",
      "120207609E03",
      "120245002C03",
      "120358002H11",
      "120262501E04"
    ],
    vmList: [
      "320261523S59",
      "3201T1506C12",
      "31936Z502A06",
      "320205507S85",
      "320250517E15"
    ],

    onlyTipList: [
      "一键get通勤连衣裙",
      "一键get出游碎花裙",
      "一键get露脐针织衫",
      "一键get休闲格子衫",
      "一键get压褶牛仔衫"
    ],
    vmTipList: [
      "一键带走花木兰同款",
      "一键带走迪士尼同款",
      "一键带走蕾丝V领连衣裙",
      "一键带走国风衬衫",
      "一键带走INS风工装九分裤"
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(`--------------  options -----`)
    console.log(options)
    app.setUtmOptions(options);

    let list = []
    for (let i = 1; i <= 6; i++) {
      list.push({
        picUrl: `${this.data.imgUrl}/tyr_search_banner_0${i}.jpg?v=${this.data.randomMilli}`,
      })
    }

    if (brand == "ONLY") {
      this.setData({
        isOnly: true,
        skuList: this.data.onlyList,
        tipList: this.data.onlyTipList,
        swiperImgList: list
      })
    }
    if (brand == "VEROMODA") {
      this.setData({
        isOnly: false,
        skuList: this.data.vmList,
        tipList: this.data.vmTipList
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  onFrameClick: function (ev) {
    console.log(`onFrameClick  -------------`)
    console.log(ev)
    let index = ev.target.dataset.index
    let skuList = this.data.skuList
    let colorCode = skuList[index]
    if (colorCode) {
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${colorCode}`
      });
    }
  },

  onCouponClick: function (e) {
    console.log(`onCouponClick----- `)
    // let onlyP = "channel=channel5ee1cda96fd27&delivery_id=3194"
    let onlyP = "channel=channel5efc8066d26b4&delivery_id=3380"
    let vmP = "channel=channel5ee2f4feb0c25&delivery_id=3210"
    let param = brand == "ONLY" ? onlyP : vmP
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?${param}`,
      success: (result) => {
        console.log(`onCouponClick----- successs`)
      },
      fail: () => {
        console.log(`onCouponClick----- fail`)
      },
      complete: () => {
        console.log(`onCouponClick----- complete`)
      }
    });
  },


  onGotoShopClick: function (e) {
    let onlyS = "tpl_id=95&&tag_id=404"
    let vmS = "tpl_id=153&&tag_id=401"
    let s = brand == "ONLY" ? onlyS : vmS
    wx.navigateTo({
      url: `/store/storelist/storelist?${s}`,
      success: (result) => {
        console.log(`onGotoShopClick----- successs`)
      },
      fail: () => {
        console.log(`onGotoShopClick----- fail`)
      },
      complete: () => {
        console.log(`onGotoShopClick----- complete`)
      }
    });

  }

})