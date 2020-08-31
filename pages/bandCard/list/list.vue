<template>
	<view class="page">
		<view class="card-content">
			<view class="card-item-box" :data-index="index" @touchstart="touchstart" @touchmove="touchmove" v-for="(item, index) in bankList" :key="item.id">
				<view class="card-item" :class="{ 'short-item': item.showDel }">
					<text>{{ item.member_name }}</text>
					<text>支付宝：{{ item.card_num }}</text>
				</view>
				<view :data-id="item.id" class="del-button" :class="{ 'del-show': item.showDel }" @click.stop="unbind">解绑</view>
			</view>
			<navigator class="create-btn" v-if="bankList.length <= 0 && loadingCompleted" url="/pages/bandCard/create/create">
				<image src="/static/icon-plus-bold.png"></image>
				<text>绑定支付宝</text>
			</navigator>
		</view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" />
	</view>
</template>

<script>
import { getMyBankCard, delBankCard } from '../../../utils/request/api';
export default {
	data() {
		return {
			isLoginShow: true,
			bankList: [],
			startX: 0,
			endX: 0,
			loadingCompleted: false,
			flag: false //返回进入，执行onshow
		};
	},
	methods: {
		touchstart: function(e) {
			var startX = e.changedTouches[0].clientX;
			this.setData({
				startX: startX
			});
		},
		touchmove: function(e) {
			var endX = e.changedTouches[0].clientX,
				index = e.currentTarget.dataset.index;
			if (Math.abs(parseInt(endX) - parseInt(this.startX)) > 80) {
				this.setData({
					[`bankList[${index}].showDel`]: parseInt(endX) - parseInt(this.startX) < 0,
					endX: endX
				});
			}
		},
		getMyBankList() {
			getMyBankCard().then(res => {
				this.setData({
					loadingCompleted: true
				});
				if (res.code == 200) {
					this.flag = true;
					this.setData({
						bankList: res.data.map(ele => {
							return {
								...ele,
								showDel: false
							};
						})
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
		unbind(e) {
			let _this = this;
			uni.showModal({
				title: '是否解除绑定？',
				confirmText: '确定',
				cancelText: '取消',
				confirmColor: '#FF6634',
				cancelColor: '#999999',
				success: res => {
					if (res.confirm) {
						_this._unbind(e.target.dataset.id);
					}
				}
			});
		},
		_unbind(id) {
			let _this = this;
			delBankCard({ id }).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: '解绑成功',
						duration: 2000
					});
					setTimeout(() => {
						_this.getMyBankList();
					}, 2000);
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
		onMyEvent(e) {
			this.isLoginShow = e.isLoginShow;
			if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
				// that.getBankList()
				that.getMyBankList();
			}
		}
	},
	onLoad(options) {
		// #ifdef MP-WEIXIN
		this.flag = true;
		// #endif
		// #ifdef H5
		if (!this.flag) {
			if (options.code) {
				this.accountAuth(options.code, () => {
					this.getMyBankList();
				},err=>{
				this.isLoginShow=false
			});
			} else {
				if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
					// this.getBankList()
					this.getMyBankList();
				} else {
					this.isLoginShow = false;
				}
			}
		}
		// #endif
	},
	onShow() {
		if (this.flag) {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				// this.getBankList()
				this.getMyBankList();
			} else {
				this.isLoginShow = false;
			}
		}
	}
};
</script>

<style scoped>
.page {
	background-color: rgba(248, 248, 248, 1);
}

.card-content {
	padding: 30rpx 26rpx 30rpx;
}
.card-item-box {
	height: 226rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	display: flex;
}
.card-item {
	overflow: hidden;
	height: 100%;
	padding-left: 60rpx;
	font-size: 36rpx;
	color: #333;
	background-color: #f4f4f4;
	transition: all 0.4s;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	padding-top: 50rpx;
	padding-bottom: 50rpx;
	/* background-size: 100% 100%;
	  background-repeat: no-repeat; */
}
.create-btn {
	background-color: #fff;
	height: 146rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	font-size: 32rpx;
}

.create-btn image {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
}

.short-item {
	width: calc(100% - 150rpx);
	padding-left: 44rpx;
}
.del-button {
	height: 100%;
	width: 0;
	background-color: #ff3b32;
	color: #fff;
	line-height: 226rpx;
	text-align: center;
	transition: width 0.4s;
	display: inline-block;
	overflow: hidden;
	font-size: 32rpx;
}
.del-show {
	width: 150rpx;
}
</style>
