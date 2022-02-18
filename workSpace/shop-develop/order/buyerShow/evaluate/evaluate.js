import {skuToImg, splitImg } from '../../../utils/utils'
import {URL_CDN, KEYSTORAGE} from '../../../src/const'
import {chooseFile, uploadFile} from "../../../service/upload";
import {goodsReviewUpload, goodsReviewCreate} from "../../service/buyerShow";
import {wxShowToast} from "../../../utils/wxMethods";

const app = getApp();
const {brand, cdn, DEV} = app.config;
const starValue = [5, 5, 5, 5];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    maxLength: 140,
    // 评论文字
    evaluateMsg: '',
    uploadIcon: splitImg('icon_camera@2x.png', 'common'),
    // 图片前缀 http://db.vm.cn/upload_pic/SELECTED/11/f364ccb75e870f91/wH0uuHhq8Fbe.png
    imgPrefix: (DEV ?  'http://db.vm.cn' : `${cdn}`) + `/upload_pic/${brand}`,
    //
    // 图片列表
    uploadList: [],
    // 是否匿名
    isHideName: false,

    starValueList: [5, 5, 5, 5],
    serveList: [
      {
        text: '描述相符',
        eventName: 'desc'
      },
      {
        text: '物流服务',
        eventName: "express"
      },
      {
        text: '服务态度',
        eventName: 'serve'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {gcsSku} = options;
    const {goods} = this.data;
    Object.assign(goods, {
      goodsImg: cdn + skuToImg({sku:gcsSku, size: URL_CDN.IMGSIZE240400}),
      ...options,
    });
    this.setData({goods})
  },
  receiveValue(e){
    const {index = 0} = e.currentTarget.dataset;
    const value = e.detail;
    const {starValueList} = this.data;
    starValueList[index] = value;
    this.setData({starValueList});
  },
  // 输入文字
  inputText(e){
    let {value} = e.detail;
    const {maxLength} = this.data;
    if(value.length > maxLength){
      value = value.slice(0, maxLength);
    }
    this.setData({
      evaluateMsg: value
    })
  },
  // 删除图片
  delImg(e){
    const {index = 0} = e.currentTarget.dataset;
    const {uploadList} = this.data;
    uploadList.splice(index, 1);
    this.setData({uploadList})
  },
  uploadImg(){
    const maxSize = 6;
    const {uploadList, goods} = this.data;
    if(uploadList.length >= maxSize){
      wxShowToast('最多6张图');
      return
    }
    const count = maxSize - uploadList.length;
    chooseFile(count).then(res => {
      if(res && res.length){
        res.forEach(item => {
          goodsReviewUpload(item, goods.bigorderCode).then(res => {
            uploadList.push(res);
            this.setData({uploadList});
          })
        });
      }
    }).catch(err => wxShowToast(err.message))
  },
  // 切换是否匿名
  changeHideName(){
    let {isHideName} = this.data;
    this.setData({isHideName: !isHideName})
  },
  publish(){
    const {isHideName, evaluateMsg, uploadList, goods, starValueList} = this.data;
    const {bigorderCode, goodsId} = goods;
    const {nickName = '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const param = {
      bigorderCode,	// 订单号	body	true	string
      buyerShowImgs: uploadList.join(','), // 买家秀图片(最多六张,逗号隔开)	body	false	string
      goodsOrderId: goodsId, // 	订单商品id	body	true	integer(int64)
      isBuyerShow: 'N', // 	是否买家秀: Y-是,N-否	body	false	string
      reviewContent: evaluateMsg || '暂无评论', // 	评价内容	body	false	string
      reviewType: 'PUBLIC', // 	评价类型: PUBLIC-公开,ANONYMOUS-匿名	body	false	string
      starRatings: starValueList.join(), // 	评星(4项逗号隔开.格式:商品评价,描述相符,物流服务,服务态度)
      nickname: nickName, // 	用户昵称	body	false	string
      headimgurl: avatarUrl, // 	用户头像	body	false	string
    };
    if(isHideName){
      const paramType = {
        reviewType: 'ANONYMOUS'
      };
      Object.assign(param, paramType)
    }
    wx.showLoading({
      title: '正在发布...',
      mask: true
    });
    goodsReviewCreate(param).then(res => {
      wx.hideLoading();
      wxShowToast('发布成功');
      setTimeout(_=> {
        wx.navigateTo({
          url: '../evaluateCenter/evaluateCenter'
        })
      }, 2500)
    }).catch(err => wxShowToast(err.message))
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

  }
})