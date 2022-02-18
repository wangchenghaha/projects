import {redBookList, redBookRemove} from '../../service/redBook'
import {wxShowToast} from "../../../utils/wxMethods";
import {KEYSTORAGE} from '../../../src/const'
import {judgeUrl, throttle} from "../../../utils/utils";
let isPull = true;
const SORT_DESC = 'desc', SORT_ASC = 'asc';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [],
    showGoTop: false,
    sortList: [
      {
        orderType:1, // 1，降序/2，升序
        orderBy: 1,
        type: 'time',
        text:'发布时间',
        value: SORT_DESC,
      },
      {
        orderType:1,
        orderBy: 2,
        type: 'hot',
        text: '人气排序',
        value: SORT_DESC
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList();
  },
  changeSort(e){
    const {index} = e.currentTarget.dataset;
    const {sortList} = this.data;
    sortList[index].value = sortList[index].value === SORT_DESC ? SORT_ASC : SORT_DESC;
    sortList[index].orderType = sortList[index].value === SORT_DESC ? 1 : 2;
    this.setData({sortList});
    this.listParam.orderBy = sortList[index].orderBy;
    this.listParam.orderType = sortList[index].orderType;
    this.setData({bookList: []});
    this.getBookList()
  },
  listParam: {
    employeeId: '',
    currentPage:1,
    pageSize: 10,
    region: '全国',
    orderBy: 1,
    orderType: 1
  },
  getBookList(type){
    const {employeeId= ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    this.listParam.employeeId = employeeId;
    wx.showLoading({
      title: '加载中...',
    })
    redBookList(this.listParam).then(res => {
      wx.hideLoading();
      if(type){
        wx.stopPullDownRefresh()
      }
      if(res){
        let {bookList} = this.data;
        const {list = [], totalCount, totalPage} = res;
        if(totalPage === this.listParam.currentPage){
          isPull = false;
        }
        if(Array.isArray(list) && list.length){
          list.forEach(item => {
            item.allShareCount = item.shareCount + item.shareMomentCount;
            item.shareImg = judgeUrl(item.shareImg);
            // 是否显示删除按钮
            item.delBtnShow = item.createByOpenid === employeeId;
            //
            if(item.createByOpenid === employeeId){
              if(item.shareCount && item.shareMomentCount){
                item.task = {
                  text: '已完成',
                  className: 'task-finish',
                }
              }else{
                if(item.shareCount){
                  item.task = {
                    text: '未分享到朋友圈',
                    className: 'task-half',
                    icon: 'circle'
                  }
                }else if(item.shareMomentCount){
                  item.task = {
                    text: '未分享好友',
                    className: 'task-half',
                    icon: 'msg'
                  }
                }
              }
            }else{
              item.task = {
                text: '新任务',
                className: 'task-new'
              }
            }
            
          });
          bookList = type ? list : bookList.concat(list);
          this.setData({bookList})
        }

      }
    }).catch(err => wxShowToast(err.message))
  },
  remove(e){
    const index = e.detail;
    const {bookList} = this.data;
    const {id} = bookList[index];
    redBookRemove(id).then(res => {
      wxShowToast('删除成功');
      bookList.splice(index, 1);
      this.setData({bookList})
    }).catch(err => wxShowToast(err.message))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll: function(e){
    if(throttle()){
      let { showGoTop } = this.data;
      let scrollTop = e.scrollTop;
      showGoTop = scrollTop > 500;
      this.setData({ showGoTop })
    }
  },
  goTop(){
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({ showGoTop: false })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listParam.currentPage = 1;
    isPull = true;
    this.getBookList('fresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {currentPage} = this.listParam;
    if(isPull){
      this.listParam.currentPage = currentPage + 1;
      this.getBookList();
    }else {
      wxShowToast('数据加载完成');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})