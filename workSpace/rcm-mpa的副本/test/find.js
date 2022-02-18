const db = [
    {
        "path": "/dashboard",
        "name": "menu_dashboard",
        "menuCode": "20",
        "parentCode": "",
        "meta": {
            "hideInMenu": false,
            "title": "Dashboard",
            "notCache": true,
            "icon": "ios-analytics"
        },
        "component": "components/main",
        "children": [
            {
                "path": "/dashboard",
                "name": "dashboard",
                "menuCode": "2010",
                "parentCode": "20",
                "meta": {
                    "hideInMenu": false,
                    "title": "Dashboard",
                    "notCache": true,
                    "icon": "ios-analytics"
                },
                "component": "view/single-page/home"
            },
            {
                "path": "/dashboard222",
                "name": "dashboard",
                "menuCode": "2011",
                "parentCode": "20",
                "meta": {
                    "hideInMenu": false,
                    "title": "Dashboard",
                    "notCache": true,
                    "icon": "ios-analytics"
                },
                "component": "view/single-page/home"
            }
        ]
    },
    {
        "path": "/wflow",
        "name": "wflow",
        "menuCode": "30",
        "parentCode": "",
        "meta": {
            "hideInMenu": false,
            "title": "工作流",
            "notCache": true,
            "icon": "md-git-network"
        },
        "component": "components/main",
        "children": [
            {
                "path": "processed",
                "name": "processed",
                "menuCode": "3011",
                "parentCode": "30",
                "meta": {
                    "hideInMenu": false,
                    "title": "已办事项",
                    "notCache": true,
                    "icon": "md-git-network"
                },
                "component": "view/processed"
            },
            {
                "path": "myDraft",
                "name": "myDraft",
                "menuCode": "3012",
                "parentCode": "30",
                "meta": {
                    "hideInMenu": false,
                    "title": "我的草稿",
                    "notCache": true,
                    "icon": "md-git-network"
                },
                "component": "view/myDraft"
            },
            {
                "path": "my",
                "name": "myflow",
                "menuCode": "3010",
                "parentCode": "30",
                "meta": {
                    "hideInMenu": false,
                    "title": "我的申请",
                    "notCache": true,
                    "icon": "md-git-network"
                },
                "component": "view/my"
            }
        ]
    },
    {
        "path": "/invest",
        "name": "menu_investment",
        "menuCode": "40",
        "parentCode": "",
        "meta": {
            "hideInMenu": false,
            "title": "投资评估",
            "notCache": true,
            "icon": "md-calculator"
        },
        "component": "components/main",
        "children": [
            {
                "path": "store",
                "name": "menu_newstore",
                "menuCode": "4010",
                "parentCode": "40",
                "meta": {
                    "hideInMenu": false,
                    "title": "新店投资评估",
                    "notCache": true,
                    "icon": "md-appstore"
                },
                "component": "components/parent-view",
                "children": [
                    {
                        "path": "new",
                        "name": "menu_newstore_apply",
                        "menuCode": "401010",
                        "parentCode": "4010",
                        "meta": {
                            "hideInMenu": false,
                            "title": "新店投资评估",
                            "notCache": true,
                            "icon": "md-create"
                        },
                        "component": "view/invest/store/new"
                    },
                    {
                        "path": "switch",
                        "name": "invest-switch",
                        "menuCode": "401020",
                        "parentCode": "4010",
                        "meta": {
                            "hideInMenu": false,
                            "title": "新店投资评估开关",
                            "notCache": true,
                            "icon": "ios-switch"
                        },
                        "component": "view/invest/store/switch"
                    },
                    {
                        "path": "switch-temp",
                        "name": "invest-switch-temp",
                        "menuCode": "401030",
                        "parentCode": "4010",
                        "meta": {
                            "hideInMenu": false,
                            "title": "新店投资评估临时开关",
                            "notCache": true,
                            "icon": "ios-switch"
                        },
                        "component": "view/invest/store/switch-temp",
                        "children": [
                            {
                                "path": "dashboard",
                                "name": "dashboard",
                                "menuCode": "20102222",
                                "parentCode": "401030",
                                "meta": {
                                    "hideInMenu": false,
                                    "title": "Dashboard",
                                    "notCache": true,
                                    "icon": "ios-analytics"
                                },
                                "component": "view/single-page/home"
                            }
                        ]
                    }
                ]
            },
            {
                "path": "move",
                "name": "inv-move",
                "menuCode": "4020",
                "parentCode": "40",
                "meta": {
                    "hideInMenu": false,
                    "title": "重装移位投资评估",
                    "notCache": true,
                    "icon": "md-appstore"
                },
                "component": "view/invest/move"
            },
            {
                "path": "query",
                "name": "menu_newstore_query",
                "menuCode": "4030",
                "parentCode": "40",
                "meta": {
                    "hideInMenu": false,
                    "title": "投资评估查询",
                    "notCache": true,
                    "icon": "md-search"
                },
                "component": "view/invest/query"
            }
        ]
    }
]

/**
 * 递归查找目标路由
 * @param {目标节点ID} menuCode 
 * @param {要查找的节点} menus 
 */
function findRouter(menuCode, menus) {
    for (const menu of menus) {
        if (menu.menuCode === menuCode) {
            return menu;
        } else {
            if (menu.children) {
                const result = findRouter(menuCode, menu.children);
                if (result && result.menuCode === menuCode) {
                    return result;
                }
            }
        }

    }
}


/**
 * 获取菜单节点对应的浏览器路径
 * @param {菜单编码} menuCode 
 * @param {菜单路径} path 
 */
function getRouterPath(menus,menuCode, path) {
    const appendPath = (parentPath, path) => {
        return path ? `${parentPath}/${path}` : parentPath
    }
    const target = findRouter(menuCode, menus);
    if (target && target.parentCode) {
        return getRouterPath(menus,target.parentCode, appendPath(target.path,path))
    } else {
        return appendPath(target.path,path);
    }

}

console.time('计时器')
const path = getRouterPath(db, '4010', '');
console.log(path);
console.timeEnd('计时器')