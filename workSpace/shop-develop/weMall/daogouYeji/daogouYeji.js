import { skuToImg, orderStatus, formatDate, getdate, objectArraySort } from '../../utils/utils.js'
import {URL_CDN, KEYSTORAGE} from '../../src/const'
import {saleStateSort, guideOrderList} from '../../service/saleState'
import {getRanking, getAutoRanking} from "../../service/guide";

const app = getApp();
const {shopCodeArr, cdn, brand} = app.config;
let saleStateSortParam = {
  employeeId: '',
  sortBy: '',
  page: 1
};
// 销售类型
let saleType = 'cpay_price.des';
const RANKING = 'ranking';
//销售列表是否可下拉
let salePull = true;
const imgUrl = `${cdn}/assets/common/image/`;
/*
* 浏览人数
* 转化率
* */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    bannerImg: `${cdn}/assets/common/${brand}/image/member_banner.jpg`,
    guideImg: URL_CDN.LOGO_BLACK_SQUARE,
    nickName: '',
    tabBar: [
      {
        name: '销售概况',
        content: {},
        subTab: [
          {
            name: '销售汇总',
            list: []
          },
          {
            name: '订单中心',
            list: []
          },
          // 暂时注释
          // {
          //   name: '排行榜',
          //   type: RANKING
          // }
        ]
      }
      /*{
        name: '分享效果',
        subTab: [
          {
            name: '总览',
            list: [],
          },
          {
            name: '按购买金额',
            list: [],
            type: 'cpay_price.des'
          },
          {
            name: '按购买人数',
            list: [],
            type: 'purchase_count.desc'
          }
        ]
      },*/
      /*{
        name: '红包奖励',
        content: {}
      }*/
    ],
    tabIndex: 0,
    tabTitle: ['总览', '按购买金额', '按购买人数'],
    tabTitleIndex: 0, // 默认出现第几个  总览 购买金额 购买人数
    allList: [], // 总览数据，
    purchaseList: [], // 购买数据
    number: 0,
    salesView: [],   // 销售汇总
    orderList:[],    // 订单列表
    isPull: true,   //  是否下拉
    employeeId: '',
    queryOrderParam: {
      shareBy: '',
      status: '',
      utmSource: '',
      startTime: '',
      endTime: '',
      page: 1,
      pageSize: 10
    },
    // 排行榜数据
    rankingList: [],
    rankingTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.removeLocal();
    if(options.rankList === 'show'){
      this.getRankingList();
    }
    const employeeId = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId || '';
    let queryOrderParam = this.data.queryOrderParam;
    queryOrderParam.shareBy = employeeId;
    this.setData({
      employeeId,
      queryOrderParam
    });
    saleStateSortParam.employeeId = employeeId;

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let guideImg = wxInfo.avatarUrl;
    let nickName = wxInfo.nickName;
    this.setData({guideImg, nickName});
    //获取销售
    if(this.data.tabIndex === 0 && this.data.tabTitleIndex !==0){
      this.data.isPull ? this.guideOrderList() : '';
    }
    this.guideOrderList();
  },
  getRankingList: function(){
    getRanking().then(res => {
      let rankingData = res[brand].ranking;
      if(rankingData && rankingData.title){
        let rankingTitle = rankingData.title;
        let tabBar = this.data.tabBar;
        // let rankingList = rankingData.data;
        tabBar.push({
          name: rankingTitle,
          content: {}
        });
        getAutoRanking().then(res => {
          if(res.title){
            rankingTitle = res.title;
            let rankingList = [];
            for(let key in res){
              let rankItem = res[key];
              if(key !== 'title'){
                rankItem.avatarDefaultUrl = `${imgUrl}${rankItem.avatar}`;
                rankItem.checked ? rankItem.active = true : "";
                rankItem.list = [];
                for(let i in rankItem){
                  if(Array.isArray(rankItem[i])){
                    let list = rankItem[i];
                    list.forEach(item => {
                      // 导购，店长，
                      item.name = item.staffName || item.hrCityManager || item.hrDistrictManager || item.hrRegionManager
                      item.employeeId = item.staffNo || item.hrCityManageNo || item.hrDistrictManageNo || item.hrRegionManageNo;
                      // 前4位数字打****隐藏
                      if(typeof item.employeeId === 'string' && !(item.employeeId.includes('*'))){
                        item.employeeId = item.employeeId.replace(item.employeeId.substr(2, 4),'****')
                      }
                      item.avatarUrl = imgUrl + (item.rn <= 3 ? `ranking${item.rn}.png` : `${rankItem.avatarColor}`);

                      if(typeof item.actSalesValue === 'number'){
                        item.money = parseInt(item.actSalesValue).toLocaleString();
                      }else if (typeof item.actSalesValue === 'string'){
                        if(!(item.actSalesValue.includes(','))){
                          item.money = parseInt(item.actSalesValue).toLocaleString();
                        }else{
                          item.money = item.actSalesValue
                        }
                      }
                      if(item.money && typeof  item.money === 'string' && !(item.money.includes('￥'))){
                        item.money = `￥${item.money}`
                      }
                    });
                    // 排名升序排列
                    list.sort(objectArraySort('rn'));
                    rankItem.list = list
                  }
                }
                // 评选规则切割为数组
                rankItem.rule = rankItem.rule ? rankItem.rule.split('|') : [];
                rankingList.push(rankItem);
              }
            }
            this.setData({tabBar, rankingList, rankingTitle});
          }
        });
        /*rankingList.forEach( rankItem => {
          // 拼接头像
          rankItem.list.forEach(item => {
            item.avatarUrl = imgUrl + (item.ranking <= 3 ? `ranking${item.ranking}.png` : `${rankItem.avatarColor}`);
          });
          rankItem.avatarDefaultUrl = `${imgUrl}${rankItem.avatar}`;
          rankItem.checked ? rankItem.active = true : ""
        });*/

      }
    })
  },
  changeNum: function () {
    let number = 0;
    let newNum = 1080;
    let diffNum = Math.abs(newNum - number);
    for (let i = 0; i < diffNum; i++) {
      let t1 = setTimeout(() => {
        if (this.data.number >= newNum) {
          this.setData({number: newNum});
          clearTimeout(t1)
        } else {
          this.setData({number: number + (i * 5)});
        }
      }, 10 * (i + 1))
    }
  },
  getOrderList: function(e){
    // 筛选条件
    // queryOrderParam = e.detail;
    this.setData({
      queryOrderParam: e.detail,
      orderList:[]
    });
    this.guideOrderList(e.detail)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 获取排序后的导购销售业绩
  saleStateSort: function (sortBy) {
    /*if (wx.getStorageSync(sortBy)) {
      this.setData({purchaseList: wx.getStorageSync(sortBy)});
      return;
    }*/
    let t1 = setTimeout(()=>{
      wx.showLoading({title: '加载中...'});
    },800);
    saleStateSortParam.sortBy = sortBy || '';
    saleStateSort(saleStateSortParam).then(res => {
      console.log(res);
      let result = res.data;
      result.forEach(item => {
        item.createTime = formatDate(item.createTime)   // 格式化时间
      });
      wx.setStorageSync(sortBy, result);   // 获取到的值存到本地，第二次不再调接口，等到离开页面之后删除
      let tabBar = this.data.tabBar;
      tabBar.forEach(item => {
        if (item.name === '分享效果') {
          item.subTab.forEach(subItem => {
            subItem.type === sortBy ? subItem.list = result : '';
          })
        }
      });
      let purchaseList = this.data.purchaseList;
      //当前页数为1
      if(saleStateSortParam.page !== 1){
        purchaseList = purchaseList.concat(result);
      }else {
        purchaseList = result;
      }
      if(res.totalPage){
        if(saleStateSortParam.page === res.totalPage){
          salePull = false
        }
      }


      this.setData({
        tabBar: tabBar,
        purchaseList: purchaseList
      });
      clearTimeout(t1);
      wx.hideLoading();
    }).catch(err => {
      clearTimeout(t1);
      wx.hideLoading();
      wx.showToast({
        title: err.message,
        duration: 2000
      })
    })
  },

  // 分享订单
  guideOrderList: function() {
    let {shopCode} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    if(shopCodeArr && shopCodeArr.includes(shopCode.toLocaleUpperCase())){
      return
    }
    let t1 = setTimeout(()=>{
      wx.showLoading({
        title:'加载中',
        mask: true
      });
    },800);
    let param = this.data.queryOrderParam;
    guideOrderList(param).then( res => {
      let orderList = res.data;
      if(Array.isArray(orderList) && orderList.length > 0){
        let goodsImgParam = {
          size: URL_CDN.IMGSIZE240400
        };
        orderList = orderList.filter(item => (item.goodsOrderList && item.goodsOrderList.length));
        orderList.forEach( (item, index) => {
          goodsImgParam.sku = item.goodsOrderList[0].gcsSku;
          item.goods_color_code = item.goodsOrderList[0].gcsSku;
          item.goodsName = item.goodsOrderList[0].goodsName;
          item.goodsImg = cdn + skuToImg(goodsImgParam);
          item.newStatus = orderStatus(item.status);
          if(item.goodsOrderList && item.goodsOrderList.length){
            item.goodsOrderList.forEach(goodsItem => {
              goodsImgParam.sku = goodsItem.gcsSku;
              goodsItem.goodsImg = cdn + skuToImg(goodsImgParam);
            });
          }
        });
        this.setData({
          orderList,
          queryOrderParam: param
        });
      }
      clearTimeout(t1);
      wx.hideLoading();
      // 判断数据是否加载完毕
      if(param.page === res.totalPages){
        this.setData({isPull: false});
      }
    }).catch( err => {
      clearTimeout(t1);
      wx.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      })
    });
  },
  onClick: function (e) {
    let dataCode = e.currentTarget.dataset.code;
    if (dataCode === 'tabItem') {
      /*分享效果禁止点击*/
      this.changeTab(e)
      /*wx.showToast({
        title: '暂不可用！',
        icon: 'success',
        duration: 2000
      })*/
    } else if (dataCode === 'tabTitle') {
      this.changeTitleTab(e)
    }
  },

  /* tab 栏切换*/
  changeTab: function (e) {
    let tabIndex = e.currentTarget.dataset.index;
    let tabTitleIndex = 0;
    //点击切换的时候初始化数据
    let purchaseList = [];
    salePull = true;
    if (tabIndex === 2) {
      return
    }
    this.setData({tabIndex, tabTitleIndex, purchaseList})
  },
  // 切换
  changeTitleTab: function (e) {
    let tabTitleIndex = e.currentTarget.dataset.index;
    saleType = e.currentTarget.dataset.type;
    // 切换的时候page初始化
    saleStateSortParam.page = 1;
    this.setData({tabTitleIndex});
    if (saleType) {
      if(saleType === RANKING){
        wx.navigateTo({
          url: '../salesRanking/salesRanking',
        });
        return;
      }
      this.saleStateSort(saleType);
    }
  },
  // 上拉加载
  onReachBottom: function(){
    // 判断是否在当前tab栏下
    if(this.data.tabIndex === 0 && this.data.tabTitleIndex !==0){
      if(this.data.isPull){
        let queryOrderParam = this.data.queryOrderParam;
        queryOrderParam.page++;
        this.setData({queryOrderParam})
        this.guideOrderList();
      }else{
        wx.showToast({
          title: '加载完毕',
          duration: 1000
        })
      }
    }
    if(this.data.tabIndex !== 0 && this.data.tabTitleIndex !==0){
      saleStateSortParam.page++;
      if(salePull){
        this.saleStateSort(saleType);
      }else{
        wx.showToast({
          title: '加载完毕',
          duration: 1000
        })
      }

    }

  },
  removeLocal: function(){
    wx.removeStorageSync('cpay_price.des');
    wx.removeStorageSync('purchase_count.desc');
    // 销售汇总
    wx.removeStorageSync('guideSaleView');
    wx.removeStorageSync('ordersResult');
  },
  onHide: function () {
    this.removeLocal();
  },
  onUnload: function () {
    this.removeLocal()
  }
});