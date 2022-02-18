// valentineDay/pages/longtapRecord/longtapRecord.js
import mainService from '../../../base/main.js';
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
const recorderManager = wx.getRecorderManager()
const audioContext = wx.createInnerAudioContext()
import Urls from '../../services/url'
import pathModel from '../../models/path.model';
import dataModel from '../../models/dataInfo.model';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordingTime:60,//录音计时
    tempFilePath: '',
    playStatus: false,
    recordStatus: 1,
    shutRecordingdis: 'none',
    heartSelect:'',
    heartId:'',
    recordIng:false,
    isBigPhone: Utils.isBigPhone()

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(dataModel.data){
      let data = dataModel.data
      this.setData({
        comData:data
      })
    }
    if(options.heartSelect){
      this.setData({
        heartSelect:options.heartSelect
      })
    }
    if(options.heartId){
      this.setData({
        heartId:options.heartId
      })
    }
  },

      //录音计时器
      recordingTimer: function () {
        var that = this;
        //将计时器赋值给setInter
        that.data.setInter = setInterval(
          function () {
            var time = that.data.recordingTime - 1;
            that.setData({
              recordingTime: time
            })
          }
          , 1000);
      },
      restartRecord() {
        clearInterval(this.data.setInter);
        audioContext.stop()
        
        this.setData({
          tempFilePath: '',
          startRecord: true,
          recordingTime: 60
        })
      },
      jumpToSetPwd() {
        wx.navigateTo({
          url: `${pathModel.vd_setPwd}?soundUrl=${this.data.soundUrl}&heartSelect=${this.data.heartSelect}&heartId=${this.data.heartId}`,
        })

        // this.triggerEvent('isShow', {
        //   indexShow: false,
        //   recordShow: false,
        //   startRecord: false,
        //   setPwdShow: true,
        //   soundUrl: this.data.soundUrl,
        //   heartId: this.data.heartId,
        //   heartSelect: this.data.heartSelect
        // });

      },
      //录音播放
      recordingAndPlaying: function (eve) {
        let _this = this
        
if (wx.setInnerAudioOption) {

  wx.setInnerAudioOption({

    obeyMuteSwitch: false,

    autoplay: true

  })

}else {

  myaudio.obeyMuteSwitch = false;

  myaudio.autoplay = true;

}
        if (this.data.playStatus) return
        _this.setData({ playStatus: true, listenTime: 0, recordIng:true})
        audioContext.src = this.data.tempFilePath;
        audioContext.play()
        this.playTimeLog()
        audioContext.onStop(() => {
          console.log('onStop=====================')
          clearTimeout(this.timeOut)
          this.timeOut = null
          _this.setData({ playStatus: false,recordIng:false})
        })
        audioContext.onEnded(() => {
          console.log('onEnded=====================')
          clearTimeout(this.timeOut)
          this.timeOut = null
          _this.setData({ playStatus: false, recordIng:false })
        })
      },
      playTimeLog() {
        this.timeOut = setTimeout(() => {
          this.setData({ listenTime: ++this.data.listenTime }, () => {
            this.playTimeLog()
          })
        }, 1000)
      },
      //开始录音
      openRecording: function () {
        var that = this;
        wx.getSetting({
          success(res) {
            console.log(res, 'getSetting')
            // return
            if (!res.authSetting['scope.record']) {
              wx.authorize({
                scope: 'scope.record',
                success(res) {
                  console.log('授权录音成功')
                  // that.setData({
                  //   shutRecordingdis: "none",
                  //   openRecordingdis: "block"
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
                openRecordingdis: "none",
                recordIng:true
              })
              that.startRecordFun()
            }
          }
        })
  
  
  
      },
      startRecordFun() {
        let that = this
        this.setData({ recordStatus: 2 })
        const options = {
          duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
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
          console.info('限制时间到', res)
          this.shutRecordingMax(res.tempFilePath)
        })
        //错误回调
        recorderManager.onError((res) => {
          console.log(res);
        })
      },
      // 暂停录音
      pause() {
        recorderManager.pause()
      },
      //结束录音
      shutRecording: function () {
        var that = this;
        that.setData({ recordStatus: 1 })
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              shutRecordingdis: "none",
              openRecordingdis: "block",
              recordIng:false
            })
          }
        })
        console.info('1清除定时器')
        clearInterval(that.data.setInter);
  
        recorderManager.stop();
        recorderManager.onStop((res) => {
          console.log('。。停止录音。。', res.tempFilePath)
          const { tempFilePath } = res;
          that.setData({
            tempFilePath,
            maskIsShow3: true
  
          })
          // this.data.tempFilePath = tempFilePath
          //结束录音计时
          clearInterval(that.data.setInter);
          //上传录音
  
          wx.uploadFile({
            url: Urls.love_upload,//这是你自己后台的连接
            filePath: tempFilePath,
            name: "file",//后台要绑定的名称
  
            header: {
              "Content-Type": "multipart/form-data"
            },
            //参数绑定
            formData: {
              oss_upload_token: 'a2ZzZGFsZmtsbnNmbG4',
              file: tempFilePath,
            },
            success: function (res) {
              console.log('音频上传成功', res);
              let data = JSON.parse(res.data)
              console.log('音频上传成功', data);
  
              that.setData({
                soundUrl: data.data.url
              })
              console.info('soundUrl', that.data.soundUrl)
              // wx.showToast({
              //   title: '保存完成',
              //   icon:'success',
              //   duration:2000
              // })
  
            },
            fail: function (ress) {
              console.log("。。录音保存失败。。");
            }
          })
        })
      },
      //超出录音时长限制情况下德结束录音
      shutRecordingMax: function (path) {
        var that = this;
        this.setData({ recordStatus: 1 })
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              shutRecordingdis: "none",
              openRecordingdis: "block",
              tempFilePath: path,
              maskIsShow3: true
            })
          }
        })
        clearInterval(that.data.setInter);
        //上传录音
        return
        wx.uploadFile({
          url: appURL + '/wx_SubjectInformation/wx_SubjectRecordKeeping.do',//这是你自己后台的连接
          filePath: tempFilePath,
          name: "file",//后台要绑定的名称
          header: {
            "Content-Type": "multipart/form-data"
          },
          //参数绑定
          formData: {
            recordingtime: that.data.recordingTime,
            topicid: that.data.topicid,
            userid: 1,
            praisepoints: 0
          },
          success: function (ress) {
            console.log(res);
            wx.showToast({
              title: '保存完成',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (ress) {
            console.log("。。录音保存失败。。");
          }
        })
  
  
  
      },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.comData.valentine.share_title,
      path:`${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`,
      imageUrl: this.data.comData.valentine.card_img, 
    }
  }
})