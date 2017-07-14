
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Main from '../pages/Main.vue'
import Table from '../pages/nav1/Table.vue'
import Form from '../pages/nav1/Form.vue'
import user from '../pages/nav1/user.vue'
import Page4 from '../pages/nav2/Page4.vue'
import Page5 from '../pages/nav2/Page5.vue'
import Page6 from '../pages/nav3/Page6.vue'
import echarts from '../pages/charts/echarts.vue'

import Shop from '../pages/shop/index'
import Addshop from '../pages/shop/addshop'
import ShopOrder from '../pages/shop/shoporder'
import ShopLog from '../pages/shop/shoplog'

//会员管理
import Vip from '../pages/vip/index'
import ShopRecord from '../pages/vip/shop-record'
import PlatFormRecord from '../pages/vip/platform-record'
import Viplog from '../pages/vip/userlog'

//资金中心
import Fund from '../pages/fund/index'
import ShopFund from '../pages/fund/shop-fund'
import ShareMoney from '../pages/fund/share-money'

//商品管理
import Goods from '../pages/goods/index'
import GoodsDetail from '../pages/goods/goods-detail'
import GoodsDetailEdit from '../pages/goods/goods-detail-edit'
import Sort from '../pages/goods/sort'
import Brand from '../pages/goods/brand'
import Supplier from '../pages/goods/supplier'
import AddSupplier from '../pages/goods/addsupplier'

//订单管理
import Order from '../pages/order/index'


//组织机构
import Sector from '../pages/origination/sector'
import User from '../pages/origination/user'
import Role from '../pages/origination/role'
import Menu from '../pages/origination/menu'


//帮助审核
import Help from '../pages/help/index'
import Bank from '../pages/help/bank'
import Banner from '../pages/help/banner'
import Pay from '../pages/help/pay'
import ArticleSort from '../pages/help/titlesort'
import Article from '../pages/help/article'


//

export default [
    {
        path: '/login',
        component: Login,
        hidden: true//不显示在导航中
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '商户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            {
                path: '/shop', component: Shop, name: '商户信息',
               
                // children: [
                //     {
                //         path: 'addshop',
                //         component: Addshop

                //     }
                // ]
            },{
                path: '/addshop/:id', component: Addshop
            },
            {path: '/shoporder/:id', component: ShopOrder},
            {path: '/shoplog/:id', component: ShopLog}
             
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/vip', component: Vip, name: '会员资料' },
            { path: '/shop-record', component: ShopRecord, name: '店铺报表' },
            { path: '/platform-record', component: PlatFormRecord, name: '平台购物流水' },
            { path: '/viplog/:id', component: Viplog }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '资金中心',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/fund', component: Fund, name: '会员提现' },
            { path: '/shopfund', component: ShopFund, name: '店铺提现' },
            { path: '/share-money', component: ShareMoney },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/goods', component: Goods, name: '商品档案' },
            { path: '/goods-detail', component: GoodsDetail, name: '商品档案详情' },
            { path: '/goods-detail-edit/:id', component: GoodsDetailEdit },
            { path: '/sort', component: Sort, name: '分类管理' },
            { path: '/brand', component: Brand, name: '品牌管理' },
            { path: '/supplier', component: Supplier, name: '供应商管理' },
            { path: '/addsupplier/:id', component: AddSupplier },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/order', component: Order, name: '订单信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组织机构',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/sector', component: Sector, name: '部门管理' },
            { path: '/user', component: User, name: '员工管理' },
            { path: '/role', component: Role, name: '角色管理' },
            { path: '/menu', component: Menu, name: '菜单管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '帮助审核',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/help', component: Help, name: '帮助列表' },
            { path: '/bank', component: Bank, name: '银行类型' },
            { path: '/banner', component: Banner, name: 'banner图管理' },
            { path: '/articlesort', component: ArticleSort, name: '文章分类' },
            { path: '/article', component: Article, name: '文章' },
            { path: '/pay', component: Pay, name: '支付管理' }
        ]
    }
]