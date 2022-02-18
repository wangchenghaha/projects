// activity//courierGame/help/help.js
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import {getGameTime,searUserInfo,createUser,addZhuli} from "../../service/courierNet"
const brand = getApp().config.brand
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/courierImgs/`
const version = Date.now();
var splashImgList = [

  {
    scale: 5622,
    img: `${imgPath}zhuli750.jpg?v=${version}`, // 375/667 iphone 7
    adapter : 0
  },
  {
    scale: 4618,
    img: `${imgPath}zhuli1125.jpg?v=${version}`,  // 375/812 iphoneX
    adapter : 1
  }

];
// 区分点击事件
var tapType = ''
var isCreateUser = false
var startTime = 0
var endTime = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    zhanweiView : false,
    splashImg: '',
    zhuli : false,

    userData : {},
    adapter : 0,


    zhuliBgImg : '',
    bouncedBtn : ''


  },

  getSystemInfo: function(){
    
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
      let adapter = 0
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100 && splashImg == ''){
          splashImg = item.img
          adapter = item.adapter
        }
      });
      if(splashImg){
        this.setData({
          splashImg: `${splashImg}`,
          adapter : `${adapter}`
        })
        console.log(this.data.splashImg,'***init');
      }
      else{
        this.setData({
          splashImg: `${splashImgList[1].img}`,
          adapter: `${splashImgList[1].adapter}`
        })
        console.log(this.data.splashImg,'***init00000');
      }
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    isCreateUser = false
    tapType = ''
    startTime = 0
    endTime = 0
    
    if (options.params){
      let json = JSON.parse(options.params)
      let userData = this.data.userData
      userData.userid = json.userid
      userData.picUrl = json.picUrl
      userData.nickName = json.nickName
      userData.openid = json.openid
      this.setData({userData})

  
  
      let shareBy = json.share_by
      let shareByShop = json.share_by_shop
  
      let utmJson = {
        utm_source: json.utm_source,
        utm_medium: json.utm_medium,
        utm_term: json.utm_term,
        utm_campaign: json.utm_campaign
      }
      let collectParam = Object.assign(utmJson, { eventName: `打开拆快递助力页_${json.userid}` });
      getApp()._collectData2(collectParam)
        
      events.register(this, EVENTS.EVENT_401);
      events.register(this, EVENTS.EVENT_LOGINED);
      events.register(this, EVENTS.EVENT_CRMINFO);
  
      let orderSaveShare = {
        shareBy,
        shareByShop
      };
      getApp().setShareInfo(orderSaveShare);
    }

    let zhuliBgImg = this.data.zhuliBgImg
    let bouncedBtn = this.data.bouncedBtn
    zhuliBgImg = `${imgPath}zhuliImg.png?v=${version}`
    bouncedBtn = `${imgPath}bouncedBtn.png?v=${version}`

    this.setData({
      zhuliBgImg,
      bouncedBtn
    })
    this.getSystemInfo()
  },
  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    this.setData({zhanweiView : true})
    setTimeout(() => {
      this.nextTap()
    }, 5000);
  }
  else if (type == EVENTS.EVENT_LOGINED && event){
    if (!wx.getStorageSync('isMember')){
      getApp().isMemberETO()
    }
    else{
      
      setTimeout(() => {
        getApp().getCRMInfoFn()
      }, 2000);
    }
  }
  else if (type === EVENTS.EVENT_CRMINFO && event){
     //  获取手机号成功
     this.nextTap()
  }
},
  tapss(e){
    this.setData({zhanweiView : true})
    let type = e.currentTarget.dataset.type
    tapType = type


    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
      getApp().checkLogin()
    }
    else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
      console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{
        setTimeout(() => {
          getApp().getCRMInfoFn()
        }, 2000);
      }
    }
    else{
      this.nextTap()
    }
  },
  nextTap(){
    this.setData({zhanweiView : false})
    if (tapType == ''){
      return
    }

    if (isCreateUser){
      this.makeUserData()
    }
    else{
      if (startTime == 0 && endTime == 0){
        getGameTime().then(e => {
    
          endTime = new Date(e.activityEndTime.replace(/-/g,'/')).getTime()
          startTime = new Date(e.activityStartTime.replace(/-/g,'/')).getTime()
          

            var openID = wx.getStorageSync('wxOpenID');
        
            searUserInfo({openId : openID}).then(res => {
              if (!res){
                
            let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
            let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
            let phone = userInfo.phone
            if (phone.length == 12){
              phone = phone.substr(0,11)
            }
        
                // 创建用户
                let json = {
                  phone : phone,
                  openid : openID,
                  nickName : wxInfo.nickName,
                  facePic : wxInfo.avatarUrl,
                  memberno : userInfo.memberno
                }
                createUser(json).then(res => {
                  isCreateUser = true
                  this.makeUserData()
                })
        
              }
              else{
                isCreateUser = true
                this.makeUserData()
              }
            })

        })
      }
  

    }
  },



    // 封装用户数据
    makeUserData(){

      let currentTime = new Date().getTime()
      if (startTime > currentTime || currentTime > endTime){
        wx.showModal({
          title: '提示',
          content: '不在活动时间范围内',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F'
        });
        tapType = ''
        return

      }
      
      let openID = wx.getStorageSync('wxOpenID');
      // openID = 'olJQ95dBU6M8Oxici-MNb-bTFAos' 闫宁的 olJQ95W1ixdez3TcSk_iiZvP8HWI 小黑的
      if (this.data.userData.openid == ''){
        wx.showModal({
          title: '提示',
          content: '分享参数有误,请重新分享',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F'
        });
        tapType = ''
        return
      }

      if (tapType == 'help'){
          if (this.data.userData.openid == openID){
          wx.showToast({
            title: '自己不能给自己助力哦~',
            icon: 'none'
          });
          tapType = ''
          return
        }
  
        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let json = {
          userid : this.data.userData.userid,
          friendOpenid : openID,
          friendFacePic : wxInfo.avatarUrl,
          nickName : escape(wxInfo.nickName)
        }
        addZhuli(json).then(res => {
          this.setData({
            zhuli : true
          })
        })
      }
      else if (tapType == 'game'){
  
        wx.redirectTo({
          url: '../welCome/welCome'
        });
      }
      tapType = ''

      
    },

  closed(){
    this.setData({
      zhuli : false
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