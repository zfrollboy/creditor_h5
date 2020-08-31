<template>
	<view><web-view :src="pdfUrl"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			pdfUrl: '/hybrid/html/web/viewer.html?file=',
			from: ''
		};
	},
	onLoad(options) {
		if (options.url) {
			this.pdfUrl += options.url;
		}
	}
};
</script>

<style></style>
