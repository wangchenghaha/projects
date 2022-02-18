import {shareLiveDetail, shareLiveAdd, shareLiveCount, shareLiveRemove} from '../../service/livePlayer'
import {fileIsExist } from '../../service/init'
import {wxCopyText, wxShowToast} from '../../utils/wxMethods'
import {KEYSTORAGE} from "../../src/const";
import {getCurrentUrl, judgeUrl, objToQuery} from "../../utils/utils";
import {getImageInfo, saveImageToPhotosAlbum} from "../../service/saveImg";
import {getWxaCodeUnpubAddrQR} from "../../service/guide";
import {getConfigJSON} from "../../service/init";
const app = getApp();
const {brand, cdn, ETO_BRAND, WE_MALL_CDN} = app.config;
const livePage = 'livePlayer/transfer/transfer';
let userType = 'guide';
let curOptions = {};
const shareUser = 'shareCount', shareMoment = 'shareMomentCount';
// 是否保存二维码
let isSaveQR = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employeeId: '',
    shareDetail: {},
    // guideQR: 'https://cdn.bestseller.com.cn/newminiB/SELECTED_sf=423946_id=1262278651967565825.png',
    guideQR: '',
    shareUserStatus: false,
    newTempId: '',
    shareSync: false, // 是否需要异步
    showPopup: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    const {id = ''} = curOptions;
    this.checkLogin();
    this.pageInit();
    this.getBrandConfig();
    this.getShareLiveDetail(id);
  },
  checkLogin(options) {
    wx.removeStorageSync(KEYSTORAGE.curPath);
    const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    if(!guideInfo.employeeId){
      wx.setStorageSync(KEYSTORAGE.curPath, `/${getCurrentUrl()}`);
      wx.switchTab({
        url: '/pages/weMember/weMember'
      })
    }
  },
  onShow: function(){


    // console.log('onshow**', )
  },
  pageInit(){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    if(employeeId){
      this.setData({employeeId});
    }else {
      console.log('登陆')
    }
  },
// 品牌配置文件
  getBrandConfig(){
    const {employeeId } = this.data;
    getConfigJSON().then(res => {
      if(res){
        let {operateDA = [], isliveQRCodeSave} = res;
        // 是否保存图片
        isSaveQR = isliveQRCodeSave;
        // 判断运营
        if(operateDA.length){
          const isOperation = operateDA.some(item => item.daName === employeeId);
          if(isOperation){
            userType = 'operation'
          }
        }
      }
    })
  },
  closeShare(){
    const {newTempId, shareSync} = this.data;
    this.setData({
      shareUserStatus: false,
    });
    if(newTempId){
      shareLiveRemove(newTempId).then(res => {})
      this.setData({
        newTempId: '',
        shareSync: true,
      })
    }
  },
  getShareLiveDetail(id){
    shareLiveDetail(id).then(res => {
      if(res){
        let {employeeId} = this.data;
        if(res.posterImg && !res.posterImg.includes('http')){
          res.myPosterImg = judgeUrl(res.posterImg);
        }else{
          res.myPosterImg = res.posterImg;
        }
        if(!res.roomDetail){
          if(res.templateId === '1274898211811971074'){
            res.roomDetail = '9小时直播狂欢不间断，整场货品5折起\n还有直播间专属神秘福利！\n关晓彤也会来到直播间，给粉丝宝宝们抽取豪华奖品！\n立即长按扫码进入直播间！'
          }
        }

        // 分享是否异步
        let shareSync = res.createByOpenid !== employeeId;
        this.setData({
          shareDetail: res,
          shareSync
        })
      }
    }).catch(err => wxShowToast(err.message))
  },
  hidePopup(){
    this.setData({ showPopup: false})
  },
  showPopup(e){
    const {roomDetail} = this.data.shareDetail;
    if(roomDetail){
      this.setData({  showPopup: true})
    }else{
      this.saveImg();
    }
  },
  async saveImg(e){
    let {employeeId, shareDetail, newTempId} = this.data;
    if(!isSaveQR){
      this.hidePopup();
      // 2020-12-14 chai 禁止
      /*wx.showModal({
        title: '提示',
        content: '暂时不能保存二维码',
        showCancel: false,
        success(){
          wxCopyText(shareDetail.roomDetail)
        },
      })
      return;*/
    }
    const {createByOpenid} = shareDetail;
    if(employeeId !== createByOpenid && !newTempId){
      let newDetail = await this.creatShare(shareMoment);
      console.log('需要创建**', newDetail);
      newTempId = newDetail.id;
      this.setData({
        newTempId,
        shareSync: false
      });
      await this.generateGuideQR(newTempId);
    }else{
      console.log('不需要')
      await this.generateGuideQR();
    }
    this.shareUpdate(shareMoment);
  },
  shareUpdate(type){
    const {shareDetail} = this.data;
    shareLiveCount({
      id: shareDetail.id,
      [type]: shareDetail[type] + 1
    }).then(res => {

    }).catch(err => console.error(err.message));
  },
  creatShare(type){
    const {shareDetail} = this.data;
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {nickName = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let param = JSON.parse(JSON.stringify(shareDetail));
     param = Object.assign(param, {
      anchor: nickName || employeeId,
      createByOpenid: employeeId,
      type: userType,
      createTime: Date.now(),
      id: '',
      templateId: shareDetail.id,
      shareMomentCount: type === shareMoment ? 1 : 0,
      shareCount: type === shareUser ? 1 : 0,
      openCount: 0
    })
    delete param.myPosterImg;
    return new Promise((resolve, reject) => {
      shareLiveAdd(param).then(res => {
        if(res){
          resolve(res);
        }
      }).catch(err => reject(new Error(err.message)));
    })

  },
  async generateImg(){
    wx.showLoading({
      title: '正在保存',
      mask: true
    });
    this.hidePopup();
    const {guideQR, shareDetail} = this.data;
    const {id, title, roomId, roomDetail} = shareDetail;
    const utmObj = {
      utm_campaign: id,
      utm_medium: 'guideshare',
      utm_source: 'zhibo_zhuanfa',
      utm_term: `${ETO_BRAND[brand]}${roomId}SHARE`
    }
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise)
    if(isWXWork){
      utmObj.utm_source = 'enterpise_wechat_zhibo_zhuanfa'
    }
    app._collectData2({
      eventName: `分享直播间到朋友圈_${id}_${title}_${Date.now()}`,
      eventValue: '朋友圈',
      ...utmObj
    });
    try{
      let localGuideQR = await getImageInfo(guideQR);
      const {path, width, height} = await getImageInfo(shareDetail.myPosterImg, true);
      const localSplash = path;
      const ctx = wx.createCanvasContext('myCanvas');
      const saveWidth = width, saveHeight = height;
      let widthQR = 120, heightQR = 120;
      const QRPositionX = saveWidth - (widthQR + 20);
      const QRPositionY = saveHeight - (widthQR + 20);
      console.log(QRPositionX, QRPositionY,'XY**', saveWidth, saveHeight, widthQR, heightQR)
      ctx.drawImage(localSplash, 0, 0, saveWidth, saveHeight);
      // 二维码位置 及大小
      ctx.drawImage(localGuideQR, QRPositionX, QRPositionY, widthQR, heightQR);
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
              if(roomDetail){
                wxCopyText(roomDetail)
              }
            }).catch(err => wxShowToast(err.message));
          },
          fail(err){
            wxShowToast('保存失败');
          },
        });
      });
    }catch(e){
      wxShowToast(e.message);
    }
    app.gioTrack('pageclick_share_live_share_moment', {
      content_Id: id,
      title
    })
  },
  async generateGuideQR(tempId){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
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
    const {id = ''} = this.data.shareDetail;
    const {newTempId} = this.data;
    const sceneParam = {
      s: employeeId.substr(4),
      d: tempId || newTempId || id,
    };
    let scene = '';
    for(let key in sceneParam){
      const item = `${key}=${sceneParam[key]}`;
      scene += scene ? `_${item}` : item
    }
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    if(isWXWork){
      // 企业微信
      scene += '_Q'
    }
    const param = {
      scene,
      page: livePage,
      is_hyaline: false
    };
    /*let guideQR = `${WE_MALL_CDN}/newminiB/${brand}_${scene}.png`;
    const isExist = await fileIsExist(guideQR);
    // 文件是否存在
    if(isExist){
      this.setData({ guideQR });
      await this.generateImg();
      return
    }*/
    wx.showLoading({
      title: '保存中',
      mask: true
    });
    getWxaCodeUnpubAddrQR(param).then(res=>{
      let guideQR = res;
      this.setData({ guideQR });
      this.generateImg()
    }).catch(err=> console.log(err));
  },
  async share(){
    let newDetail = this.creatShare(shareUser)
    console.log('需要创建');
    this.onShareAppMessage();
  },
  async shareUser(e){
    let {employeeId, shareDetail, newTempId, shareUserStatus, shareSync} = this.data;
    const {createByOpenid} = shareDetail;
    if(e.detail){
      if(employeeId !== createByOpenid && !newTempId){
        let newDetail = await this.creatShare(shareUser);
        newTempId = newDetail.id;
        shareSync = false;
      }
      this.setData({
        newTempId,
        shareUserStatus: true,
        shareSync
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res);
    const {employeeId = '', shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let { roomName, shareImg, roomId, createByOpenid, id, title = ''} = this.data.shareDetail;
    const {newTempId, shareUserStatus} = this.data;
    this.shareUpdate(shareUser);
    this.setData({
      shareUserStatus: false
    })
    if(employeeId !== createByOpenid){
      console.log('创建的ID', newTempId)
    }else{
      console.log('不需要')
    }
    const shareId = newTempId || id;
    const utmParam = {
      utm_campaign: shareId,
      utm_medium: 'guideshare',
      utm_source: 'zhibo_zhuanfa',
      // utm_term: employeeId,
      utm_term: `${ETO_BRAND[brand]}${roomId}SHARE`,
    };
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise)
    if(isWXWork){
      utmParam.utm_source = 'enterpise_wechat_zhibo_zhuanfa'
    }
    app._collectData2(Object.assign({
      eventName: `分享直播间给顾客_${shareId}_${title}_${Date.now()}`,
      eventValue: '对话框'
    }, utmParam));
    app.gioTrack(res.from === 'menu' ? 'pageclick_share_live_fwd' : 'pageclick_share_live_share_guest', {
      content_Id: shareId,
      title
    })
    const param = Object.assign({
      share_by: employeeId,
      share_by_shop: shopCode,
      roomId,
      shareId,
      devFlag: app.urlDevFlag()
    }, utmParam);
    const path = livePage + objToQuery(param);
    console.log(path,'****分享路径', judgeUrl(shareImg));
    return {
      title: roomName || brand + '直播',
      imageUrl: judgeUrl(shareImg),
      path
    }
  }
})
