import Utils from '../../common/utils/index'
import config from '../../config/index'
import Poster from '../../components/qrcode/poster/poster'
import Pallte from './palatte'
import { KEYSTORAGE } from '../../../src/const'
let innerAudioContext = wx.createInnerAudioContext()
Page({
    data: {
        frame: [],
        isBigPhone: Utils.judgeBigScreen(),
        posterConfig: {},
        posterCatch: '',
        images: {
            view: {
                view1_2: `${config.cdnUrl}/view1-2.png`,
                view1_3: `${config.cdnUrl}/view1-3.png`,
                view1_4: `${config.cdnUrl}/view1-4.png`,
                view2_4: `${config.cdnUrl}/view2-4.png`,
                view2_3: `${config.cdnUrl}/view2-3.png`,
                view3_4: `${config.cdnUrl}/view3-4.png`,
            },
            poster: {
                poster1_2: `${config.cdnUrl}/poster1-2.png`,
                poster1_3: `${config.cdnUrl}/poster1-3.png`,
                poster1_4: `${config.cdnUrl}/poster1-4.png`,
                poster2_4: `${config.cdnUrl}/poster2-4.png`,
                poster2_3: `${config.cdnUrl}/poster2-3.png`,
                poster3_4: `${config.cdnUrl}/poster3-4.png`,
            },
            qrcode: {
                GWBR: `${config.cdnUrl}/qrcode/GWBR.png`,
                LPYQ: `${config.cdnUrl}/qrcode/LPYQ.png`,
                WEIB: `${config.cdnUrl}/qrcode/WEIB.png`,
                WXGZ: `${config.cdnUrl}/qrcode/WXGZ.png`,
                XHS1: `${config.cdnUrl}/qrcode/XHS1.png`,
                XHS2: `${config.cdnUrl}/qrcode/XHS2.png`,
                XXMD: `${config.cdnUrl}/qrcode/XXMD.png`,
                ZRLL: `${config.cdnUrl}/qrcode/ZRLL.png`,
                DPYQ: `${config.cdnUrl}/qrcode/DPYQ.png`,
            }
        },
        preview: '',
        poster: '',
        qrcode: '',
        authorize: true,
        showImage: false,
        showBeat: false
    },
    onLoad: function (options) {
        // wx.hideShareMenu()
        this._home()
    },
    // 生成海报
    createPoster() {
        this.setData({
            posterConfig: new Pallte().palatte(this.data.qrcode, this.data.poster, wx.getStorageSync(KEYSTORAGE.wxInfo).nickName),
        }, () => {
            Poster.create(true)
        })
    },
    // 卡戳
    addBeat() {
        this.setData({
            showBeat: true
        }, () => {
            innerAudioContext.play();
        })
    },
    // 海报下载部分
    onPosterSuccess(e) {
        const { detail } = e;
        this.setData({
            posterCatch: detail
        }, () => {
            this.addBeat()
        })
    },
    onPosterFail(err) {
        console.error(err);
    },
    showModal() {
        this.setData({
            showImage: true
        })
    },
    hideModal() {
        this.setData({
            showImage: false
        })
    },
    stop() {
        return false
    },
    goToLast() {
        wx.redirectTo({
            url: '/crayongame/pages/last/index'
        })
    },
    // 获取首页数据
    _home() {

        let frame = wx.getStorageSync('frameBox')
        innerAudioContext.src = `${config.cdnUrl}/gaizhang.mp3`;
        innerAudioContext.loop = false;
        const BC = wx.getStorageSync('crayonOtions').big_channel
        this.setData({
            frame,
            preview: this.data.images.view['view' + frame[0] + '_' + frame[1]],
            poster: this.data.images.poster['poster' + frame[0] + '_' + frame[1]],
            qrcode: this.data.images.qrcode[BC]
        }, () => {
            this.createPoster()
        })
    },
    onShareAppMessage: function(){
        return Utils.share()
    },
})