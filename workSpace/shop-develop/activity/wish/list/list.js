import {splitImg, skuToImg, jiafa, objToQuery} from '../../../utils/utils'
import {wxCopyText, wxShowToast} from '../../../utils/wxMethods'
import {URL_CDN, KEYSTORAGE} from '../../../src/const'
import {wishDetail} from "../../service/wish";
import {fileIsExist} from "../../../service/init";
import {getWxaCodeUnpubAddrQR} from "../../../service/guide";
import {getImageInfo, saveImageToPhotosAlbum} from "../../../service/saveImg";

const app = getApp();
const {cdn, brand} = app.config;
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: splitImg('banner@2x.png'),
    wishIcon: splitImg('wish-icon.png'),
    // 分享合成背景图
    wishShareBg: splitImg('wish_share_bg.png?v=1102'),
    // 分享对话框图
    wishShareCover: splitImg('wish_share_cover.png?v=1102'),
    wxInfo: {},
    wishDetail: {},
    wishQR: '',
    canvas: {
      width: 0,
      height: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    // 159783362301486
    this.getWxInfo();
    this.getWishDetail();
    this.setCanvas();
  },
  getWxInfo() {
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    this.setData({wxInfo})
  },
  async setCanvas() {
    let {wishShareBg, canvas} = this.data;
    const {width, height} = await getImageInfo(wishShareBg, true);
    canvas = {width, height};
    this.setData({canvas})
  },
  getWishDetail() {
    const param = {
      xinyuandanId: curOptions.id,
      brand
    };
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wishDetail(param).then(res => {
      wx.hideLoading();
      if (res) {
        this.setData({wishDetail: res})
      }
    }).catch(err => wxShowToast(err.message))
  },
  async generateGuideQR() {
    const {wishDetail} = this.data;
    const param = {
      scene: `id=${wishDetail.xinyuandanId}`,
      // scene: `id=159800067291044`,
      page: 'activity/wish/openDetail/openDetail',
      is_hyaline: false,
      // auto_color: false,
      // line_color: '255_123_199'
    };
    wx.showLoading({
      title: '生成中',
      mask: true
    });
    getWxaCodeUnpubAddrQR(param).then(res => {
      this.setData({wishQR: res});
      this.generateImg()
    }).catch(err => wxShowToast(err.message));
  },
  async generateImg() {
    const {wishShareBg, wishQR} = this.data;
    console.log(wishShareBg,'***')
    wx.showLoading({
      title: '合成中',
      mask: true
    });
    console.log(wishShareBg,'***')
    try {
      console.log(wishShareBg,'***')
      const {path, width, height} = await getImageInfo(wishShareBg, true);
      const localGuideQR = await getImageInfo(wishQR);
      console.log(localGuideQR,'***')
      const localSplash = path;
      const saveWidth = width, saveHeight = height;
      let widthQR = 200, heightQR = 200;
      const QRPositionX = saveWidth / 2 - widthQR / 2;
      const QRPositionY = 580;
      const ctx = wx.createCanvasContext('myCanvas');
      ctx.drawImage(localSplash, 0, 0, saveWidth, saveHeight);
      // 二维码位置 及大小
      ctx.drawImage(localGuideQR, QRPositionX, QRPositionY, widthQR, heightQR);
      ctx.draw(true, function (e) {
        console.log(e,'***')
        // 保存到本地
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: saveWidth,
          height: saveHeight,
          canvasId: 'myCanvas',
          success: function (res) {
            let pic = res.tempFilePath;
            saveImageToPhotosAlbum(pic).then(res => {
              wxShowToast('保存成功');
            }).catch(err => wxShowToast(err.message));
          },
          fail(err) {
            console.log(err, '保存失败');
            wxShowToast('保存失败');
          },
        });
      });
    } catch (e) {
      wxShowToast(e.message)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let path = 'activity/wish/openDetail/openDetail';
    const {wishDetail, wishShareCover} = this.data;
    const param = {
      id: wishDetail.xinyuandanId
    };
    path += objToQuery(param);
    return {
      title: wishDetail.msg,
      path,
      imageUrl: wishShareCover,
      success: res => {
      }
    }
  }
})