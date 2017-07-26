export default {
    header:{
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        withCredentials:true
    },
    baseUrl:'/api',
    outputexcel:'http://aadmin.gexinec.com/api',
    api:{
        menulist:'/home/menu',
        //权限
        author:{
            //部门管理
            originlist:'/depart/list',
            originadd:'/depart/add',
            originedit:'/depart/edit',
            origindelete:'/depart/delete',
            originupdatestatus:'/depart/status',
            originsingleinfo:'/depart/one',
            //员工管理
            userlist:"/admin/list",
            useradd:"/admin/add",
            useredit:"/admin/edit",
            usersingleinfo:"/admin/one",
            userdelete:"/admin/delete",
            //角色
            rolelist:'/role/list',
            roleadd:'/role/add',
            roleedit:'/role/actionEdit',
            roleAuthor:'/role/actionList',
            roledelete:'/role/delete',
            rolesingle:'/role/one',
            //权限
            authorlist:'/action/list',
            authoradd:"/action/add",
            authoredit:'/action/edit',
            authordelete:'/action/delete'
        },
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
            // shopqueueLog:'/bfLines/list'
            shopqueueLog:'/shop/balanceLog',
            //店铺所有队列列表展示
            showshopqueuelist:'/queue/quLists',
            updateshopqueueinfo:'/queue/upQueue',
        },
        vip:{
            //会员列表
            index:"/user/userList",
            //会员信息更新
            update:'/user/userUpdate',
            //会员详细信息
            detailinfo:'/user/userInfo',
            //用户流水
            banlancelog:"/user/balanceLog",
            platformlog:'/user/serverList'
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
            getShoprecord:'/report/list',
            updatesharereportstatus:"/report/status"
        },
        //订单
        order:{
            index:'/order/show',
            send:'/order/edit'
        },
        login:'/login/login',
        help:{
            //系统金额日志
            syslog:"/sys/moneylog",
            bank:'/cardType/list',
            //添加银行卡
            addbank:'/cardType/add',
            //状态更改
            updatestatus:'/cardType/status',
            //更新银行卡信息
            updatebank:'/cardType/update',
            //banner图列表
            bannerlist:'/banner/list',
            //banner图添加
            addbanner:'/banner/add',
            //banner图删除
            deletebanner:'/banner/delete',
            updatebanner:'/banner/update',
            //更新banner图状态
            updatebannerstatus:'/banner/status',
            //banner图详情
            bannerdetail:'/banner/info',
            //banner排序
            bannersort:'/banner/order',
            //添加支付
            addpay:'/pay/save',
            //展示支付信息
            shopayinfo:'/pay/list',
            updatepaystatus:"/pay/status",
            //文章
            articlesortlist:'/article/cate_list',
            addarticlesort:'/article/add_cate',
            articlesortdetail:"/article/cate_detail",
            articlelist:'/article/list',
            addarticle:"/article/add_detail",
            articledetail:"/article/detail",
            deletearticlesort:"/article/del_cate",
            deletearticle:"/article/del_detail",
            //数据字典
            dictionarylist:'/dictionary/show',
            adddictionary:'/dictionary/create',
            editdictionary:"/dictionary/edit",
            deletedictionary:'/dictionary/del',
            showsyssharelist:'/sys/show',
            editsyssharelist:'/sys/edit'
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
            //商品详情编辑
            goodsdetailadd:'/goods/editgood',
            //商品详情
            goodsdetail:'/goods/detail',
            goodssort:'/goods/sort',
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
        },
        check:{
            goodscode:'/check/code',
            brand:'/check/brand'
        }
    }
}