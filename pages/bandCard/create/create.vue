<template>
	<view class="page">
		<view class="meta">
			<view class="title">绑定支付宝</view>
			<view class="sub-title">请绑定本人的支付宝</view>
		</view>
		<form @submit="formSubmit">
			<label class="form-item">
				<view class="form-label">用户姓名</view>
				<input
					placeholder="请输入持卡人姓名"
					maxlength="20"
					:disabled="true"
					type="text"
					@input="bindinput"
					placeholder-class="input-pls"
					data-key="member_name"
					name="name"
					:value="member_name"
				/>
			</label>
			<label class="form-item">
				<view class="form-label">支付宝账号</view>
				<input placeholder="支付宝账号" type="text" @input="bindinput" placeholder-class="input-pls" data-key="card_num" name="car_num" :value="this.form.card_num" />
			</label>
			<!-- <label class="form-item">
				<view class="form-label">开户行信息</view>
				<custom-picker style="flex:1;" textAlign="left" name="name" list="{{bankList}}" bind:confirm="pickerConfirm" bind:cancel="pickerCancel" placeholder="请选择开户行"></custom-picker>
			</label> -->
			<view class="form-buttom">
				<button :loading="submitLoading" formType="submit" :disabled="isComplete || submitLoading" hover-class="btn-active" class="md-btn">下一步</button>
			</view>
		</form>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" />
	</view>
</template>

<script>
import { getBankCardList, bankCardAdd, authName } from '../../../utils/request/api';
const globalData = getApp().globalData;
import { authMixins } from '../../../mixins/authMixins.js';
export default {
	data() {
		return {
			form: {
				// member_name:'',
				card_num: ''
				// card_id:'',
			},
			bankList: [],
			isComplete: true,
			submitLoading: false,
			isLoginShow: true,
			member_name: ''
		};
	},
	mixins: [authMixins],
	methods: {
		formSubmit: function(e) {
			// 正则邮箱或手机号
			let aliapyReg = /(^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$)|(^(1)\d{10}$)/;
			if (!aliapyReg.test(this.form.card_num)) {
				uni.showToast({
					title: '请输入有效的邮箱或手机号',
					icon: 'none'
				});
				return;
			}
			this.submitLoading = true;
			this.form.member_name = this.member_name;
			bankCardAdd(this.form).then(res => {
				this.submitLoading = false;
				//成功后跳转结果页
				if (res.code == 200) {
					uni.showToast({
						title: res.msg,
						mask: true,
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/bandCard/result/result'
						});
					}, 2000);
				} else if (res.code == 99) {
					this.isLoginShow = false;
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
				}
			});
		},
		authName() {
			authName().then(res => {
				if (res.code == 200) {
					this.member_name = res.data.auth_name || '';
				} else if (res.code == 99) {
					this.isLoginShow = false;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		bindinput: function(e) {
			let key = e.currentTarget.dataset.key;
			let value = e.detail.value;
			this.$set(this.form, key, value);
			this.checkDis();
		},
		getBankList() {
			getBankCardList().then(res => {
				if (res.code == 200) {
					this.bankList = res.data;
				} else if (res.code == 99) {
					this.isLoginShow = false;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		//校验是否全部输入
		checkDis() {
			let form = this.form;
			let isComplete = false;
			for (let key in form) {
				if (Object.prototype.toString.call(form[key]) == '[object String]') {
					if (!form[key].trim()) {
						isComplete = true;
					}
				} else if (Object.prototype.toString.call(form[key]) == '[object Number]') {
					if (!form[key] < 0) {
						isComplete = true;
					}
				}
			}
			this.isComplete = isComplete;
		},
		pickerConfirm(val) {
			this.$set(this.form, 'card_id', val.detail.value.id);
			this.checkDis();
		},
		pickerCancel() {
			this.checkDis();
		},
		onMyEvent(e) {
			this.isLoginShow = e.isLoginShow;
			if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
				// that.getBankList()
				that.authName();
			}
		}
	},
	onLoad: function(options) {
		if (options.code) {
			this.accountAuth(options.code, () => {
				this.authName();
			},err=>{
				this.isLoginShow=false
			});
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				// this.getBankList()
				this.authName();
			} else {
				this.isLoginShow = false;
			}
		}
	}
};
</script>

<style scoped>
.page {
	background-color: #fff;
}

.meta {
	padding-top: 80rpx;
	padding-bottom: 100rpx;
	text-align: center;
	min-height: 294rpx;
}

.meta .title {
	font-size: 40rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	margin-bottom: 20rpx;
}

.meta .sub-title {
	font-size: 32rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}

.form-item {
	min-height: 86rpx;
	display: flex;
	align-items: center;
	padding-left: 50rpx;
	position: relative;
}
.form-item:first-child::before {
	content: '';
	position: absolute;
	height: 2rpx;
	background-color: #e4e4e4;
	left: 0;
	width: 100%;
	top: 0;
	transform: scaleY(0.5);
}

.form-item::after {
	content: '';
	position: absolute;
	height: 2rpx;
	background-color: #e4e4e4;
	left: 0;
	width: 100%;
	bottom: 0;
	transform: scaleY(0.5);
}

.form-item input {
	font-size: 32rpx;
	font-weight: 400;
	flex: 1;
}

.form-label {
	font-size: 32rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	min-width: 5em;
	margin-right: 40rpx;
}

.form-buttom {
	margin-top: 26%;
}

.form-buttom .md-btn[disabled] {
	opacity: 1;
	background: rgba(244, 244, 244, 1) !important;
	color: #cccccc !important;
}
</style>
