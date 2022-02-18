import {getIndexPage, homePage} from "../../service/mini";
import { splitImg } from '../../utils/utils'
import { getConfigJSON } from '../../service/init'
const { KEYSTORAGE } = require('../../src/const.js');
const app = getApp();
let timer = null;
let splashTemp = splitImg('splash-3.jpg'); // 不带版本号的图
const imgVersion = wx.getStorageSync(KEYSTORAGE.splashImgVersion)
const splashImgList = [
  {
    scale: 6218,
    img: splitImg('splash-4.jpg'), // 375/603 iphone 7
  },
  {
    scale: 5179,
    img: splitImg('splash-3.jpg'),  // 375/724 iphoneX
  },
  {
    scale: 5064,
    img: splitImg('splash-2.jpg'),   // 393/776  redMi Pro 8
  },
  // {
  //   scale: 5527,
  //   img: splitImg('splash-3.jpg?v=1'),
  // }

];
Page({
  data: {
    time_value : 2,
    splashImg: `${splashTemp}?v=${imgVersion}`,
    welcome: {},
    // 是否同意隐私政策
    showPrivacy: true,
  },
  getSystemInfo: function(){
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
        splashTemp = splashImg;
        const version =  wx.getStorageSync(KEYSTORAGE.splashImgVersion);
        this.setData({
          splashImg: `${splashImg}?v=${version}`
        })
        console.log(this.data.splashImg,'***init');
      }
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getConfig();
    this.getMainJson();
    this.getSystemInfo();
    // wx.hideLoading();
    wx.setNavigationBarTitle({ title: getApp().config.title })//页面标题
    app.setUtmOptions(options);
  },
  // 获取首页JOSN文件
  getMainJson: function () {
    if(app.homePageCache()){
      return
    }
    homePage().then(res => {
      wx.setStorageSync('indexData', res);
    })
  },
  getConfig() {
    getConfigJSON().then(res => {
      if (res) {
        let {splashImg} = this.data;
        const {welcome = {}, splashList = []} = res;
        if(splashList.length){
          for(let item of splashList){
            if(splashImg.includes(item.name)){
              console.log(item.splashImgUrl,"***");
              splashImg = item.splashImgUrl;
              break;
            }
          }
        }
        if(splashImg.includes('=')){
          const  version = splashImg.split('=')[1] || Date.now();
          wx.setStorageSync(KEYSTORAGE.splashImgVersion, version)
        }
        this.setData({ welcome, splashList, splashImg })
        console.log(this.data.splashImg,'***req');
      }
    })
  },
  // 倒计时
  timeDown(){
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
    clearInterval(timer);
    app.gioTrack('pageclick_home_fullsreen')
    app.goBack();
  },
  onClick() {
    const { welcome } = this.data;
    const { linkUrl } = welcome;
    if (welcome.isJump) {
      if (linkUrl) {
        clearInterval(timer);
        app.gioTrack('pageclick_home_fullsreen_slide', {
          url: linkUrl
        })
        app.navigateTo(linkUrl);
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 隐私政策
    const agreePrivacy = wx.getStorageSync(KEYSTORAGE.AGREE_PRIVACY);
    this.setData({
      showPrivacy: agreePrivacy,
    });
    if(agreePrivacy){
      this.timeDown();
    }

    app.track()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
