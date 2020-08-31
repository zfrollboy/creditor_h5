<template>
	<view class="page">
		<block v-for="(item, index) in transferList" :key="index">
			<view class="record-li">
				<view class="li-i">
					<text>出让金额</text>
					<text>￥{{ item.price || 0 }}</text>
				</view>
				<view class="li-i">
					<text>投资公司名称</text>
					<text>{{ item.organ_name || '' }}</text>
				</view>
				<view class="li-i">
					<text>原合同同编号</text>
					<text>{{ item.register_contruct_no || '' }}</text>
				</view>
				<view class="li-i">
					<text>申请时间</text>
					<text>{{ item.created_at || '' }}</text>
				</view>
				<!-- <wxs module="filterTools" src="../../filterTools.wxs" /> -->
				<view class="record-status">{{ item.statusVal }}</view>
				<view class="record-agreement" :data-url="item.pdf" @click="getAgreement" v-if="item.status == 3">合同已解除</view>
				<view class="record-agreement" :data-url="item.pdf" :data-id="item.id" @click="getAgreement" v-else="item.status == 2">查看合同</view>
			</view>
			<view class="gray-margin-b"></view>
		</block>
		<view class="empty" v-if="completed && transferList == 0"></view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
	</view>
</template>

<script>
import { getMyTransfer, preAgreement } from '../../../utils/request/api'; // pages/register/create/create.js
import { authMixins } from '../../../mixins/authMixins.js';
export default {
	data() {
		return {
			isLoginShow: true,
			transferList: [],
			completed: false
		};
	},
	mixins: [authMixins],
	onLoad: function(options) {
		if (options.code) {
			this.accountAuth(
				options.code,
				() => {
					this.getTransfer();
				},
				err => {
					this.isLoginShow = false;
				}
			);
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getTransfer();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}

		uni.setNavigationBarTitle({
			title: `${uni.getStorageSync('keyword')}出让记录`
		});
	},
	methods: {
		getTransfer() {
			getMyTransfer().then(res => {
				this.setData({
					completed: true
				});

				if (res.code == 200) {
					this.setData({
						transferList: res.data
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
		getAgreement(e) {
			let id = e.target.dataset.id,
				url = e.target.dataset.url;
			// #ifdef MP-WEIXIN
			this.openAgreement(url);
			// #endif
			// #ifdef H5
			this.openAgreementH5(url);
			// #endif
		},
		openAgreementH5(url) {
			let u = navigator.userAgent;
			let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);  //ios终端
			//ios直接打开pdf，andriod用pdf.js打开
			if (isiOS) {
				location.href = url;
			} else {
				uni.navigateTo({
					url: '/pages/pdfView/pdfView?url=' + url
				});
			}
		},
		openAgreement(url) {
			uni.showLoading({
				title: '合同下载中...',
				mask: true
			});
			uni.downloadFile({
				url: url,
				success: res => {
					uni.hideLoading();
					let data = res.tempFilePath;
					uni.openDocument({
						filePath: data,
						fileType: 'pdf'
					});
				},
				fail: err => {
					uni.hideLoading();
					uni.showToast({
						title: '合同下载失败',
						icon: 'none'
					});
					console.log(err);
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
						that.getTransfer();
					}
				}
			);
		}
	}
};
</script>
<style scoped lang="scss">
/* pages/register/record/record.wxss */
.record-li {
	width: 100%;
	background-color: #fff;
	padding: 20rpx 30rpx;
	position: relative;
}

.record-status {
	position: absolute;
	top: 20rpx;
	right: 30rpx;
	font-size: 28rpx;
	color: $themeColor;
}
.record-agreement {
	margin: 30rpx auto 0;
	width: 168rpx;
	line-height: 56rpx;
	text-align: center;
	border-radius: 28rpx;
	border: 2rpx solid #999;
	font-size: 28rpx;
	color: #333;
}
</style>
