import {splitGameImg, skuToImg, objToQuery} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
import {getPointImg, randomImgArr, timeAdapter, randomMode, goodsCodeAdapter, brandAdapter} from '../gameData'
import { endGame } from '../../service/sharpEyes'
import { KEYSTORAGE, URL_CDN } from '../../../src/const.js'
import { getGoodsDetail } from "../../../service/goods";
import {gameMode} from '../sharpEyesAdapter'
let interval = null , daojishiInterval = null, intervalImg = null;
let rotateTimer = null,  rotate2Timer = null, rotateOtherTimer = null, rotateAnimateTimer = null;
let point = 0;
const app = getApp();
const CDN = app.config.cdn;
let innerAudioContext = null;
let skuToImgParam = {
  size: URL_CDN.IMGSIZE240400
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand:'',
    gameBg: splitGameImg('game_bg_new.jpg','sharpEyes'),
    logoImg: splitGameImg('main_logo.png?v=1','sharpEyes') ,
    pointImg: splitGameImg('wen.png','sharpEyes'),
    backImg: splitGameImg('backImg.png','sharpEyes'),
    goodsCode: '',
    adapter: {},
    gameUserData: {},
    isOnClick: false, // 控制点击事件
    pointInfo: '',
    gameImages: [],
    countNum: 3,
    gameData:{},
    gameSuccess: false,
    gameOver: false,
    gameNoCount: false,
    gameSuccessImg: splitGameImg('success.png?v=1','sharpEyes'),
    gameOverImg: splitGameImg('over.png?v=1','sharpEyes'),
    gameNoCountImg: splitGameImg('invite.png','sharpEyes'),
    inviteBtn:  splitGameImg('btn_invite.png','sharpEyes'),
    gameCount: 0,
    giftLight: splitGameImg('gift_light.png','sharpEyes'), 
    goodsBg: splitGameImg('goods_bg.png','sharpEyes'), 
    gameIndex: 0,
    isRestart: true,
    isMusicStart: true,  
    musicImg: splitGameImg('music_start.png', 'sharpEyes'), 
    gameMode: '',
    isFirst: false,
    fistapage: splitGameImg('fist_page.jpg?v=1', 'sharpEyes'), 
    points: 0,
    brandName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {isFirst, musicImg, isMusicStart} = this.data;
    let gameData = wx.getStorageSync('gameUserData')
    if(gameData){
      if(gameData.isMusic){
        this.playMuisc();
        musicImg = splitGameImg('music_start.png', 'sharpEyes')
        isMusicStart = true
      } else {
        this.closeMuisc();
        musicImg = splitGameImg('music_close.png', 'sharpEyes')
        isMusicStart = false
      }
      if(gameData.isCloseFirst){
        isFirst = false
      } else {
        isFirst = true
      }
    } else {
      gameData = {
        isFirst: true,
        isMusic: true,
        userData: {}
      }
      this.playMuisc();
      musicImg = splitGameImg('music_start.png', 'sharpEyes')
      isMusicStart = true
    }
    if(!isFirst){
      this.startGame();
    }
    this.setData({
      brandName: brandAdapter(),
      goodsCode: goodsCodeAdapter(),
      isFirst,
      musicImg,
      gameData,
      isMusicStart
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

  startGame(){
    let {gameUserData, gameIndex} = this.data;
    this.clearTimers();
    let tapJsData = randomMode();
    console.log("tapData =========", tapJsData)
    this.setData({
      pointInfo:  tapJsData.optionImage,
      gameImages: tapJsData.optionList,
      gameMode: gameMode(tapJsData.tagindex).modeTyoe,
      points: gameMode(tapJsData.tagindex).point,
      adapter: timeAdapter(),
      pointImg: splitGameImg('wen.png','sharpEyes'),
      isOnClick: false,
      gameUserData,
    })
   
    this.loadAnimation();
    let that = this
    let rotateTimer = setTimeout(function () {
      // 随机四种反转模式
      gameIndex =  Math.floor(Math.random() * 4 + 0);
      switch(gameIndex){
        case 0:
          that.rotateFn_0();
          break;
        case 1:
          that.rotateFn_1();
          break;
        case 2:
          that.rotateFn_2();
          break;  
        case 3:
          that.rotateFn_3();
          break;  
      }
      that.setData({
        gameIndex
      })
      if(gameIndex === 2){
        let rotate2Timer = setTimeout(function () {
          that.countNumFun();
        }, that.data.adapter.countNum + that.data.adapter.countNum )
      } else {
        let rotateOtherTimer = setTimeout(function () {
          that.countNumFun();
        }, that.data.adapter.countNum)
      }
      // that.rotateFn_2();
      // let rotate2Timer = setTimeout(function () {
      //   that.countNumFun();
      // }, that.data.adapter.countNum + that.data.adapter.countNum )
    }, that.data.adapter.rotate)
   
  },

   //进入页面切换闪亮背景
   loadAnimation:function (){
    let that = this
    let index = 0;
    interval = setInterval(function () {
      let games = that.data.gameImages
      if(index < 9){
        if (index != 0) {
          games[index - 1].showImg = games[index-1].defaultImg
        }
        games[index].showImg = games[index].lightImg
        that.setData({
          gameImages: games,
        })
        index++;
      } else{
        games[8].showImg = games[0].defaultImg
        that.setData({
          gameImages: games
        })
        clearInterval(interval);
      }
    }, that.data.adapter.loading);
  },

  onClick: function(e){
    let {goodsCode, isRestart} = this.data
    let type = e.currentTarget.dataset.type;
    let gameData = wx.getStorageSync('gameUserData')
    switch(type){
      case 'restart': 
        if(!isRestart){
          return
        }
        this.setData({
          gameSuccess: false,
          gameOver: false,
          gameNoCount: false,
        })
        let gameCount = wx.getStorageSync('gameUserData').userData.gameCount
        if(gameCount > 0){
          this.startGame();
        } else {
          this.setData({
            gameNoCount: true,
          })
        }
      
        break;
      case 'tan_close':
        this.setData({
          gameSuccess: false,
          gameOver: false,
          gameNoCount: false,
        })
        wx.reLaunch({
          url: '../main/main'
        });
        break;  
      case 'goodsDetail':
        wx.navigateTo({
          url: '/pages/content/content?colorCode=' + goodsCode
        })
        break;  
      case 'music':
        let {isMusicStart, musicImg} = this.data;
        isMusicStart = !isMusicStart;
        musicImg = isMusicStart ? splitGameImg('music_start.png', 'sharpEyes'): splitGameImg('music_close.png', 'sharpEyes')
        if(isMusicStart){
          this.playMuisc();
        }else{
          this.closeMuisc();
        }
        gameData.isMusic = isMusicStart
        wx.setStorageSync('gameUserData', gameData)
        this.setData({
          isMusicStart, 
          musicImg
        })
        break;  
      case 'closeFist':
        let jsData = {
           isCloseFirst: true
        };
        Object.assign(gameData, jsData);
        wx.setStorageSync('gameUserData', gameData);
        this.setData({
          isFirst: false
        })
        this.startGame();
        break;     
    }
  },

  onClickCard: function(e){
    let that = this
    let {gameImages, pointInfo, isOnClick, points} = that.data;
    let gameUserData = wx.getStorageSync('gameUserData');
    if(!isOnClick){
      return;
    }
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if(id === pointInfo.id){
      point = points;
    } else{
      point = 0;
    }
    let jsonData = {
      points: point,
      userId: gameUserData.userData.id
    }
    this.clickSound()
    endGame(jsonData).then(res =>{
      if(id === pointInfo.id){
        this.setData({
          gameSuccess: true,
          isRestart: false
        })
      } else{
        this.setData({
          gameOver: true,
          isRestart: false
        })
      }
      if(res){
        this._getGoodsDetail(res.goodsTag);
        let puzzleUrl =  `puzzle_${res.name}.png`
        this.setData({
          puzzleImg: splitGameImg(puzzleUrl,'sharpEyes'),
          goodsCode: res.goodsTag
        })
        this._getGoodsDetail(res.goodsTag);
      } else {
        this.setData({
          goodsCode: goodsCodeAdapter()
        })
        this._getGoodsDetail(goodsCodeAdapter());
      }
     
      this.optionAnimation(index ,gameImages[index].currentOri)
      let that = this;
      let rotateAnimateTimer = setTimeout(function () {
        for (let index = 0; index < gameImages.length; index++) {
          if(gameImages[index].currentOri === 0){
            that.optionAnimation(index ,gameImages[index].currentOri)
          }
        }
        that.setData({
          isRestart: true
        })
      }, 1000)
      gameUserData.userData.gameCount--
      wx.setStorageSync('gameUserData', gameUserData)
    })
  },


  // 反转模式1 翻转一次
  rotateFn_0() {
    let that = this;
    let index = 0;
    intervalImg = setInterval(function () {
      let games = that.data.gameImages
      if(index < 9){
        if (index != 0) {
          for (let i = index - 3; i < index; i++) {
            that.optionAnimation(i, games[i].currentOri)
          }
        }
        for (let i = index; i < 3 + index; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        index+=3;
      } else {
        for (let i = index - 3; i < index; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        clearInterval(intervalImg)
      }
    }, that.data.adapter.rotatePeiod);
  	
  },

  // 反转模式2 翻转一次 （同时展示两行）
  rotateFn_1() {
    let that = this;
    let index = 0;
    let islast = false;
    intervalImg = setInterval(function () {
      let games = that.data.gameImages
      if(index < 9){
        if (index != 0 && index - 3 > 0) {
          for (let i = index - 6; i < index - 3; i++) {
            that.optionAnimation(i, games[i].currentOri)
          }
        }
        for (let i = index; i < 3 + index; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        index+=3;
      } else {
        if(islast){
          for (let i = index - 3;  i < index; i++) {
            that.optionAnimation(i, games[i].currentOri)
          }
          clearInterval(intervalImg)
        } else {
          for (let i = index - 6; i < index - 3; i++) {
            that.optionAnimation(i, games[i].currentOri)
          }
          islast = true
        }
      }
    }, that.data.adapter.rotatePeiod);
  	
  },

  // 反转模式3 翻转两次
  rotateFn_2() {
    let that = this;
    let index = 0;
    let isFirst = true;
    intervalImg = setInterval(function () {
      let games = that.data.gameImages
      if(index < 9){
        if (index != 0) {
          for (let i = index - 3; i < index; i++) {
            that.optionAnimation(i, games[i].currentOri)
          }
        }
        for (let i = index; i < 3 + index; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        index+=3;
      } else {
        for (let i = index - 3; i < index; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        if(isFirst){
          isFirst = false
          index = 0
        } else {
          clearInterval(intervalImg)
        }
      }
    }, that.data.adapter.rotatePeiod);
  	
  },

  // 反转模式3 全部反转
  rotateFn_3() {
    let that = this;
    let index = 0;
    let isFirst = true;
    intervalImg = setInterval(function () {
      let games = that.data.gameImages
      if(index < 9){
        for (let i = index; i < 9; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        index+=9;
      } else {
        for (let i = index - 9; i < 9; i++) {
          that.optionAnimation(i, games[i].currentOri)
        }
        if(isFirst){
          isFirst = false
          index = 0
        } else {
          clearInterval(intervalImg)
        }
      }
    }, that.data.adapter.rotatePeiod);
  	
  },

  // 卡片反转动画
  optionAnimation(index ,currentOri){
    let {gameImages} = this.data
    this.animation_main = wx.createAnimation({
      duration:400,
      timingFunction:'linear'
    })
    this.animation_back = wx.createAnimation({
      duration:400,
      timingFunction:'linear'
    })
    if (currentOri === 0) {
      this.animation_main.rotateY(180).step()
      this.animation_back.rotateY(0).step()
      gameImages[index].currentOri = 1
  	}
  	// 点击背面
  	else{
      this.animation_main.rotateY(0).step()
      this.animation_back.rotateY(-180).step()
      gameImages[index].currentOri = 0
  	}
    gameImages[index].animationMain = this.animation_main.export()
    gameImages[index].animationBack = this.animation_back.export()
    this.setData({
      gameImages
      
    })
  },

  // 倒计时展示目标图片
  countNumFun(){
    let {countNum, pointInfo, pointImg} = this.data;
    this.setData({
      pointImg: splitGameImg('3.png','sharpEyes')
    })
    daojishiInterval = setInterval(() => {
      if (countNum == 0){
        clearInterval(daojishiInterval)
        this.setData({
          pointImg: pointInfo.image,
          isOnClick: true
        })
      }else{
        countNum -= 1
        this.setData({ 
          pointImg:  countNum == 2 ? splitGameImg('2.png','sharpEyes') : splitGameImg('1.png','sharpEyes')
        })
      }
    }, 1000);
  },

  onHide: function(){
    this.clearTimers()
    this.closeMuisc();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearTimers()
    this.closeMuisc();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let utmData = wx.getStorageSync('daogouLists');
    let json = {
      userid : wx.getStorageSync('gameUserData').userData.id || ''
    }
    if(utmData && utmData.length){
      utmData.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          json[item.key] = item.value;
        }
      })
    }
    let title = app.config.brand === 'FOL'? '没想到我的记忆力超群，快来切磋一下！' :"你的记忆力如何，快来挑战吧！"
    let path = `/games/sharpEyes/help/help${objToQuery(json)}`
    let imageUrl = splitGameImg('share_image.png', 'sharpEyes');
    console.log("utmParam**********",path );
    return{
      title: title,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  },
  _getGoodsDetail(goodsCode){
    if(!goodsCode){
      goodsCode = goodsCodeAdapter()
    }
    getGoodsDetail(goodsCode, '').then(res=>{
      let goodsIndex = 0;
      for(let i = 0; i < res.color; i++){
        if(goodsCode === res.color[i].colorCode){
          goodsIndex = i
        }
      }
      let skuToImgParam = {
        size: URL_CDN.IMGSIZE108178,
        sku: res.color[goodsIndex].colorCode,
      };
      this.setData({
        goodsImage: `${CDN}${skuToImg(skuToImgParam)}`,
        goodsTitle: res.goodsName,
        goodsPrice: res.color[goodsIndex].price
      })
    })
  },

  clearTimers(){
    let {gameImages} = this.data;
    if(gameImages && gameImages.length > 0){
      for (let index = 0; index < gameImages.length; index++) {
        if(gameImages[index].currentOri === 1){
          this.optionAnimation(index ,gameImages[index].currentOri)
        }
      }
    }
    if(interval){
      clearInterval(interval)
    }
    if(daojishiInterval){
      clearInterval(daojishiInterval)
    }
    if(intervalImg){
      clearInterval(intervalImg)
    }
    if(rotateTimer){
      clearTimeOut(rotateTimer)
    }
    if(rotate2Timer){
      clearTimeOut(rotate2Timer)
    }
    if(rotateOtherTimer){
      clearTimeOut(rotateOtherTimer)
    }
    if(rotateAnimateTimer){
      clearTimeOut(rotateAnimateTimer)
    }
  },

  playMuisc(){
    let musicUrl = splitGameImg('game_bgm.mp3', 'sharpEyes')
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = musicUrl
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },  

  clickSound(){
    let musicUrl = splitGameImg('clickSound.mp3', 'sharpEyes')
    let cs = null
    cs = wx.createInnerAudioContext()
    cs.src = musicUrl
    cs.autoplay = true
    cs.loop = false
    cs.onPlay(() => {
      console.log('开始播放')
    })
    cs.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    setTimeout(function(){
      cs.destroy();
      cs = null;
    }, 2000)
  },  


  closeMuisc(){
    if(innerAudioContext){
        innerAudioContext.destroy();
        innerAudioContext = null;
    }
  }

})