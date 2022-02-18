import {chengfa, jiafa, dateIsOverDue, throttle} from '../../utils/utils'
import {searchSuggest} from "../../service/goods";
import {KEYSTORAGE} from "../../src/const";
const app = getApp();
const {differDay, brand} = app.config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部样式
    headerStyle: {},
    // 关键词搜索
    searchKeyWord: [],
    // 输入的值
    searchValue: '',
    placeholder: '',
    // 搜索的值
    searchList: [],
    // 联想词
    suggestList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getSearchKeyWords(this);
  },
  setPagePos(){
    let {headerStyle} = this.data;
    // 获取右侧胶囊大小
    const {top, height} = wx.getMenuButtonBoundingClientRect();
    // 底部padding
    const paddingBottom = 20;
    const headerPadding = jiafa(paddingBottom, app.px2rpx(top));
    headerStyle = {
      paddingBottom:  `${paddingBottom}rpx`,
      paddingTop: `${app.px2rpx(top)}rpx`,
      inputHeight:app.px2rpx(height) + 'rpx',
      height: jiafa(headerPadding, app.px2rpx(height)) + 'rpx'
    };
    this.setData({
      headerStyle,
    });
  },
  searchInput(e){
    // 220433056
    const searchValue = e.detail.value;
    this.setData({searchValue});
    if(throttle(800)){
      if(brand === 'FOL'){
        this.getSearchSuggest(searchValue)
      }
    }
  },
  getSearchSuggest(text){
    const firstStr = text.charAt(0);
    // 搜索第一位不是数字才掉接口
    if(firstStr && isNaN(firstStr)){
      searchSuggest(text).then(res => {
        if(Array.isArray(res) && res.length){
          this.setData({suggestList: res})
        }
      })
    }
  },
  clearSearch(){
    this.setData({
      searchValue:'',
      suggestList: []
    })
  },
  onBlur(){
    const {searchValue} = this.data;
    if(searchValue){
      this.searchSubmit();
    }
  },
  searchSubmit() {
    let {searchValue, placeholder} = this.data;
    searchValue = searchValue || placeholder;
    if(searchValue === ''){
      wx.showModal({
        title: '提示',
        content: '请输入关键字',
        showCancel: false
      });
      return ;
    }
    app.gioTrack('pageclick_home_search_comnfirm', {
      keyword: searchValue
    })
    this.goList(searchValue);
  },
  setSearchValue(searchValue){
    if(searchValue){
      const searchList = wx.getStorageSync(KEYSTORAGE.SEARCH_LIST) || [];
      searchList.forEach((item, index) => {
        if(item.value === searchValue){
          searchList.splice(index, 1)
        }
      });
      searchList.unshift({
        value: searchValue,
        date: Date.now()
      });
      wx.setStorageSync(KEYSTORAGE.SEARCH_LIST, searchList.slice(0, 10));
    }
  },
  removeSearch(){
    this.setData({searchList: []});
    app.gioTrack('pageclick_home_searchdelt')
    wx.removeStorageSync(KEYSTORAGE.SEARCH_LIST)
  },
  // 获取本地搜索记录
  getLocalSearch(){
    let searchList = wx.getStorageSync(KEYSTORAGE.SEARCH_LIST) || [];
    if(Array.isArray(searchList) && searchList.length ){
      searchList.forEach((item, index) => {
        if(dateIsOverDue(item.date, differDay)){
          searchList.splice(index, 1)
        }
      });
      let placeholder = '';
      if(searchList.length){
        placeholder = searchList[0].value;
        searchList = searchList.slice(0, 10)
      }
      this.setData({searchList, placeholder});
      wx.setStorage({
        key: KEYSTORAGE.SEARCH_LIST,
        data: searchList
      });
    }
  },
  searchKey(e){
    const {text, type = ''} = e.currentTarget.dataset;
    app.gioTrack( type === 'hot' ? 'pageclick_home_search_recomm1' : 'pageclick_home_searchhisttory', {
      keyword: text
    });
    this.goList(text);
  },
  goList(searchValue){
    try {
      app.tdSdkEvent('pageclick_home_search_comnfirm', {SOLA_KEY: searchValue});
      app._collectData2({eventName: `搜索关键词_${searchValue}`});
      app.wxReportSearch(this, searchValue);
      // app.gioTrack('pageclick_category_search_comnfirm', {
      //   keyword: searchValue
      // });
    }catch (e) {}
    this.setSearchValue(searchValue);
    this.setData({searchValue: ''});
    if(searchValue.includes('账单')){
      wx.navigateTo({
        url: '/activity/yearBill/index/index'
      });
      return
    }
    wx.navigateTo({ url: `../goodsList/goodsList?listGoodsSelect=${searchValue}`});
  },
  onReady(){
    this.setPagePos();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocalSearch();
    this.setData({suggestList: []})
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
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
