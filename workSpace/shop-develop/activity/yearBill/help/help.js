// pages/help/index.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/yearBill/`
import {getYearBill} from "../../service/yearBill"
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
var sharePhone = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImg : `${imgPath}12_x.png`,
    datas : [],
    shareUserData : {},
    shareNickName : '',
    backImg : `${imgPath}backImg.png`
  },

  downLoadZT(){

    let _this = this
    let datas = this.data.datas
    // 字体下载
      let path = `url(https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/fonts/江西拙楷.ttf)`
      wx.loadFontFace({
        family: 'jxzk',
        source: path,
        success: e => {
          datas = [
            `你的好友${_this.data.shareNickName}`,
            '拍了拍你，',
            '并向你扔了一卷省钱秘笈！',
            `${_this.data.shareNickName || '你的好友'}在2020年`,
            '绫致折扣官网',
            `共节约了${_this.data.shareUserData.totalSavePrice || 0}元，`,
            '喜得',
            '羊毛KING称号，',
            '快来看看',
            '你的称号吧！'
          ]
          _this.setData({
            datas
          })
        }
      });
  },

  fenxiang(options){

    if (options.params){
      let json = JSON.parse(options.params)
      sharePhone = json.phone
      this.setData({
        shareNickName : json.nickName
      })

  
  
      let shareBy = json.share_by
      let shareByShop = json.share_by_shop
  
      let utmJson = {
        utm_source: json.utm_source,
        utm_medium: json.utm_medium,
        utm_term: json.utm_term,
        utm_campaign: json.utm_campaign
      }
      let collectParam = Object.assign(utmJson, { eventName: `打开年度账单游戏页_${json.userid}` });
      getApp()._collectData2(collectParam)
        
  
      let orderSaveShare = {
        shareBy,
        shareByShop
      };
      getApp().setShareInfo(orderSaveShare);


    }
    else if (options.scene){
      let scan_url = decodeURIComponent(options.scene);
      sharePhone = scan_url.split(',')[0]
      this.setData({
        shareNickName : scan_url.split(',')[1]
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fenxiang(options)

    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_GAMECRMINFO);
  },
  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    setTimeout(() => {
      this._requsetData()
    }, 5000);

  }
  else if (type === EVENTS.EVENT_GAMECRMINFO && event){
    this._requsetData()
  }
},
_requsetData(){


  let _this = this
  getYearBill({phone : sharePhone}).then(e => {

    _this.setData({
      shareUserData : e
    })
    _this.downLoadZT()
  }).catch(e => {
    if (requestCount == 3){
      
      wx.showModal({
        title: '提示',
        content: '请求错误,请重新进入页面',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
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
      return
    }
    requestCount += 1
    _this._requsetData()
  })
},
go(){
  wx.navigateTo({
    url: '../index/index'
  });
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
      this._requsetData();
    }
    else{
      getApp().navigateTo('member/login/login?game=true')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let phone = wx.getStorageSync(KEYSTORAGE.wxPhone);
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      phone : phone,
      nickName: wxInfo.nickName || '',

      share_by: sharePams.employeeId || '',
      share_by_shop: sharePams.shopCode || '',

      utm_source: 'game',
      utm_medium: 'game_yearBill',
      utm_term: '',
      utm_campaign: ''
    }
    let title = '查看年度账单还可领10元券，你也一起来吧！'

    let path = `/activity/yearBill/help/help?params=${JSON.stringify(json)}`
    let imageUrl = `${imgPath}share.jpeg`
    console.log(`分享成功:${path}`)
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (e) {

      },
      fail: function (e) {
        console.log(`分享失败`)
      }
    }
  }
})