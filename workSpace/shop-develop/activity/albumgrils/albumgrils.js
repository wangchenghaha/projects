import { getAlbumJson } from "../../service/activity"
import { splitImg } from '../../utils/utils'
import { wxSubscription } from '../../utils/wxSubscribe';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumGrils: [],
    goTop: splitImg("albumgirl03.png"),
    goHome: splitImg("albumgirl02.png"),
    bottomImg: '',
    covers:["https://cdn.bestseller.com.cn/assets/common/ONLY/image/albumgirl04.jpg",
            "https://cdn.bestseller.com.cn/assets/common/ONLY/image/albumgirl06.jpg",
            "https://cdn.bestseller.com.cn/assets/common/ONLY/image/albumgirl08.jpg"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getAlbumJson();
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

  _getAlbumJson: function(){
    getAlbumJson().then(res => {
      let albums = [];
      for (let i = 0; i < res.length - 1; i++) {
        albums.push(res[i]);
      }
      this.setData({
        albumGrils: albums,
        bottomImg: res[res.length - 1].picUrl,
      })
    })
  },

  onClick: function(e){
    let type =  e.currentTarget.dataset.type;
    switch(type){
        case "gofriend":
          if(!wx.getStorageSync('wxSubscriptions').isNewGoodsNotice){
            wxSubscription("newGoods").then(res => {
            }).catch(err => {
            });
          }
          break;
        case "goGroup":
          app.saveImage(this.data.covers[Math.floor(Math.random()*3)]);
          break;
        case "goTop":
          
          break;
        case "goHome":
          app.goBack();
          break;
    }
  },
 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    let title = "ONLY-GIRLS，我们与你在一起！"
    let images = this.data.covers[Math.floor(Math.random()*3)]
    let path = `/activity/albumgrils/albumgrils`
    console.log(`分享成功:${path}`)
    return{
      title: title,
      path : path,
      imageUrl : images,
      success:function(e){
        console.log(`分享成功:${path}`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  },
})