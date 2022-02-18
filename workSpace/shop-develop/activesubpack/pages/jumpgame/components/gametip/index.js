import Utils from '../../../../service/util'
Component({
    data: {
        showModal: false,
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal() {
            this.setData({
                showModal: true,
            })
        },
        close() {
            this.setData({
                showModal: false
            })
            this.triggerEvent('paly')
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