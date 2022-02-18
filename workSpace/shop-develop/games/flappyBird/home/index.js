// pages/flappyBird/home/index.js

const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/birdGame/`
const app = getApp();
const guizeText = `1、活动时间：2021年8月${app.config.brand === 'FOL' ? '10' : '5'}日 – 2021年8月31日 ,${app.config.brand === 'FOL' ? '核销时间：截止8月31日23:59:59' : '核销时间：领取之后30天内'},2、游戏方式：,（1）点击屏幕控制小喜鹊越过障碍物，并收集游戏途中可能出现的稀有小喜鹊,（2）每人每天有5次游戏机会，5次机会用完后，可以完成以下任务获得额外游戏次数：,1）每成功邀请一名好友助力可获得1次额外游戏机会,2）每日浏览首页可获得1次额外游戏机会,3）活动期间关注公众号可获得2次游戏机会,（3）每成功越过一次障碍可获得积分，积分和游戏途中收集的小喜鹊均可用于兑换奖品。,（4）单优惠券每人在活动期间仅可以兑换${app.config.brand === 'FOL' ? '3' : '1'}次。,（5）奖品数量有限，先到先得，具体以兑换界面数量为准,5. 注意事项:,（1） ${app.config.appName}是绫致时装(天津)有限公司旗下品牌，绫致时装(天津)有限公司及其关联公司(以下简称“绫致”)为本次活动的举办方。请中奖用户在活动期间准确填写信息，并保持手机畅通，若信息填写错误或未在规定时间内填写完成导致无法发放奖品，将视为用户自行弃奖。,（2）本次活动中，不同种类的奖品每人各仅限兑奖1次。,（3）奖品过期未兑奖或使用，将视为自动弃奖，不予补发。,（4）凡以不正当手段(包括但不限于作弊、刷奖、扰乱系统、实施网络攻击等)参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或收回已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任,（5）为保证活动的真实性、公平性，绫致有权要求参与用户出示身份证明进行活动参与及获奖资格的核实。,（6）如您有其他活动相关疑问，请在工作时间内(周一至周五9:00-18:00，节假日除外)拨打活动电话：4008101 666，我们将竭诚为您解答。,,6.免责声明:,（1） 鉴于互联网之特殊性质，活动期间若发生黑客攻击、电信部门技术调整导致重大影响、病毒侵袭、网络故障、微信平台、宽带、域名解析故障或其他网络设备或技术提供商的服务延迟、服务障碍或任何其他类似事件，致使活动无法正常进行，在法律法规允许的范围内绫致不对活动暂停或终止给参与者造成的损失进行额外赔偿或补偿。,（2）活动中如因系统维护或升级将暂停服务，绫致将提前发布公告通知。暂停服务期间给用户造成的一切不便与损失,在法律法规允许的范围内绫致均得免得免责。,（3）活动奖品的领取将以用户填写的信息为准。若出现填写错误、冒领等情况,由用户自行承担相关责任，在法律允许的范围内绫致不对用户的损失进行额外赔偿或补偿。,（4）由于参与用户自身参与活动方式不当或不正确而导致不能参与活动，在法律法规允许的范围内绫致不承担责任。,（5）凡以任何方式参加本次活动的，视为自愿接受本免责声明的约束。,（6）本声明未涉及的问题参见国家有关法律法规.当本声明与国家法律法规冲突时，以国家法律法规为准。,（7）本活动在法律允许范围内由绫致解释。,`
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import { wxSubscription } from '../../../utils/wxSubscribe'
import events from "../../../src/events"
import {getGameConfig,searchUserInfo,createUser,openBigGif,getCouponList,duihuanCoupon,myCouponList,getRenwuList,finishRenwu,myFinishRenwuList} from '../netWork'

// utm参数
let utmParams = {

    utm_source: 'DBCA',
    utm_medium: 'MPG',
    utm_term: app.config.brand === 'ONLY' ? '1MINIGAME01' : app.config.brand === 'JACKJONES' ? '2MINIGAME01' : app.config.brand === 'VEROMODA' ? '3MINIGAME01' : app.config.brand === 'SELECTED' ? '4MINIGAME01' : 'ZMINIGAME01',
    utm_campaign: app.config.brand === 'ONLY' ? '20210802ONLY' : app.config.brand === 'JACKJONES' ? '20210802JJ' : app.config.brand === 'VEROMODA' ? '20210802VM' : app.config.brand === 'SELECTED' ? '20210802SLT' : '20210802FOL'
}
// 游戏开始/结束日期
let startTime = 0
let endTime = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bgImg : `${imgPath}/bg2.jpg`,
        centerImg : `${imgPath}/bg1_${app.config.brand}.png`,
        bottomImgs : [`${imgPath}/gushi.png`,`${imgPath}/duihuan.png`,`${imgPath}/renwu.png`],
        numImg:`${imgPath}/homeNum.png`,
        birdNumImg : `${imgPath}/birdNum.png`,
        renwuImg : `${imgPath}/renwuBg.png`,
        renwuDatas:[],
        duihuanImg : `${imgPath}/duihuanBg.png`,
        duihuanImg_1 : `${imgPath}/duihuan_1.png`,
        duihuanImg_2 : `${imgPath}/duihuan_2.png`,
        duihuanImg_box : `${imgPath}/duihuanBox.png`,
        xingImg : `${imgPath}/xingxing.png`,
        duihuan_1:`${imgPath}/duihuan_1.png`,
        duihuan_2:`${imgPath}/duihuan_2.png`,
        guizeImg : `${imgPath}/guizeBg.png`,
        priceImg : `${imgPath}/${app === 'FOL' ? 'price3' : 'price2'}.png`,
        goHomeImg : `${imgPath}/goHome1.png`,
        renwuAnimate : ``,  //任务动画
        duhuanAnimate : ``,
        bouncedBgAnimate : ``,  //透明背景动画

        showRenwu : false,
        showDuihuan : false,
        showGuize : false,
        showPrice : false,

        duihuanType : `1`,   //兑换奖品/记录切换

        guizeArrs : [],

        // 用户信息
        userData : {},
        // 优惠券列表
        couponDatas : []

    },

    /**
     * 接受授权成功刷新页面
     */
    handleEvent: function (event, type) {
        if (type == EVENTS.EVENT_GAMECRMINFO && event) {
            //  获取手机号成功
            if (startTime === 0){
                this.requestDatas()
            }
        } 
    },
    requestDatas(){
        if (startTime === 0){
            getGameConfig().then(e => {
                startTime = new Date(e.activityStartTime.replace(/-/g, '/')).getTime()
                endTime = new Date(e.activityEndTime.replace(/-/g, '/')).getTime()
            })
        }
        let openID = wx.getStorageSync('wxOpenID');
        let userData = this.data.userData
        searchUserInfo(openID).then(res => {

            if (!res) {
                let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
                let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
                let phone = userInfo.phone
                if (phone.length == 12) {
                    phone = phone.substr(0, 11)
                }

                // 创建用户
                let json = {
                    phone: phone,
                    openid: openID,
                    nickName: wxInfo.nickName,
                    facePic: wxInfo.avatarUrl,
                    memberno: userInfo.memberno,
                    crmCreatedTime: userInfo.joindate
                }
                
                createUser(json).then(e => {
                    userData = e
                    this.setData({userData})
                    // 首次创建 进入故事
                    // 故事
                    wx.navigateTo({
                        url: `../story/index`
                    });
                })

            } else {
                userData = res
                this.setData({userData});
                if (res.giftStatus === 0 && res.flopCount >= 6){
                    // 集齐6个小鸟显示
                    this.setData({
                        bouncedBgAnimate:`bouncedBgShow`,
                        duhuanAnimate : `duihuanShow`,
                        showPrice : true
                    })

                }
            }

        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        events.register(this, EVENTS.EVENT_GAMECRMINFO)
        
        if(options.utm_source && options.utm_source !== ''){
            const json = {
                utm_source : options.utm_source,
                utm_medium : options.utm_medium,
                utm_term : options.utm_term,
                utm_campaign : options.utm_campaign
            }
            utmParams = Object.assign(utmParams,json)
        }
        app.setUtmOptions(utmParams)
        let guizeArrs = this.data.guizeArrs
        guizeArrs = guizeText.split(`,`)
        this.setData({guizeArrs})

        startTime = 0
        endTime = 0

        console.log(`调用onload`)
    },
    bottomTap(e){
        if (!this.checkGameTime()){
            return
        }
        if (e.currentTarget.id === `0`){
            // 故事
            wx.navigateTo({
                url: `../story/index`
            });
        } else if (e.currentTarget.id === `1`){
            // 兑换
            this.getCoupon()
        } else if (e.currentTarget.id === `2`){
            // 任务
            this.getRenwu()
        }
    },
    // 获取任务列表
    getRenwu(){
        getRenwuList().then(e => {
            let renwuDatas = this.data.renwuDatas
            renwuDatas = [
                {
                    id : -1,
                    title:`邀请好友`,
                    subTitle:`每邀请1位好友获得1次游戏次数`,
                    bg:`${imgPath}/renwuSubBg.png`,
                    btn : `${imgPath}/quwancheng.png`,
                    type:`share`,
                    canTap : true
                }
            ]
            e.forEach(item => {
                const json = {
                    id : item.id,
                    title : item.taskName,
                    subTitle : `完成任务获得${item.rewardCount}游戏次数`,
                    bg:`${imgPath}/renwuSubBg.png`,
                    btn : `${imgPath}/quwancheng.png`,
                    type:'',
                    canTap : true,
                    path:item.taskUrl
                }
                renwuDatas.push(json)
            })
            myFinishRenwuList(this.data.userData.id).then(e => {
                e.forEach(item => {
                    renwuDatas.forEach(items => {
                        if (item.taskId === items.id){
                            items.btn = `${imgPath}/wancheng.png`,
                            items.canTap = false
                        }
                    })
                })
                this.setData({
                    renwuDatas,
                    showRenwu : true,
                    renwuAnimate:`moveUp`,
                    bouncedBgAnimate:`bouncedBgShow`
                })

            })

        })
    },
    // 获取优惠券列表
    getCoupon(){
        this.setData({couponDatas : []})
        getCouponList().then(e => {
            const arrs = this.chaiGroup(2,e)
            this.setData({
                couponDatas : arrs,
                bouncedBgAnimate:`bouncedBgShow`,
                duhuanAnimate : `duihuanShow`,
                showDuihuan : true
            })
        })

    },
    getMyCoupon(){
        this.setData({couponDatas : []})
        myCouponList(this.data.userData.id).then(e => {
            
            const arrs = this.chaiGroup(2,e)
            this.setData({
                couponDatas : arrs
            })
        })
    },
    play(){
        if (!this.checkGameTime()){
            return
        } else if (this.data.userData.gameCount <= 0){
            wx.showToast({
                title: '当前游戏次数不足',
                icon: 'none'
            });
            return
        }

        if (!wx.getStorageSync('wxSubscriptions').isJumpGame){
            wxSubscription("jumpGame").then(res => {
              this.toPlay();
            }).catch(err => {
              this.toPlay();
            })
          } else{
            this.toPlay();
          }
    },
    toPlay(){

        wx.setStorageSync('flappyGame', this.data.userData);
        wx.setStorageSync('flappyGameUTM', utmParams);
        wx.navigateTo({
          url: '../game/index'
        })
    },
    closed(){
        this.setData({
            renwuAnimate:`moveDown`,
            bouncedBgAnimate:`bouncedBgHidden`,
            duhuanAnimate : `duihuanHidden`
        })
        setTimeout(() => {
            this.setData({
                showRenwu : false,
                showDuihuan : false,
                showGuize : false,
                showPrice : false,
                renwuAnimate:``,
                bouncedBgAnimate:``,
                duhuanAnimate : ``
            })
            
        }, 250);
    },
    // 大礼包点击
    priceTap(){
        let userData = this.data.userData
        userData.flopCount = 1
        this.setData({
            userData
        })
        this.closed()
        openBigGif({userId : this.data.userData.id}).then(e => {
        })
    },
    // 兑换
    duihuanTap(e){
        const json = e.currentTarget.dataset.detail
        if (this.data.duihuanType === '2'){
            app.goBack()
            
        } else{
            if (json.stock <= 0){
                wx.showModal({
                    title: '提示',
                    content: '库存不足',
                    showCancel: false
                });
                return
            }
            duihuanCoupon({userId:this.data.userData.id,giftId : json.id}).then(e => {
                setTimeout(() => {
                    this.getCoupon()
                }, 1600);
            })
        }
    },
    guizeTap(){
        
        this.setData({
            bouncedBgAnimate:`bouncedBgShow`,
            duhuanAnimate : `duihuanShow`,
            showGuize : true
        })
    },
    // 任务相关点击
    btnTap(e){
        const json = e.currentTarget.dataset.detail
        if (json.canTap){
            finishRenwu({taskId : json.id,userId : this.data.userData.id}).then(() => {
                this.closed()
                if (json.path === 'pages/index/index'){
                    app.goBack()
                } else{
                    app.navigateTo(json.path)
                }
            })
        }
    },
    duihuanTypeTap(e){
        this.setData({
            duihuanType : e.currentTarget.id
        })
        if (e.currentTarget.id === '1'){
            this.getCoupon()
        } else{
            this.getMyCoupon()
        }
    },

    // 判断游戏是否过期
    checkGameTime(){
        const currentTime = new Date().getTime()
        if (startTime < currentTime && endTime > currentTime){
            // 在活动范围
            return true
        }
        wx.showModal({
            title: '提示',
            content: '不在活动时间范围内!',
            showCancel: false
        });
        return false
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

    wx.showLoading({
        title: '加载中……',
        mask: true
      });
      setTimeout(() => {
        wx.hideLoading();
        if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
          app.navigateTo('member/login/login?game=true')
          return;
        }
        else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
            this.requestDatas()
        }
       
      }, 1000);

    },
    goHome(){
        app.goBack()
    },
    // 拆分数组
    chaiGroup(arrLength, array){
        let index = 0
        const newArray = []; while (index < array.length) {
          newArray.push(array.slice(index, index += arrLength))
        } return newArray
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
        this.closed()

        let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
        let json = {
          userid: this.data.userData.id || '',
    
          share_by: sharePams.employeeId || '',
          share_by_shop: sharePams.shopCode || ''
        }
        const totalJson = Object.assign(json,utmParams)

        let title = ''
        let titleArr = ['今日次数已用光，不要气馁，明天再来！','我飞不动了，邀请好友来帮我加油打气吧！']
       
        let random = Math.floor(Math.random() * titleArr.length)
        title = titleArr[random]
    
        let path = `/games/flappyBird/help/index?params=${JSON.stringify(totalJson)}`
        let imageUrl = `${imgPath}shareImg.jpeg`
        console.log(`分享成功:${path}`)
        return {
          title: title,
          path: path,
          imageUrl: imageUrl
        }
    }
})