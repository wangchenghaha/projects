// livePlayer/liveGuide/liveGuide.js
import {getWxaCodeUnpubAddrQR} from "../../service/guide";
import {getCurrentUrl, objToQuery, splitImg} from "../../utils/utils";
import { wxShowToast, wxCopyText } from "../../utils/wxMethods.js";
import { getImageInfo, saveImageToPhotosAlbum} from "../../service/saveImg.js";
import {KEYSTORAGE} from '../../src/const'
import {liveRoom} from "../../service/livePlayer";
const app = getApp();
const {cdn} = app.config;
const livePage = 'livePlayer/transfer/transfer';
let curRoom = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideQR: '',
    liveBg: splitImg('live-bg-0430.jpg'),
    showPopup: false,
    copyText: '#和则興，潮无界# \n杰克琼斯&CLOTTEE 联名新品直播发布会，约你一起“潮”翻天！\n邓伦在线带货宠粉，新品限时8.5折，更有4999免单大礼等你来抽！'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'**liveGuide');
    this.generateGuideQR();
    this.getLiveRoom();
  },
  changePopup(){
    this.setData({showPopup: true});
  },
  hidePopup(){
    this.setData({showPopup: false});
  },
  async generateImg(){
    wx.showLoading({
      title: '正在保存',
      mask: true
    });
    const {guideQR, liveBg, copyText} = this.data;
    let localGuideQR = await getImageInfo(guideQR);
    let localSplash = await getImageInfo(liveBg);
    const that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    const saveWidth = 750, saveHeight = 1333;
    ctx.drawImage(localSplash, 0, 0, saveWidth, saveHeight);
    ctx.drawImage(localGuideQR, 15, 1053, 250, 250);
    ctx.draw(false, function(e) {
      // 保存到本地
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: saveWidth,
        height: saveHeight,
        canvasId: 'myCanvas',
        success: function(res) {
          let pic = res.tempFilePath;
          saveImageToPhotosAlbum(pic).then(res => {
            wxShowToast('保存成功');
            wxCopyText(copyText);
            that.hidePopup();
          });
        },
        fail(err){
          console.log(err,'保存失败');
          wxShowToast('保存失败');
        },
      });
    });
  },
  generateGuideQR(){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const guideQR = wx.getStorageSync(KEYSTORAGE.liveGuideQR);
    if(!employeeId){
      wx.setStorage({
        key: KEYSTORAGE.curPath,
        data: '/livePlayer/liveGuide/liveGuide',
        success(){
          wx.switchTab({
            url: '/pages/weMember/weMember'
          })
        }
      });
      return;
    }
    if(guideQR){
      this.setData({ guideQR });
      return;
    }
    // {"scene":"zID=DA004239461587197439561","page":"weMall/openDaogouPage/openDaogouPage"}
    // cp=20200417jj&tm=dg&sf=534821
    const sceneParam = {
      sf: employeeId.substr(4),
      cp: '20200428LIVE',
      NO:'1'
    };
    let scene = '';
    for(let key in sceneParam){
      const item = `${key}=${sceneParam[key]}`;
      scene += scene ? `_${item}` : item
    }
    const param = {
      scene,
      page: livePage,
      is_hyaline: false
    };
    getWxaCodeUnpubAddrQR(param).then(res=>{
      const guideQR = res;
      wx.setStorageSync(KEYSTORAGE.liveGuideQR, guideQR);
      this.setData({ guideQR })
    }).catch(err=> console.log(err));
  },
  getLiveRoom(){
    liveRoom().then(res => {
      if(res && res.errcode === 0){
        if(res.room_info && res.room_info.length){
          const roomInfo = res.room_info;
          if(roomInfo.length){
            curRoom = roomInfo[0];
          }
        }
      }
    }).catch(err => console.log(err))
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {employeeId = '', shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {name, share_img, roomid} = curRoom;
    const param = {
      share_by: employeeId,
      share_by_shop: shopCode,
      utm_campaign: '20200428LIVE',
      utm_medium: 'WEMALL',
      utm_source: 'SYLL',
      utm_term: '2SHARE01'
    };
    app._collectData2({
      eventName:'直播导购转发',
      utm_source: 'zhibo_zhuanfa',
      utm_campaign: roomid || '',
      utm_term: employeeId
    });
    const path = livePage + objToQuery(param);
    const shareObj = {
      title: name || app.config.brand + '直播',
      path
    };
    console.log(path,'****分享路径');
    if(share_img){
      shareObj.imageUrl = share_img
    }
    return shareObj
  }
});