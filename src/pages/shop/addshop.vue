<template>
	<el-form ref="form" :model="form" label-width="100px" :rules="editFormRules" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="上传图片" prop="avatar">
			<el-upload class="avatar-uploader" action="" :file-list="filelist" :http-request="handleRequestOss" list-type="picture-card" :on-change="handlechange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="getUpstr">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog v-model="dialogVisible" size="tiny">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</el-form-item>
		<el-form-item label="店铺名称" prop="shopname">
			<el-input v-model="form.shopname"></el-input>
		</el-form-item>
		<el-form-item label="服务电话" prop="phone">
			<el-input v-model="form.phone"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item>
			<el-input type="hidden" v-model="form.avatar"></el-input>
		</el-form-item>
		<el-form-item label="微信" prop="wx">
			<el-input v-model="form.wx"></el-input>
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="form.email"></el-input>
		</el-form-item>
		<el-form-item label="QQ" prop="qq">
			<el-input v-model="form.qq"></el-input>
		</el-form-item>
		<el-form-item>
			<el-input type="hidden"></el-input>
		</el-form-item>
		<el-form-item label="联系人" prop="shopuser">
			<el-input v-model="form.shopuser"></el-input>
		</el-form-item>
		<el-form-item label="身份证" prop="card">
			<el-input v-model="form.card"></el-input>
		</el-form-item>
		<el-form-item label="联系人电话" prop="tel">
			<el-input v-model="form.tel"></el-input>
		</el-form-item>
		<el-form-item label="籍贯" prop="place">
			<el-input v-model="form.place"></el-input>
		</el-form-item>
		<el-form-item>
			<el-input type="hidden"></el-input>
		</el-form-item>
		<el-form-item label="银行" prop="bank">
			<el-select v-model="form.bank" placeholder="请选择银行">
				<el-option v-for="item in banklist" :key="item.bankName" :label="item.bankName" :value="item.bankName"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="支行" prop="branch">
			<el-input v-model="form.branch"></el-input>
		</el-form-item>
		<el-form-item label="银行卡" prop="bank_card">
			<el-input v-model="form.bank_card"></el-input>
		</el-form-item>
		<el-form-item>
			<el-input type="hidden"></el-input>
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
			<el-input :disabled="true" v-model="form.address"></el-input>
		</el-form-item>
		<el-form-item>
			<el-amap-search-box class="search-box" :on-search-result="onSearchResult"></el-amap-search-box>
			<el-amap vid="amapDemo" :center="mapCenter" style="height:600px;" :events="events" :plugin="plugins" :zoom="zoom">
				<el-amap-marker :position="marker.position">
				</el-amap-marker>
			</el-amap>
			<el-input type="hidden" v-model="form.latitude"></el-input>
		</el-form-item>
		<el-form-item prop="latitude">
			<el-input type="hidden" v-model="form.latitude"></el-input>
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
import VueAMap from 'vue-amap';
import Sign from 'common/sign'
export default {
	data() {
		return {
			banklist: [{ "id": 51, "bankName": "北京银行" }, { "id": 63, "bankName": "光大银行" }, { "id": 64, "bankName": "广发银行" }, { "id": 65, "bankName": "工商银行" }, { "id": 74, "bankName": "花旗银行" }, { "id": 75, "bankName": "恒生银行" }, { "id": 76, "bankName": "华夏银行" }, { "id": 85, "bankName": "建设银行" }, { "id": 86, "bankName": "交通银行" }, { "id": 90, "bankName": "兰州银行" }, { "id": 91, "bankName": "民生银行" }, { "id": 95, "bankName": "农业银行" }, { "id": 97, "bankName": "平安银行" }, { "id": 98, "bankName": "浦发银行" }, { "id": 103, "bankName": "上海银行" }, { "id": 113, "bankName": "兴业银行" }, { "id": 116, "bankName": "邮储银行" }, { "id": 118, "bankName": "中国银行" }, { "id": 123, "bankName": "招商银行" }, { "id": 125, "bankName": "中信银行" }, { "id": 126, "bankName": "郑州银行" }],
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
			searchOption: {
				city: '郑州',
				citylimit: true
			},
			mapCenter: [113.65, 34.76],
			editFormRules: {
				shopname: [
					{ required: true, message: '请输入店铺名称', trigger: 'blur' }
				],
				shopuser: [
					{ required: true, message: '请输入联系人', trigger: 'blur' }
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
				bank_card: [
					{ required: true, message: '请输入银行卡号', trigger: 'blur' }
				],
				email: [
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
				]
			},
			plugins: [

			],
			events: {
				'moveend': () => {
				},
				'zoomchange': () => {
				},
				'click': (e) => {
					console.log(e);
					// console.log(Geocoder)

					this.marker.position = [e.lnglat.lng, e.lnglat.lat]

					this.form.longitude = e.lnglat.lng + '';
					this.form.latitude = e.lnglat.lat + "";

					this.getAddress(e);

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
				bank_card: ''
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
						this.selectedOptions = [];

						this.selectedOptions = [TextToCode[this.form.province].code, TextToCode[this.form.province][this.form.city].code, TextToCode[this.form.province][this.form.city][this.form.area].code];
						this.filelist = [{ name: "", url: this.form.avatar }]
						this.form.status += '';
						this.form.password = '';
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
		getAddress(e) {
			let geocoder = new AMap.Geocoder({
				radius: 1000,
				extensions: "all"
			});
			geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
				if (status === 'complete' && result.info === 'OK') {
					if (result && result.regeocode) {
						this.form.address = result.regeocode.formattedAddress;
						this.$nextTick();
					}
				}
			})
		},
		onSearchResult(pois) {
			let latSum = 0;
			let lngSum = 0;
			if (pois.length > 0) {
				pois.forEach(poi => {
					let { lng, lat } = poi;
					lngSum += lng;
					latSum += lat;

					this.marker.position = [poi.lng, poi.lat];
				});
				let center = {
					lng: lngSum / pois.length,
					lat: latSum / pois.length
				};
				this.mapCenter = [center.lng, center.lat];
				this.getAddress({lnglat:{lng:center.lng,lat:center.lat}})
			}
		},
		//图片上传
		handleRemove(file, fileList) {
			console.log(file, fileList);
			this.form.avatar = '';
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
				client.multipartUpload('/pic/' + new Date().getTime() + Math.floor(Math.random() * 1000) + '.png', file)
					.then(res => {
						this.form.avatar = (res.res.requestUrls[0]).split('?')[0];
					}).catch(err => {
						console.log(err)
					})
			})

		},
		saveShop() {
			var _this = this;
			let { params } = this.$route;
			_this.$refs.form.validate((valid) => {
				if (valid) {

					_this.$confirm('确认提交吗？', '提示', {}).then(() => {
						_this.editLoading = true;
						NProgress.start();
						_this.btnEditText = '提交中';
						console.log(_this.form)
						if (params.id == 0) {

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
<style>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	width: 375px;
	height: 50px;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #20a0ff;
}

.avatar-uploader .el-upload .el-icon-plus {
	position: absolute;
	top: 50%;
	margin-top: -14px;
}

.el-upload-list--picture-card .el-upload-list__item {
	width: 375px;
	height: 50px;
}
</style>
