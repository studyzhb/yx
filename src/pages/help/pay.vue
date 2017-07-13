<template>
    <section>
    
        <!--列表-->
        <template>
            <el-table :data="paydata" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="名称" width="180" sortable>
                </el-table-column>
                <el-table-column prop="icon" label="图标" width="120" sortable>
                    <template scope="scope">
                        <img width="24" :src="scope.row.icon" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="150" sortable>
                    <template scope="scope">
                        <el-button size="small" @click="updatestatus(scope.row)" :type="scope.row.status == '2' ? 'primary' : 'success'" close-transition>{{scope.row.status == 1 ? '已启用' :scope.row.status == 2 ? '已停用' : '未知'}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :context="_self" label="操作" min-width="200">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
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
                <el-form-item label="名称" prop="class" style="width:50%">
                    <el-input v-model="editForm.class" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="isshow" label="appid" prop="appid" style="width:50%">
                    <el-input v-model="editForm.appid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="isshow" label="mchid" prop="mchid" style="width:50%">
                    <el-input v-model="editForm.mchid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="isshow" label="公钥" prop="public_key" style="width:50%">
                    <el-input v-model="editForm.public_key" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="platform" style="width:50%">
                    <el-select v-model="editForm.platform" placeholder="请选择">
                        <el-option label="队列" :value="0"></el-option>
                        <el-option label="债券" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="logo" prop="icon">
                    <el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
    
                <el-form-item>
                    <el-input type="hidden" v-model="editForm.icon" auto-complete="off"></el-input>
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
import Sign from 'common/sign'
export default {
    data() {
        return {
            //图片上传
            dialogImageUrl: '',
            dialogVisible: false,
            //
            isshow:true,
            paydata: [
                {
                    name: "支付宝",
                    class: "alipayapp",
                    icon: '',
                    status: '2'
                },
                {
                    name: "微信",
                    class: 'wxpayapp',
                    status: "2",
                    icon: ''
                },
                {
                    name: "余额支付",
                    class: 'balance',
                    icon: '',
                    status: "2"
                },
                {
                    name: "杉德支付",
                    class: "",
                    status: "2",
                    icon: ''
                }

            ],
            users: null,
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
                class: '',
                appid: '',
                mchid: '',
                public_key: '',
                platform: ''
            },
            editLoading: false,
            editstatusLoading: false,
            btnEditText: '提 交',
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                icon: [
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
            this.editForm.icon = "";
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            console.log(file)
            console.log('qianzhi')
            //this.dialogImageUrl = file.url;
            //this.dialogVisible = true;
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
            // this.filters.page = val;
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
            Sign.then((client) => {
                client.multipartUpload('/pic/' + file.name, file)
                    .then(res => {
                        this.editForm.icon = (res.res.requestUrls[0]).split('?')[0];
                        //this.filelist.splice(0,1)
                        
                        this.filelist = [{ name: 'editpic', url: (res.res.requestUrls[0]).split('?')[0] }]
                    }).catch(err => {
                        console.log(err)
                    })
            })

        },
        //获取用户列表
        getUsers() {

            this.listLoading = true;
            NProgress.start();
            // getUserListPage(para).then((res) => {
            // 	this.total = res.data.total;
            // 	this.users = res.data.users;
            // 	this.listLoading = false;
            // 	NProgress.done();
            // });
            request.get(config.api.help.shopayinfo)
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
                        this.paydata = [
                            {
                                name: "支付宝",
                                class: "alipayapp",
                                icon: '',
                                status: '2'
                            },
                            {
                                name: "微信",
                                class: 'wxpayapp',
                                status: "2",
                                icon: ''
                            },
                            {
                                name: "余额支付",
                                class: 'balance',
                                icon: '',
                                status: "2"
                            },
                            {
                                name: "杉德支付",
                                class: "sdpay",
                                status: "2",
                                icon: ''
                            }

                        ]
                        this.users = data.cnt;
                        this.paydata.forEach((item, index) => {
                            this.users.forEach(its => {

                                if (its.class == item.class) {
                                    this.paydata[index] = its;
                                }
                            })
                        })
                        this.paydata = this.paydata.slice(0);
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
            console.log(this.users)
            this.editFormVisible = true;
            this.editFormTtile = '编辑';
            this.editForm.class = row.class;
            this.editForm.platform = row.platform;
            if (row.params) {
                
                if (row.class == 'alipayapp') {
                    this.isshow=true;
                    this.editForm.appid = row.params.appid;
                    this.editForm.public_key = row.params.public_key;
                    this.editForm.mchid = row.params.private_key;
                } else if (row.class == 'wxpayapp') {
                    this.isshow=true;
                    this.editForm.appid = row.params.appid;
                    this.editForm.public_key = row.params.key;
                    this.editForm.mchid = row.params.mchid;
                } else {
                    this.isshow=false;
                }
                // this.editForm.public_key = row.params.public_key;
                // this.editForm.mchid = row.params.mchid;
            }else{
                 this.isshow=false;
            }

            this.filelist = row.icon ? [{ name: 'editlogo', url: row.icon }] : [];
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

                        let para = {
                            class: _this.editForm.class,
                            appid: _this.editForm.appid,
                            mchid: _this.editForm.mchid,
                            // public_key: _this.editForm.public_key,
                            platform: _this.editForm.platform,
                            icon: _this.editForm.icon
                        };

                        if (para.class == 'wxpayapp') {
                            para.key = _this.editForm.public_key
                            // para.mchid = _this.editForm.mchid
                        }else if(para.class == 'alipayapp'){
                            para.public_key = _this.editForm.public_key
                        } 
                        else {
                           
                        }

                        request.post(config.api.help.addpay, para)
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

                    });

                }
            });

        },
        //显示新增界面
        handleAdd: function () {
            var _this = this;
            this.filelist = [];

            this.editFormTtile = '新增';
            for (let key in this.editForm) {
                this.editForm[key] = '';
            }
            this.editLoading = false;
            this.editForm.id = 0;
            setTimeout(() => {
                this.editFormVisible = true;
            }, 100)

        },
        //更新状态
        updatestatus(row) {
            let _this = this;
            this.editstatusLoading = true;
            let para = {
                class: row.class,
                status: row.status == 1 ? 2 : 1,
                platform: row.platform
            };
            request.post(config.api.help.updatepaystatus, para)
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