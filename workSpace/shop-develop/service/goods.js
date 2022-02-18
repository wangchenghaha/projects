//商品业务模块
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE, SUCCESS_STATUS } from '../src/const.js'
let exCons = require('../utils/exCons');

const utils = require('../utils/utils.js');
const {cdn, brand} = require('../src/config.js')
// 获取商品列表
function getGoodsList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETGOODSLIST,
      data: data,
    }).then(res => {
      res.code === 0 ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

//添加点击量
function addClickRate(goodsCode) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.CLICKRATE,
      method: 'POST',
      data: {
        goodsCode: goodsCode
      }
    })
      .then((response) => {
        if (response.code === 0) {
          resolve(response.response.msg); //视图层需要的参数
        } else {
          reject(new Error(response.msg)); //视图层显示错误信息
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message)); //视图层显示错误信息
      });
  });
}

//获取商品详情
function getDetail(goodsCode) {
  let brandCur = {
    '1': 'ONLY',
    '2': 'JACKJONES',
    '3': 'VEROMODA',
    '4': 'SELECTED',
    '5': 'JLINDEBERG',
    '8': 'NAMEIT',
    'P': 'VEROMODA',
    'T': 'TRUU'
  }[String(goodsCode)[0]];
  let brand = getApp().config.brand;
  return new Promise((resolve, reject) => {
    request({
      header: {
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand: brandCur ? brandCur : getApp().config.brand
      },
      url: URL.GOODS_DETAIL,
      data: { goodsCode: goodsCode }
    })
      .then(response => {
        if (response.code == 0) {
          resolve(response.data);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });

  });
}

//获取H5线上商品分类集合
function getH5Categories() {
  return new Promise((resolve, reject) => {
    request({
      url: exCons.DEBUG ? `https://mini.bestseller.com.cn/classify/h5/SELECTED/h5_list.json` : URL.H5_CATEGORY,//测试地址
      method: `GET`,
      data: "",
    })
      .then(response => {
        if (response.status == 200 && !utils.isArrayEmpty(response.data)) {
          resolve(response.data);
        } else {
          reject(new Error('未查到分类'));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });
  });
}

/**
 * 获取普通分类商品列表
 */
function getNormalGoodsList(bean) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.NORMAL_GOODS_LIST,
      method: 'GET',
      data: bean
    })
      .then((response) => {
        if (response != null && response.code == 0 && response.data != null) {
          resolve(response);
        } else {
          reject(new Error('未查到商品'));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });
  });
}

//查询 H5 商品库存
function getNormalStock(goodsCode) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETSTOCKNEW,
      method: 'GET',
      data: {
        goodsCode: goodsCode
      }
    })
      .then((response) => {
        if (response != null && response.code == 0 && response.data != null) {
          resolve(response.data);
        } else {
          reject(new Error('未查到库存'));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });
  });

}

/**
 * 查询具体门店某个分类下的商品列表
 */
function getNearbyShopGoodsList(postBean) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.NEARBY_GOODS_LIST,//正式地址
      method: 'GET',
      data: postBean
    })
      .then((response) => {
        if (response != null && response.code == 0 && response.data != null && response.data.list != null) {
          let res = {
            code: 0,
            data: response.data.list,//正式代码 ==================
            currentpage: response.data.pageNum,
            totalCounts: response.data.total,
            totalPage: response.data.pages,
          }
          resolve(res);
        } else {
          reject(new Error('未查到商品'));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });
  });
}

/**
 * 获取换发商品价格信息(需要换货单号)
 */
function calcPrices(priceBean) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.EXC_ORDER_PRICE_CALC,
      method: 'POST',
      data: priceBean
    })
      .then((response) => {
        if (response != null && response.code == 0 && response.data != null) {
          resolve(response.data);
        } else {
          reject(new Error('计算价格失败'));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });

  });

}
/**
 * 获取换发商品价格信息(不需要换货单号)
 */
function calcPrices2(priceBean2) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.EXC_ORDER_PRICE_CALC_2,
      method: 'POST',
      data: priceBean2
    })
      .then((response) => {
        if (response != null && response.code == 0 && response.data != null) {
          resolve(response.data);
        } else {
          reject(new Error('计算价格失败'));
        }
      })
      .catch(e => {
        reject(new Error(e.msg || e.message));
      });

  });
}
function getStockNew(_goodsCode, brand) {
  return new Promise((resolve, reject) => {
    request({
      header: {
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand: brand ? brand : getApp().config.brand
      },
      url: URL.GETSTOCKNEW,
      data: {
        goodsCode: _goodsCode
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function getGoodsDetail(sku, brand) {
  sku = sku.substr(0,9)
  return new Promise((resolve, reject) => {
    request({
      header: {
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand: brand ? brand : getApp().config.brand
      },
      url: URL.GOODS_DETAIL,
      data: { goodsCode: sku }
    }).then(res => {
      const goodsInfo = res.data;
      if (res.code === SUCCESS_STATUS) {
        getStockNew(sku, brand).then(resStock => {
          if (resStock) {
            if (goodsInfo.color && goodsInfo.color.length) {
              goodsInfo.color.forEach(item => {
                item.sellStock = 0;
                if (item.sizes && item.sizes.length) {
                  item.sizes.forEach(sizeItem => {
                    // 有可能不反回SKU
                    sizeItem.sellStock = resStock[sizeItem.sku] || 0;
                    item.sellStock += resStock[sizeItem.sku] || 0;
                  })
                }
              })
            }
          }
          resolve(goodsInfo)
        })
      } else {
        reject(new Error(res.msg))
      }

      // res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function getDetailPage(sku) {
  let brand = utils.getBrandBySku(sku);
  return new Promise((resolve, reject) => {
    request({
      url: `${cdn}/goodsImagePC/${brand}/${sku}/html/description_mini.html`
    }).then(res => {
      let bodyContent = res
      if (res && typeof res === 'string' && !res.includes('Not Found')) {
        // 柴 要求不展示竖图
        const reg_body = /<body[^>]*>([\s\S]*)<\/body>/;
        let regAnnotation = /<!--(.|[\r\n])*?-->/g; // 去掉注释
      let regScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi; // 去掉script标签
      let regBodyTag = /<body\b[^<]*(?:(?!>))*/gi; // 去掉body标签
      let regSpace = />\s*</g; // 去掉标签之间的空格
      let regImg = /(<(img|br|hr).*?)((?:>|\/>))/g // 闭合img标签; 
        bodyContent = reg_body.exec(res)[1].replace(regAnnotation, '')
        .replace(regScript, '')
        .replace(regBodyTag, '')
        .replace(regImg, '$1/>')
        .replace(regSpace, '><');;
        bodyContent = `<div style="zoom: 0.5">${bodyContent}</div>`;
        resolve(bodyContent)
      }
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function getStock(goodsCode) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GETSTOCK}?goodsCode=${goodsCode}`
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}



function getRecommendCategory() {
  return new Promise((resolve, reject) => {
    request({
      //https://cdn.bestseller.com.cn/assets/pc/SELECTED/nav.json
      url: `${cdn}/assets/pc/${brand}/nav.json`
    }).then(res => {
      if (res.code == 0 && res.status == 0 && !utils.isArrayEmpty(res.data)) {
        let data = res.data;
        if (data.length > 1 && !utils.isArrayEmpty(data[1].list)) {
          let rcList = data[1].list.filter(item => {
            return item.navigationName
          });
          // resolve(data[1].list);
          resolve(rcList);
        } else {
          reject(new Error("暂无分类"));
        }
      }
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 查询ACC商品
function queryAccGoods(skuArr) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.QUERY_ACC_GOODS,
      data: {
        skus: skuArr
      },
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 是否可以拼团
function queryIsPintuan(gsColorCode) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GET_PINTUAN_DETAIL}?gsColorCode=${gsColorCode}`,
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 查询DMP推荐商品
function dmpRecommendGoods(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.DMP_RECOMMEND_GOODS,
      data
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
//查询DMP推荐商品New999
function dmpRecommendGoodsNew(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.DMP_RECOMMEND_GOODS_NEW,
      data
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 查询热销商品
function retailRecGoods(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.RETAILREC,
      data
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
function retailRecNew(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.RETAIL_REC,
      data
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}


// 获取商品活动图片
function getActivityPic(_goodColorCode) {
  return new Promise((resolve, reject) => {
    request({
      header: {
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand: getApp().config.brand //测试环境用到
      },
      url: URL.GETACTIVITYPIC,
      data: {
        goodsColorCode: _goodColorCode
      },
    }).then(res => {
      res && res.data ? resolve(res.data) : reject(res.msg)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function preSellGoodsDetail(_goodCode) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.PRESELLGOODSDETAIL,
      data: {
        goodsCode: _goodCode
      },

    }).then(res => {
      res && res.data ? resolve(res.data) : reject(res)
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })

}
// 搜索关键词
function searchKeyWord(goodsCode) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SEARCH_KEY_WORD,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 联想词推荐
 * @param prefix
 * @returns {Promise<unknown>}
 */
function searchSuggest(prefix) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GOODS_SUGGEST}?prefix=${prefix}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 获取礼包状态及库存
function getLuckbagStock(sku) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETLUCKBAGSTOCK,
      data: {
        goodsSku: sku
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function getLuckBagJson(_url) {
  return new Promise((resolve, reject) => {
    request({ url: _url}).then(res => {
      res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
    }).catch((e) => { reject(new Error(e.msg)) })
  })
}

/**
 * 通过12位SKU查询商品
 * @param _url
 * @returns {Promise<unknown>}
 */
function goodsColorList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODS_COLOR_LIST,
      data,
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch((e) => { reject(new Error(e.msg)) })
  })
}

export {
  getH5Categories,
  getNormalGoodsList,
  getNormalStock,
  getNearbyShopGoodsList,
  getDetail,
  calcPrices,
  calcPrices2,
  addClickRate,
  getGoodsDetail,
  getStock,
  getGoodsList,
  getRecommendCategory,
  queryAccGoods,
  queryIsPintuan,
  getDetailPage,
  dmpRecommendGoods,
  dmpRecommendGoodsNew,
  getActivityPic,
  preSellGoodsDetail,
  searchKeyWord,
  getLuckBagJson,
  retailRecGoods,
  getLuckbagStock,
  getStockNew,
  retailRecNew,
  searchSuggest,
  goodsColorList
}
