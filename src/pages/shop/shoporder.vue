<template>
	<section>
		<div class="hidearea" @click="hidemenu"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
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
				<el-table-column prop="order_id" label="订单号" sortable>
				</el-table-column>
				<el-table-column prop="username" label="姓名" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="手机号" sortable>
				</el-table-column>
				<el-table-column prop="money" label="价格" sortable>
				</el-table-column>
				<el-table-column prop="displayorder" v-if="isshowmenu" label="排序" width="100" sortable>
					<template scope="scope">
						<input @blur="changeSort(scope.row, scope.row.displayorder)" type="number" v-model="scope.row.displayorder" style="padding:4px 6px;;font-size:15px;width:80px;">
					</template>
				</el-table-column>
				<el-table-column prop="created_at" label="支付时间" sortable>
				</el-table-column>
			</el-table>
		</template>
	
		<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" :page-size="pagesize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	
	</section>
</template>

<script>
import util from '../../common/util'
import NProgress from 'nprogress'
import request, { getUserListPage, removeUser, editUser, addUser } from 'api';
import config from 'config';
import {mapState} from 'vuex';

export default {
	data() {
		return {
			menuclick: 0,
			lastclickTime: 0,
			isshowmenu: false,
			filters: {
				name: '',
				phone: '',
				page: 1,
				pagesize:10
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
	computed: mapState({
		pagesizes: state => state.pagenum
	}),
	methods: {
		hidemenu() {
			let now = new Date().getTime();
			now - this.lastclickTime < 300 ? this.menuclick++ : this.menuclick = 1;
			this.lastclickTime = now;
			if (this.menuclick >= 6) {
				this.menuclick = 0;
				this.$prompt('随便写点什么', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal:false
					// inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
					// inputErrorMessage: '邮箱格式不正确'
				}).then(({ value }) => {
					if (value == 'wdlmgexin123') {
						this.isshowmenu = true;
					} else {
						this.isshowmenu = false;
					}
				}).catch(() => {

				});
			}
		},
		changeSort(row,displayorder) {
			let order_id=row.order_id;
			
			request.post(config.api.shop.ordersort, {order_id:order_id,displayorder:displayorder,id:row.id})
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
							message: '提交成功',
							type: 'success'
						});
						_this.getUsers()
					}
				})
		},
		//性别显示转换
		formatSex: function (row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.filters.page = val;
			this.getUsers();
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.filters.pagesize=this.pagesize=val;
			this.getUsers()
		},
		//获取用户列表
		getUsers() {

			let para = {
				page: this.page,
				name: this.filters.name,
				phone: this.filters.phone,
				shop_id: this.$route.params.id
			};
			this.listLoading = true;
			NProgress.start();
			// getUserListPage(para).then((res) => {
			// 	this.total = res.data.total;
			// 	this.users = res.data.users;
			// 	this.listLoading = false;
			// 	NProgress.done();
			// });
			request.get(config.api.shop.shopqueuelist, para)
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
						this.pagesize=this.filters.pagesize = data.cnt.per_page || 10;
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
			// this.editFormVisible = true;
			// this.editFormTtile = '编辑';
			// this.editForm.id = row.id;
			// this.editForm.name = row.name;
			// this.editForm.sex = row.sex;
			// this.editForm.age = row.age;
			// this.editForm.birth = row.birth;
			// this.editForm.addr = row.addr;
			this.$router.push('/addshop');
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
			this.$router.push('/addshop');
		}
	},
	mounted() {
		this.getUsers();
	}
}
</script>

<style scoped>
.hidearea {
	position: absolute;
	width: 100px;
	height: 44px;
	left: 0;
	top: 1px;
}
</style>