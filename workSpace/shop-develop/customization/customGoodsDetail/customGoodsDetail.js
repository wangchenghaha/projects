//Page Object
import { getDetail } from '../../service/customization'
import {customModel} from '../requstModel'
import {KEYSTORAGE} from '../../src/const'
import {
  judgeUrl,
  splitImg, getCurrentUrl
} from '../../utils/utils'
import { 
  getImageInfo, 
  saveImageToPhotosAlbum,
} from '../../service/saveImg' 
import { awardActivity } from '../../service/order'
const config = require('../../src/config.js');
import { getDetailPage } from '../../service/goods'

Page({
  data: {
    bodyContent : '',
    // html高度
    htmlHeight : 0,
    tipShow : false,
    // 数据
    jsonDatas : {
      selectIndex : 0,
      graphic_ids : [],
      type : '0',
      datas : []
    },
    // 适配iphoneX
    iphoneXHeight : 0,
    // 颜色/尺码数据
    colorAndChimaArrs : [
      {
        title : "",
        arrs : [],
        // 选择颜色动画
        canShow : false,
        animation : ''
      },
      {
        title : '',
        sku : '',
        arrs : [],
        values : [],
        // 选择尺码动画
        canShow : false,
        animation : ''
      }
      
    ],
    // 底部view
    bottomViewTitles : [
      "客服","重新定制","直接购买"
    ],    // help弹框图片
    helpData:{
      bouncedImage : splitImg('helpBounced.jpg'),
      qrCode : splitImg('helpBouncedQrCode.png'),
      // 2019.06.08 周六临时FOL修改
      wxNum : config.CUSTOMER_WX_NAME
    },
    // 弹框透明背景
    canShow : false,
    // 轮播图片高度
    swiperImageHeight:0
  }, 
  /*
  * 客服
  * */
 openHelp: function(){
  try {
    getApp().tdSdkEvent('pageclick_home_customerservice', {});
  }catch (e) {}
  this.setData({
    tipShow: true
  });
},
  // 去掉客服弹窗
  changeShow: function(e){
    this.setData({
      tipShow: false
    });
  },
  // 客服二维码
  awardActivity: function(){
    let param = {
      orderType:0,
      pageType:1,
      pageAddress: getCurrentUrl()
    };
    awardActivity(param).then( res => {
      let helpData = this.data.helpData;
      if(res && res.length){
        for(let item of res){
          if(item.pageRule){
            helpData.bouncedImage = judgeUrl(item.imgUrl);
            helpData.wxNum = item.pageRule;
            break;
          }
        }
        this.setData({helpData});
      }
    })
  },
  bouncedSave : function(){
    let _this = this;
    getApp().isAuthor({
      type: 'scope.writePhotosAlbum',
      title: '需要授权相册权限才能保存',
      callBack: _this.saveImage,
    })
  },
  saveImage:function(){
    var text = '保存成功'
        // 获取图片信息
        getImageInfo(this.data.helpData.qrCode).then(res=>{
          saveImageToPhotosAlbum(res).then(res=>{
            if (res.errMsg != 'saveImageToPhotosAlbum:ok'){
              text = res.errMsg
            }
            wx.showToast({
              title: text, //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          })
        })

  },
  // 拨打电话
  callPhone :function(){
    wx.makePhoneCall({ phoneNumber: '400-862-8888' });
  },
  // 复制微信号
  bouncedCopy : function(){

    wx.setClipboardData({
      data: this.data.helpData.wxNum,
      success(res) {
        wx.showToast({
          title: '复制成功', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      }
    })
  },
  selectTap_subs:function(e){
    // console.log(`aaaaaa:${JSON.stringify(e)}`)
    let id = e.currentTarget.id
    let type = e.currentTarget.dataset.type
    // console.log(`dianji:${id}///${type}`)

    let jsonDatas = this.data.jsonDatas
    let colorAndChimaArrs = this.data.colorAndChimaArrs
    let json = colorAndChimaArrs[type]
    if (type == 0){
      // 颜色
      if (jsonDatas.selectIndex != id){
        jsonDatas.selectIndex = id
        json.title = json.arrs[id]
  
        let chima = colorAndChimaArrs[1]
        chima.title = ''
        chima.sku = ''
      }
    }
    else{
      json.title = json.arrs[jsonDatas.selectIndex][id]
      json.sku = json.values[jsonDatas.selectIndex][id]
    }
    this.setData({jsonDatas,colorAndChimaArrs})
  },
  // 底部按钮
  bottomTap : function(e){
    
    let id = e.currentTarget.id
    let json = {
      jsonData : this.data.jsonDatas.datas[this.data.jsonDatas.selectIndex],
      colorAndChimaArrs : this.data.colorAndChimaArrs
    }

    if (id != 0 && this.data.colorAndChimaArrs[1].title == ''){
      wx.showToast({
        title: '请选择尺码',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
      return
    }
    if (id != '0'){
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
        return;
      }
    }
    
    switch (id) {
      case '0':
        this.openHelp()
        break;
      case '1':
        wx.navigateTo({
          url: `../customEditGoods/customEditGoods?type=${this.data.jsonDatas.type}&datas=${JSON.stringify(json)}`
        });
        break;
      case '2':
        // 直接购买
        customModel(json)
        wx.navigateTo({
          url: `../customOrderSave/customOrderSave`
        });
        break;
    
      default:
        break;
    }
      
      
  },
  // 获取图片高度
  getImageHeight : function (e) {
    if (this.data.swiperImageHeight == 0){
        var winWid = wx.getSystemInfoSync().windowWidth;
        var imgh=e.detail.height;
        var imgw=e.detail.width;
        var swiperH=winWid*imgh/imgw;
    
        this.setData({swiperImageHeight : swiperH});
    }
  },
  // 选择颜色
  selectTap : function(e){
    // console.log(`aaa:${JSON.stringify(e)}`)
    let id = e.currentTarget.id
    let colorAndChimaArrs = this.data.colorAndChimaArrs
    let json = this.data.colorAndChimaArrs[id]

    let num = json.canShow

    let rotateNum = num ? 0 : -180
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    animation.rotate(rotateNum).step();

    json.animation = animation.export()
    json.canShow = !json.canShow

    colorAndChimaArrs[id] = json
    this.setData({colorAndChimaArrs})


  },
  // 商品描述弹框
  bouncesTap : function(e){
    if(this.data.canShow){
      this.setData({canShow : false})
      setTimeout(() => {
        this.setData({htmlHeight : 0})
      }, 300);
      return
    }
    let height = wx.getSystemInfoSync().windowHeight - ((this.data.iphoneXHeight + 210) * (wx.getSystemInfoSync().windowWidth / 750))
    this.setData({canShow : true,htmlHeight : height})
  },
  // 请求详情数据
  getDetailData : function(sku){
    let sku_9 = sku.substr(0,9)
    let jsonDatas = this.data.jsonDatas
    let colorAndChimaArrs = this.data.colorAndChimaArrs
    let color = colorAndChimaArrs[0]
    let chima = colorAndChimaArrs[1]
    let json = {
      garment_sku : sku_9,
      graphic_ids : jsonDatas.graphic_ids
    }
    getDetail(json).then(item => {
      // console.log(`aaaa:${JSON.stringify(item)}`)
      jsonDatas.datas = item

      let colors = []
      jsonDatas.datas.forEach((item,index) => {
        if (item.sku == sku){
          jsonDatas.selectIndex = index
        }
        item.pic_back = `${getApp().config.cdn}/${item.pic_back}`
        item.pic_front = `${getApp().config.cdn}/${item.pic_front}`
        item.pic_preview = `${getApp().config.cdn}/${item.pic_preview}`
        item.swiperPics = [item.pic_preview,item.pic_front,item.pic_back]
        colors.push(item.color)
        let keys = []
        let values = []
        for (var key in item.size){
          keys.push(key)
          values.push(item.size[key])
        }
        chima.arrs.push(keys)
        chima.values.push(values)

      });
      color.title = colors[jsonDatas.selectIndex]
      color.arrs = colors
      chima.title = ''
      chima.sku = ''
      this.setData({jsonDatas,colorAndChimaArrs})

    })
  },
  //options(Object)
  onLoad: function(options){
    let that = this
    let iphoneXHeight = this.data.iphoneXHeight
    let jsonDatas = this.data.jsonDatas
    jsonDatas.type = options.type
    jsonDatas.graphic_ids = options.graphicsId.split('_')
    wx.getSystemInfo({
        success: function(res){
          if(res.model.substring(0, 8) === 'iPhone X'){
            iphoneXHeight = 68
          }
          else{
            iphoneXHeight = 0
          }
          that.setData({iphoneXHeight})
        }
    })
    this.getDetailData(options.goodsCode)
    this.setData({jsonDatas})
    this.awardActivity()

    let sku_9 = options.goodsCode.substr(0,9)

    getDetailPage(sku_9).then(res => {
      this.setData({
        detailShow: true,  // 详情页是否显示
        bodyContent: res
      })
    })

  },
  onReady: function(){
    
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});