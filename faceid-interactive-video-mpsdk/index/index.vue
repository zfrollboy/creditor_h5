<template>
	<view>
		<view id="fix-full-page">
			<!-- index -->
			<block data-type="template" data-is="Index" data-attr="...cmsConfig,index_rule,show_about_dlg,indexChecked,indexDisableBtn" v-if="curPage === 1">
				<view>
					<view id="index-top">
						<view id="index-top-title" class="index-title">{{ cmsConfig.Index.ProtocolTitle }}</view>
						<view class="index-title">{{ cmsConfig.Index.businessName }}</view>
						<view class="index-hint" style="margin-top:13rpx">{{ cmsConfig.Index.Detail }}</view>
					</view>
					<view class="index-protocol">
						<checkbox-group @change="checkboxChange" style="display:inline-flex;align-items:center;margin-right:5px;font-size:14px;">
							<label class="index-protocol-left">
								<checkbox :checked="indexChecked"></checkbox>
								同意授权，查看
							</label>
						</checkbox-group>
						<label id="index-protocol-right" @click="switchIndexRule">{{ cmsConfig.Index.DetailTitle }}</label>
					</view>
					<view class="index-btn">
						<button @click="indexToNext" :disabled="indexDisableBtn" hover-class="btn-hover">{{ cmsConfig.Index.NextBtn }}</button>
					</view>
				</view>
			</block>

			<view v-if="curPage !== 1">
				<!-- fail page -->
				<block data-type="template" data-is="FailPage" data-attr="failInfo, BizToken, aaa" v-if="curPage === 3">
					<view class="trtcFailTop"><icon class="icon-box-img" type="warn" size="100"></icon></view>
					<view class="trtcFailWarn"><view>审核不通过</view></view>
					<view class="trtcFailWarnDetail">
						<view>{{ failInfo.ErrorMsg }}</view>
					</view>
					<view class="trtcFailWarnToken" v-if="BizToken">
						<view>({{ BizToken }})</view>
					</view>
					<view class="fail-btn"><button @click="backToIndex" hover-class="btn-hover">退出</button></view>
				</block>
				<!-- success page -->
				<block data-type="template" data-is="SuccessPage" data-attr="failInfo" v-if="curPage === 2">
					<view class="trtcResultTop"><icon type="success" size="100"></icon></view>
					<view class="trtcResultSuccess">
						<view>{{ failInfo.ErrorMsg }}</view>
					</view>
					<view class="index-btn"><button @click="successGoToNext" hover-class="btn-hover">下一步</button></view>
				</block>
			</view>
		</view>

		<block data-type="template" data-is="auth_template" data-attr="...cmsConfig,authInfo" v-if="show_auth_panel">
			<view class="auth-bg"></view>
			<view class="auth-main">
				<view class="auth-info">{{ authInfo }}</view>
				<button open-type="openSetting" class="auth-btn-set">
					<image src="http://beta.gtimg.com/GodIdent/huiyan/img/icon42_appwx_logo.png"></image>
					打开授权设置
				</button>
			</view>
		</block>
	</view>
</template>

<script>
import compareVersion from '../components/trtc-room/utils/compare-version';
const regeneratorRuntime = require('../utils/regenerator-runtime/runtime'),
	util = require('../utils/util');
var BASE_URL = '',
	tokenExceptionArr = [14, 15];

export default {
	data() {
		return {
			curPage: 1,
			cmsConfig: {},
			skipConfig: {},
			bizData: {},
			trtcData: {},
			BizToken: '',
			preClickBtnTime: 0,
			isNotCamera: !0,
			iKnowFuncs: [],
			index_rule: !1,
			show_about_dlg: !1,
			indexChecked: !0,
			indexDisableBtn: !1,
			show_auth_panel: !1,
			authInfo: '',
			isInfinityDisplay: !1,
			failPage: {},
			successPage: {},
			failInfo: {},
			showErrorMsg: '',
			err: ''
		};
	},

	components: {},
	props: {},
	onLoad: function(o) {
		const e = this;
		if ('1' === o.curPage)
			this.setData({
				cmsConfig: wx.IVdefaultConfig,
				trtcData: o,
				curPage: 1,
				BizToken: o.BizToken || ''
			}),
				(BASE_URL = wx.IVBaseUrl),
				wx.setNavigationBarTitle({
					title: this.cmsConfig.Common.Title,
					success: function() {
						console.log('setNavigationBarTitle success!');
					},
					fail: function(o) {
						console.log('setNavigationBarTitle failure!');
					}
				}),
				wx.getSystemInfo({
					success: o => {
						const t = o.system.includes('iOS') ? 'ios' : 'android',
							n = o.SDKVersion,
							i = o.version;
						if (compareVersion(n, '2.10.0') < 0 || ('ios' === t && compareVersion(i, '7.0.9') < 0) || ('android' === t && compareVersion(i, '7.0.8') < 0))
							return wx.showModal({
								title: '提示',
								content: wx.sysFailInfo.SDK_NOT_SUPPORT[1],
								showCancel: !1,
								complete: function() {
									wx.IVFailureFunc({
										BizToken: e.BizToken,
										ErrorCode: wx.sysFailInfo.SDK_NOT_SUPPORT[0],
										ErrorMsg: wx.sysFailInfo.SDK_NOT_SUPPORT[1]
									});
								}
							});
					}
				});
		else if ('2' === o.curPage) {
			const e = wx.sysFailInfo[o.code];
			e &&
				this.setData({
					BizToken: o.BizToken,
					curPage: 2,
					failInfo: {
						ErrorCode: e[0],
						ErrorMsg: e[1]
					}
				});
		} else {
			const e = wx.sysFailInfo[o.code];
			e
				? this.setData({
						BizToken: o.BizToken,
						curPage: 3,
						failInfo: {
							ErrorCode: e[0],
							ErrorMsg: e[1]
						}
				  })
				: this.setData({
						curPage: 3
				  });
		}
	},
	onReady: function() {},
	onShow: function() {
		this.show_auth_panel &&
			setTimeout(() => {
				this.isAuthOk();
			}, 500);
	},
	onHide: function() {},
	onUnload: function() {},
	onPullDownRefresh: function() {},
	onReachBottom: function() {},
	onShareAppMessage: function() {},
	methods: {
		showErrorToast: function(o) {
			this.setData({
				showErrorMsg: !0,
				err: o
			});
		},
		switchDialog: function() {
			if (
				(this.setData({
					showErrorMsg: !this.showErrorMsg
				}),
				1 === this.iKnowFuncs.length)
			) {
				this.iKnowFuncs.pop()();
			}
		},
		checkNetWork: function(o) {
			var e = this;
			wx.getNetworkType({
				success: function(t) {
					'none' !== t.networkType
						? o()
						: (console.log('Network is none'),
						  e.showErrorToast({
								ErrorCode: 101,
								ErrorMsg: '网络异常，请稍后重试'
						  }));
				},
				fail: function() {
					console.log('Get Network exception'),
						e.showErrorToast({
							ErrorCode: 101,
							ErrorMsg: '网络异常，请稍后重试'
						});
				}
			});
		},
		checkRecordNetworkOk: function(o, e) {
			wx.getNetworkType({
				success: function(t) {
					'none' !== t.networkType
						? (console.log('network is OK'), o(t.networkType))
						: (console.log('Network is none'),
						  e({
								ErrorCode: 101,
								ErrorMsg: '网络异常，请稍后再试'
						  }));
				},
				fail: function() {
					console.log('Get Network exception'),
						e({
							ErrorCode: 101,
							ErrorMsg: '网络异常，请稍后再试'
						});
				}
			});
		},

		returnAllCheckNetWork(o) {
			wx.getNetworkType({
				success: function(e) {
					o(e.networkType);
				},
				fail: function(e) {
					o('none');
				}
			});
		},

		isNotAllowClick: function() {
			var o = +new Date();
			return o - this.preClickBtnTime < 1e3
				? (console.log('Click button gap < 1s, not allow exec'), !0)
				: ((this.preClickBtnTime = o), console.log('Click button gap > 1s, allow exec'), !1);
		},

		exitIV(o) {
			wx.IVSuccessFunc(o);
		},

		exitIVFail(o) {
			(o.BizToken = this.BizToken), wx.IVFailureFunc(o);
		},

		switchIndexRule: function() {
			this.setData({
				index_rule: !this.index_rule
			}),
				this.index_rule &&
					wx.showModal({
						title: this.cmsConfig.Index.DetailTitle,
						content: this.cmsConfig.Index.ProtocolContent,
						showCancel: !1,
						complete: () =>
							this.setData({
								index_rule: !1
							})
					});
		},
		switchAboutDlg: function() {
			this.setData({
				show_about_dlg: !this.show_about_dlg
			});
		},

		checkboxChange(o) {
			this.setData({
				indexDisableBtn: !this.indexDisableBtn
			});
		},

		indexToNext: async function() {
			if (!this.isNotAllowClick()) {
				var o = this;
				this.checkNetWork(function() {
					o.getAuth();
				});
			}
		},
		getAuth: function() {
			const o = this;
			wx.authorize({
				scope: 'scope.camera',

				success() {},

				fail: function() {
					console.log('您未允许使用摄像头权限');
				},
				complete: function() {
					1 === o.curPage
						? wx.authorize({
								scope: 'scope.record',

								success() {},

								fail: function() {
									console.log('您未允许使用录音权限');
								},
								complete: function() {
									console.log('开始判断是否有权限'), o.isAuthOk();
								}
						  })
						: o.isAuthOk();
				}
			});
		},
		isAuthOk: function() {
			var o = this;
			wx.getSetting({
				success(e) {
					console.log('获取授权信息成功');
					var t = e.authSetting['scope.record'],
						n = e.authSetting['scope.camera'];
					if (t && n)
						o.setData({
							show_auth_panel: !1,
							authInfo: '摄像头、录音功能都已授权'
						}),
							o.authOkToDo(),
							console.log('摄像头、录音功能都已授权');
					else {
						var i = '';
						n || (i = '摄像头 '),
							t || (i += '录音功能'),
							(i += '还未授权'),
							console.log(i),
							o.setData({
								show_auth_panel: !0,
								authInfo: i
							});
					}
				},

				fail: function(o) {
					console.log('获取收取信息失败', o);
				}
			});
		},

		authOkToDo() {
			const o = `/faceid-interactive-video-mpsdk/room/room?BizToken=${this.trtcData.BizToken}&debugMode=false&cloudenv=PRO`;
			wx.navigateTo({
				url: o
			});
		},

		successGoToNext() {
			this.exitIV({
				BizToken: this.BizToken,
				ErrorCode: wx.sysFailInfo.SUCCESS[0],
				ErrorMsg: wx.sysFailInfo.SUCCESS[1]
			});
		},

		backToIndex() {
			this.failInfo.ErrorCode
				? this.exitIVFail({
						BizToken: this.BizToken,
						ErrorCode: this.failInfo.ErrorCode,
						ErrorMsg: this.failInfo.ErrorMsg
				  })
				: this.exitIVFail({
						BizToken: this.BizToken,
						ErrorCode: -999,
						ErrorMsg: '返回首页成功，如多次验证不通过，可将当前页面截图提供给相关工作人员排查问题 ' + this.BizToken
				  });
		}
	}
};
</script>
<style>
#fix-full-page {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
}

#fix-full-page button[disabled] {
	background: #b3b3b3;
	color: rgba(255, 255, 255, 0.6);
}

#index-top {
	text-align: center;
	color: black;
}

.color-grey {
	color: #a3a3a3 !important;
}
.color-black {
	color: #000 !important;
}

.index-hint {
	font-size: 35rpx;
	padding: 0 5vw;
	text-align: left;
	text-indent: 72rpx;
	line-height: 60rpx;
}

.index-title {
	font-size: 36rpx;
}

#index-top-title {
	font-size: 35rpx;
	padding-top: 120rpx;
	padding: 10vh 5vw 0 5vw;
	text-align: left;
}

.weui-dialog.protocol .weui-dialog__bd {
	text-align: left;
	max-height: 300px;
	overflow-y: auto;
}

.index-protocol {
	display: inline-flex;
	align-items: center;
	/* height:20px; */
	font-size: 14px;
	text-align: left;
	margin: 2vh 5vw;
}

.index-protocol-left {
	display: inline-flex;
}

.index-protocol checkbox {
	zoom: 0.6;
	width: 35px;
	/* height:20px; */
	margin-top: 2px;
}

#index-protocol-right {
	color: #007aff;
}

.interactive-video-footer {
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 30rpx 0;
	text-align: center;
}
.interactive-video-footer-logo {
	height: 16px;
}
.interactive-video-footer-logo image {
	width: 88px;
	height: 17px;
}

/* btn hover class, must add !important in mp */
.btn-hover {
	/* background: rgba(45,114,241) !important; */
	background: rgb(11, 89, 235) !important;
}
.trtcFailTop {
	width: 100%;
	margin-top: 10vh;
	margin-bottom: 5vh;
	text-align: center;
}
.icon-box-img {
	margin: 0 auto;
	text-align: center;
}
.fail-btn {
	position: absolute;
	bottom: 30vh;
	width: 82vw;
	left: 9vw;
}
.fail-btn button {
	color: white;
	background-color: #2d72f1;
	border-radius: 0;
	font-size: 32rpx;
	padding: 15rpx 20rpx !important;
	box-sizing: border-box;
}
.trtcFailWarn {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	text-align: center;
	font-weight: 400;
	font-size: 50rpx;
	margin-bottom: 3vh;
}
.trtcFailWarnDetail {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	text-align: center;
	font-weight: 400;
	font-size: 35rpx;
	color: #888888;
}
.trtcFailWarnToken {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	text-align: center;
	font-weight: 400;
	font-size: 25rpx;
	color: #888888;
}

.trtcResultTop {
	width: 100%;
	margin-top: 10vh;
	margin-bottom: 5vh;
	text-align: center;
}

.trtcResultHint {
	text-align: center;
	font-size: 14px;
	color: #999999;
	padding: 0 20px;
}
.trtcResultSuccess {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 20px;
	text-align: center;
	font-weight: 400;
	font-size: 50rpx;
}
.index-btn {
	position: absolute;
	bottom: 30vh;
	width: 82vw;
	left: 9vw;
}
.index-btn button {
	color: white;
	background-color: #2d72f1;
	border-radius: 0;
	font-size: 32rpx;
	padding: 15rpx 20rpx !important;
	box-sizing: border-box;
}

.auth-bg {
	position: fixed;
	top: 0;
	bottom: 0;
	z-index: 999;
	width: 100%;
	background: rgba(0, 0, 0, 0.37);
}

.auth-main {
	position: absolute;
	top: 250rpx;
	left: 50%;
	z-index: 1002;
	width: 250px;
	margin-left: -140px;
	padding: 15px;
	text-align: center;
	background: #fff;
}

.auth-info {
	padding: 10px 0;
	font-size: 13px;
	animation: upAndDown 1s linear infinite alternate;
	color: green;
}
/* 
@keyframes upAndDown {
    0% {margin-left:-20px;}
    100% {margin-left:20px;}
} */

.auth-btn-set {
	display: flex;
	align-items: center;
	width: 178px;
	height: 45px;
	padding: 0;
	margin: 15px auto;
	font-size: 15px;
	color: #fff;
	background-color: rgb(0, 190, 42);
}

.auth-btn-set image {
	width: 28px;
	height: 28px;
	margin: 0 6px 0 14px;
}

.auth-btn-ok {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 178px;
	height: 45px;
	padding: 0;
	margin: 10px auto;
	font-size: 15px;
	color: #000;
	background-color: #ddd;
}
</style>
