<template>
	<el-form ref="form" :model="form" label-width="100px" :rules="editFormRules" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="店铺名字" prop="shopname">
			<el-input v-model="form.shopname"></el-input>
		</el-form-item>
		<el-form-item label="店铺所有人">
			<el-input v-model="form.shopuser"></el-input>
		</el-form-item>
		<el-form-item label="所有人电话">
			<el-input v-model="form.tel"></el-input>
		</el-form-item>
		<el-form-item label="密码">
			<el-input v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item label="头像" prop="logo">
			<el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog v-model="dialogVisible" size="tiny">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</el-form-item>
		<el-form-item label="微信">
			<el-input v-model="form.wx"></el-input>
			<el-input type="hidden" v-model="form.avatar"></el-input>
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
			<el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleaddresschange">
			</el-cascader>
		</el-form-item>
		<el-form-item label="详细地址">
			<el-input v-model="form.address"></el-input>
		</el-form-item>
		<el-form-item>
			<el-amap vid="amapDemo" style="height:600px;" :events="events" :plugin="plugins" :zoom="zoom">
				<el-amap-marker :position="marker.position">
				</el-amap-marker>
			</el-amap>
		</el-form-item>
		<el-form-item>
			<el-button :loading="editLoading" type="primary" @click="saveShop">{{btnEditText}}</el-button>
			<el-button @click.native.prevent="returnShop">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data';
import config from 'config';
import request from 'api';
import NProgress from 'nprogress'
import util from 'util'
import AMap from 'vue-amap';
import client from 'common/sign'
export default {
	data() {
		return {
			editLoading: false,
			//图片上传
			dialogImageUrl: '',
			filelist: [],
			dialogVisible: false,
			zoom: 12,
			btnEditText:'提交',
			marker: {
				position: [30, 130]
			},
			editFormRules: {
				shopname: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},
			plugins: [
				{
					pName: 'Geocoder',
					events: {
						init(instance) {
							console.log(instance)
							this.amap = instance.CLASS_NAME;
							console.log(typeof instance.CLASS_NAME)
						}
					}
				},
				{
					pName: 'MapType',
					defaultType: 0,
					events: {
						init(instance) {
							console.log(instance);
						}
					}
				}
			],
			events: {
				'moveend': () => {
				},
				'zoomchange': () => {
				},
				'click': (e) => {
					console.log(e);
					// console.log(Geocoder)
					console.log(AMap)

					this.marker.position = [e.lnglat.lng, e.lnglat.lat]

					this.form.longitude = e.lnglat.lng;
					this.form.latitude = e.lnglat.lat;
				}
			},
			form: {
				id: 0,
				shopname: '',
				shopuser: '',
				password: '',
				avatar: '',
				phone: '',
				tel:'',
				card: '',
				place: '',
				province: '',
				city: '',
				area: '',
				address: '',
				latitude: '',
				longitude: '',
				wx: '',
				qq: '',
				status: '',
				displayorder: '1',
				email: '',
				bank: '',
				branch: '',
				bankCard: '',
			},
			options: regionData,
			selectedOptions: [],
			formRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			}
		}
	},
	mounted() {

		let { params } = this.$route;
		console.log(params)
		if (params.id != 0) {
			this.form.id = params.id;
			request.get(config.api.shop.getSingleShop, { id: this.form.id })
				.then((res) => {
					let { message, code, data } = res;
					if (code !== 200) {
						this.$notify({
							title: '错误',
							message: message,
							type: 'error'
						});
					} else {
						this.form = data.cnt;

					}
				})
				.catch(e => {
					console.log(e);
				})
		} else {
			this.form.id = 0
		}
	},
	methods: {
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

		},
		handlePreview(file) {
			console.log(file);
		},
		onSubmit() {
			console.log('submit!');
		},
		handlechange(value) {
			console.log(value)
		},
		handleaddresschange(value) {
			this.form.province = CodeToText[value[0]]
			this.form.city = CodeToText[value[1]]
			this.form.area = CodeToText[value[value.length - 1]]
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
			client.multipartUpload(file.name, file)
				.then(res => {
					this.form.avatar = res.url;
				}).catch(err => {
					console.log(err)
				})
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


							request.post(config.api.shop.addshop, para)
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
										_this.$router.replace('/shop')
									}
								})
						} else {
							//编辑
							let para = {
								
							};
							request.post(config.api.shop.updateshop, _this.form)
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
										_this.$router.replace('/shop')
									}
								})

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