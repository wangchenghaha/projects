//快递业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

function getExpressInfo(dingdan_code){
    return new Promise((resolve,reject)=>{
        request({
            url: URL.GETEXPRESSINFO,
            data:{
                expressNumber: dingdan_code
            }
        }).then(res=>{
            res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
        }).catch(e=>{
            reject(new Error(e.msg || e.message))
        })
    })
}

export {
    getExpressInfo,
}