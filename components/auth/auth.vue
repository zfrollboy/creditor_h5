<template>
	<view class="shadow" @touchmove.stop="ture" v-if="!isLoginShow">
		<view class="loginCon">
			<image src="/static/phoneImg.png"></image>
			<view class="desc1">需要您的同意</view>
			<view class="desc2">为了完整体验，需要您的授权</view>
			<view class="desc2 desc3">（授权仅用于用户昵称与头像）</view>
			<view class="btnCon">
				<button class="login" @click="nogetUserInfo">暂不授权</button>
				<!-- #ifdef MP-WEIXIN -->
				<button class="login" open-type="getUserInfo" :loading="loading" @getuserinfo="bindGetUserInfo">确认授权</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="login" @click="accountAuth">确认授权</button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import {accountAuth} from "../../utils/request/api.js"
export default {
	props: {
		isLoginShow: { type: Boolean, default: false }
	},
	data() {
		return {
			modalHidden: true,
			canIUse: uni.canIUse('button.open-type.getUserInfo'),
			loading: false
		};
	},
	methods: {
		// #ifdef MP-WEIXIN
		bindGetUserInfo: function(e) {
			// 授权点击
			let that = this;
			if (e.detail.userInfo == undefined) {
			} else {
				that.loading = true;
				uni.setStorageSync('userInfo', e.detail.userInfo); //存储用户名
				// 登录
				uni.login({
					success: res => {
						if (res.code) {
							//通过code  获取 openid 和 uid
							uni.request({
								url: app.globalData.baseApiUser + '/api/auth',
								data: {
									code: res.code,
									nick_name: e.detail.userInfo.nickName,
									avatar: e.detail.userInfo.avatarUrl,
									encryptedData: e.detail.encryptedData,
									iv: e.detail.iv,
									gender: e.detail.userInfo.gender
								},
								method: 'POST',
								success: function(response) {
									that.loading = false;
									if (response.statusCode == 200) {
										if (response.data.data.uid != 0) {
											//uid不为0 已注册
											uni.setStorageSync('uid', response.data.data.uid);
											that.$emit('myevent', { isLoginShow: true, islogin: true, userInfo: e.detail.userInfo }); //子传父手机号
										} else {
											//uid为0 未注册
											that.$emit('myevent', { isLoginShow: true, islogin: false, userInfo: e.detail.userInfo });
										}
										uni.setStorageSync('openid', response.data.data.openid);
										uni.setStorageSync('session_key', response.data.data.session_key);
										uni.setStorageSync('token', response.data.data.token);
										that.hasUserInfo = true; //隐藏 登陆框
									} else {
										uni.showToast({
											title: '请求失败',
											icon: 'loading',
											duration: 1000
										});
									}
								}
							});
						} else {
							that.loading = false;
							console.log('获取用户登录态失败！' + res.errMsg);
						}
					}
				});
			}
		},
		// #endif
		// #ifdef H5
		accountAuth(){
			let tempArr=location.search.slice(1).split("&")
			let data={}
			for (var i = 0; i < tempArr.length; i++) {
				let temp=tempArr[i].split("=")
				data[temp[0]]=temp[1]||""
			}
			let params=""
			//再次授权时祛除code和state，避免重复
			for (let key in data) {
				if(key=="code"||key=="state"){
					continue
				}
				params+=`${key}=${data[key]}&`
			}
			let redirectUrl=encodeURIComponent(location.origin+"?"+params.slice(0,params.length-1))
			location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx292c5da4da7c64a9&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
		},
		// #endif
		//暂不登录
		nogetUserInfo: function() {
			this.$emit('myevent', { isLoginShow: true });
		}
	}
};
</script>

<style scoped>
.showLoading {
	text-align: center;
	font-size: 30rpx;
	color: rgba(153, 153, 153, 1);
	padding: 0rpx 0 40rpx;
}

.shadow {
	background: rgba(0, 0, 0, 0.4);
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
}

.loginCon {
	width: 70%;
	position: fixed;
	left: 0;
	top: 0;
	background: #fff;
	z-index: 9999;
	padding-bottom: 44rpx;
	right: 0;
	margin: auto;
	border-radius: 20rpx;
	bottom: 0;
	height: 502rpx;
}

.loginCon image {
	width: 100%;
	height: 190rpx;
}

.loginCon .desc1 {
	text-align: center;
	height: 64rpx;
	font-size: 32rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	padding: 16rpx 32rpx;
	color: rgba(51, 51, 51, 1);
	line-height: 32rpx;
}

.loginCon .desc2 {
	text-align: center;
	width: 77%;
	margin: 0 auto;
	display: block;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	line-height: 40rpx;
}

.loginCon .desc3 {
	padding-bottom: 60rpx;
}

.btnCon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.btnCon button {
	width: 200rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	margin-left: 20rpx;
	margin-right: 20rpx;
	z-index: 9999;
}

.nologin {
	padding: 0;
	border-color: rgba(204, 204, 204, 1);
}

.nologin {
	background: #fff;
	color: rgba(51, 51, 51, 1);
}

.login {
	background: linear-gradient(270deg, rgba(243, 75, 49, 1) 0%, rgba(251, 148, 64, 1) 100%);
	border-radius: 8rpx;
	border: none;
	color: #ffffff;
	padding: 0;
}

.login::after {
	border: none;
}

.btnCon button:nth-child(1) {
	border: 1rpx solid #ccc;
	background: transparent;
	color: #333333;
}
</style>
