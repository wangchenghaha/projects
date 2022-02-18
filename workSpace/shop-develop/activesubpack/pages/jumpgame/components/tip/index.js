Component({
    data: {
        showModal: false,
        type: 1 // 1 ：没有机会 2 : 还有次分享机会
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal(type) {
            this.setData({
                type,
                showModal: true
            })
        },
        close() {
            this.setData({
                showModal: false
            })
        }
    }
})