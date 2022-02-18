let _lastTime = null;
export default {
    isBigPhone: () => {
        let { statusBarHeight, screenHeight, screenWidth } = wx.getSystemInfoSync()
        if ((screenHeight - statusBarHeight) / screenWidth >= 1.75) {
            return true
        }
        return false
    },
    throttle: function(fn, gapTime) {
        if (gapTime == null || gapTime == undefined) {
            gapTime = 1500;
        }
        return function() {
            let ctx = this
            var args = arguments
            const _nowTime = +new Date();
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                fn()
                _lastTime = _nowTime;
            }
        };
    },
    getRouteObjByStrOfSunQr(str) {
        str = decodeURIComponent(str);
        let arr = str.split('&');
        let obj = {};
        arr.forEach((item, key) => {
            let arr = item.split('=');
            obj[arr[0]] = arr[1];
        })
        return obj;
    },
    memberRegistration(url) {
        if (url) {
            let a = url.split("#")[0];
            let b = a.split("?")[1].split("&");
            let result = {};
            for (let i = 0; i < b.length; i++) {
                let c = b[i].split("=");
                result[c[0]] = c[1];
            }
            let data = {
                biz: decodeURIComponent(result.biz),
                encrypt_card_id: decodeURIComponent(result.encrypt_card_id),
                outer_str: decodeURIComponent(result.outer_str)
            }
            wx.showLoading({
                title: '正在注册',
                mask: true
            });
            wx.setStorage({
                    key: 'isLoginNew',
                    data: true,
                    success: function(res) {
                        wx.navigateToMiniProgram({
                            appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
                            extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
                            success: function(res) {
                                console.log('去注册')
                            },
                            fail: function(res) {
                                console.log(res, "navigateToMiniProgram-fail");
                                wx.hideLoading();
                            }
                        })
                    },
                    fail: function() {
                        // fail
                    }
                }) //设置参数 
        }
    },
}