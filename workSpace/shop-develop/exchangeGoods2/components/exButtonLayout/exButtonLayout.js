import { closeExOrder } from '../../ex'
const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        exchangeCode: { type: String, value: "" },
        flagShowService: { type: Boolean, value: true },
        flagShowCancel: { type: Boolean, value: true },
        flagShowCommit: { type: Boolean, value: false },
    },

    data: {
    },

    ready: function () {
        
        // let { flagShowService, flagShowCancel, flagShowCommit } = this.properties
        // this.setData({
        //     flagShowService: flagShowService,
        //     flagShowCancel: flagShowCancel,
        //     flagShowCommit: flagShowCommit,
        // })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onButtonsClick: function (ev) {
            console.log(ev)
            switch (ev.target.dataset.id) {
                case "0":
                    wx.showToast({
                        title: '联系客服',
                    })
                    break
                case "1":
                    wx.showModal({
                        title: '提示',
                        content: '您将撤销本次申请，如果问题未解决，您还可以再次发起。确定继续吗？',
                        success: (result) => {
                            if (result.confirm) {
                                closeExOrder(this.properties.exchangeCode)
                                    .then(res => {
                                        wx.showToast({
                                            title: res.msg
                                        })
                                        wx.redirectTo({
                                            url: `/exchangeGoods2/orderStatusNew/orderStatusNew?exchangeCode=${this.exchangeCode}`
                                        })
                                    })
                                    .catch(e => {
                                        wx.showToast({
                                            title: e.message,
                                        })
                                        console.log(e)
                                    })
                            }
                        }
                    })
                    break
                case "2":
                    this.triggerEvent('onCommitClick', {})
                    break
            }
        },
    }
})