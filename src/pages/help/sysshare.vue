<template>
    <section>
        <!--工具条-->
        <!--<el-col :span="24" class="toolbar">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.title" placeholder="文章标题"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getUsers">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>-->
    
        <!--列表-->
        <template>
            <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="ping_fee" label="平台分润百分比"  sortable>
                </el-table-column>
                <el-table-column prop="shop_fee" label="店铺分润百分比" sortable>
                </el-table-column>
                <el-table-column prop="queque_fee" label="队列分润百分比"  sortable>
                </el-table-column>
                <el-table-column prop="fanli_fee" label="返利盘分润百分比"  sortable>
                </el-table-column>
                <el-table-column prop="balance" label="余额"  sortable>
                </el-table-column>
                <el-table-column prop="share_gold" label="分润金"  sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" >
                    <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
    
        <!--分页-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
                    <el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 200, 300, 400]" :page-size="pagesize" :total="total" style="float:right;">
                    </el-pagination>
                </el-col>-->
    
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="平台分润" prop="ping_fee">
                    <el-input v-model="editForm.ping_fee" auto-complete="off"></el-input>
                </el-form-item>
    
                <el-form-item label="店铺分润" prop="shop_fee">
                    <el-input v-model="editForm.shop_fee" auto-complete="off"></el-input>
                </el-form-item>
    
                <el-form-item label="队列分润" prop="queque_fee">
                    <el-input v-model="editForm.queque_fee" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="返利盘分润" prop="fanli_fee">
                    <el-input v-model="editForm.fanli_fee" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
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
                title: '',
                page: 1
            },
            articlesorts: [],
            //图片上传
            dialogImageUrl: '',
            dialogVisible: false,
            users: [],
            total: 0,
            page: 1,
            pagesize: 10,
            listLoading: false,
            editFormVisible: false,//编辑界面显是否显示
            editFormTtile: '编辑',//编辑界面标题
            shopdetailVisible: false,
            shopdetailtitle: '店铺详情',
            shopdetailobj: {

            },
            filelist: [],
            //编辑界面数据
            editForm: {
                ping_fee: '',
                shop_fee: '',
                queque_fee: '',
                fanli_fee: ''
            },
            editLoading: false,
            editstatusLoading: false,
            btnEditText: '提 交',
            editFormRules: {
                ping_fee: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                shop_fee: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ],
                queque_fee: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                fanli_fee: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.type == 1 ? '文章' : row.type == 0 ? '公告' : '未知';
        },
        formatStatus(row, column) {
            return row.status == 1 ? '正常' : row.status == 2 ? '审核中' : '禁用删除';
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
                        this.editForm.cover = (res.res.requestUrls[0]).split('?')[0];
                        //this.filelist.splice(0,1)
                        console.log((res.res.requestUrls[0]).split('?')[0])
                        this.filelist = [{ name: 'editpic', url: (res.res.requestUrls[0]).split('?')[0] }]
                    }).catch(err => {
                        console.log(err)
                    })
            })

        },
        //获取分类
        getarticlesort() {
            request.get(config.api.help.articlesortlist)
                .then((res) => {

                    let { message, code, data } = res;
                    if (code !== 200) {
                        this.$notify({
                            title: '错误',
                            message: message,
                            type: 'error'
                        });
                    } else {
                        // this.total = data.cnt.total;
                        this.articlesorts = data.cnt;
                        // this.pagesize = data.cnt.per_page || 10;
                    }
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
            request.get(config.api.help.showsyssharelist)
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
                        // this.total = data.cnt.total;
                        this.users = [data.cnt];
                        // this.pagesize = data.cnt.per_page || 10;
                    }
                })
        },
        //删除
        handleDel: function (row) {
            //console.log(row);
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
            this.editFormTtile = '分润合计100';

            this.editForm.ping_fee = row.ping_fee + '';
            this.editForm.shop_fee = row.shop_fee + '';
            this.editForm.queque_fee = row.queque_fee + '';
            this.editForm.fanli_fee = row.fanli_fee + '';
            // this.filelist = row.cover ? [{ name: 'editlogo', url: row.cover }] : [];
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
                            let para = _this.editForm;
                            request.post(config.api.help.addarticle, para)
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

                            let sum = (_this.editForm.ping_fee - 0) + (_this.editForm.shop_fee - 0) + (_this.editForm.queque_fee - 0) + (_this.editForm.fanli_fee - 0);

                            if (sum == 100) {
                                request.post(config.api.help.editsyssharelist, para)
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
                            } else {
                                _this.editLoading = false;
                                this.$notify({
                                    title: '错误',
                                    message: '分润比例必须合计为100',
                                    type: 'error'
                                });
                            }

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
            request.post(config.api.help.updatestatus, para)
                .then(res => {
                    let { message, code, data } = res;
                    _this.editstatusLoading = false;
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
                        _this.getUsers();
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

</style>