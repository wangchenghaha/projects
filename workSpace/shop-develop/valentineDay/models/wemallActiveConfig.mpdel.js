/**
 * 项目配置表
 *
 *
 * 属性说明：
 * @param {string} ENV 环境变量 TEST(开发测试) / UAT(客户测试) / PROD(正式)
 * @param {string} miniAppid 小程序appid
 * @param {string} brand 品牌appid
 * @param {string} brandName 品牌名称
 * @param {string} url 接口
 */


const miniAppid = wx.getAccountInfoSync().miniProgram.appId; // 小程序appid
let config = null;

switch (miniAppid) {
  case 'wx7f1b0d611e93dea4':
    config = {
      ENV: 'PROD',
      miniAppid,
      brand: 2,
      url: 'https://bestseller-wechat.woaap.com',
      brandName: 'JACKJONES',
    }
    break;

    case 'wxa3d9d2199eeded73':
      config = {
        ENV: 'PROD',
        miniAppid,
        brand: 1,
        url: 'https://bestseller-wechat.woaap.com',
        brandName: 'ONLY',
      }
      break;
      case 'wxeb2f4c579a95f94e':
      config = {
        ENV: 'PROD',
        miniAppid,
        brand: 4,
        url: 'https://bestseller-wechat.woaap.com',
        brandName: 'SELECTED',
      }
      break;
      case 'wx22a009dec5fd4b88':
        config = {
          ENV: 'PROD',
          miniAppid,
          brand: 6,
          url: 'https://bestseller-wechat.woaap.com',
          brandName: 'FOL',
        }
        break;
  case 'wxccfd1cc23fce2fe5':
    config = {
      ENV: 'TEST',
      miniAppid,
      brand: 3,
      url: 'https://bestseller-wechat.woaap.com',
      brandName: 'VEROMODA',
    }
    break;
    case 'wx3dbaf6c02a8df435':
      config = {
        ENV: 'TEST',
        miniAppid,
        brand: 5,
        url: 'https://bestseller-wechat-test.woaap.com',
        brandName: 'JLINDEBERG',
      }
      break;
    case 'wx62f300519c55c400':
      config = {
        ENV: 'PROD',
        miniAppid,
        brand: 5,
        url: 'https://bestseller-wechat.woaap.com',
        brandName: 'JLINDEBERG',
      }
      break;
}

export default config;
