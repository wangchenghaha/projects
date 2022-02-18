import { splitImg } from '../../utils/utils'
import {getStaffSaleByTop} from '../../service/saleState'
import {wxShowToast} from '../../utils/wxMethods'
let app =  getApp();

  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: splitImg("banner_up_0411.jpg"),
    background: splitImg('member_banner.jpg'),
    userPic: '',
    userName: '',
    userStore: '',
    userStoreCode: '',
    areaList: [{
                title: '全国销售排行榜',
                seleted: true,
              }
              // ,
              // {
              //   title: '城市销售排行榜',
              //   seleted: false,
              // }
            ],
    periodList: [{
                  title: '今日TOP10',
                  seleted: true,
                  type: 'D2D'
                },
                {
                  title: '本周TOP10',
                  seleted: false,
                  type: 'W2D'
                },
                {
                  title: '本月TOP10',
                  seleted: false,
                  type: 'M2D'
                }],

    rankList: [{},{},{},{},{},{},{},{},{},{}],
    todayPrice: 10000,
    comparePrice: "+134",
    compareRank: "+4",
    ranks: 88888,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let guideInfo = wx.getStorageSync("daogouInfo");
    this.setData({
      userPic: guideInfo.portraitPic,
      userName: guideInfo.STAFF_NAME,
      userStore:guideInfo.shopName,
      userStoreCode: guideInfo.shopCode,
    })
    this._getStaffSaleByTop('D2D');
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  onClick: function(e){
    let type =  e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let datetype = e.currentTarget.dataset.datetype;
    const areas = this.data.areaList;
    const periods = this.data. periodList;
  
    switch(type){
      case 'area':
        if(areas[index].seleted){
          return;
        }
        for (let i = 0; i < areas.length; i++) {
          if(i === index){
            areas[i].seleted = true
          }else{
            areas[i].seleted = false
          }
        }
        this.setData({
          areaList: areas,
        })
        break;
      case 'period':
          if(periods[index].seleted){
            return;
          }
          for (let i = 0; i < periods.length; i++) {
            if(i === index){
              periods[i].seleted = true
            }else{
              periods[i].seleted = false
            }
          }

          this.setData({
            periodList: periods,
          })
          this._getStaffSaleByTop(datetype)
        break;
    }
  },

  _getStaffSaleByTop(type){
    let jsData = {
      brand: app.config.brand,
      dateType: type
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    getStaffSaleByTop(jsData).then(res =>{
      wx.hideLoading();
      let rankList = [{},{},{},{},{},{},{},{},{},{}];
      if(res[0]){
        for (let i = 0; i < 10; i++) {
            if(res[i].rcmBiShop){
              if(res[i].rcmBiShop.physicalcity){
                let city =  res[i].rcmBiShop.physicalcity.split("@")[2] ? res[i].rcmBiShop.physicalcity.split("@")[2] : res[i].rcmBiShop.physicalcity.split("@")[1]
                rankList[i].area = city
              }
              rankList[i].name = res[i].staffName
            
              rankList[i].numbers = res[i].staffNo.substring(0,4) + '****' + res[i].staffNo.substring(8)
              rankList[i].store = res[i].rcmBiShop.storename
              rankList[i].salsePrice = res[i].salesNetValue
            } else {
              rankList[i].name = res[i].staffName
              rankList[i].numbers = res[i].staffNo.substring(0,4) + '****' + res[i].staffNo.substring(8)
              rankList[i].salsePrice = res[i].salesNetValue
            }
          
        }
        rankList[0].icons = splitImg("champion.png")
        rankList[1].icons = splitImg("second-place.png")
        rankList[2].icons = splitImg("third-place.png")
      }
      this.setData({
        rankList,
      })
    }).catch(err =>{
      wx.hideLoading();
      wxShowToast(err);
    })
  },

  reload: function(){
    this._getStaffSaleByTop('D2D');
  }
})