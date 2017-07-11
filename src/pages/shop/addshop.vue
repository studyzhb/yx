<template>
	<el-form ref="form" :model="form" label-width="100px" :rules="editFormRules" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="店铺名字" prop="shopname">
			<el-input v-model="form.shopname"></el-input>
		</el-form-item>
		<el-form-item label="店铺所有人" prop="shopuser">
			<el-input v-model="form.shopuser"></el-input>
		</el-form-item>
		<el-form-item label="所有人电话" prop="tel">
			<el-input v-model.number="form.tel"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item label="头像" prop="avatar">
			<el-upload action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog v-model="dialogVisible" size="tiny">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</el-form-item>
		<el-form-item label="微信" prop="wx">
			<el-input v-model="form.wx"></el-input>
			<el-input type="hidden" v-model="form.avatar"></el-input>
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="form.email"></el-input>
		</el-form-item>
		<el-form-item label="QQ" prop="qq">
			<el-input v-model.number="form.qq"></el-input>
		</el-form-item>
		<el-form-item label="银行" prop="bank">
			<el-input v-model="form.bank"></el-input>
		</el-form-item>
		<el-form-item label="支行" prop="branch">
			<el-input v-model="form.branch"></el-input>
		</el-form-item>
		<el-form-item label="银行卡" prop="bankCard">
			<el-input v-model.number="form.bankCard"></el-input>
		</el-form-item>
		<el-form-item label="店铺电话" prop="phone">
			<el-input v-model.number="form.phone"></el-input>
		</el-form-item>
		<el-form-item label="身份证" prop="card">
			<el-input v-model="form.card"></el-input>
		</el-form-item>
		<el-form-item label="籍贯" prop="place">
			<el-input v-model="form.place"></el-input>
		</el-form-item>
		<el-form-item label="状态" prop="status">
			<!--1启用 2停用-->
			<el-switch on-value="1" off-value="2" on-text="启用" off-text="停用" v-model="form.status"></el-switch>
		</el-form-item>
		<el-form-item label="地址" prop="province">
			<el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleaddresschange">
			</el-cascader>
		</el-form-item>
		<el-form-item label="详细地址" prop="address">
			<el-input v-model="form.address"></el-input>
		</el-form-item>
		<el-form-item prop="latitude">
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
import Sign from 'common/sign'
export default {
	data() {
		return {
			editLoading: false,
			isstatus: true,
			//图片上传
			dialogImageUrl: '',
			filelist: [],
			dialogVisible: false,
			zoom: 12,
			btnEditText: '提交',
			marker: {
				position: [30, 130]
			},
			editFormRules: {
				shopname: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				shopuser: [
					{ required: true, message: '请输入店铺名字', trigger: 'blur' }
				],
				// password: [
				// 	{ required: true, message: '请输入密码', trigger: 'blur' }
				// ],
				avatar: [
					{ required: true, message: '请输入店铺头像', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入电话', trigger: 'blur' }
				],
				tel: [
					{ required: true, message: '请输入手机号', trigger: 'blur' }
				],
				card: [
					{ required: true, message: '请输入身份证号', trigger: 'blur' }
				],
				place: [
					{ required: true, message: '请输入籍贯', trigger: 'blur' }
				],
				province: [
					{ required: true, message: '请输入省份', trigger: 'blur' }
				],
				city: [
					{ required: true, message: '请输入城市', trigger: 'blur' }
				],
				area: [
					{ required: true, message: '请输入区域', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请输入详细地址', trigger: 'blur' }
				],
				latitude: [
					{ required: true, message: '请在地图中点击选择位置', trigger: 'blur' }
				],
				longitude: [
					{ required: true, message: '请在地图中点击选择位置', trigger: 'blur' }
				],
				wx: [
					{ required: true, message: '请输入微信', trigger: 'blur' }
				],
				qq: [
					{ required: true, message: '请输入qq', trigger: 'blur' }
				],
				bank: [
					{ required: true, message: '请输入银行', trigger: 'blur' }
				],
				branch: [
					{ required: true, message: '请输入支行', trigger: 'blur' }
				],
				bankCard: [
					{ required: true, message: '请输入银行卡号', trigger: 'blur' }
				],
				email:[
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
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
				tel: '',
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
				status: '1',
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
						this.form.status += '';
						this.form.password='';
						this.isstatus = this.form.status == 1 ? true : false;
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
			Sign.then((client) => {
				client.multipartUpload(file.name, file)
					.then(res => {
						this.form.avatar = res.url;
					}).catch(err => {
						console.log(err)
					})
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