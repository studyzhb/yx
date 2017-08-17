<template>
	<section>
		<!--工具条-->
		<!--<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.shopname" placeholder="商户名称"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>-->
	
		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="shopname" label="商户名称"  sortable>
				</el-table-column>
				<el-table-column prop="name" label="队列名称" sortable>
				</el-table-column>
				<el-table-column prop="min_amount" label="最低消费"  sortable>
				</el-table-column>
				<el-table-column prop="max_amount" label="最高消费"  sortable>
				</el-table-column>
				<el-table-column prop="day_amount" label="当日最高交易额限制" width="200" sortable>
				</el-table-column>
				<el-table-column prop="spec" label="队列订单间隔"  width="180" sortable>
				</el-table-column>
				<el-table-column prop="poundage" label="手续费"  sortable>
				</el-table-column>
                <el-table-column prop="status" label="状态" :formatter="formatSex" sortable>
				</el-table-column>
                <el-table-column prop="max_total_amount" label="最高交易额" width="150" sortable>
				</el-table-column>
                <el-table-column prop="max_total_order" label="最大订单交易量" width="180"  sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" >
					<span>
						<el-button size="small" type="primary" @click="handleEdit(row)" icon="edit"></el-button>
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
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="最大交易额" prop="max_total_amount">
					<el-input v-model="editForm.max_total_amount" :disabled="false" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最高交易单数" prop="max_total_order">
					<el-input v-model="editForm.max_total_order" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户单日订单数" prop="user_day_order">
					<el-input v-model="editForm.user_day_order" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否可回购" prop="can_back">
					<el-switch v-model="editForm.can_back" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item v-if="editForm.can_back==='1'" label="回购价" prop="buy_back_money" :rules="[{required:true}]">
					<el-input v-model="editForm.buy_back_money" auto-complete="off"></el-input>
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
import {mapState} from 'vuex';
export default {
	data() {
		return {
			filters: {
				page:1,
				shopname:'',
				pagesize:10
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
				id: 0,
				max_total_amount:'',
				max_total_order:'',
				can_back:'0'
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
			return row.status == 1 ? '开启' : row.status == 2 ? '关闭' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.filters.page = val;
			this.getUsers();
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.filters.pagesize=this.pagesize=val;
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
			request.get(config.api.shop.showshopqueuelist,this.filters)
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
		//显示编辑界面
		handleEdit: function (row) {
			this.editFormVisible = true;
			this.editFormTtile = '编辑';
            this.editForm.id = row.id;
			this.editForm.max_total_amount=row.max_total_amount;
			this.editForm.max_total_order=row.max_total_order;
			this.editForm.user_day_order=row.user_day_order;
			this.editForm.can_back=row.can_back+'';
			this.editForm.buy_back_money=row.buy_back_money;
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
							request.post(config.api.shop.update, para)
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
							if(_this.editForm.can_back==='0'){
								delete _this.editForm.buy_back_money
							}
							request.post(config.api.shop.updateshopqueueinfo, para)
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