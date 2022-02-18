/*
 * @Author: your name
 * @Date: 2020-05-22 10:24:22
 * @LastEditTime: 2020-07-16 10:48:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FOL/activity/redRain/index/index.js
 */ 
//Page Object
const brand = getApp().config.brand


var userData = {}
const downNum = 30  //游戏时长
const daojishi = 3  //倒计时时间
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/redRains/`


// 当前金币数
var currentJF = 0

// 游戏结束时候穿的gameid
var gameid = 0
import {startGame,endGame} from "../../../service/redRain"
import {KEYSTORAGE} from '../../../src/const'

// 动画音效
const startVideo = `${imgPath}hbyyinxiao.wav`
const tapStartVideo = `${imgPath}hbydjyx.mp3`
Page({
    data: {
        brand,
        imgPath,
        datas : [],
        // 雨点
        yudianDatas : [],
        jifenNum : 0,
        bouncedAnimate : 'textAnimate',
        bouncedText : daojishi,   //倒计时
        bouncedImg : `${imgPath}hby_djs3.png`,    //倒计时图片
        animationPlayState : 'running', //paused
        // 游戏倒计时
        gameDownNum : downNum,
        gameDownNumSlider : 100,
        // 点击后弹出金币动画位置
        jinbiOffset : {
            top : -500,
            left : -500,
            animate : '',
            textAnimate : ''
        },
        // 控制游戏结束弹框
        endGame : false,
        // 可以玩几次
        canPlayNum : 0,
        // 先展示爆炸效果
        canBaozha : false,
        showTwoBounced : false,
        // 离大奖大概需要几把
        jifenNumArrs : [],
        aboutNum : 0
    },
    makeYudian(index){
        // 宽度 45~80随机
        let width = 4
        let height = 187
        if (brand == 'FOL'){
            let offset = Math.random() * 0.2 + 0.8
            width = 26 * offset
            height = 150 * offset
        }
        // 位置 5~右边距 - 5
        let left = Math.floor((Math.random() * (wx.getSystemInfoSync().windowWidth * 750 / wx.getSystemInfoSync().windowWidth - width - 5)) + 5)
        // 速度1~4
        let speed = 3
        // z-index
        let z_index = index + 1

        let json = {
            width,
            height,

            left,
            speed,
            z_index,

            animation : 'animate'
        }
        let yudianDatas = this.data.yudianDatas
        
        yudianDatas.push(json)
        this.setData({yudianDatas})
        if (index < 10){
            setTimeout(() => {
                this.makeYudian(index + 1)
            }, 250);
        }
    },
    makeDatas(index,id){
        // 宽度* 随机0.8~1倍
        let offset = Math.random() * 0.2 + 0.8
        let width = 162 * offset

        // 角度 -10~10随机
        let angle = Math.floor(Math.random() * 20 + -10)
        // 位置 5~右边距 - 5
        let left = Math.floor(Math.random() * (wx.getSystemInfoSync().windowWidth * 750 / wx.getSystemInfoSync().windowWidth - width - 5) + 5)
        // 速度2~6
        let speed = Math.random() * 3 + 4

        // 积分 1~5
        let jifen = Math.floor(Math.random() * 6 + 3)
        // z-index
        let z_index = index + 1
        // 红包图片
        let hongbaoImg = Math.floor(Math.random() * 6 + 1)

        let json = {
            width,

            angle,
            left,
            speed,
            z_index,
            jifen,
            hongbaoImg,
            animation : 'animate'
        }
        let datas = this.data.datas

        if (id == 999){
            json.animation = datas[index].animation == 'animate' ? 'animate1' : 'animate'
            datas.splice(index,1,json)
            this.setData({datas})
        }
        else{

            datas.push(json)
            this.setData({datas})
            if (index < 10){
                setTimeout(() => {
                    this.makeDatas(index + 1)
                }, 250);
            }
        }
    },
    // 开始前倒计时
    _startDownNum(){

        let bouncedText = this.data.bouncedText
        let bouncedAnimate = this.data.bouncedAnimate
        let bouncedImg = this.data.bouncedImg
        let canPlayNum = this.data.canPlayNum

        this.interval1 = setInterval(() => {
            if (bouncedText == 0){
                canPlayNum -= 1
                bouncedImg = `${imgPath}hby_djs3.png`
                this._gameDownNum()
                this.makeDatas(0)
                this.makeYudian(0)
                clearInterval(this.interval1)

            }
            else{
                bouncedText -= 1
                bouncedImg = bouncedText == 2 ? `${imgPath}hby_djs2.png` : `${imgPath}hby_djs1.png`
                bouncedAnimate = bouncedAnimate == 'textAnimate' ? 'textAnimate1' : "textAnimate"
                this.setData({
                    bouncedText,
                    bouncedAnimate
                })
            }
            this.setData({bouncedImg,canPlayNum})

        }, 1000);

    },
    // 游戏倒计时
    _gameDownNum(){
        let gameDownNum = this.data.gameDownNum
        let gameDownNumSlider = this.data.gameDownNumSlider

        this.interval = setInterval(() => {
            if (gameDownNum == 0){
                clearInterval(this.interval)
                this.setData({animationPlayState : 'paused'})
                this.upDatas()
            }
            else{
                gameDownNum -= 1
            }
            gameDownNumSlider = gameDownNum / downNum * 100
            this.setData({gameDownNum,gameDownNumSlider})
        }, 1000);
    },
    // 开始游戏
    _startGame(){
       
        startGame({userid : userData.id}).then(res => {
            gameid = res.id
            this._startDownNum()
        })
         
    },
    //options(Object)
    onLoad: function(options){
        currentJF = options.jifen ? parseInt(options.jifen) : 0
        this.startVedio(startVideo)

        gameid = 0
        userData = wx.getStorageSync('hby_userInfo');
        this.setData({canPlayNum : userData.gameCount})
        this._startGame()
    },
    // 点击红包处理
    tapss(e){	        
        if (this.data.animationPlayState == 'running'){ 
            let id = e.detail.id 
            let jifen = e.detail.jifen 
            let pageX = e.detail.pageX 
            let pageY = e.detail.pageY 
    
            this.makeDatas(id,999) 
    

            let jinbiOffset = this.data.jinbiOffset 
            jinbiOffset.left = pageX - 20 
            jinbiOffset.top = pageY - 20 

            // 爆炸效果 
            this.setData({canBaozha : true,jinbiOffset}) 

            setTimeout(() => { 
                let jifenNum = this.data.jifenNum 
                jifenNum += jifen 
                
                jinbiOffset.animate = jinbiOffset.animate == 'jibiAnimation' ? 'jibiAnimation1' : "jibiAnimation" 
                jinbiOffset.textAnimate = jinbiOffset.textAnimate == 'jinbiTextAnimation' ? 'jinbiTextAnimation1' : "jinbiTextAnimation" 

                this.setData({canBaozha : false,jinbiOffset,jifenNum}) 
                
            }, 300); 
            
    
            this.tapStartVedio(tapStartVideo) 
    
        }

    },
    // 返回
    backTap(){
        clearInterval(this.interval)
        clearInterval(this.interval1)
        
        wx.navigateBack({
            delta: 1
        });
    },
    // 上传数据
    upDatas(){
        endGame({getPoints : this.data.jifenNum,userid : userData.id,gameid:gameid}).then(res => {
            currentJF += parseInt(this.data.jifenNum)

            let jifenNumArrs = this.data.jifenNumArrs
            jifenNumArrs.push(parseInt(this.data.jifenNum))

            let samNum = 0
            jifenNumArrs.forEach(item => {
                samNum += item
            });
            samNum = samNum / jifenNumArrs.length

            let aboutNum = this.data.aboutNum
            aboutNum = Math.floor((21999 - currentJF) / samNum)
            if (aboutNum <= 0){
                aboutNum = 0
            }


            this.setData({endGame : true,aboutNum,jifenNumArrs})
            
        })
        
    },
    // 游戏结束弹框事件
    bottomTap(){
        let jinbiOffset = this.data.jinbiOffset
        jinbiOffset = {
            top : -500,
            left : -500,
            animate : '',
            textAnimate : ''
        }
        // 在来一次
        this.setData({
            bouncedText : daojishi,
            endGame : false,
            gameDownNum : downNum,
            gameDownNumSlider : 100,
            animationPlayState : 'running',
            datas : [],
            yudianDatas : [],
            jinbiOffset,
            jifenNum : 0
        })
        this._startDownNum()
    },
    // 关闭结束弹框

    oneClosed (){

        this.setData({
            endGame : false,
            showTwoBounced : true,
        })
        
    },
    twoClosed (){
        this.closed()
    },
    closed(){
        
        this.setData({
            endGame : false,
            showTwoBounced : false
        })
        wx.navigateBack({
            delta: 1
        });
        
    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },
    onUnload: function(){
        if (this.innerAudioContext){
            this.innerAudioContext.destroy()
        }
        if (this.innerAudioContext1){
            this.innerAudioContext1.destroy()
        }
    },
    onPullDownRefresh: function(){

    },
    onReachBottom: function(){

    },
    onPageScroll: function(){

    },
    // 开始音频
    tapStartVedio(path){
        this.innerAudioContext1 = wx.createInnerAudioContext();
        this.innerAudioContext1.src = path
        this.innerAudioContext1.loop = false
        this.innerAudioContext1.autoplay = true
    },
    startVedio : function(path){
      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.src = path
      this.innerAudioContext.loop = true
      this.innerAudioContext.autoplay = true
    },
    onShareAppMessage: function(){

        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        var openID = wx.getStorageSync('wxOpenID');
        let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
          let title = '千山万水总是情，帮我助力行不行'
          let json = {
            userid : userData.id || '',
            picUrl : wxInfo.avatarUrl,
            openid : openID,

            share_by : sharePams.employeeId || '',
            share_by_shop : sharePams.shopCode || '',
            
            utm_source : 'game',
            utm_medium : 'game_redRain',
            utm_term : '',
            utm_campaign : ''
          }
          let path = `/activity/redRain/help/help?params=${JSON.stringify(json)}`
          let imageUrl = `${imgPath}hby_shareImage.png`
          console.log(`分享成功:${path}`)
          return{
            title: title,
            path : path,
            imageUrl : imageUrl,
            success:function(e){
              console.log(`分享成功:${path}`)
            },
            fail:function(e){
              console.log(`分享失败`)
            }
          }
    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    }
});