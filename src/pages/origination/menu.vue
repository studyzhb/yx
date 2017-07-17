<template>
    <section style="padding:20px;">
        <!--工具条-->
        <el-form :inline="true" :model="filters">
            <el-form-item style="margin-bottom:10px;">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
    
        <el-tree :data="data2" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
        </el-tree>
    
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" prop="display">
                    <el-switch v-model="editForm.display" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="2">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="editForm.status" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="2">
                    </el-switch>
                </el-form-item>
                <el-form-item label="模块" prop="module">
                    <el-input v-model="editForm.module" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="控制器" prop="controller">
                    <el-input v-model="editForm.controller" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="动作" prop="action">
                    <el-input v-model="editForm.action" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="页面组件" prop="formation">
                    <el-input v-model="editForm.formation" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="页面地址" prop="url">
                    <el-input v-model="editForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="displayorder">
                    <el-input v-model="editForm.displayorder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="level" prop="level">
                    <el-select v-model="editForm.level" placeholder="请选择">
                        <el-option label="模块" value="1">
                        </el-option>
                        <el-option label="动作" value="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="logo" prop="logo">
                                            <el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <el-dialog v-model="dialogVisible" size="tiny">
                                                <img width="100%" :src="dialogImageUrl" alt="">
                                            </el-dialog>
                                        </el-form-item>
                            
                                        <el-form-item>
                                            <el-input type="hidden" v-model="editForm.logo" auto-complete="off"></el-input>
                                        </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
    
    </section>
</template>

<script>
import util from '../../common/util'
import NProgress from 'nprogress'
import request from 'api';
import config from 'config';
let id = 1000;
export default {
    data() {
        return {
            data2: [],
            defaultProps: {
                children: 'son',
                label: 'name'
            },

            //标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            filters: {
                name: '',
                code: '',
                page: 1,
                status: '',
                is_sell: ''
            },
            preData: {
                brand: [],
                retail_nuit: [],
                supplier: [],
                valuation: [],
                type: []
            },
            activeName: '10',
            options: [],
            option: [],
            users: [],
            total: 0,
            page: 1,
            pagesize: 1,
            listLoading: false,
            editFormVisible: false,//编辑界面显是否显示
            editFormTtile: '编辑',//编辑界面标题
            shopdetailVisible: false,
            shopdetailtitle: '店铺详情',
            shopdetailobj: {

            },
            pick: '已上架 0',
            notpick: '未上架 0',
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                display: '',
                pid: '0',
                module: '',
                formation: '',
                url: '',
                controller: '',
                action: '',
                displayorder: '',
                status: '',
                level: ''
            },
            editLoading: false,
            btnEditText: '提 交',
            editFormRules: {
                name: [
                   
                ],
                code: [
                    { required: true, message: '请输入国际条形码', trigger: 'blur' }
                ],
                production_origin: [
                    { required: true, message: '请输入生成产地', trigger: 'blur' }
                ],
                manufacturer: [
                    { required: true, message: '请输入生成厂家', trigger: 'blur' }
                ],
                valuation_id: [
                    { required: true, message: '请输入计价方式', trigger: 'blur' }
                ],
                retail_unit_id: [
                    { required: true, message: '请输入零售单位', trigger: 'blur' }
                ],
                goods_type_id: [
                    { required: true, message: '请输入分类', trigger: 'blur' }
                ],
                goods_brand_id: [
                    { required: true, message: '请输入商品品牌', trigger: 'blur' }
                ],
                supplier_id: [
                    { required: true, message: '请输入供货商', trigger: 'blur' }
                ],
                buying_price: [
                    { required: true, message: '请输入进货价', trigger: 'blur' }
                ],
                trade_price: [
                    { required: true, message: '请输入批发价', trigger: 'blur' }
                ],
                retail_price: [
                    { required: true, message: '请输入零售价', trigger: 'blur' }
                ],
                num: [
                    { required: true, message: '请输入num', trigger: 'blur' }
                ],
                is_rebate: [
                    { required: true, message: '请选择是否分润', trigger: 'blur' }
                ],
                market_price: [
                    { required: true, message: '请输入市场价', trigger: 'blur' }
                ]
            },
            multipleSelection: []
        }
    },
    methods: {


        //性别显示转换
        formatSex: function (row, column) {
            return row.is_sell == 1 ? '已上架' : row.is_sell == 0 ? '未上架' : '未知';
        },

        //
        append(store, data) {
            console.log(data)
            // store.append({ id: id++, label: 'testtest', children: [] }, data);
            this.editFormVisible = true;
            this.editFormTtile = '新增' + data.name + '下的权限';
            for (let key in this.editForm) {
                this.editForm[key] = '';
            }
            this.editForm.id = 0;
            this.editForm.pid = data.id;
        },

        remove(store, data) {
            var _this = this;
            this.$confirm('确认删除该记录吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                _this.listLoading = true;
                NProgress.start();
                let para = { id: data.id };
                request.post(config.api.author.authordelete, { id: data.id })
                    .then((res) => {
                        _this.listLoading = false;
                        NProgress.done();
                        let { message, code } = res;
                        if (code !== 200) {
                            this.$notify({
                                title: '错误',
                                message: message,
                                type: 'error'
                            });
                        } else {
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            // _this.getUsers();
                            store.remove(data);
                        }

                        // _this.getUsers();

                    })

            }).catch(() => {

            });


        },

        renderContent(h, { node, data, store }) {
            return (
                <span>
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span style="float: right; margin-right: 20px">
                        <el-button size="mini" on-click={() => this.append(store, data)}>添加</el-button>
                        <el-button size="mini" on-click={() => this.handleEdit(store, data)}>编辑</el-button>
                        <el-button size="mini" on-click={() => this.remove(store, data)}>删除</el-button>
                    </span>
                </span>);
        },

        //获取用户列表
        getUsers() {

            let para = {
                page: this.page,
                code: this.filters.code,
                // type_id:this.filters.type_id,
                name: this.filters.name
            };
            this.listLoading = true;
            NProgress.start();
            // getUserListPage(para).then((res) => {
            // 	this.total = res.data.total;
            // 	this.users = res.data.users;
            // 	this.listLoading = false;
            // 	NProgress.done();
            // });
            request.get(config.api.author.authorlist)
                .then((res) => {
                    this.listLoading = false;
                    NProgress.done();
                    let { message, code, data } = res;
                    if (code !== 200) {
                        this.$notify({
                            title: '错误',
                            message: message,
                            type: 'error'
                        });
                    } else {

                        // this.total = data.cnt.good.total;
                        this.users = this.data2 = data.cnt;
                        // this.pagesize = data.cnt.good.per_page || 10;
                    }
                })
        },
        //删除
        handleDel: function (row, data) {


            var _this = this;
            this.$confirm('确认删除该记录吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                _this.listLoading = true;
                NProgress.start();
                let para = { id: row.id };
                removeUser(para).then((res) => {
                    _this.listLoading = false;
                    NProgress.done();
                    _this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    _this.getUsers();
                });

            }).catch(() => {

            });
        },

        //显示编辑界面
        handleEdit: function (store, data) {
            console.log(data.id);
            let row = null;
            console.log(this.users)
            this.users.forEach(item => {
                if (item.id == data.id) {
                    row = item
                    return;
                }
                if (item.son && item.son instanceof Array) {
                    item.son.forEach(its => {
                        if (its.id == data.id) {
                            row = its
                            return;
                        }
                    })
                }
            })
            this.editFormVisible = true;
            this.editFormTtile = '编辑';
            for (let key in this.editForm) {
                this.editForm[key] = row[key];
            }

        },
        //编辑 or 新增
        editSubmit: function () {
            var _this = this;

            _this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let arr = [];
                    this.dynamicTags.forEach(item => {
                        arr.push({ name: item });
                    })
                    _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        _this.editLoading = true;
                        NProgress.start();
                        _this.btnEditText = '提交中';

                        if (!_this.editForm.id) {
                            //新增
                            let para = _this.editForm;
                            delete para.id;
                            request.post(config.api.author.authoradd, para)
                                .then(res => {
                                    let { message, code, data } = res;
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    if (code !== 200) {
                                        this.$notify({
                                            title: '错误',
                                            message: message,
                                            type: 'error'
                                        });
                                    } else {
                                        _this.$notify({
                                            title: '成功',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getUsers();
                                    }
                                })
                        } else {
                            //编辑
                            let para = _this.editForm;
                           
                            request.post(config.api.author.authoredit, para)
                                .then(res => {
                                    let { message, code, data } = res;
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    if (code !== 200) {
                                        this.$notify({
                                            title: '错误',
                                            message: message,
                                            type: 'error'
                                        });
                                    } else {
                                        _this.$notify({
                                            title: '成功',
                                            message: '更新成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getUsers();
                                    }
                                })

                        }

                    });

                }
            });

        },
        //显示新增界面
        handleAdd: function () {
            var _this = this;

            this.editFormVisible = true;
            this.editFormTtile = '新增';
            for (let key in this.editForm) {
                this.editForm[key] = '';
            }
            this.option = [];
            this.editForm.id = 0;
            this.editForm.pid = 0;

            // this.$router.push('/addshop');
        },
        //更改上下架
        toggleGoodsStatus(sta) {
            sta = sta == '0' ? 1 : 0;
            let arr = [];
            this.multipleSelection.forEach(data => {
                arr.push(data.id);
            })
            let para = {
                sell: sta,
                ids: arr.join(',')
            }
            this.toogleLoading = true;
            NProgress.start();
            request.post(config.api.goods.goodstooglestatus, para)
                .then(res => {
                    this.toogleLoading = false;
                    NProgress.done();
                    let { message, code, data } = res;
                    if (code !== 200) {
                        this.$notify({
                            title: '错误',
                            message: message,
                            type: 'error'
                        });
                    } else {
                        console.log(res)
                        this.$notify({
                            title: '成功',
                            message: message,
                            type: 'success'
                        });
                        this.getUsers();
                    }
                })

        }
    },
    mounted() {
        this.getUsers();
    }
}
</script>

<style scoped>
.el-card__header {
    background-color: #E4E4E4
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>