(function(t){function e(e){for(var o,n,l=e[0],i=e[1],c=e[2],u=0,p=[];u<l.length;u++)n=l[u],Object.prototype.hasOwnProperty.call(s,n)&&s[n]&&p.push(s[n][0]),s[n]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o]);d&&d(e);while(p.length)p.shift()();return r.push.apply(r,c||[]),a()}function a(){for(var t,e=0;e<r.length;e++){for(var a=r[e],o=!0,l=1;l<a.length;l++){var i=a[l];0!==s[i]&&(o=!1)}o&&(r.splice(e--,1),t=n(n.s=a[0]))}return t}var o={},s={"store/retail/toAddMarket/storecode_market_contractbacktoretailform":0},r=[];function n(e){if(o[e])return o[e].exports;var a=o[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=o,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(a,o,function(e){return t[e]}.bind(null,o));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],i=l.push.bind(l);l.push=e,l=l.slice();for(var c=0;c<l.length;c++)e(l[c]);var d=i;r.push([52,"chunk-vendors","chunk-common"]),a()})({"1c80":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var o=a("cc00"),s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"form-container"},[a("form-header",{attrs:{title:t.title,"serial-number":t.formData.sn}}),a("Form",{ref:"form",attrs:{model:t.formData,rules:t.ruleInline,inline:"","label-position":"left","label-width":100}},[a("Card",{staticClass:"mgBottom10",attrs:{title:t.$t("applicantInfo")}},[a("applicant")],1),a("Card",{staticClass:"mgBottom10",attrs:{title:t.$t("baseStoreInfo")}},[a("Row",[a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("shopCode"),prop:"shopCode"}},[a("form-mode",{ref:"shopcode",attrs:{columns:t.shopCodeColumns,searchData:t.shopCodeSearchData,apiFun:t.getShopList,disabled:""},on:{select:t.getShopListSelect}},[a("Input",{attrs:{readonly:"",type:"text",disabled:""},model:{value:t.formData.shopCode,callback:function(e){t.$set(t.formData,"shopCode",e)},expression:"formData.shopCode"}})],1)],1)],1),a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("brandCode"),prop:"brand"}},[a("Input",{attrs:{readonly:"",type:"text",disabled:""},model:{value:t.formData.brand,callback:function(e){t.$set(t.formData,"brand",e)},expression:"formData.brand"}})],1)],1),a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("shopTypeCode"),prop:"shopTypeCode"}},[a("Select",{attrs:{disabled:""},model:{value:t.formData.shopTypeCode,callback:function(e){t.$set(t.formData,"shopTypeCode",e)},expression:"formData.shopTypeCode"}},t._l(t.dictionary.shop_type,(function(e){return a("Option",{key:e.code,attrs:{value:e.code}},[t._v(t._s(e.label))])})),1)],1)],1)],1),a("Row",[a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("shopName"),prop:"shopName"}},[a("Input",{attrs:{type:"text",disabled:""},model:{value:t.formData.shopName,callback:function(e){t.$set(t.formData,"shopName",e)},expression:"formData.shopName"}})],1)],1),a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("shopEnName"),prop:"shopEnName"}},[a("Input",{attrs:{type:"text",disabled:""},model:{value:t.formData.shopEnName,callback:function(e){t.$set(t.formData,"shopEnName",e)},expression:"formData.shopEnName"}})],1)],1),a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("mallNameCn"),prop:"marketName"}},[a("Input",{attrs:{type:"text",disabled:""},model:{value:t.mainMarketName,callback:function(e){t.mainMarketName=e},expression:"mainMarketName"}})],1)],1)],1),a("Row",[a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("isSelf"),prop:"isSelf"}},[a("Select",{attrs:{disabled:""},model:{value:t.formData.isSelf,callback:function(e){t.$set(t.formData,"isSelf",e)},expression:"formData.isSelf"}},t._l(t.dictionary.yesorno,(function(e){return a("Option",{key:e.code,attrs:{value:e.code}},[t._v(t._s(e.label))])})),1)],1)],1),a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("shopStatus"),prop:"shopStatus"}},[a("Select",{attrs:{"label-in-value":"",disabled:""},on:{"on-change":function(e){return t.itemChange("shopStatus",arguments)}},model:{value:t.formData.shopStatus,callback:function(e){t.$set(t.formData,"shopStatus",e)},expression:"formData.shopStatus"}},t._l(t.dictionary.shop_status,(function(e){return a("Option",{key:e.code,attrs:{value:e.code}},[t._v(t._s(e.label))])})),1)],1)],1),a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("storeAddress"),prop:"shopAddress",title:t.formData.storeAddress}},[a("Input",{attrs:{type:"text",disabled:""},model:{value:t.formData.shopAddress,callback:function(e){t.$set(t.formData,"shopAddress",e)},expression:"formData.shopAddress"}})],1)],1)],1)],1),a("Card",{staticClass:"mgBottom10",attrs:{title:t.$t("storeInfo")}},[a("div",[a("Row",[a("Col",{attrs:{span:"8"}},[a("FormItem",{staticClass:"width90",attrs:{label:t.$t("isMultiSignOneContract"),prop:"isMultiSignOneContract"}},[a("Poptip",{attrs:{trigger:"hover","word-wrap":"",content:t.$t("isMultiSignOneContractWarn")}},[a("Select",{attrs:{disabled:"read"===t.pageType},model:{value:t.formData.isMultiSignOneContract,callback:function(e){t.$set(t.formData,"isMultiSignOneContract",e)},expression:"formData.isMultiSignOneContract"}},t._l(t.dictionary.yesorno,(function(e){return a("Option",{key:e.code,attrs:{value:e.code}},[t._v(t._s(e.label))])})),1)],1)],1)],1)],1),"read"!==t.pageType?a("div",{staticClass:"mgBottom10"},[a("Button",{staticClass:"mgRight10",attrs:{ghost:"",type:"primary"},on:{click:t.addFn1}},[t._v(t._s(t.$t("addMark1")))]),a("Button",{attrs:{ghost:"",type:"primary"},on:{click:t.addFn2}},[t._v(t._s(t.$t("addMark2")))])],1):t._e(),a("Table",{attrs:{columns:t.baseMarketListColumns,data:t.formData.baseMarketList},scopedSlots:t._u([{key:"action",fn:function(e){e.row;var o=e.index;return"read"===t.pageType?[a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"primary",size:"small"},on:{click:function(e){return t.readAndEdit(o,"read")}}},[t._v(t._s(t.$t("detail")))])]:void 0}}],null,!0)})],1)]),a("Card",{staticClass:"mgBottom10",attrs:{title:t.$t("qualificationInfo")}},[a("AuditTableRetail",{ref:"qua",attrs:{pageType:t.pageType,addContractColFlag:!0}})],1),a("WorkFlow",{ref:"wfb",attrs:{ignoreType:["general"],taskButtonVisible:t.taskButtonVisible,workFlowStatusVisible:t.workFlowStatusVisible,taskCommentVisible:t.taskCommentVisible,bizKeyExisted:t.flowStatusObj.bizKey,defKey:t.flowStatusObj.defKey,instIdExisted:t.flowStatusObj.instId},on:{onFlowResult:t.onFlowResult,onFlowStartUp:t.onFlowStartUp,onFlowResubmit:t.onFlowResubmit},model:{value:t.flowStatusObj.taskId,callback:function(e){t.$set(t.flowStatusObj,"taskId",e)},expression:"flowStatusObj.taskId"}})],1),t.modal1?a("main-store",{ref:"mis",attrs:{baseMarketList:t.formData.baseMarketList,mode:t.mode1,index:t.index},on:{cancel:function(e){return t.addMainStore(!1)},storeSubmit:t.storeSubmit},model:{value:t.modal1,callback:function(e){t.modal1=e},expression:"modal1"}}):t._e(),t.modal2?a("add-mate-store",{ref:"mes",attrs:{baseMarketList:t.formData.baseMarketList,mode:t.mode2,index:t.index},on:{cancel:function(e){return t.addMateStore(!1)},storeSubmit:t.storeSubmit},model:{value:t.modal2,callback:function(e){t.modal2=e},expression:"modal2"}}):t._e()],1)},r=[],n=a("73f5"),l=a("c72e"),i=a("3da0"),c=a("04c0"),d={name:"storecode_market_contractbacktoretailform",mixins:[l["a"],i["a"]],components:{AuditTableRetail:c["a"]},data:function(){return{flowsType:"contractback"}},computed:{pageType:function(){return this.alreadyDone?"read":"input"},taskCommentVisible:function(){return!1},taskButtonVisible:function(){return!0},workFlowStatusVisible:function(){return!0}},methods:{onFlowResubmit:function(t){var e=this,a=this.save();Object(n["a"])(a).then((function(a){200===a.code?(e.$refs.wfb.executeFlow(t,!0),e.sn=a.data.sn):e.$Message.error(a.message||e.$t("save-fail"))}))},onFlowResult:function(t){var e=this,a=t.cmdType;"processStatus"!==a&&("saveTaskDraft"===a?this.$rcmMessage.show({content:"暂存成功"}):this.$rcmMessage.show({onOk:function(){e.$router2.push.call(e,"/wflow/my")}}))},onFlowStartUp:function(t){var e=this;this.formData.baseMarketList.length?this.$refs.form.validate((function(a){if(a){if(!e.validShop())return;var o=e.save();Object(n["a"])(o).then((function(a){200===a.code?(e.$refs.wfb.startFlow(t,a.data.sn),e.sn=a.data.sn):e.$Message.error(a.message||e.$t("save-fail"))})),e.loading=!1}else e.$Message.error(e.$t("requiredItemsNone"))})):this.$Message.info("请添加商场信息")}}},u=d,p=(a("448a"),a("2877")),m=Object(p["a"])(u,s,r,!1,null,"37a717e0",null),f=m.exports,b=a("fe07");o["a"].config.productionTip=!1,new o["a"]({i18n:b["a"],render:function(t){return t(f)}}).$mount("#app")},"448a":function(t,e,a){"use strict";var o=a("9e3e"),s=a.n(o);s.a},52:function(t,e,a){t.exports=a("1c80")},"9e3e":function(t,e,a){}});