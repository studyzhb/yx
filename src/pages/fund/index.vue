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
                        <el-date-picker v-model="filters.s_time" type="datetime" placeholder="选择起始日期时间" align="right" :picker-options="pickerOptions1">
                        </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2"> - </el-col>
                    <el-col :span="11">
                        <el-date-picker v-model="filters.e_time" type="datetime" placeholder="选择起始日期时间" align="right" :picker-options="pickerOptions1">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="outputexcel" type="primary">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    
        <el-col :span="24" class="toolbar">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="全部" name="10"></el-tab-pane>
                <el-tab-pane label="未审核" name="0"></el-tab-pane>
                <el-tab-pane label="打款中" name="1"></el-tab-pane>
                <el-tab-pane label="已打款" name="2"></el-tab-pane>
                <el-tab-pane label="拒绝" name="3"></el-tab-pane>
            </el-tabs>
        </el-col>
        <!--列表-->
        <template>
            <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="user_mobile" label="用户名" sortable>
                </el-table-column>
                <el-table-column prop="card_tip" label="开户行" sortable>
                </el-table-column>
                <el-table-column prop="card_num" label="卡号" sortable>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="money" label="金额" sortable>
                </el-table-column>
                <el-table-column prop="created_at" label="时间" sortable>
                </el-table-column>
                <el-table-column inline-template :context="_self" label="操作">
                    <span>
                        <el-button v-if="row.status==0" size="small" @click="audit(row)">审核</el-button>
                        <el-button v-if="row.status==1" size="small" @click="confirmdone(row)">确认打款</el-button>
                        <!--<el-button size="small" @click="handleEdit(row)">明细</el-button>-->
                    </span>
                </el-table-column>
            </el-table>
        </template>
    
        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filters.page" :page-sizes="pagesizes" :page-size="pagesize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    
        <!-- 弹窗1 -->
        <el-dialog title="提现审核" :visible.sync="dialogFormVisible">
            <el-form :model="form" class="formBox">
                <p class="rechargeItem">提现:
                    <span v-text="form.money"></span>
                </p>
                <p class="rechargeItem">提现后:
                    <span v-text="form.user?form.user.balance:0"></span>
                </p>
                <p class="rechargeItem">手机号:
                    <span v-text="form.user_mobile"></span>
                </p>
                <p class="rechargeItem">姓名:
                    <span v-text="form.user?form.user.real_name:''"></span>
                </p>
                <p class="rechargeItem">身份证号:
                    <span v-text="form.user?form.user.id_card:''"></span>
                </p>
                <p class="rechargeItem">银行:
                    <span v-text="form.card_name"></span>
                </p>
                <p class="rechargeItem">银行卡号:
                    <span v-text="form.card_num"></span>
                </p>
            </el-form>
            <div class="tipsWrap">
                <ul class="tips">
                    <li>1.请仔细核对提现金额</li>
                    <li>2.确认审核时，请尽量查看用户交易流水是否正常</li>
                    <li>3.此操作是不可以逆转的，请谨慎操作</li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmToExamine">确认审核</el-button>
                <el-button @click="cancelToExamine">拒绝</el-button>
            </div>
        </el-dialog>
    
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
import { mapState } from 'vuex';
export default {
    data() {
        return {
            confirmid: '',
            excelout: config.api.fund.outputexcel,
            pickerOptions1: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            activeName: '10',
            filters: {
                name: '',
                dates: '',
                page: 1,
                pagesize:10,
                datee: '',
                user_mobile: '',
                status: '10',
                s_time: '',
                e_time: '',
                card_name: ''
            },
            dialogFormVisible: false,
            users: [],
            total: 0,
            page: 1,
            pagesize: 10,
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
            form: {

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
    computed: mapState({
        pagesizes: state => state.pagenum
    }),
    methods: {
        //性别显示转换
        formatSex(row, column) {
            switch (row.status) {
                case 0:
                    return '未审核';
                case 1:
                    return '打款中';
                case 2:
                    return '已打款';
                case 3:
                    return '已拒绝';

            }

        },
        //导出
        outputexcel() {
            open(config.outputexcel + config.api.fund.outputexcel, '_self')
        },
        handleClick(tab, event) {
            this.filters.page = 1;
            this.filters.status = tab.name;
            this.getUsers();
        },
        audit(row) {
            let _this = this;
            let para = {
                id: row.id
            }

            this.confirmid = row.id;

            this.$confirm('确认?', '提示', {
                //type: 'warning'
            }).then(() => {
                this.listLoading = true;
                NProgress.start();
                request.post(config.api.fund.checking, para)
                    .then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        let { message, code, data } = res;
                        if (code !== 200) {
                            _this.$notify({
                                title: '错误',
                                message: message,
                                type: 'error'
                            });
                        } else {
                            _this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            _this.getUsers();
                        }
                    })
            })
        },
        confirmdone(row) {
            this.form = row;
            this.confirmid = row.id;
            this.dialogFormVisible = true;

            return;
            // const h = this.$createElement;
            // let _this = this;
            // let para = {
            //     id: row.id
            // }
            // this.$msgbox({
            //     title: '消息',
            //     message: h('p', null, [
            //         h('span', null, '请选择 '),
            //         h('i', { style: 'color: teal' }, '121331')
            //     ]),
            //     showCancelButton: true,
            //     confirmButtonText: '确定',
            //     cancelButtonText: '拒绝',
            //     beforeClose: (action, instance, done) => {
            //         if (action === 'confirm') {
            //             instance.confirmButtonLoading = true;
            //             instance.confirmButtonText = '执行中...';
            //             setTimeout(() => {
            //                 done();
            //                 setTimeout(() => {
            //                     instance.confirmButtonLoading = false;
            //                 }, 300);
            //             }, 3000);
            //         } else {
            //             done();
            //         }
            //     }
            // }).then(action => {
            //     if (action === 'confirm') {
            //         _this.$prompt('备注信息', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            //             // inputErrorMessage: '邮箱格式不正确'
            //         }).then(({ value }) => {
            //             _this.listLoading = true;
            //             NProgress.start();
            //             para.status = 3;
            //             para.remark = value;
            //             request.post(config.api.fund.widthok, para)
            //                 .then(res => {
            //                     _this.listLoading = false;
            //                     NProgress.done();
            //                     let { message, code, data } = res;
            //                     if (code !== 200) {
            //                         _this.$notify({
            //                             title: '错误',
            //                             message: message,
            //                             type: 'error'
            //                         });
            //                     } else {
            //                         _this.$notify({
            //                             title: '成功',
            //                             message: '操作成功',
            //                             type: 'success'
            //                         });
            //                         _this.getUsers();
            //                     }
            //                 })
            //         }).catch(() => {
            //             this.$message({
            //                 type: 'info',
            //                 message: '取消输入'
            //             });
            //         });
            //     } else {
            //         _this.$prompt('备注信息', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            //             // inputErrorMessage: '邮箱格式不正确'
            //         }).then(({ value }) => {
            //             _this.listLoading = true;
            //             NProgress.start();
            //             para.status = 4;
            //             para.remark = value;
            //             request.post(config.api.fund.widthfalse, para)
            //                 .then(res => {
            //                     _this.listLoading = false;
            //                     NProgress.done();
            //                     let { message, code, data } = res;
            //                     if (code !== 200) {
            //                         _this.$notify({
            //                             title: '错误',
            //                             message: message,
            //                             type: 'error'
            //                         });
            //                     } else {
            //                         _this.$notify({
            //                             title: '成功',
            //                             message: '操作成功',
            //                             type: 'success'
            //                         });
            //                         _this.getUsers();
            //                     }
            //                 })
            //         }).catch(() => {
            //             this.$message({
            //                 type: 'info',
            //                 message: '取消输入'
            //             });
            //         });
            //     }
            // });
        },
        //确认打款 确认或拒绝
        confirmToExamine() {
            let para = {
                id: this.confirmid
            }

            this.dialogFormVisible = false;
            let _this = this;
            _this.$prompt('备注信息', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {
                _this.listLoading = true;
                NProgress.start();
                para.status = 3;
                para.note = value;
                request.post(config.api.fund.widthok, para)
                    .then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        let { message, code, data } = res;
                        if (code !== 200) {
                            _this.$notify({
                                title: '错误',
                                message: message,
                                type: 'error'
                            });
                        } else {
                            _this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            _this.getUsers();
                        }
                    })
            }).catch((e) => {
                console.log(e)
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        cancelToExamine() {
            let para = {
                id: this.confirmid
            }
            this.dialogFormVisible = false;
            let _this = this;
            _this.$prompt('备注信息', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {
                _this.listLoading = true;
                NProgress.start();
                para.status = 4;
                para.note = value;
                request.post(config.api.fund.widthfalse, para)
                    .then(res => {
                        _this.listLoading = false;
                        NProgress.done();
                        let { message, code, data } = res;
                        if (code !== 200) {
                            _this.$notify({
                                title: '错误',
                                message: message,
                                type: 'error'
                            });
                        } else {
                            _this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            _this.getUsers();
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        handleCurrentChange(val) {

            if (this.filters.page != val) {
                this.filters.page = val;
                this.getUsers();
            }

        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize=val;
            this.filters.pagesize=val;
            this.getUsers();
        },
        //获取用户列表
        getUsers() {
            let para = this.filters;
            this.listLoading = true;
            NProgress.start();

            request.get(config.api.fund.showlist, para)
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

<style scope lang="stylus" rel="stylesheet/stylus">
  .deliveryInput
  	width: 300px
  	margin: 0 auto
  .rechargeItem
  	margin: 12px 0
  	font-size: 16px
  &.add
  	color: red
  	.label
  		width: 100px
  		text-align: right
	.formBox
		width: 260px
		text-align: left
		margin: 0 auto
	.tipsWrap
		display: block
		text-align: center
		margin-top: 15px
  .tips
  	display: inline-block
  	margin: 0 auto
  	text-align: left
  	li
			margin-bottom: 8px
			font-size: 14px
			color: #848282
  	
</style>