import {splitGameImg} from '../../../utils/utils'
import { getGameConfig, getUserInfo, createUser, friendHelp} from '../../service/sharpEyes'
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events"
import { wxSubscription } from '../../../utils/wxSubscribe'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameBg: splitGameImg('help_bg.jpg','sharpEyes'),
    userData: '',
    userid:'',
    gameData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    app.setUtmOptions(options)
    this.setData({
      userid: options.userid
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
    let _this = this
    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
        app.navigateTo('member/login/login?game=true')
        return;
      }
      else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
        _this.requestData();
      }
     
    }, 1000);
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
  

  requestData() {
    getGameConfig().then(e => {
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

  onClick: function(e){
    this._helpAndStart();
  },

  _helpAndStart(){
    let openID = wx.getStorageSync('wxOpenID');
    // 助力
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let json = {
      userId: this.data.userid,
      friendOpenid : openID,
      friendFacePic : wxInfo.avatarUrl,
      nickName : escape(wxInfo.nickName)
    }
    friendHelp(json).then(res =>{
      this._startGame();
    }).catch(err =>{
      this._startGame();
    })
  },

  _startGame(){
    wx.navigateTo({
      url: '../main/main'
    })
  },

})