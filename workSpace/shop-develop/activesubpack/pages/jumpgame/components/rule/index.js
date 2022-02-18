Component({
    data: {
        ranklist: [],
        showModal: false
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal() {
            this.setData({
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