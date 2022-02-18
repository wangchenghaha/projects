//Page Object

//Page Object

import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/yearBill/`
import {getYearBill,sendCouphon} from "../../service/yearBill"
import {getWxaCodeUnpubAddrQR} from "../../../service/guide";
import {mergeImg} from '../mergeImg'

import {
  dateIsOverDue,formatDate,chengfa
} from '../../../utils/utils'

var requestCount = 0
const splashImgList = [

  {
    scale: 5622,
    firstImg: `${imgPath}1_66.jpg`, // 375/667 iphone 7
    secondImg : `${imgPath}2_6.gif`,
    isIphone6 : true
  },
  {
    scale: 4618,
    firstImg: `${imgPath}1_xx.jpg`,  // 375/812 iphoneX
    secondImg : `${imgPath}2_x.gif`,
    isIphone6 : false
  }

]
var zitiDown = false  //字体下载是否成功
// 海报底图数据
var shareBgImgJson = {
  img : '',
  width : 0,
  height : 0
}
Page({
  data: {
    userData : {},
    datas : [],
    isIphone6 : false,
    currentIndex : 0,
    isNewUser : false,

    zuoImg : `${imgPath}zuo1.png`,
    youImg : `${imgPath}you1.png`,
    showBounced : false,
    bouncedImg : '',
    qrImg : '',
    backImg : `${imgPath}backImg.png`,
    
  },
  getSystemInfo: function () {

    try {
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth / windowHeight * 10000));

      let json = {
        first : '',
        second : '',
        isIphone6 : false
      }
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if (diff < 100) {
          json.first = item.firstImg
          json.second = item.secondImg
          json.isIphone6 = item.isIphone6
        }
      });
      if (json.first) {
        return json
      } else {
        json.first = splashImgList[1].firstImg
        json.second = splashImgList[1].secondImg
        json.isIphone6 = splashImgList[1].isIphone6

        return json
      }
    } catch (e) {
    }
  },
  downLoadZT(){

    let _this = this
    // 字体下载
      let path = `url(https://cdn.bestseller.com.cn/assets/wechat/JACKJONES/fonts/江西拙楷.ttf)`
      wx.loadFontFace({
        family: 'jxzk',
        source: path,
        success: e => {
          if (!zitiDown){
            zitiDown = true
            console.log(`下载成功`)
            if (_this.data.isNewUser){
              _this.makeDatas_newUser()
              _this.subTaps_newUser()
            }
            else{
              _this.makeDatas()
              _this.subTaps()
            }
          }

        }
      });
  },
  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    setTimeout(() => {
      this._requsetData()
    }, 5000);

  }
  else if (type === EVENTS.EVENT_GAMECRMINFO && event){
    this._requsetData()
  }
},
_requsetData(){
  // 买过的 15101181103
  let phone = wx.getStorageSync(KEYSTORAGE.wxPhone);

  console.log(`crm数据:${JSON.stringify(wx.getStorageSync(KEYSTORAGE.gameCRMInfo))}`)
  // phone = 15811377337  //习强
  // phone = 15101181103  //老张
  // phone = 13834582920  //？
  // phone = 13583650027  //？

  let userData = this.data.userData
  let isNewUser = this.data.isNewUser
  let _this = this
  getYearBill({phone : phone}).then(e => {
    userData = e
    isNewUser = false
    if (!e.totalPayPrice){
      // 没有消费过
      isNewUser = true
    }
    _this.setData({
      userData,
      isNewUser
    })
    console.log(`数据:${JSON.stringify(this.data.userData)}`)
    _this.downLoadZT()
  }).catch(e => {
    if (requestCount == 3){
      
      wx.showModal({
        title: '提示',
        content: '请求错误,请重新进入页面',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            _this.backTap()
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return
    }
    requestCount += 1
    _this._requsetData()
  })
},
  //options(Object)
  onLoad: function(options){
    requestCount = 0
    zitiDown = false
    
    // 没消费过顺序-> 1,12(用9的底图) 就俩图

    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_GAMECRMINFO);
  },
  makeDatas_newUser(){
    
    let timeStr = new Date('2018/6/15 00:00:00').getTime()
    let DateNum = dateIsOverDue(timeStr)

    let datas = this.data.datas
    datas = []

    // 第一页
    let str = '2020,对所有人来说,都是,不平凡的一年,大家的小目标,都实现了吗?'
    let arrs = str.split(',')

    let jsons = this.getSystemInfo()

    let json1 = {
      bgImg : jsons.first,
      topImg : '',
      titles1 : arrs,
      animateTitles1 : []
    }
    datas.push(json1)
    str = `嗨~时尚弄潮er,欢迎你加入绫致大家庭,阿绫成立折扣店官网的,${DateNum}天内,服务360W+用户,提供穿搭建议,希望未来的路上,能有你的相伴`
    arrs = str.split(',')
    let json2 = {
      bgImg : '#8B74B0',
      topImg : `${imgPath}12_x.png`,
      titles2 : arrs,
      animateTitles2 : []
    }
    datas.push(json2)

    this.setData({
      datas,
      isIphone6 : jsons.isIphone6
    })

  },
  subTaps_newUser(){

    let datas = this.data.datas
    datas[0].animateTitles1 = []
    datas[1].animateTitles2 = []
    datas[1].animate = ''

    if (this.data.currentIndex == 0){

      datas[0].titles1.forEach((item,index) => {
        let arrs = item.split('')
        let arrss = []
        arrs.forEach((items,indexx) => {
          let json = {
            text : items,
            num : index == 0 ? 0.2 * indexx : index == 1 ? 0.2 * indexx + 0.8 : index == 2 ? 0.2 * indexx + 2 : index == 3 ? 0.2 * indexx + 2.4 : index == 4 ? 0.2 * indexx + 3.6 : 0.2 * indexx + 4.8
          }
          arrss.push(json)
        })

        datas[0].animateTitles1.push(arrss)
      });
      // console.log(`aaa:${JSON.stringify(datas[0].animateTitles)}`)

    }
    else if (this.data.currentIndex == 1){
      datas[this.data.currentIndex].titles2.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8
        }

        datas[this.data.currentIndex].animateTitles2.push(json)
      });
      datas[this.data.currentIndex].animate = datas[this.data.currentIndex].animate == 'titleAnimate' ? 'titleAnimate1' : 'titleAnimate'
    }
    this.setData({
      datas
    })
  },
  // 每个页面数据
  makeDatas(){
    let gameCRMInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo);
    const {userData} = this.data

    let datas = this.data.datas
    datas = []

    // 第一页
    let str = '2020,对所有人来说,都是,不平凡的一年,大家的小目标,都实现了吗?'
    let arrs = str.split(',')

    let jsons = this.getSystemInfo()

    let json1 = {
      bgImg : jsons.first,
      topImg : '',
      titles1 : arrs,
      animateTitles1 : []
    }
    datas.push(json1)
    // 第二页
    let year = gameCRMInfo.joindate.split(' ')[0].split('-')[0]
    let month = gameCRMInfo.joindate.split(' ')[0].split('-')[1]
    let day = gameCRMInfo.joindate.split(' ')[0].split('-')[2]
    str = `${year}年,${month}月${day}日,在这个,平凡又特殊的日子,阿绫有幸,认识了你`
    arrs = str.split(',')

    let json2 = {
      bgImg : jsons.second,
      topImg : '',
      titles2 : arrs,
      animateTitles2 : []
    }
    datas.push(json2)
    // 第三页
    let totalMoney = userData.totalPayPrice > 100000 ? `${userData.totalPayPrice/10000}万` : userData.totalPayPrice
    totalMoney = totalMoney.toFixed(2)

    str = `今年你共消费${totalMoney}元,超过了${chengfa(userData.percent,100)}%绫粉儿,是你吗,剁手达人?`
    arrs = str.split(',')
    let json3 = {
      bgImg : '#485478',
      topImg : `${imgPath}3_x.gif`,
      titles3 : arrs,
      animateTitles3 : []
    }
    datas.push(json3)
    // 第四页
    str = `2020年你共购买了${userData.totalGoodsCount}件商品,平均每个月${userData.avgMonthGoodsCount}件,今年的你偏爱购买,${userData.favoriteClassify},${userData.favoriteClassifyDesc}，带你打造自己的风格`
    arrs = str.split(',')
    let json4 = {
      bgImg : '#FAAD87',
      topImg : `${imgPath}4_x.gif`,
      titles4 : arrs,
      animateTitles4 : []
    }
    datas.push(json4)
    // 第五页(6月31号之前~之后)
    let isBefore = true
    year = userData.firstGoodsDate.split(' ')[0].split('-')[0]
    month = userData.firstGoodsDate.split(' ')[0].split('-')[1]
    day = userData.firstGoodsDate.split(' ')[0].split('-')[2]
    if (parseInt(month) >= 7){
      isBefore = false
    }
    
    str = `${month}月${day}日,你带走了今年的第一件衣服,${userData.firstGoodsName},响应阿中哥号召,宅家抗疫，也要宅的精致`
    if (!isBefore){
      str = `${month}月${day}日,你带走了今年的第一件衣服,${userData.firstGoodsName},抗疫初步胜利,各省逐步解锁,作为功臣之一的你,怎能不买买买庆祝一下呢?`
    }
    arrs = str.split(',')
    let json5 = {
      bgImg : `${isBefore ? '#C7C4E6' : '#FF9180'}`,
      topImg : isBefore ? `${imgPath}5_x.gif` : `${imgPath}5_x1.gif`,
      textColor : isBefore ? '#665774' : '#463532',
      titles5 : arrs,
      width : isBefore ? 100 : 93,
      animateTitles5 : [],
      firstImg : '',
      animate : 'titleAnimate'
    }
    datas.push(json5)
    // 第六页
    str = '今年阿绫热卖品类,Top3分别是,T恤.裙子和休闲裤,其中VEROMODA的裙子与,ONLY的短袖深受喜爱'
    arrs = str.split(',')
    let json6 = {
      bgImg : '#7967A7',
      topImg : `${imgPath}6_x.png`,
      titles6 : arrs,
      animateTitles6 : []
    }
    datas.push(json6)
    // 第七页
    str = `作为你省钱节约的,shopping主战场,2020年,阿绫共为你节省${userData.totalSavePrice}元,同样的品质,更低的价格,面对这样,勤俭持家的阿绫,你爱了吗?`
    if (jsons.isIphone6){
      str = `作为你省钱节约的shopping主战场,2020年阿绫共为你节省${userData.totalSavePrice}元,同样的品质更低的价格,面对这样勤俭持家的阿绫,你爱了吗?`
    }
    arrs = str.split(',')
    let json7 = {
      bgImg : '#EF9F8A',
      topImg : `${imgPath}7_x.gif`,
      titles7 : arrs,
      animateTitles7 : []
    }
    datas.push(json7)
    // 第八页
    let status = 1
    if (userData.discountAmount < 500){
      status = 1
    }
    if (userData.discountAmount > 500 && userData.discountAmount < 1000){
      status = 2
    }
    else if (userData.discountAmount > 1000){
      status = 3
    }
    let statusStr = status == 1 ? `一条羊腿` : status == 2 ? '半只羊' : '整只羊'
    str = `精打细算如你,共领取了${userData.receiveNum}张优惠券,共使用了${userData.useNum}张优惠券,成功薅到${userData.discountAmount}元羊毛`
    if (userData.discountAmount > 0){
      str = `${str},大约薅了${statusStr}`
    }
    
    
    arrs = str.split(',')
    let json8 = {
      bgImg : '#CF837A',
      topImg : status == 1 ? `${imgPath}8.1_x.gif` : status == 2 ? `${imgPath}8.2_x.gif` : `${imgPath}8.3_x.gif`,
      titles8 : arrs,
      animateTitles8 : []
    }
    datas.push(json8)
    // 第九页
    let currentTime = formatDate(new Date().getTime(),true)

    
    day = dateIsOverDue(new Date(gameCRMInfo.joindate.replace(/-/g,'/')).getTime())
    console.log(`注册日期:${gameCRMInfo.joindate}`)

    year = `${currentTime.split(' ')[0].split('-')[0]}年${currentTime.split(' ')[0].split('-')[1]}月${currentTime.split(' ')[0].split('-')[2]}日`
    str = `截止${year},你已陪伴阿绫走过,${day}天,感恩有你,${userData.couponDescA},已发至账户`
    
    arrs = str.split(',')
    let json9 = {
      bgImg : '#D59CB4',
      topImg : `${imgPath}9_x.gif`,
      titles9 : arrs,
      animateTitles9 : []
    }
    datas.push(json9)
    // 第十页
    let titles = ['成长','初心','阶段胜利','能干','月半','值得']
    let titles1 = [`不平凡的一年,催着我们成长,是为了迎接更棒的自己,转发好友可额外获得${this.data.userData.couponDescB},让你和小伙伴在2021继续省省省!`,
    `不忘初心 方得始终,2020年有失亦有得,愿你在2021年继续前行,转发好友可额外获得${this.data.userData.couponDescB},让你和小伙伴在2021继续省省省!`,
    `精打细算，勤俭持家,2020年辛苦了,2021继续加油!,转发好友可额外获得${this.data.userData.couponDescB},让你和小伙伴在2021继续省省省!`,
    `精打细算，勤俭持家,2020年辛苦了,2021继续加油!,转发好友可额外获得${this.data.userData.couponDescB},让你和小伙伴在2021继续省省省!`,
    `作为一个"干饭人",身材是绕不开的永恒话题,转发好友可额外获得${this.data.userData.couponDescB},让你和小伙伴在2021继续省省省!`,
    `无论当下怎样,你值得那些所有的美好,转发好友可额外获得${this.data.userData.couponDescB},让你和小伙伴在2021继续省省省!`
    ]
    let bgImgColor = ['#BF957E','#222D4A','#6C7486','#CF837A','#7397C7','#33395C']
    let topImgs = [`${imgPath}10.1.png`,`${imgPath}10.2.png`,`${imgPath}10.3.png`,`${imgPath}10.4.png`,`${imgPath}10.5.png`,`${imgPath}10.6.png`]
    let btnTitleColors = ['#875230','#222D4A','#222D4A','#C36C62','#547FB6','#33395C']
    
    
    let random = Math.floor(Math.random() * titles.length + 0)

    let json10 = {
      bgImg : bgImgColor[random],
      topImg : topImgs[random],
      title : titles[random],
      subTitles : titles1[random].split(','),
      btnTitleColor : btnTitleColors[random],
      btnImg : `${imgPath}btn.png`
    }
    datas.push(json10)
    

    let bouncedImgs = [`${imgPath}10.1.1.png`,`${imgPath}10.2.2.png`,`${imgPath}10.3.3.png`,`${imgPath}10.4.4.png`,`${imgPath}10.5.5.png`,`${imgPath}10.6.6.png`]

    shareBgImgJson.img = bouncedImgs[random]
    this.setData({
      bouncedImg : bouncedImgs[random],
      datas,
      isIphone6 : jsons.isIphone6
    })
  },
  // 处理每个页面的加载效果
  subTaps(){
    let datas = this.data.datas
    datas[0].animateTitles1 = []
    datas[1].animateTitles2 = []
    datas[2].animateTitles3 = []
    datas[3].animateTitles4 = []
    datas[4].animateTitles5 = []
    datas[5].animateTitles6 = []
    datas[6].animateTitles7 = []
    datas[7].animateTitles8 = []
    datas[8].animateTitles9 = []
    datas[4].firstImg = ''

    if (this.data.currentIndex == 0){

      datas[0].titles1.forEach((item,index) => {
        let arrs = item.split('')
        let arrss = []
        arrs.forEach((items,indexx) => {
          let json = {
            text : items,
            num : index == 0 ? 0.2 * indexx : index == 1 ? 0.2 * indexx + 0.8 : index == 2 ? 0.2 * indexx + 2 : index == 3 ? 0.2 * indexx + 2.4 : index == 4 ? 0.2 * indexx + 3.6 : 0.2 * indexx + 4.8
          }
          arrss.push(json)
        })

        datas[0].animateTitles1.push(arrss)
      });
      // console.log(`aaa:${JSON.stringify(datas[0].animateTitles)}`)

    }
    else if (this.data.currentIndex == 1){
      datas[this.data.currentIndex].titles2.forEach((item,index) => {
        let arrs = item.split('')
        let arrss = []
        arrs.forEach((items,indexx) => {
          let json = {
            text : items,
            num : index == 0 ? 0.2 * indexx : index == 1 ? 0.2 * indexx + 1 : index == 2 ? 0.2 * indexx + 2.2 : index == 3 ? 0.2 * indexx + 2.8 : index == 4 ? 0.2 * indexx + 4.4 : 0.2 * indexx + 5.2
          }
          arrss.push(json)
        })

        datas[this.data.currentIndex].animateTitles2.push(arrss)
      });
    }
    else if (this.data.currentIndex == 2){
      datas[this.data.currentIndex].titles3.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8,
          top : index == 0 ? 0 : index == 2 ? 80 : 20
        }

        datas[this.data.currentIndex].animateTitles3.push(json)
      });
    }
    else if (this.data.currentIndex == 3){
      datas[this.data.currentIndex].titles4.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8,
          top : index == 0 ? 0 : (index == 2 || index == 4) ? 80 : 20
        }

        datas[this.data.currentIndex].animateTitles4.push(json)
      });
    }
    else if (this.data.currentIndex == 4){
      datas[this.data.currentIndex].titles5.forEach((item,index) => {

        let json = {
          text : item,
          num : index >= 3 ? index * 0.8 + 0.8 : index * 0.8,
          top : index == 0 ? 0 : index == 3? 520 : 20
        }
        // aaaaa
        datas[this.data.currentIndex].firstImg = this.data.userData.firstGoodsUrl,
        datas[this.data.currentIndex].animate = datas[this.data.currentIndex].animate == 'titleAnimate' ? 'titleAnimate1' : 'titleAnimate'
        datas[this.data.currentIndex].animateTitles5.push(json)
      });
    }
    else if (this.data.currentIndex == 5){
      datas[this.data.currentIndex].titles6.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8,
          top : index == 0 ? 0 : 20
        }

        datas[this.data.currentIndex].animateTitles6.push(json)
      });
    }
    else if (this.data.currentIndex == 6){
      datas[this.data.currentIndex].titles7.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8,
          top : index == 0 ? 0 : 10
        }

        datas[this.data.currentIndex].animateTitles7.push(json)
      });
    }
    else if (this.data.currentIndex == 7){
      datas[this.data.currentIndex].titles8.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8,
          top : index == 0 ? 0 : 20
        }

        datas[this.data.currentIndex].animateTitles8.push(json)
      });
    }
    else if (this.data.currentIndex == 8){
      datas[this.data.currentIndex].titles9.forEach((item,index) => {

        let json = {
          text : item,
          num : index * 0.8,
          top : index == 0 ? 0 : index == 3 ? 80 : 20
        }

        datas[this.data.currentIndex].animateTitles9.push(json)
      });
    }
    this.setData({datas})
    // console.log(`aaa:${JSON.stringify(datas)}`)
  },
  taps(e){
    let currentIndex = this.data.currentIndex
    let type = e.currentTarget.dataset.type
    if (type == 'left'){
      if (currentIndex == 0){
        return
      }
      currentIndex -= 1

    }
    else{
      if (currentIndex == this.data.datas.length - 1){
        return
      }
      currentIndex += 1

    }
    this.setData({
      currentIndex
    })

  },
  change(e){

    console.log(`change`)
    this.setData({
      currentIndex : e.detail.current
    })
    if (this.data.isNewUser){
      this.subTaps_newUser()
    }
    else{
      this.subTaps()
    }
    
  },
  haibao(){
    console.log(`生成海报`)

    if (!this.data.qrImg){
      this.createQrCode().then(e => {
        this.setData({
          showBounced : true
        })
      })
    }
    else{

      this.setData({
        showBounced : true
      })
    }
  },
  closed(){
    this.setData({
      showBounced : false
    })

  },
  // 返回
  backTap(){
    console.log(`返回`)

    var pageList = getCurrentPages();
    if (pageList.length > 1){
      wx.navigateBack({
        delta: 1
      });
    }
    else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    
    
      
  },
  shareImgLoad(e){
    // console.log(`aaa:${JSON.stringify(e)}`)
    shareBgImgJson.width = e.detail.width
    shareBgImgJson.height = e.detail.height
  },
  goMyCoupons(){
    getApp().navigateTo('member/myCoupons/myCoupons')
  },
  // 生成二维码
  createQrCode(){

    let _this = this
    wx.showLoading({
      title: '生成中……',
      mask: true
    });
    return new Promise((resolve, reject) => {
      let phone = wx.getStorageSync(KEYSTORAGE.wxPhone);
      let scene = `${phone},`
      const param = {
        scene,
        page: 'activity/yearBill/index/index',
        is_hyaline: false,
        width : 120,
        height : 120
      };
      // console.log(`aaaaaa:${JSON.stringify(param)}`)
      // aaaaaa:{"scene":"2_2_1260447545985773569","page":"livePlayer/playerDetail/playerDetail","is_hyaline":false,"width":120,"height":120}
  
      getWxaCodeUnpubAddrQR(param).then(res=>{
        wx.hideLoading();
        const guideQR = res;
        console.log(`二维码图片:${guideQR}`) //宽高 280px
        wx.getImageInfo({
          src: guideQR,
          success (res) {

            wx.getImageInfo({
              src: res.path,
              success (ress) {
                _this.setData({
                  qrImg : ress.path
                })
                resolve()
              }
            })
            
          }
        })
  
      }).catch(err=> {
        wx.hideLoading();
        console.log(err)
        reject(err)
      });

    })

  },
  saveImg(){
    this.closed()
    const createImg = new mergeImg({
      bgImgJson : shareBgImgJson,
      qrImg : this.data.qrImg,
      callBack : () => {
        this._sendCouphon()
      }
    })
  },
  onReady: function(){
    
  },
  onShow: function(){
    if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
      this._requsetData();
    }
    else{
      getApp().navigateTo('member/login/login?game=true')
    }
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){
    this._sendCouphon()

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let phone = wx.getStorageSync(KEYSTORAGE.wxPhone);
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      phone : phone,
      nickName: wxInfo.nickName || '',

      share_by: sharePams.employeeId || '',
      share_by_shop: sharePams.shopCode || '',

      utm_source: 'game',
      utm_medium: 'game_yearBill',
      utm_term: '',
      utm_campaign: ''
    }
    let title = '查看年度账单还可领10元券，你也一起来吧！'

    let path = `/activity/yearBill/help/help?params=${JSON.stringify(json)}`
    let imageUrl = `${imgPath}share.jpeg`
    console.log(`分享成功:${path}`)
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (e) {

      },
      fail: function (e) {
        console.log(`分享失败`)
      }
    }

  },
  _sendCouphon(){
    let phone = wx.getStorageSync(KEYSTORAGE.wxPhone);
    sendCouphon({
      phone : phone
    }).then(e => {

    })
  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});