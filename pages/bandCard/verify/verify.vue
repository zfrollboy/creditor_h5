<template>
	<view class="page">
		<view class="meta"><view class="title">验证银行预留手机号</view></view>
		<form @submit="formSubmit">
			<label class="form-item">
				<view class="form-label">手机号</view>
				<input placeholder="请输入手机号" maxlength="11" type="number" @input="bindinput" placeholder-class="input-pls" data-key="mobile" name="mobile" :value="mobile" />
			</label>
			<label class="form-item">
				<view class="form-label">验证码</view>
				<input placeholder="填写验证码" maxlength="6" @input="bindinput" placeholder-class="input-pls" data-key="code" type="number" name="code" :value="code" />
				<view @click="sendCode" class="send-btn" :class="{ active: isSend }">{{ isSend ? sendText : '发送验证码' }}</view>
			</label>
			<view class="form-buttom">
				<button @click="submit" :loading="submitLoading" formType="submit" :disabled="isComplete || submitLoading" hover-class="btn-active" class="md-btn">
					下一步
				</button>
			</view>
		</form>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				mobile: '',
				code: ''
			},
			isComplete: true,
			submitLoading: false,
			isSend: false,
			isLoginShow: true
		};
	},
	methods: {
		sendCode(e) {
			if (this.isSend) {
				return;
			}
			if (this.verifyMobile()) {
				setTimeout(() => {
					this.isSend = true;
					let times = 60;
					this.sendText = `已发送(${times})`;
					let timer = setInterval(() => {
						times--;
						if (times == 0) {
							this.isSend = false;
							clearInterval(timer);
						}
						this.sendText = `已发送(${times})`;
					}, 1000);
				}, 200);
			}
		},

		verifyMobile() {
			let { mobile } = this.form;
			if (!mobile) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none',
					duration: 2000
				});
				return false;
			} else if (!/(^(1[0-9])\d{9}$)/.test(mobile)) {
				uni.showToast({
					title: '手机号码格式不规范',
					icon: 'none',
					duration: 2000
				});
				return false;
			} else {
				return true;
			}
		},

		formSubmit: function(e) {
			if (!this.verifyMobile()) return;
			this.submitLoading = true;
			setTimeout(() => {
				this.submitLoading = false;
				uni.showToast({
					title: '成功',
					icon: 'none',
					duration: 2000
				});
				uni.navigateTo({
					url: '/pages/bandCard/result/result'
				});
			}, 1000);
		},
		bindinput: function(e) {
			let key = e.currentTarget.dataset.key;
			let value = e.detail.value;
			this.$set(this.form, key, value);
			let form = this.form;
			let isComplete = false;
			for (let key in form) {
				if (!form[key].trim()) {
					isComplete = true;
				}
			}
			this.isComplete = isComplete;
		},
		onMyEvent(e) {
			this.isLoginShow = e.isLoginShow;
			if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
			}
		}
	},
	onLoad: function(options) {
		if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
		} else {
			this.isLoginShow = false;
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
	margin-top: 140rpx;
}

.form-buttom .md-btn[disabled] {
	opacity: 1;
	background: rgba(244, 244, 244, 1) !important;
	color: #cccccc !important;
}

.send-btn {
	min-width: 180rpx;
	height: 60rpx;
	background: rgba(244, 244, 244, 1);
	border-radius: 60rpx;
	display: flex;
	align-items: center;
	transition: 0.1s;
	margin-right: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 500;
	color: rgba(204, 204, 204, 1);
	padding: 0 22rpx;
}
.send-btn.active {
	background: rgba(255, 102, 52, 1);
	color: #fff;
}
</style>
