import Utils from '../../../../service/util'
Component({
    data: {
        showModal: false,
        prizeInfo: {

        },
    },
    properties: {

    },
    attached() {},
    methods: {
        showModal(prizeInfo = {}, ) {
            this.setData({
                prizeInfo,
                showModal: true,
            })
        },
        close() {
            this.setData({
                showModal: false
            })
        },
        getCouponHandle() {
            Utils.throttle(() => {
                let obj = {
                    cardInfo: this.data.prizeInfo,
                    addCardType: 'coupon'
                }
                this.triggerEvent('getCoupon', obj)
            }, 500)()
        }
    }
})