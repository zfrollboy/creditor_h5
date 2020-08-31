<template>
	<view class="page">
		<view class="success">
			<image src="/static/auth_success.png" mode="widthFix"></image>
			<view class="success-t1">实人认证完成</view>
			<view class="success-t2">这里是下一步指引描述...以及需提前告知的一些内容....</view>
		</view>
		<view class=" fixed-bottom"><button bindtap="submit" class="lg-btn" :loading="submitLoading" :disabled="submitLoading" hover-class="btn-active">下一步</button></view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" />
	</view>
</template>

<script>
import { checkH5Auth } from '../../utils/request/api'; // pages/step/idAuth/idAuth.js
export default {
	data() {
		return {
			submitLoading: false
		};
	},
	methods: {
		submit() {
			wx.redirectTo({
				url: '/pages/step/mall/mall'
			});
		},
		checkH5Auth() {
			checkH5Auth({
				bizToken: getApp().globalData.bizToken
			}).then(res => {
				if (res.code == 200) {
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
		onMyEvent: function(e) {
			var that = this;
			that.setData(
				{
					isLoginShow: e.isLoginShow
				},
				function() {
					if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
						this.checkH5Auth();
					}
				}
			);
		}
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: `${uni.getStorageSync("keyword")}人服务协议`
		});
		this.checkH5Auth();
	}
};
</script>

<style scoped>
.success {
	position: absolute;
	top: 36%;
	left: 0;
	right: 0;
	padding: 0 32rpx;
	transform: translateY(-50%);
	text-align: center;
}

.success image {
	width: 390rpx;
	display: block;
	margin: 0 auto 22rpx;
}

.success-t1 {
	font-size: 32rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	margin-bottom: 30rpx;
}

.success-t2 {
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 40rpx;
}
</style>
