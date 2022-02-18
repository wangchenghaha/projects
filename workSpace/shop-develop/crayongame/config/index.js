const CDN = `https://tc.woaap.com/lingzhi/crayon/poster`
const awards = {
    local: [{
        name: '蜡笔小新盲盒',
        id: 1
    }, {
        name: 'Freya手提包',
        id: 3
    }, {
        name: '200-30优惠券',
        id: 4
    }, {
        name: '时尚墨镜',
        id: 2
    }, {
        name: '500-50优惠券',
        id: 5
    }, {
        name: '两件九折',
        id: 6
    }],
    proxy: [{
        name: '蜡笔小新盲盒',
        id: 1
    }, {
        name: 'Freya手提包',
        id: 3
    }, {
        name: '200-30优惠券',
        id: 4
    }, {
        name: '时尚墨镜',
        id: 2
    }, {
        name: '500-50优惠券',
        id: 5
    }, {
        name: '两件九折',
        id: 6
    }]
  }
  const awards2 = {
    local: [{
        name: '哆啦A梦立体拼图',
        id: 1
    }, {
        name: 'Freya手提包',
        id: 3
    }, {
        name: '200-30优惠券',
        id: 4
    }, {
        name: '时尚墨镜',
        id: 2
    }, {
        name: '500-50优惠券',
        id: 5
    }, {
        name: '一件88折',
        id: 6
    }],
    proxy: [{
        name: '哆啦A梦积木兑换券',
        id: 1
    }, {
        name: '一分钱兑换斜挎单肩包赠品券',
        id: 3
    }, {
        name: '200-30优惠券',
        id: 4
    }, {
        name: '一分钱兑换太阳镜赠品券',
        id: 2
    }, {
        name: '500-50优惠券',
        id: 5
    }, {
        name: '哆啦A梦整单8.8折活动券',
        id: 6
    }]
  }
export default {
    cdnUrl: CDN,
    cdnUrl2: 'https://tc.woaap.com/lingzhi/crayon/turntable',
    cdnUrl3: 'https://tc.woaap.com/lingzhi/doraemonMiniapp/img',
    debug: false,
    proxy: {
        brand: 1,
        origin: 'https://bestseller-wechat.woaap.com',
        config_name: 'CRAYON_SHIN_CHAN_1', // CRAYON_SHIN_CHAN_1
    },
    local: {
        config_name: 'CRAYON_SHIN_CHAN_1',
        brand: 2,
        origin: 'https://bestseller-wechat-test.woaap.com'
    },
    proxyDORA: {
        brand: 1,
        origin: 'https://bestseller-wechat.woaap.com',
        config_name: 'DORA_A_DREAM_1', 
    },
    localDORA: {
        config_name: 'DORA_A_DREAM_1',
        brand: 2,
        origin: 'https://bestseller-wechat-test.woaap.com'
    },
    awards,
    awards2,
}