<template>
	<view class="page">
		<cu-service></cu-service>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
		<view class="back-tag" @click.stop="goMall">
			<image src="/static/icon-mall-back.png"></image>
			<text>商城</text>
		</view>
		<view class="detail-header">
			<view class="header-bg" @click="goRegDetail">
				<text>{{ devote }}</text>
				<text>帮帮值</text>
				<text class="tips-text">分享好友下单获得更多帮帮值</text>
			</view>
			<view class="detail-amount">
				<view>
					<text>登记{{ keyword }}余额：</text>
					<text>{{ owePrice }}</text>
				</view>
				<button class="md-btn" @click="offerToBuy">发起收购要约</button>
			</view>
		</view>
		<view class="detail-menu">
			<view class="menu-i" @click="goCreate">
				<image src="/static/menu_create.png"></image>
				<text>登记{{ keyword }}</text>
			</view>
			<view class="menu-i" @click="goRecord">
				<image src="/static/menu_record.png"></image>
				<text>{{ keyword }}出让记录</text>
			</view>
		</view>
		<view class="detail-menu">
			<view class="menu-i" @click="goBindCard">
				<image src="/static/menu_card.png"></image>
				<text>收款账户</text>
			</view>
			<!-- <view class="menu-i"></view> -->
			<view class="menu-i" @click="goServe">
				<image src="/static/menu_introduce.png"></image>
				<text>{{ keyword }}人服务介绍</text>
			</view>
		</view>
		<!-- <view class="detail-menu">
		<button open-type="contact" class="menu-i" bindcontact="handleContact ">
			<image src="/images/kefu.png"></image>
			<text>客服</text>
		</button>
		<view class="menu-i"></view>
	</view> -->
		<view class="serve-alert-mask" v-if="showAlert">
			<view class="serve-alert">
				<view class="serve-alert-content">
					<view>您的账户暂被禁止发起收购要约</view>
					<view>原因：{{ remark }}</view>
					<view>联系客服了解具体情况</view>
				</view>
				<view class="serve-alert-btn" @click="handlerConfirm">我知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getMember } from '../../utils/request/api';
import util from '../../utils/util';
let globalData = getApp().globalData; // pages/creditorDetail/creditorDetail.js
import { authMixins } from '../../mixins/authMixins.js';
export default {
	data() {
		return {
			keyword: '',
			isLoginShow: true,
			devote: '0',
			//贡献值
			owePrice: '0.00',
			//未兑换
			minPrice: 0,
			//最低转出金额
			maxPrice: 0,
			//最多转出金额
			status: 1,
			//是否禁止出售债权 1否 2是
			debtStatus: 0,
			//判断提示 1提示顺序1 2提示顺序2
			remark: '',
			//拒绝原因
			showAlert: false,
			limitNum: 0,
			//每日转出次数
			configLowPrice: 0,
			//每日转出最低金额
			configHighPrice: 0, //每日转出最高金额
			flag: false //返回进入，执行onshow
		};
	},
	mixins: [authMixins],
	onShow() {
		if (this.flag) {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getMember();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
	},
	onLoad(e) {
		// #ifdef MP-WEIXIN
		this.flag = true;
		// #endif
		this.keyword = uni.getStorageSync('keyword');
		if (e.new == 1) {
			util.alert({
				content: '右来帮已开通！'
			});
		}
		// #ifdef H5
		if (e.code) {
			this.accountAuth(
				e.code,
				() => {
					this.getMember();
				},
				err => {
					this.isLoginShow = false;
				}
			);
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getMember();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
		// #endif
	},

	onPullDownRefresh() {
		if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
			this.getMember();
		} else {
			this.setData({
				isLoginShow: false
			});
		}
	},

	methods: {
		offerToBuy() {
			let _this = this;

			if (this.status == 2) {
				_this.setData({
					showAlert: true
				});
			} else if (this.debtStatus == 1) {
				uni.showModal({
					content: '您没有登记的' + this.keyword + '，请先进行登记！',
					confirmText: '立刻登记',
					cancelText: '取消',
					confirmColor: '#FF6634',
					cancelColor: '#999999',
					success: res => {
						if (res.confirm) {
							_this.goCreate();
						}
					}
				});
			} else if (this.debtStatus == 2) {
				util.alert({
					content: `您登记的${this.keyword}还在审核中，别着急，很快就好啦！`
				});
			} else {
				uni.navigateTo({
					url: `/pages/offerToBuy/offerToBuy?configLowPrice=${this.configLowPrice}&configHighPrice=${this.configHighPrice}&maxPrice=${this.maxPrice}&limitNum=${this.limitNum}`
				});
			}
		},

		goMall() {
			// #ifdef MP-WEIXIN
			uni.navigateToMiniProgram({
				appId: 'wx1c16e109ac7ddad9',
				path: '/pages/index/index/index',
				extraData: {},
				envVersion: globalData.envVersion,

				success(res) {
					// 打开成功
					console.log(res);
				}
			});
			// #endif
			// #ifdef H5
			uni.navigateTo({
				url: '/pages/mallShareMiddle/mallShareMiddle'
			});
			// #endif
		},

		goCreate() {
			uni.navigateTo({
				url: '/pages/register/myDebt/myDebt'
			});
		},

		goRecord() {
			uni.navigateTo({
				url: '/pages/register/record/record'
			});
		},

		goBindCard() {
			uni.navigateTo({
				url: '/pages/bandCard/list/list'
			});
		},

		goServe() {
			uni.navigateTo({
				url: '/pages/creditorServer/creditorServer?hasReg=1'
			});
		},

		goRegDetail() {
			uni.navigateTo({
				url: '/pages/register/detail/detail'
			});
		},

		getMember() {
			getMember({}).then(res => {
				uni.stopPullDownRefresh();
				this.flag = true;
				if (res.code == 200) {
					if (res.data.service_status == 0) {
						uni.reLaunch({
							url: '/pages/creditorServer/creditorServer'
						});
					} else if (res.data.agree_status == 0) {
						uni.reLaunch({
							url: '/pages/step/agreement/agreement'
						});
					} else if (res.data.auth_status == 0) {
						uni.reLaunch({
							url: '/pages/step/idAuth/idAuth'
						});
					} else if (res.data.invite_status == 0) {
						uni.reLaunch({
							url: '/pages/step/mall/mall'
						});
					} else {
						globalData.devote = res.data.devote || 0;
						globalData.owePrice = res.data.owe_price || 0;
						globalData.anxinid = res.data.anxinid;
						this.setData({
							devote: res.data.devote || 0,
							owePrice: res.data.owe_price || '0.00',
							minPrice: res.data.limit_low_price || 0,
							maxPrice: res.data.limit_high_price || 0,
							configHighPrice: res.data.config_high_price || 0,
							configLowPrice: res.data.config_low_price || 0,
							status: res.data.status,
							debtStatus: res.data.is_flag,
							remark: res.data.remark || '',
							limitNum: res.data.limit_num || 0
						});
					}
				} else if (res.code == 99) {
					this.setData({
						isLoginShow: false
					});
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},

		handlerConfirm() {
			this.setData({
				showAlert: false
			});
		},

		handleContact(e) {
			console.log(e);
		},

		//获取授权后返回的信息
		onMyEvent: function(e) {
			var that = this;
			that.setData(
				{
					isLoginShow: e.isLoginShow
				},
				function() {
					if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
						that.getMember();
					}
				}
			);
		}
	}
};
</script>
<style scoped lang="scss">
.header-bg {
	width: 100%;
	height: 412rpx;
	background-image: url(data:image/png;base64,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);
	background-repeat: no-repeat;
	background-size: 100% auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.header-bg text {
	color: #fff;
	font-size: 72rpx;
	margin-top: 48rpx;
}

.header-bg text + text {
	margin-top: 4rpx;
	font-size: 28rpx;
}

.header-bg .tips-text {
	font-size: 26rpx;
	margin-top: 8rpx;
}

.header-bg view {
	width: 168rpx;
	height: 56rpx;
	line-height: 56rpx;
	text-align: center;
	background-color: #fff;
	color: $themeColor;
	margin-top: 12rpx;
	border-radius: 56rpx;
}

.detail-amount {
	width: 668rpx;
	height: 250rpx;
	margin: -168rpx auto 40rpx;
	background-color: #fff;
	box-shadow: 0 0 20rpx rgba(254, 107, 46, 0.19);
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 32rpx 0;

	justify-content: center;
}

.md-btn {
	height: 76rpx;
	line-height: 76rpx;
	border-radius: 76rpx;
	/* margin-top: 22rpx; */
	margin-top: 46rpx;
}

.detail-amount view {
	display: flex;
	align-items: center;
}

.detail-amount text {
	font-size: 28rpx;
	color: #333;
}

.detail-amount text + text {
	font-size: 28rpx;
	/* font-size: 60rpx; */
	color: #333;
	margin-left: 20rpx;
}

.detail-amount .ver-line {
	flex: unset;
}

.ver-line {
	height: 100%;
	width: 2rpx;
	background-color: #e4e4e4;
}

.detail-menu {
	width: 100%;
	height: 206rpx;
	display: flex;
	border-top: 1px solid #e4e4e4;
}

.detail-menu:last-child {
	border-top: 1px solid #e4e4e4;
	border-bottom: 1px solid #e4e4e4;
}

.detail-menu .menu-i {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.detail-menu button.menu-i {
	background-color: #fff;
	padding: 0;
	line-height: unset;
}

.detail-menu .menu-i + .menu-i {
	border-left: 1px solid #e4e4e4;
}

.detail-menu image {
	width: 80rpx;
	height: 80rpx;
}

.detail-menu text {
	font-size: 28rpx;
	color: #333;
	margin-top: 8rpx;
}

.back-tag {
	position: absolute;
	left: 0;
	top: 54rpx;
	border-radius: 0 40rpx 40rpx 0 !important;
	background-color: #fff;
	color: #ff6634 !important;
	text-align: center;
	height: 50rpx;
	display: flex !important;
	align-items: center;
	justify-content: center;
	padding: 0 20rpx 0 0rpx;
	z-index: 2;
}

.back-tag image {
	width: 36rpx;
	height: 36rpx;
}

.back-tag text {
	font-size: 24rpx !important;
	color: rgba(255, 102, 52, 1);
}
</style>
