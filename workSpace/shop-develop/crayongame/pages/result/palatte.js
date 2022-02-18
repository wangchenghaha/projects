export default class Palatte {
    palatte(qrcode='', bg='', name='') {
        return {
            width: 693,
            height: 1080,
            backgroundColor: 'transparent',
            debug: false,
            pixelRatio: wx.getSystemInfoSync().pixelRatio,
            images: [{
                url: bg||'',
                width: 693,
                height: 1080,
                x: 0,
                y: 0
            }, {
                url: qrcode,
                width: 82,
                height: 82,
                x: 58,
                y: 922,
            }],
            blocks: [{
                x: 52,
                y: 916,
                width: 94,
                height: 94,
                backgroundColor: '#ffffff',
                borderRadius: 10
            }],
            texts: [{
                x: 64,
                y: 136,
                baseLine: 'middle',
                text: `${name} 的烦恼`,
                fontSize: 28,
                color: '#000',
                fontWeight: 'bold'
            }]
        }
    }
}   