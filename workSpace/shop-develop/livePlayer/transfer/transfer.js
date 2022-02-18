import {wxShowToast} from "../../utils/wxMethods";
import {KEYSTORAGE} from "../../src/const";
import {liveRoom, shareLiveDetail, shareLiveCount} from "../../service/livePlayer";
import {getDAInfo} from "../../service/guide";
const app = getApp();
const {cdn, brand, ETO_BRAND, WX_WORK} = app.config
let curOptions = {};
const utmArr = [
  {
    utm_medium: 'WEMALL',
    utm_source: 'SYLL',
    utm_term: `${ETO_BRAND[brand]}SHARE01`,
    utm_campaign: '20200428LIVE',
  },
  {
    utm_medium: 'WEIBO',
    utm_source: 'FST',
    utm_term: `${ETO_BRAND[brand]}WEIBO01`,
    utm_campaign: '20200428LIVE',
  },
  {
    utm_medium: 'WEIBODL',
    utm_source: 'DENGLUN',
    utm_term: `${ETO_BRAND[brand]}WEIBODL01`,
    utm_campaign: '20200428LIVE',
  },
  {
    utm_medium: 'DOUYIN',
    utm_source: 'DENGLUN',
    utm_term: `${ETO_BRAND[brand]}DOUYIN01`,
    utm_campaign: '20200428LIVE',
  },
  {
    utm_medium: 'SMS',
    utm_source: 'DMP',
    utm_term: `${ETO_BRAND[brand]}SMS01`,
    utm_campaign: '20200428LIVE',
  },
  {
    utm_medium: 'DEFAULT',
    utm_source: 'DEFAULT',
    utm_term: `${ETO_BRAND[brand]}DEFAULT`,
    utm_campaign: '20200428LIVE',
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // pages/whitePage/whitePage?channel=channel5e99574623972&delivery_id=2767
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'transfer**');
    curOptions = options;
    this.handleOptions();
  },
  collect(id, type, utmObj){
    console.log(id,'id*******')
    app._collectData2(Object.assign(utmObj, {
      eventName: `打开直播模板_${id}`,
      eventValue: type === 'shareUser' ? '对话框' : '朋友圈'
    }));
  },
  handleOptions(){
    // curOptions.scene = 'sf%3D423946_cp%3D20200428LIVE_NO%3D1';
    let {scene, shareId, share_by = '', roomId = '', utm_source = '', utm_term = ''} = curOptions;
    if(scene){
      // 二维码进入
      scene = decodeURIComponent(scene);
      // const scene = 'sf=423946_id=1274967678724849665';
      console.log(scene,'***');
      const sceneArr = scene.split('_');
      const sceneObj = {};
      sceneArr.forEach(item => {
        if(item.includes('=')){
          const itemArr = item.split('=');
          sceneObj[itemArr[0]] = itemArr[1]
        }
      });
      // 计算导购业绩
      if((sceneObj.sf && sceneObj.sf.length === 6) || (sceneObj.s && sceneObj.s.length === 6)){
        const DA = `DA00${sceneObj.sf || scene.s}`
        curOptions.share_by = DA;
        this.getGuideInfo(DA)
      }
      // 导购分享模板二维码
      if(sceneObj.id || sceneObj.d){
        const templateID = sceneObj.id || sceneObj.d;
        this.getShareLive(templateID);
        this.updateShareCount(templateID);
        const utmOptions = {
          utm_medium: 'guideshare',
          utm_source: 'zhibo_zhuanfa',
          utm_term: `${ETO_BRAND[brand]}${roomId}SHARE`,
          utm_campaign: templateID,
        }
        if(scene.endsWith('_Q')){
          utmOptions.utm_source = 'enterpise_wechat_zhibo_zhuanfa';
          wx.setStorageSync(KEYSTORAGE.devFlag, WX_WORK);
        }
        Object.assign(curOptions, utmOptions);
        app.setUtmOptions(utmOptions);
        try{
          this.collect(templateID, '', utmOptions)
        }catch(err){}
      }
      // 匹配对应的utm参数
      if(sceneObj.NO){
        const curUtm = utmArr[sceneObj.NO -1];
        Object.assign(curOptions, curUtm);
        app.setUtmOptions(curUtm);
      }
      return
    }
    console.log(utmArr[utmArr.length -1],'****');
    if(share_by){
      //分享进入
      app.setShareInfo(curOptions);
      curOptions.wxScene = wx.getStorageSync(KEYSTORAGE.wxScene);
      app.setUtmOptions(curOptions);
      if(roomId){
        this.getShareLive(roomId)
      }
    }
    if(shareId){
      this.updateShareCount(shareId);
      this.collect(shareId, 'shareUser', curOptions)
    }
    if(utm_source || utm_term){
      app.setUtmOptions(curOptions);
    }else{
      app.setUtmOptions(utmArr[utmArr.length -1]);
    }
    this.getLiveRoom(roomId);
  },
  getShareLive(id){
    shareLiveDetail(id).then(res => {
      if(res){
        const { roomId = ''} = res;
        curOptions.utm_term = `${ETO_BRAND[brand]}${roomId}SHARE`;
        app.setUtmOptions(curOptions);
        this.getLiveRoom(roomId);
      }
    }).catch(err => wxShowToast(err.message));
  },
  updateShareCount(id){
    const param = {
      id,
      openCount: 1
    }
    shareLiveCount(param).then(res => {

    }).catch(err => console.log(err.message))
  },
  getGuideInfo(DANum){
    getDAInfo(DANum).then(res => {
      if(res && res.staffId){
        const share = {
          share_by: res.staffId,
          share_by_shop: res.zzDpdm || '0000',
          wxScene: wx.getStorageSync(KEYSTORAGE.wxScene)
        };
        app.setShareInfo(share);
        // wx.setStorageSync('shareFromDaogouInfo', share);
        // wx.setStorageSync('openShareTime', Date.now())
      }
    })
  },
  getLiveRoom(roomId){
    liveRoom().then(res => {
      if(res && res.errcode === 0){
        if(res.room_info && res.room_info.length){
          // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常;
          const roomInfo = res.room_info;
          let curRoom = roomInfo[0];
          if(roomId){
            roomInfo.forEach(item => {
              if(item.roomid + '' === roomId + ''){
                curRoom = item;
              }
            })
          }
          this.goLiveRoom(curRoom);
        }
      }
    }).catch(err => console.log(err))
  },
  goLiveRoom(curRoom){
    const roomId = curRoom.roomid;
    this.tdEvent(curRoom);
    wx.redirectTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
      success(){
        wx.setStorageSync(KEYSTORAGE.roomId, roomId);
        wx.setStorageSync('roomName', curRoom.name || '');
        app.setRoomId(roomId, curRoom.start_time)
      },
      fail(err){
        console.log(err,'***')
      },
    });
  },

  tdEvent(roomInfo){
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    const {utm_source, utm_medium, utm_term, utm_campaign, share_by } = curOptions;
    const pages = getCurrentPages();
    let  beforePage = '', currentPage = 'livePlayer/transfer/transfer';
    if(pages && pages.length){
      if(pages.length >=2){
        beforePage = pages[pages.length - 2].route;
      }else{
        currentPage = pages[pages.length - 1].route;
      }
    }
    app.tdSdkEvent('pageclick_home_live', {
      直播名称: roomInfo.name,
      LIVEID: `${ETO_BRAND[brand]}${roomInfo.roomid}`,
      PHONE: crmInfo.phone || '',
      UTM_SOURCE:  utm_source || '',
      UTM_MEDIUM: utm_medium || '',
      UTM_TERM: utm_term || '',
      UTM_CAMPAIGN: utm_campaign || '',
      LIVE_STATUS: roomInfo.live_status,
      PAGE: currentPage,
      FROM: beforePage,
      STAFF_NO: share_by || '',
    });

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
