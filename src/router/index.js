

// import Login from '../pages/Login.vue'
// import Home from '../pages/Home.vue'
// import Main from '../pages/Main.vue'
// import Table from '../pages/nav1/Table.vue'
// import Form from '../pages/nav1/Form.vue'
// import user from '../pages/nav1/user.vue'
// import Page4 from '../pages/nav2/Page4.vue'
// import Page5 from '../pages/nav2/Page5.vue'
// import Page6 from '../pages/nav3/Page6.vue'
// import echarts from '../pages/charts/echarts.vue'




//

export default [
    {
        path: '/login',
        component: resolve=>require(['../pages/Login.vue'],resolve),
        hidden: true//不显示在导航中
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '商户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            {
                path: '/shop', component: resolve=>require(['../pages/shop/index'],resolve), name: '商户信息',
               
                // children: [
                //     {
                //         path: 'addshop',
                //         component: Addshop

                //     }
                // ]
            },{
                path: '/addshop/:id', component:resolve=>require(['../pages/shop/addshop'],resolve) 
            },
            {path: '/shoporder/:id', component:resolve=>require(['../pages/shop/shoporder'],resolve)},
            {path: '/shopqueue', component:resolve=>require(['../pages/shop/shopqueue'],resolve)},
            {path: '/shoplog/:id', component: resolve=>require(['../pages/shop/shoplog'],resolve)}
        ]
    },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '会员管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/vip', component:resolve=>require(['../pages/vip/index'],resolve), name: '会员资料' },
            { path: '/shop-record', component: resolve=>require(['../pages/vip/shop-record'],resolve) , name: '店铺报表' },
            { path: '/platform-record', component:resolve=>require(['../pages/vip/platform-record'],resolve) , name: '平台购物流水' },
            { path: '/viplog/:id', component:resolve=>require(['../pages/vip/userlog'],resolve)  }
        ]
    },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '资金中心',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/fund', component:resolve=>require(['../pages/fund/index'],resolve) , name: '会员提现' },
            { path: '/shopfund', component:resolve=>require(['../pages/fund/shop-fund'],resolve) , name: '店铺提现' },
            { path: '/share-money', component:resolve=>require(['../pages/fund/share-money'],resolve)  },
        ]
    },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '商品管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/goods', component:resolve=>require(['../pages/goods/index'],resolve) , name: '商品档案' },
            { path: '/goods-detail', component:resolve=>require(['../pages/goods/goods-detail'],resolve) , name: '商品档案详情' },
            { path: '/goods-detail-edit/:id', component:resolve=>require(['../pages/goods/goods-detail-edit'],resolve)  },
            { path: '/sort', component:resolve=>require(['../pages/goods/sort'],resolve) , name: '分类管理' },
            { path: '/brand', component:resolve=>require(['../pages/goods/brand'],resolve) , name: '品牌管理' },
            { path: '/supplier', component:resolve=>require(['../pages/goods/supplier'],resolve) , name: '供应商管理' },
            { path: '/addsupplier/:id', component:resolve=>require(['../pages/goods/supplier'],resolve)  },
        ]
    },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '订单管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/order', component:resolve=>require(['../pages/order/index'],resolve) , name: '订单信息' }
        ]
    },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '组织机构',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/sector', component:resolve=>require(['../pages/origination/sector'],resolve) , name: '部门管理' },
            { path: '/user', component:resolve=>require(['../pages/origination/user'],resolve) , name: '员工管理' },
            { path: '/role', component:resolve=>require(['../pages/origination/role'],resolve) , name: '角色管理' },
            { path: '/menu', component:resolve=>require(['../pages/origination/menu'],resolve) , name: '菜单管理' }
        ]
    },
    {
        path: '/',
        component: resolve=>require(['../pages/Home.vue'],resolve),
        name: '帮助审核',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/help', component:resolve=>require(['../pages/help/index'],resolve) , name: '帮助列表' },
            { path: '/sysshare', component:resolve=>require(['../pages/help/sysshare'],resolve) , name: '分润比例' },
            { path: '/dictionary', component:resolve=>require(['../pages/help/dictionary'],resolve) , name: '数据字典' },
            { path: '/bank', component:resolve=>require(['../pages/help/bank'],resolve) , name: '银行类型' },
            { path: '/banner', component:resolve=>require(['../pages/help/banner'],resolve) , name: 'banner图管理' },
            { path: '/articlesort', component:resolve=>require(['../pages/help/titlesort'],resolve) , name: '文章分类' },
            { path: '/article', component:resolve=>require(['../pages/help/article'],resolve) , name: '文章' },
            { path: '/pay', component:resolve=>require(['../pages/help/pay'],resolve) , name: '支付管理' },
            { path: '/syslog', component:resolve=>require(['../pages/help/syslog'],resolve) , name: '系统日志' }
        ]
    }
]