import { RequestLogger } from './request.log.js';
import { EVENTS } from '../src/const.js';
import events from '../src/events.js';
const { domain, brand } = require('../src/config.js');

/**
 * 网络请求工具（网络层）
 * 注意事项：网络层只处理网络请求，不处理任何业务逻辑和界面操作。
 * @param {{url: string}} config
 */
const request = (config) => {

  // 日志输出
  const logger = new RequestLogger();

  // 默认配置
  let defaultConfig = {
    method: 'GET',
    header: {
      'content-type': 'application/json',
      token: wx.getStorageSync('token') || '', // 访问凭证
      brand, // 品牌
    }
  }

  // 合并默认配置项和用户传来的配置项
  let realConfig = Object.assign(defaultConfig, config);
  logger.begin(realConfig); // 请求信息存入日志缓冲区

  return new Promise((resolve, reject) => {

    // 配置默认主机地址（URL里无主机地址时拼接上后台接口主机地址）
    if (realConfig.url.indexOf('http') === -1) {
      const path = realConfig.url;
      const hasSeparator = path.indexOf('/') === 0;
      realConfig.url = `${domain}${hasSeparator ? '' : '/'}${path}`
    }
    // 删除undefined
    if(realConfig.data && realConfig.data.constructor === Object && Object.keys(realConfig.data).length){
      for(let key in realConfig.data){
        if(realConfig.data[key] === undefined){
          realConfig.data[key] = ''
        }
      }
    }

    wx.request({
      url: realConfig.url, //接口地址
      method: realConfig.method.toUpperCase(), //请求类型
      data: realConfig.data, //请求体
      header: realConfig.header, //请求头

      // 网络请求成功
      success: (res) => {
        let {
          data, // 数据
          statusCode // http 状态码
        } = res;
        logger.end(res); // 响应信息存入日志缓冲区
        if (statusCode === 200) {
          resolve(data);
        } else if (statusCode === 401) {
          wx.hideLoading();
          events.post(res, EVENTS.EVENT_401); //登录失效
        } else {
          // 处理400->500之间的错误
          resolve({ code: 1, msg: `${data}(${statusCode})` });
        }
      },

      // 网络请求失败, 如: HTTP客户端配置出错
      fail: (e) => {
        logger.error(e); // 打印错误
        resolve({ code: 1, msg: e.errMsg || e.message });
      },

      // 网络请求结束
      complete: () => {
        logger.print(); // 输出缓冲区里的日志
      }
    });
  });
}

export {
  request
}