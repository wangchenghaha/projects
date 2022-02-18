import { getConfigJSON } from "../../service/init";
import { getShareGoodsList, deleteTemp } from '../../service/guide'
import { wxShowToast } from '../../utils/wxMethods'
import {KEYSTORAGE} from "../../src/const";

var app = getApp();
var daogouID = '';
var sort_time = 'create_time.desc';
var sort_share = 'share_count.desc';
var thisPage = 1;
let curOptions = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    mobanList : [],
    proviceData: [],
    index1: 0,
    daogouID:'',
    sort_time: 'create_time.desc',
    sort_share: 'share_count.desc',
    thisPage: 1,
    sortTimeClass: 'icouDown',
    sortShareClass: 'icouDown',
    pages: 10,
    whoISLook: `全国${app.config.brand}导购`,
    isOperate: false,
    collocationBanner: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData,'***')
    this.getBrandConfig();
    curOptions = options;
    this.getTempList();
  },
  async getBrandConfig(){
    let {isOperate} = this.data;
    let {configJson = {}} = app.globalData;
    if(Object.keys(configJson).length === 0){
      configJson = await getConfigJSON()
    }
    const {operateDA = [], collocationBanner = {}} = configJson;
    // 判断是否运营
    for(let operateItem of operateDA){
      let curGuideID = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId;
      if(operateItem.daName === curGuideID){
        isOperate = true;
        break;
      }
    }
    this.setData({isOperate, collocationBanner});
  },
  bannerClick(){
    const { linkUrl='' } = this.data.collocationBanner;
    if(linkUrl){
      app.navigateTo(linkUrl)
    }
  },
  getTempList(){
    const daogouID = wx.getStorageSync('daogouInfo').employeeId;
    this.setData({ daogouID })
    const {thisPage, pages} = this.data;
    const param = {
      // details: '',
      employeeId: daogouID,
      region: '全国',
      pageNumber: thisPage,
      pageSize: pages,
      sortBy: 'create_time.desc'
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    getShareGoodsList(param).then(res => {
      wx.hideLoading()
      console.log(res,'&&')
      let records = [];
      if(res && res.list && res.list.length){
         records = res.list;
      }
      if(records && records.length){
        records.forEach(item => {
          item.createTimeDate =item.createTime;
          item.createGuide = item.nickname;
        });
        let {mobanList} = this.data;
        this.setData({
          mobanList: mobanList.concat(records)
        });
      }

    }).catch(err => wxShowToast(err.message))
  },
  //发布时间
  asCreateTime: function(){
    var that = this;

    wx.showLoading({
      title: '加载中...'
    });
    this.setData({
      mobanList: [],
      thisPage: 1
    });
    if (sort_time == 'create_time.desc') {
      sort_time = 'create_time.asc'
      that.setData({
        sortTimeClass: 'icouUp'
      });
    } else {
      sort_time = 'create_time.desc'
      that.setData({
        sortTimeClass: 'icouDown'
      });
    };
    this.getTempList();

  },

  //人气排序
  asShare: function () {
    var that = this;

    wx.showLoading({
      title: '加载中...'
    });
    this.setData({
      mobanList: [],
      thisPage: 1
    });
    if (sort_share == 'share_count.desc') {
      sort_share = 'share_count.asc'
      that.setData({
        sortShareClass: 'icouUp'
      });
    } else {
      sort_share = 'share_count.desc'
      that.setData({
        sortShareClass: 'icouDown'
      });
    };
    this.getTempList();

  },

  changeCity: function(e){
    var that = this;
    var _index1 = Number(e.detail.value);
    this.setData({
      index1: _index1,
      mobanList: [],
      thisPage: 1
    });
    wx.showLoading({
      title: '加载中...'
    });
    this.getTempList();
  },
  // 再次封装
  tdSdkEventAgain: function (tdEventName, param) {
    let tdParam = {
      GUIDE_DAID: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId,
    };
    Object.assign(tdParam, param);
    app.tdSdkEvent(tdEventName, tdParam);
  },
  //分享转发
  toLookMbCon: function(e){
    let tempId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
     // 收集用户行为
    let pageTitle = this.data.mobanList[index].pageTitle;
    let collectParam = Object.assign(curOptions, {eventName: `open_推荐搭配_${pageTitle}_${tempId}`});
    app._collectData2(collectParam);
    try {
      this.tdSdkEventAgain(`pageclick_model_goods${index+1}`, {TEMPLATE_ID: tempId});

      app.gioTrack('pageclick_share_rec_goods', {
        content_Id: tempId,
        title: pageTitle
      })
    }catch (e) { }
    const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let url = `/weMall/daogouwxq/daogouwxq?from=list&id=${tempId}&isWeMall=weMall&status=login`;
    if(employeeId.startsWith('FX')){
      url = `/weMall/shareDetail/shareDetail?id=${tempId}`
    }
    wx.navigateTo({url });
  },

  //删除
  toRemove: function(e){
    const _id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          deleteTemp(_id).then(res => {
            const {mobanList} = that.data;
            mobanList.forEach((item,index) => {
              if(item.id === _id){
                mobanList.splice(index, 1);
                wxShowToast('删除成功');
              }
            });
            that.setData({ mobanList });
          }).catch(err => wxShowToast(err.message))

        };
      }
    });

  },

  //上拉触底 - 加载更多
  onReachBottom: function (e) {
    var _thisPage = this.data.thisPage+1;
    this.setData({
      thisPage: _thisPage
    });
    app.gioTrack('pageclick_share_rec_moredetail')
    this.getTempList();
  }

})
