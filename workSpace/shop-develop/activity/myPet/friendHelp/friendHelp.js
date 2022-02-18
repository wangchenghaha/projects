import {splitImg} from '../../../utils/utils'
import { addHelp } from '../service/pets'
import { KEYSTORAGE,EVENTS } from '../../../src/const.js'
import {wxShowToast} from '../../../utils/wxMethods'
import {queryUserPoints,  addUserPoints} from '../service/adopted'

import events from '../../../src/events';
const app = getApp();

const splashImgList = [
  {
    scale: 5622,
    img: splitImg('images/pet_help_bg_six.jpg', 'littlePet'), // 375/603 iphone 7
  },
  {
    scale: 4681,
    img: splitImg('images/pet_help_bg_x.jpg', 'littlePet'),  // 375/724 iphoneX
  },
  {
    scale: 5064,
    img: splitImg('images/pet_help_bg_x.jpg', 'littlePet'),   // 393/776  redMi Pro 8
  },
];

// 控制点击
var canTap = true
// 区分点击
var touchType = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    splashImg: splitImg('images/pet_help_bg_x.jpg', 'littlePet'), 
    helpBtn: splitImg('images/help_btn.png', 'littlePet'), 
    playBtn: splitImg('images/play_btn.png', 'littlePet'), 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    canTap = true
    touchType = ''

    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    this.setData({
      userId : options.userId
    })
    this.getSystemInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  _addHelp: function(){
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let jsData = {
      userid: this.data.userId,
      friendOpenid: app.getOpenId(),
      friendFacePic: wxInfo.avatarUrl || '',
      nickName: wxInfo.nickName || '',
    }
    console.log("***********", jsData)
    addHelp(jsData).then(res =>{
      console.log("*********** ========= ", res)
      wxShowToast("谢谢你帮主人喂我，我要开动啦~");
    }).catch(err=>{
      wxShowToast(err)
    })
  },
  
  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          splashImg = item.img
        }
      });
      if(splashImg){
        that.setData({
          splashImg
        })
        console.log(that.data.splashImg,'***init');
      }
    }catch (e) {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  helpBtn: function(){
    queryUserPoints(app.getOpenId()).then(res =>{
      if(res){
        this._addHelp();
      }else{
         this._addUserPoints();
      }
    })
   
  },

  playBtn: function(){
    queryUserPoints(app.getOpenId()).then(res =>{
      if(res.petInfo){
        wx.navigateTo({
          url: '../myPet/myPet',
        })
      }else{
        wx.navigateTo({
          url: '../adoptPet/adoptPet',
        })
      }
    })
  },

  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{

        wx.showLoading({
          title: '加载中……',
          mask: true
        });
        setTimeout(() => {
          wx.hideLoading();
          getApp().getCRMInfoFn()
        }, 2000);

      }
    }
    else if (type === EVENTS.EVENT_CRMINFO){
      this.nextTap()

    }
  },
  checkCRM(e){
    if (canTap){
      canTap = false
      touchType = e.currentTarget.dataset.type

      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
      else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{

          wx.showLoading({
            title: '加载中……',
            mask: true
          });
          setTimeout(() => {
            wx.hideLoading();
            getApp().getCRMInfoFn()
          }, 2000);

        }
      }
      else{
        
          this.nextTap()

      }

    }

  },
  nextTap(){
    canTap = true
    if (touchType == 'help'){
      this.helpBtn()
    }
    else if (touchType == 'play'){
      this.playBtn()
    }
  },

  _addUserPoints: function(){
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let jsData = {
      "phone": crmInfo.phone || '',
      "openid": app.getOpenId(),
      "nickName": wxInfo.nickName || '',
      "facePic": wxInfo.avatarUrl || '',
      "memberno": crmInfo.memberno || '',
    }
    addUserPoints(jsData).then(res => {
      if(res){
        this._addHelp();
      }
    }).catch(err=>{
      wxShowToast(err)
    })
  },


})