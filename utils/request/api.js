const request = require('./request.js');
const app = getApp();

// 获取债权类型和债权所属机构
const getIndex = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._get('/api/index', param).then(res => {
			resolve(res.data)
		})
	})
}
// 开通债权人服务
const serviceStart = (param) => {
	return new Promise((resolve, reject) => {
		request._post('/api/serviceStart', param).then(res => {
			resolve(res.data)
		})
	})
}
// 债权协议
const getAgreement = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._get('/api/agreement', param).then(res => {
			resolve(res.data)
		})
	})
}
// 确认协议
const agreementDo = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._post('/api/agreementDo', param).then(res => {
			resolve(res.data)
		})
	})
}
// 登记债权
const createBondRegister = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/bondRegisterAdd', param).then(res => {
			resolve(res.data)
		}).catch(err => {
			reject(err)
		})
	})
}
//我登记的债权
const getMyBond = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._post('/api/myBondRegister', param).then(res => {
			resolve(res.data)
		})
	})
}
//发起债权收购
const createTransfer = (param) => {
	return new Promise((resolve, reject) => {
		request._post('/api/bondTransferAdd', param).then(res => {
			resolve(res.data)
		})
	})
}
//我的债权出让记录
const getMyTransfer = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._post('/api/myBondTransfer', param).then(res => {
			resolve(res.data)
		})
	})
}
//债权人服务中心
const getMember = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._post('/api/member', param).then(res => {
			resolve(res.data)
		})
	})
}
//获取平台银行卡信息
const getBankCardList = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._get('/api/getBankCard', param).then(res => {
			resolve(res.data)
		})
	})
}
//添加我的银行卡
const bankCardAdd = (param) => {
	return new Promise((resolve, reject) => {
		request._post('/api/bankCardAdd', param).then(res => {
			resolve(res.data)
		})
	})
}
//我的银行卡
const getMyBankCard = () => {
	let param = {}
	return new Promise((resolve, reject) => {
		request._get('/api/myBankCard', param).then(res => {
			resolve(res.data)
		})
	})
}
//删除银行卡
const delBankCard = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/bankCardDel', param).then(res => {
			resolve(res.data)
		})
	})
}
//商品列表
const getGoodsList = (param) => {
	return new Promise((resolve, reject) => {
		request._get('/api/goodsList', param).then(res => {
			resolve(res.data)
		})
	})
}
//获取分销下级人员信息
const getShareList = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/shareList', param).then(res => {
			resolve(res.data)
		})
	})
}
//债权说明
const getExplain = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._get('/api/explain', param).then(res => {
			resolve(res.data)
		})
	})
}
//帮帮值明细
const getRegDetail = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/devoteList', param).then(res => {
			resolve(res.data)
		})
	})
}
//获取bizToken
const getBizToken = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/getBzi', param).then(res => {
			resolve(res.data)
		})
	})
}
//获取预览合同
const preAgreement = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/test4401', param).then(res => {
			resolve(res.data)
		})
	})
}
//发送短信
const sendSms = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/test3101', param).then(res => {
			resolve(res.data)
		})
	})
}
//验证短信
const checkSmsCode = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/test3102', param).then(res => {
			resolve(res.data)
		})
	})
}
//签署合同
const signAgreement = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/test3208', param).then(res => {
			resolve(res.data)
		})
	})
}
//实人验证成功
const authUpdate = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/authUpdate', param).then(res => {
			resolve(res.data)
		})
	})
}
//获取实名认证姓名
const authName = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/authName', param).then(res => {
			resolve(res.data)
		})
	})
}
//合同签署完成
const contractFinsh = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/contractFinish', param).then(res => {
			resolve(res.data)
		})
	})
}
//获取合同变量
const getContractVal = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/contractVal', param).then(res => {
			resolve(res.data)
		})
	})
}
//微信公众号授权认证
const accountAuth = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._get('/api/oauthCallback', param).then(res => {
			resolve(res.data)
		})
	})
}
//H5人脸验证
const h5Auth = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/h5Auth', param).then(res => {
			resolve(res.data)
		})
	})
}
//验证核验结果
const checkH5Auth = (param = {}) => {
	return new Promise((resolve, reject) => {
		request._post('/api/checkH5Auth', param).then(res => {
			resolve(res.data)
		})
	})
}
module.exports = {
	getIndex,
	getAgreement,
	createBondRegister,
	getMyBond,
	createTransfer,
	getMyTransfer,
	getMember,
	getBankCardList,
	bankCardAdd,
	getMyBankCard,
	serviceStart,
	agreementDo,
	getGoodsList,
	getShareList,
	getExplain,
	getRegDetail,
	delBankCard,
	getBizToken,
	preAgreement,
	sendSms,
	checkSmsCode,
	signAgreement,
	authUpdate,
	authName,
	contractFinsh,
	getContractVal,
	accountAuth,
	h5Auth,
	checkH5Auth
}
