<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="店铺名字">
			<el-input v-model="form.shopname"></el-input>
		</el-form-item>
		<el-form-item label="店铺所有人">
			<el-input v-model="form.shopuser"></el-input>
		</el-form-item>
		<el-form-item label="密码">
			<el-input v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item label="头像">
			<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<el-input type="hidden" v-model="form.avata"></el-input>
			<el-input type="hidden" v-model="form.latitude"></el-input>
			<el-input type="hidden" v-model="form.longitude"></el-input>
		</el-form-item>
		<el-form-item label="微信">
			<el-input v-model="form.wx"></el-input>
		</el-form-item>
		<el-form-item label="邮箱">
			<el-input v-model="form.email"></el-input>
		</el-form-item>
		<el-form-item label="QQ">
			<el-input v-model="form.qq"></el-input>
		</el-form-item>
		<el-form-item label="银行">
			<el-input v-model="form.bank"></el-input>
		</el-form-item>
		<el-form-item label="支行">
			<el-input v-model="form.branch"></el-input>
		</el-form-item>
		<el-form-item label="银行卡">
			<el-input v-model="form.bankCard"></el-input>
		</el-form-item>
		<el-form-item label="店铺电话">
			<el-input v-model="form.phone"></el-input>
		</el-form-item>
		<el-form-item label="身份证">
			<el-input v-model="form.card"></el-input>
		</el-form-item>
		<el-form-item label="籍贯">
			<el-input v-model="form.place"></el-input>
		</el-form-item>
		<el-form-item label="状态">
			<!--1启用 2停用-->
			<el-switch on-value="1" off-value="2" on-text="启用" off-text="停用" v-model="form.status"></el-switch>
		</el-form-item>
		<el-form-item label="地址">
			<el-select v-model="form.province" style="width:30%;" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
			<el-select v-model="form.city" style="width:30%;" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
			<el-select v-model="form.area" style="width:30%;" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="详细地址">
			<el-input v-model="form.address"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button v-loading.fullscreen.lock="editLoading" type="primary" @click="saveShop">立即创建</el-button>
			<el-button @click.native.prevent="returnShop">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import config from 'config';
import request from 'api';
import NProgress from 'nprogress'
import util from 'util'
export default {
	data() {
		return {
			editLoading:false,
			form: {
				id:0,
				shopname: '',
				shopuser: '',
				password:'',
				avatar: '',
				phone: '',
				tel: '',
				card:'',
				place:'',
				province:'',
				city:'',
				area: '',
				address:'',
				latitude:'',
				longitude:'',
				wx:'',
				qq:'',
				status:'',
				displayorder:'',
				email:'',
				bank: '',
				branch: '',
				bankCard: '',
			},
			formRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			}
		}
	},
	mounted() {
		
		let {params}=this.$route;
		if(params.id){
			this.form.id == params.id;
			request
		}else{
			this.form.id == 0
		}
	},
	methods: {
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		onSubmit() {
			console.log('submit!');
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
							let para = {
								name: _this.form.name,
								sex: _this.form.sex,
								age: _this.form.age,
								birth: _this.form.birth == '' ? '' : util.formatDate.format(new Date(_this.form.birth), 'yyyy-MM-dd'),
								addr: _this.form.addr,
							};
							// addUser(para).then((res) => {
							// 	_this.editLoading = false;
							// 	NProgress.done();
							// 	_this.btnEditText = '提 交';
							// 	_this.$notify({
							// 		title: '成功',
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	_this.formVisible = false;
							// 	_this.getUsers();
							// });
							request.post(config.api.shop.addshop,_this.form)
								.then(res=>{
									console.log(res)
									_this.editLoading = false;
								})
						} else {
							//编辑
							let para = {
								id: _this.form.id,
								name: _this.form.name,
								sex: _this.form.sex,
								age: _this.form.age,
								birth: _this.form.birth == '' ? '' : util.formatDate.format(new Date(_this.form.birth), 'yyyy-MM-dd'),
								addr: _this.form.addr,
							};
							request.post(config.api.shop.addshop,_this.form)
								.then(res=>{
									console.log(res)
									_this.editLoading = false;
								})
							// editUser(para).then((res) => {
							// 	_this.editLoading = false;
							// 	NProgress.done();
							// 	_this.btnEditText = '提 交';
							// 	_this.$notify({
							// 		title: '成功',
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	_this.formVisible = false;
							// 	_this.getUsers();
							// });

						}

					});

				}
			});
			// this.$router.replace('/shop')
		},
		returnShop() {
			this.$router.replace('/shop')
		}
	}
}
</script>