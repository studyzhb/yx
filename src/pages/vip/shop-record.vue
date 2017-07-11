<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<!--<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="filters.time" style="width: 100%;"></el-date-picker>
					</el-col>-->
                    <el-date-picker v-model="filters.time" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1">
				</el-date-picker>
					<!--<el-col class="line" :span="2"> - </el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间" v-model="filters.datee" style="width: 100%;"></el-time-picker>
					</el-col>-->
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
				<el-table-column prop="order_num" label="订单个数" width="120" sortable>
				</el-table-column>
				<el-table-column prop="money_all" label="总金额" width="120" sortable>
				</el-table-column>
				<el-table-column prop="money" label="总分润" width="120" sortable>
				</el-table-column>
                <el-table-column prop="money_company" label="公司分润" width="120" sortable>
				</el-table-column>
                <el-table-column prop="money_shop" label="店铺分润" width="120" sortable>
				</el-table-column>
                <el-table-column prop="money_queue" label="队列分润" width="120" sortable>
				</el-table-column>
				<el-table-column prop="money_product" label="产品分润" width="180" sortable>
				</el-table-column>
				<el-table-column prop="audit_date" label="时间" min-width="180" sortable>
				</el-table-column>
				<!--<el-table-column inline-template :context="_self" label="操作" min-width="320">
					<span>
						<el-button size="small" @click="handleEdit(row)">更多</el-button>
					</span>
				</el-table-column>-->
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
	</section>
</template>


<script>
import util from 'common/util'
import NProgress from 'nprogress'
import request, { getUserListPage, removeUser, editUser, addUser } from 'api';
import config from 'config';
import client from 'common/sign'
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
                time: '',
                page:1,
            },
            //图片上传
            dialogImageUrl: '',
            dialogVisible: false,
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
            filelist: [],
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                logo: ''
            },
            editLoading: false,
            editstatusLoading:false,
            btnEditText: '提 交',
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                logo: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ]
            }

        }
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.status == 1 ? '已启用' : row.sex == 0 ? '已停用' : '未知';
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
        filterTag(value, row) {
            console.log(value)
            console.log(row)
            return row.status === value;
        },
        handleCurrentChange(val) {
            this.page = val;
            this.filters.page = val;
            this.getUsers();
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
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
            client.multipartUpload(file.name, file)
                .then(res => {
                    this.editForm.logo = res.url;
                }).catch(err => {
                    console.log(err)
                })
        },
        //获取用户列表
        getUsers() {

            let para = this.filters;
            this.listLoading = true;
            NProgress.start();
            // getUserListPage(para).then((res) => {
            // 	this.total = res.data.total;
            // 	this.users = res.data.users;
            // 	this.listLoading = false;
            // 	NProgress.done();
            // });
            request.get(config.api.fund.getShoprecord,para)
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
            console.log(row)
            this.editFormVisible = true;
            this.editFormTtile = '编辑';
            this.editForm.id = row.id;
            this.editForm.name = row.name;
            this.editForm.logo = row.logo;
            this.filelist = [{ name: 'editlogo', url: row.logo }]
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
                                logo: _this.editForm.logo,
                            };
                            request.post(config.api.help.addbank, para)
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
                            let para = {
                                id: _this.editForm.id,
                                name: _this.editForm.name,
                                logo: _this.editForm.logo,

                            };
                            request.post(config.api.help.updatebank, para)
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
            this.editForm.logo = '';
        },
        //更新状态
        updatestatus(row) {
            let _this=this;
            this.editstatusLoading=true;
            let para = {
                id:row.id,
                status:row.status==0?1:0
            };
            request.post(config.api.help.updatestatus, para)
                .then(res => {
                    let { message, code, data } = res;
                    _this.editstatusLoading = false;
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