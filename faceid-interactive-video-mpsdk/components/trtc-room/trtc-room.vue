<template>
	<view>
		<view class="trtc-room-container">
			<block v-if="template === '1v1'">
				<view class="template-1v1">
					<view
						v-for="(item, index) in streamList"
						:key="index"
						v-if="item.src && (item.hasVideo || item.hasAudio)"
						:class="'view-container player-container ' + (item.isVisible ? '' : 'none')"
					>
						<live-player
							class="player"
							:id="item.streamID"
							:data-userid="item.userID"
							:data-streamid="item.streamID"
							:data-streamtype="item.streamType"
							:src="item.src"
							mode="RTC"
							:autoplay="item.autoplay"
							:mute-audio="item.muteAudio"
							:mute-video="item.muteVideo"
							:orientation="item.orientation"
							:object-fit="item.objectFit"
							:background-mute="item.enableBackgroundMute"
							:min-cache="item.minCache"
							:max-cache="item.maxCache"
							:sound-mode="item.soundMode"
							:enable-recv-message="item.enableRecvMessage"
							:auto-pause-if-navigate="item.autoPauseIfNavigate"
							:auto-pause-if-open-native="item.autoPauseIfOpenNative"
							:debug="debug"
							@statechange="_playerStateChange"
							@fullscreenchange="_playerFullscreenChange"
							@netstatus="_playerNetStatus"
							@audiovolumenotify="_playerAudioVolumeNotify"
							@enterpictureinpicture="_bindenterpictureinpicture"
							@leavepictureinpicture="_bindleavepictureinpicture"
						></live-player>
					</view>
					<view :class="'view-container pusher-container ' + (pusher.isVisible ? '' : 'none') + ' ' + (streamList.length === 0 ? 'fullscreen' : '')">
						<live-pusher
							class="pusher"
							:url="pusher.url"
							:mode="pusher.mode"
							:autopush="pusher.autopush"
							:enable-camera="pusher.enableCamera"
							:enable-mic="pusher.enableMic"
							:enable-agc="pusher.enableAgc"
							:enable-ans="pusher.enableAns"
							:enable-ear-monitor="pusher.enableEarMonitor"
							:auto-focus="pusher.enableAutoFocus"
							:zoom="pusher.enableZoom"
							:min-bitrate="pusher.minBitrate"
							:max-bitrate="pusher.maxBitrate"
							:video-width="pusher.videoWidth"
							:video-height="pusher.videoHeight"
							:beauty="pusher.beautyLevel"
							:whiteness="pusher.whitenessLevel"
							:orientation="pusher.videoOrientation"
							:aspect="pusher.videoAspect"
							:device-position="pusher.frontCamera"
							:remote-mirror="pusher.enableRemoteMirror"
							:local-mirror="pusher.localMirror"
							:background-mute="pusher.enableBackgroundMute"
							:audio-quality="pusher.audioQuality"
							:audio-volume-type="pusher.audioVolumeType"
							:audio-reverb-type="pusher.audioReverbType"
							:waiting-image="pusher.waitingImage"
							:debug="debug"
							@statechange="_pusherStateChangeHandler"
							@netstatus="_pusherNetStatusHandler"
							@error="_pusherErrorHandler"
							@bgmstart="_pusherBGMStartHandler"
							@bgmprogress="_pusherBGMProgressHandler"
							@bgmcomplete="_pusherBGMCompleteHandler"
						></live-pusher>
						<view class="loading" v-if="streamList.length === 0">
							<view class="loading-img"><image src="https://sola.gtimg.cn/aoi/sola/20200615194418_YXoS5wuxyu.png" class="rotate-img"></image></view>
							<view class="loading-text">Loading...</view>
						</view>
					</view>
					<!-- <view class="mask"></view> -->
					<view class="bottom-tips">
						<view class="bottom-tips-text">{{ tostText }}</view>
					</view>
					<view class="bottom-btns">
						<view class="btn-hangup" @tap="_hangUp"><image class="btn-image" src="https://sola.gtimg.cn/aoi/sola/20200615194405_6ArJmqkJrK.png"></image></view>
					</view>
				</view>
			</block>
			<block v-if="template === 'grid'">
				<!-- 下行template对应的wxml不存在，无法替换，代码已注释 -->
				<!-- <template is="grid" :data="pusher, streamList, visibleStreamList, debug, panelName, gridPagePlaceholderStreamList, gridPageCount, gridCurrentPage, gridPlayerPerPage"></template>-->
			</block>
			<block v-if="template === 'custom'">
				<!-- 下行template对应的wxml不存在，无法替换，代码已注释 -->
				<!-- <template is="custom" :data="pusher, streamList, debug"></template>-->
			</block>
		</view>
	</view>
</template>

<script>
import UserController from './controller/user-controller';
import Pusher from './model/pusher';
import { EVENT, DEFAULT_COMPONENT_CONFIG } from './common/constants';
import Event from './utils/event';
import * as ENV from './utils/environment';
import MTA from './libs/mta_analysis';
import TIM from './libs/tim-wx';
const TAG_NAME = 'TRTC-ROOM',
	IM_GROUP_TYPE = TIM.TYPES.GRP_CHATROOM;
let touchX = 0,
	touchY = 0;

export default {
	data() {
		return {
			pusher: null,
			debugPanel: !0,
			debug: !1,
			streamList: [],
			visibleStreamList: [],
			userList: [],
			template: '',
			cameraPosition: '',
			panelName: '',
			localVolume: 0,
			remoteVolumeList: [],
			enableIM: !0,
			debugMode: !0,
			showIMPanel: !1,
			messageContent: '',
			messageList: [],
			maxMessageListLength: 10,
			messageListScrollTop: 0,
			appVersion: ENV.APP_VERSION,
			libVersion: ENV.LIB_VERSION,
			hasGridPageTipsShow: !1,
			gridPageCount: 0,
			gridCurrentPage: 1,
			gridPlayerPerPage: 4,
			gridPagePlaceholderStreamList: [],
			tostText: '视频期间，请您脸部不要离开屏幕'
		};
	},

	components: {},
	props: {
		config: {
			type: Object,
			default: () => ({
				sdkAppID: '',
				userID: '',
				userSig: '',
				template: '',
				debugMode: !1,
				enableIM: !0
			})
		}
	},
	watch: {
		config: {
			handler: function(e, t) {
				this.propertyObserverFun({
					name: 'config',
					newVal: e,
					oldVal: t
				});
			},
			immediate: true,
			deep: true
		}
	},
	created: function() {
		console.log(TAG_NAME, 'created', ENV),
			MTA.App.init({
				appID: '500710685',
				eventID: '500710697',
				autoReport: !0,
				statParam: !0
			});
	},
	beforeMount: function() {
		console.log(TAG_NAME, 'attached'), this.initFun(), MTA.Page.stat();
	},
	mounted: function() {
		console.log(TAG_NAME, 'ready');
	},
	destroyed: function() {
		console.log(TAG_NAME, 'detached'), this.exitRoom();
	},
	error: function(e) {
		console.log(TAG_NAME, 'error', e);
	},
	onPageShow: function() {
		console.log(TAG_NAME, 'show status:', this.status),
			this.status.isPending &&
				(this._emitter.emit(EVENT.LOCAL_LEAVE, {
					userID: this.pusher.userID
				}),
				this.exitRoom()),
			this.status.isPush &&
				(this._emitter.emit(EVENT.LOCAL_LEAVE, {
					userID: this.pusher.userID
				}),
				this.exitRoom());
	},
	onPageHide: function() {
		console.log(TAG_NAME, 'hide');
	},
	onPageResize: function(e) {
		console.log(TAG_NAME, 'resize', e);
	},
	methods: {
		initFun() {
			console.log(TAG_NAME, '_init'),
				(this.userController = new UserController(this)),
				(this._emitter = new Event()),
				(this.EVENT = EVENT),
				this.initStatusFun(),
				this.bindEventFun(),
				this.gridBindEventFun(),
				this.keepScreenOnFun(),
				console.log(TAG_NAME, '_init success component:', this);
		},

		initStatusFun() {
			(this.status = {
				isPush: !1,
				isPending: !1
			}),
				(this._lastTapTime = 0),
				(this._beforeLastTapTime = 0),
				(this._lastTapCoordinate = {
					x: 0,
					y: 0
				}),
				(this._isFullscreen = !1);
		},

		propertyObserverFun(e) {
			if ((console.log(TAG_NAME, '_propertyObserver', e, this.config), 'config' === e.name)) {
				const t = Object.assign({}, DEFAULT_COMPONENT_CONFIG, e.newVal);
				console.log(TAG_NAME, '_propertyObserver config:', t),
					t.debugMode,
					t.enableIM && t.sdkAppID && this.initIMFun(t),
					t.sdkAppID &&
						e.oldVal.sdkAppID !== t.sdkAppID &&
						MTA &&
						MTA.Event.stat('sdkAppID', {
							value: t.sdkAppID
						}),
					this.setData({
						template: t.template,
						debugMode: t.debugMode || !1,
						debug: t.debugMode || !1
					}),
					this.setPusherConfigFun(t);
			}
		},

		enterRoom(e) {
			return new Promise((t, s) => {
				console.log(TAG_NAME, 'enterRoom'),
					console.log(TAG_NAME, 'params', e),
					console.log(TAG_NAME, 'config', this.config),
					console.log(TAG_NAME, 'pusher', this.pusher),
					e && (Object.assign(this.pusher, e), Object.assign(this.config, e)),
					this.checkParamFun(this.config)
						? this.getPushUrlFun(this.config)
								.then(s => {
									(this.pusher.url = s),
										this.setData(
											{
												pusher: this.pusher
											},
											() => {
												console.log(TAG_NAME, 'enterRoom', this.pusher),
													this.pusher.getPusherContext().start(),
													(this.status.isPush = !0),
													this.loginIMFun({ ...this.config, roomID: e.roomID }),
													setTimeout(() => {
														console.log(''), wx.createLivePlayerContext('live-pusher', this).stop();
													}, 2e3),
													t();
											}
										);
								})
								.catch(e => {
									console.error(TAG_NAME, 'enterRoom error', e), s(e);
								})
						: s(new Error('缺少必要参数'));
			});
		},

		exitRoom() {
			return new Promise((e, t) => {
				console.log(TAG_NAME, 'exitRoom'), this.exitIMFun(), this.pusher.reset(), (this.status.isPush = !1);
				const s = this.userController.reset();
				this.setData(
					{
						pusher: this.pusher,
						userList: s.userList,
						streamList: s.streamList,
						visibleStreamList: this.filterVisibleStreamFun(s.streamList)
					},
					() => {
						e({
							userList: this.userList,
							streamList: this.streamList
						}),
							console.log(TAG_NAME, 'exitRoom success', this.pusher, this.streamList, this.userList);
					}
				);
			});
		},

		publishLocalVideo() {
			return (
				console.log(TAG_NAME, 'publishLocalVideo 开启摄像头'),
				this.setPusherConfigFun({
					enableCamera: !0
				})
			);
		},

		unpublishLocalVideo() {
			return (
				console.log(TAG_NAME, 'unpublshLocalVideo 关闭摄像头'),
				this.setPusherConfigFun({
					enableCamera: !1
				})
			);
		},

		publishLocalAudio() {
			return (
				console.log(TAG_NAME, 'publishLocalAudio 开启麦克风'),
				this.setPusherConfigFun({
					enableMic: !0
				})
			);
		},

		unpublishLocalAudio() {
			return (
				console.log(TAG_NAME, 'unpublshLocalAudio 关闭麦克风'),
				this.setPusherConfigFun({
					enableMic: !1
				})
			);
		},

		subscribeRemoteVideo(e) {
			console.log(TAG_NAME, 'subscribeRemoteVideo', e);
			const t = {
					muteVideo: !1
				},
				s = 'small' === e.streamType ? 'main' : e.streamType,
				r = this.userController.getStream({
					userID: e.userID,
					streamType: s
				});
			return (
				(r.muteVideoPrev = !1),
				('small' !== e.streamType && 'main' !== e.streamType) ||
					(r &&
						'main' === r.streamType &&
						(console.log(TAG_NAME, 'subscribeRemoteVideo switch small', r.src),
						'small' === e.streamType
							? ((t.src = r.src.replace('main', 'small')), (t._definitionType = 'small'))
							: 'main' === e.streamType && ((r.src = r.src.replace('small', 'main')), (t._definitionType = 'main')),
						console.log(TAG_NAME, 'subscribeRemoteVideo', r.src))),
				this.setPlayerConfigFun({
					userID: e.userID,
					streamType: s,
					config: t
				})
			);
		},

		unsubscribeRemoteVideo(e) {
			return (
				console.log(TAG_NAME, 'unsubscribeRemoteVideo', e),
				(this.userController.getStream({
					userID: e.userID,
					streamType: e.streamType
				}).muteVideoPrev = !0),
				this.setPlayerConfigFun({
					userID: e.userID,
					streamType: e.streamType,
					config: {
						muteVideo: !0
					}
				})
			);
		},

		subscribeRemoteAudio(e) {
			return (
				console.log(TAG_NAME, 'subscribeRemoteAudio', e),
				this.setPlayerConfigFun({
					userID: e.userID,
					streamType: 'main',
					config: {
						muteAudio: !1
					}
				})
			);
		},

		unsubscribeRemoteAudio(e) {
			return (
				console.log(TAG_NAME, 'unsubscribeRemoteAudio', e),
				this.setPlayerConfigFun({
					userID: e.userID,
					streamType: 'main',
					config: {
						muteAudio: !0
					}
				})
			);
		},

		on(e, t, s) {
			this._emitter.on(e, t, s);
		},

		off(e, t) {
			this._emitter.off(e, t);
		},

		getRemoteUserList() {
			return this.userList;
		},

		switchCamera() {
			this.cameraPosition || (this.cameraPosition = this.pusher.frontCamera),
				console.log(TAG_NAME, 'switchCamera', this.cameraPosition),
				(this.cameraPosition = 'front' === this.cameraPosition ? 'back' : 'front'),
				this.setData(
					{
						cameraPosition: this.cameraPosition
					},
					() => {
						console.log(TAG_NAME, 'switchCamera success', this.cameraPosition);
					}
				),
				this.pusher.getPusherContext().switchCamera();
		},

		setViewRect(e) {
			return (
				console.log(TAG_NAME, 'setViewRect', e),
				'custom' !== this.template && console.warn(`如需使用setViewRect方法，请初始化时设置template:"custom", 当前 template:"${this.template}"`),
				console.info('不建议谁用该方法动态修改样式，避免引起微信小程序渲染问题，建议直接修改 wxml wxss 进行样式定制化'),
				this.pusher.userID === e.userID
					? this.setPusherConfigFun({
							xAxis: e.xAxis,
							yAxis: e.yAxis,
							width: e.width,
							height: e.height
					  })
					: this.setPlayerConfigFun({
							userID: e.userID,
							streamType: e.streamType,
							config: {
								xAxis: e.xAxis,
								yAxis: e.yAxis,
								width: e.width,
								height: e.height
							}
					  })
			);
		},

		setViewVisible(e) {
			return (
				console.log(TAG_NAME, 'setViewVisible', e),
				'custom' !== this.template && console.warn(`如需使用setViewVisible方法，请初始化时设置template:"custom", 当前 template:"${this.template}"`),
				console.info('不建议谁用该方法动态修改样式，避免引起微信小程序渲染问题，建议直接修改 wxml wxss 进行样式定制化'),
				this.pusher.userID === e.userID
					? this.setPusherConfigFun({
							isVisible: e.isVisible
					  })
					: this.setPlayerConfigFun({
							userID: e.userID,
							streamType: e.streamType,
							config: {
								isVisible: e.isVisible
							}
					  })
			);
		},

		setViewZIndex(e) {
			return (
				console.log(TAG_NAME, 'setViewZIndex', e),
				'custom' !== this.template && console.warn(`如需使用setViewZIndex方法，请初始化时设置template:"custom", 当前 template:"${this.template}"`),
				console.info('不建议谁用该方法动态修改样式，避免引起微信小程序渲染问题，建议直接修改 wxml wxss 进行样式定制化'),
				this.pusher.userID === e.userID
					? this.setPusherConfigFun({
							zIndex: e.zindex || e.zIndex
					  })
					: this.setPlayerConfigFun({
							userID: e.userID,
							streamType: e.streamType,
							config: {
								zIndex: e.zindex || e.zIndex
							}
					  })
			);
		},

		playBGM(e) {
			return new Promise((t, s) => {
				this.pusher.getPusherContext().playBGM({
					url: e.url,
					success: () => {
						console.log(TAG_NAME, '播放背景音成功'), t();
					},
					fail: () => {
						console.log(TAG_NAME, '播放背景音失败'), this._emitter.emit(EVENT.BGM_PLAY_FAIL), s(new Error('播放背景音失败'));
					}
				});
			});
		},

		stopBGM() {
			this.pusher.getPusherContext().stopBGM();
		},

		pauseBGM() {
			this.pusher.getPusherContext().pauseBGM();
		},

		resumeBGM() {
			this.pusher.getPusherContext().resumeBGM();
		},

		setBGMVolume(e) {
			this.pusher.getPusherContext().setBGMVolume({
				volume: e.volume
			});
		},

		setMICVolume(e) {
			this.pusher.getPusherContext().setMICVolume({
				volume: e.volume
			});
		},

		sendSEI(e) {
			return new Promise((t, s) => {
				this.pusher.getPusherContext().sendMessage({
					msg: e.message,
					success: function(e) {
						t(e);
					}
				});
			});
		},

		snapshot(e) {
			return (
				console.log(TAG_NAME, 'snapshot', e),
				new Promise((t, s) => {
					this.captureSnapshot(e)
						.then(e => {
							wx.saveImageToPhotosAlbum({
								filePath: e.tempImagePath,

								success(s) {
									wx.showToast({
										title: '已保存到相册'
									}),
										console.log('save photo is success', s),
										t(e);
								},

								fail: function(e) {
									wx.showToast({
										icon: 'none',
										title: '保存失败'
									}),
										console.log('save photo is fail', e),
										s(e);
								}
							});
						})
						.catch(e => {
							s(e);
						});
				})
			);
		},

		captureSnapshot(e) {
			return new Promise((t, s) => {
				e.userID === this.pusher.userID
					? this.pusher.getPusherContext().snapshot({
							quality: 'raw',
							complete: e => {
								console.log(TAG_NAME, 'snapshot pusher', e), e.tempImagePath ? t(e) : (console.log('snapShot 回调失败', e), s(new Error('截图失败')));
							}
					  })
					: this.userController.getStream(e).playerContext.snapshot({
							quality: 'raw',
							complete: e => {
								console.log(TAG_NAME, 'snapshot player', e), e.tempImagePath ? t(e) : (console.log('snapShot 回调失败', e), s(new Error('截图失败')));
							}
					  });
			});
		},

		enterFullscreen(e) {
			return (
				console.log(TAG_NAME, 'enterFullscreen', e),
				new Promise((t, s) => {
					this.userController.getStream(e).playerContext.requestFullScreen({
						direction: e.direction || 0,
						success: e => {
							console.log(TAG_NAME, 'enterFullscreen success', e), t(e);
						},
						fail: e => {
							console.log(TAG_NAME, 'enterFullscreen fail', e), s(e);
						}
					});
				})
			);
		},

		exitFullscreen(e) {
			return (
				console.log(TAG_NAME, 'exitFullscreen', e),
				new Promise((t, s) => {
					this.userController.getStream(e).playerContext.exitFullScreen({
						success: e => {
							console.log(TAG_NAME, 'exitFullScreen success', e), t(e);
						},
						fail: e => {
							console.log(TAG_NAME, 'exitFullScreen fail', e), s(e);
						}
					});
				})
			);
		},

		setRemoteOrientation(e) {
			return this.setPlayerConfigFun({
				userID: e.userID,
				streamType: e.streamType,
				config: {
					orientation: e.orientation
				}
			});
		},

		setViewOrientation(e) {
			return this.setPlayerConfigFun({
				userID: e.userID,
				streamType: e.streamType,
				config: {
					orientation: e.orientation
				}
			});
		},

		setRemoteFillMode(e) {
			return this.setPlayerConfigFun({
				userID: e.userID,
				streamType: e.streamType,
				config: {
					objectFit: e.fillMode
				}
			});
		},

		setViewFillMode(e) {
			return this.setPlayerConfigFun({
				userID: e.userID,
				streamType: e.streamType,
				config: {
					objectFit: e.fillMode
				}
			});
		},

		setPusherConfigFun(e) {
			return (
				console.log(TAG_NAME, '_setPusherConfig', e, this.pusher),
				new Promise((t, s) => {
					this.pusher ? Object.assign(this.pusher, e) : (this.pusher = new Pusher(e)),
						this.setData(
							{
								pusher: this.pusher
							},
							() => {
								t(e);
							}
						);
				})
			);
		},

		setPlayerConfigFun(e) {
			const t = e.userID,
				s = e.streamType,
				r = e.config;
			return (
				console.log(TAG_NAME, '_setPlayerConfig', e),
				new Promise((i, a) => {
					const o = this.userController.getUser(t);
					o && o.streams[s]
						? (Object.assign(o.streams[s], r),
						  this.setData(
								{
									streamList: this.streamList,
									visibleStreamList: this.filterVisibleStreamFun(this.streamList, !0)
								},
								() => {
									i(e);
								}
						  ))
						: console.warn(TAG_NAME, '指定 userID 或者 streamType 不存在');
				})
			);
		},

		setListFun(e) {
			console.log(TAG_NAME, '_setList', e, this.template);
			const { userList: t, streamList: s } = e;
			return new Promise((r, i) => {
				let a = [];
				const o = {
					userList: t || this.userList,
					streamList: s || this.streamList
				};
				'grid' === this.template &&
					((a = this.filterVisibleStreamFun(s)),
					(o.visibleStreamList = a || this.visibleStreamList),
					(o.gridPagePlaceholderStreamList = this.gridPagePlaceholderStreamList),
					(o.gridCurrentPage = this.gridCurrentPage),
					(o.gridPageCount = this.gridPageCount)),
					this.setData(o, () => {
						r(e);
					});
			});
		},

		checkParamFun: e => (
			console.log(TAG_NAME, 'checkParam config:', e),
			e.sdkAppID
				? void 0 === e.roomID
					? (console.error('未设置 roomID'), !1)
					: e.roomID < 1 || e.roomID > 4294967296
					? (console.error('roomID 超出取值范围 1 ~ 4294967295'), !1)
					: e.userID
					? e.userSig
						? !!e.template || (console.error('未设置 template'), !1)
						: (console.error('未设置 userSig'), !1)
					: (console.error('未设置 userID'), !1)
				: (console.error('未设置 sdkAppID'), !1)
		),

		getPushUrlFun(e) {
			return (
				console.log(TAG_NAME, '_getPushUrl', e),
				ENV.IS_TRTC
					? new Promise((t, s) => {
							(e.scene = e.scene && 'rtc' !== e.scene ? 'live' : 'videocall'),
								(e.enableBlackStream = e.enableBlackStream || 1),
								(e.encsmall = e.encsmall || 0),
								(e.cloudenv = e.cloudenv || 'PRO'),
								setTimeout(() => {
									const s =
										'room://cloud.tencent.com/rtc?sdkappid=' +
										e.sdkAppID +
										'&roomid=' +
										e.roomID +
										'&userid=' +
										e.userID +
										'&usersig=' +
										e.userSig +
										'&appscene=' +
										e.scene +
										'&encsmall=' +
										e.encsmall +
										'&cloudenv=' +
										e.cloudenv;
									console.log(TAG_NAME, 'getPushUrl result:', s), t(s);
								}, 0);
					  })
					: this.requestSigServerFun(e)
			);
		},

		requestSigServerFun(e) {
			console.log(TAG_NAME, '_requestSigServer:', e);
			const t = e.sdkAppID,
				s = e.userID,
				r = e.userSig,
				i = e.roomID,
				a = e.privateMapKey;
			e.useCloud = void 0 === e.useCloud || e.useCloud;
			let o = e.useCloud ? 'https://official.opensso.tencent-cloud.com/v4/openim/jsonvideoapp' : 'https://yun.tim.qq.com/v4/openim/jsonvideoapp';
			o += '?sdkappid=' + t + '&identifier=' + s + '&usersig=' + r + '&random=' + Date.now() + '&contenttype=json';
			const n = {
					Cmd: 1,
					SeqNo: 1,
					BusType: 7,
					GroupId: i
				},
				l = {
					PrivMapEncrypt: a,
					TerminalType: 1,
					FromType: 3,
					SdkVersion: 26280566
				};
			return (
				console.log(TAG_NAME, '_requestSigServer:', o, n, l),
				new Promise((r, a) => {
					wx.request({
						url: o,
						data: {
							ReqHead: n,
							ReqBody: l
						},
						method: 'POST',
						success: o => {
							console.log('_requestSigServer success:', o), (o.data.ErrorCode || 0 !== o.data.RspHead.ErrorCode) && (console.error('获取roomsig失败'), a(o));
							const n = JSON.stringify(o.data.RspBody);
							let l = 'room://cloud.tencent.com?sdkappid=' + t + '&roomid=' + i + '&userid=' + s + '&roomsig=' + encodeURIComponent(n);

							if (e.pureAudioPushMod || e.recordId) {
								const t = {
									Str_uc_params: {
										pure_audio_push_mod: 0,
										record_id: 0
									}
								};
								e.pureAudioPushMod ? (t.Str_uc_params.pure_audio_push_mod = e.pureAudioPushMod) : delete t.Str_uc_params.pure_audio_push_mod,
									e.recordId ? (t.Str_uc_params.record_id = e.recordId) : delete t.Str_uc_params.record_id,
									(l += '&bizbuf=' + encodeURIComponent(JSON.stringify(t)));
							}

							console.log('roomSigInfo', l), r(l);
						},
						fail: e => {
							console.log(TAG_NAME, 'requestSigServer fail:', e), a(e);
						}
					});
				})
			);
		},

		doubleTabToggleFullscreenFun(e) {
			const t = e.timeStamp,
				s = this._lastTapTime,
				r = this._lastTapCoordinate,
				i = e.detail,
				a = Math.sqrt(Math.pow(Math.abs(i.x - r.x), 2) + Math.pow(Math.abs(i.y - r.y), 2));
			this._lastTapCoordinate = i;
			const o = this._beforeLastTapTime;

			if ((console.log(TAG_NAME, '_doubleTabToggleFullscreen', e, s, o, a), t - s > 0 && t - s < 300 && s - o > 1500 && a < 20)) {
				const t = e.currentTarget.dataset.userid,
					r = e.currentTarget.dataset.streamtype;
				if (this._isFullscreen)
					this.exitFullscreen({
						userID: t,
						streamType: r
					})
						.then(() => {
							this._isFullscreen = !1;
						})
						.catch(() => {});
				else {
					let e;
					this.enterFullscreen({
						userID: t,
						streamType: r,
						direction: e
					})
						.then(() => {
							this._isFullscreen = !0;
						})
						.catch(() => {});
				}
				this._beforeLastTapTime = s;
			}

			this._lastTapTime = t;
		},

		bindEventFun() {
			this.userController.on(EVENT.REMOTE_USER_JOIN, e => {
				console.log(TAG_NAME, '远端用户进房', e, e.data.userID),
					this.setData(
						{
							userList: e.data.userList
						},
						() => {
							this._emitter.emit(EVENT.REMOTE_USER_JOIN, {
								userID: e.data.userID
							});
						}
					),
					console.log(TAG_NAME, 'REMOTE_USER_JOIN', 'streamList:', this.streamList, 'userList:', this.userList);
			}),
				this.userController.on(EVENT.REMOTE_USER_LEAVE, e => {
					console.log(TAG_NAME, '远端用户离开', e, e.data.userID),
						e.data.userID &&
							this.setListFun({
								userList: e.data.userList,
								streamList: e.data.streamList
							}).then(() => {
								this._emitter.emit(EVENT.REMOTE_USER_LEAVE, {
									userID: e.data.userID
								});
							}),
						console.log(TAG_NAME, 'REMOTE_USER_LEAVE', 'streamList:', this.streamList, 'userList:', this.userList);
				}),
				this.userController.on(EVENT.REMOTE_VIDEO_ADD, e => {
					console.log(TAG_NAME, '远端视频可用', e, e.data.stream.userID);
					const t = e.data.stream;
					this.setListFun({
						userList: e.data.userList,
						streamList: e.data.streamList
					}).then(() => {
						(t.playerContext = wx.createLivePlayerContext(t.streamID, this)),
							this._emitter.emit(EVENT.REMOTE_VIDEO_ADD, {
								userID: t.userID,
								streamType: t.streamType
							});
					}),
						console.log(TAG_NAME, 'REMOTE_VIDEO_ADD', 'streamList:', this.streamList, 'userList:', this.userList);
				}),
				this.userController.on(EVENT.REMOTE_VIDEO_REMOVE, e => {
					console.log(TAG_NAME, '远端视频移除', e, e.data.stream.userID);
					const t = e.data.stream;
					this.setListFun({
						userList: e.data.userList,
						streamList: e.data.streamList
					}).then(() => {
						t.userID &&
							t.streamType &&
							this._emitter.emit(EVENT.REMOTE_VIDEO_REMOVE, {
								userID: t.userID,
								streamType: t.streamType
							});
					}),
						console.log(TAG_NAME, 'REMOTE_VIDEO_REMOVE', 'streamList:', this.streamList, 'userList:', this.userList);
				}),
				this.userController.on(EVENT.REMOTE_AUDIO_ADD, e => {
					console.log(TAG_NAME, '远端音频可用', e);
					const t = e.data.stream;
					this.setListFun({
						userList: e.data.userList,
						streamList: e.data.streamList
					}).then(() => {
						(t.playerContext = wx.createLivePlayerContext(t.streamID, this)),
							this._emitter.emit(EVENT.REMOTE_AUDIO_ADD, {
								userID: t.userID,
								streamType: t.streamType
							});
					}),
						console.log(TAG_NAME, 'REMOTE_AUDIO_ADD', 'streamList:', this.streamList, 'userList:', this.userList);
				}),
				this.userController.on(EVENT.REMOTE_AUDIO_REMOVE, e => {
					console.log(TAG_NAME, '远端音频移除', e, e.data.stream.userID);
					const t = e.data.stream;
					this.setListFun({
						userList: e.data.userList,
						streamList: e.data.streamList
					}).then(() => {
						t.userID &&
							t.streamType &&
							this._emitter.emit(EVENT.REMOTE_AUDIO_REMOVE, {
								userID: t.userID,
								streamType: t.streamType
							});
					}),
						console.log(TAG_NAME, 'REMOTE_AUDIO_REMOVE', 'streamList:', this.streamList, 'userList:', this.userList);
				});
		},

		pusherStateChangeHandlerFun(e) {
			const t = e.detail.code,
				s = e.detail.message;

			switch ((console.log(TAG_NAME, 'pusherStateChange：', t, e), t)) {
				case 0:
					console.log(s, t);
					break;

				case 1001:
					console.log('已经连接推流服务器', t);
					break;

				case 1002:
					console.log('已经与服务器握手完毕,开始推流', t);
					break;

				case 1003:
					console.log('打开摄像头成功', t);
					break;

				case 1004:
					console.log('录屏启动成功', t);
					break;

				case 1005:
					console.log('推流动态调整分辨率', t);
					break;

				case 1006:
					console.log('推流动态调整码率', t);
					break;

				case 1007:
					console.log('首帧画面采集完成', t);
					break;

				case 1008:
					console.log('编码器启动', t);
					break;

				case 1018:
					console.log('进房成功', t),
						this._emitter.emit(EVENT.LOCAL_JOIN, {
							userID: this.pusher.userID
						});
					break;

				case 1019:
					console.log('退出房间', t);
					break;

				case 2003:
					console.log('渲染首帧视频', t);
					break;

				case 1020:
				case 1031:
				case 1032:
				case 1033:
				case 1034:
					this.userController.userEventHandler(e);
					break;

				case -1301:
					console.error('打开摄像头失败: ', t),
						this._emitter.emit(EVENT.ERROR, {
							code: t,
							message: s
						});
					break;

				case -1302:
					console.error('打开麦克风失败: ', t),
						this._emitter.emit(EVENT.ERROR, {
							code: t,
							message: s
						});
					break;

				case -1303:
					console.error('视频编码失败: ', t),
						this._emitter.emit(EVENT.ERROR, {
							code: t,
							message: s
						});
					break;

				case -1304:
					console.error('音频编码失败: ', t),
						this._emitter.emit(EVENT.ERROR, {
							code: t,
							message: s
						});
					break;

				case -1307:
					console.error('推流连接断开: ', t),
						this._emitter.emit(EVENT.ERROR, {
							code: t,
							message: s
						});
					break;

				case -100018:
					console.error('进房失败: ', t, s),
						this._emitter.emit(EVENT.ERROR, {
							code: t,
							message: s
						});
					break;

				case 5e3:
					console.log('小程序被挂起: ', t);
					break;

				case 1021:
					console.log('网络类型发生变化，需要重新进房', t);
					break;

				case 2007:
					console.log('本地视频播放loading: ', t);
					break;

				case 2004:
					console.log('本地视频播放开始: ', t);
					break;

				default:
					console.log(s, t);
			}

			this._emitter.emit(EVENT.LOCAL_STATE_UPDATE, e);
		},

		pusherNetStatusHandlerFun(e) {
			this._emitter.emit(EVENT.LOCAL_NET_STATE_UPDATE, e);
		},

		pusherErrorHandlerFun(e) {
			console.warn(TAG_NAME, 'pusher error', e);

			try {
				const t = e.detail.errCode,
					s = e.detail.errMsg;

				this._emitter.emit(EVENT.ERROR, {
					code: t,
					message: s
				});
			} catch (t) {
				console.error(TAG_NAME, 'pusher error data parser exception', e, t);
			}
		},

		pusherBGMStartHandlerFun(e) {},

		pusherBGMProgressHandlerFun(e) {
			this._emitter.emit(EVENT.BGM_PLAY_PROGRESS, e);
		},

		pusherBGMCompleteHandlerFun(e) {
			this._emitter.emit(EVENT.BGM_PLAY_COMPLETE, e);
		},

		playerStateChangeFun(e) {
			this._emitter.emit(EVENT.REMOTE_STATE_UPDATE, e);
		},

		playerFullscreenChangeFun(e) {
			this._emitter.emit(EVENT.REMOTE_FULLSCREEN_UPDATE, e), this._emitter.emit(EVENT.VIDEO_FULLSCREEN_UPDATE, e);
		},

		bindenterpictureinpictureFun(e) {
			console.log('_bindenterpictureinpicture', e);
		},

		bindleavepictureinpictureFun(e) {
			console.log('_bindleavepictureinpicture', e);
		},

		playerNetStatusFun(e) {
			const t = e.detail.info;
			t.netQualityLevel >= 4 && this._emitter.emit(EVENT.NET_QUALITY_LOW, t.netQualityLevel), t.netJitter && this._emitter.emit(EVENT.NET_JITTER, t.netJitter);
			const s = this.userController.getStream({
				userID: e.currentTarget.dataset.userid,
				streamType: e.currentTarget.dataset.streamtype
			});
			!s ||
				(s.videoWidth === t.videoWidth && s.videoHeight === t.videoHeight) ||
				(console.log(TAG_NAME, '_playerNetStatus update video size', e), (s.videoWidth = t.videoWidth), (s.videoHeight = t.videoHeight)),
				this._emitter.emit(EVENT.REMOTE_NET_STATE_UPDATE, e);
		},

		playerAudioVolumeNotifyFun(e) {
			this._emitter.emit(EVENT.REMOTE_AUDIO_VOLUME_UPDATE, e);
		},

		filterVisibleStreamFun(e, t) {
			const s = e.filter(e => e.hasVideo || e.hasAudio);
			return (
				s.sort((e, t) => {
					const s = e.userID.toUpperCase(),
						r = t.userID.toUpperCase();
					return s < r ? -1 : s > r ? 1 : 0;
				}),
				'grid' !== this.template ||
					t ||
					(this.filterGridPageVisibleStreamFun(s),
					console.log(TAG_NAME, '_filterVisibleStream gridPagePlaceholderStreamList:', this.gridPagePlaceholderStreamList),
					this.gridCurrentPage > 1 && this.gridPagePlaceholderStreamList.length === this.gridPlayerPerPage && this.gridPageToPrevFun(s)),
				console.log(TAG_NAME, '_filterVisibleStream list:', s),
				s
			);
		},

		filterGridPageVisibleStreamFun(e) {
			const t = e.length;
			(this.gridPageCount = Math.ceil((t + 1) / this.gridPlayerPerPage)), (this.gridPagePlaceholderStreamList = []);
			let s,
				r = 0;
			s =
				this.gridPlayerPerPage > 3
					? 1 === this.gridCurrentPage
						? [-1, this.gridPlayerPerPage - 1]
						: [this.gridCurrentPage * this.gridPlayerPerPage - (this.gridPlayerPerPage + 2), this.gridCurrentPage * this.gridPlayerPerPage - 1]
					: [this.gridCurrentPage * this.gridPlayerPerPage - (this.gridPlayerPerPage + 1), this.gridCurrentPage * this.gridPlayerPerPage];

			for (let i = 0; i < t; i++) i > s[0] && i < s[1] ? ((e[i].isVisible = !0), (e[i].muteVideo = e[i].muteVideoPrev || !1), r++) : ((e[i].isVisible = !1), (e[i].muteVideo = !0));

			for (let e = 0; e < this.gridPlayerPerPage - r; e++)
				this.gridPagePlaceholderStreamList.push({
					id: 'holder-' + e
				});

			return e;
		},

		keepScreenOnFun() {
			setInterval(() => {
				wx.setKeepScreenOn({
					keepScreenOn: !0
				});
			}, 2e4);
		},

		initIMFun(e) {
			if (!e.enableIM || !e.sdkAppID || this.tim) return;
			console.log(TAG_NAME, '_initIM', e);
			const t = TIM.create({
				SDKAppID: e.sdkAppID
			});
			t.setLogLevel(1),
				t.off(TIM.EVENT.SDK_READY, this.onIMReadyFun),
				t.off(TIM.EVENT.MESSAGE_RECEIVED, this.onIMMessageReceivedFun),
				t.off(TIM.EVENT.SDK_NOT_READY, this.onIMNotReadyFun),
				t.off(TIM.EVENT.ERROR, this.onIMErrorFun),
				t.on(TIM.EVENT.SDK_READY, this.onIMReadyFun, this),
				t.on(TIM.EVENT.MESSAGE_RECEIVED, this.onIMMessageReceivedFun, this),
				t.on(TIM.EVENT.SDK_NOT_READY, this.onIMNotReadyFun, this),
				t.on(TIM.EVENT.ERROR, this.onIMErrorFun, this),
				(this.tim = t),
				(wx.tim = t);
		},

		loginIMFun(e) {
			if (this.tim)
				return (
					console.log(TAG_NAME, '_loginIM', e),
					this.tim.login({
						userID: e.userID,
						userSig: e.userSig
					})
				);
		},

		logoutIMFun() {
			if (this.tim) return console.log(TAG_NAME, '_logoutIM'), this.tim.logout();
		},

		exitIMFun() {
			!this.exitIMThrottle && this.tim && ((this.exitIMThrottle = !0), this.logoutIMFun());
		},

		onIMReadyFun(e) {
			console.log(TAG_NAME, 'IM.SDK_READY', e), this._emitter.emit(EVENT.IM_SDK_READY, e);
		},

		onIMMessageReceivedFun(e) {
			console.log(TAG_NAME, 'IM.MESSAGE_RECEIVED', e, e.data[0]._elements[0]);
			const t = (e.data[0] && e.data[0]._elements[0] && e.data[0]._elements[0].content.text) || this.tostText;
			this.setData({
				tostText: t
			}),
				this._emitter.emit(EVENT.IM_MESSAGE_RECEIVED, e);
		},

		onIMNotReadyFun(e) {
			console.log(TAG_NAME, 'IM.SDK_NOT_READY', e), this._emitter.emit(EVENT.IM_SDK_NOT_READY, e);
		},

		onIMErrorFun(e) {
			console.log(TAG_NAME, 'IM.ERROR', e), this._emitter.emit(EVENT.IM_ERROR, e);
		},

		toggleVideoFun() {
			this.pusher.enableCamera ? this.unpublishLocalVideo() : this.publishLocalVideo();
		},

		toggleAudioFun() {
			this.pusher.enableMic ? this.unpublishLocalAudio() : this.publishLocalAudio();
		},

		debugToggleRemoteVideoFun(e) {
			console.log(TAG_NAME, '_debugToggleRemoteVideo', e.currentTarget.dataset);
			const t = e.currentTarget.dataset.userID,
				s = e.currentTarget.dataset.streamType;
			this.streamList.find(e => e.userID === t && e.streamType === s).muteVideo
				? this.subscribeRemoteVideo({
						userID: t,
						streamType: s
				  })
				: this.unsubscribeRemoteVideo({
						userID: t,
						streamType: s
				  });
		},

		debugToggleRemoteAudioFun(e) {
			console.log(TAG_NAME, '_debugToggleRemoteAudio', e.currentTarget.dataset);
			const t = e.currentTarget.dataset.userID,
				s = e.currentTarget.dataset.streamType;
			this.streamList.find(e => e.userID === t && e.streamType === s).muteAudio
				? this.subscribeRemoteAudio({
						userID: t
				  })
				: this.unsubscribeRemoteAudio({
						userID: t
				  });
		},

		debugToggleVideoDebugFun() {
			this.setData({
				debug: !this.debug
			});
		},

		debugExitRoomFun() {
			this.exitRoom();
		},

		debugEnterRoomFun() {
			this.enterRoom({
				roomID: this.config.roomID
			}).then(() => {
				setTimeout(() => {
					this.publishLocalVideo(), this.publishLocalAudio();
				}, 2e3);
			});
		},

		debugGoBackFun() {
			wx.navigateBack({
				delta: 1
			});
		},

		debugTogglePanelFun() {
			this.setData({
				debugPanel: !this.debugPanel
			});
		},

		toggleAudioVolumeTypeFun() {
			'voicecall' === this.pusher.audioVolumeType
				? this.setPusherConfigFun({
						audioVolumeType: 'media'
				  })
				: this.setPusherConfigFun({
						audioVolumeType: 'voicecall'
				  });
		},

		toggleSoundModeFun() {
			if (0 === this.userList.length) return;
			const e = this.userController.getStream({
				userID: this.userList[0].userID,
				streamType: 'main'
			});
			e &&
				('speaker' === e.soundMode ? (e.soundMode = 'ear') : (e.soundMode = 'speaker'),
				this.setPlayerConfigFun({
					userID: e.userID,
					streamType: 'main',
					config: {
						soundMode: e.soundMode
					}
				}));
		},

		hangUpFun() {
			this._emitter.emit(EVENT.LOCAL_LEAVE, {
				userID: this.pusher.userID
			}),
				this.exitRoom();
		},

		handleSubscribeAudio() {
			this.pusher.enableMic ? this.unpublishLocalAudio() : this.publishLocalAudio();
		},

		handleSubscribeRemoteVideoFun(e) {
			const t = e.currentTarget.dataset.userID,
				s = e.currentTarget.dataset.streamType;
			this.streamList.find(e => e.userID === t && e.streamType === s).muteVideo
				? this.subscribeRemoteVideo({
						userID: t,
						streamType: s
				  })
				: this.unsubscribeRemoteVideo({
						userID: t,
						streamType: s
				  });
		},

		handleSubscribeRemoteAudioFun(e) {
			const t = e.currentTarget.dataset.userID,
				s = e.currentTarget.dataset.streamType;
			this.streamList.find(e => e.userID === t && e.streamType === s).muteAudio
				? this.subscribeRemoteAudio({
						userID: t
				  })
				: this.unsubscribeRemoteAudio({
						userID: t
				  });
		},

		switchMemberListPanelFun() {
			this.setData({
				panelName: 'memberlist-panel' !== this.panelName ? 'memberlist-panel' : ''
			});
		},

		switchSettingPanelFun() {
			this.setData({
				panelName: 'setting-panel' !== this.panelName ? 'setting-panel' : ''
			});
		},

		handleMaskerClickFun() {
			this.setData({
				panelName: ''
			});
		},

		setPuserPropertyFun(e) {
			console.log(TAG_NAME, '_setPuserProperty', e);
			const t = e.currentTarget.dataset.key,
				s = e.currentTarget.dataset.valueType;
			let r = e.currentTarget.dataset.value;
			const i = {};
			'boolean' === s && ((r = 'true' === r), (i[t] = !this.pusher[t])),
				'number' === s && r.indexOf('|') > 0 && ((r = r.split('|')), this.pusher[t] === Number(r[0]) ? (i[t] = Number(r[1])) : (i[t] = Number(r[0]))),
				'string' === s && r.indexOf('|') > 0 && ((r = r.split('|')), this.pusher[t] === r[0] ? (i[t] = r[1]) : (i[t] = r[0])),
				this.setPusherConfigFun(i);
		},

		setPlayerPropertyFun(e) {
			console.log(TAG_NAME, '_setPlayerProperty', e);
			const t = e.currentTarget.dataset.userid,
				s = e.currentTarget.dataset.streamtype,
				r = e.currentTarget.dataset.key;
			let i = e.currentTarget.dataset.value;
			const a = this.userController.getStream({
				userID: t,
				streamType: s
			});
			if (!a) return;
			const o = {};
			'true' === i ? (i = !0) : 'false' === i && (i = !1),
				'boolean' == typeof i ? (o[r] = !a[r]) : 'string' == typeof i && i.indexOf('|') > 0 && ((i = i.split('|')), a[r] === i[0] ? (o[r] = i[1]) : (o[r] = i[0])),
				console.log(TAG_NAME, '_setPlayerProperty', o),
				this.setPlayerConfigFun({
					userID: t,
					streamType: s,
					config: o
				});
		},

		switchStreamTypeFun(e) {
			const t = e.currentTarget.dataset.userid,
				s = e.currentTarget.dataset.streamtype,
				r = this.userController.getStream({
					userID: t,
					streamType: s
				});
			r &&
				'main' === r.streamType &&
				('small' === r._definitionType
					? this.subscribeRemoteVideo({
							userID: t,
							streamType: 'main'
					  })
					: this.subscribeRemoteVideo({
							userID: t,
							streamType: 'small'
					  }));
		},

		handleSnapshotClickFun(e) {
			wx.showToast({
				title: '开始截屏',
				icon: 'none',
				duration: 1e3
			});
			const t = e.currentTarget.dataset.userid,
				s = e.currentTarget.dataset.streamtype;
			this.snapshot({
				userID: t,
				streamType: s
			});
		},

		gridBindEventFun() {
			this.on(EVENT.REMOTE_AUDIO_VOLUME_UPDATE, e => {
				const t = e.data,
					s = t.currentTarget.dataset.userid,
					r = t.currentTarget.dataset.streamtype,
					i = t.detail.volume,
					a = this.userController.getStream({
						userID: s,
						streamType: 'aux' === r ? 'main' : r
					});
				a && (a.volume = i),
					this.setData(
						{
							streamList: this.streamList,
							visibleStreamList: this.filterVisibleStreamFun(this.streamList, !0)
						},
						() => {}
					);
			});
		},

		handleGridTouchStartFun(e) {
			(touchX = e.changedTouches[0].clientX), (touchY = e.changedTouches[0].clientY);
		},

		handleGridTouchEndFun(e) {
			const t = e.changedTouches[0].clientX,
				s = e.changedTouches[0].clientY;
			t - touchX > 50 && Math.abs(s - touchY) < 50 ? this.gridPagePrevFun() : t - touchX < -50 && Math.abs(s - touchY) < 50 && this.gridPageNextFun();
		},

		gridPageToPrevFun(e) {
			const t = this.filterGridPageVisibleStreamFun(e);
			if (this.gridPagePlaceholderStreamList.length !== this.gridPlayerPerPage) return t;
			this.gridCurrentPage--, this.gridPageToPrevFun(e);
		},

		gridPageNextFun() {
			this.gridCurrentPage++, this.gridCurrentPage > this.gridPageCount && (this.gridCurrentPage = 1), this.gridPageSetDataFun();
		},

		gridPagePrevFun() {
			this.gridCurrentPage--, this.gridCurrentPage < 1 && (this.gridCurrentPage = this.gridPageCount), this.gridPageSetDataFun();
		},

		gridPageSetDataFun() {
			this.gridShowPageTipsFun();
			const e = this.filterVisibleStreamFun(this.streamList);
			this.setData(
				{
					gridCurrentPage: this.gridCurrentPage,
					gridPageCount: this.gridPageCount,
					visibleStreamList: e,
					streamList: this.streamList,
					gridPagePlaceholderStreamList: this.gridPagePlaceholderStreamList
				},
				() => {}
			);
		},

		gridShowPageTipsFun(e) {
			this.gridPageCount < 2 ||
				(console.log(TAG_NAME, '_gridShowPageTips', this),
				this.hasGridPageTipsShow && clearTimeout(this.hasGridPageTipsShow),
				this.animate(
					'.pages-container',
					[
						{
							opacity: 1
						}
					],
					100,
					() => {}
				),
				(this.hasGridPageTipsShow = setTimeout(() => {
					this.animate(
						'.pages-container',
						[
							{
								opacity: 1
							},
							{
								opacity: 0.3
							}
						],
						600,
						() => {}
					);
				}, 3e3)));
		}
	}
};
</script>
<style>
@import './template/1v1/1v1.css';

.pusher {
	width: 100%;
	height: 100%;
}

.player {
	width: 100%;
	height: 100%;
}

.debug-info {
	max-width: 100vw;
	max-height: 90vh;
	box-sizing: border-box;
	overflow-y: scroll;
	position: absolute;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.5);
	color: #fff;
	bottom: 20rpx;
	left: 0;
	padding: 10rpx;
	font-size: 12px;
}
.debug-info-btn .debug-btn,
.debug-info .debug-btn {
	padding: 0 8px;
	min-height: 18px;
	width: auto;
	font-size: 12px;
	line-height: 18px;
	display: inline-block;
	color: #06ae56;
	background-color: #f2f2f2;
}
.debug-info .debug-btn.false {
	color: rgb(114, 114, 114);
}
.debug-info-btn .debug-btn,
.debug-info .button-hover {
	background-color: rgb(219, 219, 219);
}
.debug-info .close-btn {
	position: absolute;
	top: 0;
	right: 0;
	padding: 5px 10px;
}
.debug-info .text.true {
	color: #1fff8b;
}
.debug-info .text.false {
	color: #ff2e2e;
}
.debug-info-btn {
	position: absolute;
	z-index: 9998;
	bottom: 20rpx;
	left: 0;
}

.trtc-room-container .btn {
	display: inline-block;
	width: auto;
	height: 60rpx;
	min-height: 60rpx;
	line-height: 60rpx;
	font-size: 12px;
	font-weight: normal;
	padding: 0 10rpx;
	color: #006eff;
	background-color: #f2f2f2;
	margin: 0 16rpx;
}
.trtc-room-container .btn.active {
	color: #f2f2f2;
	background-color: #006eff;
}
.trtc-room-container .btn-hover {
	background-color: #d1d1d1;
}

.im-panel {
	position: absolute;
	z-index: 9;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 90vw;
	height: 320rpx;
	top: 50vh;
	left: 50vw;
	transform: translate(-50%, -50%);
	padding: 20rpx 0;
	border-radius: 10rpx;
	font-size: 12px;
	/* bottom: 25vh; */
	color: #fff;
	background-color: rgba(0, 0, 0, 0.8);
}
.im-panel .close-btn {
	position: absolute;
	top: 0;
	right: -3px;
	padding: 5px 10px;
	z-index: 99;
}
.message-panel-body {
	width: 100%;
	height: 80%;
	overflow-x: hidden;
	overflow-y: scroll;
}
.message-scroll-container {
	height: 100%;
	/* box-sizing: border-box;
  padding: 0 20rpx; */
}
.message-list {
	width: 100%;
	box-sizing: border-box;
	padding: 0 20rpx;
	/* display: flex;
  flex-direction: column; */
}
.message-item {
	width: 100%;
	/* height: 36rpx; */
	/* padding: 0 20rpx; */
	padding-bottom: 10rpx;
	display: flex;
	flex-direction: row;
}
.message-item .user-name {
	width: 20%;
	color: #2483ff;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.user-name.mine {
	color: #ff7424;
}
.message-item .separate {
	padding: 0 5px;
	color: #fff;
}
.message-item .message-content {
	word-wrap: break-word;
	word-break: break-all;
	padding-left: 20rpx;
	position: relative;
	max-width: 80%;
	box-sizing: border-box;
}
.message-content::after {
	content: ':';
	position: absolute;
	left: 0;
	top: 0;
}
.message-panel-bottom {
	width: 100%;
	height: 50rpx;
	box-sizing: border-box;
	padding: 0 20rpx 0;
	margin-top: 20rpx;
	display: flex;
	flex-direction: row;
}
.message-input-container {
	flex-grow: 1;
}
.message-input-container .message-input {
	font-size: 12px;
	padding-left: 20rpx;
	border-radius: 10rpx;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.1);
}
.message-send-btn .btn {
	margin-right: 0;
	height: 50rpx;
	min-height: 50rpx;
	line-height: 50rpx;
}

.none,
.view-container.none,
.template-grid .view-container.none,
.template-1v1 .view-container.none {
	display: none !important;
}
</style>
