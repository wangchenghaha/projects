import apiModel from '../../../service/url'
import mainService from '../../../service/fetch.js'
class AjaxService {
  init(params) {
    return new Promise((resolve,reject)=>{
      mainService({
        url: apiModel.qs_init,
        data:params,
        method: 'GET',
        header: 1,
        loadingType: 1,
      }).then(res=>{
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
    // return mainService.request({
    //   url: apiModel.qs_init,
    //   params,
    //   method: 'GET',
    //   header: 1,
    //   loadingType: 1,
    // });
  }
  sub(params) {
    return new Promise((resolve,reject)=>{
      mainService({
        url: apiModel.qs_sub,
        data:params,
        method: 'POST',
        header: 1,
        loadingType: 1,
      }).then(res=>{
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  }
  luck(params) {
    return new Promise((resolve,reject)=>{
      mainService({
        url: apiModel.qs_luck,
        data:params,
        method: 'POST',
        header: 1,
        loadingType: 1,
      }).then(res=>{
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  }
  jump(params) {
    return new Promise((resolve,reject)=>{
      mainService({
        url: apiModel.qs_jump,
        data:params,
        method: 'POST',
        header: 1,
        loadingType: 1,
      }).then(res=>{
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  }
}
export default new AjaxService()