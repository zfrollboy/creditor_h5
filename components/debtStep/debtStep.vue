<template>
	<view class="steps">
		<view class="steps-content">
			<view class="steps-node" v-for="(item, idx) in steps" :key="idx">
				<view class="tag">
					<image src="/static/time-line-check.png" v-if="idx == currentSteps"></image>
					<view class="tag-active" v-if="idx < currentSteps"></view>
					<view class="tag-gray" v-if="idx > currentSteps"></view>
				</view>
				<view class="text" :class="{ current: idx <= currentSteps }">{{ item.text }}</view>
			</view>
			<view class="steps-line"><view class="steps-line-light" :style="'width: calc((187.5rpx * ' + currentSteps + ') + (187.5rpx / 2) - 30rpx);'"></view></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		currentSteps: {
			type: [Number,String]
		}
	},
	data() {
		return {
			steps: [
				{
					text: '确认协议'
				},
				{
					text: '实人认证'
				},
				{
					text: '邀新下单'
				},
				{
					text: '服务开通'
				}
			]
		};
	}
};
</script>

<style scoped lang="scss">
.steps {
	overflow-y: auto;
	padding-top: 10rpx;
	background-color: $white;
	border-bottom: 20rpx solid rgba(248, 248, 248, 1);
	height: 130rpx;
	position: relative;
}

.steps-content {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;
}

.steps .steps-node {
	width: 25%;
	min-width: 25%;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	position: relative;
	z-index: 10;
}

.steps-node .tag {
	width: 44rpx;
	height: 44rpx;
	margin-bottom: 6rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.steps-node .text.current {
	color: #ff6634;
}

.steps-node .tag image {
	display: block;
	width: 100%;
	height: 100%;
}

.steps-node .tag-gray,
.steps-node .tag-active {
	width: 28rpx;
	height: 28rpx;
	min-width: 28rpx;
	min-height: 28rpx;
	max-width: 28rpx;
	max-height: 28rpx;
	background: rgba(228, 228, 228, 1);
	border-radius: 50%;
}

.steps-node .tag-active {
	background: #ff6634;
}

.steps-line {
	position: absolute;
	height: 4rpx;
	background: rgba(228, 228, 228, 1);
	border-radius: 8rpx;
	left: 30rpx;
	right: 30rpx;
	top: 22rpx;
	overflow: hidden;
}

.steps-line-light {
	height: 100%;
	background-color: #ff6634;
	/* width: calc((187.5rpx * 0) + (187.5rpx / 2) - 30rpx); */
}
</style>
