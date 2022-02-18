import Utils from '../../../../service/util'
import Fetch from '../../../../service/fetch'
import Urls from '../../../../service/url'
Component({
    data: {
        showModal: false,
        couponList: [],
        integral: '',
        rank_key: ''
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal() {
            Fetch({ url: Urls.cat_myAwards }).then((res) => {
                if (res.errcode == 0) {
                    this.setData({
                        couponList: res.data.list || [],
                        integral: res.data.integral || 0,
                        rank_key: res.data.rank_key || '',
                        showModal: true,
                    })
                }
            })
        },
        close() {
            this.setData({
                showModal: false
            })
        },
        couponHandle(e) {
            Utils.throttle(() => {
                let couponinfo = e.target.dataset.couponinfo
                if (couponinfo.is_add_card) {
                    this.triggerEvent('openCard', { cardInfo: couponinfo, addCardType: 'couponlist' })
                } else {
                    let obj = {
                        cardInfo: couponinfo,
                        addCardType: 'couponlist'
                    }
                    this.triggerEvent('getCoupon', obj)
                }
            }, 500)()
        }
    }
})