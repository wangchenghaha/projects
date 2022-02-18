import { getCustomizationClassify } from '../../service/customization'
import { translateArray, skuToImg, splitImg } from '../../utils/utils'
const app = getApp();
const cdn = app.config.cdn;
let classify = '';
let collection = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        name:'全部',
        sort:'desc',
        sortDirection: true,
        tdName: 'all'
      }, {
        name: 'T恤',
        sort: 'desc',
        tdName: 'T恤'
      }, {
        name: '卫衣',
        sort: 'desc',
        tdName: '卫衣'
      }, {
        name: '衬衣',
        sort: 'desc',
        tdName: '衬衣'
      }, {
        name: '牛仔夹克',
        sort: 'desc',
        tdName: '牛仔夹克'
      }, {
        name: '牛仔裤',
        sort: 'desc',
        tdName: '牛仔裤'
      }
    ],
    goodsListData: [],
    forShow: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classify = options.classify;
    collection = options.theme || '';
    let nav = this.data.nav;
    for (let i = 0; i < nav.length; i++) {
      if(nav[i].tdName === classify){
        nav[i].selected = true;
      }
    }
    this.setData({
      forShow: options.forShow,
      nav
    })
    this._getGoodsList(classify, collection);
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

  _getGoodsList: function(type, _collection){
    let jsData = {
      for_show: this.data.forShow,
      garment_type: type,
      collection: _collection || "",
    }
    getCustomizationClassify(jsData).then(res=>{
      console.log(res);
      let goodsList = res;
      let goodsListData = [];
      if(goodsList.length > 0){
        goodsList.forEach((item) => {
          item.goodsImg = `${cdn}/` + item.pic_preview;
        });
        // 将数据切分为2个一组
        goodsListData.push(...translateArray(JSON.parse(JSON.stringify(goodsList)), 2));
      }else{
        goodsListData = []
      }
      this.setData({goodsListData});
      
    }).catch(err => {
      console.log(err)
    })

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

  },

  // 导航切换
  changeNav: function(e){
    let nav = this.data.nav;
    let curIndex = e.currentTarget.dataset.index || 0;
    // 切换导航清空列表
    let goodsListData = [];
    nav.forEach((item,index) => {
      if(index === curIndex){
        item.selected = true;
      }else{
        item.selected = false
      }
    });
    this.setData({nav, goodsListData});
    wx.showLoading({
      title: "Loading....",
      mask: true
      }, setTimeout( ()=> {
        wx.hideLoading();
        this._getGoodsList(nav[curIndex].tdName, collection);
      }, 1500));
  },
})