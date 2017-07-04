<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="商户号">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="密码">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="微信">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="邮箱">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="QQ">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="店铺电话">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="姓名">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="联系人电话">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="身份证">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="籍贯">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="地址">
			<el-select v-model="form.region" style="width:30%;" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
            <el-select v-model="form.region" style="width:30%;" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
            <el-select v-model="form.region" style="width:30%;" placeholder="请选择活动区域">
				<el-option label="区域一" value="shanghai"></el-option>
				<el-option label="区域二" value="beijing"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="详细地址">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="saveShop">立即创建</el-button>
			<el-button @click.native.prevent="returnShop">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    created(){
        
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      saveShop(){
          this.$router.replace('/shop')
      },
      returnShop(){
          this.$router.replace('/shop')
      }
    }
  }
</script>