// order//buyerShow/commentDetail/commentDetail.js

import {splitImg,buyerShowImage, skuToImg} from '../../../utils/utils'
import {goodsReviewDetail} from '../../service/buyerShow'
import { URL_CDN } from '../../../src/const.js'

const xing_n = splitImg('buyerShow_xing_n.png','common')
const xing_s = splitImg('buyerShow_xing_s.png','common')
// 评价id
var commentID = ''
// 默认头像
const defultIcon = splitImg('evaluate _default_icon.png','common')
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    

    detailDatas : {
      color : '',
      chima : '',
      shopImg : '',
      shopName : '',
      sku12 : '',
      price : '',
      detail : {
        icon : '',
        nickName : '',
        xings : [],
        createTime : '',
        comment : '',
        imgs : []
      }
    }

  },

  _getDetailDatas(){
    let detailDatas = this.data.detailDatas 
    let json = {
      id : commentID
    }
    goodsReviewDetail(json).then(res => {
      // console.log(`详情数据:${JSON.stringify(res)}`)
      detailDatas.color = res.colorName
      detailDatas.chima = res.sizeName
      
      detailDatas.shopName = res.goodsName + ' | ' + res.gcsSku.substr(0,12)

      detailDatas.sku12 = res.gcsSku.substr(0,12)

      detailDatas.price = `￥${res.price}`
      detailDatas.detail.icon = res.headimgurl ? res.headimgurl : defultIcon
      detailDatas.detail.nickName = res.nickname
      let skuToImgParam = {
        size: URL_CDN.IMGSIZE240400,
        sku: detailDatas.sku12,
      };
      detailDatas.shopImg =`${getApp().config.cdn}${skuToImg(skuToImgParam)}`
      let xingNum = parseInt(res.starRatings.split(',')[0])
      for (let i=0;i<5;i++){
        if (i <= xingNum - 1){
          detailDatas.detail.xings.push(xing_s)
        }
        else{
          detailDatas.detail.xings.push(xing_n)
        }
      }
      detailDatas.detail.createTime = res.createTime.split(' ')[0]
      detailDatas.detail.comment = res.reviewContent
      if (res.buyerShowImgs && res.buyerShowImgs.length > 0){
        detailDatas.detail.imgs = buyerShowImage(res.buyerShowImgs,false)
      }
      
      this.setData({detailDatas})
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      commentID = options.id
      this._getDetailDatas()
    }

  },

  goDetail(){
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${this.data.detailDatas.sku12}`
    });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let randomCommnet = ['我的朋友看到衣服直夸好看。','衣服的版型很不错，上身效果也很好看，喜欢的亲们可以下手啦！','衣服质量非常好，款式很漂亮，穿上刚刚好，入手不亏','衣服时尚，穿着显气质，材质佳，朕很满意。','此物甚合我心意，棒棒哒，小伙伴们阔以放心下手','洋气大方，简约低调，很正点。','宝贝收到了，质量不错，大小合适，面料佳做工精细。是我想要的，很满意的一次购物！','太完美啦，这么好的衣服不给个好评都不行，真的很划算，话不多说了，自己看图片。']
    let randomIndex = Math.floor(Math.random() * randomCommnet.length + 0)

    let title = this.data.detailDatas.detail.comment || randomCommnet[randomIndex]
    let path = `/order/buyerShow/commentDetail/commentDetail?id=${commentID}`
    let imageUrl = ''
    if (this.data.detailDatas.detail.imgs && this.data.detailDatas.detail.imgs.length > 0){
      imageUrl = this.data.detailDatas.detail.imgs[0]
    }

    return{
      title: title,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
        console.log(`分享成功:${path}`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }

  }
})