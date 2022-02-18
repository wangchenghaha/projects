import Utils from '../../../../service/util'
Component({
    data: {
        showModal: false,
        type: 2, // 1 ：没有领奖资格 2 : 有领奖资格 3:活动完全结束
        rank_id: '',
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal(type, rank_id) {
            this.setData({
                type,
                rank_id: rank_id || '',
                showModal: true,
            })
        },
        close() {
            this.setData({
                showModal: false
            })
        },
        addressHandle() {
            Utils.throttle(() => {
                let obj = {
                    addCardType: 'address'
                }
                this.triggerEvent('address', obj)
            }, 500)()
        }
    }
})