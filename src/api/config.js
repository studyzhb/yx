export default {
    header:{
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        withCredentials:true
    },
    baseUrl:'/api',
    api:{
        //店铺
        shop:{
            showlist:'/shop/list',
            //添加店铺
            addshop:'/shop/add',
            //获取单个店铺信息
            getSingleShop:'/shop/one',
            //编辑店铺
            updateshop:'/shop/edit',
            //删除店铺
            delete:'/shop/delete',
            //队列详情
            shopqueuedetail:'/lines/queueInfo',
            //队列订单列表
            shopqueuelist:"/lines/linesLists",
            //队列流水
            shopqueueLog:'/bfLines/list'
        },
        vip:{
            //会员列表
            index:"/user/userList",
            //会员信息更新
            update:'/user/userUpdate',
            //会员详细信息
            detailinfo:'/user/userInfo',
            //用户流水
            banlancelog:"/user/balanceLog"
        },
        //会员提现
        fund:{
            //用户在平台提现列表
            showlist:"/widthdraw/list",
            //用户提现审核第一步\
            checking:'/widthdraw/checking',
            //用户提现完成
            widthok:'/widthdraw/ok',
            //提现拒绝
            widthfalse:'/widthdraw/false',
            //会员流水导出
            outputexcel:'/widthdraw/excel',
            //店铺提现
            shopapplylist:'/withdr/list',
            //更新审核状态
            updateShopApplyStatus:'/withdr/status',
            //获取单个申请提现数据
            getOneShopApplyinfo:"/withdr/one",
            //获取店铺流水
            getShoprecord:'/report/list'
        },
        //订单
        order:{
            index:'/order/show',
            send:'/order/edit'
        },
        login:'/login/login',
        help:{
            bank:'/cardType/list',
            //添加银行卡
            addbank:'/cardType/add',
            //状态更改
            updatestatus:'/cardType/status',
            //更新银行卡信息
            updatebank:'/cardType/update'
        },
        goods:{
            index:'/goods/show',
            //添加商品
            addGoods:"/goods/create",
            //修改商品
            updateGoods:"/goods/edit",
            //添加商品前获取参数
            preparams:'/goods/showparam',
            //商品上下架
            goodstooglestatus:'/goods/shelves',
            //分类
            sortindex:"/type/show",
            //添加分类
            addsort:'/type/create',
            //更新分类
            updatesort:'/type/edit',
            //获取顶级分类
            gettoptype:'/type/toptype',
            //根据分类上下架商品
            upordowngoods:'/type/sellgood',
            //品牌列表
            brandindex:"/brand/show",
            //添加品牌
            addbrand:'/brand/create',
            //更新品牌
            updatebrand:"/brand/edit",
            //供应商
            supplierindex:'/supplier/show',
            //添加供货商
            addsupplier:'/supplier/create',
            //更新供应商
            updatesupplier:'/supplier/edit'
        }
    }
}