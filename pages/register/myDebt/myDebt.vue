<template>
	<view class="page">
		<view class="debt-explain">
			<view>{{ explain }}</view>
			<button class="lg-btn" @click="createDebt">登记{{ keyword }}</button>
		</view>
		<view class="gray-margin-b"></view>
		<view class="debt-record">
			<view class="section-title">我的登记{{ keyword }}</view>
			<block v-for="(item, index) in bondList" :key="index">
				<view class="record-li">
					<view class="li-i">
						<text>投资机构名称</text>
						<text>{{ item.organ_name || '' }}</text>
					</view>
					<view class="li-i">
						<text>合同编号</text>
						<text>{{ item.contruct_no || '' }}</text>
					</view>
					<view class="li-i">
						<text>登记的{{ keyword }}金额</text>
						<text>￥{{ item.lend_price || 0 }}</text>
					</view>

					<view class="li-i" v-if="item.status == 3">
						<text>驳回原因</text>
						<text>{{ item.remark || '' }}</text>
					</view>

					<view class="status">{{ item.status | debtStatus }}</view>
				</view>
				<view :class="'more-detail ' + (item.showMore ? 'more-detail-show' : '')">
					<view class="gray-margin-b"></view>
					<view class="section-title">登记的{{ keyword }}信息</view>
					<view class="record-li">
						<view class="li-i">
							<text>出借本金</text>
							<text>￥{{ item.lend_price || 0 }}</text>
						</view>
						<view class="li-i">
							<text>未兑付本金</text>
							<text>￥{{ item.owe_price || 0 }}</text>
						</view>
						<view class="li-i">
							<text>出借期数</text>
							<text>{{ item.period || 0 }}</text>
						</view>
						<view class="li-i">
							<text>合同签约日</text>
							<text>{{ item.sign_time || '' }}</text>
						</view>
						<view class="li-i">
							<text>债务方</text>
							<text>{{ item.name || '' }}</text>
						</view>
						<view class="li-i">
							<text>债务方电话</text>
							<text>{{ item.phone || '' }}</text>
						</view>
					</view>
					<block v-if="item.contruct && item.contruct.length > 0">
						<view class="gray-margin-b"></view>
						<view class="section-title">合同</view>
						<view class="record-li agreement">
							<image v-for="(citem, cindex) in item.contruct" :key="cindex" @click="previewImage" :data-src="citem" :data-img-list="item.contruct" :src="citem"></image>
						</view>
					</block>
				</view>
				<view :class="'more ' + (item.showMore ? 'icon-up' : '')" @click="switchMore" :data-index="index">
					<text :data-index="index">{{ item.showMore ? '收起' : '更多信息' }}</text>
				</view>
			</block>
			<view class="empty" v-if="completed && bondList == 0"></view>
		</view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
	</view>
</template>

<script>
import { getMyBond, getExplain, getMember } from '../../../utils/request/api';
import util from '../../../utils/util';
const globalData = getApp().globalData; // pages/register/myDebt/myDebt.js
import { authMixins } from '../../../mixins/authMixins.js';
export default {
	data() {
		return {
			keyword: uni.getStorageSync('keyword'),
			isLoginShow: true,
			showMore: false,
			explain: '',
			bondList: [],
			completed: false,
			flag: false //返回进入，执行onshow
		};
	},
	mixins: [authMixins],
	onShow: function(options) {
		if (this.flag) {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getMyBond();
				this.getExplain();
				this.getMember();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
	},

	onLoad(options) {
		// #ifdef MP-WEIXIN
		this.flag = true;
		// #endif
		this.setData({
			keyword: uni.getStorageSync('keyword')
		});
		uni.setNavigationBarTitle({
			title: `我登记的${uni.getStorageSync('keyword')}`
		});
		// #ifdef H5
		if (options.code) {
			this.accountAuth(options.code, () => {
				this.getMyBond();
				this.getExplain();
				this.getMember();
			},err=>{
				this.isLoginShow=false
			});
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getMyBond();
				this.getExplain();
				this.getMember();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
		// #endif
	},

	methods: {
		switchMore(e) {
			let index = e.target.dataset.index;
			this.setData({
				[`bondList[${index}].showMore`]: !this.bondList[index].showMore
			});
		},

		getExplain() {
			getExplain().then(res => {
				if (res.code == 200) {
					this.setData({
						// explain: res.data.explain || "登记债券后才可以发起出售邀约哦，请先进行债权登记。"
						explain: res.data.explain || '发起' + this.keyword + '收购要约前，请先登记' + this.keyword + '。'
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

		getMyBond() {
			getMyBond().then(res => {
				this.setData({
					completed: true
				});

				if (res.code == 200) {
					this.flag = true;
					let list = [];
					res.data.forEach(e => {
						e.showMore = false;
						list.push(e);
					});
					this.setData({
						bondList: list
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

		//登记债权
		createDebt() {
			if (this.bondList.length == 0 || this.bondList[0].status == 3 || (this.bondList[0].status == 2 && globalData.owePrice == 0)) {
				uni.navigateTo({
					url: '/pages/register/create/create'
				});
			} else {
				util.alert({
					content: '您已有一笔待出让的' + this.keyword + '，出让完成后，再登记新的' + this.keyword + '吧'
				});
			}
		},

		getMember() {
			getMember({}).then(res => {
				uni.stopPullDownRefresh();

				if (res.code == 200) {
					globalData.devote = res.data.devote || 0;
					globalData.owePrice = res.data.owe_price || 0;
					globalData.anxinid = res.data.anxinid;
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

		previewImage(e) {
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: e.target.dataset.imgList
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
						that.getMyBond();
						that.getExplain();
						that.getMember();
					}
				}
			);
		}
	}
};
</script>
<style scoped lang="scss">
.debt-explain {
	padding: 0 30rpx 40rpx;
	overflow: hidden;
}

.debt-explain view {
	margin-top: 12rpx;
	margin-bottom: 30rpx;
	width: 100%;
	/* border: 1rpx solid #e4e4e4; */
	/* height: 220rpx; */
	padding: 20rpx;
	font-size: 28rpx;
	color: #333;
	border-radius: 8rpx;
}

.record-li {
	position: relative;
	width: 100%;
	padding: 20rpx 30rpx;
}

.record-li text {
	display: inline-block;
	width: 210rpx;
}

.agreement {
	display: flex;
	flex-wrap: wrap;
	padding-right: 14rpx;
	padding-bottom: 0;
}

.agreement image {
	width: 218rpx;
	height: 218rpx;
	margin-right: 16rpx;
	margin-bottom: 20rpx;
}

.status {
	position: absolute;
	top: 20rpx;
	right: 30rpx;
	font-size: 28rpx;
	color: $themeColor;
}

.more {
	text-align: center;
	padding-bottom: 28rpx;
	border-bottom: 1rpx solid #e4e4e4;
}

.more text {
	color: #999;
	font-size: 24rpx;
}

.more text::after {
	display: inline-block;
	content: '';
	width: 40rpx;
	height: 40rpx;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAGFBMVEVMaXGZmZmampqZmZmXl5efn5+ZmZmZmZlnd1grAAAAB3RSTlMAEc7ZGxjB7py9IQAAAFlJREFUeNrtzzEOACEMA0ESjvD/HyMrhWk4dxQo21maxq2q/gof+/x6nODsY3fzBM0h6dyakHRC0gkpHF6nTCdeQ8KJ1ynTydcWYZdfU9IJSScknC5fV++1AGTzAl2Ood0mAAAAAElFTkSuQmCC)
		no-repeat;
	background-size: 100% 100%;
	vertical-align: middle;
	transition: transform 0.5s;
}
.icon-up text::after {
	transform: rotateZ(180deg);
}
.more-detail {
	overflow: hidden;
	max-height: 0;
	transition: max-height 0.5s;
}

.more-detail-show {
	max-height: 1000rpx;
}
</style>
