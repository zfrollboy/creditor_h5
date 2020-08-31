<template>
	<view>
		<view class="trtcFailTop"><icon class="icon-box-img" type="warn" size="100"></icon></view>
		<view class="trtcFailWarn"><view>审核不通过</view></view>
		<view class="trtcFailWarnDetail">
			<view>{{ failInfo.ErrorMsg }}</view>
		</view>
		<view class="trtcFailWarnToken" v-if="BizToken">
			<view>({{ BizToken }})</view>
		</view>
		<view class="fail-btn"><button bindtap="backToIndex" hover-class="btn-hover">退出</button></view>
	</view>
</template>

<script>
	export default{
		props:["failInfo", "BizToken", "aaa"]
	}
</script>

<style></style>
