<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item label="分类">
					<el-input v-model="filters.name" placeholder="分类"></el-input>
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
				<el-table-column type="expand">
					<template scope="props">
						<el-table :data="props.row.sub_type" style="width: 100%">
							<el-table-column type="index" width="60">
							</el-table-column>
							<el-table-column prop="name" width="120" sortable>
							</el-table-column>
							<el-table-column prop="status" :formatter="formatSex" width="120" sortable>
							</el-table-column>
							<el-table-column prop="displayorder" width="120" sortable>
								<template scope="scope">
									<el-input size="small" v-model="scope.row.displayorder" placeholder="请输入位置"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="name"  width="120" sortable>
							</el-table-column>
							<el-table-column inline-template :context="_self" min-width="320">
								<span>
									<el-button size="small" @click="handleEdit(row)">编辑</el-button>
									<el-button size="small" @click="putoroutaway(row,1)">全部上架</el-button>
									<el-button size="small" @click="putoroutaway(row,0)">全部下架</el-button>
									<!--<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>-->
								</span>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="名称" width="120" sortable>
				</el-table-column>
				<el-table-column prop="status" label="状态" :formatter="formatSex" width="120" sortable>
				</el-table-column>
				<el-table-column prop="displayorder" label="排序" width="120" sortable>
					<template scope="scope">
						<el-input size="small" style="" v-model="scope.row.displayorder" placeholder="请输入位置"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="上架/下架" width="120" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" min-width="320">
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button size="small" @click="handlesubAdd(row)">添加</el-button>
						<el-button size="small" @click="putoroutaway(row,1)">全部上架</el-button>
						<el-button size="small" @click="putoroutaway(row,0)">全部下架</el-button>
						<!--<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>-->
					</span>
				</el-table-column>
			</el-table>
		</template>
	
		<!--分页-->
		<!--<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
											<el-pagination layout="total,sizes,prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 200, 300, 400]" :page-size="pagesize" :total="total" style="float:right;">
											</el-pagination>
										</el-col>-->
	
		<!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="pic">
					<el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog v-model="dialogVisible" size="tiny">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model="editForm.sort" auto-complete="off"></el-input>
					<el-input type="hidden" v-model="editForm.pic" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch v-model="editForm.status" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="描述" prop="note">
					<el-input type="area" v-model="editForm.note" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>
	
		<el-dialog :title="editFormTtile" v-model="editFormVisibletest" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="类型">
					<el-select v-model="editForm.sex" placeholder="请选择">
						<el-option label="现金券" :value="1"></el-option>
						<el-option label="满减券" :value="0"></el-option>
						<el-option label="打折券" :value="2"></el-option>
					</el-select>
				</el-form-item>
	
				<el-form-item label="分类">
					<el-select v-model="editForm.sex" placeholder="请选择">
						<el-option label="现金券" :value="1"></el-option>
						<el-option label="满减券" :value="0"></el-option>
						<el-option label="打折券" :value="2"></el-option>
					</el-select>
				</el-form-item>
	
				<el-form-item label="使用店铺" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="优惠券名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="优惠券面额" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="优惠券折扣" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="最低消费" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="优惠券数量" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="领券时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date1" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-time-picker type="date" placeholder="选择时间" v-model="editForm.date2" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
				<el-form-item label="优惠券说明">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="使用说明">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
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
import request, { getUserListPage, removeUser, editUser, addUser } from 'api';
import config from 'config';
import Sign from 'common/sign'
export default {
	data() {
		return {
			filters: {
				name: ''
			},
			//图片上传
			dialogImageUrl: '',
			dialogVisible: false,
			filelist: [],
			users: [],
			total: 0,
			page: 1,
			pagesize: 10,
			listLoading: false,
			editFormVisible: false,//编辑界面显是否显示
			editFormVisibletest: false,
			editFormTtile: '编辑',//编辑界面标题
			shopdetailVisible: false,
			shopdetailtitle: '店铺详情',
			shopdetailobj: {

			},
			//编辑界面数据
			editForm: {
				id: 0,
				name:'',
				pic:'',
				sort:'',
				pid:'',
				note:"",
				status:""
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
			return row.status == 1 ? '已启用' : row.status == 0 ? '已停用' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		//图片上传
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			console.log(file)
			console.log('qianzhi')
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		getUpstr() {
			console.log('chenggongshi ')
		},
		handlechange() {
			console.log('handlechange ')
		},
		handleBeforeup() {
			console.log('handleBeforeup ')
		},
		handleRequestOss(files) {


			// client.list({
			//     'max-keys': 10
			// }).then(res => {
			//     console.log(res)
			// }).catch(err => {
			//     console.log(err)
			// })

			let file = files.file
			Sign.then((client) => {
				client.multipartUpload('/pic/' + file.name, file)
					.then(res => {
						this.editForm.pic = (res.res.requestUrls[0]).split('?')[0];
					}).catch(err => {
						console.log(err)
					})
			})

		},
		//上下架
		putoroutaway(row, status) {
			let para = {
				id: row.id,
				sell: status
			}
			NProgress.start();
			this.listLoading = true;
			request.post(config.api.goods.upordowngoods, para)
				.then(res => {
					let { message, code, data } = res;
					this.listLoading = false;
					NProgress.done();
					if (code !== 200) {
						this.$notify({
							title: '错误',
							message: message,
							type: 'error'
						});
					} else {
						this.$notify({
							title: '成功',
							message: message,
							type: 'success'
						});
						this.getUsers();
					}
				})

		},
		//获取用户列表
		getUsers() {

			let para = {
				page: this.page,
				name: this.filters.name,
				// shop_id:this.$route.params.id
			};
			this.listLoading = true;
			NProgress.start();
			// getUserListPage(para).then((res) => {
			// 	this.total = res.data.total;
			// 	this.users = res.data.users;
			// 	this.listLoading = false;
			// 	NProgress.done();
			// });
			request.get(config.api.goods.sortindex, para)
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
						// this.total = data.cnt.total;
						this.users = data.cnt;
						// this.pagesize = data.cnt.per_page || 10;
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
			for (let key in this.editForm){
				this.editForm[key]=row[key]+'';
			}
			this.editForm.pic=row.app_pic;
			this.editForm.status+='';
			this.filelist = [{ name: '', url: row.app_pic }]
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
							request.post(config.api.goods.addsort, para)
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
							request.post(config.api.goods.updatesort, para)
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
		//显示新增顶级分类界面
		handleAdd: function () {
			var _this = this;

			this.editFormVisible = true;
			this.editFormTtile = '新增一级分类';

			this.editForm.id = 0;
			this.editForm.name = '';
			this.editForm.pic = 1;
			this.editForm.pid = 0;
			this.filelist = [];
			this.editForm.sort = 0;
			this.editForm.note = '';
			this.editForm.status = '1';

		},
		//显示新增顶级分类界面
		handlesubAdd: function (row) {
			var _this = this;

			this.editFormVisible = true;
			this.editFormTtile = '新增' + row.name + '下的分类';

			this.editForm.id = 0;
			this.editForm.name = '';
			this.editForm.pic = 1;
			this.filelist = [];
			this.editForm.pid = row.id;
			this.editForm.sort = 0;
			this.editForm.note = '';
			this.editForm.status = '1';

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