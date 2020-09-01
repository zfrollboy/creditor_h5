<template>
	<!--pages/step/idAuth/idAuth.wxml-->
	<view class="page">
		<debt-step id="debtStep" currentSteps="1"></debt-step>
		<view class="section-title">身份认证</view>
		<view class="form-group">
			<view class="label">真实姓名</view>
			<input placeholder-class="input-pls" type="text" placeholder="请输入您的真实姓名" @input="bindinput" data-name="realName" name="realName" :value="realName" />
		</view>
		<view class="form-group">
			<view class="label">身份证号</view>
			<input placeholder-class="input-pls" type="idcard" placeholder="请输入您的身份证号码" @input="bindinput" data-name="idNum" name="idNum" :value="idNum" />
		</view>
		<!-- <view class="section-title">上传身份证照片</view>
  <view class="upload-id">
    <image class="upload-front" src="{{frontSrc||'/static/upload_idcard_1.png'}}" bindtap="frontImage"/>
    <image class="upload-back" src="{{backSrc||'/static/upload_idcard_2.png'}}" bindtap="backImage"/>
  </view> -->
		<view class=" fixed-bottom">
			<checkbox-group @change="checkChange">
				<!-- <label class="check-agreement">
				<checkbox value="1" color="#ff6634"/>
				<text class="check-text">我是债权人,并同意确认《XX协议》</text>
			</label> -->
			</checkbox-group>
			<button @click="submit" class="lg-btn" :loading="submitLoading" :disabled="submitLoading" hover-class="btn-active">确定</button>
		</view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
	</view>
</template>

<script>
import { getBizToken, authUpdate, h5Auth, checkH5Auth } from '../../../utils/request/api'; // pages/step/idAuth/idAuth.js
import debtStep from '../../../components/debtStep/debtStep';
import { authMixins } from '../../../mixins/authMixins.js';
export default {
	data() {
		return {
			isLoginShow: true,
			realName: '',
			idNum: '',
			hidden: true,
			//true
			buthidden: false,
			//false
			sourceType: ['album', 'camera'],
			frontSrc: '',
			backSrc: '',
			agreeState: false,
			keyword: '',
			submitLoading: false
		};
	},
	mixins: [authMixins],
	components: {
		debtStep
	},

	onLoad: function(options) {
		if (options.code) {
			this.accountAuth(options.code, () => {
				if (options.BizToken) {
					this.checkH5Auth(options.BizToken);
				}
			},err=>{
				this.isLoginShow=false
			});
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				if (options.BizToken) {
					this.checkH5Auth(options.BizToken);
				}
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}

		this.setData({
			keyword: uni.getStorageSync("keyword")
		});
		uni.setNavigationBarTitle({
			title: `${getApp().globalData.keyword}人服务协议`
		});
	},
	methods: {
		checkChange(e) {
			let val = e.detail.value.length > 0;
			this.setData({
				agreeState: val
			});
		},
		checkH5Auth(bizToken) {
			checkH5Auth({
				bizToken: bizToken
			}).then(res => {
				if (res.code == 200) {
					this.authUpdate();
				} else if (res.code == 99) {
					this.isLoginShow = false;
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
		checkInput() {
			let idReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
			let nameReg = /^[\u4e00-\u9fa5A-Za-z]+$/;

			if (!idReg.test(this.idNum)) {
				uni.showToast({
					title: '请输入有效的身份证号',
					icon: 'none'
				});
				return false;
			} else if (this.realName == '' || this.realName == null) {
				uni.showToast({
					title: '请输入姓名',
					icon: 'none'
				});
				return false;
			}

			return true;
		},

		submit() {
			this.submitLoading = true;
			if (!this.checkInput()) {
				this.submitLoading = false;
				return;
			}
			this.h5Auth();
		},
		h5Auth() {
			h5Auth({
				IdCard: this.idNum,
				Name: this.realName,
				RedirectUrl: location.origin + '/pages/step/idAuth/idAuth'
			}).then(res => {
				this.submitLoading = false;
				if (res.code == 200) {
					location.href = res.data.Url;
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
		authUpdate() {
			authUpdate({
				idCard: this.idNum,
				name: this.realName
			}).then(res => {
				if (res.code == 200) {
					uni.redirectTo({
						// url: '/pages/authSuccess/authSuccess',
						url: '/pages/step/mall/mall'
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
			let name = e.target.dataset.name,
				value = e.detail.value;
			this[name] = value;
		},

		getBizToken() {
			return new Promise((resolve, rejects) => {
				getBizToken({
					idCard: this.idNum,
					name: this.realName
				}).then(res => {
					if (res.code == 200) {
						resolve(res.data.Response.BizToken);
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
			});
		},

		startInteractiveVideo(BizToken) {
			uni.startInteractiveVideo({
				data: {
					BizToken: BizToken // BizToken
				},
				success: res => {
					// 验证成功后触发
					// res 包含验证成功的token, 这里需要加500ms延时，防止iOS下不执行后面的逻辑
					setTimeout(() => {
						// 验证成功后，拿到token后的逻辑处理，具体以客户自身逻辑为准
						console.log(res);
						this.authUpdate();
					}, 500);
				},
				fail: err => {
					// 验证失败时触发
					// err 包含错误码，错误信息，弹窗提示错误
					setTimeout(() => {
						uni.showModal({
							title: '提示',
							content: err.ErrorMsg,
							showCancel: false,
							success: () => {
								uni.redirectTo({
									url: '/pages/step/idAuth/idAuth'
								});
							}
						});
					}, 500);
				}
			});
		},

		frontImage() {
			var _this = this;

			var Type = _this.sourceType;
			uni.chooseImage({
				count: 1,
				// 默认9
				sizeType: ['original', 'compressed'],
				// 可以指定是原图还是压缩图，默认二者都有
				sourceType: Type,
				// 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					_this.setData({
						frontSrc: res.tempFilePaths
					});
				}
			});
		},

		backImage() {
			var _this = this;

			var Type = _this.sourceType;
			uni.chooseImage({
				count: 1,
				// 默认9
				sizeType: ['original', 'compressed'],
				// 可以指定是原图还是压缩图，默认二者都有
				sourceType: Type,
				// 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					_this.setData({
						backSrc: res.tempFilePaths
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
					}
				}
			);
		}
	}
};
</script>
<style>
.form-group input {
	text-align: left;
}
.upload-id {
	padding: 0 28rpx;
	display: flex;
	justify-content: space-between;
	margin-top: 10rpx;
}
.upload-id image {
	width: 340rpx;
	height: 212rpx;
}
</style>
