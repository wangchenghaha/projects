import {getH5Categories} from '../../service/goods'
import {dateIsOverDue, throttle, chuFa, jiafa, debounce} from "../../utils/utils";
import  {URL_CDN} from '../../src/const'

const app = getApp();
const {cdn, brand, classificationLOGO} = app.config;
// 记录跳转还是返回 （记录点击记录用到,记录保存1天,key值：searchPageIndex）
var isJumpPage = false;
let isWeMall = false;

Page({

  //页面的初始数据
  data: {
    // 默认logo图片
    logoPic: URL_CDN.LOGO_BLACK_SQUARE,
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    isBandF: brand === 'FOL' || brand === 'BESTSELLER',
    allTop: [],
    all: [],
    // 当前选中 右边的数组
    all_rightDatas: [],
    searchValue: '',
    thisIndex0: 0,
    thisIndex1: 0,
    isFromDaogou: false,
    searchKeyWord: [],
    showSearchKeyWord: false,
    // 最右侧数据
    rightList: [],
    brand,
    // 滑动id
    scrollViewId: '',
    // 左侧滑动ID
    leftScrollViewId: '',
    heightArr: [],
    // 显示广告
    showAD: false,
  },

  onUnload: function () {
    if (isJumpPage) {
      //  跳转页面，保存点击记录
      let json = {
        thisIndex0: this.data.thisIndex0,
        thisIndex1: this.data.thisIndex1,
        time: new Date().getTime()
      }
      wx.setStorageSync('searchPageIndex', json);
    } else {
      wx.removeStorageSync('searchPageIndex');
    }
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    isJumpPage = false;
    const {page = ''} = options;
    isWeMall = page === 'weMall';
    let json = wx.getStorageSync('searchPageIndex');
    if (json) {
      // 查看是否超过1天，超过就删除记录
      if (dateIsOverDue(json.time, 1)) {
        wx.removeStorageSync('searchPageIndex');
      } else {
        this.setData({
          thisIndex0: json.thisIndex0,
          thisIndex1: json.thisIndex1
        })
      }
    }
    this.setData({
      showAD: options.ad_show === 'show'
    })
    //请求商品分类列表
    this.getCategory();
    app.setUtmOptions(options)
  },
  allTop_click(e) {
    const {index} = e.currentTarget.dataset;
    const {allTop, isBandF} = this.data;
    const all = allTop[index].list
    this.setData({
      thisIndex0: index,
      all,
      thisIndex1: 0,
      rightList: isBandF ? [all[0].list] : this.handleData(all)
    });
    try {
      app.tdSdkEvent('pageclick_category_2category', {
        CLASSIFY_NAME: allTop[index].classifyName
      });
      app.gioTrack('pageclick_home_categorys', {
        pname: allTop[index].classifyName
      })
    } catch (err) {}
  },
  leftClick(e) {
    const {index} = e.currentTarget.dataset;
    const { all, isBandF} = this.data;
    this.setData({
      thisIndex1: index,
      scrollViewId: brand + index
    });
    let gioParam = {
      pname: all[index].classifyName,
    }
    if(isBandF){
      gioParam = {
        name: all[index].classifyName
      }
      this.setData({rightList : [all[index].list]})
    }
    app.gioTrack('pageclick_home_categorys', gioParam)
    if(isBandF && (!all[index].list || all[index].list.length === 0)){
      this.clickToGoodsList(all[index].classifyId)
    }
    try {
      app.tdSdkEvent('pageclick_category_1category', {
        CLASSIFY_NAME: all[index].classifyName
      });
    } catch (err) {}
  },
  clickToGoodsList: function (list) {
    // console.log(`search页面:跳转`)
    isJumpPage = true;
    const url = `/pages/goodsList/goodsList?list=${list}`;
    if (isWeMall) {
      wx.redirectTo({url})
    } else {
      wx.navigateTo({url});
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let isFromDaogou = wx.getStorageSync('isFromDaogou');
    this.setData({
      isFromDaogou: !!isFromDaogou
    });
    wx.removeStorageSync('goodsHighPrice');
    wx.removeStorageSync('goodsLowPrice');
    app.track();
  },
  handleScroll: debounce(function(e){
    let {scrollTop} = e.detail;
    let {heightArr, thisIndex1, isBandF} = this.data;
    if(isBandF){
      return;
    }
    for(let i = 0; i < heightArr.length; i++){
      if(scrollTop >=0 && scrollTop < heightArr[0]){
        thisIndex1 = 0;
        break;
      }else if(scrollTop >= heightArr[i-1] && scrollTop < heightArr[i]){
        thisIndex1 = i;
        break;
      }
    }
    this.setData({thisIndex1, leftScrollViewId: `left${thisIndex1}`});
  }, 30),
  rpx2px(value){
    const {screenWidth} = wx.getSystemInfoSync();
    const scale = 750 / screenWidth;
    return `${chuFa(value, scale)}`
  },
  setHeight(){
    let heightArr =[];
    let h = 0;
    let query = wx.createSelectorQuery().in(this);
    query.selectAll('.right-view').boundingClientRect((react)=>{
      react.forEach((res)=>{
        h += res.height;
        heightArr.push(h)
      });
      this.setData({ heightArr });
    }).exec();
  },
  getCategory() {
    wx.showLoading();
    const {isBandF, thisIndex0, thisIndex1} = this.data;
    getH5Categories().then(res => {
      wx.hideLoading()
      if (isBandF) {
        const all = res[thisIndex0].list
        this.setData({
          allTop: res,
          all,
          rightList: [all[thisIndex1].list],
        });
      } else {
        this.setData({
          all: res,
          rightList: this.handleData(res)
        });
      }
      setTimeout(() => {
        this.setHeight();
      }, 500)
    }).catch(err => wx.hideLoading());
  },
  handleData(res) {
    const {logoPic, isBandF} = this.data;
    if(Array.isArray(res) && res.length){
      let tempList = [];
      res.forEach(item => {
        item.coverImg = this.generateImg(item.h5Url);
        if(item.list){
          if(item.list.length){
            item.list.forEach(subItem => {
              subItem.goodsImg = isBandF ? '' :(subItem.miniprogramUrl ? cdn + subItem.miniprogramUrl : logoPic)
            });
            tempList.push(item.list)
          }else{
            tempList.push([
              {
                classifyId: item.classifyId,
                classifyName: `${item.classifyName}`,
                goodsImg: isBandF ? '' :(item.miniprogramUrl ? cdn + item.miniprogramUrl : logoPic)
              }
            ])
          }
        }
      });

      return tempList
    }
  },
  /**
   * 合成图片
   * @param url
   * @param logo 是否需要展示logo
   * @returns {string|*}
   */
  generateImg(url , logo){
    const {isBandF} = this.data;
    if(isBandF){
      return ''
    }
    if(url){
      return cdn + url
    }
    return logo || ''
  },
  //去列表页
  toList: function (e) {
    const {code, name} = e.currentTarget.dataset;
    let gioParam = {
      name,
    }
    try {
      app.tdSdkEvent('pageclick_category_3category', {
        CLASSIFY_NAME: name
      });
    } catch (err) {
    }
    if (brand === 'FOL') {
      gioParam = {
        third_category: name
      }
      app.gioTrack('pageclick_home_categorys', gioParam)
      if (name.indexOf('限时拼团') != -1) {
        let linkurl = e.currentTarget.dataset.linkurl
        getApp().navigateTo(linkurl)
        return
      }
    }
    app.gioTrack('pageclick_home_categorys', gioParam)
    this.clickToGoodsList(code);
  },

  onSearch() {
    app.gioTrack('pageclick_category_search');
    wx.navigateTo({
      url: '../searchHistory/searchHistory'
    })
  },
})
