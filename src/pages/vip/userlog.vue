<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.order_sn" placeholder="订单号"></el-input>
				</el-form-item>
				<el-date-picker v-model="filters.s_time" type="datetime" placeholder="选择起始日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
				<el-date-picker v-model="filters.e_time" type="datetime" placeholder="选择结束日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
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
				<el-table-column prop="order_sn" label="订单号" width="180" sortable>
				</el-table-column>
				<el-table-column prop="type" label="类型" width="120" sortable>
				</el-table-column>
				<el-table-column prop="action_type" label="类型" width="120" sortable>
				</el-table-column>
				<el-table-column prop="money" label="金额" width="120" sortable>
				</el-table-column>
				<el-table-column prop="created_at" label="创建时间" min-width="180" sortable>
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
			filters: {
				name: '',
				order_sn: '',
				page: 1,
				pagesizes:10,
				s_time:"",
				e_time:"",
				user_id: this.$route.params.id
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
				user_id: this.$route.params.id
			};
			this.listLoading = true;
			NProgress.start();
			// getUserListPage(para).then((res) => {
			// 	this.total = res.data.total;
			// 	this.users = res.data.users;
			// 	this.listLoading = false;
			// 	NProgress.done();
			// });
			request.get(config.api.vip.banlancelog, this.filters)
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
						this.pagesize =this.filters.pagesize= data.cnt.per_page || 10;
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
			// this.$router.push('/addshop');
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

</style>