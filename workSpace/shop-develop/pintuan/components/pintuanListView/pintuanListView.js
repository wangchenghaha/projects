/*
 * @Author: your name
 * @Date: 2020-02-04 17:47:24
 * @LastEditTime: 2020-05-30 13:29:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SELECTED/pintuan/components/pintuanListView/pintuanListView.js
 */ 
// components/pintuanListView/pintuanListView.js
let app =  getApp();

  
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: Array, //数据源
    originaListData:Array,  //大图用的数据源
    noScroll : Boolean,
    fromClass : String, //list:列表(列表页添加收藏)
    isBigImage : Boolean  //是否展示大图
  },

  /**
   * 组件的初始数据
   */
  data: {
    listData: [], //数据源
    fromClass : '',
    isBigImage : false,
    noScroll : false
  },
  ready : function(){
    let listData = this.properties.listData;
    let originaListData = this.properties.originaListData;
    let fromClass = this.properties.fromClass;
    let isBigImage = this.properties.isBigImage;
    let noScroll = this.properties.noScroll;
    this.setData({
      fromClass,
      isBigImage,
      noScroll,
      listData,
      originaListData
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    imageTap : function(e){
      // console.log(`点击:${JSON.stringify(e)}`)
      let id = e.currentTarget.id;
      if (id == 'collection'){
        console.log('收藏')
      }
      else{
        // console.log('点击图片，id是:',e.currentTarget.dataset);
        // wx.navigateTo({ url: `/pintuan/pintuanDetail/pintuanDetail?productCode=${e.currentTarget.dataset.sku.goodsCode}&gsColorCode=${e.currentTarget.dataset.sku.gsColorCode}` });
        if (e.currentTarget.dataset.sku.sellStock == 0){
          wx.showModal({
            title: '提示', //提示的标题,
            content: '该商品暂无库存', //提示的内容,
            showCancel: false, //是否显示取消按钮,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#3CC51F', //确定按钮的文字颜色,
            success: res => {
            }
          });
        }
        else if (e.currentTarget.dataset.sku.sellStock <= 2){
          wx.showModal({
            title: '提示', //提示的标题,
            content: '活动已结束', //提示的内容,
            showCancel: false, //是否显示取消按钮,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#3CC51F', //确定按钮的文字颜色,
            success: res => {
            }
          });
        }
        else{
          let goodCode = e.currentTarget.dataset.sku.gsColorCode.substr(0,e.currentTarget.dataset.sku.gsColorCode.length - 3)
          wx.navigateTo({ url: `/pintuan/pintuanDetail/pintuanDetail?productCode=${goodCode}&gsColorCode=${e.currentTarget.dataset.sku.gsColorCode}` });
        }
      }
    }
  }
})
