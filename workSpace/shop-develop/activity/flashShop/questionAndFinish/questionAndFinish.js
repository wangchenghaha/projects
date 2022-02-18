// activity//flashShop/questionAndFinish/questionAndFinish.js
import {updateFlash,getQuestion,lingjiang,searchUser} from '../netWork'
import {KEYSTORAGE} from '../../../src/const'
var nextPageJson = {
  userInfo : {},
  locationType : '',
  havePrize : false,
  bgImg : '',
  question : ''
}
// 保存问题数组
var textJsonArrs = []
// 保存已答过的题
var requestQuestion = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    quanText : {
      top : '',
      bottom : ''
    },
    lingquText : {
      top : '',
      bottom : ''
    },
    bottomText : '',
    splashImg : '',
    // 答题还是领奖界面
    isQuestion : true,
    question : {
      num : 0,
      title : '',
      arrs : []
    },
    // 选中后改变字体颜色
    selectIndex : -1,
    // 是否领取过奖品
    havePrize : false,
    // 答案
    colorJson : {
      title : '',
      titlebgColor : '',
      jiangpinID : -1,
      subTitles : []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    textJsonArrs = []
    requestQuestion = ''

    nextPageJson = wx.getStorageSync('nextPageJson');
    wx.removeStorageSync('nextPageJson');

    this.setData({
      splashImg : nextPageJson.bgImg,
      havePrize : nextPageJson.havePrize
    })

    let quanText = this.data.quanText
    let lingquText = this.data.lingquText
    let bottomText = this.data.bottomText
    quanText.top = 'VERO MODA50元优惠券'
    quanText.bottom = '已放入你的卡包-点击查看'
    lingquText.top = '凭此页面前往霓虹实验室'
    lingquText.bottom = '领取你的专属RIO'
    bottomText = '每人活动期间仅限参与1次'
    this.setData({
      quanText,lingquText,bottomText
    })


    this._searchUserInfo()

  },
  getQuestion(){

    let json = {
      location : nextPageJson.locationType,
      userId : nextPageJson.userInfo.userId
    }
    getQuestion(json).then(res => {
      if (res.length > 0){
        res.forEach(item => {
          item.title = item.questionName
          item.subTitles = item.answer.split('|')
        })
        textJsonArrs = res

        let question = this.data.question
        if (nextPageJson.question){
          let arrs = nextPageJson.question.filter( item => {
            return item != ''
          })
          console.log(`已答过的内容:${JSON.stringify(arrs)}`)
          requestQuestion = arrs.join('|')
          requestQuestion = `${requestQuestion}|`

          
          if (arrs.length == 3){

            let json = nextPageJson.userInfo.acUserAward
            let colorJson = this.data.colorJson
            colorJson.title = json.awardName
            colorJson.titlebgColor = json.awardColor
            colorJson.jiangpinID = json.awardId
            colorJson.subTitles = json.awardDesc.split('|')
            this.setData({isQuestion : false,colorJson})
          }
          else{
            question.num = arrs.length
            question.title = textJsonArrs[question.num].title.split('|')
            question.arrs = textJsonArrs[question.num].subTitles
          }
        }
        else{
          
          question.num = 0
          question.title = textJsonArrs[0].title.split('|')
          question.arrs = textJsonArrs[0].subTitles
          
        }
        this.setData({question})


      }


    })
  },
  selectTap(e){
    let index = e.currentTarget.dataset.index

    let detail = this.data.question.arrs[index]
    
    // console.log(`aaaaaaaa:${JSON.stringify(e)}`)
    
    if (requestQuestion == ''){
      requestQuestion = `${detail}|`
    }
    else{

      let a = requestQuestion.split('|').filter(item => {
        return item != ''
      })
      if (a.length == 3){
        requestQuestion = `${a[0]}|${a[1]}|${detail}|`
      }
      else{
        requestQuestion = `${requestQuestion}${detail}|`
      }
      
    }
    

    this.setData({selectIndex : index})


    let requestJson = {
      picShare : 1,
      labQuestion : requestQuestion,
      location : nextPageJson.locationType,
      userId : nextPageJson.userInfo.userId
    }
    updateFlash(requestJson).then(res => {
      // console.log(`更新打卡状态:${JSON.stringify(res)}`)

        if (this.data.question.num == 2){
          
          // 全部答完题后有答案

          if (res.acUserAward){
            let json = res.acUserAward
            let colorJson = this.data.colorJson
            colorJson.title = json.awardName
            colorJson.titlebgColor = json.awardColor
            colorJson.jiangpinID = json.awardId
            colorJson.subTitles = json.awardDesc.split('|')
            this.setData({isQuestion : false,colorJson,selectIndex : -1})
          }


        }
        else{
          let question = this.data.question
          question.num = question.num + 1
          question.title = textJsonArrs[question.num].title.split('|')
          question.arrs = textJsonArrs[question.num].subTitles
          this.setData({question,selectIndex : -1})

        }
    })
    
  },
  showModalF(title,text,canChancel = false,callback){

    wx.showModal({
      title: title,
      content: text,
      showCancel: canChancel,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          if (callback){
            callback()
          }
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });

  },
  // 领奖
  getAward(){
    this.showModalF('提示','请凭此信息联系工作人员领取专属饮品。待领取后，由工作人员点击“确定”',true,() => {
      let json = {
        awardId : this.data.colorJson.jiangpinID,
        hasReceive : 'Y',
        userId : nextPageJson.userInfo.userId
      }
      lingjiang(json).then(res => {
        nextPageJson.havePrize = true
        this.setData({havePrize : true})
      })

    })
  },
  // 查看优惠券
  goCoupon(){
    wx.navigateTo({
      url: '/member/myCouponList/myCouponList?name=3'
    });
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
  _searchUserInfo(){

          // 调用查询并创建接口
          let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
          let json = {
            openid : getApp().getOpenId(),
            phone : userInfo.phone,
            location : nextPageJson.locationType
          }
          searchUser(json).then(res => {
            console.log(`查询用户:${JSON.stringify(res)}`)
            if (res){

                // 可以继续
                nextPageJson.havePrize = false
                nextPageJson.question = ''
                nextPageJson.userInfo = res

                        if (res.acUserOperation){
                          // 有打卡状态
                          let json = res.acUserOperation
                          
                          if (json.labQuestion){
                            if (json.labQuestion.split('|').length > 3){
                              // 判断是否领过奖
                              if (res.acUserAward && res.acUserAward.hasReceive == 'Y'){
                                nextPageJson.havePrize = true
                              }
                            }
                            nextPageJson.question = json.labQuestion.split('|')
                            

                          }
                        }

                        this.getQuestion()

            }
          })
  }
})