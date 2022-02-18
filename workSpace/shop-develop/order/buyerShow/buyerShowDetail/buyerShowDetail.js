// order//buyerShow/buyerShowDetail/buyerShowDetail.js

import {shareImgCavas} from '../../service/shareImgCavas'
import {splitImg,buyerShowImage} from '../../../utils/utils'
import {getWxaCodeUnpubAddrQR} from "../../../service/guide";
import {goodsReviewDetail,buyerShowZan} from '../../service/buyerShow'
// 评价id
var commentID = ''
// 默认头像
const defultIcon = splitImg('evaluate _default_icon.png','common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex : -1,
    showShare : false,
    showComposite : {
      img : '',
      canShow : false
    },

    canvasW : 0,
    canvasH : 0,
    
    zan_n: splitImg('buyrerShowZan_n.png','common'),
    zan_s: splitImg('buyrerShowZan_s.png','common'),
    share: splitImg('buyrerShowShare.png','common'),
    closedImg: splitImg('buyerShow_closed.png','common'),
    // 测试用↓
    // detailDatas : {
    //   icon : 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL6X84bWfXDEDbqDBAhqdzaSSwMG9YnQjHeySC6UZLoAkibrblNjiasqJDKZCa9NX20gNwcssyhaHfQ/132',
    //   nickName : '哈哈哈',
    //   imgs : [
    //     "https://cdn.bestseller.com.cn/goodsImagePC/SELECTED/419201508/419201508E49/750750/419201508E49_T02.jpg",
    //     "https://cdn.bestseller.com.cn/goodsImagePC/SELECTED/419201508/419201508E49/750750/419201508E49_T03.jpg",
    //     "https://cdn.bestseller.com.cn/goodsImagePC/SELECTED/419201508/419201508E49/750750/419201508E49_T04.jpg"
    //   ],
    //   shopImg : 'https://cdn.bestseller.com.cn/goodsImagePC/SELECTED/419201508/419201508E49/240400/419201508E49_T02.jpg',
    //   shop12SKU : '120201582E52',
    //   comment : '分打瞌睡疯狂的首付款独分打瞌睡疯狂的首付款独分打瞌睡疯狂的首付款独分打瞌睡疯狂的首付款独分打瞌睡疯狂的首付款独',
    //   zanNum : 123,
    //   price : '469.00',
    //   isZan : false
    // }
    detailDatas : {
      icon : '',
      nickName : '',
      imgs : [],
      sku12 : '',
      shopImg : '',
      comment : '',
      zanNum : 0,
      price : '',
      isZan : false
    }
  },

  _getDetailDatas(){
    let detailDatas = this.data.detailDatas
    let currentIndex = this.data.currentIndex
    let json = {
      id : commentID
    }
    goodsReviewDetail(json).then(res => {
      // console.log(`详情数据:${JSON.stringify(res)}`)
      
      detailDatas.icon = res.headimgurl ? res.headimgurl : defultIcon
      detailDatas.nickName = res.nickname

      if (res.buyerShowImgs && res.buyerShowImgs.length > 0){
        detailDatas.imgs = buyerShowImage(res.buyerShowImgs,false)
        currentIndex = 0
      }

      detailDatas.sku12 = res.gcsSku.substr(0,12)

      detailDatas.shopImg = `${getApp().config.cdn}/goodsImagePC/${getApp().config.brand}/${res.goodsCode}/${detailDatas.sku12}/240400/${detailDatas.sku12}_T02.jpg`
      detailDatas.comment = res.reviewContent
      detailDatas.zanNum = res.buyerShowLikeCount
      detailDatas.price = `￥${res.price}`
      
      this.setData({detailDatas,currentIndex})
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      commentID = options.id
    }
    else if (options.scene){
      let scan_url = decodeURIComponent(options.scene);
      commentID = scan_url
    }


    if (commentID){
      this._getDetailDatas()
    }
    
  },
  zanTap(){
    if (!this.data.detailDatas.isZan){
      let json = {
        id : commentID
      }
      buyerShowZan(json).then(res => {
        let detailDatas = this.data.detailDatas
        detailDatas.isZan = true
        detailDatas.zanNum = detailDatas.zanNum + 1
        this.setData({detailDatas})
      })
    }
  },
  shareTap(){
    this.setData({
      showShare : true
    })
  },
  closed(){
    this.setData({
      showShare : false

    })
  },
  closedForShare(){
    let showComposite = this.data.showComposite
    showComposite.canShow = false

    this.setData({
      showComposite

    })
  },
  saveImg(){
    getApp().saveImage(this.data.showComposite.img)
  },
  async shareMoment(){
    console.log(`分享到朋友圈`)
    if (this.data.showComposite.img){
      if (this.data.showComposite.canShow){
        return
      }
      let showComposite = this.data.showComposite
      showComposite.canShow = true
      this.setData({showComposite})
      getApp().saveImage(showComposite.img)
      return
    }
    if (this.data.detailDatas.imgs.length <= 0){
      wx.showModal({
        title: '提示',
        content: '参数错误',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F'
      });
      return
    }

    let qrJson = await this.createQrCode()
    console.log(`生成二维码aaaa:${JSON.stringify(qrJson)}`)
    
    let randomCommnet = ['我的朋友看到衣服直夸好看。','衣服的版型很不错，上身效果也很好看，喜欢的亲们可以下手啦！','衣服质量非常好，款式很漂亮，穿上刚刚好，入手不亏','衣服时尚，穿着显气质，材质佳，朕很满意。','此物甚合我心意，棒棒哒，小伙伴们阔以放心下手','洋气大方，简约低调，很正点。','宝贝收到了，质量不错，大小合适，面料佳做工精细。是我想要的，很满意的一次购物！','太完美啦，这么好的衣服不给个好评都不行，真的很划算，话不多说了，自己看图片。']
    let randomIndex = Math.floor(Math.random() * randomCommnet.length + 0)
    wx.showLoading({
      title: '生成中……',
      mask: true
    });
    new shareImgCavas(this,{
      canvasID : 'cavas',
      qrJson,
      headImg : this.data.detailDatas.icon,
      bgImg : this.data.detailDatas.imgs[0],
      nickName : this.data.detailDatas.nickName,
      commnet : this.data.detailDatas.comment || randomCommnet[randomIndex],
      callback : (e) => {
        wx.hideLoading();
        console.log(`生成图片成功:${JSON.stringify(e)}`)

        this.setData({
          showComposite : {
            img : e.tempFilePath,
            canShow : true
          }
        })
      }
    })
    
  },
  change(e){
    // console.log(`aaaaa:${JSON.stringify(e)}`)
    this.setData({
      currentIndex : e.detail.current
    })
  },

  // 生成二维码
  createQrCode(){

    return new Promise((resolve, reject) => {

      const param = {
        scene : `${commentID}`,
        page: 'order/buyerShow/buyerShowDetail/buyerShowDetail'
        // 测试用↓
        // scene : `123321`,
        // page: 'livePlayer/playerDetail/playerDetail'
      };
      getWxaCodeUnpubAddrQR(param).then(res=>{
        wx.getImageInfo({
          src: res,
          success (res) {
            let json = {
              path : res.path,
              width : res.width,
              height : res.height
            }
            // console.log(`生成二维码:${JSON.stringify(json)}`)
            resolve(json)
          }
        })
      }).catch(err=> {
        wx.hideLoading();
        console.log(err)
        reject(err)
      });

    })

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
    
    let title = this.data.detailDatas.comment || randomCommnet[randomIndex]
    let path = `/order/buyerShow/buyerShowDetail/buyerShowDetail?id=${commentID}`
    let imageUrl = ''
    if (this.data.detailDatas.imgs && this.data.detailDatas.imgs.length > 0){
      imageUrl = this.data.detailDatas.imgs[0]
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