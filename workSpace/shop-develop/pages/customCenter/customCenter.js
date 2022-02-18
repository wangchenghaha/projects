import { getCustomizationJson } from '../../service/customization'

let loadingTime = null;
let forShow = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider: [],
    // 轮播图
    swiper: {
      data: [],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 500,
    },
    swiperList: [],
    pageModule: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCustJson();
  },

  getCustJson: function(){
    loadingTime = setTimeout(() => {
      wx.showLoading({
        title:'加载中...',
        mask: true
      },800)
    });
    getCustomizationJson().then(res => {
      this.handleData(res)
    })
  },


  handleData: function(res){
    res.forEach(item => {
      // 大轮播
      if (item.moduleType === 'largeLoop'){
        item.largeLoop = item.detailList;
      }
      // 4个
      if(item.moduleType === 'categoryType'){
        item.categoryType = item.detailList;
      }
      // 按钮
      if(item.moduleType === 'botton'){
        item.bottonArr = item.detailList;
      }
      /* 分类 */
      if (item.moduleType === 'category') {
        item.categoryArr = item.detailList;
      }
      /* 热销 */
      if (item.moduleType === 'hot') {
        item.hotArr = item.detailList;
      }
    });
    console.log(res);
    this.setData({
      pageModule: res
    });
    clearTimeout(loadingTime);
    wx.hideLoading();
  },
  

  onClick: function(e){
    console.log(e);
    let moduleType = e.target.dataset.module;
    let groupName = e.target.dataset.groupname;
    let type = e.target.dataset.type;
    let code =  e.target.dataset.code;
    let marks = e.target.dataset.marks;
    let currentIndex = e.currentTarget.dataset.index;
    let pageModule = this.data.pageModule;
    switch(moduleType){
      case "largeLoop":
        break;
      case "botton":
          if(currentIndex === 0){
            forShow = 1;
            pageModule[1].detailList[0].picUrl = this.getPicUrl("customer_sel.png");
            pageModule[1].detailList[1].picUrl = this.getPicUrl("mark_nor.png");
          } else {
            forShow = 2;
            pageModule[1].detailList[0].picUrl = this.getPicUrl("customer_nor.png");
            pageModule[1].detailList[1].picUrl = this.getPicUrl("mark_sel.png");
          }
          pageModule[2].isShow = true;
        break;
      case "categoryType":
          this.jumpUrl(moduleType, type, '');
        break;
      case "hot":
          this.jumpUrl(moduleType, groupName, ''); 
          break;
      case "category":
          this.jumpUrl(moduleType, code, marks);
        break;
    }
    this.setData({
      pageModule,
    })
   
  },

  getPicUrl: function(picName){
    return "https://cdn.bestseller.com.cn/assets/wechat/customization/JACKJONES/" + picName;
  },

  jumpUrl: function(type, goodsType, marks){

    switch(type){
      case "categoryType":
          wx.setStorageSync("forShow", forShow);
          wx.navigateTo({
            url: '../../customization/customClassify/customClassify?classify=' + goodsType + '&forShow=' + forShow,
          })
        break;
      case "hot":
          wx.setStorageSync("forShow", 1);
          wx.navigateTo({
            url: '../../customization/customClassify/customClassify?classify=all&theme=' + goodsType + '&forShow=1',
          })
          break;
      case "category":
          let graphicsId = "";
          let goodsgraphic = marks;
          goodsgraphic.forEach(item=>{
            graphicsId += item.graphic_id
            graphicsId += '_'
          })
          wx.setStorageSync("forShow", 1);
          graphicsId = graphicsId.substr(0,graphicsId.length - 1)
            wx.navigateTo({
              // 测试URL
              // url: '../../customization/customGoodsDetail/customGoodsDetail?goodsCode=220101504&type=0&graphicsId=44'
              // 正式URL
              url: '../../customization/customGoodsDetail/customGoodsDetail?goodsCode='+ goodsType + '&type=1&graphicsId=' + graphicsId
            })
        break;
    }
     
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})