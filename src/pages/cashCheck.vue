<template>
	<section style="width:100%">
		<el-form :inline="true" :model="editForm" class="demo-form-inline">
		  <el-form-item label="手机号:">
		    <el-input v-model="editForm.tel" placeholder="手机号"></el-input>
		  </el-form-item>
		  <el-form-item label="时间范围选择:" >
			  <el-date-picker style="width: 300px;"
			      v-model="dateValue"
			      @change="dateChange"
			      type="datetimerange"
			      :picker-options="pickerOptions"
			      placeholder="选择时间范围"
			      align="right">
		    </el-date-picker>
	    </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm">查询</el-button>
		  </el-form-item>
		</el-form>
		<el-tabs v-model="activeName2" type="card" @tab-click="handleClick" style="margin-top: 15px;">
	    <el-tab-pane label="未审核" name="first">
	    	<el-table
				    :data="tableData"
				    stripe
				    style="width: 100%">
			    <el-table-column
			      prop="cur_id"
			      label="#"
			      width="80">
			    </el-table-column>
			    <el-table-column
			      prop="user_mobile"
			      label="手机号"
			      sortable
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="card_name"
			      label="用户名"
			      sortable
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="card_tip"
			      sortable
			      label="银行">
			    </el-table-column>
			    <el-table-column
			      prop="card_num"
			      sortable
			      label="银行卡号">
			    </el-table-column>
			    <el-table-column
			      prop="status"
			      sortable
			      label="状态">
			    </el-table-column>
			    <el-table-column
			      prop="money"
			      sortable
			      label="金额">
			    </el-table-column>
			    <el-table-column
			      prop="created_at"
			      sortable
			      label="时间">
			    </el-table-column>
			    <el-table-column
			      prop="operation"
			      label="操作">
			      <template scope="scope">
			        <el-button v-if="scope.row.status === '未审核' " type="primary" size="small" @click="toExamine(scope.row, 1)" >审核</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
	    </el-tab-pane>
	    <el-tab-pane label="已审核" name="second">已审核</el-tab-pane>
	    <el-tab-pane label="已打款" name="third">已打款</el-tab-pane>
	  </el-tabs>
	  <!-- 弹窗1 -->
	  <el-dialog title="提现审核" :visible.sync="dialogFormVisible">
		  <el-form :model="form" class="formBox">
		  	<p class="rechargeItem">提现: <span v-text="form.money"></span></p>
		  	<p class="rechargeItem">提现后: <span v-text="form.outMoney"></span></p>
		  	<p class="rechargeItem">手机号: <span v-text="form.user_mobile"></span></p>
		  	<p class="rechargeItem">姓名: <span v-text="form.user_name"></span></p>
		  	<p class="rechargeItem">身份证号: <span v-text="form.card_id"></span></p>
		  	<p class="rechargeItem">银行: <span v-text="form.card_name"></span></p>
		  	<p class="rechargeItem">银行卡号: <span v-text="form.card_num"></span></p>
		  </el-form>
		  <div class="tipsWrap">
		    <ul class="tips">
		    	<li>1.请仔细核对提现金额</li>
		    	<li>2.确认审核时，请尽量查看用户交易流水是否正常</li>
		    	<li>3.此操作是不可以逆转的，请谨慎操作</li>
		    </ul>
	    </div>
		  <div slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="confirmToExamine">确认审核</el-button>
		    <el-button @click="cancelToExamine">拒绝</el-button>
		  </div>
		</el-dialog>
		<!-- 弹窗2 -->
		<el-dialog title="请输入拒绝理由" :visible.sync="dialogFormVisible2">
		  <el-form :model="form2" class="formBox">
		    <el-input class="deliveryInput" v-model="form2.reason" auto-complete="off" placeholder="请输入拒绝理由"></el-input>
		  </el-form>
		  <el-form :model="form2" class="formBox">
		    <p class="rechargeItem" style="color: red;">请输入拒绝理由，字数不可超过12个字</p>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="recharge2">确认</el-button>
		    <el-button @click="dialogFormVisible2 = false">取 消</el-button>
		  </div>
		</el-dialog>
	</section>
</template>

<script type="text/ecmascript-6">
	import NProgress from 'nprogress'
	import { getDrawList, checkDraw, drawFalse, takeDelivery } from 'api/api'
	import { dateFormat } from 'common/js/dateFormat.js'

  export default {
  	data() {
			return {
				pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
				// dateValue: [new Date(2017, 8, 6, 10, 10), new Date(2017, 8, 9, 10, 10)],
				dateValue: '',
				//编辑界面数据
				editForm: {
					tel: ''
				},
				activeName2: 'first',
				tableData: [{
					cur_id: 0,
          user_mobile: '无',
          card_name: '无',
          card_tip: '无',
          card_num: '无',
          status: '无',
          money: '无',
          created_at: '无'
        }],
        dialogFormVisible: false,
        dialogFormVisible2: false,
        form: {
        	delivery_code: 1000,
        	money: 1000,
        	outMoney: 500,
        	user_mobile: '1580000099293',
        	user_name: '水淀粉',
        	card_id: '41023490345920495203492',
        	card_name: '招行',
        	card_num: '银行卡号'
        },
        form2: {
        	reason: ''
        }

			}
		},
		created() {
			document.title = '提现审核'
		},
		mounted() {
			NProgress.start()
			this.getDrawListEnv()
		},
		methods: {
			recharge2() {
				let params = {
					id: this.id,
					note: this.form2.reason
				}
				let _this = this
				drawFalse(params).then((res) => {
					console.log(res)
					if (res.code !== 200) {
						_this.$notify({
							title: '提示',
							message: res.message,
							type: 'fail'
						})
					} else {
						_this.dialogFormVisible2 = false
						_this.$notify({
							title: '提示',
							message: res.message,
							type: 'success'
						})
					}
					
					NProgress.done()
				})
			},
			delivery() {
				this.dialogFormVisible = false
				let _this = this
				let params = {
					order_id: this.order_id,
					take_no: this.form.delivery_code
				}
				takeDelivery(params).then((res) => {
					console.log(res)
					if (res.code !== 200) {
						this.$notify({
							title: '提示',
							message: res.message,
							type: 'fail'
						})
					} else {
						let data = res
					}
				})
				console.log('确认提货')
			},
			cancelToExamine() {
				this.dialogFormVisible = false
				this.dialogFormVisible2 = true
			},
			confirmToExamine() {
				console.log('user_id:' + this.id)
				let params = {
					id: this.id
				}
				let _this = this
				checkDraw(params).then((res) => {
					console.log(res)
					if (res.code !== 200) {
						_this.$notify({
							title: '提示',
							message: res.message,
							type: 'fail'
						})
					} else {
						_this.dialogFormVisible = false
						_this.$notify({
							title: '提示',
							message: res.message,
							type: 'success'
						})
					}
					
					NProgress.done()
				})
				console.log('确认充值')
				// this.form2.recharge = this.form.rechargeAmount
				// this.form2.curAmount = this.form.balance
				// this.form2.afterRecharge = (this.form2.recharge * 100 + this.form2.curAmount * 100) / 100
				
			},
			toExamine(item, status) {
				this.dialogFormVisible = true
				this.id = item.id
				console.log(this.id)
			},
			handleClick(tab, event) {
				console.log(tab, event)
			},
			dateChange(val) {
				console.log(val)
			},
			getDrawListEnv(params) {
				if (!params) {
					params = {
						params: {
							s_time: '',
							e_time: '',
							status: '',
							user_mobile: '',
							card_name: ''
						}
					}
				}
				let _this = this
				getDrawList(params).then((res) => {
					console.log(res)
					if (res.code !== 200) {
						this.$notify({
							title: '提示',
							message: res.message,
							type: 'fail'
						})
					} else {
						let data = res.data.cnt.data
						let arrs = ['cur_id', 'user_mobile', 'card_name', 'card_tip', 'card_num', 'money', 'created_at']
						data.forEach((value, index) => {
							arrs.forEach((val, val_index) => {
								if (value[val] === '') {
									value[val] = '无'
								}
							})
							switch(value.status) {
								case 0:
									value.status = '未审核'
									break
								case 1:
									value.status = '已审核'
									break
								case 2:
									value.status = '已打款'
									break
							}
							value.cur_id = index

						})
						_this.tableData = data
					}
					
					NProgress.done()
				})
			},
			//获取队列资料
			getQueueInfo() {
				let _this = this
				let params = ''
				getQueueList(params).then((res) => {
					console.log(res)
					_this.editLoading = false
					if (res.code !== 200) {
						_this.$notify({
							title: '提示',
							message: res.message,
							type: 'fail'
						})
					} else {
						let data = res.data.cnt
						_this.queueId = data.id
						// 填充数据
						_this.editForm.queueName = data.name
						_this.editForm.minimumForPrelist = data.min_amount
						_this.editForm.highestForPrelist = data.max_amount
						_this.editForm.highestForPreday = data.day_amount
						_this.editForm.spacing = data.spec
						_this.editForm.serviceCharge = data.poundage
						_this.editForm.protocol = data.protocol
						_this.editForm.closeExplain = data.close_reason
						_this.editForm.queueState = data.status
						_this.editForm.remarks = data.desc
					}
					
					NProgress.done()
				})
			},
			submitForm(formName) {
      	this.stime = dateFormat(this.dateValue[0])
      	this.etime = dateFormat(this.dateValue[1])
      	let params = {
      		params: {
	      		tel: this.editForm.tel,
	      		order_id: this.editForm.order_id,
	      		stime: this.stime,
	      		etime: this.etime
      		}
      	}
      	this.getOrderListEnv(params)
      	console.log(params)
      	
      }
		}
  }
</script>

<style scope lang="stylus" rel="stylesheet/stylus">
  .deliveryInput
  	width: 300px
  	margin: 0 auto
  .rechargeItem
  	margin: 12px 0
  	font-size: 16px
  &.add
  	color: red
  	.label
  		width: 100px
  		text-align: right
	.formBox
		width: 260px
		text-align: left
		margin: 0 auto
	.tipsWrap
		display: block
		text-align: center
		margin-top: 15px
  .tips
  	display: inline-block
  	margin: 0 auto
  	text-align: left
  	li
			margin-bottom: 8px
			font-size: 14px
			color: #848282
  	
</style>
