<template>
	<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
</template>

<script>
const globalData = getApp().globalData;
import { getMember } from '../../utils/request/api';

export default {
	data() {
		return {
			isLoginShow: true,
			flag: true
		};
	},

	components: {},
	props: {},
	onLoad: function(options) {
		uni.showLoading({
			title: '加载中...'
		});
		setTimeout(() => {
			this.openMavigateModal(options);
		}, 1000);
	},
	onShow: function() {
		if (this.flag == false) {
			this.flag = true;
		}

		let _this = this;

		setTimeout(() => {
			if (this.flag) {
				if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
					_this.getMember();
				} else {
					_this.setData({
						isLoginShow: false
					});
				}
			}
		}, 1500);
	},
	methods: {
		getMember() {
			getMember({}).then(res => {
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
						uni.reLaunch({
							url: `/pages/creditorDetail/creditorDetail`
						});
					}
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
					isLoginShow: e.detail.isLoginShow
				},
				function() {
					if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
						that.getMember();
					}
				}
			);
		},

		openMavigateModal(options) {
			if (options.goods_id) {
				this.flag = false;
				uni.showModal({
					title: '即将进入商城',
					confirmColor: '#FF6634',
					confirmText: '好的',
					cancelColor: '#999999',
					showCancel: false,
					success: res => {
						if (res.confirm) {
							uni.navigateToMiniProgram({
								appId: 'wx1c16e109ac7ddad9',
								path: `pages/goods/goodsInfo/goodsInfo?goods_id=${options.goods_id}&item_id=&first_leader=${options.first_leader}`,
								extraData: {},
								envVersion: globalData.envVersion,

								success(res) {
									// 打开成功
									console.log(res);
								},

								fail: res => {
									console.log('fail', res);
									this.openMavigateModal(options);
								}
							});
						} else {
							uni.redirectTo({
								url: '/pages/creditorDetail/creditorDetail'
							});
						}
					}
				});
			}
		}
	}
};
</script>
<style>
/* pages/startMiddler/startMiddler.wxss */
</style>
