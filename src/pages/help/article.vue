<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
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
        </el-col>
    
        <!--列表-->
        <template>
            <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="title" label="名称" sortable>
                </el-table-column>
                <el-table-column prop="cover" label="封面" width="120" sortable>
                    <template scope="scope">
                        <img width="24" :src="scope.row.cover" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类别" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="intro" label="文章介绍" sortable>
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="formatStatus" width="150" sortable>
                    <!--<template scope="scope">
                            <el-button size="small" :type="scope.row.status == '0' ? 'primary' : 'success'" close-transition>{{scope.row.status == 1 ? '已启用' :scope.row.status == 0 ? '已停用' : '未知'}}</el-button>
                        </template>-->
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作">
                    <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </template>
    
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pagesize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="editForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                    <el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="简介" prop="intro">
                    <el-input v-model="editForm.intro" auto-complete="off"></el-input>
                </el-form-item>
    
                <el-form-item label="文章内容" prop="content">
                    <el-input v-model="editForm.content" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="文章分类" prop="cate_id">
                    <el-select v-model="editForm.cate_id" placeholder="请选择">
                        <el-option v-for="(item,index) in articlesorts" :key="index" :label="item.title " :value="item.id+''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章类别" prop="type">
                    <el-select v-model="editForm.type" placeholder="请选择">
                        <el-option label="文章" value="1"></el-option>
                        <el-option label="公告" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请选择">
                        <el-option label="正常 " value="1"></el-option>
                        <el-option label="审核中" value="2"></el-option>
                        <el-option label="禁用删除" value="3"></el-option>
                    </el-select>
                </el-form-item>
    
                <el-form-item label="跳转" prop="is_link">
                    <el-select v-model="editForm.is_link" placeholder="请选择">
                        <el-option label="正常跳转详情" value="1"></el-option>
                        <el-option label="不跳转详情" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input type="hidden" v-model="editForm.cover" auto-complete="off"></el-input>
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
import { mapState } from 'vuex';
export default {
    data() {
        return {
            filters: {
                title: '',
                page: 1,
                pagesize: 10
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
                id: 0,
                title: '',
                cover: '',
                cate_id: '0',
                intro: '',
                content: '',
                type: '',
                status: '',
                is_link: ''
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
            return row.type == 1 ? '文章' : row.type == 0 ? '公告' : '未知';
        },
        formatStatus(row, column) {
            return row.status == 1 ? '正常' : row.status == 2 ? '审核中' : '禁用删除';
        },
        //图片上传
        handleRemove(file, fileList) {
            this.editForm.logo = "";

        },
        handlePictureCardPreview(file) {

            //this.dialogImageUrl = file.url;
            //this.dialogVisible = true;
        },
        getUpstr() {

        },
        handlechange() {

        },
        handleBeforeup() {

        },
        filterTag(value, row) {

            return row.status === value;
        },
        handleCurrentChange(val) {
            this.page = val;
            this.filters.page = val;
            this.getUsers();
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.filters.pagesize = this.pagesize = val;
            this.getUsers();
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
            request.get(config.api.help.articlelist, this.filters)
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
                        this.pagesize = this.filters.pagesize = data.cnt.per_page || 10;
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
            this.editFormTtile = '编辑';
            this.editForm.id = row.id;
            this.editForm.title = row.title;
            this.editForm.cover = row.cover;
            this.editForm.cate_id = row.cate_id + '';
            this.editForm.intro = row.intro;
            this.editForm.content = row.content;
            this.editForm.type = row.type + '';
            this.editForm.status = row.status + '';
            this.editForm.is_link = row.is_link + '';
            this.filelist = row.cover ? [{ name: 'editlogo', url: row.cover }] : [];
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
        this.getarticlesort();
    }
}
</script>

<style scoped>

</style>