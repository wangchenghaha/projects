// weMall/daogouUvideo/daogouUvideo.js
import { splitImg } from '../../utils/utils'
import { getPage, getDelete, clickTime } from '../../service/saVideo'
import { URL, KEYSTORAGE } from '../../src/const.js'

let scrollState = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '导购视频列表',
    currentId: 'A',
    section: [
      {
        name: '导购视频',
        typeId: 'A'
      }, 
      {
        name: '我的视频',
        typeId: 'B'
      }
    ],
    timeSort: true,
    hotSort: true,
    eyes: splitImg('icon_eye_0823.png', 'common'),
    del: splitImg('icon_delete_0824.png', 'common'),
    play: splitImg('icon_player_0825.png','common'),
    buyVideoList: [
      {
        url: 'https://cmscdn.bestseller.com.cn/hds-creative/rest/rawfile/V0000000410/%E7%81%AB%E5%BD%B1D3%E7%AB%96%E7%89%88.mp4',
        title: '5月15日，街头随机拍摄，种草XX联名响应',
        clip: '刘美玲',
        shooting: '罗斯福',
        type: '街拍种草',
        introduction: '街头随机拍摄，种草联名，时尚大片，无与伦比的自我',
        time: '2021-08-12  17:23:45',
        state: '待审核',
        sentiment: '123'
      }
    ],



    startX: 0, //开始坐标
    startY: 0,
    page: 1,
    // list:[
    //   {
    //     url: 'https://cmscdn.bestseller.com.cn/hds-creative/rest/rawfile/V0000000410/%E7%81%AB%E5%BD%B1D3%E7%AB%96%E7%89%88.mp4',
    //     title: '街头随机拍摄，种草XX联名响应',
    //     clip: '刘美玲',
    //     shooting: '罗斯福',
    //     type: '街拍种草',
    //     introduction: '街头随机拍摄，种草联名，时尚大片，无与伦比的自我',
    //     time: '2021-08-12  17:23:45',
    //     state: '待审核',
    //     sentiment: '123'
    //   },
    //   {
    //     url: 'https://cmscdn.bestseller.com.cn/hds-creative/rest/rawfile/V0000000410/%E7%81%AB%E5%BD%B1D3%E7%AB%96%E7%89%88.mp4',
    //     title: '5月15日，街头随机拍摄，种草XX联名响应',
    //     clip: '刘美玲',
    //     shooting: '罗斯福',
    //     type: '街拍种草',
    //     introduction: '街头随机拍摄，种草联名，时尚大片，无与伦比的自我',
    //     time: '2021-08-12  17:23:45',
    //     state: '已通过',
    //     sentiment: '123'
    //   }
    //   // {
    //   //   id:0,
    //   //   title:'标题1',
    //   //   create_time:'2019-09-06'
    //   // }, 
    //   // {
    //   //   id: 1,
    //   //   title: '标题2',
    //   //   create_time: '2019-09-06'
    //   // }, 
    //   // {
    //   //   id: 2,
    //   //   title: '标题3',
    //   //   create_time: '2019-09-06'
    //   // }
    // ],

    controls: false,
    pageNum: 1,
    pageAll: 1,
    orderByUpdateTime: '',
    orderByClickTime: '',
    listAll: [],
    list: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // this.initEleWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    // var oDelList = app.globalData.delList;
    // this.setData({
    //     list: oDelList
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPage()
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

  },

  handleTap: function(e) {
    let id = e.currentTarget.id;
    if(id){
      this.setData({
        currentId:id,
        pageNum: 1,
        pageAll: 1,
        listAll: [],
        list: [],
        timeSort: true,
        hotSort: true,
        orderByUpdateTime: '',
        orderByClickTime: ''
      })
    }
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.getPage()
    // let {section, currentId} = this.data;
    // section.forEach((item,ind) => {
    //   if(parseInt(ind) === parseInt(currentId)){
    //     item.selected = !item.selected;
    //   }
    // });
    // this.setData({
    //   section:this.data.section
    // })
  },
  timeSortFun: function(e) {
    this.setData({
      timeSort: !this.data.timeSort,
      hotSort: true,
      orderByUpdateTime: this.data.orderByUpdateTime === 1 ? '' : 1,
      orderByClickTime: '',
      pageNum: 1,
      pageAll: 1,
      listAll: [],
      list: []
    })
    this.getPage()
  },
  hotSortFun: function(e) {
    this.setData({
      timeSort: true,
      hotSort: !this.data.hotSort,
      orderByUpdateTime: '',
      orderByClickTime: this.data.orderByClickTime === 1 ? '' : 1,
      pageNum: 1,
      pageAll: 1,
      listAll: [],
      list: []
    })
    this.getPage()
  },
  goUvideo: function() {
    wx.navigateTo({
      url: '/weMall/daogouUvideoDetail/daogouUvideoDetail'
  })
  },

  touchE: function (e) {
    // console.log(e);
    var that = this
    if (e.changedTouches.length == 1) {
    //手指移动结束后触摸点位置的X坐标
    var endX = e.changedTouches[0].clientX;
    //触摸开始与结束，手指移动的距离
    var disX = that.data.startX - endX;
    var delBtnWidth = that.data.delBtnWidth;
    //如果距离小于删除按钮的1/2，不显示删除按钮
    var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
    
    //获取手指触摸的是哪一项
    var index = e.currentTarget.dataset.index;
    var list = that.data.list;
    list[index].txtStyle = txtStyle;
    //更新列表的状态
    that.setData({
    list: list
    });
    }
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
    //开始触摸时 重置所有删除
    console.log('触摸开始' + JSON.stringify(e))
    if (e.currentTarget.dataset.approvestatus === 'Approved') {
      return
    }
    this.data.list.forEach(function (v, i) {
    if (v.isTouchMove) //只操作为true的
    v.isTouchMove = false;
    })
    this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    list: this.data.list
    })
    },
    //滑动事件处理
    touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index, //当前索引
    startX = that.data.startX, //开始X坐标
    startY = that.data.startY, //开始Y坐标
    touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
    //获取滑动角度
    angle = that.angle({
    X: startX,
    Y: startY
    }, {
    X: touchMoveX,
    Y: touchMoveY
    });
    that.data.list.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
    if (touchMoveX > startX) //右滑
    v.isTouchMove = false
    else //左滑
    v.isTouchMove = true
    }
    })
    //更新数据
    that.setData({
    list: that.data.list
    })
    },
    /**
    * 计算滑动角度
    * @param {Object} start 起点坐标
    * @param {Object} end 终点坐标
    */
    angle: function (start, end) {
    var _X = end.X - start.X,
    _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    delBtn: function (e) {
      console.log(e)
      console.log(e.currentTarget.dataset.id)
      // this.data.list.splice(e.currentTarget.dataset.index, 1)
      // this.setData({
      //   list: this.data.list
      // })
      this.getDelete(e.currentTarget.dataset.id)
    },

    lower: function () {
      console.log('AAAAAAAAAA')
      this.getPage()
    },


    getPage: function () {
      if (this.data.pageAll < this.data.pageNum) {
        wx.showToast({
          title: '已加载全部',
          duration: 2000
        })
        return
      }
      if (!scrollState) {
        scrollState = true
      } else {
        return
      }
      wx.showLoading({
        title: '加载中',
      })
      let createBy = ''
      if (this.data.currentId === 'A') {
        console.log('--->导购视频')
        createBy = ''
      } else {
        console.log('--->我的视频')
        createBy = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId
      }
      let param = {
        brand: getApp().config.brand,
        createBy: createBy,
        currentPage: this.data.pageNum,
        pageSize: 20,
        orderByUpdateTime: this.data.orderByUpdateTime,
        orderByClickTime: this.data.orderByClickTime
      }
      if (scrollState) {
        getPage(param).then(res => {
          wx.hideLoading();
          scrollState = false
          console.log('滚动状态1-----' + scrollState)
          // console.log('列表返回值' + JSON.stringify(res.records))
          let data = res.records
          // console.log('-----------------------' + data)
          // console.log([...this.data.listAll, ...data])
  
        data.forEach((item,index,array)=>{
          item.videoUrl = 'https://cms-test.bestseller.com.cn/hds-creative/rest/' + item.videoUrl
        })
        // console.log('重组后的' + data)
  
          this.setData({
            listAll: [...this.data.listAll, ...data],
            list: [...this.data.list, ...data],
            pageNum: this.data.pageNum + 1,
            pageAll: res.pages
          })
        }).catch(err => {
          wx.hideLoading();
          scrollState = false
          console.log('滚动状态2-----' + scrollState)
          // wxShowToast(err.message)
        })
      }
      // scrollState = false
      console.log('滚动状态3-----' + scrollState)
    },

    getDelete: function (id) {
      wx.showLoading({
        title: '加载中',
      })
      // let param = {
      //   id: id
      // }
      getDelete(id).then(res => {
        wx.hideLoading();
        this.setData({
          pageNum: 1,
          listAll: [],
          list: []
        })
        wx.showToast({
          title: '删除成功',
          duration: 2000
        })
        this.getPage()
      }).catch(err => {
        wx.hideLoading();
        // scrollState = false
        // wxShowToast(err.message)
      })
    },

    goDetail: function (e) {
      console.log(e)
      console.log(e.currentTarget.dataset.index.id)
      let id = e.currentTarget.dataset.index.id;
      let approveStatus = e.currentTarget.dataset.index.approveStatus;
      if (approveStatus === 'Init') {
        wx.navigateTo({
          url: `/weMall/daogouUvideoDetail/daogouUvideoDetail?id=${id}`,
        })
      }
    },

    screenChange(e){
      let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
      if (!fullScreen ){ //退出全屏
        let videoContext = wx.createVideoContext(e.currentTarget.id, this)
        videoContext.pause();
        this.setData({
          controls: false
        })
      }else{ //进入全屏
       this.setData({
          controls: true
        })
      }
   },

    videoMax: function (e) {
      console.log(e)
      if(!this.data.controls) {
        let videoContext = wx.createVideoContext(e.currentTarget.id, this)
        videoContext.play();
        videoContext.requestFullScreen();

        this.getClickTime(e.currentTarget.id)
      }
    },

    getClickTime: function (id) {
      let param = {
        id: id
      }
      clickTime(param).then(res => {
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
      })
    }


    


})