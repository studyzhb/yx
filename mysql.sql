/*商品表*/
CREATE TABLE IF NOT EXISTS `wd_goods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '商品名称',
  `code` varchar(255) NOT NULL DEFAULT '' COMMENT '国际条形码',
  `production_origin` varchar(255) NOT NULL DEFAULT '' COMMENT '生成产地',
  `manufacturer` varchar(255) NOT NULL DEFAULT '' COMMENT '生成厂家',
  `valuation_id` tinyint(2) NOT NULL DEFAULT '0' COMMENT '计价方式',
  `retail_unit_id` tinyint(2) NOT NULL DEFAULT '0' COMMENT '零售单位',
  `goods_type_id` int(5) NOT NULL DEFAULT '0' COMMENT '商品分类id',
  `goods_brand_id` int(5) NOT NULL DEFAULT '0' COMMENT '商品品牌id',
  `supplier_id` int(5) NOT NULL DEFAULT '0' COMMENT '供货商id',
  `buying_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '进货价',
  `trade_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '批发价',
  `retail_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '零售价',
  `market_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '市场价',
  `profit` tinyint(3) NOT NULL DEFAULT '0' COMMENT '利润率',
  `pic` text NOT NULL DEFAULT '' COMMENT '图片',
  `content` text NOT NULL DEFAULT '' COMMENT '商品详情内容',
  `num` int(10) NOT NULL DEFAULT '0' COMMENT '库存',
  `sales` int(15) NOT NULL DEFAULT '0' COMMENT '销量',
  `sort` int(12) NOT NULL DEFAULT '1' COMMENT '排序',
  `is_sell` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否上架 1 上架 0不上架',
  `is_rebate` int(10) NOT NULL DEFAULT '1' COMMENT '是否返利 1 分钱 0不分',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正常 0禁用',
  `note` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `admin_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `goods_brand_id` (`goods_brand_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `goods_type_id` (`goods_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

/**商品规格表**/
CREATE TABLE IF NOT EXISTS `wd_goods_norm` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `goods_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品id',
  `name` varchar(128) NOT NULL DEFAULT '' COMMENT '规格名称',
  `buying_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '进货价',
  `trade_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '批发价',
  `retail_price` double(12,2)  NOT NULL DEFAULT '0' COMMENT '零售价',
  `num` int(10) NOT NULL DEFAULT '0' COMMENT '存储量',
  `profit` tinyint(3) NOT NULL DEFAULT '0' COMMENT '利润率',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正常, 0禁用',
  `admin_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY(`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品规格表';

/**商品分类表**/
CREATE TABLE IF NOT EXISTS `wd_goods_type` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '' COMMENT '分类名称',
  `app_pic` varchar(255) NOT NULL DEFAULT '' COMMENT 'app分类图片',
  `sort` tinyint(2) NOT NULL DEFAULT '1' COMMENT '排除 最小排到最前面',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正常, 0禁用',
  `note` varchar(225) NOT NULL DEFAULT '' COMMENT '描述',
  `pid` int(12) NOT NULL DEFAULT '0' COMMENT '父级id 0 顶级id',
  `admin_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY(`pid`),
  KEY(`sort`),
  KEY(`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品分类表';

/**商品品牌**/
CREATE TABLE IF NOT EXISTS `wd_goods_brand` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL DEFAULT '' COMMENT '商品品牌',
  `logo` varchar(255) NOT NULL DEFAULT '0' COMMENT '品牌logo',
  `sort` int(10) NOT NULL DEFAULT '1' COMMENT '排除 最小排到最前面',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正常, 0禁用',
  `note` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `admin_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品品牌';

/**供货商表**/
CREATE TABLE IF NOT EXISTS `wd_supplier` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(128) NOT NULL DEFAULT '' COMMENT '供货商编码',
  `name` varchar(128) NOT NULL DEFAULT '' COMMENT '供货商名称',
  `phone` varchar(20) NOT NULL DEFAULT '' COMMENT '电话',
  `link_name` varchar(20) NOT NULL DEFAULT '' COMMENT '联系人姓名',
  `link_tel` varchar(20) NOT NULL DEFAULT '0' COMMENT '联系人电话',
  `wechat` varchar(255) NOT NULL DEFAULT '1' COMMENT '微信',
  `qq` varchar(20) NOT NULL DEFAULT '0' COMMENT 'QQ',
  `emali` varchar(128) NOT NULL DEFAULT '' COMMENT '邮箱',
  `province` varchar(255) NOT NULL DEFAULT '' COMMENT '省',
  `city` varchar(255) NOT NULL DEFAULT '' COMMENT '市',
  `area` varchar(255) NOT NULL DEFAULT '' COMMENT '区',
  `address` varchar(255) NOT NULL DEFAULT '' COMMENT '详细地址',
  `note` varchar(225) NOT NULL DEFAULT '0' COMMENT '描述',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正常, 0禁用',
  `admin_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='供货商表';

/*****管理员表*****/
CREATE TABLE IF NOT EXISTS `wd_system_admin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name`  varchar(20) NOT NULL DEFAULT '' COMMENT '用户名',
  `login`  varchar(20) NOT NULL DEFAULT '' COMMENT '登录帐号',
  `password` varchar(40) NOT NULL DEFAULT '' COMMENT '密码',
  `avatar` varchar(50) NOT NULL DEFAULT '' COMMENT '头像',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1 启用 2 停用',
  `displayorder` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `level`  tinyint(1) NOT NULL DEFAULT '1' COMMENT '等级 （经理，普通员工等）',
  `roleids`  varchar(255) NOT NULL DEFAULT '' COMMENT '角色id字符串',
  `department` tinyint(1) NOT NULL DEFAULT '0' COMMENT '部门id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员表';

/*****部门表*****/
CREATE TABLE IF NOT EXISTS `wd_system_department` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name`  varchar(20) NOT NULL DEFAULT '' COMMENT '部门名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1 启用 2 停用',
  `displayorder` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `roleids`  varchar(255) NOT NULL DEFAULT '' COMMENT '角色id',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门表';

/*****商户资料表*****/
CREATE TABLE IF NOT EXISTS `    ` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `shopname`  varchar(20) NOT NULL DEFAULT '' COMMENT '店铺名称',
  `shopuser`  varchar(20) NOT NULL DEFAULT '' COMMENT '店铺联系人',
  `login`     int(11) NOT NULL DEFAULT '0' COMMENT '登录帐号/商户号',
  `password` varchar(40) NOT NULL DEFAULT '' COMMENT '密码',
  `avatar` varchar(50) NOT NULL DEFAULT '' COMMENT '头像',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1 启用 2 停用',
  `wx` varchar(40) NOT NULL DEFAULT '' COMMENT '微信',
  `qq` varchar(20) NOT NULL DEFAULT '' COMMENT 'qq',
  `email` varchar(20) NOT NULL DEFAULT '' COMMENT '邮箱',
  `phone` varchar(20) NOT NULL DEFAULT '' COMMENT '店铺电话',
  `tel` varchar(20) NOT NULL DEFAULT '' COMMENT '店铺联系人电话',
  `card` varchar(20) NOT NULL DEFAULT '' COMMENT '店铺联系人身份证',
  `place` varchar(20) NOT NULL DEFAULT '' COMMENT '店铺联系人籍贯',
  `province` varchar(30) NOT NULL DEFAULT '' COMMENT '店铺所在省',
  `city` varchar(30) NOT NULL DEFAULT '' COMMENT '店铺所在市',
  `area` varchar(40) NOT NULL DEFAULT '' COMMENT '店铺所在区域',
  `address` varchar(255) NOT NULL DEFAULT '' COMMENT '店铺详细地址',
  `latitude`  decimal(10,7) NOT NULL DEFAULT '0' COMMENT '纬度',
  `longitude` decimal(10,7) NOT NULL DEFAULT '0' COMMENT '经度',
  `bank` varchar(20) NOT NULL DEFAULT '' COMMENT '银行',
  `branch` varchar(50) NOT NULL DEFAULT '' COMMENT '银行支行',
  `bank_card` varchar(50) NOT NULL DEFAULT '' COMMENT '银行卡号',
  `money` double(20,2) NOT NULL DEFAULT '0' COMMENT '分润金额',
  `help_money`  double(20,2) NOT NULL DEFAULT '0' COMMENT '助推金额',
  `displayorder` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='店铺表';

/*****角色表*****/
CREATE TABLE IF NOT EXISTS `wd_system_role` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name`  varchar(18) NOT NULL DEFAULT '' COMMENT '角色名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1 启用 2 停用',
  `actionids`  varchar(255) NOT NULL DEFAULT '' COMMENT '权限id字符串',
  `displayorder` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

/*****权限表*****/
CREATE TABLE IF NOT EXISTS `wd_system_action` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name`  varchar(20) NOT NULL DEFAULT '' COMMENT '权限名称',
  `module`  varchar(30) NOT NULL DEFAULT '' COMMENT '模块名称',
  `controller` varchar(100) NOT NULL DEFAULT '' COMMENT '控制器',
  `level` varchar(100) NOT NULL DEFAULT '' COMMENT '1 模块 2 动作',
  `action` varchar(100) NOT NULL DEFAULT '' COMMENT '方法',
  `status` tinyint(1) NOT NULL DEFAULT '1'  COMMENT '状态 1 启用 2 停用',
  `display` tinyint(1) NOT NULL DEFAULT '2'  COMMENT '是否显示 1 显示 2 不显示',
  `pid` tinyint(1) NOT NULL DEFAULT '0'  COMMENT '父亲id',
  `displayorder` int(11) NOT NULL DEFAULT '0'  COMMENT '排序',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限表';

/*****商户提现表*****/
CREATE TABLE IF NOT EXISTS `wd_system_withdrawals` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `shopid`  varchar(20) NOT NULL DEFAULT '' COMMENT '店铺id',
  `shopname`  varchar(20) NOT NULL DEFAULT '' COMMENT '店铺名称',
  `login`     int(11) NOT NULL DEFAULT '0' COMMENT '登录帐号/商户号',
  `bank` varchar(20) NOT NULL DEFAULT '' COMMENT '银行',
  `branch` varchar(50) NOT NULL DEFAULT '' COMMENT '银行支行',
  `bank_card` varchar(50) NOT NULL DEFAULT '' COMMENT '银行卡号',
  `status` tinyint(1) NOT NULL DEFAULT '1'  COMMENT '状态 1 申请/未审 2 已审 3 已打款 4 拒绝',
  `money` int(11) NOT NULL DEFAULT '0'  COMMENT '申请金额',
  `type` tinyint(1) NOT NULL DEFAULT '1'  COMMENT '申请金额类型',
  `remark` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `shopid` (`shopid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限表';

/*用户-店铺交易记录表*/
CREATE TABLE IF NOT EXISTS `wl_user_shop_balance_log` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL DEFAULT '0' COMMENT '用户id',
  `shop_id` int(255) NOT NULL DEFAULT '0' COMMENT '店铺id',
  `order_sn` varchar(255) NOT NULL DEFAULT '0' COMMENT '订单号',
  `money` decimal(10,2) DEFAULT '0.00' COMMENT '金额',
  `type` tinyint(1) DEFAULT '0' COMMENT '0银行卡提现  1消费付款 2平台服务手续费 3.积分兑换',
  `action_type` tinyint(1) DEFAULT '0' COMMENT '0其他 1支出 2收入',
  `status` tinyint(1) DEFAULT '0' COMMENT '审核状态 0待审核,1审核中,2审核通过,3审核失败',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除 0正常 1删除',
  `card_num` varchar(25) DEFAULT '' COMMENT '银行卡号',
  `card_tip` varchar(255) DEFAULT '' COMMENT '开户行',
  `card_name` varchar(255) DEFAULT '' COMMENT '用户姓名',
  `user_mobile` varchar(100) DEFAULT '' COMMENT '手机号',
  `admin_id` int(15) DEFAULT '0' COMMENT '操作人ID',
  `note` varchar(255) DEFAULT '' COMMENT '备注',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户-店铺交易记录表';

/*用户-平台交易记录表*/
CREATE TABLE IF NOT EXISTS `wl_user_server_balance_log` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL DEFAULT '0' COMMENT '用户id',
  `order_sn` varchar(255) NOT NULL DEFAULT '0' COMMENT '订单号',
  `money` decimal(10,2) DEFAULT '0.00' COMMENT '金额',
  `type` tinyint(1) DEFAULT '0' COMMENT '0银行卡提现  1退货 2,订单返利 3.购买消费',
  `action_type` tinyint(1) DEFAULT '0' COMMENT '0其他 1支出 2收入',
  `status` tinyint(1) DEFAULT '0' COMMENT '审核状态 0待审核,1审核中,2审核通过,3审核失败',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除 0正常 1删除',
  `card_num` varchar(25) DEFAULT '' COMMENT '银行卡号',
  `card_tip` varchar(255) DEFAULT '' COMMENT '开户行',
  `card_name` varchar(255) DEFAULT '' COMMENT '用户姓名',
  `user_mobile` int(13) DEFAULT '0' COMMIT '用户手机号',
  `admin_id` int(15) DEFAULT '0' COMMENT '操作人ID',
  `note` varchar(255) DEFAULT '' COMMENT '备注',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户-平台交易记录表';

/*****分润报表*****/
CREATE TABLE IF NOT EXISTS `wd_system_report_form` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_num`  int(11) NOT NULL DEFAULT '0' COMMENT '订单个数',
  `money_all`  double(20,2) NOT NULL DEFAULT '0' COMMENT '总金额',
  `money`     double(20,2) NOT NULL DEFAULT '0' COMMENT '总分润',
  `money_company` double(20,2) NOT NULL DEFAULT '0' COMMENT '公司分润',
  `money_shop` double(20,2) NOT NULL DEFAULT '0' COMMENT '店铺分润',
  `money_queue` double(20,2) NOT NULL DEFAULT '0'  COMMENT '队列分润',
  `money_product` double(20,2) NOT NULL DEFAULT '0'  COMMENT '产品分润',
  `status` tinyint(1) NOT NULL DEFAULT '1'  COMMENT '1 未审核 2 已审核 3 完成',
  `remark` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `created_at` datetime NOT NULL COMMENT '添加时间',
  `updated_at` datetime NOT NULL COMMENT '修改时间',
  `audit_date` int(11) NOT NULL DEFAULT '0' COMMENT '需要脚本跑订单的审核日期',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='分润报表';


