// rest新版接口
import{PTShoppingListData} from '../netWork/pintuanRquest.js'
import {KEYSTORAGE} from '../../src/const'
import { getBrandBySku,  yipinNumber, objToQuery, getQueryStringArgs} from '../../utils/utils'

const app = getApp();
const {brand} = app.config;
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    /* 筛选尺寸 */
    noScroll : false,
    isBigImage : false,
    // 滚动到顶部
    goTopShow:false,
    // 数据源
    listData:[]
  },
  onClink : function(e){
    let id = e.currentTarget.id
    if (id == 'gotoTop'){
      wx.pageScrollTo({scrollTop: 0 });
    }
  },

  // 数据请求
  requst : function(){
    let goTopShow = this.data.goTopShow
    let listData = this.data.listData
    PTShoppingListData().then(res=>{
      listData = res
      goTopShow = false
      listData.forEach(item=>{
        let goodsCode = item.gsColorCode.substr(0,item.gsColorCode.length - 3)
        if (!(item.gscMaincolPath.startsWith('https'))){
        /* nameit 选p7的图 */
        let p = '_p3.jpg'
        if (getBrandBySku(goodsCode) == 'NAMEIT'){
          p = '_p7.jpg'
        }
        let path = `${app.config.cdn}/goodsImagePC/${getBrandBySku(goodsCode)}/${goodsCode}/${item.gsColorCode}/240400/${item.gsColorCode}${p}`

          item.gscMaincolPath = path
        }
        // 计算已拼件数
        item.yipinNum = yipinNumber(item.startTime)
      })
      listData = listData.filter(item => {
        return item.sellStock >= 2
      })

      this.setData({
        listData,
        goTopShow
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requst()
    curOptions = options;
    // console.log(`列表页shareBy参数:${JSON.stringify(options)}`)
    if(options.q){
      curOptions = getQueryStringArgs(decodeURIComponent(options.q));
    }
    if (curOptions.share_by){
      let orderSaveShare = {
        shareBy: curOptions.share_by || '',
        shareByShop: curOptions.share_by_shop || ''
      };
      app.setShareInfo(orderSaveShare)
    }
    app.setUtmOptions(curOptions)
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
    let a = wx.getStorageSync('reloadList');
    wx.removeStorageSync('reloadList');
    if (a == '1'){
      this.requst()
    }

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
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    let dgJson = {
      share_by : sharePams.employeeId || shareFrom.shareBy || shareFrom.share_by || '',
      share_by_shop : sharePams.shopCode || shareFrom.shareByShop || shareFrom.share_by_shop || '',
    }
    // 合并UTM参数
    Object.assign(dgJson, app.getUtmOptions())

    let path = `/pintuan/pintuanList/pintuanList${objToQuery(dgJson)}`
    console.log(`分享地址:${path}`)
    return{
      title: '',
      path : path,
      imageUrl : '',
      success:function(e){
        console.log(`分享成功`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  }
})
