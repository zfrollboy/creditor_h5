<template>
	<view class="page">
		<view class="detail-header">
			<view class="header-top">
				<text>{{ allDraw || 0 }}</text>
				<text>帮帮值</text>
			</view>
			<view class="header-bottom">
				<view>
					<text>{{ txDraw || 0 }}</text>
					<text>可用</text>
				</view>
				<view>
					<text>{{ noDraw || 0 }}</text>
					<text>未到账</text>
				</view>
			</view>
		</view>
		<view v-for="(item, index) in dataList" :key="index" class="detail-li">
			<view class="li-i">
				<view>{{ item.typename }}{{ item.goods_price ? ':￥' + item.goods_price : '' }}</view>
				<view>
					<text>{{ item.create_time }}</text>
				</view>
			</view>
			<view :class="'li-i ' + ((item.status == 3 && item.type == 1) || (item.status == 2 && item.type == 2) ? 'themeColor' : '')">
				<view>{{ item.type == 1 ? '+' : item.type == 2 ? '-' : '' }}{{ item.money }}</view>
				<view>{{ (item.status == 3 && item.type == 1) || (item.status == 2 && item.type == 2) ? '' : item.statusname }}</view>
			</view>
		</view>
		<view class="empty" v-if="completed && dataList == 0"></view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
	</view>
</template>

<script>
import { getRegDetail } from '../../../utils/request/api'; // pages/register/detail/detail.js
import { authMixins } from '../../../mixins/authMixins.js';
export default {
	data() {
		return {
			isLoginShow: true,
			allDraw: 0,
			txDraw: 0,
			noDraw: 0,
			dataList: [],
			completed: false
		};
	},
	mixins: [authMixins],
	onLoad: function(options) {
		if (options.code) {
			this.accountAuth(options.code, () => {
				this.getRegDetail();
			},err=>{
				this.isLoginShow=false
			});
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getRegDetail();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
	},
	methods: {
		getRegDetail() {
			getRegDetail().then(res => {
				this.setData({
					completed: true
				});

				if (res.code == 200) {
					this.setData({
						allDraw: res.data.all_draw,
						txDraw: res.data.tx_draw,
						noDraw: res.data.no_draw,
						dataList: res.data.data
					});
				} else if (res.code == 99) {
					this.setData({
						isLoginShow: false
					});
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
						that.getRegDetail();
					}
				}
			);
		}
	}
};
</script>
<style scoped lang="scss">
.detail-header {
	width: 100vw;
	height: 350rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-image: url(data:image/png;base64,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);
	background-size: 100% 100%;
}
.header-top {
	margin-top: 50rpx;
}
.header-top text {
	font-size: 72rpx;
	display: block;
	text-align: center;
	color: #fff;
}
.header-top text + text {
	font-size: 28rpx;
	margin-top: 8rpx;
}
.header-bottom {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-top: 16rpx;
}
.header-bottom text {
	display: block;
	text-align: center;
	font-size: 40rpx;
	color: #fff;
}
.header-bottom text + text {
	font-size: 28rpx;
	margin-top: 14rpx;
}
.detail-li {
	padding: 20rpx 30rpx;
	border-bottom: 1rpx solid #e4e4e4;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.li-i text {
	display: inline-block;
	width: auto;
	font-size: 24rpx;
	color: #999999;
}
.li-i view {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}
.li-i view + view {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
	font-weight: normal;
}
.themeColor view {
	color: $themeColor;
}
</style>
