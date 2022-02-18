// activity//tiggerGame/ticketView/ticketView.js
import {duihuanjiangpin,getActivityTime,getDuijiangTime,duijiang,duijiangjilu} from '../netWorking'
// 2019-12-08 00:00:00 兑奖开始时间

const brand = getApp().config.brand
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    // 兑奖时间
    duijiangTimeJson : {},
    // 活动时间
    activityTimeJson : {},
    // 兑奖记录弹框
    canShow : false,
    // 用户信息
    userData : '',
    // 我的筹码
    myNumber : 0,
    // 奖品数据
    prizeDatas : [],
    // 兑奖记录数据
    jiluDatas : []

  },
  // 返回上一页
  backView : function(){
    wx.navigateBack({
      delta: 1
    });
  },
  // 兑奖记录
  duijiangTap : function(){
    duijiangjilu(this.data.userData.id).then(e => {
      
      let jiluDatas = this.data.jiluDatas
      jiluDatas = [].concat(e)
      this.setData({jiluDatas,canShow : true})
    })
  },
  // 关闭弹框
  closed : function(){this.setData({canShow : false})},
  // 规则说明
  guize : function(){
      wx.setStorageSync("lhjGZ", "2");
      wx.navigateTo({
        url: '../guizeView/guizeView'
      });
  },

  // 邀请好友助力
  share : function(){
    if (!this.checkTimeOut()){
      wx.navigateTo({
        url: '../shareView/shareView'
      });
    }
  },
  // 兑换
  duihuan : function(e){
    if (!this.getTime()){

      let myNumber = this.data.myNumber
      let userData = this.data.userData
      let jsonData = e.detail
      let jifen = parseInt(jsonData.pointsRequire)
      let str = ''
      if (myNumber < jifen){
        str = '筹码不足'
      }
      if (str != ''){
        wx.showToast({
          title: str,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        });
        return
      }

      wx.showModal({
        title: '提示',
        content: `将下发到${userData.phone}账户中,是否确定`,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            
            let json = {
              phone : userData.phone,
              userId : userData.id,
              exchangeGiftName : jsonData.giftName,
              giftId : jsonData.id
            }
            duijiang(json).then(e => {
              wx.showToast({
                title: '兑换成功',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: true
              });
              
              myNumber -= jifen
              this.setData({myNumber})
        
              setTimeout(() => {
                this.getList()
              }, 1600);
            })


          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });

      // console.log(`兑换`)
    }
  },
  // 列表
  getList : function(){
    let prizeDatas = this.data.prizeDatas
    duihuanjiangpin().then(e => {
      let arrs = this.group(e,2)

      arrs.forEach((item,index) => {
        item.forEach((items,indexs) => {
          if (brand == 'ONLY' || brand == 'FOL'){
            items.bgImg = 'ticketItemBG.png'
          }
          else if (brand == 'VEROMODA'){
            if (index == arrs.length - 1){
              // 最后一行
              if (indexs == 0){
                items.bgImg = 'ticket2.png'
              }
              else{
                items.bgImg = 'ticket3.png'
              }
            }
            else{
  
              if (indexs == 0){
                items.bgImg = 'ticket0.png'
              }
              else{
                items.bgImg = 'ticket1.png'
              }
            }
          }
        });
      });
      prizeDatas = arrs

      this.setData({prizeDatas})
    })
  },
  group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
  },
  // 兑奖时间
  getTime : function(){
    let isTimeOutStr = ''
          
    let endTime = new Date(this.data.duijiangTimeJson.endTime.replace(/-/g,'/')).getTime()
    let starTime = new Date(this.data.duijiangTimeJson.startTime.replace(/-/g,'/')).getTime()
    let currentTime = new Date().getTime()

    if (starTime > currentTime || currentTime > endTime){
      isTimeOutStr = '不在兑奖时间范围内'
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let myNumber = this.data.myNumber
    let userData = this.data.userData
    userData = wx.getStorageSync('lhjUser');
    myNumber = parseInt(userData.points)
    // console.log(`aaa:${JSON.stringify(userData)}`)
    
    this.getList()
    this.setData({myNumber,userData})


    getActivityTime().then(e => {

      let activityTimeJson = this.data.activityTimeJson
      activityTimeJson.startTime = e.activityStartTime
      activityTimeJson.endTime = e.activityEndTime
      this.setData({activityTimeJson})

    })
    getDuijiangTime().then(e => {
      let duijiangTimeJson = this.data.duijiangTimeJson
      duijiangTimeJson.startTime = e.exchangeStartTime
      duijiangTimeJson.endTime = e.exchangeEndTime
      this.setData({duijiangTimeJson})
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