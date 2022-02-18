// weMall/redBook/detail/detail.js
import {redBookDetail, redBookUpdate, redBookAdd, redBookRemove} from '../../service/redBook'
import {wxShowToast, wxCopyText} from '../../../utils/wxMethods'
import {judgeUrl, splitImg, objToQuery, getCurrentUrl} from '../../../utils/utils'
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import {getConfigJSON} from "../../../service/init";
import events from "../../../src/events";
import {miniLink} from "../../../service/mini";
const app = getApp();
const {DEV, cdn} = app.config;
let userType = 'guide';
const shareUser = 'shareCount', shareMoment = 'shareMomentCount';
let curOptions = {};
const UPLOAD_DOMAIN_TEST = 'http://db.vm.cn';
const sharePath = '/weMall/redBook/openDetail/openDetail';
const UTM_SOURCE = 'xiaohongshu_zhuanfa', UTM_SOURCE_LINK = 'xiaohongshu_miniLink';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail: {},
    shareUser: {
      status: false,
      img: `${cdn}/assets/common/image/dg/shareUser.jpg`,
    },
    shareMoment: {
      status: false,
      img: `${cdn}/assets/common/image/dg/friendCircle.jpg`,
    },
    // 新创建的模板ID
    newId: '',
    employeeId: '',
    successTip: [
      splitImg('swiper1_03.jpg'),
      splitImg('swiper2_03.jpg'),
      splitImg('swiper3_03.jpg'),
      splitImg('swiper4_03.jpg'),
    ],
    saveSuccess: false,
    // 配置的复制文案
    copyText: [],
    // 朋友圈分享链接
    miniLinkUrl: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id=''} = options;
    curOptions = options;
    app.checkWeMallLogin();
    this.getBrandConfig();
    this.getRedBooKDetail(id);
    /*wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });*/
  },
  generateMiniLink(query = ''){
    miniLink({
      path: sharePath,
      query,
    }).then(res => {
      if(res){
        this.setData({miniLinkUrl: res})
      }
    })
  },
  // 品牌配置文件
  getBrandConfig(){
    const {employeeId } = wx.getStorageSync(KEYSTORAGE.guideInfo);
    this.setData({employeeId});
    getConfigJSON().then(res => {
      if(res){
        // 判断运营
        let operateArr = res.operateDA;
        if(operateArr && operateArr.length && operateArr.includes(employeeId)){
          userType = 'operation'
        }
        if(res.copyText && res.copyText.length){
          this.setData({copyText: res.copyText })
        }
      }
    })
  },
  getRedBooKDetail(id){
    redBookDetail(id).then(res => {
      if(res && Object.keys(res).length){
        const {matchJson} = res;
        if(matchJson){
          res.matchJson = JSON.parse(matchJson);
          this.setData({bookDetail: res})
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  // 关闭提示
  closeTip(e){
    let {newId} = this.data;
    // 关闭时，当有newId 且是页面点击则删除模板
    if(newId && e && e.type){
      redBookRemove(newId).then(res => {
        this.setData({newId: ''});
      })
    }
    this.setData({
      'shareUser.status': false,
      'shareMoment.status': false,
    });
  },
  // 复制文案
  copyText(){
    const {miniLinkUrl, bookDetail, copyText} = this.data
    const {matchJson = {}, pageTitle} = bookDetail;
    const {copywritingListData = {}} = matchJson;
    const {copywritingWList = []} = copywritingListData;
    const copyText0 = copyText[0] ? copyText[0].text : '';
    const copyText1 = copyText[1] ? copyText[1].text : '';
    if(copywritingWList.length){
      const {copywriteTheme, copywriteContent} = copywritingWList[0];
      if(copywriteTheme || copywriteContent){
        wxCopyText(`${copyText0} ${copywriteTheme}\n${copywriteContent} ${copyText1} \n${miniLinkUrl}`);
        return
      }
    }
    wxCopyText(`${copyText0} ${pageTitle} ${copyText1} \n ${miniLinkUrl}`);
  },
  // 分享好友
  shareUser(){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {createByOpenid, matchJson} = this.data.bookDetail;
    if(employeeId !== createByOpenid  && !this.data.newId){
      console.log('分享用户创建');
      this.createTemp(shareUser).then(res => {
        if(res){
          this.setData({
            'shareUser.status': true,
            newId: res.id
          });
          this.generateMiniLink(this.shareParam(true))
        }
      }).catch(err => wxShowToast(err.message));
      return
    }
    this.generateMiniLink(this.shareParam(true))
    this.setData({'shareUser.status': true});
  },
  shareMomentTip(){
    this.setData({'shareMoment.status': true});
  },
  closeMomentTip(){
    this.setData({'shareMoment.status': false});
  },
  // 分享朋友圈
  async shareMoment(){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {createByOpenid, pageTitle, id, templateId} = this.data.bookDetail;

    this.closeMomentTip();
    if(employeeId !== createByOpenid && !this.data.newId){
      console.log('创建');
      const res = await this.createTemp(shareMoment);
      this.setData({ newId: res.id})
    }else{
      console.log('不创建');
    }
    this.updateCount(shareMoment);
    const query = this.shareParam(true)
    const miniLinkUrl = await miniLink({
      path: sharePath,
      query,
    });
    if(miniLinkUrl){
      this.setData({miniLinkUrl})
    }
    const shareId = this.data.newId || id;
    const wxWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    const wxWorkStr = 'enterprise_wechat';
    app._collectData2({
      eventName: `分享给顾客种草视频_${shareId}_${pageTitle}_${Date.now()}_${templateId || shareId}`,
      eventValue: '朋友圈',
      ...this.shareParam(),
      utm_source: wxWork ?  `${wxWorkStr}_${UTM_SOURCE_LINK}` : UTM_SOURCE_LINK,
    })
    this.copyText();
    this.saveFile();
  },
  closeSuccess(){
    this.setData({
      saveSuccess: false
    })
  },
  handleEvent(event, type){
    if(type === EVENTS.EVENT_SAVE){
      this.setData({saveSuccess: true});
    }
  },
  saveFile(){
    const {matchJson} = this.data.bookDetail;
    if(matchJson.isImg){
      console.log('保存图片')
    }else {
      console.log('保存视频');
      const {videoData = {}} = matchJson;
      const {rotationVideoList = []} = videoData;
      if (rotationVideoList.length) {
        rotationVideoList.forEach(item => {
          let {videoUrl = ''} = item;
          if (videoUrl) {
            videoUrl = DEV ? UPLOAD_DOMAIN_TEST + videoUrl : judgeUrl(videoUrl);
            // 注册刷新
            events.register(this, EVENTS.EVENT_SAVE);
            app.saveImage(videoUrl);
          }
        })
      }
    }
  },
  updateCount(type){
    const {bookDetail, newId} = this.data;
    const param = {
      id: bookDetail.id,
      [type]: bookDetail[type] + 1
    };
    redBookUpdate(param).then(res => {
    }).catch(err => console.error(err.message))
    if(newId){
      param.id = newId;
      setTimeout(() => {
        redBookUpdate(param).then(res => {
        })
      }, 1200)
    }
  },
  /**
   * 创建新的模板
   * @param type shareUser Or shareMoment
   * @returns {Promise<unknown>}
   */
  createTemp(type){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const {nickName = '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const {bookDetail} = this.data;
    let param = JSON.parse(JSON.stringify(bookDetail));
    param = Object.assign(param, {
      author: nickName || employeeId,
      createByOpenid: employeeId,
      nickname: nickName,
      portrait:avatarUrl,
      type: userType,
      createTime: Date.now(),
      id: '',
      templateId: bookDetail.id,
      matchJson: JSON.stringify(bookDetail.matchJson),
      shareMomentCount: 0,
      shareCount:  0,
      openCount: 0
    });
    // this.updateCount(type);
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
      });
      redBookAdd(param).then(res => {
        wx.hideLoading();
        if(res){
          resolve(res)
        }else{
          reject(new Error(res.message))
        }
      }).catch(err => reject(new Error(err.message)));
    })

  },
  shareParam(link){
    const {newId, bookDetail} = this.data;
    const {id} = bookDetail;
    const {employeeId, shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const wxWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    const wxWorkStr = 'enterprise_wechat';
    const shareId = newId || id;
    const {nickName = '', avatarUrl = ''} = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const shareParam = {
      id: shareId,
      share_by: employeeId,
      share_by_shop: shopCode,
      utm_source: wxWork ?  `${wxWorkStr}_${UTM_SOURCE}` : UTM_SOURCE,
      utm_medium: 'guideshare',
      utm_term: employeeId,
      utm_campaign: shareId,
      devFlag: app.urlDevFlag(),
      shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || '',
      wechatVersion: wxWork ? wxWorkStr : 'wechat',
      nickName,
      avatarUrl
    };
    const friendCircleParam = Object.assign({}, shareParam, {
      utm_source: wxWork ?  `${wxWorkStr}_${UTM_SOURCE_LINK}` : UTM_SOURCE_LINK,
      avatarUrl: '',
      nickName: '',
      shareDevice: '',
      devFlag: ''
    });
    const friendCircleParamStr = objToQuery(friendCircleParam).replace(/\?/g, '')
    if(link){
      return friendCircleParamStr
    }
    return shareParam
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.closeTip();
    this.updateCount(shareUser);
    this.copyText();
    const {newId, bookDetail} = this.data;
    const {pageTitle, templateId, coverPic = '', id} = bookDetail;
    const timeStamp = Date.now();
    const shareId = newId || id;
    const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    app.gioTrack('wemall_shopperbindShare', {
      STAFF_NO: employeeId,
      count_Type: '种草视频',
      share_ID: shareId,
      share_Name: pageTitle,
    })
    app._collectData2({
      eventName: `分享给顾客种草视频_${shareId}_${pageTitle}_${timeStamp}_${templateId || shareId}`,
      eventValue: '对话框',
      ...this.shareParam()
    })
    const path = sharePath + objToQuery(this.shareParam());
    return {
      title: pageTitle,
      path,
      imageUrl: coverPic
    }
  }
});
