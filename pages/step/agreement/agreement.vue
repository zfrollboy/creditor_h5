<template>
	<!--pages/step/agreement/agreement.wxml-->
	<view class="page">
		<debt-step id="debtStep" currentSteps="0"></debt-step>
		<view class="section">
			<view class="section-title">{{ title }}</view>
			<view class="section-text"><rich-text :nodes="content"></rich-text></view>
		</view>
		<view class=" fixed-bottom">
			<checkbox-group @change="checkChange">
				<label class="check-agreement">
					<checkbox value="1" color="#ff6634"></checkbox>
					<text class="check-text">我是{{ keyword }}人,并同意确认《{{ title }}》</text>
				</label>
			</checkbox-group>
			<button @click="submit" class="lg-btn" :loading="submitLoading" :disabled="submitLoading || !agreeState" hover-class="btn-active">确定</button>
		</view>
		<view class="serve-alert-mask" v-if="showAlert">
			<view class="serve-alert">
				<view class="serve-alert-content">
					右来帮是专门针对{{ keyword }}人提供的一项专属服务。开通右来帮需您确认《右来帮协议》。请务必仔细阅读、充分理解协议中的条款内容。
					<text>若您不是{{ keyword }}人，请勿继续，否则我们有权收回您通过该服务所获得的收益。</text>
				</view>
				<view class="serve-alert-btn" @click="handlerConfirm">我知道了</view>
			</view>
		</view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
	</view>
</template>

<script>
import { getAgreement, agreementDo } from '../../../utils/request/api';
import { alert } from '../../../utils/util'; // pages/step/agreement/agreement.js
import debtStep from '../../../components/debtStep/debtStep';
import { authMixins } from '../../../mixins/authMixins.js';
export default {
	data() {
		return {
			keyword: uni.getStorageSync("keyword"),
			isLoginShow: true,
			agreeState: false,
			title: '',
			content: '',
			showAlert: true,
			submitLoading:false,
		};
	},
	mixins: [authMixins],
	components: {
		debtStep
	},
	onLoad: function(options) {
		if (options.code) {
			this.accountAuth(options.code, () => {
				this.getAgreement();
			},err=>{
				this.isLoginShow=false
			});
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getAgreement();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}

		this.setData({
			keyword: uni.getStorageSync("keyword")
		});
	},

	methods: {
		checkChange(e) {
			this.setData({
				agreeState: e.detail.value.length > 0
			});
		},

		getAgreement() {
			getAgreement().then(res => {
				if (res.code == 200) {
					this.setData({
						title: res.data.agree_title,
						content: res.data.agree_content
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

		handlerConfirm() {
			this.setData({
				showAlert: false
			});
		},

		submit() {
			this.submitLoading=true
			let { agreeState } = this;

			if (!agreeState) {
				uni.showToast({
					title: '请先服务同意协议',
					icon: 'none',
					duration: 2000
				});
				return;
			}

			agreementDo().then(res => {
				this.submitLoading=false;
				if (res.code == 200) {
					uni.showModal({
						title: '确认协议完成啦！',
						content: '为了核验' + this.keyword + '人信息真实性，保障' + this.keyword + '人的权益，需请您进行实人认证！',
						confirmText: '好的',
						cancelText: '取消',
						confirmColor: '#FF6634',
						cancelColor: '#999999',
						success: res => {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/step/idAuth/idAuth'
								});
							}
						}
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
						that.getAgreement();
					}
				}
			);
		}
	}
};
</script>
<style>
.fixed-bottom {
	position: fixed;
	background-color: #fff;
}
.page {
	padding-bottom: 170rpx;
}
</style>
