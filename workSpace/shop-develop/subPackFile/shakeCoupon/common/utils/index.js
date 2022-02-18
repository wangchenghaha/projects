export default {
    isBigPhone: () => {
        let { statusBarHeight, screenHeight, screenWidth } = wx.getSystemInfoSync()
        if ((screenHeight - statusBarHeight) / screenWidth >= 1.75) {
            return true
        }
        return false
    },
    debounce: function (fn, time) {
        var timer = null
        return function () {
            var args = arguments
            var ctx = this
            clearTimeout(timer)
            timer = setTimeout(function () {
                fn.apply(ctx, args)
            }, time)
        }
    },
    // 获取链接参数
    GetQueryString: function (url, name) {
        console.log(url, name);
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const link = decodeURIComponent(url);
        const r = link.split('?')[1].match(reg);

        if (r != null) return unescape(r[2]);
        return null;
    },
}