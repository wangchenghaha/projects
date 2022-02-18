import {
    splitImg,
    numToWan,
    skuToImg
} from '../../utils/utils'
import {
    awardActivity
} from "../../service/order";
import {
    liveRoom,
    roomReplay
} from '../../service/livePlayer'
import {
    getFeedLive
} from '../server/album'
const app = getApp();
const {
    cdn,
    FEED_ID,
} = app.config;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        playBtnImg: splitImg('zbj_playBtn.png'),
        baokuanImg: splitImg('zbj_bk.png'),
        icon_live: splitImg('icon_live_1026.png', 'common'),
        icon_replay: splitImg('icon_replay_1026.png', 'common'),
        icon_unit: splitImg('icon_unit_1026.png', 'common'),
        // 滚动到顶部
        goTopShow: false,
        // 预约和直播中数据
        roomInfo: [],
        //直播预告存取数组
        roomNotice: [],
        //回放存储数组
        roomPlayCallback: [],
        //加载更多数据
        dataList: [],
        //上拉加载
        loadMore: false,
        //没有更多数据
        loadAll: false,
        isShow: true,
        //暂无直播时高度设置
        marginIncrease: '',
        //回放当前点击播放索引
        indexCurrent: null,
        //视频播放id
        PrevideoID: '',
        //视频号直播存储信息
        channelInfo: {},
    },

    // 时间戳转日期字符串
    timerToStr: function (time) {
        let date = new Date(time * 1000);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        let hours = date.getHours()
        let minus = date.getMinutes()
        hours = hours < 10 ? "0" + hours : hours;
        minus = minus < 10 ? "0" + minus : minus;
        let json = {
            year,
            month,
            day,
            hours,
            minus
        }
        return json
    },
    getLiveRoom() {
        wx.showLoading({
            title: '加载中……',
            mask: true
        });
        let that = this
        liveRoom().then(res => {
            wx.hideLoading();
            if (res && res.errcode === 0) {
                if (res.room_info && res.room_info.length) {
                    // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常; 
                    let roomInfo = that.data.roomInfo
                    let roomNotice = that.data.roomNotice
                    let roomPlayCallback = that.data.roomPlayCallback
                    roomInfo = res.room_info.filter(item => item.live_status === 101)
                    roomNotice = res.room_info.filter(item => item.live_status === 102)
                    roomPlayCallback = res.room_info.filter(item => item.live_status === 103)
                    let roomPlayCallbackNew = roomPlayCallback.slice(0, 3)
                    if (roomInfo.length === 0) {
                        this.setData({
                            marginIncrease: 100
                        })
                    } else {
                        this.setData({
                            marginIncrease: 0
                        })
                    }
                    //待直播处理代码
                    roomNotice.forEach(item => {
                        let json = that.timerToStr(item.start_time)
                        item.day = `${json.year}-${json.month}-${json.day}`
                        item.startHoursStr = `${json.hours}:${json.minus}`
                        let jsonEndTime = that.timerToStr(item.end_time)
                        item.endHoursStr = `${jsonEndTime.hours}:${jsonEndTime.minus}`
                    });
                    //回放处理代码
                    roomPlayCallbackNew.forEach(item => {
                        let json = that.timerToStr(item.start_time)
                        item.day = `${json.year}-${json.month}-${json.day}`
                        item.startHoursStr = `${json.hours}:${json.minus}`
                        let jsonEndTime = that.timerToStr(item.end_time)
                        item.endHoursStr = `${jsonEndTime.hours}:${jsonEndTime.minus}`
                        roomReplay(item.roomid).then(res => {
                            if (res && res.errcode === 0) {
                                if (res.live_replay && res.live_replay.length) {
                                    let liveReplay = null,
                                        liveRePlayCount = null;
                                    liveReplay = res.live_replay
                                    liveRePlayCount = res.count
                                    item.media = liveReplay
                                    item.count = liveRePlayCount
                                }
                            }
                            this.setData({
                                roomPlayCallbackNew
                            })
                        })
                    })
                    that.setData({
                        roomInfo,
                        roomNotice,
                    })
                }
            }
        }).catch(err => {
            console.log(err)
            wx.hideLoading();
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: `${getApp().config.brand}直播间`
        });
        this.getLiveRoom()
        this.awardActivity()
        this.getChannelsLiveInfo();
    },
    //轮播视频封面
    awardActivity: function () {
        let param = {
            orderType: 0,
            pageType: 1,
            pageAddress: 'livePlayer/liveNow/liveNow'
        };
        awardActivity(param).then(res => {
            if (res && res.length) {
                let {
                    serve
                } = this.data
                let serveArr = []
                for (let item of res) {
                    if (item.imgUrl) {
                        serve = {
                            videoUrl: `${cdn}` + item.imgUrl
                        }
                        serveArr.push(serve)
                        this.setData({
                            serveArr
                        })
                    }
                }
            }
        })
    },
    //待直播、回放点击货品跳转
    picJump: function (e) {
        let link = e.currentTarget.dataset.link
        let linkConfigure = link.split('&utm')[0]
        app.navigateTo(linkConfigure);
    },
    //直播间详情跳转
    liveDetails: function (e) {
        let id = e.currentTarget.dataset.roomid
        wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`
        })
    },
    //回放播放
    bindplay(e) {
        let vid = e.currentTarget.id;
        if (this.data.PrevideoID) {
            if (this.data.PrevideoID != vid) {
                wx.createVideoContext(this.data.PrevideoID).stop()
                wx.createVideoContext(vid).play()
                this.setData({
                    PrevideoID: vid,
                })
            }
        } else {
            this.setData({
                PrevideoID: vid,
            })
        }
    },
    //视频号直播获取信息
    getChannelsLiveInfo() {
        const _this = this;
        wx.getChannelsLiveInfo({
            finderUserName: FEED_ID,
            success(res) {
                _this.setData({
                    channelInfo: res
                });
            },
            fail(err) {
                //console.error(err)
            }
        })
    },
    //视频号直播跳转
    openChannelsLive() {
        const {
            feedId,
            nonceId
        } = this.data.channelInfo;
        wx.openChannelsLive({
            finderUserName: FEED_ID,
            feedId,
            nonceId
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            loadMore: false,
            loadAll: true
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})