import {EVENTS,KEYSTORAGE} from '../../../../src/const'
import events from "../../../../src/events";
import {splitGameImg} from '../../../../utils/utils'
import {searchUser,createUser,activiGameTime,addZhuli} from '../netWorking'
var isCreateUser = false

var userData = {}
const app = getApp()
const brand = getApp().config.brand


const splashImgList = [
  {
    scale: 5622,
    img: splitGameImg('help_bg_six_new.jpg', 'jumpGame0501'), // 375/603 iphone 7
    iconTop: "11%",
    startBottom: '10%'
  },
  {
    scale: 4681,
    img: splitGameImg('help_bg_x_new.jpg', 'jumpGame0501'),  // 375/724 iphoneX
    iconTop: "12.3%",
    startBottom: '20%'
  },
  {
    scale: 5064,
    img: splitGameImg('help_bg_x_new.jpg', 'jumpGame0501'),   // 393/776  redMi Pro 8
    iconTop: "12.3%",
    startBottom: '20%'
  }
];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    zhanweiView : false,
    myIcon : '',
    otherIcon : '',
    friendName: '',
    adapter: {
      img: splitGameImg('help_bg_x_new.jpg', 'jumpGame0501'),  // 375/724 iphoneX
      iconTop: "12.3%",
      startBottom: '20%'
    }
  },

  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {
  if (type == EVENTS.EVENT_GAMECRMINFO && event) {
    //  获取手机号成功
    this.nextTap()
  } 
 },

nextTap(callback){
  let {zhanweiView,myIcon,otherIcon, friendName} = this.data;
  
  zhanweiView = false
  this.setData({zhanweiView})

  isCreateUser = false

  let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
  let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)

  myIcon = wxInfo.avatarUrl
  otherIcon = userData.picUrl
  friendName = userData.friendName

  this.setData({myIcon, otherIcon, friendName})

  let params = `openId=${wxInfo.openId}`
  console.log(`crm信息助力页:${JSON.stringify(userInfo)}`)
  searchUser(params).then(e=>{
    if (!e){
      // 创建新用户
      if(!userInfo || !userInfo.phone){
        wx.clearStorageSync();
        app.navigateTo('member/login/login?game=true')
        return;
      }
      let json = {
        phone : userInfo.phone,
        openid : wxInfo.openId,
        facePic : wxInfo.avatarUrl,
        nickName : wxInfo.nickName,
        points : 0,
        memberno : userInfo.memberno
      }

      createUser(json).then(res =>{
        // console.log(`创建用户信息:${JSON.stringify(res)}`)
        isCreateUser = true
        if (callback){
          callback()
        }
      })
    }
    else{
      // console.log(`查询用户信息:${JSON.stringify(e)}`)
      isCreateUser = true
      if (callback){
        callback()
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    app.setUtmOptions(options)
    isCreateUser = false

    userData.userid = options.userid
    userData.picUrl = options.picUrl
    userData.openid = options.openid
    userData.friendName = options.nickName

    let shareBy = options.share_by
    let shareByShop = options.share_by_shop

    let orderSaveShare = {
      shareBy,
      shareByShop
    };
    getApp().setShareInfo(orderSaveShare);
  },
  // 返回
  backTap(){
    console.log(`返回`)

    var pageList = getCurrentPages();
    if (pageList.length > 1){
      wx.navigateBack({
        delta: 1
      });
    }
    else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    }  
  },
  goHome(){

    wx.switchTab({
      url: '/pages/index/index'
    })
    
  },

  tiaozhan(){

    if (userData.openid == ''){
      wx.showModal({
        title: '提示',
        content: '分享参数有误,请重新分享',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F'
      });
      return
    }
    

    if (!isCreateUser){
      this.nextTap(() => {
        console.log(`调用查询或创建用户完成`)
        this.goWelCome()
      })
    }
    else{
      this.goWelCome()
    }
  },
  goWelCome(){

    activiGameTime().then(res => {
      // console.log(`活动时间:${JSON.stringify(res)}`)
      let currentTime = new Date().getTime()
      let startTime = new Date(res.activityStartTime.replace(/-/g,'/')).getTime()
      let endTime = new Date(res.activityEndTime.replace(/-/g,'/')).getTime()


      if (currentTime > startTime && currentTime < endTime){
        // 活动开启

        let openID = wx.getStorageSync('wxOpenID');
        // 助力
        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let json = {
          userid : userData.userid,
          friendOpenid : openID,
          friendFacePic : wxInfo.avatarUrl,
          nickName : escape(wxInfo.nickName)
        }
        addZhuli(json).then(res => {})
        
        wx.redirectTo({
          url: '../welcome/index'
        })

      }
      else{
        let _this = this
        wx.showModal({
          title: '提示',
          content: '活动已结束',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              _this.backTap()
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
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
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    setTimeout(() => {
      wx.hideLoading();
      if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
        app.navigateTo('member/login/login?game=true')
        return;
      }
      else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
        _this.nextTap()
      }
    }, 1000);
  },


  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let adapter = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          adapter = item
        }
      });
      if(adapter){
        that.setData({
          adapter
        })
        console.log(that.data.adapter,'***init');
      }
    }catch (e) {}
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

  }
})