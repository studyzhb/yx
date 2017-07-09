<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	
		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="user_mobile" label="手机号" width="150" sortable>
				</el-table-column>
				<el-table-column prop="user_nickname" label="昵称" width="100" sortable>
				</el-table-column>
				<el-table-column prop="real_name" label="姓名" width="100" sortable>
				</el-table-column>
				<el-table-column prop="id_card" label="身份证号" width="180" sortable>
				</el-table-column>
				<el-table-column prop="created_at" label="注册时间" width="180" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="绑定店铺" width="150" sortable>
				</el-table-column>
				<el-table-column prop="name" label="金额（平台）" width="150" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" min-width="200">
					<span>
						<el-button size="small" @click="getUserLog(row)">流水</el-button>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
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
				<el-form-item label="手机号" prop="user_mobile">
					<el-input v-model="editForm.user_mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="会员状态">
					<el-switch on-text="" off-text="" v-model="editForm.delivery"></el-switch>
				</el-form-item>
				<el-form-item label="队列资格">
					<el-switch on-text="" off-text="" v-model="editForm.delivery"></el-switch>
				</el-form-item>
				<el-form-item label="密码" prop="ceshi">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="real_name">
					<el-input v-model="editForm.real_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="身份证" prop="id_card">
					<el-input v-model="editForm.id_card" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="籍贯" prop="">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开户行" prop="">
					<el-input v-model="editForm.bank" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="银行卡" prop="">
					<el-input v-model="editForm.card" auto-complete="off"></el-input>
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
			filters: {
				name: ''
			},
			users: [],
			total: 0,
			page: 1,
			pagesize: 10,
			listLoading: false,
			editFormVisible: false,//编辑界面显是否显示
			editFormTtile: '编辑',//编辑界面标题
			//编辑界面数据
			editForm: {
				id: 0
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
			request.get(config.api.vip.index)
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
			this.editForm=row;
		},
		//会员流水
		getUserLog(row){
			this.$router.push('/viplog/'+row.id);
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
							delete para.id;
							request.post(config.api.vip.update, para)
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
							request.post(config.api.vip.update, para)
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