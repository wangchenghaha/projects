import Utils from '../../../../service/util'
import Fetch from '../../../../service/fetch'
import Urls from '../../../../service/url'
Component({
    data: {
        ranklist: [],
        showModal: false,
        my_rank: {},
        rankInfo: {}
    },
    properties: {

    },
    attached() {

    },
    methods: {
        showModal() {
            let is_auth = wx.getStorageSync('is_auth')
            let data = {}
            if (is_auth != 1) {
                let wxinfo = wx.getStorageSync('userInfo')
                let unionid = wx.getStorageSync('unionid')
                if (wxinfo && unionid) {
                    data.nickname = wxinfo.nickName
                    data.avatar_url = wxinfo.avatarUrl
                    data.unionid = unionid
                } else {
                    wx.navigateTo({
                        url: '/pages/etoLogin/etoLogin'
                    })
                    return
                }
            }
            Fetch({ url: Urls.cat_rankList, data }).then(res => {
                wx.setStorageSync('is_auth', 1)
                let ranklist = res.data.rank_list || []
                this.setData({
                    rankInfo: res.data || {},
                    ranklist: ranklist.slice(0, 10),
                    my_rank: res.data.my_rank || {},
                    showModal: true
                })
            })
        },
        close() {
            this.setData({
                showModal: false
            })
        },
        addressHandle() {
            this.close()
            Utils.throttle(() => {
                let obj = {
                    addCardType: 'address'
                }
                this.triggerEvent('address', obj)
            }, 500)()
        }
    }
})