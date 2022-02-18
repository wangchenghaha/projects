
import { splitImg } from '../../../utils/utils'
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import {searchUser,createUser} from '../netWork'
const app = getApp();
let timer = null;
var splashImgList = [];
var type = ''
// 控制查询创建接口只掉1次
var canSearchUserInfo = true
Page({
  data: {
    time_value : 3,
    splashImg: '',
    logoJson : {
      top : 'VERO MODA',
      center : '「霓虹光影」 限时快闪店',
      bottom : '杭州站'
    }
  },
  getSystemInfo: function(){

    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100 && splashImg == ''){
          splashImg = item.img
        }
      });
      if(splashImg){
        this.setData({
          splashImg: `${splashImg}`
        })
        console.log(this.data.splashImg,'***init');
      }
      else{
        this.setData({
          splashImg: `${splashImgList[1].img}`
        })
        console.log(this.data.splashImg,'***init00000');
      }
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    canSearchUserInfo = true
    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);

    type = options.type
    wx.setStorageSync('flashShopType', type);

    const  version = Date.now();

    let logoJson = this.data.logoJson
    if (type == 'shanghai'){
      logoJson.bottom = '上海站'
    }
    else if (type == 'changzhou'){
      logoJson.bottom = '常州站'
    }
    else if (type == 'xining'){
      logoJson.bottom = '西宁站'
    }
    else if (type == 'hefei'){
      logoJson.bottom = '合肥站'
    }
    else if (type == 'dandong'){
      logoJson.bottom = '丹东站'
    }
    else if (type == 'beijing'){
      logoJson.bottom = '北京站'
    }
    this.setData({logoJson})

    // 图片路径：https://cdn.bestseller.com.cn/assets/common/VEROMODA/image/flashShop750_hangzhou.jpg?v=1603453786171
    splashImgList = [
      {
        scale: 5622,
        img: splitImg(`flashShop750.jpg?v=${version}`), // 375/667 iphone 7
      },
      {
        scale: 4618,
        img: splitImg(`flashShop1125.jpg?v=${version}`),  // 375/812 iphoneX
      },
      {
        scale: 4620,
        img: splitImg(`flashShop828.jpg?v=${version}`),   // 414/896  iphoneXR
      },
    
    ];

    this.getSystemInfo();
    // wx.hideLoading();
    // wx.setNavigationBarTitle({ title: getApp().config.title })//页面标题
    // app.setUtmOptions(options);
  },
  /**
  * 订阅的事件回调
  */
handleEvent: function (event, type) {

  if (type === EVENTS.EVENT_401 && event){

    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    canSearchUserInfo = true
    setTimeout(() => {
      this.gotoIndex()
    }, 5000);
  }
  else if (type == EVENTS.EVENT_LOGINED && event){

    this.gotoIndex()

  }

  else if (type === EVENTS.EVENT_CRMINFO && event){
    //  获取手机号成功
    this.gotoIndex()
  }
},
  // 倒计时
  timeDown: function(){
    let _timeValue = this.data.time_value;
    timer = setInterval(() =>{
      _timeValue-=1;
      if(_timeValue<=0){
        this.setData({time_value: 0});
        this.gotoIndex()
      }else{
        this.setData({time_value: _timeValue});
      }
    },1000);
  },

  gotoIndex: function(){
    if (timer){
      clearInterval(timer);
    }
    
    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
      getApp().checkLogin()
    }
    else{
      if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        if (!wx.getStorageSync('isMember')){

          wx.redirectTo({
            url: '../register/register'
          });
    
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
        if (canSearchUserInfo){
          canSearchUserInfo = false

          // 调用查询并创建接口
          let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
          let json = {
            openid : app.getOpenId(),
            phone : userInfo.phone,
            location : type
          }
          searchUser(json).then(res => {
            console.log(`查询用户:${JSON.stringify(res)}`)
            if (res){
              // 已有用户
              this.goNextPath(res)
            }
            else{
              // 创建用户
              json = {
                location : type,
                memberno : userInfo.memberno,
                openid : app.getOpenId(),
                phone : userInfo.phone,
                unionid : userInfo.unionid
              }
              createUser(json).then(res => {
                console.log(`创建用户:${JSON.stringify(res)}`)
                this.goNextPath(res)
              })
            }
          })


        }
      }
    }

    
  },
  goNextPath(res){
    wx.setStorageSync('flashShopUserInfo', res);

    if (type == 'hangzhou' || type == 'shanghai' || type == 'beijing'){
      wx.redirectTo({
        url: '../questions/questions'
      });
    }
    else{
      wx.redirectTo({
        url: '../otherQuestion/otherQuestion'
      });
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.timeDown();

    if (this.data.time_value == 0){
      this.gotoIndex()

    }
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