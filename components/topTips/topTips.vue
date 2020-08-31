<template>
	<view class="top-tips">
		<text>{{ tips }}</text>
	</view>
</template>

<script>
export default {
	props: {
		tips: {
			type: String
		}
	}
};
</script>

<style scoped>
.top-tips {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	width: 100vw;
	background-color: rgba(0, 0, 0, 0.6);
	line-height: 66rpx;
	padding: 8rpx 30rpx;
	z-index: 999;
}
.top-tips text {
	font-size: 28rpx;
	color: #fff;
}
</style>
