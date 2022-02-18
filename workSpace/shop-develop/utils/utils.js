
import { URL } from '../src/const';
import { cdn ,BUYERSHOW_USER_TEST } from '../config/main'
import {Decimal} from '../utils/decimal.js'
function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
};

//特殊字符转义
function escapeHtml(str) {
  str = str.replace(/&nbsp;/g, '\r');
  str = str.replace(/&mdash;/g, "—");
  str = str.replace(/&middot;/g, '·');
  str = str.replace(/&ldquo;/g, '"');
  str = str.replace(/&rdquo;/g, '"');
  return str;
}


//动画封装 -- content.js调用
function animateShow(obj) {
  //动画 - 显示
  obj.animation_bottom.bottom(0).step();
  obj.animation_oapcity.opacity(0.5).step();
  obj.setData({
    animationBottom: obj.animation_bottom.export(),
    animationOpacity: obj.animation_oapcity.export()
  });

};
function animateHide(obj) {
  //动画 - 隐藏
  obj.animation_bottom.bottom(-400).step();
  obj.animation_oapcity.opacity(0).step();
  obj.setData({
    animationBottom: obj.animation_bottom.export(),
    animationOpacity: obj.animation_oapcity.export()
  });
  setTimeout(function () {
    obj.setData({
      details_display: 'none'
    });
  }, 300);
};

function animShowRight(context, widthPX) {
  //动画 - 显示
  context.anim_right.right(widthPX).step();
  context.anim_opacity.opacity(0.5).step();
  context.setData({
    animRight: context.anim_right.export(),
    animOpacity: context.anim_opacity.export()
  });

};

function animHideRight(context, widthPX) {
  let offsetRight = 0 - Number(widthPX);
  context.anim_right.right(offsetRight).step();
  context.anim_opacity.opacity(0).step();
  context.setData({
    animRight: context.anim_right.export(),
    animOpacity: context.anim_opacity.export()
  });
  setTimeout(function () {
    context.setData({
      // flagCartDisplay: "none"
      flagShowCart: false,
    });
  }.bind(context), 300);
}



//根据数组里对象的key值进行排序
function objectArraySort(key) {
  return function (objectN, objectM) {
    var valueN = objectN[key]
    var valueM = objectM[key]
    if (valueN < valueM) return -1
    else if (valueN > valueM) return 1
    else return 0
  }
};

function deteleObject(obj){
  var uniques=[];
  var stringify={};
  for(var i=0;i<obj.length;i++){
      var keys = Object.keys(obj[i]);
      keys.sort(function(a,b){
          return(Number(a)-Number(b));
      });
      var str='';
      for(var j=0;j<keys.length;j++){
          str+=JSON.stringify(keys[j]);
          str+=JSON.stringify(obj[i][keys[j]]);
      }if(!stringify.hasOwnProperty(str)){
          uniques.push(obj[i]);
          stringify[str] = true;
      }
  }
  uniques = uniques;
  return uniques;
}


//变成 39.00 这种价格
function price(obj, str1, str2) {
  for (var i = 0; i < obj.length; i++) {
    if (str1) {
      obj[i][str1] = Number(obj[i][str1]).toFixed(2);
    };
    if (str2) {
      obj[i][str2] = Number(obj[i][str2]).toFixed(2);
    };
    obj[i].discount = chengfa(obj[i].discount, 10);
    // if (obj[i].gscMaincolPath){
    //   var src = obj[i].gscMaincolPath;
    //   var index = obj[i].gscMaincolPath.lastIndexOf("\/");
    //   var preSrc = src.substring(0, index);
    //   var nextSrc = src.substring(index);
    //   var newSrc = `${preSrc}/240400/${nextSrc}`;
    //   obj[i].gscMaincolPath = newSrc;
    // };


  };
  return obj;
};


//把时间戳变成时间格式
function getdate(num) {
  var now = new Date(num),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
};

function StringToMillisecond(timeStr){
  var timestamp = Date.parse(new Date(timeStr));
  var currentTime = Date.now();
  var gettime = parseInt(currentTime) -  parseInt(timestamp);
  var getHours = gettime/(1000*3600);
  return getHours;
};

//判断当前时间是否在有效期内  传入时间格式为  10/24/2017 15:23:59
function timeIsTrue(startTime, endTime) {
  var _start = changeTime1(startTime);
  var _end = changeTime1(endTime);
  var _now = new Date().getTime();
  if (_now >= _start && _now <= _end) {
    return true;
  };
};
function changeTime1(time) {
  var arr = time.split(' ');
  var date = arr[0].split('/');
  var time = arr[1].split(':');

  //var str = date[0] + ',' + (date[1]-1) + ',' + date[2] + ',' + time[0] + ',' + time[1] + ',' + time[2];
  var _y = parseInt(date[2]);
  var _m = parseInt(date[0]) - 1;
  var _d = parseInt(date[1]);
  var _s = parseInt(time[0]);
  var _f = parseInt(time[1]);
  var _miao = parseInt(time[2]);

  var str = new Date(_y, _m, _d, _s, _f, _miao).getTime();
  return str;
};


function changeTime(time) {
  var arr = time.split(' ');
  var date = arr[0].split('/');
  var time = arr[1].split(':');

  var str = date[2] + '-' + date[0] + '-' + date[1] + ' ' + time[0] + ':' + time[1] + ':' + time[2];
  return str;
};

function changeTimer(time) {
  var arr = time.split(' ');
  var date = arr[0].split('-');
  var time = arr[1].split(':');

  var str = date[0] + '/' + date[1] + '/' + date[2] + ' ' + time[0] + ':' + time[1] + ':' + time[2];
  return str;
};

//小数计算方法
// 返回2位小数
function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x*100)/100;
  return f;
}
//加法
function jiafa(arg1, arg2) {
  const a = new Decimal(arg1)
  const b = new Decimal(arg2)
  return new Decimal(a.add(b)).toNumber()
};

//减法
function jianfa(arg1, arg2) {
  const a = new Decimal(arg1)
  const b = new Decimal(arg2)
  return new Decimal(a.sub(b)).toNumber()
};


//乘法
function chengfa(arg1, arg2) {
  const a = new Decimal(arg1)
  const b = new Decimal(arg2)
  return new Decimal(a.mul(b)).toNumber()
};
function chuFa(arg1, arg2) {
  const a = new Decimal(arg1)
  const b = new Decimal(arg2)
  return new Decimal(a.div(b)).toNumber()
};

//把时间戳转成日期
function getLocalTime(nS) {
  var str = new Date(parseInt(nS) * 1000).toLocaleString().substr(0, 10);
  str = str.split('/').join('-');
  return str;
};

//数组判空
function isArrayEmpty(obj) {
  let hasOwnProperty = Object.prototype.hasOwnProperty;
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}
// 格式化时间戳
function formatDate(value, h) {
  let now = new Date(value * 1);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let seconds = now.getSeconds();
  month < 10 ? month = '0' + month : month;
  date < 10 ? date = '0' + date : date;
  hour < 10 ? hour = `0${hour}`: hour;
  minute < 10 ? minute = `0${minute}`: minute;
  seconds < 10 ? seconds = `0${seconds}`: seconds;
  let str = '';
  if(h){
    str = `${year}-${month}-${date} ${hour}:${minute}:${seconds}`
  }else{
    str = `${year}-${month}-${date}`
  }
  return str;
}
// 将对象转化为URL查询字符串
function objToQuery(obj, mark) {
  let a = '';
  for (let i in obj) {
    if(obj[i] !== undefined){
      a += `&${i}=${obj[i]}`
    }
  }
  let querySting = mark ? `&${a.substring(1)}` : `?${a.substring(1)}`;
  return a.length ? querySting : ''
}
/*
* search   查询参数，?code=123&shareBy=dslk
* name     要获取的参数   code
* */
function getQueryString(search, name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
// 将数组等份拆分
function translateArray(arr, num) {
  let a = [], i = 0;
  if (Array.isArray(arr)) {
    let size = arr.length;
    do {
      a.push(arr.splice(0, num));
      i++;
    } while (i < size / num);
    return a;
  } else {
    return a;
  }
}
function getBrandBySku(sku) {
  let indexContent = sku.slice(0, 1);
  let brand = "";
  switch(indexContent){
    case '1':
      brand = "ONLY";
      break;
    case '2':
      brand = "JACKJONES";
      break;
    case '3':
    case 'P':
      brand = "VEROMODA";
      break;
    case '4':
      brand = "SELECTED";
      break;
    case '5':
      brand = "JLINDEBERG";
      break;
    case '8':
      brand = "NAMEIT";
      break;
    case 'T':
      brand = "TRUU";
      break;
  }
  return brand;
}
//
/*
*
* @param{
* brand, 平平
* sku, 12位码
* size, 可不传
* suffix 后缀
* }
*
* */
function skuToImg(param){
  let relativePath = '';
  let {brand, sku, size, suffix} = param;
  brand = getBrandBySku(sku);
  sku = sku.substr(0,12);
  let nineCode = sku.substr(0,9);
  if(!suffix){
    brand === 'NAMEIT' ? suffix = 'p7' : suffix = 'p3';
  }
  if(size){
    relativePath = `/goodsImagePC/${brand}/${nineCode}/${sku}/${size}/${sku}_${suffix}.jpg`
  }else{
    relativePath = `/goodsImagePC/${brand}/${nineCode}/${sku}/${sku}_${suffix}.jpg`
  }
  return relativePath
}
function orderStatus(value){
  const orderStatus = {
    WaitingPay: '待付款',
    WaitingShipment: '待发货',
    WaitingReceive: '待收货',
    TransactionCancel: '已取消订单',
    TransactionClose: '交易关闭',
    RefundSuccess: '退款成功',
    ApplyRefunding: '退款申请中',
    ResuseRefund: '退款被拒',
    RefundClose: '退款关闭',
    WaitingRefund: '等待退款',
    REFUNDING: '退款中',
    RefundFail: '退款失败',
    RefundGoodsReceive: '退货入库',
    RefundGoodsClose: '退货关闭',
    WaitingRefundGoods:'待买家寄回商品',
    RefundGoodsing:'退款提取中',
    TransactionSuccess:'交易成功',
    AlreadyPay:'付尾款',
    // 换货状态
    CREATED:'已创建待审核',
    CHECK_VALID:'已审核待退货',
    CHECK_FAIL:'审核失败',
    CONFIRM_TYPE:'已确认换货类型待寄回或到店',
    STOCKING:'备货中待备货完成',
    STOCK_FAIL:'备货失败',
    STOCKED:'已备货待到店',
    BUYER_MAILED:'已寄回待入库',
    RECEIVED:'已入库',
    WAIT_SHIP:'已付款待新商品发出',
    SHIPPED:'新商品已发出待收货',
    CLOSED:'已关闭',
    COMPLETE:'换货完成'

  };
  return orderStatus[value] || '';
}
// 过滤字符串中的空格，换行、制表符
function filterStr(str){
  return str.replace(/ /g,'').replace(/\t/g,'').replace(/\n/g,'').replace(/\r\n/g,'').replace(/\u200b/g, '');
}

function convertToOrdinary(strRaw){
  return strRaw.replace('（',' ').replace('）',' ').replace('-','一');
}

//点击防抖
function throttle(gap=500) {
  let now = new Date();
  if (now - getApp().globalData.lastTimeMillis > gap) {
    getApp().globalData.lastTimeMillis = now;
    return true;
  } else {
    return false;
  }
}

function containsChinese(str) {
  if (/^[A-Za-z0-9]+$/.test(str)) return false;
  return true;
}
function judgeETOBrand(brand) {
  let curBrand = brand;
  if(curBrand === 'JACK & JONES'){
    curBrand = 'JACKJONES'
  }else if(curBrand === 'VERO MODA'){
    curBrand = 'VEROMODA'
  }else if(curBrand === 'BESTSELLER'){
    curBrand = 'FOL'
  }else if(curBrand === 'J.LINDEBERG'){
    curBrand = 'JLINDEBERG'
  }
  return curBrand;
}

function formatDuring(mssRaw) {
  let mss = mssRaw>=0?mssRaw:-mssRaw;
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((mss % (1000 * 60)) / 1000);
  return mssRaw>=0? "剩余"+days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 "
  :"已超时"+days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 "+"  换货单已关闭";
}
// 格式化CRM返回的时间
function formatCRMDate(date,sign){
  let newDate = '';
  date = date.substr(0,10);
  !sign ? sign = '-' : '';
  if(date.includes('/')){
    let dataArr = date.split('/');
    newDate = `${dataArr[2]}${sign}${dataArr[0]}${sign}${dataArr[1]}`;
  }else{
    newDate = date
  }
  return newDate
}
// 拼接CDN图片
function splitImg(imgName, brand){
  const cdn = getApp().config.cdn;
  let imgPath = '';
  if(brand){
    if(brand === 'common'){
      imgPath = `/assets/common/image/${imgName}`
    } else if(brand === 'littlePet'){
      imgPath = `/assets/common/${getApp().config.brand}/${brand}/${imgName}`
    }else{
      imgPath = `/assets/common/${brand}/image/${imgName}`
    }
  }else{
    imgPath = `/assets/common/${getApp().config.brand}/image/${imgName}`
  }
  return  `${cdn}${imgPath}`;
}


// 拼接CDN图片
function splitGameImg(imgName, fileName){
  const cdn = getApp().config.cdn;
  let imgPath = '';
  imgPath = `/assets/common/${getApp().config.brand}/${fileName}/${imgName}`
  return  `${cdn}${imgPath}`;
}


function calculatingInsuredPrice(rawTargetList,priceList){
  let cartListTemp = rawTargetList;
  let newTargetList = new Array();
  //循环保价后的列表，该列表长度必然大于等于carlist长度
  for (let i = 0; i < priceList.length; i++) {
      //每个保价的item，对应都要遍历一遍cartlist，找到和外层sku一致的内层条目，
      //如果 sku 相同，则判断两边的价格和数量
      for (let j = 0; j < cartListTemp.length; j++) {
          if (priceList[i].sku == cartListTemp[j].sku) {
              //1 只要sku相同，无论数量和价格如何，先复制保价后的价格，和数量到 newTargetList 中
              //priceList[i]放在后面的参数位置，因为要覆盖 cartlist 的属性，包括数量和价格
              newTargetList.push(Object.assign({}, cartListTemp[j], priceList[i]));

              //2 然后再判断数量
              if (cartListTemp[j].goodsCount > priceList[i].goodsCount) {
                  //cartList中的数量有盈余，就把 cartList 的该item的数量减去已经复制过的数量
                  cartListTemp[j].goodsCount = cartListTemp[j].goodsCount - priceList[i].goodsCount;
                  //到此，可以跳出内层循环
                  //cartListTemp 的该item还可以在下次循环中使用,因为数量没有减完
              } else {
                  //若数量一致，则说明该条目使用完毕，可以在 cartlistTemp 中删除该item
                  cartListTemp.splice(j, 1);
              }
              break;
          }
      }
  }
  return newTargetList;
}

function getThumbnailNormPath(colorList,sku12,pos){
  let pathSpu = sku12.substring(0,9);
  let url = URL.GOODS_THUMBNAIL + `${pathSpu}/${colorList[pos].colorCode}/240400/${colorList[pos].colorCode}_p${(++pos)}.jpg`;
  return url;
}

function filterPickupActTip(cityNow){
  let cityList = ['重庆','淄博','临沂','济宁','泰安','滨州','枣庄','菏泽','聊城','德州','石家庄','天津','北京'];
  let isActCity = cityList.some(city=>{ return cityNow.indexOf(city)>=0; });
  if(!isActCity){ return "" }
  let actStartDate = "2019/01/21 00:00:00";
  let actEndDate = "2019/02/20 00:00:00";
  let nowDate = new Date();
  try {if(Date.parse(nowDate) > Date.parse(actStartDate) && Date.parse(nowDate) < Date.parse(actEndDate)){
          return `您所在的区域部分门店可以[到店自提]\n进店提货完成享意外惊喜!`;
        }else{
          return `您所在的区域部分门店可以[到店自提]`
        }
  }catch(e){
    console.log(e);
  }
}
// 获取当前页面url
function getCurrentUrl(){
  let pages = getCurrentPages(); //获取加载的页面
  if(pages.length === 0){
    return 'pages/index/index'
  }
  let currentPage = pages[pages.length-1]; //获取当前页面的对象
  let curOptions = currentPage.options;
  let curPage = currentPage.route;
  for(let key in curOptions){
    // 删除value为空的
    if(!curOptions[key] || curOptions[key] === 'undefined' || curOptions[key] === 'null'){
      delete curOptions[key]
    }
  }
  const optionsArr = Object.keys(curOptions); // 判断是否空对象
  if(optionsArr.length){
    curPage += objToQuery(curOptions);
  }
  return curPage;
  // return `${currentPage.route}${objToQuery(currentPage.options)}` ; //当前页面url
}
// 获取url参数
function getQueryStringArgs(url){
  const questMark = '?', andMark = '&', equalMark = '=';
  let qs = '';
  if(url.includes(questMark)){
    qs = url.split(questMark)[1];
  }else{
    return false
  }
  let qsArr = qs.length ? qs.split(andMark) : '';
  let args = {}, qsItem = null, key = null, value = null;
  qsArr.forEach(item => {
    qsItem = item.split(equalMark);
    key = decodeURIComponent(qsItem[0]);
    value = decodeURIComponent(qsItem[1]);
    key ? args[key] = value : '';
  });
  return args
}
// 判断URL是否有http
function judgeUrl(url){
  let curUrl = url;
  if(curUrl && (typeof curUrl) === 'string'){
    (!curUrl.includes('http')) ? curUrl = `${cdn}${curUrl}` : '';
  }else{
    curUrl = ''
  }
  return curUrl
}
// 拼团 计算已拼件数
function yipinNumber(startTime){
  let currentTime = (new Date().getTime() - startTime) / (1000 * 60); //剩余多少分钟
  /*
   *  t=当前时间-活动开始时间
   *  pintuanCount 拼团数量
   *  if t<=100, pintuanCount=t/2
   *  else if t<500, pintuanCount=50+(t-100)/5
   *  else  pintuanCount=130+(t-500)/10
   *  单位为分钟
   */
  var number = 0
  if (currentTime <= 100){
    number = currentTime / 2
  }
  else if (currentTime < 500){
    number = 50 + (currentTime - 100) / 5
  }
  else{
    number = 130 + (currentTime - 500) / 10
  }
  number = Math.round(number)
  if (number >= 10000){
    number = (number / 10000).toFixed(1)
    let a = number.split('.')
    if (parseInt(a[1]) == 0){
      number = `${a[0]}万`
    }
    else{
      number = `${number}万`
    }
  }
  return number
}
function numToWan(num){
  var number = Math.round(parseInt(num))
  if (number >= 10000){
    number = (number / 10000).toFixed(1)
    number = `${number}万`
  }
  return number
}

function numToThousand(num){
  var number = Math.round(parseInt(num))
  if (number >= 1000){
    number = (number / 1000).toFixed(1)
    number = `${number}k`
  }
  return number
}


function isChinese(char) {
  if (/.*[\u4e00-\u9fa5]+.*/.test(char)) {
      return true;
  }
  return false;
}

/**
 *
 * @param stamp 时间戳
 * @param day 非必填
 * @returns {boolean|number} {已过期|天数}
 */
function dateIsOverDue(stamp, day){
  let curTime = Date.now();
  let differDay = Math.floor(Math.abs((curTime - stamp)) / (1000*60*60*24));
  if(!day){
    return differDay
  }
  return differDay >= day
}
// 防抖函数
function debounce(fn,time) {
  var timer = null
  return function () {
      var args = arguments
      var ctx = this
      clearTimeout(timer)
      timer = setTimeout(function (){
          fn.apply(ctx, args)
      },time)
  }
}
function getNineSku(sku){
  const minSkuLength = 9;
  let nineSku = null;
  if(sku && sku.length >= minSkuLength){
    nineSku = sku.substr(0, minSkuLength)
  }
  return nineSku
}

/*
* 格式化优惠券的时间，返回20190101
* */
function handleCouponDate(couponDate){
  const spaceMark = ' '; // 空格
  let spaceMarkIndex = couponDate.indexOf(spaceMark);
  let newStartDate = couponDate;
  if(spaceMarkIndex > -1){
    newStartDate = couponDate.slice(0, spaceMarkIndex);
  }
  const  newStartDateArr = newStartDate.split('/');
  newStartDateArr.forEach(item => item.length < 2 ? item = `0${item}` : '');
  const  yearItem = newStartDateArr.pop();
  newStartDateArr.unshift(yearItem);
  return newStartDateArr.join('/');
}

/**
 *
 * @param orderCode 订单号
 * @returns {number} 下单时间（时间戳）
 */
function getDateByOrder(orderCode){
  // F4202011251352403266
  // 2020 11 25 13:52
  const splitReg = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/g;
  const date = orderCode.substr(2,12);
  const dateStr = date.replace(splitReg, '$1/$2/$3 $4:$5');
  const newDate = new Date(dateStr);
  return newDate.getTime()
}


function timeFormat(param){//小于10的格式化函数
  return param < 10 ? '0' + param : param.toString();
}

function countDown(endTime){
  let currentTime = new Date().getTime();
  let timerObj = null;
  if (endTime - currentTime > 0){
    let time = (endTime - currentTime) / 1000;
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    // let hou = parseInt((time % (60 * 60 * 24)) / (60 * 60))
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    timerObj = {
     day,
     hou: timeFormat(hou),
     min: timeFormat(min),
     sec: timeFormat(sec)
    }
    }else{//活动已结束，全部设置为'00'
    timerObj = {
     day: '0',
     hou: '00',
     min: '00',
     sec: '00'
    }
  }
  return timerObj;
}

/**
 * 加密
 * @param plain
 * @param key Number
 * @returns {string}
 */
function do_encrypt(plain,key) {
	var ctext = "";
	// do the encoding
	for( var i = 0; i < plain.length; i ++ ) {
		var pcode = plain.charCodeAt( i );
		var ccode = pcode;
		if ( pcode >= 65 && pcode <= 90 ) {
			ccode = ( ( pcode - 65 ) + key * 1 ) % 26 + 65;
		}
		if ( pcode >= 97 && pcode <= 122 ) {
			ccode = ( ( pcode - 97 ) + key * 1 ) %26 + 97;
		}
		// console.log(pcode + "," + ccode);
		ctext += String.fromCharCode(ccode);
	}

	return ctext;
}

/**
 * 解密
 * @param ctext
 * @param key Number
 * @returns {string}
 */
function do_decrypt(ctext,key) {
	var plain = "";
	// do the encoding
	for( var i = 0; i < ctext.length; i ++ ) {
		var ccode = ctext.charCodeAt( i );
		var pcode = ccode;
		if ( ccode >= 65 && ccode <= 90 ) {
			pcode = ( ( ccode - 65 ) - key * 1 +26 ) % 26 + 65;
		}
		if ( ccode >= 97 && ccode <= 122 ) {
			pcode = ( ( ccode - 97 ) - key * 1 + 26) % 26 + 97;
		}
		// console.log(ccode + "," + pcode);
		plain += String.fromCharCode(pcode);
	}
	// console.log(-3 % 26);

	return plain;
}

// "yyyy-mm-dd hh:mm:ss 转化成 时间戳"
function timeStamp(_time){
  let dater = _time.substring(0, 11);
  let timer = _time.substring(11);
  let actionTime = (new Date(dater.replace(/-/g, '/') + timer ).getTime() / 1000).toFixed(0);
  return actionTime;
}

function formatPreTimer(startTime , endTime) {
  let curTimes = Date.parse(new Date());
  curTimes = curTimes  / 1000;
  let start = startTime;
  let startTimes = timeStamp(startTime);
  let endTimes = timeStamp(endTime);
  if(curTimes < startTimes){
    return start.substring(5, 7) + '月' + start.substring(8, 11) + "日   "  + start.substring(11) + '开始支付尾款'
  } else if(curTimes > startTimes && curTimes < endTimes){
    let times = (endTimes - curTimes) * 1000;
    let days = parseInt(times / (1000 * 60 * 60 * 24));
    let hours = parseInt((times % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((times % (1000 * 60 * 60)) / (1000 * 60));
    return  "还剩"+days + " 天 " + hours + " 小时 " + minutes + " 分钟结束"
  } else {
    return "活动已结束，交易关闭"
  }
}

/**
 * 数组对象排序
 * arr.sort(compareArr(key1, key2))
 * @param key1
 * @param key2 非必填
 * @returns {function(...[*]=)}
 */
function compareArr(key1, key2) {
  return function (obj1, obj2) {
    let value1 = obj1[key1];
    let value2 = obj2[key1];
    if(value1 !== value2){
      return value2 - value1;
    }else {
      return  obj1[key2] - obj2[key2];
    }
  }
}

function splitCouponImg(id, curBrand){
  const cdn = getApp().config.cdn;
  return `${cdn}/memberImage/${curBrand}/${id}.jpg`
}

/**
 * 格式化当前时间
 */
function formatCurTime() {
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() +1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') +' '+ [hour, minute, second].map(formatNumber).join(':')

}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n :'0'+ n
}

/**
 * 判断是否是JSON字符串
 * @param str
 * @returns {boolean}
 */
function isJSONStr(str){
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      return typeof obj == 'object' && obj;
    } catch (e) {
      return false;
    }
  }else{
    return false
  }
}
/**
 * 根据分辨率加载图片
 * @param {*} imgName 图片名
 * @param {*} savePath 保存路径
 */
const getImgUrlBySystem = (imgName, savePath) => {
  const { devicePixelRatio, model } = wx.getSystemInfoSync();
  // 不包含iPhone678plus
  if (devicePixelRatio >= 3 && !model.includes('Plus') && imgName.includes('@2x')) {
    imgName = imgName.replace('@2x', '@3x');
  }
  return splitImg(imgName, savePath)
}

function buyerShowImage(images, isT){
  let imgs =  images.split(',')
  for (let i = 0; i < imgs.length; i++) {
    imgs[i] = BUYERSHOW_USER_TEST + getApp().config.brand + imgs[i];
  }

  if(isT){
    for (let i = 0; i < imgs.length; i++) {
      let ims = [];
      ims = imgs[i].split('.')
      imgs[i] = imgs[i].substring(0, imgs[i].length - 4) + '-120x120' + imgs[i].substring(imgs[i].length - 4);
    }
  }
  return imgs;
}
function obj2css (obj, arr = []){
  if(obj && Object.keys(obj).length){
    let style="", attrArr = ['linkH5', 'linkMin', 'distanceTopHeight', 'text', ...arr]
    for(let key in obj){
      if(!attrArr.includes(key)){
        let value = obj[key];
        const keyName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        if(Number(value)){
          value += 'rpx';
        }
        style += `${keyName}: ${value}; `
      }
    }
    return style
  }
}

// 隐藏手机号
function hideStr(str, startLength, endLength) {
  if (str.length == 0 || str == undefined) {
    return "";
  }
  var length = str.length;
  return str.substring(0, startLength) + "****" + str.substring(endLength, length);
}

/**
 * 判断是否当天
 * @param timeStamp
 * @returns {boolean}
 */
function isToday(timeStamp){
  return new Date(timeStamp).toDateString() === new Date().toDateString()
}


//把方法导出 被外界使用
module.exports = {
  json2Form: json2Form,
  animateShow: animateShow,
  animateHide: animateHide,
  animShowRight:animShowRight,
  animHideRight: animHideRight,
  price: price,
  objectArraySort: objectArraySort,
  getdate: getdate,
  timeIsTrue: timeIsTrue,
  escapeHtml: escapeHtml,
  changeTime: changeTime,
  chengfa: chengfa,
  jiafa: jiafa,
  jianfa: jianfa,
  chuFa,
  getLocalTime: getLocalTime,
  isArrayEmpty: isArrayEmpty,
  throttle: throttle,
  objToQuery: objToQuery,
  getQueryString: getQueryString,
  translateArray:translateArray,
  formatDate:formatDate,
  skuToImg:skuToImg,
  orderStatus:orderStatus,
  containsChinese: containsChinese,
  formatDuring:formatDuring,
  getBrandBySku: getBrandBySku,
  filterStr:filterStr,
  convertToOrdinary:convertToOrdinary,
  StringToMillisecond:StringToMillisecond,
  judgeETOBrand:judgeETOBrand,
  formatCRMDate:formatCRMDate,
  calculatingInsuredPrice:calculatingInsuredPrice,
  splitImg:splitImg,
  toDecimal:toDecimal,
  filterPickupActTip:filterPickupActTip,
  getThumbnailNormPath:getThumbnailNormPath,
  getCurrentUrl,
  getQueryStringArgs,
  judgeUrl,
  yipinNumber,
  dateIsOverDue,
  isChinese,
  numToWan,
  debounce,
  getNineSku,
  handleCouponDate,
  changeTimer,
  deteleObject,
  getDateByOrder,
  countDown,
	do_encrypt,
  do_decrypt,
  timeStamp,
  formatPreTimer,
  splitCouponImg,
  compareArr,
  formatCurTime,
  isJSONStr,
  getImgUrlBySystem,
  buyerShowImage,
  splitGameImg,
  timeFormat,
  obj2css,
  hideStr,
  numToThousand,
  isToday
}


