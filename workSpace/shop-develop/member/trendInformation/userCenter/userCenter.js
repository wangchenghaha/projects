import { EVENTS, KEYSTORAGE } from '../../../src/const.js'
import {trendVisitor} from '../../service/trendinfo'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[{ name: '关注' ,
            nums: 100,
            selected: true},
          { name: '赞过' ,
            nums: 100,
            selected: false}],
    avatarImg:'',
    nickName: '',
    listData: [], 
    vistorId: 0,
    userData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      vistorId: options.vistorId
    })
    this._trendVisitor();
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

  _trendVisitor(){
    let {tabs} = this.data;
    trendVisitor(this.data.vistorId).then(res =>{
      tabs[0].nums = res.focusTotal;
      tabs[1].nums = res.praiseTotal;
      this.setData({
        userData: res,
        avatarImg:res.avatarUrl,
        nickName: res.nickname,
        tabs,
        listData: res.focusList
      })
    })
  },

  onClick(e){
    let {tabs, listData, userData} = this.data;
    let type = e.currentTarget.dataset.type;
    let item = e.currentTarget.dataset.item;
    switch(type){
      case 'tab':
        if(item.selected){
          return;
        } else {
          for (let i = 0; i < tabs.length; i++) {
            if(tabs[i].name === item.name){
              tabs[i].selected = true
            } else {
              tabs[i].selected = false
            }
          }

          if(item.name === '关注'){
            listData = userData.focusList
          } else {
            listData = userData.praiseList
          }
          this.setData({
            tabs,
            listData
          })
        }
        break;
    }
  }

})