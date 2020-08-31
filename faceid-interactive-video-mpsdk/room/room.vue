<template>
	<!-- 在模版上放置标签 -->
	<view class="page-room">
		<trtc-room id="trtc-component" :config="rtcConfig"></trtc-room>
		<view class="guide" v-if="!isReady">
			<view class="title">{{ cmsConfig.Guide.tips }}</view>
			<veiw class="guidWrap">
				<view class="guidItem">
					<image src="https://sola.gtimg.cn/aoi/sola/20200727162604_dwjs9eOUkN.png" class="guidPic"></image>
					<view class="guidCont">{{ cmsConfig.Guide.guidCont1 }}</view>
				</view>
				<view class="guidItem">
					<image src="https://sola.gtimg.cn/aoi/sola/20200727162605_cNnQwD3HT7.png" class="guidPic"></image>
					<view class="guidCont">{{ cmsConfig.Guide.guidCont2 }}</view>
				</view>
				<view class="guidItem">
					<image src="https://sola.gtimg.cn/aoi/sola/20200727162606_HQQZnAa1b6.png" class="guidPic"></image>
					<view class="guidCont">{{ cmsConfig.Guide.guidCont3 }}</view>
				</view>
				<view class="guidItem">
					<image src="https://sola.gtimg.cn/aoi/sola/20200727162607_CV74lNJ2Q2.png" class="guidPic"></image>
					<view class="guidCont">{{ cmsConfig.Guide.guidCont4 }}</view>
				</view>
			</veiw>
			<view class="linking">{{ cmsConfig.Guide.loading }}</view>
		</view>
	</view>
</template>

<script>
import util from '../utils/util';
import { EVENT } from '../components/trtc-room/common/constants';
import trtcRoom from '../components/trtc-room/trtc-room';

export default {
	data() {
		return {
			rtcConfig: {
				sdkAppID: '',
				userID: '',
				userSig: '',
				template: '',
				isReady: !1,
				isHide: !1
			},
			roomTimeout: null,
			isLock: '',
			isReady: '',
			isHide: '',
			cmsConfig: ''
		};
	},

	components: {
		trtcRoom
	},
	props: {},
	onLoad: function(e) {
		this.setData({
			isHide: !1,
			cmsConfig: wx.IVdefaultConfig
		}),
			setTimeout(() => {
				this.getParams(e.BizToken)
					.then(t => {
						const o = t.roomId,
							n = t.sig,
							s = t.userId,
							i = t.sdkAppid;
						(this.trtcComponent = this.selectComponent('#trtc-component')),
							this.bindTRTCRoomEvent(e.BizToken),
							Object.getOwnPropertyNames(e).forEach(t => {
								'true' === e[t] && (e[t] = !0), 'false' === e[t] && (e[t] = !1);
							}),
							(this.options = e),
							this.enterRoom({
								BizToken: e.BizToken,
								sdkAppID: i,
								userSig: n,
								roomID: Number(o),
								userID: s,
								template: e.tefrontCamera,
								localVideo: e.lmplate,
								debugMode: e.debugMode,
								cloudenv: e.cloudenv,
								frontCamera: e.ocalVideo,
								localAudio: e.localAudio,
								enableEarMonitor: e.enableEarMonitor,
								enableAutoFocus: e.enableAutoFocus,
								localMirror: e.localMirror,
								enableAgc: e.enableAgc,
								enableAns: e.enableAns,
								encsmall: e.encsmall,
								videoHeight: e.videoHeight,
								videoWidth: e.videoWidth,
								scene: e.scene,
								maxBitrate: Number(e.maxBitrate),
								minBitrate: Number(e.minBitrate)
							});
					})
					.catch(e => {
						console.log(e);
					}),
					wx.setKeepScreenOn({
						keepScreenOn: !0
					});
			}, 3e3);
	},
	onReady: function() {
		wx.setKeepScreenOn({
			keepScreenOn: !0
		});
	},
	onShow: function() {
		wx.setKeepScreenOn({
			keepScreenOn: !0
		}),
			this.isHide &&
				(this.setData({
					isHide: !1
				}),
				(this.trtcComponent = this.selectComponent('#trtc-component')),
				this.trtcComponent._emitter.emit(EVENT.LOCAL_LEAVE, {
					userID: this.trtcComponent.data.pusher.userID
				}),
				this.trtcComponent.exitRoom());
	},
	onHide: function() {
		this.setData({
			isHide: !0
		});
	},
	onUnload: function() {
		console.log('room unload');
	},
	onPullDownRefresh: function() {},
	onReachBottom: function() {},
	onShareAppMessage: function() {},
	methods: {
		getParams: function(e) {
			const t = wx.IVdefaultConfig.Common.LivenessMode;
			return new Promise((o, n) => {
				const s = {
					url: `${wx.IVBaseUrl}/api/enterRoom?bizToken=${e}&livenessMode=${t}`,
					method: 'GET'
				};
				util
					.requestPromise(s)
					.then(t => {
						this.setData({
							isLock: !1
						}),
							200 !== t.statusCode
								? (wx.showModal({
										title: '提示',
										content: '网络异常,请稍后重试',
										showCancel: !1,
										complete: () => {
											wx.reLaunch({
												url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=NETWORK_ERROR&BizToken=${e}`
											});
										}
								  }),
								  n(new Error()))
								: 0 !== t.code
								? (wx.showModal({
										title: '提示',
										content: `${t.message}（${t.code}，${e}）`,
										showCancel: !1,
										complete: () => {
											wx.reLaunch({
												url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=ENTER_ROOM_FAIL&BizToken=${e}`
											});
										}
								  }),
								  n(new Error()))
								: o(t.data);
					})
					.catch(t => {
						console.log(t),
							wx.showModal({
								title: '提示',
								content: '网络异常,请稍后重试',
								showCancel: !1,
								complete: () => {
									wx.reLaunch({
										url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=NETWORK_ERROR&BizToken=${e}`
									});
								}
							});
					});
			});
		},
		enterRoom: function(e) {
			(e.template = e.template || '1v1'),
				(e.roomID = e.roomID || this.randomRoomID()),
				(e.userID = e.userID || this.randomUserID()),
				console.log('* room enterRoom', e),
				(this.template = e.template),
				(this.rtcConfig = {
					sdkAppID: e.sdkAppID,
					userID: e.userID,
					userSig: e.userSig,
					template: '1v1',
					debugMode: e.debugMode,
					beautyLevel: 9,
					enableIM: !0
				}),
				this.setData(
					{
						rtcConfig: this.rtcConfig
					},
					() => {
						const t = this;
						this.trtcComponent
							.enterRoom(e)
							.then(() => {
								console.log('* room timeout start'),
									clearTimeout(),
									(t.roomTimeout = setTimeout(() => {
										t.trtcComponent.exitRoom(),
											wx.reLaunch({
												url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=TIMEOUT&BizToken=${e.BizToken}`
											}),
											console.log('* long time no response');
									}, 18e4)),
									t.setData({
										isReady: !0
									});
							})
							.catch(e => {
								console.error('* room joinRoom 进房失败:', e);
							});
					}
				);
		},
		bindTRTCRoomEvent: function(e) {
			const t = this.trtcComponent.EVENT;
			(this.timestamp = []),
				this.trtcComponent.on(t.LOCAL_JOIN, e => {
					console.log('* room LOCAL_JOIN', e),
						(!0 !== this.options.localVideo && '1v1' !== this.options.template) || this.trtcComponent.publishLocalVideo(),
						(!0 !== this.options.localAudio && '1v1' !== this.options.template) || this.trtcComponent.publishLocalAudio();
				}),
				this.trtcComponent.on(t.LOCAL_LEAVE, t => {
					this.trtcComponent.exitRoom(),
						this.roomTimeout && clearTimeout(this.roomTimeout),
						wx.reLaunch({
							url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=LOCAL_LEAVE&BizToken=${e}`
						}),
						console.log('* room LOCAL_LEAVE', t);
				}),
				this.trtcComponent.on(t.ERROR, e => {
					console.log('* room ERROR', e);
				}),
				this.trtcComponent.on(t.REMOTE_USER_JOIN, e => {
					console.log('* room REMOTE_USER_JOIN', e, this.trtcComponent.getRemoteUserList()), this.timestamp.push(new Date());
				}),
				this.trtcComponent.on(t.REMOTE_USER_LEAVE, e => {
					console.log('* room REMOTE_USER_LEAVE', e, this.trtcComponent.getRemoteUserList()),
						(this.timestamp = []),
						(this.remoteUser = null),
						this.roomTimeout && clearTimeout(this.roomTimeout);
					const t = this.options.BizToken,
						o = {
							url: `${wx.IVBaseUrl}/api/result?bizToken=${t}`,
							method: 'GET'
						};
					util.requestPromise(o).then(e => {
						if ((this.trtcComponent.exitRoom(), 200 !== e.statusCode))
							wx.showModal({
								title: '提示',
								content: '网络异常',
								showCancel: !1
							});
						else if (0 !== e.data.code)
							wx.reLaunch({
								url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=SYSTEM_ERROR&BizToken=${t}`
							});
						else {
							const o = +e.data.data.Result;
							if (0 === o)
								wx.reLaunch({
									url: `/faceid-interactive-video-mpsdk/index/index?curPage=2&code=SUCCESS&BizToken=${t}`
								});
							else {
								let e = 'COMPARE_FAIL';

								switch (o) {
									case -1:
										e = 'SYSTEM_ERROR';
										break;

									case -2:
										e = 'NAME_ERROR';
										break;

									case -3:
										e = 'IDCARD_ERROR';
										break;

									case -4:
										e = 'WRONG_IMAGE';
										break;

									case -5:
									case -6:
									case -8:
										e = 'NO_INFO';
										break;

									case -7:
										e = 'NOT_MATCH';
										break;

									case -10:
										e = 'LOW_QUILITY';
										break;

									case -11:
									case -14:
										e = 'NO_FACE';
										break;

									case -13:
										e = 'MULTI_FACE';
										break;

									case -15:
										e = 'LOW_PIXEL';
										break;

									case -18:
										e = 'LIB_UPDATE';
										break;

									case -100:
									case -101:
									case -102:
									case -103:
									case -200:
										e = 'LIVE_FAIL';
										break;

									case -300:
										e = 'NO_FACE';
										break;

									case -301:
										e = 'MULTI_FACE';
										break;

									case -302:
										e = 'DETECT_MASK';
										break;

									case -400:
										e = 'DETECT_LIMITED';
										break;

									case -401:
										e = 'ROOM_TIMEOUT';
								}

								wx.reLaunch({
									url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=${e}&BizToken=${t}`
								});
							}
						}
					});
				}),
				this.trtcComponent.on(t.REMOTE_VIDEO_ADD, e => {
					console.log('* room REMOTE_VIDEO_ADD', e, this.trtcComponent.getRemoteUserList());
					const t = this.trtcComponent.getRemoteUserList(),
						o = e.data;

					if (
						('1v1' !== this.template || (this.remoteUser && this.remoteUser !== o.userID)
							? 'grid' === this.template &&
							  this.trtcComponent.subscribeRemoteVideo({
									userID: o.userID,
									streamType: o.streamType
							  })
							: ((this.remoteUser = o.userID),
							  this.trtcComponent.subscribeRemoteVideo({
									userID: o.userID,
									streamType: o.streamType
							  })),
						'custom' === this.template && o.userID && o.streamType)
					) {
						let e = t.findIndex(e => e.userID === o.userID);
						const n = 320 * ++e + 160;
						this.trtcComponent.setViewRect({
							userID: o.userID,
							streamType: o.streamType,
							xAxis: '480rpx',
							yAxis: n + 'rpx',
							width: '240rpx',
							height: '320rpx'
						});
					}
				}),
				this.trtcComponent.on(t.REMOTE_VIDEO_REMOVE, e => {
					console.log('* room REMOTE_VIDEO_REMOVE', e, this.trtcComponent.getRemoteUserList());
				}),
				this.trtcComponent.on(t.REMOTE_AUDIO_ADD, e => {
					console.log('* room REMOTE_AUDIO_ADD', e, this.trtcComponent.getRemoteUserList());
					const t = e.data;
					'1v1' !== this.template || (this.remoteUser && this.remoteUser !== t.userID)
						? ('grid' !== this.template && 'custom' !== this.template) ||
						  this.trtcComponent.subscribeRemoteAudio({
								userID: t.userID
						  })
						: ((this.remoteUser = t.userID),
						  this.trtcComponent.subscribeRemoteAudio({
								userID: t.userID
						  }));
				}),
				this.trtcComponent.on(t.REMOTE_AUDIO_REMOVE, e => {
					console.log('* room REMOTE_AUDIO_REMOVE', e, this.trtcComponent.getRemoteUserList());
				}),
				this.trtcComponent.on(t.IM_SDK_READY, e => {
					console.log('* room IM_SDK_READY', e);
				}),
				this.trtcComponent.on(t.IM_MESSAGE_RECEIVED, e => {
					console.log('* room IM_MESSAGE_RECEIVED', e.data);
				}),
				this.trtcComponent.on(t.REMOTE_STATE_UPDATE, e => {
					try {
						const t = e.data.detail.code;
						-2301 === t
							? wx.showModal({
									title: '提示',
									content: '您的网络连接已断开',
									showCancel: !1,
									complete: function() {
										wx.reLaunch({
											url: `/faceid-interactive-video-mpsdk/index/index?curPage=3&code=NETWORK_ERROR&BizToken=${this.options.BizToken}`
										});
									}
							  })
							: 2103 === t || [2104, 2105, 2107].includes(t) || [3002, 3003, 3005].includes(t);
					} catch (e) {}

					console.log('* room REMOTE_STATE_UPDATE', e);
				});
		},
		randomUserID: function() {
			return new Date()
				.getTime()
				.toString(16)
				.split('')
				.reverse()
				.join('');
		},
		randomRoomID: function() {
			return parseInt(9999 * Math.random());
		}
	}
};
</script>
<style>
/* miniprogram/pages/room/room.wxss */
.page-room {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
.room-mask {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: absolute;
	z-index: 90;
	background-color: white;
}

.room-mask .loading {
	position: absolute;
	top: 30vh;
	left: 50vw;
	transform: translate(-50%, 0);
	width: 300rpx;
	height: 250rpx;
	border-radius: 12rpx;
	background: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
}
.room-mask .loading-img {
	height: 200rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	animation: rotate 2s linear infinite;
}
.room-mask .rotate-img {
	width: 160rpx;
	height: 160rpx;
}
.room-mask .loading-text {
	width: 100%;
	padding-top: 40rpx;
	text-align: center;
}
@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.guide {
	width: 80vw;
	height: 100vh;
	overflow: hidden;
	position: relative;
	left: 10vw;
}
.guide .title {
	width: 100%;
	text-align: center;
	margin: 10vh 0 5vh 0;
	font-size: 42rpx;
}
.guide .linking {
	width: 100%;
	text-align: center;
	margin: 5vh 0 5vh 0;
	font-size: 36rpx;
}

.guidWrap {
	width: 100%;
	height: 60vh;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.guidItem {
	width: 100%;
	height: 12vh;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.guidItem image {
	width: 30vw;
	height: 20vw;
	max-height: 15vh;
}

.guidItem .guidCont {
	width: 25vw;
	font-size: 30rpx;
}
</style>
