import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

function registerVip(_openId, _unionId, _name, _phone, _sex, _birth, _email){
    return new Promise((resolve, reject) => {
        request({
            url: URL.REGISTERVIP,
            data:{
                "miniOpenId": _openId,
                "unionId": _unionId,
                "phone": _phone,
                "name": _name,
                "sex": _sex,
                "birthday": _birth,
                "email": _email,
            },
            method: 'POST'
        }).then((response) =>{
            if(response.code == 0){
                resolve(response)
            } else {
                reject(new Error(response.msg));
            }
        }).catch(e => {
            reject(new Error(response.msg));
        })
    })
}

export{
    registerVip,
}