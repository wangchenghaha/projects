import {KEYSTORAGE, URL_CDN} from '../../../src/const'
import {wxShowToast} from '../../../utils/wxMethods'
import {orderStatus, skuToImg, throttle} from '../../../utils/utils'
import {goodsReviewList, goodsReviewCount} from '../../service/buyerShow'
import {getOrderList} from '../../../service/order'

const app = getApp();
const {cdn, brand, DEV } = app.config;
const uploadDomain = DEV ?  'http://db.vm.cn' : cdn;
const TAB_TYPE_ORDER = 'order', TAB_TYPE_RATING = 'rating';
let orderPull = true, ratingPull = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: wx.getStorageSync(KEYSTORAGE.wxInfo).avatarUrl,
    reviewCount: 0,
    buyerShowCount: 0,
    // 订单列表
    orderList: [],
    // 评价列表
    ratingList: [],
    tab: [
      {
        text: '待评价',
        type: TAB_TYPE_ORDER,
        checked: true,
      },
      {
        text: '已评价',
        type: TAB_TYPE_RATING,
      }
    ],
    // 返回顶部
    showGoTop: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderPull = true; 
    ratingPull = true;
    this.getTabList();
    this.getGoodsReviewCount();
  },
  // 获取评论数量
  getGoodsReviewCount(){
    goodsReviewCount().then(res => {
      if(res){
        const {reviewCount = 0, buyerShowCount = 0} = res;
        this.setData({reviewCount, buyerShowCount})
      }
    }).catch(err => wxShowToast(err.message))
  },
  /**
   *
   * @param isPull 是否下拉
   */
  getTabList(isPull){
    const {tab, orderList, ratingList,} = this.data;
    for(let item of tab){
      if(item.checked){
        if(item.type === TAB_TYPE_ORDER){
          if(orderPull){
            if(isPull){
              this.orderParam.currentPage += 1;
            }
            if(!orderList.length || isPull){
              this.getAllOrderList();
            }
          }else{
            wxShowToast('数据加载完毕')
          }
          break
        }
        if(item.type === TAB_TYPE_RATING){
          if(ratingPull){
            if(isPull){
              this.ratingParam.currentPage += 1;
            }
            if(!ratingList.length || isPull){
              this.getGoodsReviewList();
            }
          }else{
            wxShowToast('数据加载完毕')
          }
          break;
        }
        break
      }
    }
  },
  changeTab(e){
    const {index} = e.currentTarget.dataset;
    const {tab} = this.data;
    tab.forEach((item, ind) => item.checked = index === ind);
    this.setData({tab});
    this.getTabList();
  },
  // 评价列表
  ratingParam: {
    currentPage: 1,
    // isBuyerShow: 'N',
    // reviewType: 'ANONYMOUS'
  },
  getGoodsReviewList(){
    wx.showLoading({
      title: '加载中...'
    });
    goodsReviewList(this.ratingParam).then(res => {
      wx.hideLoading();
      if(res){
        const {currPage = 1, list = [], totalPage = 1, totalCount = 0} = res;
        ratingPull = this.ratingParam.currentPage !== totalPage;
        if(list.length){
          const {ratingList, tab} = this.data;
          for(let item of tab){
            if(item.type === TAB_TYPE_RATING){
              item.text += item.text.includes('(') ? '' : `(${totalCount})`;
              break
            }
          }
          list.forEach(item => {
            item.goodsImg = cdn + skuToImg({
              size: URL_CDN.IMGSIZE240400,
              sku: item.gcsSku
            });
            item.nickname = item.nickname || '匿名用户';
            item.headimgurl = item.headimgurl || URL_CDN.LOGO_BLACK_SQUARE;
            if(item.buyerShowImgs){
              let buyerShowImgList = item.buyerShowImgs.split(',');
              item.showImgList = [];
              // 处理图片
              buyerShowImgList.forEach(imgItem => {
                const imgPath =  `${uploadDomain}/upload_pic/${brand}${imgItem}`;
                item.showImgList.push(imgPath)
              });
            }
          });
          ratingList[currPage - 1] = list;
          this.setData({ratingList, tab})
        }
      }
    }).catch(err => {
      console.log(err);
      wxShowToast(err.message)
    })
  },
  orderParam: {
    currentPage: 1,
    haveReview: 'N'
  },
  // 订单列表
  getAllOrderList(){
    wx.showLoading({
      title: '加载中...'
    });
    getOrderList(this.orderParam ).then(res => {
      wx.hideLoading();
      if(res ){
       const {currPage = 1, list = [], totalPage = 1, totalCount = 0} = res;
       orderPull = totalPage !== this.ratingParam.currentPage;
       if(list.length){
        const {orderList, tab} = this.data;
        for(let item of tab){
          if(item.type === TAB_TYPE_ORDER){
            item.text += item.text.includes('(') ? '' : `(${totalCount})`;
            break;
          }
        }
        list.forEach(item => {
          const {status,  goodsOrderList = []} = item;
          item.myStatus = orderStatus(status);
          item.showMore = false;
          if(goodsOrderList.length){
            goodsOrderList.forEach((goodsItem, goodsIndex) => {
              goodsItem.goodsImg = cdn + skuToImg({
                size: URL_CDN.IMGSIZE240400,
                sku: goodsItem.gcsSku
              })
            })
          }
        });
        orderList[currPage - 1] = list;
        this.setData({orderList, tab})
       }
      }
    }).catch(err => {
      console.log(err);
      wxShowToast(err.message)
    })
  },
  showMore(e){
    const {row, index} = e.detail;
    const {orderList} = this.data;
    orderList[row][index].showMore = !orderList[row][index].showMore;
    this.setData({orderList})
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
    this.getTabList(true)
  },
  onPageScroll: function(e){
    if(throttle()){
      let scrollTop = e.scrollTop;
      let showGoTop = scrollTop > 500;
      this.setData({ showGoTop })
    }
  },
  goTop(){
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({ showGoTop: false })
  },
})