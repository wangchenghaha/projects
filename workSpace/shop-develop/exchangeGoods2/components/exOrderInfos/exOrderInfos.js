import { URL_CDN } from '../../../src/const.js'
const app = getApp();
const brand = app.config.brand;

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        exOrderBean: { type: Object, value: {} },
    },

    /**
     * 组件的初始数据
     */
    data: {
    },

    ready: function () {
        setTimeout(() => {
            let exBean = this.properties.exOrderBean
            if (exBean && exBean.evidencePics) {
                let picList = exBean.evidencePics.split(",")
                picList.forEach(element => {
                    element = URL_CDN + element
                });
                this.setData({ picList })
            }
        }, 1500)
    },

    /**
     * 组件的方法列表
     */
    methods: {

        onClick: function (e) {
            let _colorCode = e.currentTarget.dataset.code;
            wx.navigateTo({
                url: "../../pages/content/content?colorCode=" + _colorCode
            })
        }
    }
})