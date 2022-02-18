const CDN = `https://tc.woaap.com/lingzhi/princess`

export default {
    cdnUrl: CDN,
    debug: false,
    proxy: {
        brand: 3,
        origin: 'https://bestseller-wechat.woaap.com',
        // config_name: 'CRAYON_SHIN_CHAN_1',
    },
    local: {
        // config_name: 'CRAYON_SHIN_CHAN_1',
        brand: 2,
        origin: 'https://bestseller-wechat-test.woaap.com'
    }
}