import {KEYSTORAGE} from "../../src/const";
import {queryUser} from "../service/redBagCover";
import { wxShowToast } from '../../utils/wxMethods'
const queryGameUser =  async () => {
  const { openId } = wx.getStorageSync(KEYSTORAGE.wxInfo);
  if(openId){
    return new Promise((resolve, reject) => {
      queryUser(openId).then(res => {
        res ? resolve(res) : createUser();
      });
    })
  }
}

const createGameUser = async () => {
  const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
  if(!crmInfo){
    return
  }
  const { joindate, memberno, phone} = crmInfo
  const { nickName, avatarUrl, openId } = wx.getStorageSync(KEYSTORAGE.wxInfo);
  const param = {
    crmRegTime: joindate,
    crmid: memberno,
    facePic: avatarUrl,
    openid: openId,
    nickName,
    phone
  }
  return new Promise((resolve, reject) => {
    createUser(param).then(res => {
      resolve(res)
    }).catch(err => wxShowToast(err.message));
  })

}

export {
  queryGameUser,
  createGameUser,
}
