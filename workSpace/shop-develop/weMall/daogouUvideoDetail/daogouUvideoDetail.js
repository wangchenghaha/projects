// weMall/daogouUvideoDetail/daogouUvideoDetail.js
import { splitImg } from '../../utils/utils'
import { URL, KEYSTORAGE } from '../../src/const.js'
// import { wxShowToast } from '../../utils/wxMethods'
import { getUserInfo, getDetail } from '../../service/saVideo'

const app = getApp();
let scrollState = false
let id = ''
let btnState = true


Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [],
    multiArray: [['AA', 'BB'], ['AA--11', 'AA--22', 'AA--33', 'AA--44', 'AA--55']],

    show: false,
    showVideo: false,
    // editor: '',
    // photographer: '',
    idType: '',
    // date: '',
    addIcon: splitImg('icon_plus_0825.png', 'common'),
    userInfoList: [],
    pageNum: 1,
    userName: '',



    saVideoTitle: '',
    projectDescription: '',
    videoEditorName: '',
    videoEditorDept: '',
    videoEditorCode: '',
    videographerName: '',
    videographerDept: '',
    videographerCode: '',
    videoUrl: '',
    musicCopyrightExpireDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageOptions()
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['AA--11', 'AA--22', 'AA--33', 'AA--44', 'AA--55'];
            break;
          case 1:
            data.multiArray[1] = ['BB--11', 'BB--22', 'BB--33'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      musicCopyrightExpireDate: e.detail.value
    })
  },


  toggle(e) {
    console.log(e)
    
    this.setData({
      show: !this.data.show,
      idType: e.currentTarget.id,
      pageNum: 1,
      userInfoList: [],
      userName: ''
    });
    // if (this.data.show) {
    //   this.getUserInfoFun()
    // }
  },
  checkedEditor (e, item) {
    console.log(e)
    console.log(item)
    if (e.currentTarget.id === 'editor') {
      this.setData({
        videoEditorName: e.currentTarget.dataset.item.nameCn,
        videoEditorDept: e.currentTarget.dataset.item.orgNameCn,
        videoEditorCode: e.currentTarget.dataset.item.userName,
        show: !this.data.show
      });
    } else if (e.currentTarget.id === 'photographer') {
      this.setData({
        videographerName: e.currentTarget.dataset.item.nameCn,
        videographerDept: e.currentTarget.dataset.item.orgNameCn,
        videographerCode: e.currentTarget.dataset.item.userName,
        show: !this.data.show,
      });
    }
  },

  inputing: function(e){
    console.log(e)
    let thisIndex = e.currentTarget.dataset.inp;
    let thisValue = e.detail.value;
    let inputArr = ['saVideoTitle', 'projectDescription', 'userName'];
    let setDataObj = {};
    setDataObj[inputArr[thisIndex -1 ]] = thisValue;
    this.setData(setDataObj)
    if (thisIndex === '3') {
      this.setData({
        pageNum: 1,
        userInfoList: []
      })
      this.getUserInfoFun()
    }
  },



  uploadBtn: function () {
    let _this = this
    wx.chooseVideo({
      sourceType: ['album'],
      success (res) {
        const tempFilePath = res.tempFilePath
        _this.setData({
          videoUrl: tempFilePath,
          showVideo: true
        })
        // wx.uploadFile({
        //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success (res){
        //     const data = res.data
        //     //do something
        //   }
        // })
      }
    })
  },
  delVideo: function () {
    this.setData({
      videoUrl: '',
      showVideo: false
    })
  },

  // 提交表单
  formSubmit(e) {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.saVideoTitle === '') {
      wx.showToast({icon: 'error',title: '视频标题不能为空',duration: 2000});
      return
    } else if (this.data.projectDescription === '') {
      wx.showToast({icon: 'error',title: '视频介绍不能为空',duration: 2000});
      return
    } else if (this.data.videoEditorName === '') {
      wx.showToast({icon: 'error',title: '剪辑不能为空',duration: 2000});
      return
    } else if (this.data.videographerName === '') {
      wx.showToast({icon: 'error',title: '拍摄不能为空',duration: 2000});
      return
    } else if (this.data.videoUrl === '') {
      wx.showToast({icon: 'error',title: '视频不能为空',duration: 2000});
      return
    } else if (this.data.musicCopyrightExpireDate === '') {
      wx.showToast({icon: 'error',title: '有效期不能为空',duration: 2000});
      return
    }
    console.log('form发生了submit事件，携带数据为：', this.data.videoUrl, this.data.saVideoTitle, this.data.projectDescription, this.data.videoEditorName, this.data.videoEditorDept,this.data.videoEditorCode,this.data.videographerName, this.data.videographerDept, this.data.videographerCode, this.data.musicCopyrightExpireDate)

    if (btnState) {
      btnState = false
      wx.uploadFile({
        url: `${URL.SAVIDEO_ADD}`,
        filePath: this.data.videoUrl,//要上传文件资源的路径
        name: 'files', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        header: {
          token: wx.getStorageSync('token'),
          'content-type': 'multipart/form-data'
        },
        formData: {
          id: id,
          brand: getApp().config.brand,
          createBy: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId,
          saVideoTitle: this.data.saVideoTitle,
          projectDescription: this.data.projectDescription,
          videoEditorName: this.data.videoEditorName,
          videoEditorDept: this.data.videoEditorDept,
          videoEditorCode: this.data.videoEditorCode,
          videographerName: this.data.videographerName,
          videographerDept: this.data.videographerDept,
          videographerCode: this.data.videographerCode,
          musicCopyrightExpireDate: this.data.musicCopyrightExpireDate
        }, //HTTP 请求中其他额外的 form data
        success: function (res) {
          console.log('提交返回参数' + res)
          wx.hideLoading();
          let data = JSON.parse(res.data)
          if (data.code === 0) {
            btnState = true
            wx.showToast({
              title: data.msg,
              duration: 2000
            });
            // wx.navigateBack({
            //   delta: 1
            // })
            wx.redirectTo({
              url: `/weMall/daogouUvideo/daogouUvideo`,
            })
          } else {
            btnState = true
            wx.showToast({
              icon: 'error',
              title: data.msg,
              duration: 2000
            });
          }
          // console.log(res.data)
          // console.log(JSON.parse(res.data).msg)
        },
        fail: function (res) {
          btnState = true
          wx.hideLoading();
        }
      })
    }
// console.log(this.data.videographerName)
    // saVideoAdd().then(res => {
    //   wx.hideLoading()
    //   console.log(res,'&&')
    // }).catch(err => wxShowToast(err.message))


  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    // this.setData({
    //   chosen: ''
    // })
  },

  getUserInfoFun: function () {
    console.log('===========获取员工信息')
    if (!scrollState) {
      scrollState = true
    } else {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    console.log(this.data.userName)
    let param = {
      brand: getApp().config.brand,
      pageNum: this.data.pageNum,
      pageSize: 20,
      name: decodeURI(this.data.userName)
    }
    if (scrollState) {
      getUserInfo(param).then(res => {
        wx.hideLoading();
        scrollState = false
        console.log(res)
        if(res.data.length > 0) {
          this.setData({
            userInfoList: [...this.data.userInfoList, ...res.data],
            pageNum: this.data.pageNum + 1
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            duration: 2000
          })
        }
      }).catch(err => {
        wx.hideLoading();
        scrollState = false
        // wxShowToast(err.message)
      })
    }
  },
  lower: function () {
    this.getUserInfoFun()
  },

  getPageOptions(){
    const pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let curOptions = currentPage.options;
    id = curOptions.id || '';

    if (id !== '') {
      this.getDetail()
    }
    console.log('pppppppppppppppppppp>>' + id)
  },

  getDetail: function () {
    wx.showLoading({
      title: '加载中',
    })
    let param = {
      id: id
    }
    getDetail(param).then(res => {
      wx.hideLoading();
      console.log('根据id获取上传视频详情' + JSON.stringify(res))
      this.setData({
        showVideo: true,

        saVideoTitle: res.saVideoTitle,
        projectDescription: res.projectDescription,
        videoEditorName: res.videoEditorName,
        videoEditorDept: res.videoEditorDept,
        videoEditorCode: res.videoEditorCode,
        videographerName: res.videographerName,
        videographerDept: res.videographerDept,
        videographerCode: res.videographerCode,
        videoUrl: 'https://cms-test.bestseller.com.cn/hds-creative/rest/' + res.videoUrl,
        musicCopyrightExpireDate: res.musicCopyrightExpireDate,
      })
      console.log(this.data.videoUrl)
      let _this = this
      wx.downloadFile({
        url: this.data.videoUrl, //仅为示例，并非真实的资源
        success (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            _this.setData({
              videoUrl: res.tempFilePath
            })
            console.log('回显视频路径转本地' + _this.data.videoUrl)
            // wx.playVoice({
            //   filePath: res.tempFilePath
            // })
          }
        }
      })


    }).catch(err => {
        wx.hideLoading();
        scrollState = false
        // wxShowToast(err.message)
      })
  }

})