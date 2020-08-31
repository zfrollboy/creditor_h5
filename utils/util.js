const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
const alert = function(modal) {
	uni.showModal({
		title: modal.title || "",
		content: modal.content || "",
		confirmColor: '#FF6634',
		confirmText: "我知道了",
		showCancel: false,
		success: modal.success || function() {

		}
	})
}

function formatMoney(number) {
	number = number || 0;
	var negative = number < 0 ? "-" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(2), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return "￥" + negative + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") + (2 ? "." +
		Math.abs(number - i).toFixed(2).slice(2) : "")
};
module.exports = {
	formatTime: formatTime,
	alert: alert,
	formatMoney
}
