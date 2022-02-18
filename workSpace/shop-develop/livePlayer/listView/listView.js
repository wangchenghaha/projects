// livePlayBack/listView/listView.js
import {
  splitImg,
  numToWan
} from '../../utils/utils'

import {
  getShortVideoList
} from '../netWork/shortVideoRquest'

import { liveRoom } from '../../service/livePlayer' 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playBtnImg : splitImg('zbj_playBtn.png'),
    baokuanImg : splitImg('zbj_bk.png'),


    // 数据
    listData : [],
    // 请求参数
    requstData : {
      brandCode : getApp().config.brand,
      pageNumber : 1, //页数
      pageSize : 12, //每页数据
      isIndex : 0
    },
    // 全部页数
    totalPage : 0,
    // 滚动到顶部
    goTopShow:false,
    // 预约和直播中数据
    roomInfo : []
  },
  // 时间戳转日期字符串
  timerToStr : function(time){
    let date = new Date(time * 1000);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    month = month < 10 ? "0"+month:month;
    day = day < 10 ? "0"+day:day;

    let hours = date.getHours()
    let minus = date.getMinutes()
    hours = hours < 10 ? "0"+hours:hours;
    minus = minus < 10 ? "0"+minus:minus;
    let json = {
      year,
      month,
      day,
      hours,
      minus
    }
    return json
  },
  getLiveRoom(){ 
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let that = this 
    liveRoom().then(res => { 
      wx.hideLoading();
      if(res && res.errcode === 0){ 
        if(res.room_info && res.room_info.length){ 
          // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常; 
          let roomInfo = that.data.roomInfo 
 
          roomInfo = res.room_info.filter(item => item.live_status === 102 || item.live_status === 101); 
          
          roomInfo.forEach(item => {
            item.isZhibo = false
            item.zhiboTitle = '直播即将开始'
            if (item.live_status === 101){
              item.isZhibo = true
              item.zhiboTitle = '直播中'
            }
            item.huanhang = false
            // 4月30号邓论单独处理
            if (item.roomid == 15){
              item.startHoursStr = '4月30日下午16:00'
              item.huanhang = true
            }
            else{

              let json = that.timerToStr(item.start_time) 
              item.startHoursStr = `${json.hours}:${json.minus}不见不散` 
            }
          })
          that.setData({roomInfo})
 
        } 
 
      } 
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
    })},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: `${getApp().config.brand}直播间`
    });

    this.getLiveRoom()
    this.requst()

  },
  centerTap : function(e){
    // console.log(`中间事件:${JSON.stringify(e)}`)
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    let currentIndex = e.currentTarget.dataset.index


    let json = {
      type,
      id,
      currentIndex
    }

    wx.navigateTo({
      url: `../playerDetail/playerDetail?listViewJson=${JSON.stringify(json)}`
    });
  },
  gotoTop:function(){

    wx.pageScrollTo({scrollTop: 0 });
  },
  gotoZhibo : function(e){
    let id = e.currentTarget.dataset.roomid

    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`
    })
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

  requst:function(){
    var requstData = this.data.requstData
    var totalPage = this.data.totalPage
    var goTopShow = this.data.goTopShow
    getShortVideoList(
      JSON.stringify(requstData)
      .replace(/:/g,'=')
      .replace(/,/g,'&')
      .replace(/\"/g,'')
      .replace(/{/g,'')
      .replace(/}/g,'')
      ).then(res=>{
        // console.log(`请求requst:${JSON.stringify(res)}`)
        var listData = this.data.listData
        if(requstData.pageNumber == 1){
          listData = res.videoList
          goTopShow = false
        }
        else{
          goTopShow = true
          listData = listData.concat(res.videoList)
        }
        totalPage = res.totalCount
        listData.forEach(item => {
          item.priseCount = numToWan(item.priseCount)

          // 年月日
          item.nyr = item.putOnTime.split(' ')[0].replace(/-/g,'/')
          // 月日
          item.yr = item.nyr.substring(5)
          // 时间
          let a = item.putOnTime.split(' ')[1].split(':')
          item.nyrTime = `${a[0]}:${a[1]}`

          item.goodsList.forEach(item => {
            if (item.displayEnd.substr(0,2) == '00'){
              item.shichang = item.displayEnd.substr(3)
            }
            else{
              item.shichang = item.displayEnd
            }
            if (!(item.goodsName.indexOf('useCoveImg') != -1)){
              item.goodsName = item.goodsName.replace(/useCoveImg/g,'')
              item.coverImg = `${getApp().config.cdn}/goodsImagePC/${getApp().config.brand}/${item.goodsCode.substr(0,9)}/${item.goodsCode}/240400/${item.goodsCode}_T03.jpg`

              // https://cdn.bestseller.com.cn/goodsImagePC/JACKJONES/220221508/220221508E03/750750/220221508E03_T01.jpg
            }
          })
        });

        this.setData({
          listData,
          totalPage,
          goTopShow
        })
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉')
    var requstData = this.data.requstData

    if (this.data.listData.length < this.data.totalPage){
      requstData.pageNumber += 1
      this.setData({
        requstData
      })
      this.requst()
    }
    else{
      wx.showToast({
        title: '暂无数据', //提示的内容,
        icon: 'none', //图标,
        duration: 1000, //延迟时间,
        mask: false, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})