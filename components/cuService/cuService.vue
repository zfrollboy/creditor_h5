<template>
	<view class="cu-service">
		<!-- #ifdef MP-WEIXIN -->
		<button open-type="contact" @contact="handleContact"><image src="/static/kefu.png"></image></button>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<image src="/static/kefu.png" @click="handleContact"></image>
		<!-- #endif -->
	</view>
</template>

<script>
import { alert } from '../../utils/util.js';
export default {
	methods: {
		handleContact(e) {
			// #ifdef MP-WEIXIN
			console.log(e);
			// #endif
			// #ifdef H5
			alert({
				content: '客服系统开发中...'
			});
			// #endif
		}
	}
};
</script>

<style scoped>
.cu-service {
	position: fixed;
	z-index: 90;
	right: 0;
	bottom: 18%;
	border-bottom-left-radius: 34rpx;
	border-top-left-radius: 34rpx;
	overflow: hidden;
}
.cu-service button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	line-height: unset;
	/* height: 68rpx; */
	/* min-width: 200rpx; */
	/* padding: 12rpx 20rpx 12rpx 12rpx; */
	background-color: transparent;
	/* font-size: 28rpx; */
	color: #fff;
	border-radius: 0;
}
.cu-service image {
	width: 96rpx;
	height: 96rpx;
	/* margin-right: 12rpx; */
}
</style>
