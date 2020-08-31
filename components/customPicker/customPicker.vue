<template>
	<view>
		<view class="custom-picker" @click="openPicker" :style="{'text-align':textAlign}">
			<text v-if="value >= 0">{{ !!name && list[value][name] ? list[value].name : list[value] }}</text>
			<text v-else class="holder">{{ placeholder }}</text>
		</view>
		<view class="picker-confrim-bg" v-if="showPicker">
			<view class="picker-confrim" :class="{ 'showConfirm': showPicker }">
				<view class="confirm-tit">
					<text @click="cancel">取消</text>
					<text @click="confirm">确定</text>
				</view>
				<scroll-view scroll-y="true" class="pick-list">
					<radio-group @change="radioChange">
						<label class="pick-list-i" v-for="(item, index) in list" :key="index">
							<text>{{ !!name && item[name] ? item[name] : item }}</text>
							<radio :value="index.toString()" :checked="index === value" color="#ff6634"></radio>
						</label>
					</radio-group>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default:()=>{
				return []
			}
		},
		placeholder: {
			type: String,
			default: '请选择'
		},
		value: {
			type: [Number,String],
			default: -1
		},
		textAlign: {
			type: String,
			default: 'right'
		},
		name: {
			type: String
		}
	},
	data() {
		return {
			showPicker: false,
			iptVal: -1
		};
	},
	methods: {
		openPicker() {
			let routes = getCurrentPages();
			let currentPage = routes[routes.length - 1].route;
			if (currentPage.indexOf('bandCard/create') > -1 || this.list.length > 0) {
				this.showPicker = true;
			} else {
				uni.navigateTo({
					url: '/pages/bandCard/create/create'
				});
			}
		},
		cancel() {
			this.showPicker = false;
			this.$emit('cancel');
		},
		confirm() {
			let val = this.iptVal > -1 ? this.iptVal : this.value;
			this.showPicker = false;
			this.value = val;
			this.$emit('confirm', { value: this.list[this.value], index: this.value });
		},
		radioChange(e) {
			this.iptVal = parseInt(e.detail.value);
		}
	}
};
</script>

<style scoped lang="scss">
/* components/customPicker/customPicker.wxss */
.custom-picker {
	position: relative;
	height: 100%;
	font-size: 32rpx;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 100%;
	text-align: right;
	line-height: 60rpx;
	padding-right: 30rpx;
}
.holder {
	color: #999;
}
.custom-picker text::after {
	content: '';
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAArNJREFUeAHt3LFu2lAUgOGQSo1YGNKlL0AXNuAFIkVIHTt1yMILZM8WZe+WvcpSKVuydWhfoBWMDBXq2DWDF0gHnHMqHEUIIxAFn3PubwkZbCD299sQ5Vo5OGBCAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAgZ0I1Hbyrhu+6Wg0ej2ZTK7kZf35S2/q9fplq9X6u+FbuXv6oYUtnuNfyLa8nd8uptPp/Xg8PrKwfbvcBhMBZAf7izuZ5/n7LMvuokewEmDR/9/jFCJYCXCztIAsjB7BRAD9wq3Val9TjGDityCF1896/czXI74shEZqNBofms3mY9lzvC03E0DhUoxgKkCKEcwFSC2CyQApRTAbIJUIpgOkEMF8gOgRXASIHMFNgKgRXAWIGMFdgGgRXAaIFMFtgCgRXAeIEMF9AO8RQgTwHMHEiJgCbjvpII0O1qwxsna97c/6n68PcwYUKOsM6sgQ6Bu55uiheE2V8zBnQIGoZ4KcBbfF42VzueboeNnyKpaFCzAcDj/OZrPPKzB/tdvt3yvW73VVqACKL4P6X0TwVYliJmfHmdzykvV7XxwmwDr4otvrdDrDvSuv+IEhvoTXxe92uz9WWFSyyn0Az/ha3HUA7/iuA0TAdxsgCr7LAJHw3QWIhu8qQER8NwGi4rsIEBnffIDo+KYDpIBvNkAq+CYDpIRvLkBq+KYCpIhvJsBgMDiRjfkmt9KRLFnXs/j3fEXcZrIyIvZJdiI5fA1nIoCM0b4rOYoyWR7yyC/210QA2ZifxQa9mIfH1301EUDOgHO5/Snw5/dDH/nP+1rcqXouV7Q15H9FnOp2yCWG3+UCKz0DmBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABdwJPpVfm3N6q7D8AAAAASUVORK5CYII=);
	display: block;
	position: absolute;
	width: 48rpx;
	height: 48rpx;
	background-size: cover;
	background-position: center;
	top: 50%;
	transform: translateY(-50%);
	bottom: 0;
	right: -10rpx;
}
.picker-confrim-bg {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vw;
	height: 100vh;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.3);
}
.picker-confrim {
	width: 100%;
	background-color: #fff;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 45%;
	z-index: 1001;
}
.confirm-tit {
	height: 88rpx;
	background-color: #f8f8f8;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
}
.confirm-tit text {
	color: #999999;
	font-size: 32rpx;
}
.confirm-tit text + text {
	color: $themeColor;
}
.pick-list {
	width: 100%;
	height: 100%;
}
.pick-list radio-group {
	padding: 60rpx 30rpx;
	height: 100%;
}
.pick-list-i {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	height: 88rpx;
}
.pick-list-i text {
	flex: 1;
}
</style>
