<template>
    <section>
        <el-col :span="24" class="toolbar">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm1">
                        <el-card class="box-card" style="margin-bottom:20px" v-show="activeName==='first'">
                            <div slot="header" class="clearfix">
                                <span style="line-height: 20px;">基本信息</span>
                            </div>
                            <el-form-item label="商品名称" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="商品编码" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="国际条形码" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="规格" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="原产地" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="生产厂家" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="计价方式" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="editForm.sex" placeholder="请选择性别">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="零售单位" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="editForm.sex" placeholder="请选择性别">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分类" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="editForm.sex" placeholder="请选择性别">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品牌" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="editForm.sex" placeholder="请选择性别">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="供应商" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="editForm.sex" placeholder="请选择性别">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
    
                        </el-card>
                        <el-card class="box-card" v-show="activeName==='first'">
                            <div slot="header" class="clearfix">
                                <span style="line-height: 20px;">价格信息</span>
                            </div>
                            <el-form-item label="进货价" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="批发价" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="利润率" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="editForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-card>
                    </el-form>
    
                </el-tab-pane>
                <el-tab-pane label="商品详情" name="second">
                     <el-form :model="editForm" label-width="80px" class="phoneBg" :rules="editFormRules" ref="editForm" style="width:800px;height:600px;">

                     </el-form>
                    
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <!--列表-->
        <template>
    
        </template>
    
    </section>
</template>

<script>
import util from '../../common/util'
import NProgress from 'nprogress'
import { getUserListPage, removeUser, editUser, addUser } from '../../api/api';

export default {
    data() {
        return {
            activeName: 'first',
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
        handleClick() {

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
            // this.editFormVisible = true;
            // this.editFormTtile = '编辑';
            // this.editForm.id = row.id;
            // this.editForm.name = row.name;
            // this.editForm.sex = row.sex;
            // this.editForm.age = row.age;
            // this.editForm.birth = row.birth;
            // this.editForm.addr = row.addr;
            this.$router.push('/goods-detail-edit')
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

.phoneBg {
    background: url('../../assets/iphone.png') no-repeat 0 0;

    background-size: contain;
}
</style>