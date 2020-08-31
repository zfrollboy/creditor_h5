<template>
	<view><rich-text :nodes="mallInfo"></rich-text></view>
</template>

<script>
import { getAgreement } from '../../utils/request/api';
export default {
	data() {
		return {
			mallInfo: ''
		};
	},
	methods: {
		getAgreement() {
			getAgreement().then(res => {
				if (res.code == 200) {
					this.mallInfo = res.data.h5shop.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}
	},
	onLoad() {
		this.getAgreement();
	}
};
</script>

<style></style>
