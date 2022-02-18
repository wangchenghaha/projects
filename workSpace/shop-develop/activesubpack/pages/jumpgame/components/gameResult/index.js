import Utils from '../../../../service/util'
import Fetch from '../../../../service/fetch'
import Urls from '../../../../service/url'
Component({
    data: {
        showModal: false,
        type: 1, // 1 通关成功 2 : 第一次失败 3：第二次失败
        point: ''
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal(type, point) {
            console.log('point',point)
            this.setData({
                type,
                point,
                showModal: true
            })
        },
        close() {
            this.setData({
                showModal: false
            })
        },
        luck() {
            Utils.throttle(() => {
                Fetch({ url: Urls.cat_luck, method: 'post' }).then((res) => {
                    if (res.errcode == 0) {
                        this.close()
                        this.triggerEvent('lucksuc', res.data)
                    }
                })
            }, 1000)()
        }
    }
})