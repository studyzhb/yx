<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item label="供应商">
                    <el-input v-model="filters.name" placeholder="供应商"></el-input>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="filters.name" placeholder="编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">搜索</el-button>
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
                <el-table-column prop="name" label="编号" width="120" sortable>
                </el-table-column>
                <el-table-column prop="name" label="供应商" width="120" sortable>
                </el-table-column>
                <el-table-column prop="name" label="地址" width="120" sortable>
                </el-table-column>
                <el-table-column prop="addr" label="电话" width="180" sortable>
                </el-table-column>
                <el-table-column prop="sex" label="联系人" width="180" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="sex" label="联系人电话" width="180" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" min-width="320">
                    <span>
                        <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                        <!--<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>-->
                    </span>
                </el-table-column>
            </el-table>
        </template>
    
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    
        <!--编辑界面-->
        <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
    
                <el-form-item label="品牌名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-upload class="upload-demo" drag action="" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editForm.desc"></el-input>
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
import util from '../../common/util'
import NProgress from 'nprogress'
import { getUserListPage, removeUser, editUser, addUser } from '../../api/api';

export default {
    data() {
        return {
            filters: {
                name: ''
            },
            users: [],
            total: 0,
            page: 1,
            listLoading: false,
            editFormVisible: false,//编辑界面显是否显示
            editFormTtile: '编辑',//编辑界面标题
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                sex: -1,
                age: 0,
                birth: '',
                addr: ''
            },
            editLoading: false,
            btnEditText: '提 交',
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getUsers();
        },
        //获取用户列表
        getUsers() {
            let para = {
                page: this.page,
                name: this.filters.name
            };
            this.listLoading = true;
            NProgress.start();
            getUserListPage(para).then((res) => {
                this.total = res.data.total;
                this.users = res.data.users;
                this.listLoading = false;
                NProgress.done();
            });
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
        //显示编辑界面
        handleEdit: function (row) {
            this.editFormVisible = true;
            this.editFormTtile = '编辑';
            this.editForm.id = row.id;
            this.editForm.name = row.name;
            this.editForm.sex = row.sex;
            this.editForm.age = row.age;
            this.editForm.birth = row.birth;
            this.editForm.addr = row.addr;
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
                                sex: _this.editForm.sex,
                                age: _this.editForm.age,
                                birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                                addr: _this.editForm.addr,
                            };
                            addUser(para).then((res) => {
                                _this.editLoading = false;
                                NProgress.done();
                                _this.btnEditText = '提 交';
                                _this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                _this.editFormVisible = false;
                                _this.getUsers();
                            });
                        } else {
                            //编辑
                            let para = {
                                id: _this.editForm.id,
                                name: _this.editForm.name,
                                sex: _this.editForm.sex,
                                age: _this.editForm.age,
                                birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
                                addr: _this.editForm.addr,
                            };
                            editUser(para).then((res) => {
                                _this.editLoading = false;
                                NProgress.done();
                                _this.btnEditText = '提 交';
                                _this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                _this.editFormVisible = false;
                                _this.getUsers();
                            });

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

            this.editForm.id = 0;
            this.editForm.name = '';
            this.editForm.sex = 1;
            this.editForm.age = 0;
            this.editForm.birth = '';
            this.editForm.addr = '';
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