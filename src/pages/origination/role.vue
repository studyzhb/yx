<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters" style="margin-bottom:10px;">
                <!--<el-form-item>
                                            <el-input v-model="filters.name" placeholder="银行名称"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" v-on:click="getUsers">查询</el-button>
                                        </el-form-item>
                                        <el-form-item>-->
                <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    
        <!--列表-->
        <template>
            <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="名称"  sortable>
                </el-table-column>
                <!--<el-table-column prop="logo" label="图标" width="120" sortable>
                                            <template scope="scope">
                                                <img width="24" :src="scope.row.logo" alt="">
                                            </template>
                                        </el-table-column>-->
                <el-table-column prop="status" label="状态"  sortable>
                    <template scope="scope">
                        <el-button size="small" @click="updatestatus(scope.row)" :type="scope.row.status == '2' ? 'primary' : 'success'" close-transition>{{scope.row.status == 1 ? '已启用' :scope.row.status == 2 ? '已停用' : '未知'}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间"  sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" >
                    <span>
                        <!--<el-button size="small" @click="handleEdit(row)">编辑</el-button>-->
                        <el-button size="small" @click="handlelook(row)">设置角色</el-button>
                        <el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
    
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 200, 300, 400]" :page-size="pagesize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="editForm.status" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="2">
                    </el-switch>
                </el-form-item>
    
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
        <!--查看编辑角色界面-->
        <el-dialog :title="editFormTtile" v-model="lookFormVisible" :close-on-click-modal="false">
            <el-tree :data="data2" show-checkbox node-key="id" highlight-current ref="tree" :default-checked-keys="checked" :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="lookFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="confirmRole" :loading="lookLoading">{{btnEditText}}</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import util from 'common/util'
import NProgress from 'nprogress'
import request, { getUserListPage, removeUser, editUser, addUser } from 'api';
import config from 'config';
import Sign from 'common/sign'
export default {
    data() {
        return {
            filters: {
                name: '',
                page: 1
            },
            data2: [],
            checked: [],
            defaultProps: {
                children: 'son',
                label: 'name'
            },
            //图片上传
            dialogImageUrl: '',
            dialogVisible: false,
            users: [],
            total: 0,
            page: 1,
            pagesize: 10,
            listLoading: false,
            editFormVisible: false,//编辑界面显是否显示
            lookLoading: false,
            lookFormVisible: false,
            editFormTtile: '编辑',//编辑界面标题
            shopdetailVisible: false,
            shopdetailtitle: '店铺详情',
            shopdetailobj: {

            },
            filelist: [],
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                status: ''
            },
            editLoading: false,
            editstatusLoading: false,
            btnEditText: '提 交',
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                logo: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.status == 1 ? '已启用' : row.status == 2 ? '已停用' : '未知';
        },
        //图片上传
        handleRemove(file, fileList) {
            this.editForm.logo = "";
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            console.log(file)
            console.log('qianzhi')
            //this.dialogImageUrl = file.url;
            //this.dialogVisible = true;
        },
        getUpstr() {
            console.log('chenggongshi ')
        },
        handlechange() {
            console.log('handlechange ')
        },
        handleBeforeup() {
            console.log('handleBeforeup ')
        },
        filterTag(value, row) {
            console.log(value)
            console.log(row)
            return row.status === value;
        },
        handleCurrentChange(val) {
            this.page = val;
            this.filters.page = val;
            this.getUsers();
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleRequestOss(files) {


            // client.list({
            //     'max-keys': 10
            // }).then(res => {
            //     console.log(res)
            // }).catch(err => {
            //     console.log(err)
            // })

            let file = files.file
            Sign.then((client) => {
                client.multipartUpload('/pic/' + file.name, file)
                    .then(res => {
                        this.editForm.logo = (res.res.requestUrls[0]).split('?')[0];
                        //this.filelist.splice(0,1)
                        console.log((res.res.requestUrls[0]).split('?')[0])
                        this.filelist = [{ name: 'editpic', url: (res.res.requestUrls[0]).split('?')[0] }]
                    }).catch(err => {
                        console.log(err)
                    })
            })

        },
        //获取用户列表
        getUsers() {

            let para = {
                page: this.page,
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
            request.get(config.api.author.rolelist, this.filters)
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
                        this.total = data.cnt.total;
                        this.users = data.cnt.data;
                        this.pagesize = data.cnt.per_page || 10;
                    }
                })
        },
        //删除
        handleDel: function (row) {
            //console.log(row);
            var _this = this;
            this.$confirm('确认删除该角色吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                _this.listLoading = true;
                NProgress.start();
                let para = { id: row.id };

                request.post(config.api.author.roledelete, para)
                    .then((res) => {
                        _this.listLoading = false;
                        NProgress.done();

                        let { message, code, data } = res;
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
                            _this.getUsers();
                        }

                    })

            }).catch(() => {

            });
        },
        showshopdetail(row) {
            this.shopdetailVisible = true;
            request.get(config.api.shop.shopqueuedetail, { shop_id: row.id })
                .then((res) => {
                    let { message, code, data } = res;
                    if (code !== 200) {
                        this.$notify({
                            title: '错误',
                            message: message,
                            type: 'error'
                        });
                    } else {
                        this.shopdetailobj = data.cnt;
                    }
                })
        },
        //显示店铺订单
        showorder(row) {
            this.$router.push('/shoporder');
        },
        //显示编辑界面
        handleEdit: function (row) {
            console.log(row)
            this.editFormVisible = true;
            this.editFormTtile = '编辑';
            this.editForm.id = row.id;
            this.editForm.name = row.name;
            this.editForm.status = row.status + '';
            // this.editForm.logo = row.logo;
            // this.filelist = [{ name: 'editlogo', url: row.logo }]
        },
        handlelook(row) {
            this.editForm.id = row.id;
            let para = {
                id: row.id
            }
            this.lookLoading = false;
            this.btnEditText = '提 交';
            request.get(config.api.author.roleAuthor, para)
                .then(res => {
                    let { message, code, data } = res;
                    if (code !== 200) {
                        this.$notify({
                            title: '错误',
                            message: message,
                            type: 'error'
                        });
                    } else {
                        this.data2 = data.cnt;
                        this.checked = [];
                        this.data2.forEach(item => {
                            if (item.son && item.son instanceof Array) {
                                item.son.forEach(its => {
                                    if (its.check) {
                                        this.checked.push(its.id);
                                    }
                                })
                            } else {
                                if (item.check) {
                                    this.checked.push(item.id)
                                }
                            }
                        })
                        this.lookFormVisible = true;
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        },
        confirmRole() {
            let _this = this;
            let checkedkeys=this.$refs.tree.getCheckedKeys();
            let para = {
                id: this.editForm.id,
                actionids: checkedkeys.join(',')
            }
            _this.lookLoading = true;
            NProgress.start();
            _this.btnEditText = '提交中';
            console.log(para);
            request.post(config.api.author.roleedit, para)
                .then(res => {
                    let { message, code, data } = res;
                    _this.lookLoading = false;
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
                        _this.lookFormVisible = false;
                        _this.getUsers();
                    }
                })
        },
        //编辑 or 新增
        editSubmit: function () {
            var _this = this;

            _this.$refs.editForm.validate((valid) => {
                if (valid) {

                    _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        _this.editLoading = true;
                        NProgress.start();
                        _this.btnEditText = '提交中';

                        if (_this.editForm.id == 0) {
                            //新增
                            let para = {
                                name: _this.editForm.name,
                                logo: _this.editForm.logo,
                            };
                            request.post(config.api.author.roleadd, para)
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
                            let para = {
                                id: _this.editForm.id,
                                name: _this.editForm.name,
                                logo: _this.editForm.logo,

                            };
                            request.post(config.api.author.roleedit, para)
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
            this.filelist = [];

            this.editFormTtile = '新增';
            for (let key in this.editForm) {
                this.editForm[key] = '';
            }

            this.editForm.id = 0;
            setTimeout(() => {
                this.editFormVisible = true;
            }, 100)

        },
        //更新状态
        updatestatus(row) {
            let _this = this;
            this.editstatusLoading = true;
            let para = {
                id: row.id,
                status: row.status == 0 ? 1 : 0
            };
            // request.post(config.api.help.updatestatus, para)
            //     .then(res => {
            //         let { message, code, data } = res;
            //         _this.editstatusLoading = false;
            //         NProgress.done();
            //         _this.btnEditText = '提 交';
            //         if (code !== 200) {
            //             this.$notify({
            //                 title: '错误',
            //                 message: message,
            //                 type: 'error'
            //             });
            //         } else {
            //             _this.$notify({
            //                 title: '成功',
            //                 message: '更新成功',
            //                 type: 'success'
            //             });
            //             _this.getUsers();
            //         }
            //     })
        }
    },
    mounted() {
        this.getUsers();
    }
}
</script>

<style scoped>

</style>