<template>
	<view>
		<view id="content" class="content">
			<view class="content-title">债权转让协议</view>
			<view>编号：【{{ contract.order_no }}】</view>
			<view>
				【审慎阅读】债权人在点击同意本协议之前，应当认真阅读本协议。
				<text class="under-line bold">
					请债权人务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗体下划线标识，债权人应重点阅读。
				</text>
				如债权人对协议有任何疑问，可向客服咨询。
			</view>
			<view>
				【签约动作】当债权人按照页面提示阅读并同意本协议后，即表示债权人已充分阅读、理解并接受本协议的全部内容。
				<text class="under-line bold">
					债权人不应以未阅读本协议的内容等理由，主张本协议无效，或要求撤销本协议。阅读本协议的过程中，如果债权人不同意本协议或其中任何条款约定，债权人应立即停止转让。
				</text>
			</view>
			<view>
				【协议生效】债权人明确知悉，
				<text class="under-line bold">债权人点击同意确认仅意味着本协议成立，但尚未生效，本协议以约定的条件达成为生效要件。</text>
			</view>
			<view class="bold">一、协议主体与范围</view>
			<view class="indent">
				1.1债权人，姓名【{{ contract.name }}】，身份证号【{{ contract.id_card }}】，为【{{
					contract.organ_name
				}}】平台上的出借人，债权人根据借款协议向前述平台上相应的借款人提供了借款。
			</view>
			<view class="indent">
				1.2本协议由债权人与【北京桥炎咨询管理有限公司】（以下协议中亦称为“受让方”）签署；本协议为债权人和受让方之间具有法律意义的文件，债权人和受让方将同时受到本协议条款的约束。
			</view>
			<view class="bold">二、授权审核债权</view>
			<view class="indent">2.1债权人在此授权受让方对第3条中转让债权的真实性、有效性等进行审核。</view>
			<view class="indent">
				2.2债权人明确知悉，
				<text class="under-line bold">受让方有权根据审核情况，选择接受或拒绝债权人的转让申请。</text>
			</view>
			<view class="indent">
				2.3债权人明确知悉，本协议自
				<text class="under-line bold">受让方通知转让债权审核通过之日起生效。</text>
			</view>
			<view class="bold">三、转让债权</view>
			<view class="indent bold">3.1转让债权</view>
			<view class="indent">
				1)债权人同意将在【{{ contract.organ_name }}】平台的【{{ contract.price }}】元（借款本金）的债权转让给受让方，受让方同意受让该债权。具体转让债权信息如下：
			</view>
			<view class="indent">1) 出借合同编号：【{{ contract.register_contruct_no }}】；</view>
			<view class="indent">2) 出借人名称／姓名：【{{ contract.name }}】；</view>
			<view class="indent">3) 借款本金金额：【{{ contract.lend_price }}元】、本次转让债权的本金金额：【{{ contract.price }}元】。</view>
			<view class="indent">3.2债权人应按页面提示上传身份证复印件、借款协议、有关债权权属等相关文件，该文件作为本协议的附件，与本协议具有同等法律效力。</view>
			<view class="indent">3.3债权人转让第3.1条所述的债权内容包括但不限于：</view>
			<view class="indent">1) 对债权享有的（现时的和未来的、既有的和或有的）全部所有权和相关权益；</view>
			<view class="indent">2) 获得转让债权所对应的本金及相应的全部违约金、滞纳金、赔偿金（如有）等的权利；</view>
			<view class="indent">3) 与实现债权相关的全部权利，包括但不限于通过诉讼、仲裁、强制执行等程序实现债权的权利；</view>
			<view class="indent">4) 对债权进行处分的权利；</view>
			<view class="indent">5) 享有与债权人相关的附属担保权利；</view>
			<view class="indent">6) 基于转让债权所产生的其他权利。</view>
			<view class="indent bold">3.4转让价款</view>
			<view class="indent">基于本协议，受让方为了从债权人处受让第3.1条项下的债权，由受让方向债权人支付人民币【{{ contract.price }}】元。</view>
			<view class="indent">3.5债权人同意受让方将前述债权转让款支付至其如下指定账户：</view>
			<view class="indent">收款人姓名：【{{ contract.name }}】</view>
			<view class="indent">支付宝账户号：【{{ contract.card_num }}】</view>
			<view class="indent">3.6 手续费</view>
			<view class="indent">受让方向债权人汇款时，如有手续费的，该费用由债权人承担，受让方有权在转让款中直接扣除该手续费。</view>
			<view class="indent">3.7【债权的交割】</view>
			<view class="indent">双方一致同意，本协议生效之日为债权交割日；自本合同生效之日起，债权人将以下权利均转让给受让方：</view>
			<view class="indent">1) 债权人对于债权的现时的和未来的、现实的以及或有的全部权利和相关权益；</view>
			<view class="indent">2) 债权被出售、转让或者被以其他方式处置所产生的收入；</view>
			<view class="indent">3) 请求、起诉、收回、接受与债权相关的全部收入款项的权利；</view>
			<view class="indent">4) 来自与债权相关的承诺的利益以及行使与债权相关的全部权利和法律救济权利。</view>
			<view class="indent">3.8【债权转让的通知】</view>
			<view class="indent">双方确认，双方应在本协议签署后【3】个工作日内将债权转让事宜以书面方式通知中借款人及平台。受让方向借款人主张债权的，债权人应给予相应的协助与配合。</view>
			<view class="bold">四、债权人对债权的陈述与保证</view>
			<view class="indent">
				4.1债权人向受让方披露的本协议项下的债权的任何信息均是准确和真实、完整的。债权人向受让方提供的有关债权权属等法律文件均为合法和真实的。债权人确认不存在任何变化、发展或事件会使本协议项下债权的任何信息不真实、不完整或有误导性。
			</view>
			<view class="indent">4.2债权人对债权享有完整的、合法的、有效的权利。</view>
			<view class="indent">4.3债权人完全有权出售、转让和交付债权，不存在对债权交易本身的限制，且债权人已就债权的转让获得了一切必要的同意、批准或授权。</view>
			<view class="indent">4.4除本协议或其他交易文件另有明确规定外，债权的任何一部分或全部均不存在任何质权或者第三方的权利主张。</view>
			<view class="indent">4.5债权不存在任何未向受让方披露的可能对受让方在本协议或其他交易文件项下的权利造成不利影响的瑕疵、缺陷或风险。</view>
			<view class="indent">
				4.6
				<text class="bold under-line">
					自本协议签署之日起，未经受让方书面同意，债权人无权再以债权进行融资、无权再转让债权、无权再对债权进行任何其他处置，且无权再自债务人或其指定第三方或相关方处收取债权相关的任何款项。
				</text>
			</view>
			<view class="bold">五、违约责任</view>
			<view class="indent">
				任何一方未履行或未适当履行其在本协议项下的义务或承诺、保证，均视为该方违约，违约方应向守约方支付本协议项下转让价款金额的【30】%作为违约金，且还应赔偿因其违约而对守约方造成的全部损失
				(包括但不限于守约方因此支付的律师费用、保全费用、仲裁费用、诉讼费用、公证费用及执行费用等)。同时，守约方还有权要求违约方采取包括但不限于实际履行、赔偿损失等补救措施。
			</view>
			<view class="bold">六、协议解除</view>
			<view class="indent">
				6.1受让方审核认定本协议项下转让债权存在虚假（包括但不限于债权类型、所属机构等债权相关信息）、不完整的，受让方有权直接解除本协议，尚未支付的转让价款无需再支付，债权人应于通知解除之日起【5】个工作日内向受让方返还受让方已支付的款项，并自受让方支付转让价款之日至债权人实际还款日之止，按同期全国银行间同业拆借中心公布的贷款市场报价利率向受让方支付资金占用费。
			</view>
			<view class="indent">
				6.2因债权虚假或因债权自身原因导致债权被司法机关认定无效的，受让方可以直接解除本协议，债权人应于通知解除之日起【5】个工作日内向受让方返还债权转让价款，并自受让方支付转让价款之日至债权人实际还款日之止，按同期全国银行间同业拆借中心公布的贷款市场报价利率向受让方支付资金占用费。
			</view>
			<view class="bold">七、通知或送达</view>
			<view class="indent">
				7.1债权人同意以其身份证上的户籍所在地为送达地址，适用于本协议相关的各类通知、协议、文书的送达，包括但不限于协议履行期间各类通知、协议等文件的送达，以及协议发生纠纷时相关文件和法律文书的送达，同时包括争议进入仲裁、民事诉讼程序后一审、二审、再审和执行程序及其他程序中相关文件和法律文书的送达。
			</view>
			<view class="indent">
				7.2
				债权人需变更本协议确认的送达地址的，应及时通过邮寄方式(快递或EMS)通知协议受让方；债权人在协议争议阶段或协议争议进入执行阶段变更本协议确认的送达地址的，应向法院、仲裁机构履行送达地址变更通知义务。
			</view>
			<view class="indent">7.3 受让方按第7.2条所述方式履行变更通知义务后，以其变更后的送达地址为有效送达地址，否则本协议确认的送达地址仍为有效送达地址。</view>
			<view class="indent">
				7.4
				因任何一方提供或确认的地址不准确、送达地址变更后未及时按第7.2条所述方式履行通知义务、该方或有权签收人拒绝签收或长期不自取等非寄件人原因，导致协议、通知、函件、法律文书等各类文件未能被该方实际接收的，邮寄送达的，以文件退回之日为送达之日；邮寄的文件被他人代收的，代收人签收之日视为送达之日；直接送达的，以送达人当场在送达回证上记明情况之日为送达之日。
			</view>
			<view class="indent">7.5法院可直接邮寄送达至本协议确认的送达地址，即使当事人未能收到法院邮寄送达的文书，由于本协议约定，也视为送达。</view>
			<view class="bold">八、法律管辖适用及其他</view>
			<view class="indent">8.1本协议之订立、生效、解释、修订、补充、终止、执行与争议解决均适用中华人民共和国大陆地区法律；如法律无相关规定的，参照商业惯例及/或行业惯例。</view>
			<view class="indent">
				8.2凡因本协议之订立、解释与履行所产生的全部争议，由受让方与债权人协商解决。
				<text class="bold under-line">协商不成时，任何一方均可向受让方住所地有管辖权的人民法院提起诉讼。</text>
			</view>
			<view class="bold">九、其他</view>
			<view class="indent">9.1本协议履行过程中发生有关的费用，除本协议另有约定以外由双方按照有关法律规定各自承担。</view>
			<view class="indent">
				9.2本协议签署后，受让方为本协议项下约定标的债权之唯一债权人，排他性拥有对债务人之全部权益；本次标的债权转让完成后，受让方有权将本协议项下的权利义务转让他人，届时仅需书面通知债务人即可；本次债权转让完成后，债权人无权将本协议项下的权利义务转让给其他第三方。
			</view>
			<view class="indent">9.3受让方未能坚持或未能强制要求债权人严格遵守本协议不构成对任何权利的放弃。</view>
			<view class="indent">9.4本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。</view>
			<view style="text-align:center;">（本页以下无正文）</view>
			<view>债权人：{{ contract.name }}</view>
			<view>受让人：北京桥炎咨询管理有限公司</view>
			<view>日期：{{ contract.time }}</view>
		</view>
		<view class="btn-box">
			<text class="tips-text">请认真阅读全部协议内容</text>
			<button class="md-btn" :disabled="!scrollStatus" @click="submit">确认</button>
		</view>
		<view class="sms-code-mask" v-if="showSms">
			<view class="sms-code">
				<view class="sms-code-tit">
					<view>请填写手机短信验证码</view>
					<view>已发送到手机号</view>
					<!-- <view>已发送到手机号:{{phone}}</view> -->
				</view>
				<view class="sms-code-ipt">
					<view v-for="(item, index) in codeList" :key="item">{{ item }}</view>
					<view v-for="(item, index) in 6 - codeList.length" :key="index"></view>
				</view>
				<view class="sms-code-btn" :class="{ dis: orClick }" @click="repeatSend">{{ btnConten }}</view>
				<view class="close-icon" @click="cancel"></view>
			</view>
			<view class="sms-keyboard">
				<view class="sms-keyboard-body">
					<view class="keys-wrapper" v-for="item in 9" :key="item">
						<view class="keys" @click="numClick" :data-num="item">{{ item }}</view>
					</view>
					<view class="keys-wrapper"></view>
					<view class="keys-wrapper"><view class="keys" @click="numClick" data-num="0">0</view></view>
					<view class="keys-wrapper "><view class="keys back" @click="delBack"></view></view>
				</view>
			</view>
		</view>
		<view class="serve-alert-mask" v-if="showAlert">
			<view class="serve-alert">
				<view class="serve-alert-content">
					<view>签订电子合同需您在中国金融认证中心（CFCA）进行开户</view>
					<view>请同意并授权系统使用您的姓名、身份证号、手机号信息进行开户</view>
				</view>
				<view class="serve-alert-btn" @click="handlerConfirm">同意授权并继续</view>
			</view>
		</view>
		<auth-login class="auth-login" id="auth-login" v-if="!isLoginShow" @myevent="onMyEvent" />
	</view>
</template>

<script>
import { preAgreement, sendSms, checkSmsCode, signAgreement, contractFinsh, getContractVal } from '../../utils/request/api';
import { authMixins } from '../../mixins/authMixins.js';
let globalData = getApp().globalData;
export default {
	data() {
		return {
			isLoginShow: true,
			btnConten: '发送验证码',
			phone: '130****5678',
			orClick: false,
			showSms: false,
			codeList: [],
			agreementUrl: '',
			agreementId: '',
			showAlert: false,
			scrollStatus: false, //判断scroll是否到底
			contract: {}
		};
	},
	mixins: [authMixins],
	methods: {
		submit() {
			//安心签授权过，直接发短信，否则弹出授权提示
			let _this = this;
			if (!!globalData.anxinid) {
				_this.getAgreement().then(() => {
					_this.showSms = true;
					_this.repeatSend();
				});
			} else {
				_this.showAlert = true;
			}
		},
		openAgreement(e) {
			let url = this.agreementUrl;
			uni.showLoading({
				title: '合同下载中...',
				mask: true
			});
			uni.downloadFile({
				url: url,
				success: res => {
					uni.hideLoading();
					let data = res.tempFilePath;
					uni.openDocument({
						filePath: data,
						fileType: 'pdf'
					});
				}
			});
		},
		getAgreement() {
			return new Promise((resolve, rejects) => {
				preAgreement({
					id: this.agreementId
				})
					.then(res => {
						if (res.code == 200) {
							resolve();
							this.agreementUrl = res.data.contract;
						} else if (res.code == 99) {
							this.isLoginShow = true;
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						} else {
							rejects();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						rejects(err);
					});
			});
		},
		//同意授权并继续
		handlerConfirm() {
			let _this = this;
			this.getAgreement().then(() => {
				_this.showAlert = false;
				_this.showSms = true;
				_this.repeatSend();
			});
		},
		//发送短信
		repeatSend() {
			if (this.orClick) {
				return;
			}
			sendSms({
				id: this.agreementId
			}).then(res => {
				if (res.code == 200) {
					let timeLine = 60;
					this.orClick = true;
					this.btnConten = timeLine + '秒后重发';
					let timmer = setInterval(() => {
						timeLine--;
						this.btnConten = timeLine + '秒后重发';
						if (timeLine == 0) {
							clearInterval(timmer);
							(this.btnConten = '重新发送'), (this.orClick = false);
						}
					}, 1000);
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		//验证短信
		checkCode() {
			this.showSms = false;
			let code = this.codeList.join(''),
				_this = this;
			checkSmsCode({
				code,
				id: _this.agreementId
			})
				.then(res => {
					if (res.code == 200) {
						_this.codeList = [];
						_this.signAgreement();
					} else if (res.code == 99) {
						_this.isLoginShow = true;
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					} else {
						_this.showSms = true;
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					_this.showSms = true;
				});
		},
		//获取合同变量
		getContractVal() {
			getContractVal({
				id: this.agreementId
			}).then(res => {
				if (res.code == 200) {
					this.contract = res.data;
				} else if (res.code == 99) {
					this.isLoginShow = false;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		signAgreement() {
			signAgreement({
				id: this.agreementId
			}).then(res => {
				if (res.code == 200) {
					this.contractFinsh({
						id: this.agreementId
					});
				} else if (res.code == 99) {
					this.isLoginShow = false;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		contractFinsh(params) {
			contractFinsh(params).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: '签署成功',
						icon: 'none',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/buySuccess/buySuccess'
						});
					}, 2000);
				} else if (res.code == 99) {
					this.isLoginShow = false;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		numClick(e) {
			let num = e.target.dataset.num;
			if (this.codeList.length < 6) {
				this.codeList.push(num);
			}
			if (this.codeList.length == 6) {
				this.checkCode();
			}
		},
		delBack() {
			this.codeList.pop();
		},
		cancel() {
			this.setData({
				showSms: false
			});
		},
		onMyEvent: function(e) {
			var that = this;
			that.isLoginShow = e.isLoginShow;
			if (uni.getStorageSync('uid') && uni.getStorageSync('token')) {
				this.getContractVal();
			}
		}
	},
	onLoad(options) {
		this.agreementId = options.id;
		if (options.code) {
			this.accountAuth(
				options.code,
				() => {
					this.getContractVal();
				},
				err => {
					this.isLoginShow = false;
				}
			);
		} else {
			if (!!uni.getStorageSync('uid') && !!uni.getStorageSync('token')) {
				this.getContractVal();
			} else {
				this.isLoginShow = false;
			}
		}
	},
	onReachBottom() {
		this.scrollStatus=true
	}
};
</script>

<style scoped lang="scss">
.content {
	padding: 20rpx 30rpx 190rpx;
	font-size: 28rpx;
	color: #333;
}

.content view {
	line-height: 1.5;
	margin-bottom: 12rpx;
}

.content .indent {
	text-indent: 2em;
}

.content .bold {
	font-weight: bold;
}

.content .under-line {
	text-decoration: underline;
}

.content-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
}

.btn-box {
	position: fixed;
	z-index: 90;
	left: 0;
	right: 0;
	bottom: 0;
	height: 120rpx;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.3);
	background-color: #fff;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	padding: 20rpx 0;
	height: auto;
}

.btn-box .tips-text {
	color: #666;
	font-size: 26rpx;
	margin-bottom: 10rpx;
}

.sms-code-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.3);
}

.sms-code {
	position: relative;
	margin: 40% auto auto;
	width: 556rpx;
	background-color: #fff;
	border-radius: 20rpx;
}

.sms-code-tit {
	padding: 60rpx 30rpx 0;
}

.sms-code-tit view {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	text-align: center;
}

.sms-code-tit view + view {
	font-size: 28rpx;
	color: #888;
	font-weight: normal;
	margin-top: 20rpx;
}

.sms-code-ipt {
	padding: 40rpx 80rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.sms-code-ipt view {
	font-size: 56rpx;
	color: #333;
	display: flex;
	align-items: center;
	height: 60rpx;
	width: 34rpx;
}

.sms-code-ipt view:empty::before {
	content: '';
	display: block;
	width: 20rpx;
	height: 4rpx;
	background-color: #ccc;
}

.sms-code-btn {
	height: 88rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: $themeColor;
}

.dis {
	color: #ccc;
}

.sms-keyboard {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vw;
	background-color: #f2f3f5;
	display: flex;
	padding: 12rpx 0 44rpx 12rpx;
}

.sms-keyboard-body {
	display: flex;
	flex-wrap: wrap;
	flex: 3;
}

.sms-keyboard .keys-wrapper {
	padding: 0 12rpx 12rpx 0;
	display: flex;
	flex: 1;
	flex-basis: 33%;
}

.keys {
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	height: 96rpx;
	font-size: 56rpx;
	background-color: #fff;
	border-radius: 16rpx;
}

.keys:active {
	opacity: 0.4;
}

.back::before {
	display: block;
	content: '';
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAMAAACsjQ8GAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAWhQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALZhACAAAAHd0Uk5TABKG2fn0w2ACLeO0CCrqz0MMGmTumCXmtQc0+/0jIOK8q2wc3cILe4kX2MgOVTZdc40U084RQu9OD8sGs/A3KefEDccYuN7tLL/JYV9SgfpNivdENYz1QB3cAZvyOKMyh4ID61cFsugzerljcr3+WJ3xXi6AqmpZdlwTAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAASAAAAEgARslrPgAAAVJJREFUKM9tkvk/AkEYxoccxYoQVolUKFrkiJSSK2fuo8iR+8jt+fe1O7uzs7bnh33ffZ/vZ+aZ2SVEU1W1pQa8auvqrUSXrQFmNQrMb7KjucVBeLW2tcOpvXR0oksk/9XtcvfQztOLPoGY5UW/Un1+BAYq+GQQQ3IJhjA8QidhSY08qpQxjJefkQlMTtH5tCuqEDa7e4YBszGEguqSc3Ek5glJprCQ1gDHIixLbFNhGVHJZkfAwbZwYsXHxZIJ5ivAKjKG4MIasK7dmAz4sWEAyusjIXHAJlxbRj8g59ABso3sDvOV/OpZ2D3sYm9f9TM0n5z0QAfIIY6OKXBySs8vxlNJDsjlcXZOCZ+aX/BwWxBiLSB6UeljXeKKNtdeFDNmPxfDjdre3uH+wQQ8opjWevEJ2fxzmNfLK0pvOi2+l0z/7MenYcGv78IPr/xvpDz9A2j9ZQf96Et1AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA4LTEzVDE3OjMxOjIwKzA4OjAwup7BRQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wOC0xM1QxNzozMToyMCswODowMMvDefkAAABNdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uXzMycjAzcWE1djRzL0RlbGV0ZUtleXguc3ZnHhNLigAAAABJRU5ErkJggg==);
	width: 100%;
	background-position: center;
	height: 100%;
	background-repeat: no-repeat;
}

.close-icon {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAADZQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt3ZocgAAABF0Uk5TAFPp2TpS8zzn1vL0QDvY6NdMdXqFAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAASAAAAEgARslrPgAAAJlJREFUOMvFk8sSgCAIRc0HPc34/5+tqEwTctNMrJB7RGFAqQ+s0cZycWu0I0cjQlvqLSB25BnkiF3H/kgFDEE6nE/bYTuMU6r7PFQQ/hl4EL5MmRGMnhGsnhCCHglRv0oH5Bsbc4j3b0LWj/+9AL7yRO2TZ31WKjPWLxBJf1gi698P81Ed2pexn8kN8uIE8lyY+dVbOqc+sBUDEBC57jy43wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wOC0xM1QxNzozNTozNSswODowMC3nTgYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDgtMTNUMTc6MzU6MzUrMDg6MDBcuva6AAAAS3RFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9ob21lL2FkbWluL2ljb24tZm9udC90bXAvaWNvbl9saHp4dGt2NWU1L2ljX2RlbGV0ZS5zdmeelzTWAAAAAElFTkSuQmCC);
	background-repeat: no-repeat;
	background-size: 50% 50%;
	background-position: center;
	width: 60rpx;
	height: 60rpx;
	padding: 40rpx;
	position: absolute;
	left: 0;
	top: 0;
	opacity: 0.4;
}
</style>
