<template>
	<view class="page">
		<view class="debt-amount">
			<view class="amount-tit">出让{{ keyword }}数额</view>
			<view class="amount-ipt">
				<input @input="bindinput" type="number" :placeholder="'请输入出让' + keyword + '数额'" :value="amount" />
				<text @click="amountAll">全部出售</text>
			</view>
			<view class="amount-tips">
				本次最多可出让{{ keyword }}:￥{{ maxPrice }}
				<!-- <view bindtap="amountTips"></view> -->
			</view>
		</view>
		<view class="gray-margin-b"></view>
		<view class="form-group">
			<view class="label">收款账号</view>
			<custom-picker style="flex:1;" :value="cardVal" name="name" :list="bankList" @confirm="pickerConfirm" @cancel="pickerCancel" placeholder="请绑定支付宝账号"></custom-picker>
			<!-- <view class="picker" bindtap="openAccPicker"></view> -->
		</view>
		<view class="credit-rules">
			<view>规则说明:</view>
			<view>每日最多发起{{ limitNum }}次收购要约</view>
			<view>每次可出售{{ configLowPrice }}至{{ configHighPrice }}{{ keyword }}</view>
			<view>每出售1元{{ keyword }}所需1个帮帮值</view>
			<view>在向您付款时，第三方支付平台或银行将会收取手续费，手续费由您承担。</view>
		</view>
		<button class="lg-btn" :disabled="disable" @click="launch">发起收购要约</button>
		<view class="confirm-bg" v-if="showBuyConfirm">
			<view class="confirm-view">
				<view class="confirm-tit">
					<view>确认发起{{ keyword }}收购要约?</view>
					<view class="tit-amt">
						<text>出让{{ keyword }}</text>
						<text>¥{{ amount }}</text>
					</view>
					<view class="tit-amt">
						<text>出让价格</text>
						<text>¥{{ amount }}</text>
					</view>
					<view class="tit-amt">
						<text>手续费</text>
						<text>¥{{ sCharge }}({{ chargePrice }}%)</text>
					</view>
					<view class="tit-amt">
						<text>实收金额</text>
						<text>¥{{ realAmt }}</text>
					</view>
				</view>
				<view class="confirm-con">
					<view>收款账号信息</view>
					<view>
						<text>姓名</text>
						<text>{{ bankInfo.member_name || '' }}</text>
					</view>
					<view>
						<text>支付宝</text>
						<text>{{ bankInfo.card_num || '' }}</text>
					</view>
				</view>
				<view class="confirm-btn">
					<button @click="cancel">取消</button>
					<button @click="confirm">确定</button>
				</view>
			</view>
		</view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
	</view>
</template>

<script>
import util from '../../utils/util';
import { getMyBankCard, createTransfer, getAgreement } from '../../utils/request/api';
let globalData = getApp().globalData; // pages/offerToBuy/offerToBuy.js
import customPicker from '../../components/customPicker/customPicker';
import { authMixins } from '../../mixins/authMixins.js';
export default {
	data() {
		return {
			keyword: uni.getStorageSync('keyword'),
			isLoginShow: true,
			owePrice: 0,
			devote: 0,
			amount: '',
			bankId: -1,
			disable: true,
			showBuyConfirm: false,
			bankList: [],
			bankOriList: [],
			cardVal: -1,
			bankInfo: {},
			minPrice: 0,
			maxPrice: 0,
			limitNum: 0,
			chargePrice: 0,
			realAmt: 0,
			sCharge: 0,
			configLowPrice: 0,
			//每日转出最低金额
			configHighPrice: 0, //每日转出最高金额
			flag: false //返回进入，执行onshow
		};
	},
	mixins: [authMixins],
	components: {
		customPicker
	},
	onLoad: function(options) {
		// #ifdef MP-WEIXIN
		this.flag = true;
		// #endif
		this.setData({
			configLowPrice: options.configLowPrice,
			configHighPrice: options.configHighPrice,
			maxPrice: options.maxPrice,
			limitNum: options.limitNum
		});
		this.setData({
			keyword: uni.getStorageSync('keyword')
		});
		uni.setNavigationBarTitle({
			title: `发起${uni.getStorageSync('keyword')}收购要约`
		});
		// #ifdef H5
		if (options.code) {
			this.accountAuth(
				options.code,
				() => {
					this.getMyBankList();
				},
				err => {
					this.isLoginShow = false;
				}
			);
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getMyBankList();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
		// #endif
	},
	onShow: function(options) {
		if (this.flag) {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getMyBankList();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
	},
	methods: {
		//转出全部
		amountAll() {
			//转出最小值
			this.setData({
				amount: this.maxPrice.toString()
			});
			this.checkDis();
		},

		// amountTips() {
		//   util.alert({
		//     title: "温馨提示",
		//     content: `每日最多发起${limitNum}次收购要约,每次可出售${this.minPrice}元至${this.maxPrice}元债权\n每转出1元债权所需1个帮帮值`
		//   })
		// },
		openAccPicker() {},

		getAgreement() {
			let _this = this;

			getAgreement().then(res => {
				if (res.code == 200) {
					this.setData({
						chargePrice: res.data.charge_price,
						sCharge: Math.round(res.data.charge_price * _this.amount) * 0.01,
						realAmt: this.amount - Math.round(res.data.charge_price * _this.amount) * 0.01
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

		bindinput(e) {
			let value = e.detail.value;
			this.setData({
				amount: value
			});
			this.checkDis();
		},

		checkDis() {
			let disable = true;

			if (!!this.amount.trim() && this.bankId >= 0) {
				disable = false;
			}

			this.setData({
				disable
			});
		},

		//发起收购要约
		launch() {
			//判断输入金额是否符合要求
			if (Number(this.amount) > Number(this.maxPrice)) {
				util.alert({
					content: '金额超出限制'
				});
				return;
			}

			if (Number(this.amount) < Number(this.configLowPrice)) {
				util.alert({
					content: '转出金额低于最低转出额度'
				});
				return;
			}

			this.getAgreement();
			this.setData({
				showBuyConfirm: true
			});
		},

		pickerConfirm(val) {
			if (val.value) {
				this.setData({
					bankId: val.value.id,
					bankInfo: this.bankOriList.find(ele => {
						return ele.id == val.value.id;
					})
				});
			}

			this.checkDis();
		},

		pickerCancel() {
			this.checkDis();
		},

		cancel() {
			this.setData({
				showBuyConfirm: false
			});
		},

		confirm() {
			createTransfer({
				price: this.amount,
				bank_id: this.bankId
			}).then(res => {
				this.setData({
					showBuyConfirm: false
				});

				if (res.code == 200) {
					uni.navigateTo({
						url: '/pages/agreement/agreement?id=' + res.data.id
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

		getMyBankList() {
			getMyBankCard().then(res => {
				this.flag = true;
				if (res.code == 200) {
					this.bankOriList = res.data;
					let list = res.data.map(ele => {
						return {
							name: `${ele.card_num}`,
							id: ele.id
						};
					});

					if (list.length == 1) {
						this.setData({
							bankInfo: this.bankOriList[0],
							bankId: this.bankOriList[0].id,
							cardVal: 0
						});
					}

					this.setData({
						bankList: list,
						devote: globalData.devote,
						owePrice: globalData.owePrice
					});
					this.checkDis();
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
						that.getMyBankList();
					}
				}
			);
		}
	}
};
</script>
<style lang="scss" scoped>
/* pages/offerToBuy/offerToBuy.wxss */
.amount-tit {
	padding: 0 30rpx;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 32rpx;
	font-weight: bold;
}
.amount-ipt {
	padding-left: 16rpx;
	padding-right: 10rpx;
	height: 150rpx;
	border-top: 1rpx solid #e4e4e4;
	border-bottom: 1rpx solid #e4e4e4;
	display: flex;
	align-items: center;
}
.amount-ipt::before {
	content: '￥';
	font-size: 76rpx;
	display: inline-block;
	vertical-align: middle;
}
.amount-ipt input,
.amount-ipt text {
	margin-top: 20rpx;
	font-size: 28rpx;
}
.amount-ipt input {
	display: inline-block;
	flex: 1;
}
.amount-ipt text {
	color: $themeColor;
	padding: 20rpx;
}
.amount-tips {
	padding: 0 30rpx;
	height: 80rpx;
	line-height: 80rpx;
	color: #666;
	font-size: 24rpx;
}
.amount-tips view {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkZBMUVBOTYzNTVBMTFFOEE3RUE4QzNFRTA5MUNGRDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkZBMUVBOTczNTVBMTFFOEE3RUE4QzNFRTA5MUNGRDIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyRkExRUE5NDM1NUExMUU4QTdFQThDM0VFMDkxQ0ZEMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyRkExRUE5NTM1NUExMUU4QTdFQThDM0VFMDkxQ0ZEMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PloWWs8AAAEJSURBVHjanJKhDsJADIa3CwaHwTJJIMEwhUEhQMzMzw0FyTC8Bhka3BwCM4HHIaYmZkAMCUHAC8BfUpJuGUugyZderv3bu+vpmjDTNBtwM2ABg7dTEAI/iqLzJ1cJkQuXgDqYsNDgNe0lnJPp5IIb6GtfjGKc8xbrfDzqNMJR9lqJceEdaJFwQUeByBEJQ7glqIINmCP+5FgAd1X8EEGuOBXzQBPYoCtilGtV+AFiqUL1Nlcfw1GnowhTrqFK7jOAm4IeCt3zccVz6hRoa2AF0SW3T7mp4uE6BcKHnLMwyg0p4NMDFMzwBA4F47BZ8+cHyH05mt2WnzwWd3K4k4c7rzPCXz/5S4ABAAo1WTadYPmmAAAAAElFTkSuQmCC)
		no-repeat;
	display: inline-block;
	width: 24rpx;
	height: 24rpx;
	vertical-align: middle;
	background-size: 50% 50%;
	background-position: center center;
	padding: 24rpx;
}
.credit-rules {
	padding: 0 30rpx;
}
.credit-rules view {
	color: #333;
	font-size: 24rpx;
	height: 80rpx;
	line-height: 80rpx;
}
.credit-rules view + view {
	color: #666;
	height: unset;
	line-height: unset;
}
.form-group:active {
	opacity: unset;
}
.lg-btn {
	margin-top: 160rpx;
}
.dis-btn {
	background-color: #fe6634;
}
.form-group .picker:empty:before {
	content: '请添加收款账号';
	color: #999;
}

.confirm-bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.3);
}
.confirm-view {
	width: 556rpx;
	margin: 280rpx auto auto;
	background-color: #fff;
}
.confirm-tit {
	background-color: #ff6634;
	padding: 20rpx 30rpx;
}
.confirm-tit view {
	margin-top: 20rpx;
	color: #f4f4f4;
	text-align: center;
	font-size: 36rpx;
}
.confirm-tit .tit-amt {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28rpx;
	color: #fff;
	font-weight: lighter;
}
.confirm-con {
	padding: 30rpx;
}
.confirm-con view {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 20rpx;
}
.confirm-con view text {
	color: #999;
	font-size: 28rpx;
	width: 90rpx;
}
.confirm-con view text + text {
	color: #333;
	text-align: right;
	width: auto;
	flex: 1;
}
.confirm-btn {
	height: 88rpx;
	border-top: 1rpx solid #e4e4e4;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.confirm-btn button {
	flex: 1;
	height: 100%;
	color: #999;
	font-size: 32rpx;
	background-color: #fff;
	border-radius: 0;
}
.confirm-btn button + button {
	color: #ff6634;
	border-left: 1px solid #e4e4e4;
}
</style>
