<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.shopname" placeholder="店铺名称"></el-input>
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
				<el-table-column prop="login" label="编号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="shopname" label="名称" width="120" sortable>
				</el-table-column>
				<el-table-column prop="shopuser" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="status" label="状态" :formatter="formatSex" width="120" sortable>
	
				</el-table-column>
				<el-table-column prop="card" label="身份证号" width="180" sortable>
				</el-table-column>
				<el-table-column prop="created_at" label="注册时间" width="180" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" min-width="320">
					<span>
						<el-button size="small" @click="showshopdetail(row)">队列资料</el-button>
						<el-button size="small" @click="showorder(row)">订单</el-button>
						<el-button size="small" @click="getShopLog(row)">流水</el-button>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>
	
		<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[100, 200, 300, 400]" :page-size="pagesize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	
		<!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<!--<el-select v-model="editForm.sex" placeholder="请选择性别">
										<el-option label="男" :value="1"></el-option>
										<el-option label="女" :value="0"></el-option>
									</el-select>-->
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>
		<!--店铺详情-->
		<el-dialog :title="shopdetailtitle" v-model="shopdetailVisible" :close-on-click-modal="false">
			<el-form :model="shopdetailobj" label-width="80px">
				<el-form-item label="队列名称" prop="name">
					<el-input v-model="shopdetailobj.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最低消费" prop="name">
					<el-input v-model="shopdetailobj.min_amount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最高消费" prop="name">
					<el-input v-model="shopdetailobj.max_amount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="间隔人数" prop="name">
					<el-input v-model="shopdetailobj.spec" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手续费" prop="name">
					<el-input v-model="shopdetailobj.spec" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="规则描述" prop="name">
					<el-input type="textarea" v-model="shopdetailobj.desc"></el-input>
				</el-form-item>
			</el-form>
	
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/util'
import NProgress from 'nprogress'
import request, { getUserListPage, removeUser, editUser, addUser } from 'api';
import config from 'config';

export default {
	data() {
		return {
			filters: {
				shopname: '',
				page:1
			},
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
			//编辑界面数据
			editForm: {
				id: 0,
				name: '',
				
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
			return row.status == 1 ? '启用' : row.status == 0 ? '停用' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.filters.page = val;
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
			// getUserListPage(para).then((res) => {
			// 	this.total = res.data.total;
			// 	this.users = res.data.users;
			// 	this.listLoading = false;
			// 	NProgress.done();
			// });
			console.log(request);
			request.get(config.api.shop.showlist,this.filters)
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
				request.post(config.api.shop.delete,para)
					.then((res) => {
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
								message: message,
								type: 'sucess'
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
			this.$router.push('/shoporder/' + row.id);
		},
		getShopLog(row) {
			this.$router.push('/shoplog/' + row.id);
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
			this.$router.push('/addshop/' + row.id);
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
			// var _this = this;

			// this.editFormVisible = true;
			// this.editFormTtile = '新增';

			// this.editForm.id = 0;
			// this.editForm.name = '';
			// this.editForm.sex = 1;
			// this.editForm.age = 0;
			// this.editForm.birth = '';
			// this.editForm.addr = '';
			this.$router.push('/addshop/0');
		},
		updatestatus(row) {
			let _this = this;

			let para = {
				id: row.id,
				status: row.status == 0 ? 1 : 0
			};
			request.post('', para)
				.then(res => {
					let { message, code, data } = res;

					NProgress.done();

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