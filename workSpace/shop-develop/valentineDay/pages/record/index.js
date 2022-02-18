import mainService from '../../../base/main.js';
import pathModel from '../../models/path.model';
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import Urls from '../../services/url'
import dataModel from '../../models/dataInfo.model';

const recorderManager = wx.getRecorderManager()
const audioContext = wx.createInnerAudioContext()
Page({
  data: {
    data:{},//所有数据
    openRecordingdis: "block",//录音图片的不同
    shutRecordingdis: "none",//录音图片的不同
    recordingTimeqwe:0,//录音计时
    setInter:"",//录音名称
    recordStatus: 1, // 1 == 未开始   2 == 正在录音   3 == 录音结束
    tempFilePath: '',
    playStatus: false,
    listenTime:5,
    maskIsShow:false,//带模态框德弹框是否展示
    maskIsShow2:false,//带模态框德弹框是否展示
    pwdValue:'',//输入的密码
    canvasImage: '',//海报是否出现
    indexShow:true,//首页
    recordShow:false,//选心意卡页
    startRecord:false,//准备开始录音页面
    setPwdShow:false,//设置密码页
    shareReady:false,//发送分享页
    heartSelect:'',//选择心意卡
    navHeight: wx.getSystemInfoSync().windowHeight * 2 + 'rpx'

  },

  onShareAppMessage(e) {
    console.info('分享按钮23',e)
    if(e.from == 'button'){
      return {
        title: this.data.data.valentine.share_title,
        path: this.data.shareUrl,
        imageUrl: this.data.data.valentine.card_img, 
      }

    }else{
      return {
        title: this.data.data.valentine.share_title,
        path:`${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`,
        imageUrl: this.data.data.valentine.card_img, 
      }
    }
   
  },
  shareApi(soundId){
    Fetch({
      url: Urls.love_share,
      loading:true,
      data: {
        ac_id:wx.getStorageSync('ac_id'),
        user_id:this.data.data.user_id,
        type:'2',
        sound_id:soundId,
      }
    }).then(res => {
      let { errcode, data } = res
      if(errcode == 0){
        console.info('分享按钮',data)
        this.setData({
          shareUrl:data.share_url
        })
      }
    })
  },
  isMember(){
    Fetch({
      url: Urls.love_ismember,
      loading:true,
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        ch_id: wx.getStorageSync('ch_id'),
        user_id:this.data.data.user_id
      }
    }).then(res => {
      let { errcode, data } = res
      if(errcode == 0){
        console.info('res$$$$$$$$$$$$',res)
        if(data.is_member){//如果是会员
          this.setData({
             recordShow:true,
             indexShow:false
          })
        }else{//不是会员
          console.info('data.cardList',data.cardList)
          if(data.is_get_card){//但是领过卡
            // this._openCard(data.cardList)

          }else{//没领过卡
            // Utils.memberRegistration(data.activatemembercard_url)

          }
        }
      }
    })
  },
  isShow(e){
    console.info('子组件传来的',e)
    // if(e.detail.recordShow){
    //   this.isMember();
    //   return
    // }
    if(e.detail.soundId){
      this.shareApi(e.detail.soundId)
    }
    this.setData({
      indexShow: e.detail.indexShow,
      startRecord: e.detail.startRecord,
      setPwdShow: e.detail.setPwdShow,
      shareReady:e.detail.shareReady,
      recordShow:e.detail.recordShow,
      heartSelect:e.detail.heartSelect,
      heartId:e.detail.heartId,
      soundUrl:e.detail.soundUrl,
      name:e.detail.name,
      blessingText:e.detail.blessingText,
      soundId:e.detail.soundId
    })
    
  },
  onLoad(options) {
    console.info('record_options',options)
    if(dataModel.data){
      let data = dataModel.data
      this.setData({
        data
      })
    }
  
  },
  

   //录音计时器
  recordingTimer:function(){
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function () {
        var time = that.data.recordingTimeqwe + 1;
        that.setData({
          recordingTimeqwe: time
        })
      }
      , 1000);
  },


  //开始录音
  openRecording: function() {
    var that = this;
    wx.getSetting({
			success(res) {
        console.log(res,'getSetting')
        // return
				if (!res.authSetting['scope.record']) {
					wx.authorize({
						scope: 'scope.record',
						success(res) {
              console.log('授权录音成功')
              // that.setData({
              //   shutRecordingdis: "block",
              //   openRecordingdis: "none"
              // })
						},
						fail: function () {
							// 授权失败
							wx.showModal({
								title: '提示',
								content: '授权失败，需用户授权',
								success: function (res) {
									if (res.confirm) {
										wx.openSetting({
											success: (res) => {
                        if (res.authSetting['scope.record']) {
                          console.log('授权成功')
                        } else {
                          console.log('拒绝授权')
                        }
											}
										})
									} else {
                    console.log('拒绝授权')
                  }
                }
							})
						}
					})
				} else {
          console.log('授权过录音')
					that.setData({
            shutRecordingdis: "block",
            openRecordingdis: "none"
          })
          that.startRecordFun()
				}
			}
    })
    
  },
  startRecordFun() {
    let that = this
    this.setData({recordStatus: 2})
    const options = {
      duration: 5000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音计时
    that.recordingTimer();
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('。。。开始录音。。。')
    });
    recorderManager.onStop((res) => {
      console.info('限制时间到',res)
      this.shutRecordingMax(res.tempFilePath)
    })
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //结束录音
  shutRecording: function() {
    var that = this;
    this.setData({recordStatus: 3})
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          shutRecordingdis: "none",
          openRecordingdis: "block"
        })
      }
    })
    console.info('1清除定时器')

    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath)
      const {tempFilePath} = res;
      this.setData({
        tempFilePath,
        maskIsShow3:true
      })
      // this.data.tempFilePath = tempFilePath
      //结束录音计时
      clearInterval(that.data.setInter);
      //上传录音
      // return
      wx.uploadFile({
        url: Urls.love_upload,//这是你自己后台的连接
        fil: tempFilePath,
        name:"file",//后台要绑定的名称
        oss_upload_token:'a2ZzZGFsZmtsbnNmbG4',
        header: {
          "Content-Type": "multipart/form-data"
        },
        //参数绑定
        // formData:{
        //   recordingtime: that.data.recordingTimeqwe,
        //   topicid: that.data.topicid,
        //   userid:1,
        //   praisepoints:0
        // },
        success:function(res){
          console.log('音频上传成功',res);
          // wx.showToast({
          //   title: '保存完成',
          //   icon:'success',
          //   duration:2000
          // })
        },
        fail: function(ress){
          console.log("。。录音保存失败。。");
        }
      })
    })
  },
  //超出录音时长限制情况下德结束录音
  shutRecordingMax: function(path) {
    var that = this;
    this.setData({recordStatus: 3})
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          shutRecordingdis: "none",
          openRecordingdis: "block",
          tempFilePath:path,
          maskIsShow3:true
        })
      }
    })
    clearInterval(that.data.setInter);
        //上传录音
        return
        wx.uploadFile({
          url: appURL + '/wx_SubjectInformation/wx_SubjectRecordKeeping.do',//这是你自己后台的连接
          filePath: tempFilePath,
          name:"file",//后台要绑定的名称
          header: {
            "Content-Type": "multipart/form-data"
          },
          //参数绑定
          formData:{
            recordingtime: that.data.recordingTimeqwe,
            topicid: that.data.topicid,
            userid:1,
            praisepoints:0
          },
          success:function(ress){
            console.log(res);
            wx.showToast({
              title: '保存完成',
              icon:'success',
              duration:2000
            })
          },
          fail: function(ress){
            console.log("。。录音保存失败。。");
          }
        })

  
  
  },
  // 确定密码
  surePwd(){
    var  pattern =  '^([a-z]|[A-Z]|[0-9])+$' ;  
    var  regex =  new  RegExp(pattern); 
    if(this.data.pwdValue.match(regex)){ 
      this.setData({
        maskIsShow2:true
      })
    }else{
      wx.showToast({
        title: '格式为英文或字母~',
        icon:'none'
      })
    }
  },
  // 密码值
  pwdInput(e){
    console.info(e)
    this.setData({
      pwdValue:e.detail.value
    })
  },
  handleSetting() {
    /**
     * 设置用户保存图片到相册的权限状态
     */
    this.setData({
      authorize: true
    })
  },
  
  getSettings(notshow) {
    /**
     * 获取用户保存图片到相册的权限
     * 若用户同意授权，下载图片
     * 若用户不同意授权，提示用户，且设置按钮状态为跳转权限设置页面按钮
     */

    let that = this;
    wx.showLoading({
      title: '获取授权中...',
      mask: true,
    })
    wx.getSetting({
      success(res) {
        console.log('已授权列表---------', res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //这里是用户同意授权后的回调
              wx.showLoading({
                title: '图片保存中...',
                mask: true,
              })
              that.downloadFile(that.data.canvasImage)
            },
            fail() { //这里是用户拒绝授权后的回调
              // console.log('拒绝授权')
              wx.showToast({
                title: '您未允许授权下载，请重新点击设置相册权限',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                authorize: false
              })
            }
          })
        } else {
          wx.showLoading({
            title: '图片保存中...',
            mask: true,
          })
          that.downloadFile(that.data.canvasImage)
        }
      },
      fail(err) {
        console.log('授权失败--------------')
      }
    })
  },
  save(){
    this.setData({
      maskIsShow3:false,
      maskIsShow:true
    })
  },
  // 下载图片
  downloadFile(tempFilePath, notShow) {
    const that = this;
    /**
     * 下载图片
     */
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: function (res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 400,
        })
        setTimeout(() => {
          that.handleClosePoster();
        }, 1000)
      },
      fail: function (err) {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
        
      }
    })
  },
  //录音播放
  recordingAndPlaying: function(eve) {
    let _this = this
    if (this.data.playStatus) return
    _this.setData({playStatus:true,listenTime:0})
    audioContext.src = this.data.tempFilePath
    audioContext.play()
    this.playTimeLog()
    audioContext.onStop(()=> {
      console.log('onStop=====================')
      clearTimeout(this.timeOut)
      this.timeOut = null
      _this.setData({playStatus:false})
    })
    audioContext.onEnded(()=> {
      console.log('onEnded=====================')
      clearTimeout(this.timeOut)
      this.timeOut = null
      _this.setData({playStatus:false})
    })
    // wx.playBackgroundAudio({
    //   //播放地址
    //   dataUrl: this.data.tempFilePath,
    //   success() {
    //     _this.setData({playStatus: '播放中...'})
    //   }
    //   // dataUrl: '' + eve.currentTarget.dataset.gid + ''
    // })
  },

  playTimeLog() {
    this.timeOut = setTimeout(()=>{
      this.setData({listenTime: --this.data.listenTime}, ()=> {
        this.playTimeLog()
      })  
    }, 1000)
  },
  playRecord() {

  }

})