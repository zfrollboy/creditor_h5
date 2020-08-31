// const baseUrl = "https://bang.yolaile.com.cn";
const baseUrl = "http://testbang.yolaile.com.cn";
// const baseUrl = "/zq";
import axios from "axios"
const http = ({
	url = '',
	param = {},
	...other
} = {}) => {
	let tokenUid = JSON.stringify({ // 判断用户
		uid: uni.getStorageSync('uid'),
		token: uni.getStorageSync('token')
	})
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		uni.request({
			url: getUrl(url),
			data: param,
			header: {
				'content-type': 'application/json',
				'CLIENT': tokenUid
			},
			...other,
			complete: (res) => {
				uni.hideLoading()
				if (res.statusCode >= 200 && res.statusCode < 300) {
					if (res.data.errorCode == 0) {
						resolve(res)
					} else {
						resolve(res);
						errMessage(getUrl(url), res.data.errorMessage, res)
					}
				} else {
					errMessage(getUrl(url), res)
					uni.showToast({
						title: '请求失败，请稍后重试',
						icon: "none"
					})
					reject(res)
				}
			},
			fail: () => {
				uni.showToast({
					title: '请求失败，请稍后重试',
				})
			}
		})
	})
}
let service = axios.create({
	baseURL: baseUrl, // api的base_url
	timeout: 15000 // 请求超时时间
})
service.interceptors.request.use(config => {
	uni.showLoading({
		title: '加载中...',
		mask: true
	})
	let tokenUid = JSON.stringify({ // 判断用户
		uid: uni.getStorageSync('uid'),
		token: uni.getStorageSync('token')
	})
	config.headers["CLIENT"] = tokenUid
	return config
}, error => {
	return Promise.reject(error)
})
service.interceptors.response.use(res => {
	uni.hideLoading()
	if (res.status >= 200 && res.status < 300) {
		return res
	} else {
		uni.showToast({
			title: '请求失败，请稍后重试',
			icon: "none"
		})
	}
	return res
}, error => {	
	uni.hideLoading()
	return Promise.reject(error.response)
})


const errMessage = (url, message, res = null) => {
	// console.log("请求地址：" + url, "错误信息：" + message, re``s);
}

const getUrl = (url) => {
	if (url.indexOf('://') == -1) {
		url = baseUrl + url;
	}
	return url
}

// get方法
const _get = (url, param = {}) => {
	return service({
		url,
		params: param,
		method: "get"
	})
}

const _post = (url, param = {}) => {
	return service({
		url,
		data: param,
		method: 'post'
	})
}

const _put = (url, param = {}) => {
	return http({
		url,
		param,
		method: 'put'
	})
}

const _delete = (url, param = {}) => {
	return http({
		url,
		param,
		method: 'put'
	})
}
module.exports = {
	baseUrl,
	_get,
	_post,
	_put,
	_delete
}
