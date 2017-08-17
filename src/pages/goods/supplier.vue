<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item label="供应商">
					<el-input v-model="filters.name" placeholder="供应商"></el-input>
				</el-form-item>
				<el-form-item label="编码">
					<el-input v-model="filters.code" placeholder="编码"></el-input>
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
				<el-table-column prop="code" label="编号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="name" label="供应商" sortable>
				</el-table-column>
				<el-table-column prop="address" label="地址" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="电话" sortable>
				</el-table-column>
				<el-table-column prop="link_name" label="联系人" sortable>
				</el-table-column>
				<el-table-column prop="link_tel" label="联系人电话" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作">
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<!--<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>-->
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
			<el-form ref="form" :model="form" label-width="100px" :rules="editFormRules" @submit.prevent="onSubmit">
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="link_name">
					<el-input v-model="form.link_name"></el-input>
				</el-form-item>
				<el-form-item label="联系人电话" prop="link_tel">
					<el-input v-model="form.link_tel"></el-input>
				</el-form-item>
				<el-form-item label="微信" prop="wechat">
					<el-input v-model="form.wechat"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="emali">
					<el-input v-model="form.emali"></el-input>
				</el-form-item>
				<el-form-item label="QQ" prop="qq">
					<el-input v-model="form.qq"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
	
				<el-form-item label="地址" prop="province">
					<el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleaddresschange">
					</el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="address">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="note">
					<el-input type="textarea" v-model="form.note"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button :loading="editLoading" type="primary" @click="saveShop">{{btnEditText}}</el-button>
					<el-button @click.native.prevent="returnShop">取消</el-button>
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
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			filters: {
				name: '',
				code: '',
				page: 1,
				pagesize: 10
			},
			options: regionData,
			selectedOptions: [],
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
			form: {
				id: 0,
				name: '',
				link_name: '',
				phone: '',
				link_tel: '',
				province: '',
				city: '',
				area: '',
				address: '',
				wechat: '',
				qq: '',
				emali: '',
				note: ""
			},
			editLoading: false,
			btnEditText: '提 交',
			editFormRules: {
				name: [
					{ required: true, message: '请输入供应商名称', trigger: 'blur' }
				],
				link_name: [
					{ required: true, message: '请输入联系人名称', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入固定电话', trigger: 'blur' },
				],
				link_tel: [
					{ required: true, message: '请输入联系人电话', trigger: 'blur' }
				],
				province: [
					{ required: true, message: '请选择地区', trigger: 'blur' }
				],
				city: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				area: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请输入详细地址', trigger: 'blur' }
				],
				wechat: [
					{ required: true, message: '请输入微信号', trigger: 'blur' }
				],
				qq: [
					{ required: true, message: '请输入QQ', trigger: 'blur' }
				],
				emali: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
				],
				note: [
					{ required: true, message: '请填写备注', trigger: 'blur' }
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
			this.filters.pagesize = this.pagesize = val;
			this.getUsers();
		},
		handleaddresschange(value) {

			this.form.province = CodeToText[value[0]]
			this.form.city = CodeToText[value[1]]
			this.form.area = CodeToText[value[value.length - 1]]
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
			request.get(config.api.goods.supplierindex, this.filters)
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
				.catch(err => {
					this.listLoading = false;
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
			this.editFormVisible = true;
			this.editFormTtile = '编辑';
			for (let key in this.form) {
				this.form[key] = row[key]
			}
			this.editForm.id = row.id;
			this.selectedOptions = [];

			this.selectedOptions = [TextToCode[row.province].code, TextToCode[row.province][row.city].code, TextToCode[row.province][row.city][row.area].code];

			// this.editForm.id = row.id;
			// this.editForm.name = row.name;
			// this.editForm.sex = row.sex;
			// this.editForm.age = row.age;
			// this.editForm.birth = row.birth;
			// this.editForm.addr = row.addr;

			// this.$router.push('/addsupplier/' + row.id);

		},
		saveShop() {
			var _this = this;

			_this.$refs.form.validate((valid) => {
				if (valid) {

					_this.$confirm('确认提交吗？', '提示', {}).then(() => {
						_this.editLoading = true;
						NProgress.start();
						_this.btnEditText = '提交中';

						if (_this.form.id == 0) {

							//新增
							let para = _this.form;
							delete para.id;

							request.post(config.api.goods.addsupplier, para)
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
								}).catch(err => {
									_this.editLoading = false;
								})
						} else {
							//编辑

							request.post(config.api.goods.updatesupplier, _this.form)
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
								}).catch(err => {
									_this.editLoading = false;
								})

						}

					});

				}
			});
			// this.$router.replace('/shop')
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
			for (let key in this.form) {
				this.form[key] = '';
			}
			this.form.id = 0;
			// this.$router.push('/addsupplier/0');
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