<template>
	<view>
		<!-- template 1v1 -->
		<template name="1v1">
			<view class="template-1v1">
				<view
					v-for="(item, index) in streamList"
					:key="item.streamID"
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
		</template>
	</view>
</template>

<style>
@import url('./1v1.css');
</style>
