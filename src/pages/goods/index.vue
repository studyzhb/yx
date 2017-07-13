<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.code" placeholder="国际条形码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">搜索</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	
		<el-col :span="24" class="toolbar">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="全部" name="10"></el-tab-pane>
				<el-tab-pane :label="pick" name="1"></el-tab-pane>
				<el-tab-pane :label="notpick" name="0"></el-tab-pane>
			</el-tabs>
		</el-col>
	
		<!--列表-->
		<template>
			<el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="商品名称" width="120" sortable>
				</el-table-column>
				<el-table-column prop="code" label="国际条形码" width="150" sortable>
				</el-table-column>
				<el-table-column prop="supplier.name" label="供应商" width="180" sortable>
				</el-table-column>
				<el-table-column prop="brand.name" label="品牌" width="120" sortable>
				</el-table-column>
				<!--<el-table-column prop="norm" label="规格" width="120" sortable>
				</el-table-column>-->
				<el-table-column prop="buying_price" label="进货价" width="100" sortable>
				</el-table-column>
				<el-table-column prop="retail_price" label="零售价" width="100" sortable>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="120" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" min-width="200">
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<!--<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>-->
					</span>
				</el-table-column>
			</el-table>
			<div v-show="activeName!='10'" style="margin: 20px">
				<el-button @click="toggleSelection(users)">全选</el-button>
				<el-button @click="toggleSelection()">取消选择</el-button>
				<el-button @click="toggleGoodsStatus(activeName)">{{activeName=='0'?'上架':'下架'}}</el-button>
			</div>
		</template>
	
		<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,sizes,prev, pager, next" :current-page="filters.page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 300, 400]" :page-size="pagesize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	
		<!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-card class="box-card" style="margin-bottom:20px">
					<div slot="header" class="clearfix">
						<span style="line-height: 20px;">基本信息</span>
					</div>
					<el-form-item label="商品名称" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="国际条形码" prop="code" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.code" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="原产地"  style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.production_origin" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="生产厂家" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.manufacturer" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="计价方式" prop="valuation_id" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-select v-model="editForm.valuation_id" placeholder="请选择计价方式">
							<el-option v-for="(item,index) in preData.valuation" :key="index" :label="item.name" :value="item.id+''"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="零售单位" prop="retail_unit_id"  style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-select v-model="editForm.retail_unit_id" placeholder="请选择零售单位">
							<el-option v-for="(item,index) in preData.retail_nuit" :key="index" :label="item.name" :value="item.id+''"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分类" prop="goods_type_id" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<!--<el-select v-model="editForm.goods_type_id" placeholder="请选择分类">
																		
																		
																	</el-select>-->
						<el-cascader @change="changegoodstype" v-model="option" :options="options" :show-all-levels="false"></el-cascader>
					</el-form-item>
					<el-form-item label="品牌" prop="goods_brand_id"  style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-select v-model="editForm.goods_brand_id" placeholder="请选择品牌">
							<el-option v-for="(item,index) in preData.brand" :key="index" :label="item.name" :value="item.id+''"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="供应商" prop="supplier_id" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-select v-model="editForm.supplier_id" placeholder="请选择供应商">
							<el-option v-for="(item,index) in preData.supplier" :key="index" :label="item.name" :value="item.id+''"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否分润" prop="is_rebate" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-switch v-model="editForm.is_rebate" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
						</el-switch>
					</el-form-item>
					<el-form-item label="状态" prop="status" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-switch v-model="editForm.status" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
						</el-switch>
					</el-form-item>
					<el-form-item label="数量" prop="num" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.num" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="规格">
						<el-tag :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)">
							{{tag}}
						</el-tag>
						<el-input style="width:100px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
						</el-input>
						<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新规格</el-button>
					</el-form-item>
	
					<!--<el-form-item v-for="(domain, index) in editForm.norm" :label="'规格' + index" :key="domain.key" :prop="'domains.' + index + '.value'">
										<el-input v-model="domain.name"></el-input>
										<el-button @click.prevent="removeDomain(domain)">删除</el-button>
									</el-form-item>-->
				</el-card>
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="line-height: 20px;">价格信息</span>
					</div>
					<el-form-item label="进货价" prop="buying_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.buying_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="批发价" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.trade_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="零售价" prop="retail_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.retail_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="市场价" prop="market_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
						<el-input v-model="editForm.market_price" auto-complete="off"></el-input>
					</el-form-item>
					<!--<el-form-item label="利润率" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
																	<el-input v-model="editForm.name" auto-complete="off"></el-input>
																</el-form-item>-->
				</el-card>
	
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
import request, { getUserListPage, removeUser, editUser, addUser } from 'api';
import config from 'config';

export default {
	data() {
		return {
			//标签
			dynamicTags: [],
			inputVisible: false,
			inputValue: '',
			filters: {
				name: '',
				code: '',
				page: 1,
				status: '',
				is_sell: ''

			},
			preData: {
				brand: [],
				retail_nuit: [],
				supplier: [],
				valuation: [],
				type: []
			},
			activeName: '10',
			options: [],
			option: [],
			users: [],
			total: 0,
			page: 1,
			pagesize: 1,
			listLoading: false,
			editFormVisible: false,//编辑界面显是否显示
			editFormTtile: '编辑',//编辑界面标题
			shopdetailVisible: false,
			shopdetailtitle: '店铺详情',
			shopdetailobj: {

			},
			pick: '已上架 0',
			notpick: '未上架 0',
			//编辑界面数据
			editForm: {
				id: 0,
				name: '',
				code: '',
				production_origin: ' ',
				manufacturer: ' ',
				valuation_id: '',
				retail_unit_id: '',
				goods_type_id: '',
				goods_brand_id: '',
				supplier_id: '',
				buying_price: '0',
				trade_price: '',
				retail_price: '',
				num: '',
				is_rebate: '1',
				norm: '',
				market_price: '',
				status:'1',
				is_sell:''
			},
			editLoading: false,
			btnEditText: '提 交',
			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				code: [
					{ required: true, message: '请输入国际条形码', trigger: 'blur' }
				],
				production_origin: [
					{ required: true, message: '请输入生成产地', trigger: 'blur' }
				],
				manufacturer: [
					{ required: true, message: '请输入生成厂家', trigger: 'blur' }
				],
				valuation_id: [
					{ required: true, message: '请输入计价方式', trigger: 'blur' }
				],
				retail_unit_id: [
					{ required: true, message: '请输入零售单位', trigger: 'blur' }
				],
				goods_type_id: [
					{ required: true, message: '请输入分类', trigger: 'blur' }
				],
				goods_brand_id: [
					{ required: true, message: '请输入商品品牌', trigger: 'blur' }
				],
				supplier_id: [
					{ required: true, message: '请输入供货商', trigger: 'blur' }
				],
				buying_price: [
					{ required: true, message: '请输入进货价', trigger: 'blur' }
				],
				trade_price: [
					{ required: true, message: '请输入批发价', trigger: 'blur' }
				],
				retail_price: [
					{ required: true, message: '请输入零售价', trigger: 'blur' }
				],
				num: [
					{ required: true, message: '请输入num', trigger: 'blur' }
				],
				is_rebate: [
					{ required: true, message: '请选择是否分润', trigger: 'blur' }
				],
				market_price: [
					{ required: true, message: '请输入市场价', trigger: 'blur' }
				]
			},
			multipleSelection: []
		}
	},
	methods: {
		//标签
		handleClose(tag) {
			this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
		},

		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		//
		addDomain() {
			this.editForm.norm.push({
				name: '',
				key: Date.now()
			});
		},
		removeDomain(item) {
			var index = this.editForm.norm.indexOf(item)
			if (index !== -1) {
				this.editForm.norm.splice(index, 1)
			}
		},
		//分类
		changegoodstype(value) {
			this.editForm.goods_type_id = value[value.length - 1]+'';
		},
		//全选
		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.multipleTable.toggleRowSelection(row, true);
				});
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		//性别显示转换
		formatSex: function (row, column) {
			return row.is_sell == 1 ? '已上架' : row.is_sell == 0 ? '未上架' : '未知';
		},
		handleClick(tab, event) {
			this.filters.page = 1;
			if (tab.name == 10) {
				this.filters.is_sell = '';
			} else {
				this.filters.is_sell = tab.name;
			}

			this.getUsers();
		},
		handleCurrentChange(val) {
			if (this.filters.page != val) {
				this.filters.page = val;
				this.getUsers();
			}

		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		getPreAdd() {
			request.get(config.api.goods.preparams)
				.then(res => {
					console.log(res)
					let { message, code, data } = res;
					if (code !== 200) {
						this.$notify({
							title: '错误',
							message: message,
							type: 'error'
						});
					} else {
						this.preData = JSON.parse(JSON.stringify(data.cnt));
						this.preData.type.forEach(item => {
							let obj = { value: item.id, label: item.name, children: [] };
							this.options.push(obj);
							item.sub_type.forEach(its => {
								obj.children.push({ value: its.id, label: its.name })
							})
						})
						this.preData.retail_nuit = [];
						this.preData.valuation = [];

						for (let key in data.cnt.retail_nuit) {
							this.preData.retail_nuit.push({ id: key - 0, name: data.cnt.retail_nuit[key] })
						}
						for (let key in data.cnt.valuation) {
							this.preData.valuation.push({ id: key - 0, name: data.cnt.valuation[key] })
						}
						console.log(this.preData)

					}
				})
		},
		//获取用户列表
		getUsers() {

			let para = {
				page: this.page,
				code: this.filters.code,
				// type_id:this.filters.type_id,
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
			request.get(config.api.goods.index, this.filters)
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

						this.total = data.cnt.good.total;
						this.users = data.cnt.good.data;
						data.cnt.num.forEach((item) => {
							if (item.is_sell == 0) {
								this.notpick = '未上架 ' + item.num
							} else {
								this.pick = '上架 ' + item.num
							}
						})
						this.pagesize = data.cnt.good.per_page || 10;
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
			this.editFormVisible = true;
			this.editFormTtile = '编辑';
			for (let key in this.editForm) {
				this.editForm[key] = row[key]+'';
			}
			this.dynamicTags = [];
			if (row.norm instanceof Array) {
				row.norm.forEach(item => {
					this.dynamicTags.push(item.name)
				})
			}
			this.options.forEach(item => {

				if (item.children) {
					item.children.forEach(its => {
						if (its.value == row.goods_type_id) {
							this.option = [item.value, its.value]
						}
					})
				}
			})
			// this.option = [row.goods_type_id];
			// this.$router.push('/addshop');
		},
		//编辑 or 新增
		editSubmit: function () {
			var _this = this;

			_this.$refs.editForm.validate((valid) => {
				if (valid) {
					let arr = [];
					this.dynamicTags.forEach(item => {
						arr.push({ name: item });
					})
					_this.$confirm('确认提交吗？', '提示', {}).then(() => {
						_this.editLoading = true;
						NProgress.start();
						_this.btnEditText = '提交中';

						if (_this.editForm.id == 0) {
							//新增
							let para = _this.editForm;
							para.norm = JSON.stringify(arr);
							para.is_sell=para.status;
							delete para.id;
							request.post(config.api.goods.addGoods, para)
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
							para.is_sell=para.status;
							para.norm = JSON.stringify(arr);
							request.post(config.api.goods.updateGoods, para)
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
			for (let key in this.editForm) {
				this.editForm[key] = '';
			}
			this.option=[];
			this.editForm.id = 0;

			// this.$router.push('/addshop');
		},
		//更改上下架
		toggleGoodsStatus(sta) {
			sta = sta == '0' ? 1 : 0;
			let arr = [];
			this.multipleSelection.forEach(data => {
				arr.push(data.id);
			})
			let para = {
				sell: sta,
				ids: arr.join(',')
			}
			this.toogleLoading = true;
			NProgress.start();
			request.post(config.api.goods.goodstooglestatus, para)
				.then(res => {
					this.toogleLoading = false;
					NProgress.done();
					let { message, code, data } = res;
					if (code !== 200) {
						this.$notify({
							title: '错误',
							message: message,
							type: 'error'
						});
					} else {
						console.log(res)
						this.$notify({
							title: '成功',
							message: message,
							type: 'success'
						});
						this.getUsers();
					}
				})

		}
	},
	mounted() {
		this.getUsers();
		this.getPreAdd()
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