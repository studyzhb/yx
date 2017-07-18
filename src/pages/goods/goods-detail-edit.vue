<template>
    <section>
        <el-col :span="24" class="toolbar">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="padding-bottom:20px;">
                <el-popover ref="popoverF" placement="right" width="400" trigger="click">
                    <el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <!--<el-button @click="addtitle" style="margin:20px;">添加文字</el-button>-->
                </el-popover>
                <el-popover ref="popoverT" placement="right" width="400" trigger="click">
                    <el-upload action="" :file-list="filelist1" :http-request="handleRequestOssBanner" list-type="picture-card" :on-remove="handleRemoveBanner" :on-success="getUpstr">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-popover>
                <el-tab-pane label="基本信息" name="first">
                    <el-form :model="form" label-width="80px" :rules="editFormRules" ref="form">
                        <el-card class="box-card" style="margin-bottom:20px">
                            <div slot="header" class="clearfix">
                                <span style="line-height: 20px;">基本信息</span>
                            </div>
                            <el-form-item label="商品名称" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="国际条形码" prop="code" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.code" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="原产地" prop="production_origin" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.production_origin" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="生产厂家" prop="manufacturer" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.manufacturer" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="数量" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.num" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="计价方式" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="form.valuation_id" placeholder="请选择计价方式">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="零售单位" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="form.retail_unit_id" placeholder="请选择零售单位">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="分类" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="form.goods_type_id" placeholder="请选择分类">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品牌" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="form.goods_brand_id" placeholder="请选择品牌">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="供应商" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-select v-model="form.supplier_id" placeholder="请选择供应商">
                                    <el-option label="称重" :value="1"></el-option>
                                    <el-option label="计价" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否分润" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-switch v-model="form.is_rebate" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
                                </el-switch>
                            </el-form-item>
    
                        </el-card>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="line-height: 20px;">价格信息</span>
                            </div>
                            <el-form-item label="进货价" prop="buying_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.buying_price" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="批发价" prop="trade_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.trade_price" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="零售价" prop="retail_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.retail_price" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="市场价" prop="market_price" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.market_price" auto-complete="off"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="利润率" prop="name" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                                <el-input v-model="form.name" auto-complete="off"></el-input>
                            </el-form-item>-->
                        </el-card>
                    </el-form>
    
                </el-tab-pane>
                <el-tab-pane label="商品详情" name="second">
                    <div class="phoneBg" style="padding:18px;padding-top:32px;width:284px;height:600px;position:relative;">
                        <el-carousel indicator-position="outside" width="300px" height="200px">
                            <el-carousel-item v-for="item in pic" :key="item">
                                <img :src="item" width="100%">
                            </el-carousel-item>
                        </el-carousel>
                        <el-button style="width:284px;height:200px;overflow:hidden;position:absolute;border:none;top:32px;z-index:100;opacity:0" @click="test" v-popover:popoverT>
                        </el-button>
                        <el-button id="imageContent" style="width:100%;height:300px;overflow:auto;margin-left:-1px"  v-popover:popoverF>
                            <div v-if="editForm.content" v-html="editForm.content" class="ceshi"></div>
                            <div class="img-single" style="width:100%;" v-for="item in picContent" :key="item">
                                <div class="deleteAvata" style="display: none;">删除</div>
                                <img src="http://enclosure.wandlm.net/web_pic/2017/01/09/1483941258379.png" :src="item" width="100%">
                            </div>
                        </el-button>
    
                    </div>
                    <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editFormRules">
                        <el-form-item label="是否上架" style="display:inline-block;margin:10px;width:30%;min-width:200px;">
                            <el-switch v-model="editForm.status" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="备注" style="width:300px">
                            <el-input type="area" v-model="editForm.note"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="hidden" v-model="editForm.pic"></el-input>
                            <el-input type="hidden" v-model="editForm.content"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button :loading="editLoading" type="primary" @click="editSubmit">{{btnEditText}}</el-button>
                            <el-button @click.native.prevent="returnShop">取消</el-button>
                        </el-form-item>
                    </el-form>
    
                </el-tab-pane>
    
                <!--<el-button v-popover:popover4>click 激活</el-button>-->
            </el-tabs>
        </el-col>
        <!--列表-->
        <template>
    
        </template>
    
    </section>
</template>

<script>
import util from '../../common/util'
import NProgress from 'nprogress'
import request from 'api';
import config from 'config';
import Sign from 'common/sign'
export default {
    data() {
        return {
            activeName: 'first',
            filters: {
                name: ''
            },
            //图片上传
            dialogImageUrl: '',
            dialogVisible: false,
            filelist: [],
            filelist1: [],
            visible2: false,
            users: [],
            pic: [],
            picContent: [],
            total: 0,
            page: 1,
            listLoading: false,
            editFormVisible: false,//编辑界面显是否显示
            editFormTtile: '编辑',//编辑界面标题
            //编辑界面数据
            editForm: {
                id: 0,
                pic: '',
                content: '',
                note: '',
                status: ''
            },
            //编辑界面数据
            form: {
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
        test() {
            console.log('12144141 test')
        },
        //性别显示转换
        formatSex: function (row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
        },
        //添加详情
        adddetail() {
            console.log('1213133')
        },
        //添加标题
        addtitle() {
            this.$prompt('请输入添加的文字', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {

            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '取消输入'
                // });
            });
        },
        handleClick() {

        },
        handleCurrentChange(val) {
            this.page = val;
            this.getUsers();
        },
        //图片上传
        handleRemove(file, fileList) {

            for (let i = 0, j = this.picContent.length; i < j; i++) {
                if (this.picContent[i] == file.url) {
                    this.picContent.splice(i, 1);
                    i--;
                }
            }
        },
        handleRemoveBanner(file, fileList) {

            for (let i = 0, j = this.pic.length; i < j; i++) {
                if (this.pic[i] == file.url) {
                    this.pic.splice(i, 1);
                    i--;
                }
            }
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
        //获取用户列表
        getUsers() {
            
            let { params } = this.$route;
            this.editForm.id = params.id
            let para = {
                id: params.id
            };
            this.listLoading = true;
            NProgress.start();
            
            request.get(config.api.goods.goodsdetail, para)
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

						this.form = data.cnt;
                        this.form.is_rebate+='';
                        this.form.pic=JSON.stringify(this.form.pic)
                        for (let key in this.editForm){
                            this.editForm[key]=this.form[key]+'';
                        }
                        this.filelist1=[]
                        this.filelist=[]
                        
                        //商品图片
                        if(this.form.pic){
                            this.pic=this.form.pic instanceof Array?this.form.pic:JSON.parse(this.form.pic);
                            this.pic=this.pic?this.pic:[];
                            this.pic.forEach(item=>{
                                this.filelist1.push({name:'img',url:item})
                            })
                        }
                        
                        //详情图片
                        // this.filelist1
					}
				})
        },
        handleRequestOssBanner(files) {
            let file = files.file
            Sign.then((client) => {
                client.multipartUpload(file.name, file)
                    .then(res => {
                        this.pic.push((res.res.requestUrls[0]).split('?')[0]);
                        this.filelist1 = [];
                        
                        this.pic.forEach((item, index) => {
                            this.filelist1.push({ name: index, url: item })
                        })
                        // this.editForm.pic = this.editForm.pic.push(res.url);
                    }).catch(err => {
                        console.log(err)
                    })
            })

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
                client.multipartUpload(file.name, file)
                    .then(res => {
                        this.picContent.push((res.res.requestUrls[0]).split('?')[0]);
                        this.filelist1 = [];
                        this.picContent.forEach((item, index) => {
                            this.filelist1.push({ name: index, url: item })
                        })
                    }).catch(err => {
                        console.log(err)
                    })
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
            // this.editFormVisible = true;
            // this.editFormTtile = '编辑';
            // this.editForm.id = row.id;
            // this.editForm.name = row.name;
            // this.editForm.sex = row.sex;
            // this.editForm.age = row.age;
            // this.editForm.birth = row.birth;
            // this.editForm.addr = row.addr;
            this.$router.push('/goods-detail-edit')
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

                        //取消判断
                        let para = _this.editForm;
                        para.content = imageContent.innerHTML;
                        para.pic = JSON.stringify(_this.pic);
                        // delete para.id;
                        request.post(config.api.goods.goodsdetailadd, para)
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
                                    _this.$router.replace('/goods-detail');
                                }
                            })

                        // if (_this.editForm.id == 0) {
                        //     //新增

                        // } else {
                        //     //编辑
                        //     let para = _this.editForm;

                        //     request.post(config.api.help.updatebank, para)
                        //         .then(res => {
                        //             let { message, code, data } = res;
                        //             _this.editLoading = false;
                        //             NProgress.done();
                        //             _this.btnEditText = '提 交';
                        //             if (code !== 200) {
                        //                 this.$notify({
                        //                     title: '错误',
                        //                     message: message,
                        //                     type: 'error'
                        //                 });
                        //             } else {
                        //                 _this.$notify({
                        //                     title: '成功',
                        //                     message: '更新成功',
                        //                     type: 'success'
                        //                 });
                        //                 _this.editFormVisible = false;
                        //                 _this.getUsers();
                        //             }
                        //         })
                        // }

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

.phoneBg {
    background: url('../../assets/iphone.png') no-repeat 0 0;

    background-size: contain;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>