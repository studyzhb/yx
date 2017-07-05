<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.user_mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="范围选择">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="filters.s_time" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2"> - </el-col>
                    <el-col :span="11">
                        <el-time-picker type="date" placeholder="选择时间" v-model="filters.e_time" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" >导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    
        <el-col :span="24" class="toolbar">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="全部" name="first"></el-tab-pane>
                <el-tab-pane label="未审核" name="second"></el-tab-pane>
                <el-tab-pane label="已审核" name="third"></el-tab-pane>
                <el-tab-pane label="已打款" name="fourth"></el-tab-pane>
                <el-tab-pane label="拒绝" name="five"></el-tab-pane>
            </el-tabs>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="user_mobile" label="用户名" width="100" sortable>
                </el-table-column>
                <el-table-column prop="card_tip" label="开户行" width="100" sortable>
                </el-table-column>
                <el-table-column prop="card_num" label="卡号" width="120" sortable>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="money" label="金额" width="150" sortable>
                </el-table-column>
                <el-table-column prop="created_at" label="时间" width="150" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作" min-width="200">
                    <span>
                        <el-button size="small" @click="audit">审核</el-button>
                        <el-button size="small" @click="handleEdit(row)">明细</el-button>
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
                <el-form-item label="手机号" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员状态">
                    <el-switch on-text="" off-text="" v-model="editForm.delivery"></el-switch>
                </el-form-item>
                <el-form-item label="队列资格">
                    <el-switch on-text="" off-text="" v-model="editForm.delivery"></el-switch>
                </el-form-item>
                <el-form-item label="密码" prop="ceshi">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="籍贯" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="银行卡" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
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
import request from 'api';
import config from 'config';

export default {
    data() {
        return {
            activeName:'first',
            filters: {
                name: '',
                dates: '',
                datee: ''
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
        formatSex(row, column) {
            return row.status == 1 ? '启用' : row.sex == 0 ? '停用' : '未知';
        },
        handleClick(){

        },
        audit() {

        },
        handleCurrentChange(val) {
            this.page = val;
            this.getUsers();
        },
        handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
        //获取用户列表
        getUsers() {
            let para = {
                page: this.page,
                name: this.filters.name
            };
            this.listLoading = true;
            NProgress.start();

            request.get(config.api.fund.showlist,para)
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

</style>