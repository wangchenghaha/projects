(function(e){function t(t){for(var n,i,s=t[0],u=t[1],c=t[2],p=0,f=[];p<s.length;p++)i=s[p],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&f.push(a[i][0]),a[i]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);l&&l(t);while(f.length)f.shift()();return o.push.apply(o,c||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,s=1;s<r.length;s++){var u=r[s];0!==a[u]&&(n=!1)}n&&(o.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},a={"report-center/report-base":0},o=[];function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var l=u;o.push([23,"chunk-vendors","chunk-common"]),r()})({23:function(e,t,r){e.exports=r("2b81")},"2b81":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("cc00"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("Card",{attrs:{title:e.title}},[r("Form",{ref:"formItem",attrs:{model:e.formData,inline:""}},[r("FormItem",{attrs:{prop:"reportName"}},[r("Select",{staticStyle:{width:"200px"},model:{value:e.formData.reportName,callback:function(t){e.$set(e.formData,"reportName",t)},expression:"formData.reportName"}},e._l(e.reportName,(function(t){return r("Option",{key:t.code,attrs:{value:t.code}},[e._v(e._s(t.label)+" ")])})),1)],1),r("FormItem",[r("Button",{staticClass:"mgRight10",attrs:{type:"primary"},on:{click:e.search}},[e._v(e._s(e.$t("query")))]),r("Button",{attrs:{type:"primary"},on:{click:e.exportFile}},[e._v(e._s(e.$t("exportFile")))])],1)],1),r("page-list",{attrs:{columns:e.columns,datas:e.datas,changePage:e.changePage}})],1)],1)},o=[],i=(r("7db0"),r("c975"),r("d3b7"),r("ac1f"),r("3ca3"),r("1276"),r("ddb0"),r("2b3d"),r("5530")),s=r("ded4"),u=(r("b0c0"),r("66df")),c=function(e){return u["a"].request({url:"/api/baseGroup/getGroupReportList",method:"post",data:e})},l=function(e){return u["a"].request({url:"/api/market/getMarketReportList",method:"post",data:e})},p=function(e){return u["a"].request({url:"/api/shop/getShopReportList",method:"post",data:e})},f=function(e,t){for(var r=[{name:"baseGroup",fn:function(e){return c(e)}},{name:"market",fn:function(e){return l(e)}},{name:"shop",fn:function(e){return p(e)}}],n=0;n<r.length;n++){var a=r[n];if(a.name===t)return a.fn(e)}},d=(r("caad"),r("b64b"),r("2532"),r("3835")),m=r("d4ec"),h=r("bee2"),g=r("bc3a"),b=r.n(g),v=r("4360"),y="token",O=localStorage.getItem("proxy"),k=function(e){var t=e.statusText,r=e.status,n=e.request.responseURL,a={type:"ajax",code:r,mes:t,url:n};n.includes("save_error_logger")||v["a"].dispatch("addErrorLog",a)},w=function(){function e(t){Object(m["a"])(this,e),this.baseUrl=t,this.queue={}}return Object(h["a"])(e,[{key:"getInsideConfig",value:function(){var e={baseURL:this.baseUrl,headers:{token:localStorage.getItem(y),local:localStorage.getItem("local")}};if(O){var t=O.split(":"),r=Object(d["a"])(t,2),n=r[0],a=r[1];e.proxy={host:n,port:a}}return e}},{key:"destroy",value:function(e){delete this.queue[e],Object.keys(this.queue).length}},{key:"interceptors",value:function(e,t){var r=this;e.interceptors.request.use((function(e){return Object.keys(r.queue).length,r.queue[t]=!0,e}),(function(e){return Promise.reject(e)})),e.interceptors.response.use((function(e){r.destroy(t);var n=e.data,a=e.status,o=e.headers;return{data:n,status:a,headers:o}}),(function(e){r.destroy(t);var n=e.response;if(!n){var a=JSON.parse(JSON.stringify(e)),o=a.request,i=o.statusText,s=o.status,u=a.config;n={statusText:i,status:s,request:{responseURL:u.url}}}return k(n),Promise.reject(e)}))}},{key:"request",value:function(e){var t=b.a.create();return e=Object.assign(this.getInsideConfig(),e),this.interceptors(t,e.url),t(e)}}]),e}(),j=w,x=r("f121"),L=new j(x["a"].baseUrl),P=function(e){return L.request({url:"/api/baseGroup/writeExcel",method:"get",params:e,responseType:"blob"})},q=function(e){return L.request({url:"/api/market/writeExcel",method:"get",params:e,responseType:"blob"})},D=function(e){return L.request({url:"/api/shop/writeExcel",method:"get",params:e,responseType:"blob"})},N=function(e,t){for(var r=[{name:"baseGroup",fn:function(e){return P(e)}},{name:"market",fn:function(e){return q(e)}},{name:"shop",fn:function(e){return D(e)}}],n=0;n<r.length;n++){var a=r[n];if(a.name===t)return a.fn(e)}},_={components:{PageList:s["a"]},data:function(){return{title:this.$t("report-base"),formData:{reportName:"baseGroup"},reportName:[{code:"baseGroup",label:"集团报表查询",hideKey:[]},{code:"market",label:"商场报表查询",hideKey:["countryName","region","belongRegion","city","district","groupLevel","provinces"]},{code:"shop",label:"店铺主数据报表查询",hideKey:["applicantName","brandCode","shopLng","physicalCity","physicalDistrict","physicalDistrictCode","manageRegion","manageCity","manageProvinces","manageProvincesCode","manageDistrictCode","manageDistrict","shopLat","physicalRegion","physicalProvince","physicalProvinceCode","shopNatureCode"]}],columns:[],datas:[],changePage:null}},computed:{bodyData:function(){return{sortBy:"",sortDirection:""}}},mounted:function(){document.title=this.title,this.pageList()},methods:{getHideKey:function(){var e=this;return this.reportName.find((function(t){return e.formData.reportName===t.code})).hideKey},pageList:function(){var e=this;this.loading=!0,this.changePage=function(t,r){var n=Object(i["a"])({pageNum:t,pageSize:r},e.bodyData);return f(n,e.formData.reportName).then((function(t){if(200===t.code){if(t.data.length)for(var r in t.data[0])if(e.getHideKey().indexOf(r)<0){var n={title:e.$t(r),key:r,width:200,align:"center"};e.columns.push(n)}e.datas=Object.assign([],t.data)}return t}))}},search:function(){this.columns=[],this.datas=[],this.pageList()},setData:function(e){var t=decodeURI(e.headers["content-disposition"]).split(";")[1].split("=")[1],r=e.data;if(window.navigator.msSaveOrOpenBlob)navigator.msSaveBlob(r,t);else{var n=document.createElement("a");n.href=window.URL.createObjectURL(new Blob([r],{type:"application/vnd.ms-excel"})),n.download=t,n.click(),window.URL.revokeObjectURL(n.href)}},exportFile:function(){var e=this;N({},this.formData.reportName).then((function(t){e.setData(t)}))}}},S=_,R=r("2877"),C=Object(R["a"])(S,a,o,!1,null,null,null),U=C.exports,I=r("fe07");n["a"].config.productionTip=!1,new n["a"]({i18n:I["a"],render:function(e){return e(U)}}).$mount("#app")}});