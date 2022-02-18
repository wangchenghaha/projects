// activity//flashShop/register/register.js

import { splitImg } from '../../../utils/utils'

import {updateFlash} from '../netWork'
var splashImgList = [];

var locationType = ''
var userInfo = {}

// 下一页用到的数据
var nextPageJson = {
  userInfo : {},
  locationType : '',
  havePrize : false,
  bgImg : '',
  question : ''
}
// 控制进入下一页只可点击1次
var oneTouch = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    splashImg : '',
    imgJson : [],
    
    // 适配
    adapter : 1
  },

  getSystemInfo: function(){

    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
      let nextImg = ''
      let adapterIndex = 0
      splashImgList.forEach((item,index) => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100 && splashImg == ''){
          splashImg = item.img
          nextImg = item.nextImg
          adapterIndex = index
        }
      });
      if(splashImg){
        this.setData({
          splashImg: `${splashImg}`,
          adapter : adapterIndex
        })
        console.log(this.data.splashImg,'***init');
        
      }
      else{
        this.setData({
          splashImg: `${splashImgList[1].img}`,
          adapter : 1
        })
        console.log(this.data.splashImg,'***init00000');
        nextImg = `${splashImgList[1].nextImg}`
      }
      nextPageJson.bgImg = nextImg
      
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    oneTouch = true
    

    locationType = wx.getStorageSync('flashShopType');
    nextPageJson.locationType = locationType

    const  version = Date.now();
    splashImgList = [
      {
        scale: 5622,
        img: splitImg(`qustions750_hangzhou.jpg?v=${version}`), // 375/667 iphone 7
        nextImg : splitImg(`flashShop750.jpg?v=${version}`)
      },
      {
        scale: 4618,
        img: splitImg(`qustions1125_hangzhou.jpg?v=${version}`),  // 375/812 iphoneX
        nextImg : splitImg(`flashShop1125.jpg?v=${version}`)
      },
      {
        scale: 4620,
        img: splitImg(`qustions828_hangzhou.jpg?v=${version}`),   // 414/896  iphoneXR
        nextImg : splitImg(`flashShop828.jpg?v=${version}`)
      },
    
    ];
    
    let imgJson = this.data.imgJson
    imgJson = [

      {
        isSelect : false,
        path : splitImg(`flashShopV_n_hangzhou.png?v=${version}`),
        selectPath : splitImg(`flashShopV_s_hangzhou.png?v=${version}`),
        noTapPath : ''
      },
      {
        isSelect : false,
        path : splitImg(`flashShopQ_n_hangzhou.png?v=${version}`),
        selectPath : splitImg(`flashShopQ_s_hangzhou.png?v=${version}`),
        noTapPath : splitImg(`flashShopQ_hui_hangzhou.png?v=${version}`)
      }
    
    ]
    this.setData({imgJson})
    this.getSystemInfo()
    this.checkAttribute()

  },
  checkAttribute(){
    userInfo = wx.getStorageSync('flashShopUserInfo');
    wx.removeStorageSync('flashShopUserInfo');

    nextPageJson.userInfo = userInfo

    if (userInfo.acUserOperation){
      // 有打卡状态
      let json = userInfo.acUserOperation
      
      if (json.labQuestion){
        // 答题过(如果答题过那肯定拍照过)
        let imgJson = this.data.imgJson
        imgJson[0].isSelect = true
        if (json.labQuestion.split('|').length > 3){
          imgJson[1].isSelect = true
          // 判断是否领过奖
          if (userInfo.acUserAward && userInfo.acUserAward.hasReceive == 'Y'){
            nextPageJson.havePrize = true
          }
        }
        nextPageJson.question = json.labQuestion.split('|')
        
        this.setData({imgJson})

      }
      else if (json.picShare == 1){
        // 拍照过
        let imgJson = this.data.imgJson
        imgJson[0].isSelect = true
        this.setData({imgJson})
      }
    }
  },
  tap(e){
    if (this.data.imgJson[0].isSelect && this.data.imgJson[1].isSelect){

          // 有打卡状态
          let json = nextPageJson.userInfo.acUserOperation
          
          if (json.labQuestion){
            if (json.labQuestion.split('|').length > 3){
              if (!nextPageJson.userInfo.acUserAward){
                
                let requestJson = {
                  picShare : 1,
                  labQuestion : json.labQuestion,
                  location : locationType,
                  userId : nextPageJson.userInfo.userId
                }
                updateFlash(requestJson).then(res => {
                  this.goNextPage()
                })



              }
              else{
                this.goNextPage()
              }
            }
            else{
              this.goNextPage()
            }
            
          }
          else{
            this.goNextPage()
          }

      return
    }
    let type = e.currentTarget.dataset.type

    if (type == 'pic'){
      if (this.data.imgJson[0].isSelect){
        this.showModalF('已打卡',`图片已保存到相册中`)
        return
      }
      this.showModalF('提示','请前往"霓虹都市"区域拍照打卡',true,() => {

        let _this = this
        // 拍照
        wx.chooseImage({
          count: 1,
          sizeType: ['original'],
          sourceType: ['camera'],
          success (res) {
            // const tempFilePaths = res.tempFilePaths
            console.log(`完成******************${locationType}`)
  
            let requestJson = {
              picShare : 1,
              labQuestion : '',
              location : locationType,
              userId : userInfo.userId
            }
            updateFlash(requestJson).then(res => {
              console.log(`更新打卡状态:${JSON.stringify(res)}`)
  
              let imgJson = _this.data.imgJson
              imgJson[0].isSelect = true
              _this.setData({
                imgJson
              })
  
              _this.showModalF('打卡成功',`图片已保存到相册中`)
            })
  
  
          },
          fail(err){
            console.log(`相机错误:${JSON.stringify(err)}`)
            _this.showModalF('失败',`打卡失败`)
          }
        })

      })
    }
    else{
      if (this.data.imgJson[0].isSelect){
        
        // 前往下一页
        this.showModalF(`提示`,'点击完成趣味小测试',true,() => {
          this.goNextPage()
        })
        

      }
    }
  },
  goNextPage(){
    if (oneTouch){
      oneTouch = false
      wx.setStorageSync('nextPageJson', nextPageJson);
      wx.redirectTo({
        url: `../questionAndFinish/questionAndFinish`
      });
    }
  },

  showModalF(title,text,canChancel = false,callback){

    wx.showModal({
      title: title,
      content: text,
      showCancel: canChancel,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          if (callback){
            callback()
          }
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });

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