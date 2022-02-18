import {splitImg, formatDate} from '../../utils/utils'
import {KEYSTORAGE} from "../../src/const";
import {liveRoom} from "../../service/livePlayer";
const app = getApp();
const {homeLiveReplay, homeLiveCount, brand,ETO_BRAND } = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showGoTop: Boolean,
    isHomePageLive: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showNickName:false,
    nickName: '',
    rightList: [
      {
        icon: splitImg('icon_gotop.png', 'common'),
        text: '返回',
        eventName: 'goTop',
        show: false,
        always: true,
      },
      /*{
        always: true,
        icon: splitImg('icon_live.png', 'common'),
        text: '直播',
        show: true,
      },*/
      {
        type: 'share',
        icon: splitImg('icon_home_share.png', 'common'),
        text: '转发'
      },
      {
        always: true,
        icon: splitImg('icon_msg.png', 'common'),
        text: '客服',
        eventName: 'showServe',
        show: true,
        showContact: brand === 'FOL',
      },
      {
        icon: splitImg('icon_close.png', 'common'),
        text: '',
        eventName: 'changeShow'
      },
      {
        icon: splitImg('icon_more.png', 'common'),
        text: '更多',
        show: true,
        eventName: 'changeShow'
      }
    ]
  },
  lifetimes: {
    ready(){
      const {showGoTop} = this.properties;
      this.getLiveRoom();
      this.getCurGuideInfo();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回顶部
    goTop(){
      app.gioTrack('pageclick_home_totop')
      this.triggerEvent('goTop')
    },
    showServe(){
      app.gioTrack('pageclick_home_customerservice');
      if(brand === 'FOL'){
        return
      }
      this.triggerEvent('showServe')
    },
    changeShow(){
      const {rightList} = this.data;
      rightList.forEach(item => {
        if(!item.always){
          item.show = !item.show
        }
        // item.show = item.always || !item.show;
      });
      this.setData({rightList})
    },
    // 获取当前导购昵称
    getCurGuideInfo: function(){
      let curGuideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
      if(curGuideInfo && curGuideInfo.nickName){
        const {rightList} = this.data;
        const listItem ={
          icon: splitImg('icon_personal.png', 'common'),
          text: '专属',
          eventName: 'showGuide'
        };
        rightList.splice(rightList.length - 2, 0 , listItem);

        this.setData({
          nickName: curGuideInfo.nickName,
          rightList
        })
      }
    },
    close(){
      this.setData({
        showNickName: false
      })
    },
    showGuide(){
      this.setData({
        showNickName: true
      })
    },
    getLiveRoom(){
      liveRoom().then(res => {
        if(res && res.errcode === 0){
          const room_info = res.room_info;
          if(room_info && Array.isArray(room_info) && room_info.length){
            // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常;
            const livePlayer = 102, living = 101;
            const roomInfo = room_info.filter(item => item.live_status === livePlayer || item.live_status === living).slice(0, homeLiveCount);
            const endRoomInfo = room_info.filter(item => item.live_status === 103);
            if(roomInfo.length){
              roomInfo.forEach(item => {
                item.text = item.live_status === livePlayer ? '即将直播' : '直播中';
              });
            }
            if(homeLiveReplay){
              let livingSize = roomInfo.filter(item => item.live_status === living).length;
              if(!roomInfo.length || !livingSize){
                if(endRoomInfo.length){
                  const firstEndRoom = endRoomInfo[0];
                  firstEndRoom.text = '直播回放';
                  roomInfo.push(firstEndRoom)
                }
              }
            }
            this.setData({ roomInfo, });
          }
        }
      }).then(id => {
        if(id){
          // this.getReplay(id);
        }
      }).catch(err => console.log(err))
    },
    goLiveRoom(e){
      const roomId = e.currentTarget.dataset.room;
      const {roomInfo} = this.data;
      const curRoom = roomInfo.filter(item => item.roomid === roomId)[0];
      const startTime = formatDate(curRoom.start_time * 1000, '');
      const utmOptions = {
        utm_source: 'wx_zhibo',
        utm_medium: 'wx_zhibo',
        utm_campaign: `${startTime.replace(/-/g, '')}LIVE` || '',
        utm_term: `${ETO_BRAND[brand]}${roomId}` || '',
      };
      try {
        const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo) || {};
        app.gioTrack('pageclick_home_live', {
          LIVE_NAME: curRoom.name,
          LIVEID: roomId,
          LIVE_STATUS: curRoom.live_status,
          anchor_name: curRoom.anchor_name,
        })
        app.tdSdkEvent('pageclick_home_live', {
          直播名称: curRoom.name,
          LIVEID: `${ETO_BRAND[brand]}${curRoom.roomid}`,
          PHONE: crmInfo.phone || '',
          UTM_SOURCE:  utmOptions.utm_source,
          UTM_MEDIUM: utmOptions.utm_medium || '',
          UTM_TERM: utmOptions.utm_term || '',
          UTM_CAMPAIGN: utmOptions.utm_campaign || '',
          LIVE_STATUS: curRoom.live_status,
          PAGE: 'pages/index/index',
          FROM: '',
          STAFF_NO: '',
        });
      }catch (e) { }
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
        success(){
          wx.setStorageSync(KEYSTORAGE.roomId, roomId);
          wx.setStorageSync('roomName', curRoom.name || '');
          app.setUtmOptions(utmOptions);
          app.setRoomId(roomId, curRoom.start_time)
        }
      })
    },
  }
})
