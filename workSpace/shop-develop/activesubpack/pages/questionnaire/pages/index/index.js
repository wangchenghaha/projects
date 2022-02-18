import AjaxService from '../../services/ajax.service'
// import mainService from '../../../services/main.service'
// import memberService from '../../../pages/memberModule/services/member.service';
let flag = true
const app = getApp()
Page({
    data: {
        navHeight: 0,
        is_answer: '',//是否答题
        questions: '',//问题
        model: '',
        jupPath: '',
        modelStatus: 0,
        satisfiedList: [{ title: '非常不满意', fraction: 1 }, { title: '不满意', fraction: 2 }, { title: '一般', fraction: 3 }, { title: '很满意', fraction: 4 }, { title: '非常满意', fraction: 5 }],
        ev_id: '',
        order_no: '',
        shop_no: '',
        is_first_answer:false,
        uid:'',
        oid:'',
        jump_type:''
    },
    setNav() {
        this.selectComponent('#comp-nav-dynamic').setOptions({
            navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
            navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
            titleColorInit: '#000000', // 文本颜色-初始值 16进制
            titleColorRoll: '#000000', // 文本颜色-滚动值 16进制
            titleTextInit: '调查问卷', // 标题文字-初始值
            titleTextRoll: '', // 标题文字-滚动值
            historyShow: true, // 历史图标是否显示
            scrollMin: 0, // 最小滚动间距，单位px
            scrollMax: 200, // 最大滚动间距，单位px
            homeShow: true, // home图标是否显示
            homeJudgeStack: true, // home图标显示是否判断页面栈
            homePath: '/pages/newsModule/pages/index/index', // home页面路径
            homeColorInit: 'black', // home图标颜色-初始值 white / black
            homeColorRoll: 'black', // home图标颜色-滚动值 white / black
        })
        this.setData({
            navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
        })
    },
    _init() {
        AjaxService.init({
            ev_id: this.data.ev_id,
            order_no: this.data.order_no,
            shop_no: this.data.shop_no,
            unionid:this.data.uid,
            openid:this.data.oid
        }).then(res => {
            console.log(res)
            let { errcode, data, errmsg} = res
            if (errcode == 0) {
                let system = wx.getSystemInfoSync().platform
                let startTime = ''
                let endTime = ''
                let nowTime = new Date().getTime()
                if (system == 'ios') {
                    startTime = new Date(data.evaluate.start_time.replace("-", "/")).getTime()
                    endTime = new Date(data.evaluate.end_time.replace("-", "/")).getTime
                } else {
                    startTime = new Date(data.evaluate.start_time).getTime()
                    endTime = new Date(data.evaluate.end_time).getTime()
                }
                data.evaluate.evaluate_questions.forEach((item, index) => {
                    item.sign = 0
                    if (item.type == 4) {
                        item.content = ''
                        item.sign = 1
                    }
                })
                this.setData({
                    questions: data
                })
                if (nowTime < startTime) {//未开始
                    this.setData({
                        model: data.evaluate.not_started_img,
                        jupPath: data.evaluate.not_started_url
                    })
                } else if (nowTime > endTime) {//已结束
                    this.setData({
                        model: data.evaluate.end_img,
                        jupPath: data.evaluate.end_url
                    })
                } else if (data.is_answer == 1) {//已答题
                    this.setData({
                        model: data.evaluate.into_agin_img,
                        jupPath: data.evaluate.into_agin_url
                    })
                }

            } else{
                wx.showToast({
                    title: errmsg,
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                });
                // mainService.toast(errmsg)
            }
        }).catch(err => {
            console.log(err)
        })
    },
    //五星评价、满意度
    scoring(e) {
        let question = e.currentTarget.dataset.question //第几题
        let index = e.currentTarget.dataset.index
        let starSign = `questions.evaluate.evaluate_questions[${question}].sign`
        this.setData({
            [starSign]: index + 1
        })
    },
    // //拖动
    // movableChange(e) {
    //     let question = e.currentTarget.dataset.question //第几题
    //     let starSign = `questions.evaluate.evaluate_questions[${question}].sign`
    //     if (e.detail.source == 'touch') {
    //         this.setData({
    //             [starSign]: Math.ceil(e.detail.x / 35) + 1
    //         })
    //     }
    // },
    chooseScond(e){
        let question = e.currentTarget.dataset.question //第几题
        let num = e.currentTarget.dataset.num //分数
        let starSign = `questions.evaluate.evaluate_questions[${question}].sign`
        this.setData({
            [starSign]: num
        })
    },
    //输入框
    changeContent(e) {
        console.log(e)
        let question = e.currentTarget.dataset.question //第几题
        let content = `questions.evaluate.evaluate_questions[${question}].content`
        this.setData({
            [content]: e.detail.value
        })
        // mainService.debounce(() => {

        // }, 500)
    },
    _subForm() {
        if (flag) {
            let is_mustArr = this.data.questions.evaluate.evaluate_questions.filter(item => {
                return item.is_must == 1 && (item.sign == 0 || item.content == '')
            })
            if (is_mustArr.length != 0) {
                this.setData({
                    model: this.data.questions.evaluate.unanswered_img,
                    modelStatus: 3
                })
                return
            }
            let answers = []
            this.data.questions.evaluate.evaluate_questions.forEach(item => {
                if (item.type != 4) {
                    answers.push({ id: item.id, content: item.sign })
                } else {
                    answers.push({ id: item.id, content: item.content })
                }
            })
            AjaxService.sub({
                ev_id: this.data.ev_id,
                answers: answers,
                unionid:this.data.uid,
                openid:this.data.oid
            }).then(res => {
                console.log(res)
                let { errcode, data, errmsg} = res
                if (errcode == 0) {
                    this.setData({
                        model: this.data.questions.evaluate.answered_img,
                        jupPath: this.data.questions.evaluate.jump_url,
                        is_first_answer:true,
                        jump_type:this.data.questions.evaluate.jump_type
                    })
                } else {
                    wx.showToast({
                        title: errmsg,
                        icon: 'none',
                        duration: 1500,
                        mask: false,
                    });
                    // mainService.toast(errmsg)
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            wx.showToast({
                title: '请不要多次提交！',
                icon: 'none',
                duration: 1500,
                mask: false,
            });
            // mainService.toast()
        }
    },
    _openHandle() {
        if (this.data.modelStatus == 3) {
            this.setData({
                model: '',
                modelStatus:0
            })
        } else {
            if(this.data.is_first_answer){
                AjaxService.luck({
                    ev_id:this.data.ev_id,
                    unionid:this.data.uid,
                    openid:this.data.oid
                }).then(res =>{
                    console.log(res)
                }).catch(err =>{
                    console.log(err)
                })
            }
            if(this.data.jump_type == 2){
                wx.reLaunch({
                    url: `../webView/index?src=${this.data.jupPath}`
                });
                // mainService.link()
            }else{
                // mainService.link(`/${this.data.jupPath}`,2)
                wx.reLaunch({
                    url: `/${this.data.jupPath}`,
                });
            }

        }
    },
    openFloatUrl() {
        AjaxService.jump({
            ev_id:this.data.ev_id,
            unionid:this.data.uid,
            openid:this.data.oid
        }).then(res =>{
            console.log(res)
        }).catch(err =>{
            console.log(err)
        })
        wx.reLaunch({
            url: `/${this.data.questions.evaluate.page_float_url}`,
        });
        // mainService.link(`/${this.data.questions.evaluate.page_float_url}`,2)
    },
    getInfo(){
        return new Promise(resolve =>{
            let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
            let unionid = wx.getStorageSync('unionid')
            this.setData({
                oid:openid,
                uid:unionid
            },()=>{
                resolve()
            })
            // memberService.getOpenid(res => {
            //     this.setData({
            //         oid:res
            //     },()=>{
            //         memberService.getUnionid(res => {
            //             this.setData({
            //                 uid:res
            //             },()=>{
            //                 resolve()
            //             })
            //         })
            //     })
            // })
        })
    },
    onLoad(options) {
        // this.setNav()
        this.getInfo().then(res =>{
            this.setData({
                ev_id: options.ev_id,
                order_no: options.order_no,
                shop_no: options.shop_no,
            },()=>{
                this._init()
            })
        })
    },
})