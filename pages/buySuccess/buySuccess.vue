<template>
	<view class="buy-success page">
		<image src="/static/buy_success.png"></image>
		<view>提交成功！</view>
		<view>您的{{ keyword }}收购要约已成功提交。</view>
		<view>审核、付款时间约为1-3个工作日</view>
		<view>如遇问题请联系客服。</view>
		<button class="md-btn" @click="submit">完成</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: uni.getStorageSync("keyword")
		};
	},
	methods: {
		submit() {
			uni.navigateBack({
				delta: 3
			});
		}
	},
	onLoad() {
		this.setData({
			keyword: uni.getStorageSync("keyword")
		});
		uni.setNavigationBarTitle({
			title: `出让${uni.getStorageSync("keyword")}`
		});
	}
};
</script>
<style>
/* pages/buySuccess/buySuccess.wxss */
.buy-success {
	display: flex;
	align-items: center;
	flex-direction: column;
}
.buy-success image {
	width: 140rpx;
	height: 140rpx;
}
.buy-success view {
	color: #333;
	font-size: 36rpx;
	font-weight: bold;
	margin-top: 44rpx;
	width: 522rpx;
	text-align: center;
}
.buy-success view + view {
	margin-top: 30rpx;
	font-size: 28rpx;
	font-weight: normal;
}
.md-btn {
	margin-top: 160rpx;
}
</style>
