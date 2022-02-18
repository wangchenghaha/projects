import Utils from '../../../../service/util'
import Fetch from '../../../../service/fetch'
import Urls from '../../../../service/url'
Component({
    data: {
        showModal: false,
        province_city_district: [],
        province_city_district_text: '',
        formTip: {
            username: '姓名',
            phone: '手机号',
            province_city_district: '地址',
            address: '详细地址',
        }
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
        },
        formSubmit(e) {
            console.log(e)
            let _this = this
            Utils.throttle(() => {
                let obj = e.detail.value
                this.checkForm(obj).then(req => {
                    obj.province_city_district = obj.province_city_district.join(',')
                    Fetch({ url: Urls.cat_address, method: 'post', data: obj }).then(res => {
                        if (res.errcode == 0) {
                            wx.showToast({ icon: 'none', title: '提交成功' })
                            _this.close()
                        }
                    })
                })
            }, 1000)()
        },
        checkForm(obj) {
            let _this = this
            return new Promise((resovle, reject) => {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        console.log(key)
                        if (!obj[key]) {
                            wx.showToast({ icon: 'none', title: `请填写${_this.data.formTip[key]}` })
                            reject()
                            break
                        }
                        if (key == 'phone' && !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(obj[key]))) {
                            wx.showToast({ icon: 'none', title: `请填写正确的${_this.data.formTip[key]}` })
                            reject()
                            break
                        }
                    }
                }
                resovle()
            })
        },
        bindRegionChange: function(e) {
            this.setData({
                province_city_district: e.detail.value,
                province_city_district_text: e.detail.value.join('-')
            })
        }
    }
})