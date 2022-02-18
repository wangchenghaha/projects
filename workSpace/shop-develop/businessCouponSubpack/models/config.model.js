import Main from '../../config/main'
const configObj = {
    test: {
        apiUrl: 'https://bestseller-wechat-test.woaap.com',
    },
    prod: {
        apiUrl: 'https://bestseller-wechat.woaap.com',
    }
}
export default Main.DEV ? configObj.test : configObj.prod;