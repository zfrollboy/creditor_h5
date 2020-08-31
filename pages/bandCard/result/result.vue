<template>
	<view class="page">
		<view class="result-block">
			<image class="success-icon" src="/static/buy_success.png"></image>
			<view class="success-text">添加成功</view>
		</view>
		<view class="result-bottom"><button class="md-btn tab-active" @click="goBack">完成</button></view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLoginShow: true
		};
	},
	methods: {
		goBack() {
			wx.navigateBack({
				delta: 2
			});
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
.result-block {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 84rpx;
}

.success-icon {
	width: 140rpx;
	height: 140rpx;
	margin-bottom: 40rpx;
}

.success-text {
	font-size: 40rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.result-bottom {
	margin-top: 22%;
}
</style>
