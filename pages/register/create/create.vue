<template>
	<view>
		<view class="page">
			<view class="top-tips" v-if="showTips">
				<text>{{ tips }}</text>
			</view>
			<!-- <view class="desc-content">这是一个操作规则及指引...请确保登记本人{{keyword}}。这是一个操作规
		则及指引...请确保登记本人{{keyword}}。</view> -->

			<form class="section" @submit="submit">
				<view class="section-title">{{ keyword }}信息</view>
				<view class="form-group">
					<view class="label required">投资机构</view>
					<picker @change="companyChange" mode="selector" :value="typeIndex" name="company" :range="companyList" range-key="name">
						<view class="picker">{{ company }}</view>
					</picker>
				</view>
				<view class="form-group" v-if="showCompanyIpt">
					<view class="label required">机构名称</view>
					<input placeholder-class="input-pls" type="text" placeholder="请输入机构名称" name="companyName" />
				</view>
				<view class="form-group">
					<view class="label required">合同编号</view>
					<input @focus="inputTips" type="text" @blur="handlerBlur" data-name="contractNo" placeholder-class="input-pls" placeholder="请输入合同编号" name="contractNo" />
				</view>
				<view class="form-group">
					<view class="label required">出借本金</view>
					<input @focus="inputTips" type="number" @blur="handlerBlur" data-name="loanAmount" placeholder-class="input-pls" placeholder="请输入原合同的出借本金" name="loanAmount" />
				</view>
				<view class="form-group">
					<view class="label required">未兑付本金</view>
					<input
						@focus="inputTips"
						type="number"
						@blur="handlerBlur"
						data-name="osAmount"
						placeholder-class="input-pls"
						:placeholder="'请输入该笔' + keyword + '的未兑付本金'"
						name="osAmount"
					/>
				</view>
				<view class="gray-margin-b"></view>
				<view class="section-title">{{ keyword }}信息</view>
				<view class="form-group">
					<view class="label required">出借期数</view>
					<picker @change="periodsChange" mode="selector" name="loanPeriods" :range="periodsRange">
						<view class="picker">{{ loanPeriods }}</view>
					</picker>
				</view>

				<view class="form-group">
					<view class="label required">合同签约日</view>
					<picker @change="dateChange" mode="date" name="contractDate">
						<view class="picker">{{ contractDate }}</view>
					</picker>
				</view>

				<view class="form-group">
					<view class="label">债务方名称</view>
					<input
						@focus="inputTips"
						type="text"
						@blur="handlerBlur"
						data-name="debtName"
						placeholder-class="input-pls"
						:placeholder="'请输入该笔' + keyword + '的债务方名称'"
						name="debtName"
					/>
				</view>

				<view class="form-group">
					<view class="label">债务方电话</view>
					<input
						@focus="inputTips"
						type="number"
						@blur="handlerBlur"
						data-name="debtPhone"
						placeholder-class="input-pls"
						:placeholder="'请输入该笔' + keyword + '方电话'"
						name="debtPhone"
					/>
				</view>

				<view class="gray-margin-b"></view>

				<view class="upload-wrap">
					<text>上传合同</text>
					<view class="upload-li">
						<view v-for="(item, idx) in imageList" :key="idx">
							<image :src="item" :data-src="item" @click="previewImage"></image>
							<image :data-index="idx" @click="delImg" class="delImg" src="/static/icon-关闭@2x.png"></image>
						</view>
						<view class="upload-img" v-if="imageList.length < maxImgCount" @click="chooseImage">
							<image src="/static/xiangji.png"></image>
							<text>上传图片</text>
							<text>（最多{{ maxImgCount }}张）</text>
						</view>
					</view>
				</view>

				<view class="fixed-bottom form-bottom">
					<!-- <view class="tips-text">
				<text>点击提交代表您知晓并同意</text>
				<text class="active-text">《xx协议》</text>
			</view> -->
					<button form-type="submit" class="lg-btn" :loading="submitLoading" :disabled="submitLoading" hover-class="btn-active">下一步</button>
				</view>
			</form>
			<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent"></auth-login>
		</view>
	</view>
</template>

<script>
import util from '../../../utils/util';
import { getIndex, createBondRegister } from '../../../utils/request/api';
import { authMixins } from '../../../mixins/authMixins.js';
const rules = {
	company: {
		name: '投资公司',
		required: true
	},
	companyName: {
		name: '公司名称',
		required: true
	},
	contractNo: {
		name: '合同编号',
		rules: /^[A-Za-z0-9]+$/,
		message: '只可输入数字、英文字母',
		required: true
	},
	loanAmount: {
		name: '出借金额',
		rules: /^[1-9][0-9]*$/,
		message: '只可输入数字，不可以0开头',
		required: true
	},
	osAmount: {
		name: '未兑付金额',
		rules: /^[1-9][0-9]*$/,
		message: '只可输入数字，不可以0开头',
		required: true
	},
	loanPeriods: {
		name: '出借期数',
		required: true
	},
	contractDate: {
		name: '合同签约日',
		required: true
	},
	debtName: {
		name: '债务方名称',
		rules: /^[\u4e00-\u9fa5A-Za-z]+$/,
		message: '只可输入中文、英文字母',
		required: false
	},
	debtPhone: {
		name: '债务方电话',
		rules: /^((1)\d{10}|\d{3}-\d{8}|\d{4}-\d{7}|\d{7,8})$/,
		message: '只可输入数字，最多12位',
		required: false
	}
}; // pages/register/create/create.js

export default {
	data() {
		return {
			keyword: uni.getStorageSync('keyword'),
			isLoginShow: true,
			typeIndex: '',
			tips: '只可输入数字、英文字母',
			showTips: false,
			companyList: [],
			showCompanyIpt: false,
			company: '',
			loanPeriods: '',
			contractDate: '',
			submitLoading: false,
			periodsRange: [],
			imageList: [],
			maxImgCount: 9
		};
	},
	mixins: [authMixins],
	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		if (options.code) {
			this.accountAuth(
				options.code,
				() => {
					this.initCompanyList();
				},
				err => {
					this.isLoginShow = false;
				}
			);
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.initCompanyList();
			} else {
				this.setData({
					isLoginShow: false
				});
			}
		}
		this.setPeriodsRange();
		this.setData({
			keyword: uni.getStorageSync('keyword')
		});
		uni.setNavigationBarTitle({
			title: `登记${uni.getStorageSync('keyword')}`
		});
	},
	methods: {
		initCompanyList() {
			getIndex().then(res => {
				let arr = res.data.organ;
				arr.push({
					name: '其他',
					id: 1000
				});
				this.setData({
					companyList: arr
				});
			});
		},

		//初始化出借期数 1-36
		setPeriodsRange() {
			let arr = [];

			for (let i = 1; i <= 36; i++) {
				arr.push(i);
			}

			this.setData({
				periodsRange: arr
			});
		},

		//上传图片
		chooseImage() {
			uni.chooseImage({
				count: this.maxImgCount,
				success: res => {
					console.log(res);
					if (this.imageList.concat(res.tempFilePaths).length > this.maxImgCount) {
						uni.showModal({
							content: `图片最多传${this.maxImgCount}张哦`,
							showCancel: false
						});
					} else {
						var length = res.tempFilePaths.length; //总数

						var count = 0;
						uni.showLoading({
							title: '上传图片中...'
						});
						// #ifdef MP-WEIXIN
						this.uploadMuch(res.tempFilePaths, count, length);
						// #endif
						// #ifdef H5
						this.getBase64(res.tempFiles, count, length);
						// #endif
					}
				}
			});
		},
		getBase64(imgPaths, count, length) {
			console.log(count)
			let reader = new FileReader();
			reader.readAsDataURL(imgPaths[count]);
			reader.onloadend = () => {
				this.imageList=this.imageList.concat(reader.result)
				count++; //下一张
				if (count == length) {
					uni.hideLoading();
				} else {
					//递归调用，上传下一张
					this.getBase64(imgPaths, count, length);
				}
			};
		},
		uploadMuch(imgPaths, count, length) {
			var $this = this;
			uni.getFileSystemManager().readFile({
				filePath: imgPaths[count],
				encoding: 'base64',
				success: function({ data }) {
					let startIndex = imgPaths[count].lastIndexOf('.');
					let extname = imgPaths[count].substring(startIndex + 1, imgPaths[count].length).toLowerCase();
					let base64Header = 'data:image/*;base64,';
					$this.setData({
						imageList: $this.imageList.concat(base64Header.replace(/\*/g, extname) + data)
					});
					count++; //下一张

					if (count == length) {
						uni.hideLoading();
					} else {
						//递归调用，上传下一张
						$this.uploadMuch(imgPaths, count, length);
					}
				}
			});
		},

		previewImage(e) {
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: this.imageList
			});
		},

		//删除图片
		delImg(event) {
			this.imageList.splice(event.target.dataset.index, 1);
			this.setData({
				imageList: this.imageList
			});
		},

		submit(e) {
			let result = e.detail.value;

			for (const key in result) {
				let name = rules[key].name || '';

				if (rules[key].required && (result[key] === null || result[key] === '')) {
					uni.showToast({
						title: name + ':必填项不能为空',
						icon: 'none'
					});
					return;
				} else if (key == 'company' && this.companyList[result.company].id == 1000 && result['companyName'] == '') {
					name = '公司名称';
					uni.showToast({
						title: name + ':必填项不能为空',
						icon: 'none'
					});
					return;
				} else if (result[key] !== null && result[key] !== '' && rules[key].rules && !rules[key].rules.test(result[key])) {
					uni.showToast({
						title: name + ':' + rules[key].message || '验证失败',
						icon: 'none'
					});
					return;
				} else if (this.imageList.length < 1) {
					uni.showToast({
						title: '请上传合同',
						icon: 'none'
					});
					return;
				}
			}

			if (Number(result['osAmount']) > Number(result['loanAmount'])) {
				uni.showToast({
					title: '未兑付本金不可高于出借本金',
					icon: 'none'
				});
				return;
			}

			this.createDebt(result);
		},

		createDebt(result) {
			this.setData({
				submitLoading: true
			});
			let data = {};
			let organId = this.companyList[result.company].id;
			data['organ_id'] = organId;

			if (organId == 1000) {
				data['organ_name'] = result.companyName;
			}

			data['contruct_no'] = result.contractNo;
			data['lend_price'] = result.loanAmount;
			data['owe_price'] = result.osAmount;
			data['period'] = Number(result.loanPeriods) + 1;
			data['sign_time'] = result.contractDate;
			data['name'] = result.debtName;
			data['phone'] = result.debtPhone;
			data['contruct'] = JSON.stringify(this.imageList);
			createBondRegister(data)
				.then(res => {
					this.setData({
						submitLoading: false
					});

					if (res.code == 200) {
						util.alert({
							title: this.keyword + '登记完成!',
							content: '我们会在1-3个工作日内对您的' + this.keyword + '信息进行审核',
							success: function() {
								uni.navigateBack({
									delta: 1
								});
							}
						});
					} else if (res.code == 99) {
						this.setData({
							isLoginShow: false
						});
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true
						});
					}
				})
				.catch(err => {
					this.setData({
						submitLoading: false
					});
				});
		},

		companyChange(e) {
			//选择了最后一项其他,提示用户输入投资机构名称
			if (e.detail.value == this.companyList.length - 1) {
				this.setData({
					showCompanyIpt: true
				});
			} else {
				this.setData({
					showCompanyIpt: false
				});
			}

			this.setData({
				company: this.companyList[e.detail.value].name
			});
		},

		periodsChange(e) {
			this.setData({
				loanPeriods: this.periodsRange[e.detail.value]
			});
		},

		dateChange(e) {
			this.setData({
				contractDate: e.detail.value
			});
		},

		//输入时弹出输入规则
		inputTips(e) {
			let name = e.target.dataset.name;
			this.setData({
				tips: rules[name].message,
				showTips: true
			});
		},

		handlerBlur() {
			this.setData({
				showTips: false,
				tips: ''
			});
		},

		onMyEvent: function(e) {
			var that = this;
			that.setData(
				{
					isLoginShow: e.isLoginShow
				},
				function() {
					if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
						this.initCompanyList();
					}
				}
			);
		}
	}
};
</script>
<style>
.desc-content {
	padding: 24rpx 20rpx 16rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 36rpx;
	border-bottom: 20rpx solid rgba(248, 248, 248, 1);
}

.form-bottom {
	position: relative;
	padding-top: 170rpx;
}

.tips-text {
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	margin-bottom: 20rpx;
	text-align: center;
	padding: 0 30rpx;
}

.tips-text .active-text {
	color: #fe6634;
}
.upload-wrap {
	padding: 24rpx 0 24rpx 30rpx;
	font-size: 32rpx;
	margin-bottom: 170rpx;
}
.upload-li {
	display: flex;
	flex-wrap: wrap;
}
.upload-li view {
	margin-top: 20rpx;
	position: relative;
	margin-right: 28rpx;
}
.upload-li .delImg {
	position: absolute;
	right: -26rpx;
	top: -26rpx;
	height: 52rpx;
	width: 52rpx;
}
.upload-li image {
	width: 212rpx;
	height: 212rpx;
}
.upload-li .upload-img {
	width: 212rpx;
	height: 212rpx;
	background-color: #f8f8f8;
	font-size: 20rpx;
	color: #999;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.upload-li .upload-img image {
	width: 60rpx;
	height: 60rpx;
}
.upload-li .upload-img text {
	margin-top: 8rpx;
}
.fixed-bottom {
	position: fixed;
	padding-top: 0;
}
.top-tips {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	width: 100vw;
	background-color: rgba(0, 0, 0, 0.6);
	line-height: 66rpx;
	padding: 8rpx 30rpx;
	z-index: 999;
}
.top-tips text {
	font-size: 28rpx;
	color: #fff;
}
</style>
