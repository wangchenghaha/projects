import {splitGameImg } from '../../../../utils/utils'
import {EVENTS, KEYSTORAGE} from '../../../../src/const'
import events from "../../../../src/events"
import {getGameTime, getUserInfo, createUser,friendHelp} from '../../../service/springOuting'
import { wxShowToast } from '../../../../utils/wxMethods'
const app = getApp();
let shareData = {};

const splashImgList = [
  {
    scale: 5622,
    img: splitGameImg('spring_help_six.jpg', 'springOuting'), // 375/603 iphone 7
    helpTop: '1056rpx',
    playTop: '1180rpx',
    ruleTop: '120rpx',
    txtTop: '384rpx'
  },
  {
    scale: 4681,
    img: splitGameImg('spring_help_x.jpg?v=1', 'springOuting'),  // 375/724 iphoneX
    helpTop: '1242rpx',
    playTop: '1380rpx',
    ruleTop: '200rpx',
    txtTop: '522rpx'
  },
  {
    scale: 5064,
    img: splitGameImg('spring_help_x.jpg', 'springOuting'),   // 393/776  redMi Pro 8
    helpTop: '1242rpx',
    playTop: '1380rpx',
    ruleTop: '200rpx',
    txtTop: '522rpx'
  },
];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpbg: splitGameImg('spring_help_x.jpg','springOuting'),
    rulebg:  splitGameImg('rule_bg.png','springOuting'),
    isShowRule: false,
    ruleContent: [{title: '规则一',
                  contents: '春风和煦，踏青的季节又到啦~ 通过点击屏幕“左侧”或“右侧”控制游戏角色不断向上跳跃，遇到礼物方块可获得神秘奖励，也有可能遇到前来阻碍的小动物注意躲避哦~积累步数还可获得成就奖励，快去探险吧！' },
                  {title: '规则二',
                  contents: '每名用户每天有3次踏青机会，3次机会用完后，可以邀请好友助力获得额外次数。每邀请1人将额外获得1次踏青机会，每位好友仅可给同一人助力一次。'},
                  {title: '规则三',
                  contents: '获得的奖励可在“我的奖品”页面查看，实际金额以页面显示为准。' },
                  {title: '规则四',
                  contents: '奖品数量有限，先到先得。' }],
    tan_close: splitGameImg('close_toast.png','springOuting'), 
    isBrandShow: true,
    helpTop: '1242rpx',
    playTop: '1380rpx',
    ruleTop: '200rpx',
    txtTop: '522rpx'        
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    app.setUtmOptions(options)
    shareData = options
    console.log("shareData =========== ", shareData);
    let {isBrandShow} = this.data
    if(app.config.brand === 'ONLY' || app.config.brand === 'SELECTED' || app.config.brand === 'FOL'){
      isBrandShow = true
    } else {
      isBrandShow = false
    }
    this.setData({
      isBrandShow
    })

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
    this.getSystemInfo();
    if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
      app.navigateTo('member/login/login?game=true')
      return;
    }
    else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
      this.requestData();
    }
  },

  
  /**
 * 接受授权成功刷新页面
 */
   handleEvent: function (event, type) {
    if (type == EVENTS.EVENT_GAMECRMINFO && event) {
      //  获取手机号成功
      this.requestData()
  } 
  },


  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let helpbg = '', helpTop = '', playTop= '', ruleTop = '', txtTop = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          helpbg = item.img,
          helpTop = item.helpTop,
          playTop = item.playTop,
          ruleTop = item.ruleTop,
          txtTop = item.txtTop
        }
      });
      if(helpbg){
        that.setData({
          helpbg,
          helpTop,
          playTop,
          ruleTop,
          txtTop
        })
        console.log(that.data.helpbg,'***init');
      }
    }catch (e) {}
  },
  
  requestData() {
    getGameTime().then(e => {
      let endTime = new Date(e.activityEndTime.replace(/-/g, '/')).getTime()
      let startTime = new Date(e.activityStartTime.replace(/-/g, '/')).getTime()
      let curTimes = Date.parse(new Date());  
      if(curTimes < startTime || curTimes > endTime){
        wx.showModal({
          title: '提示',
          content: "不在活动时间范围内!",
          showCancel: false,
          success: function (res) {
            app.goBack();
          }
        });
        return;
      } else {
        this.userInfo()
      }
      
    })
   
  },

  userInfo() {
    let openID = wx.getStorageSync('wxOpenID');
    let {userData} = this.data
    getUserInfo(openID).then(res => {
      if (!res) {
        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
        let phone = userInfo.phone
        if (phone.length == 12) {
          phone = phone.substr(0, 11)
        }
        // 创建用户
        let json = {
          phone: phone,
          openid: openID,
          nickName: wxInfo.nickName,
          facePic: wxInfo.avatarUrl,
          memberno: userInfo.memberno,
          crmCreatedTime: userInfo.joindate
        }
        
        createUser(json).then(res => {
          userData = res
          this.setData({userData})
        })
      } else {
        userData = res
        this.setData({userData});
      }
    })
  },

  onClick(e){
    let type = e.currentTarget.dataset.type;
    switch(type){
      case 'startGame':
        wx.navigateTo({
          url: '../main/main'
        })
        break;
      case 'help':
        this._helpFriends();
        break;
      case 'rule':
        this.setData({
          isShowRule: true
        })
        break;
      case 'tan_close':
        this.setData({
          isShowRule: false
        })
        break;    
    }
  },

  _helpFriends(){
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let openID = wx.getStorageSync('wxOpenID');
    let jsData = {
      friendOpenid: openID,
      nickName: wxInfo.nickName,
      friendFacePic: wxInfo.avatarUrl,
      userid: shareData.userid
    }
    friendHelp(jsData).then(res =>{
      if(res){
        wxShowToast("WOW太给力了，小伙伴助力成功啦，再次启程吧！");
      }
    }).catch(err =>{
      this.setData({
       
      })
    })
  },
 
})