import config from '../../config/index'

export default class Palatte {
    palatte(qrcode = '', award = -1, big = false) {
        let bg = `/poster-${award}${big ? '-b' : ''}.png`
        let obj = {
            width: 595,
            height: big ? 1045 : 884,
            backgroundColor: 'transparent',
            debug: false,
            pixelRatio: wx.getSystemInfoSync().pixelRatio,
            blocks: [{
                x: 0,
                y: 0,
                width: 595,
                height: big ? 1045 : 884,
                backgroundColor: '#ffffff',
                borderRadius: 30
            }],
            images: [{
                url: `${config.cdnUrl}${bg}`,
                width: 595,
                height: big ? 1045 : 884,
                x: 0,
                y: 0,
                zIndex: 1
            }, {
                url: qrcode,
                width: 92,
                height: 92,
                x: 466,
                y: big ? 813 : 656,
                zIndex: 2
            }
            ]
        }
        return obj
    }
}   