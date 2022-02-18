
// activity//tiggerGame/helpView/helpView.js
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import {addPoint,getActivityTime,searchUser,createUser} from '../netWorking'
import events from "../../../src/events";
import {zhuliAnimation} from '../zhuliAnimation'

const brand = getApp().config.brand;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    // 活动时间
    activityTimeJson : {},
    // 弹框
    canShow : false,
    // 保存好友openID等
    fridendData : {},
    // 助力筹码
    zhuliArrs : ['50','100','150','400','300','200'],
    // 恭喜文字
    points : '',
    // 可以关闭弹框
    canClose : false,
    // 注册中不能在注册
    isCreate : false


  },
  group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
  },
  // 规则说明
  guize : function(){
      wx.setStorageSync("lhjGZ", "3");
      wx.navigateTo({
        url: '../guizeView/guizeView'
      });
  },
  // 底部事件
  bottomTap : function(e){
    let type = e.detail
    if (type == 'left'){
      // 测试
      if (wx.getStorageSync(KEYSTORAGE.loginInfo)){

          if (wx.getStorageSync(KEYSTORAGE.crmInfo)){

            let activityTimeJson = this.data.activityTimeJson
            if (!activityTimeJson.starTime){
    
              getActivityTime().then(e => {
    
                activityTimeJson.startTime = e.activityStartTime
                activityTimeJson.endTime = e.activityEndTime
                this.setData({activityTimeJson})
                this.requst()
        
              })
            }

          }
          else{
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

      }
      else{
        getApp().checkLogin()
      }

    }
    else{
      wx.redirectTo({
        url: '../welCome/welCome'
      });
    }
  },
  // 助力请求
  requst:function(){
    if (!this.checkTimeOut()){

      let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);

      if (this.data.fridendData.openID == wxInfo.openId){
        wx.showToast({
          title: '不能给自己助力',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false
        });
        return
      }

      let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)

      let params = `openId=${wxInfo.openId}`
      searchUser(params).then(e=>{
        if (!e){
          // 创建新用户
          let json = {
            phone : userInfo.phone,
            openid : wxInfo.openId,
            facePic : wxInfo.avatarUrl,
            nickName : wxInfo.nickName,
            points : this.data.brand == 'FOL' ? 5000 : 600
          }

          if (this.data.isCreate){
            return
          }
          else{
            this.setData({isCreate : true})
          }
          createUser(json).then(e =>{
            this.setData({isCreate : false})
            // 
            this.zhuli()
          }).catch(err => {
            this.setData({isCreate : false})
          })
        }
        else{
          // 
            this.zhuli()
        }
      })

    }

  },
  // 助力
  zhuli(){

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let json = {
      userid : this.data.fridendData.userID,
      friendOpenid : wxInfo.openId,
      friendFacePic : wxInfo.avatarUrl,
      nickName : wxInfo.nickName
    }
    // console.log(`json:${JSON.stringify(json)}`)
    addPoint(json).then(e => {
      // console.log(`助力成功:${JSON.stringify(e)}`)
      // e.points
      let index = 0 
      if (brand == 'FOL'){
        var num = Math.floor(Math.random() * 10);
        if (parseInt(e.points) == 1000){
          index = 1
          if(num > 5){
            index = 5
          }

        }
        else if(parseInt(e.points) == 2000){
          index = 2
        }
        else if(parseInt(e.points) == 3000){
          index = 3
        }
        else if(parseInt(e.points) == 5000){
          index = 6
          if(num > 5){
            index = 4
          }
        }
      }
      else{

        if (parseInt(e.points) == 50){
          index = 1
        }
        else if(parseInt(e.points) == 100){
          index = 2
        }
        else if(parseInt(e.points) == 150){
          index = 3
        }
        else if(parseInt(e.points) == 200){
          index = 4
        }
        else if(parseInt(e.points) == 300){
          index = 5
        }
        else if(parseInt(e.points) == 400){
          index = 6
        }
      }
      this.setData({canShow : true,canClose : false,points : ''})

      new zhuliAnimation(this,{
        len : 6,
        ret : index,
        speed : 100,
        callBack : () => {
          // console.log(`动画结束`);
          this.setData({points : e.points})
          setTimeout(() => {
            this.setData({canClose : true})
          }, 500);
        }
      }).start()
    })
  },

  /**
  * 订阅的事件回调
  */
  handleEvent: function (event, type) {

    if (type === EVENTS.EVENT_CRMINFO && event) {

      let activityTimeJson = this.data.activityTimeJson
      if (!activityTimeJson.starTime){

        getActivityTime().then(e => {

          activityTimeJson.startTime = e.activityStartTime
          activityTimeJson.endTime = e.activityEndTime
          this.setData({activityTimeJson})
          this.requst()
  
        })
      }
    }
  },
  // 透明弹框事件
  bouncedTap : function(){
    // this.setData({canShow : false})
      this.setData({
        canShow : false,
        points : '',
        zhuliAnimationData : {
            index : 1
        }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (brand == 'FOL'){
      this.setData({
        zhuliArrs : ['1000','2000','3000','5000','1000','5000']
      })
    }
    wx.hideShareMenu();

    events.register(this, EVENTS.EVENT_CRMINFO);



    let shareBy = ''
    let shareByShop = ''


    let fridendData = this.data.fridendData
    let utmJson = {}
    if (options.params){
      fridendData = JSON.parse(options.params)
      shareBy = fridendData.share_by
      shareByShop = fridendData.share_by_shop

      utmJson = {
        utm_source: fridendData.utm_source,
        utm_medium: fridendData.utm_medium,
        utm_term: fridendData.utm_term,
        utm_campaign: fridendData.utm_campaign
      }
    }
    else if (options.q){

      let scan_url = decodeURIComponent(options.q);

      if (getApp().config.brand == 'ONLY'){
        scan_url = scan_url.replace(/https:\/\/tigeronly.truu.com.cn\//g,'')
      }
      else if (getApp().config.brand == 'VEROMODA'){
        scan_url = scan_url.replace(/https:\/\/tigervm.truu.com.cn\//g,'')
      }
      else{
        scan_url = scan_url.replace(/https:\/\/couponni.bestseller.com.cn\//g,'')
      }

      scan_url = scan_url.split('&')


      scan_url.forEach(items => {

        let b = items.split('=')
        switch (b[0]) {
          case 'userID':
          fridendData.userID = b[1]
            break;
          case 'pic':
          fridendData.pic = b[1]
            break;
          case 'name':
          fridendData.name = unescape(b[1])
            break;
          case 'openID':
          fridendData.openID = b[1]
            break;
          case 'utm_source':
            utmJson.utm_source = b[1]
            break;
          case 'utm_medium':
            utmJson.utm_medium = b[1]
            break;
          case 'utm_term':
            utmJson.utm_term = b[1]
            break;
          case 'utm_campaign':
            utmJson.utm_campaign = b[1]
            break;
          case 'share_by':
            shareBy = b[1]
            break;
          case 'share_by_shop':
            shareByShop = b[1]
            break;
        
          default:
            break;
        }
      });

    }

    let zhuliArrs = this.data.zhuliArrs
    zhuliArrs = this.group(zhuliArrs,3)
    this.setData({fridendData,zhuliArrs})



    let collectParam = Object.assign(utmJson, { eventName: `打开老虎机助力页_${fridendData.userID}` });
    getApp()._collectData2(collectParam)


    let orderSaveShare = {
      shareBy,
      shareByShop
    };
    getApp().setShareInfo(orderSaveShare);
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
  // 活动是否过期
  checkTimeOut  :function(){
    let isTimeOutStr = ''
      
      let endTime = new Date(this.data.activityTimeJson.endTime.replace(/-/g,'/')).getTime()
      let starTime = new Date(this.data.activityTimeJson.startTime.replace(/-/g,'/')).getTime()
      let currentTime = new Date().getTime()

      if (starTime > currentTime || currentTime > endTime){
        isTimeOutStr = '不在活动时间范围内'
      }
      

      if (isTimeOutStr != ''){
        wx.showModal({
          title: '提示',
          content: isTimeOutStr,
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F'
        });
        return true
      }
      return false
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