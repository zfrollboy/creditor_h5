<template>
	<view class="page">
		<view class="section" v-if="memberCompleted || !isLogin">
			<rich-text :nodes="explainTop"></rich-text>
			<rich-text :nodes="explainBottom"></rich-text>
		</view>
		<view class="form-mask" v-if="showForm" @click="closeAlert">
			<view class="form-content" @click.stop="handlerCatch">
				<view class="form-title">您持有何种{{ keyword }}呢?</view>
				<view class="form-group">
					<view class="label">{{ keyword }}类型</view>
					<picker @change="PickerChange" data-key="type" :value="typeIndex" :range="type" range-key="name">
						<view class="picker hideArrow">{{ typeIndex != null ? type[typeIndex].name : '' }}</view>
					</picker>
				</view>
				<view class="tips">共享服务平台{{ keyword }}服务正在开发中...</view>
				<view class="form-group">
					<view class="label">{{ keyword }}所属机构</view>
					<picker @change="PickerChange" data-key="org" :value="orgIndex" :range="org" range-key="name">
						<view class="picker">{{ orgIndex||orgIndex===0 ? org[orgIndex].name : '' }}</view>
					</picker>
				</view>
				<view class="form-group" v-if="showCompanyIpt">
					<view class="label">机构名称</view>
					<input placeholder-class="input-pls" type="text" @input="companyNameIpt" placeholder="请输入机构名称" name="companyName" :value="companyName" />
				</view>
				<button class="md-btn" @click.stop="submit" :loading="submitLoading" :disabled="submitLoading" hover-class="btn-active">下一步</button>
			</view>
		</view>
		<view class="fixed-bottom" v-if="memberCompleted && !hasReg"><button @click="openAlert" class="lg-btn" hover-class="btn-active">开通右来帮</button></view>

		<view class="fixed-bottom" v-if="!isLogin"><button @click="showLoginModal" class="lg-btn" hover-class="btn-active">授权登录</button></view>

		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" :mobile="mobile"></auth-login>
		<cu-service></cu-service>
	</view>
</template>

<script>
import { getIndex, serviceStart, getAgreement, getMember, getExplain } from '../../utils/request/api';
import utils from '../../utils/util';
const app = getApp();
import { authMixins } from '../../mixins/authMixins.js';
export default {
	data() {
		return {
			keyword: uni.getStorageSync("keyword"),
			typeIndex: 0,
			orgIndex: null,
			type: [],
			org: [],
			form: {
				type: null,
				org: null
			},
			submitLoading: false,
			isLoginShow: true,
			hasReg: true,
			showForm: false,
			explainTop: '',
			explainBottom: '',
			showCompanyIpt: false,
			companyName: '',
			memberCompleted: false,
			isLogin: ''
		};
	},
	mixins: [authMixins],
	onLoad(e) {
		if (e.code) {
			this.accountAuth(e.code, () => {
				this.getExplain(e.hasReg);
				this.getIndexData();
				this.getAgreement();
			},(err)=>{
				this.getAgreement();
				this.isLoginShow=false
			});
		} else {
			this.getAgreement();
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getExplain(e.hasReg);
				this.getIndexData();
			} else {
				this.getAgreement();
			} //从服务中心过来不显示button
		}
		if (e.hasReg == 1) {
			this.setData({
				hasReg: true
			});
		} else {
			this.setData({
				hasReg: false
			});
		}
	},

	methods: {
		PickerChange(e) {
			let key = e.currentTarget.dataset.key;
			this.setData({
				[`${key}Index`]: e.detail.value
			});

			if (key == 'org') {
				//选择了最后一项其他,提示用户输入投资机构名称
				if (e.detail.value == this.org.length - 1) {
					this.setData({
						showCompanyIpt: true
					});
				} else {
					this.setData({
						showCompanyIpt: false
					});
				}
			}
		},

		getAgreement() {
			getAgreement().then(res => {
				if (res.code == 200) {
					this.setData({
						explainTop: res.data.service_explain.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"'),
						explainBottom: res.data.service_explain_t.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"')
					});

					if (res.data.is_login == 0) {
						if (!uni.getStorageSync('uid') || !uni.getStorageSync('token')) {
							this.setData({
								isLoginShow: false,
							});
						}else{
							this.isLogin=true
						}
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

		companyNameIpt(e) {
			this.setData({
				companyName: e.detail.value
			});
		},

		openAlert() {
			this.setData({
				showForm: true
			});
		},

		submit() {
			let { orgIndex, typeIndex, submitLoading } = this;

			if (!typeIndex && typeIndex != 0) {
				uni.showToast({
					title: '请选择' + this.keyword + '类型',
					icon: 'none',
					duration: 2000
				});
				return;
			}

			if (!orgIndex && orgIndex != 0) {
				uni.showToast({
					title: '请选择' + this.keyword + '所属机构',
					icon: 'none',
					duration: 2000
				});
				return;
			}

			this.setData({
				submitLoading: true
			});
			let bond_type = this.type[typeIndex].id;
			let bond_organ = this.org[orgIndex].id;
			let data = {};
			data['bond_type'] = bond_type;
			data['bond_organ'] = bond_organ;

			if (bond_organ == 1000) {
				data['organ_name'] = this.companyName;
			}

			serviceStart(data).then(res => {
				this.setData({
					submitLoading: false
				});

				if (res.code == 200) {
					this.setData({
						showForm: false
					});
					uni.redirectTo({
						url: '/pages/step/agreement/agreement'
					});
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

		closeAlert() {
			this.setData({
				showForm: false
			});
		},

		getExplain(hasReg) {
			getExplain()
				.then(res => {
					if (res.code == 200) {
						uni.setStorageSync("keyword",res.data.examine || '');
						this.keyword = res.data.examine || '';
					}

					this.getMember(hasReg);
				})
				.catch(() => {
					this.getMember(hasReg);
				});
		},

		getMember(hasReg) {
			getMember({})
				.then(res => {
					uni.stopPullDownRefresh();

					if (res.code == 200) {
						//债权中心过来不判断状态，留在此页
						if (hasReg == 1 || res.data.service_status == 0) {
							this.setData({
								memberCompleted: true
							});
						} else if (res.data.agree_status == 0) {
							uni.redirectTo({
								url: '/pages/step/agreement/agreement'
							});
						} else if (res.data.auth_status == 0) {
							uni.redirectTo({
								url: '/pages/step/idAuth/idAuth'
							});
						} else if (res.data.invite_status == 0) {
							uni.redirectTo({
								url: '/pages/step/mall/mall'
							});
						} else {
							uni.redirectTo({
								url: '/pages/creditorDetail/creditorDetail'
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
						this.setData({
							memberCompleted: true
						});
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					this.setData({
						memberCompleted: true
					});
				});
		},

		//获取授权后返回的信息
		onMyEvent: function(e) {
			var that = this;
			that.setData(
				{
					isLoginShow: e.isLoginShow,
					isLogin: e.isLoginShow
				},
				function() {
					if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
						that.setData({
							isLogin: true
						});
						that.getExplain();
						that.getIndexData();
						that.getAgreement();
					} else {
						that.setData({
							isLogin: false
						});
					}
				}
			);
		},

		getIndexData() {
			getIndex().then(res => {
				let org = res.data.organ;
				org.push({
					name: '其他',
					id: 1000
				});
				this.setData({
					org,
					type: res.data.type
				});
			});
		},

		handlerCatch() {
			return;
		},

		showLoginModal() {
			this.isLoginShow = false;
		}
	}
};
</script>
<style>
.form-mask {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 99;
}
.form-content {
	width: 640rpx;
	background-color: #fff;
	padding: 60rpx 0;
	border-radius: 20rpx;
}
.form-title {
	font-size: 32rpx;
	text-align: center;
	margin-bottom: 40rpx;
}
.md-btn {
	margin-top: 100rpx;
}
.fixed-bottom {
	position: fixed;
	/* position: unset;
  margin-top: 170rpx; */
}
.tips {
	padding: 10rpx 30rpx 0;
	font-size: 28rpx;
	color: #999;
	text-align: right;
}
.form-group .hideArrow::after {
	background-image: none;
}
</style>
