import { splitGameImg, skuToImg, countDown, objToQuery, timeFormat, getQueryStringArgs} from '../../utils/utils'
import { getSeckillList } from '../service/seckill'
import {URL_CDN, KEYSTORAGE} from "../../src/const";
import {wxShowToast} from '../../utils/wxMethods'
import { wxSubscription } from '../../utils/wxSubscribe'
var app = getApp();
let timeId;
const cdn = app.config.cdn;
let skuToImgParam = {
  size: URL_CDN.IMGSIZE240400
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actImage: "",
    timerBg: splitGameImg('timerBg_new.png', 'seckill'),
    logoImg: splitGameImg('logoBg.png', 'seckill'),
    isShowRule: false,
    ruleList:[],
    activityTitle: '活动规则',
    dateTabs: [{
                title: '正在秒杀',
                detail: '',
                selected: true
              },
              {
                title: "",
                detail: '',
                selected: false
              },
              {
                title: '',
                detail: '',
                selected: false
              }],
    timeObj : {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },
    activityText: '',
    goodsItem:[],
    showTimer: '' ,
    seckillEndTime: ''  ,
    mainColor: '#fff'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.q){
      let option = getQueryStringArgs(decodeURIComponent(options.q));
      if (option) {
        app.setUtmOptions(option);
        wx.setStorageSync(KEYSTORAGE.devFlag, option.devFlag)
        const share = {
          share_by: option.share_by,
          share_by_shop: option.share_by_shop || '0000',
        };
        app.setShareInfo(share);
      }
    } else {
      app.setUtmOptions(options)
    }

    if (options.share_by) {
      wx.setStorageSync('shareFromDaogouID', options.share_by);
      wx.setStorageSync('openShareTime', Date.now());
      let shareFromDaogouPageInfo = options;
      shareFromDaogouPageInfo.type = 'zhuanfa';
      app.setShareInfo(shareFromDaogouPageInfo, shareFromDaogouPageInfo);
    }
    this._getSeckillList();
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

  onClick: function(e){
    let {dateTabs, seckillEndTime, showTimer, activityText} = this.data;
    let index = e.currentTarget.dataset.id;
    let type =  e.currentTarget.dataset.type;
    let code = e.currentTarget.dataset.code;
    switch(type){
      case 'rule':
        this.setData({
          isShowRule: true,
        })
        break;
      case 'goBack':
        wx.switchTab({url: '/pages/index/index'})
        break;
      case 'goDetail':
        if(!this.comperaTime(seckillEndTime)){
          wxShowToast("该秒杀活动已结束！");
          return;
        }
        let  isSeckill = 0
        if(dateTabs[0].selected && !this.comperaTime(dateTabs[0].startTime)){
          isSeckill = 1
        }
        const queryObj = {
          colorCode: code,
          isSeckill: isSeckill,
          endTime: seckillEndTime,
        }
        console.log("queryObj =========== ",queryObj);
        wx.navigateTo({
          url: `/pages/content/content${objToQuery(queryObj)}`,
        });
        break;
        case 'tabCheck':
          if(dateTabs[index].selected){
            return;
          }
          for (let i = 0; i < dateTabs.length; i++) {
              if(i === index){
                dateTabs[i].selected = true;
              }else{
                dateTabs[i].selected = false;
              }
          }
          let goodsItem = [];
          for(let j = 0; j < dateTabs[index].goodsList.length; j++){
            skuToImgParam.sku = dateTabs[index].goodsList[j].goodsCode;
            //dateTabs[index].goodsList[j].goodsImg = `${cdn}${skuToImg(skuToImgParam)}`
            dateTabs[index].goodsList[j].goodsImg = cdn + dateTabs[index].goodsList[j].picUrl
            console.log("dateTabs[0].selected =========== ", dateTabs[0].selected);
            if(dateTabs[0].selected && !this.comperaTime(dateTabs[0].startTime)){
              dateTabs[index].goodsList[j].isNotice = false
            } else {
              dateTabs[index].goodsList[j].isNotice = true
            }
          }
          goodsItem = dateTabs[index].goodsList
          seckillEndTime =  dateTabs[index].endTime
          if(this.comperaTime(dateTabs[index].startTime)){
            showTimer = "距开始"
            activityText = dateTabs[index].beforeText
            clearInterval(timeId)
            this.activityCountDown(dateTabs[index].startTime)
          }else{
            showTimer = "距结束"
            activityText = dateTabs[index].startedText
            clearInterval(timeId)
            this.activityCountDown(dateTabs[index].endTime)
          }
          console.log("goodsItem=========== ", goodsItem)
          this.setData({
            dateTabs,
            goodsItem,
            seckillEndTime,
            showTimer,
            activityText
          })
          break;
      case 'notice':
        setTimeout(() => {
          wx.hideLoading();

          if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
            getApp().checkLogin()
          }
          else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
            console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
            if (!wx.getStorageSync('isMember')){
              getApp().isMemberETO()
            }
            else{
              getApp().getCRMInfoFn()
            }
          }
        }, 1000);

        if(!wx.getStorageSync('wxSubscriptions').isSeckill){
          wxSubscription("seckill").then(res => {
            wxShowToast("订阅成功！");
          }).catch(err => {

          });
        }else{
          wxShowToast("订阅成功！");
        }
        break;

    }

  },

   // 倒计时
   activityCountDown:function(objeckTime){
    let that = this;

    let year =  objeckTime.substring(0, 4) + '/' + objeckTime.substring(5, 7) + '/' + objeckTime.substring(8, 11);
    let time = objeckTime.substring(11)
    let timeObj = {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }
    timeId = setInterval(() => {
      let objeckTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
      timeObj = countDown(objeckTime);
      if(Number(timeObj.day) >=1){
        timeObj.hou = timeFormat(Number(timeObj.hou) +  Number(timeObj.day) * 24)
      }
      if(timeObj.hou === "00" && timeObj.min === "00" && timeObj.sec === "00"){
        that._getSeckillList()
      }
      that.setData({
        timeObj
      })
    }, 1000);
  },

  _getSeckillList(){
    let {actImage, dateTabs, showTimer, seckillEndTime, activityText, mainColor, ruleList} = this.data;
    let goodsItem = []
    getSeckillList().then(res=>{
      let listlength = 0;
      if(res.length > 3){
        listlength =  dateTabs.length
      } else {
        listlength =  res.length
      }
      actImage = res[0].bannerUrl
      mainColor = res[0].backcolor;
      const reg = /<p[^>]*>([\s\S]*)<\/p>/;
      const result = reg.exec(res[0].ruleDescription)[0];
      if(result){
        const resArr = result.split('</p>');
        if(resArr.length){
          resArr.forEach(item => {
            if(item && item.includes('<p>')){
              ruleList.push({
                text: item.replace(/<p\s*[^>]*>(.*?)/ig, '$1')
              })
            }
          })
        }
      }
      for (let i = 0; i < listlength; i++) {
        dateTabs[i].title = this.formatMonthDay(res[i].startTime);
        dateTabs[i].goodsList = res[i].goodsDTOList
        dateTabs[i].startTime =  res[i].startTime
        dateTabs[i].endTime =  res[i].endTime,
        dateTabs[i].beforeText = res[i].beforeText
        dateTabs[i].startedText = res[i].startedText
      }
      dateTabs[0].title = '正在秒杀'
      for(let j = 0; j < dateTabs[0].goodsList.length; j++){
        skuToImgParam.sku = dateTabs[0].goodsList[j].goodsCode;
       // dateTabs[0].goodsList[j].goodsImg = `${cdn}${skuToImg(skuToImgParam)}`
       dateTabs[0].goodsList[j].goodsImg = cdn + dateTabs[0].goodsList[j].picUrl;
       if(dateTabs[0].selected && !this.comperaTime(dateTabs[0].startTime)){
          dateTabs[0].goodsList[j].isNotice = false
        } else {
          dateTabs[0].goodsList[j].isNotice = true
        }
      }
      goodsItem = dateTabs[0].goodsList
      showTimer = '';
      if(this.comperaTime(dateTabs[0].startTime)){
        showTimer = "距开始"
        dateTabs[0].title = "即将开始"
        activityText = dateTabs[0].beforeText
        clearInterval(timeId)
        this.activityCountDown(dateTabs[0].startTime)
      }else{
        showTimer = "距结束"
        dateTabs[0].title = "正在秒杀"
        activityText = dateTabs[0].startedText
        clearInterval(timeId)
        this.activityCountDown(dateTabs[0].endTime)
      }
      seckillEndTime = dateTabs[0].endTime

      this.setData({
        actImage,
        mainColor,
        dateTabs,
        goodsItem,
        showTimer,
        seckillEndTime,
        activityText,
        ruleList
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  comperaTime(startTime){
    let startDate =  startTime.substring(0, 4) + '/' + startTime.substring(5, 7) + '/' + startTime.substring(8, 11);
    let startHour = startTime.substring(11)
    let startTimer = parseInt(new Date(`${startDate} ${startHour}`).getTime()) +  1000

    let currentTime = new Date().getTime();
    if(startTimer > currentTime ){
      return true;
    } else {
      return false;
    }
  },

  formatMonthDay(date){
    let month = date.substring(5, 7)
    let day = date.substring(8,10)
    if(month.substring(0, 1) === 0){
      month = month.substring(1,2)
    }
    if(day.substring(0, 1) === 0){
      day = day.substring(1,2)
    }
    return month+'月' + day + '日'
  },

  closeThisPop: function(){
    this.setData({
      isShowRule: false,
    })
  }
})
