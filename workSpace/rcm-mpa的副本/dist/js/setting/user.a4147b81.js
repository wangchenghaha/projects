(function(e){function t(t){for(var o,s,i=t[0],l=t[1],u=t[2],d=0,h=[];d<i.length;d++)s=i[d],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&h.push(a[s][0]),a[s]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(e[o]=l[o]);c&&c(t);while(h.length)h.shift()();return n.push.apply(n,u||[]),r()}function r(){for(var e,t=0;t<n.length;t++){for(var r=n[t],o=!0,i=1;i<r.length;i++){var l=r[i];0!==a[l]&&(o=!1)}o&&(n.splice(t--,1),e=s(s.s=r[0]))}return e}var o={},a={"setting/user":0},n=[];function s(t){if(o[t])return o[t].exports;var r=o[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=o,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(r,o,function(t){return e[t]}.bind(null,o));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var u=0;u<i.length;u++)t(i[u]);var c=l;n.push([27,"chunk-vendors","chunk-common"]),r()})({27:function(e,t,r){e.exports=r("b8b4")},8758:function(e,t,r){},b8b4:function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var o=r("cc00"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("div",[r("Card",{attrs:{title:e.title}},[r("Form",{staticClass:"formData",attrs:{model:e.searchForm,inline:"","label-width":70}},[r("FormItem",{attrs:{label:"用户编码"}},[r("Input",{attrs:{type:"text",placeholder:"请输入编码"},model:{value:e.searchForm.userCode,callback:function(t){e.$set(e.searchForm,"userCode",t)},expression:"searchForm.userCode"}})],1),r("FormItem",{attrs:{label:"用户名称"}},[r("Input",{attrs:{type:"text",placeholder:"请输入名称"},model:{value:e.searchForm.userName,callback:function(t){e.$set(e.searchForm,"userName",t)},expression:"searchForm.userName"}})],1),r("FormItem",[r("Button",{attrs:{type:"primary"},on:{click:e.handleSearch}},[e._v(e._s(e.$t("btn_search")))]),r("Divider",{attrs:{type:"vertical"}}),r("Button",{attrs:{type:"primary"},on:{click:e.handleReset}},[e._v(e._s(e.$t("btn_reset")))])],1)],1),e.datas.length?r("el-table",{staticClass:"userTable roleTable",staticStyle:{width:"100%"},attrs:{data:e.datas,border:""}},[r("el-table-column",{attrs:{prop:"userCode",label:e.$t("userCode"),width:"180"}}),r("el-table-column",{attrs:{prop:"userName",label:e.$t("userName"),width:"180"}}),r("el-table-column",{attrs:{prop:"statusCn",label:e.$t("userStatus"),width:"90"}}),r("el-table-column",{attrs:{prop:"postName",label:e.$t("userPost")}}),r("el-table-column",{attrs:{prop:"orgName",label:e.$t("organizationChart"),width:"280"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",{staticStyle:{"font-size":"10px"}},[e._v(e._s(t.row.orgName))])]}}],null,!1,744702474)}),r("el-table-column",{attrs:{prop:"phone",label:e.$t("phoneNumber")}}),r("el-table-column",{attrs:{prop:"email",label:e.$t("email")}}),r("el-table-column",{attrs:{prop:"validCn",label:e.$t("isEffective"),width:"90"}}),r("el-table-column",{attrs:{label:e.$t("action"),width:"200",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("Button",{staticClass:"action-btn",attrs:{size:"small",type:"primary",disabled:1===parseInt(t.row.validId)},on:{click:function(r){return e.startOrstopHandle(t.$index,t.row,1)}}},[e._v(e._s(e.$t("startUsing")))]),r("Button",{staticClass:"action-btn",attrs:{size:"small",type:"primary",disabled:0===parseInt(t.row.validId)},on:{click:function(r){return e.startOrstopHandle(t.$index,t.row,0)}}},[e._v(e._s(e.$t("forbidden")))]),r("Button",{staticClass:"action-btn",attrs:{size:"small",type:"primary"},on:{click:function(r){return e.roleAuthorizeHandle(t.$index,t.row)}}},[e._v(e._s(e.$t("authorize-role")))]),r("Button",{staticClass:"action-btn",attrs:{size:"small",type:"primary"},on:{click:function(r){return e.menuAuthorizeHandle(t.$index,t.row)}}},[e._v("菜单授权")])]}}],null,!1,3036089066)})],1):e._e(),r("Page",{staticClass:"pageFixed",attrs:{total:e.pageTotal,align:"right"},on:{"on-change":e.pageChange}}),r("Modal",{attrs:{width:"800",title:e.$t("authorize-role")},on:{"on-ok":e.authorizeOk},model:{value:e.showAuthorize,callback:function(t){e.showAuthorize=t},expression:"showAuthorize"}},[e.roleListAuthorize.length?r("el-table",{ref:"multipleTable",staticClass:"roleTable",staticStyle:{width:"100%"},attrs:{data:e.roleListAuthorize,"row-key":"roleCode",border:"",lazy:"","tree-props":{children:"children",hasChildren:"hasChildren"}},on:{"selection-change":e.rolehandleSelectionChange}},[r("el-table-column",{attrs:{type:"selection",width:"55"}}),r("el-table-column",{attrs:{prop:"nameCn",label:e.$t("nameCn"),width:"180"}}),r("el-table-column",{attrs:{prop:"roleCode",label:e.$t("roleCode")}})],1):e._e()],1),r("role-authorize-modal",{ref:"roleAuthorizeModal",attrs:{modalType:e.modalType,roleAuthorizeModalShow:e.roleAuthorizeModalShow},on:{closeRoleAuthorizeModal:e.closeRoleAuthorizeModal}})],1)],1)])},n=[],s=(r("4160"),r("d81d"),r("159b"),r("5530")),i=(r("96cf"),r("1da1")),l=r("66df"),u=function(e){return l["a"].request({url:"/api/BaseAuSysUser/getList",method:"post",data:e})},c=function(e){return l["a"].request({url:"/api/BaseAuSysUser/updateValid",method:"post",data:e})},d=function(e){return l["a"].request({url:"/api/BaseAuUserRole/getRoles",method:"post",data:e})},h=function(e){return l["a"].request({url:"/api/BaseAuUserRole/saveUserRoles",method:"post",data:e})},p=r("ff55"),m=r("0f78"),f=r("c591"),g={name:"User",components:{roleAuthorizeModal:m["a"]},mixins:[p["a"]],data:function(){return{title:this.$t("user"),name:"用户管理",modalType:"user",roleAuthorizeModalShow:!1,searchForm:{userCode:"",userName:""},datas:[],pageTotal:100,currentPage:1,selectionChangeData:[],isSuccessFlag:!1,showAuthorize:!1,roleListAuthorize:{isAuth:1,isAuthCn:"是",nameCn:"零售助理",roleCode:"rcm_lszl"},multipleSelection:[],AuthedRoleList:[],currentUserCode:""}},mounted:function(){document.title=this.title,this.getListInit(),Object(f["a"])().then((function(e){}))},computed:{},methods:{getListInit:function(){var e={pageNum:this.currentPage,pageSize:10,sortBy:"",sortDirection:"",userCode:"",userName:""};this.getListFn(e)},getListFn:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,u(e);case 2:o=r.sent,200===o.code?(t.datas=o.data,t.pageTotal=o.totalPage):t.$Message.error("查询失败");case 4:case"end":return r.stop()}}),r)})))()},pageChange:function(e){this.currentPage=e;var t={pageNum:this.currentPage,pageSize:10,sortBy:"",sortDirection:"",userCode:"",userName:""};this.getListFn(t)},handleSearch:function(){var e={pageNum:this.currentPage,pageSize:10,sortBy:"",sortDirection:"",userCode:this.searchForm.userCode,userName:this.searchForm.userName};this.getListFn(e)},handleReset:function(){this.searchForm.userCode="",this.searchForm.userName="";var e={pageNum:this.currentPage,pageSize:10,sortBy:"",sortDirection:"",userCode:"",userName:""};this.getListFn(e)},startOrstopHandle:function(e,t,r){var o=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a={userCode:t.userCode,validId:r},o.isSuccessFlag){e.next=6;break}return e.next=4,c(a);case 4:n=e.sent,200===n.code?(o.isSuccessFlag=!1,o.getListInit(),o.$Message.success("设置成功")):o.$Message.error("设置失败");case 6:case"end":return e.stop()}}),e)})))()},getRolesTree:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var o,a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return o={pageNum:1,pageSize:10},r.next=3,d(Object(s["a"])(Object(s["a"])({},o),e));case 3:a=r.sent,200===a.code?(t.roleListAuthorize=a.data.map((function(e){return 1===e.isAuth&&t.AuthedRoleList.push(e),e})),t.$nextTick((function(){t.AuthedRoleList.forEach((function(e){t.$refs.multipleTable.toggleRowSelection(e,!0)}))}))):t.$Message.error("获取数据失败");case 5:case"end":return r.stop()}}),r)})))()},authorizeOk:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var r,o,a,n,s,i,l;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.intersection(e.AuthedRoleList,e.multipleSelection),o=e.canselMenuList(r,e.AuthedRoleList),a=e.addMenuList(r,e.multipleSelection),n=a.map((function(t){var r={};return r.roleCode=t.roleCode,r.userCode=e.currentUserCode,r})),s=o.map((function(t){var r={};return r.roleCode=t.roleCode,r.userCode=e.currentUserCode,r})),o.length&&!a.length&&(i={deletes:s}),!o.length&&a.length&&(i={adds:n}),o.length&&a.length&&(i={adds:n,deletes:s}),t.next=10,h(i);case 10:l=t.sent,200===l.code?e.$Message.success("授权成功"):e.$Message.error("授权失败");case 12:case"end":return t.stop()}}),t)})))()},rolehandleSelectionChange:function(e){this.multipleSelection=e},closeRoleAuthorizeModal:function(e){this.roleAuthorizeModalShow=e},roleAuthorizeHandle:function(e,t){var r={userCode:t.userCode};this.getRolesTree(r),this.showAuthorize=!0,this.currentUserCode=t.userCode},menuAuthorizeHandle:function(e,t){var r=this;this.$refs.roleAuthorizeModal.handleAuthorize(e,t,"user"),setTimeout((function(){r.roleAuthorizeModalShow=!0}),500)}}},b=g,v=(r("ebff"),r("2877")),C=Object(v["a"])(b,a,n,!1,null,"7eeedfbe",null),w=C.exports,y=r("fe07");o["a"].config.productionTip=!1,new o["a"]({i18n:y["a"],render:function(e){return e(w)}}).$mount("#app")},ebff:function(e,t,r){"use strict";var o=r("8758"),a=r.n(o);a.a}});