import {bindVistor,  getTrendList ,getTrendListTwo, trendPraise, trendCancelPraise} from '../../service/trendinfo'
import { EVENTS, KEYSTORAGE } from '../../src/const.js'
import {objToQuery} from '../../utils/utils'
import events from '../../src/events'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarImg: wx.getStorageSync(KEYSTORAGE.wxInfo).avatarUrl,
    vistorId: 0,
    fashionArr: [],
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_CRMINFO)

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
    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
      this.setData({
        isLogin: false
      })
      this._getTrendList()
    }else{
      this.setData({
        isLogin: true
      })
      if(wx.getStorageSync('trendVisiorId')){
        this.setData({
          vistorId: wx.getStorageSync('trendVisiorId')
        })
        this._getTrendList()
      } else {
        this._bindVistor();
      }
    }
  },


  /**
 * 接受授权成功刷新页面
 */
   handleEvent: function (event, type) {
    if (type == EVENTS.EVENT_CRMINFO) {
      if(wx.getStorageSync('trendVisiorId')){
        this.setData({
          vistorId: wx.getStorageSync('trendVisiorId'),
        })
        this._getTrendList()
      } else {
        this._bindVistor();
      }
      this.setData({
        isLogin: true
      })
    }
  },


  _bindVistor(){
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let json = {
      avatarUrl: wxInfo.avatarUrl || '',
      nickname: wxInfo.nickName || '',
      openid: wxInfo.openId,
      phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      unionid: wxInfo.unionId
    }
    bindVistor(json).then(res =>{
      this.setData({
        vistorId: res.id
      })
      wx.setStorageSync('trendVisiorId', res.id)
      this._getTrendList();
    })

  },

  _getTrendList(){
    let json = {
      visitorId: this.data.vistorId || 1
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    getTrendList(json).then(res =>{
      wx.hideLoading();
      this.setData({
        listData : res.trendInfoList,
        vistorId: res.id
      })
    }).catch(err =>{
      wx.hideLoading();
    })

    let jsonTwo = {
      brand: app.config.brand,
      pageNumber: 1,
      pageSize: 5
    }
    getTrendListTwo(jsonTwo).then(res=>{
      let fashionArr = [];
      fashionArr = res.list
      for (let i = 0; i < fashionArr.length; i++) {
        fashionArr[i].createdTime = fashionArr[i].createdTime.substring(5, 10)
      }
      this.setData({
        fashionArr
      })
    })
  },
  onTabItemTap(item){
    app.gioTrack('pageclick_trendyzone')
  },

  onClick(e){
    let type = e.currentTarget.dataset.type;
    let item = e.currentTarget.dataset.item;
    let {vistorId} = this.data;
    switch(type){
      case 'vistor':
        wx.navigateTo({
          url: '/member/trendInformation/userCenter/userCenter?vistorId='+ vistorId
        })
        break;
      case 'item':
        const param = {
          newsID: item.newsId,
          createdTime: encodeURIComponent(item.createdTime),
          title: encodeURIComponent(item.title)
        };
        app.gioTrack('pageclick_trendyzone', {
          content_Id: item.newsId,
          // albumname: item.title,
          albumName: item.title,
        })
        wx.navigateTo({
          url: '/pages/informatCon/informatCon' + objToQuery(param)
        });
        break;
      case 'allFashion':
        app.gioTrack('pageclick_trendyzone_all')
        wx.navigateTo({
          url: '/pages/informat/informat'
        });
        break;
      case 'login':
        if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
          getApp().checkLogin()
        } else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
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
        break;


    }
  },

  clickPraise(e){
    let detail = e.detail;
    if(detail.isPraise){
      this._trendCancelPraise(detail.id)
    } else {
      this._trendPraise(detail.id)
    }
  },

  _trendPraise(_trendId){
    let {listData, vistorId} = this.data;
    let json = {
      trendId: _trendId,
      visitorId: vistorId
    }
    trendPraise(json).then(res =>{
      for (let i = 0; i < listData.length; i++) {
          if(listData[i].id === _trendId){
            listData[i].isPraise = true
            listData[i].praiseTotal = listData[i].praiseTotal + 1
          }
      }
      this.setData({
        listData
      })
    })
  },

  _trendCancelPraise(_trendId){
    let {listData, vistorId} = this.data;
    let json = {
      trendId: _trendId,
      visitorId: vistorId
    }
    trendCancelPraise(json).then(res =>{
      for (let i = 0; i < listData.length; i++) {
        if(listData[i].id === _trendId){
          listData[i].isPraise = false
          listData[i].praiseTotal = listData[i].praiseTotal - 1
        }
      }
      this.setData({
        listData
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
