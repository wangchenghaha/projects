import {shareLiveList, shareLiveRemove} from '../../service/livePlayer'
import {wxShowToast} from '../../utils/wxMethods'
import {throttle, judgeUrl} from '../../utils/utils'
import {KEYSTORAGE} from '../../src/const'
const app = getApp();
const {cdn, brand} = app.config;
let isPull = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareList: [],
    showGoTop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShareLiveList();
  },
  listParam: {
    employeeId: '',
    page: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: ''
  },
  getShareLiveList(type){
    const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
    const param = this.listParam;
    param.employeeId = employeeId;
    wx.showLoading({
      title: '请求中...',
      mask: true
    })
    if(type){
      wx.stopPullDownRefresh()
    }
    shareLiveList(param).then(res => {
      wx.hideLoading();
      if(res && res.list){
        const {totalCount, totalPage, list} = res;
        if(param.pageNumber >= totalPage ){
          isPull = false;
        }
        list.forEach(item => {
          item.allShareCount = item.shareCount + item.shareMomentCount;
          item.shareImg = judgeUrl(item.shareImg);
          // 是否显示删除按钮
          item.delBtnShow = item.createByOpenid === employeeId;
          //
          if(item.delBtnShow){
            // 自己的模板
            if(item.shareCount && item.shareMomentCount){
              item.task = {
                text: '已完成',
                className: 'task-finish',
              }
            }else{
              if(!item.shareMomentCount){
                item.task = {
                  text: '未分享到朋友圈',
                  className: 'task-half',
                  icon: 'circle'
                }
              }else if(!item.shareCount){
                item.task = {
                  text: '未分享好友',
                  className: 'task-half',
                  icon: 'msg'
                }
              }
            }
          }else{
            // 运营模板
            item.task = {
              text: '新任务',
              className: 'task-new'
            }
          }

        });
        let {shareList} = this.data;
        shareList = type ? list : shareList.concat(list);
        this.setData({shareList})
      }
    }).catch(err => wxShowToast(err.message))
  },
  goDetail(e){
    const {index} = e.currentTarget.dataset;
    const {roomId, id} = this.data.shareList[index];
    app.gioTrack('pageclick_share_live_room', {
      liveRoomNo: roomId
    })
    wx.navigateTo({
      url: `../liveDetail/liveDetail?id=${id}`
    })
  },
  delShare(e){
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success (res) {
        if (res.confirm) {
          _this.removeShareLive(e)
        }
      }
    })
  },
  removeShareLive(e){
    const {index} = e.currentTarget.dataset;
    const {shareList} = this.data
    shareLiveRemove(shareList[index].id).then(res => {
      wxShowToast('删除成功');
      shareList.splice(index, 1);
      this.setData({shareList })
    }).catch(err => wxShowToast(err.message));
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
    this.listParam.pageNumber = 1;
    isPull = true;
    this.getShareLiveList('fresh');

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {pageNumber} = this.listParam
    if(isPull){
      this.listParam.pageNumber = pageNumber + 1;
      this.getShareLiveList();
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
