const recorderManager = wx.getRecorderManager()
Page({
  data: {
    openRecordingdis: "block",//录音图片的不同
    shutRecordingdis: "none",//录音图片的不同
    recordingTimeqwe:0,//录音计时
    setInter:""//录音名称
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
              that.setData({
                shutRecordingdis: "block",
                openRecordingdis: "none"
              })
              that.startRecordFun()
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
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //结束录音
  shutRecording: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          shutRecordingdis: "none",
          openRecordingdis: "block"
        })
      }
    })
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath)
      const {tempFilePath} = res;
      this.data.tempFilePath = tempFilePath
      //结束录音计时
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
    })
  },

  //录音播放
  recordingAndPlaying: function(eve) {
    wx.playBackgroundAudio({
      //播放地址
      dataUrl: this.data.tempFilePath
      // dataUrl: '' + eve.currentTarget.dataset.gid + ''
    })
  },
  playRecord() {

  }

})