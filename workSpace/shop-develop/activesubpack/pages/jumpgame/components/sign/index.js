import Utils from '../../../../service/util'
import Fetch from '../../../../service/fetch'
import Urls from '../../../../service/url'
Component({
    data: {
        showModal: false,
        list: [],
        can_receive_award: false,
        is_sign_award: false,
        record_id: 0,
        is_activity_end: 2,
        showbtn: false
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal(is_activity_end) {
            Fetch({ url: Urls.cat_signList }).then(res => {
                let showbtn = false
                    //可以领奖，没有领取，活动未结束才会出现按钮
                if (res.data.can_receive_award && !res.data.is_sign_award && !is_activity_end) {
                    showbtn = true
                }
                this.setData({
                    list: res.data.list || [],
                    showModal: true,
                    can_receive_award: res.data.can_receive_award ? true : false,
                    is_sign_award: res.data.is_sign_award ? true : false,
                    record_id: res.data.record_id,
                    is_activity_end,
                    showbtn
                })
            }).catch((err) => {

            })
        },
        sign(e) {
            Utils.throttle(() => {
                let data = e.target.dataset.info
                let index = e.target.dataset.index
                if (data && data.can_sign && !data.is_sign) {
                    Fetch({ url: Urls.cat_sign, method: 'post' }).then(res => {
                        wx.showToast({ icon: 'none', title: '签到成功' })
                        let showbtn = false
                            //可以领奖，没有领取，活动未结束才会出现按钮
                        if (res.data.can_receive_award && !res.data.is_sign_award && !this.data.is_activity_end) {
                            showbtn = true
                        }
                        let changeVal = `list[${index}].animationed`
                        let changeVal2 = `list[${index}].is_sign`
                        this.setData({
                            [changeVal]: true,
                            [changeVal2]: 1,
                            can_receive_award: res.data.can_receive_award ? true : false,
                            is_sign_award: res.data.is_sign_award ? true : false,
                            showbtn
                        })
                    })
                }
            }, 500)()
        },
        getCouponHandle() {
            Utils.throttle(() => {
                let obj = {
                    record_id: this.data.record_id,
                    addCardType: 'sign'
                }
                this.triggerEvent('luckSignAward', obj)
            }, 500)()
        },
        close() {
            this.setData({
                showModal: false
            })
        }
    }
})