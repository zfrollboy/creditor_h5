<script>
	import api from "utils/request/request.js"
export default {
	onLaunch: function() {
		
	},
	globalData: {
		envVersion: 'release',
		devote: 0,
		owePrice: 0,
		userInfo: null,
		anxinid: null,
		keyword: '',
		bizToken:null,
		baseApiUser: api.baseUrl
	}
};
</script>

<style lang="scss">
view,
scroll-view,
swiper,
button,
input,
textarea,
label,
navigator,
image {
	box-sizing: border-box;
}

page {
	height: 100%;
	position: relative;
	box-sizing: border-box;
	/* background-color: #fff; */
	font-size: 28rpx;
	font-family: PingFangSC-Medium, PingFang SC;
}

.page {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	overflow: auto;
	bottom: calc(constant(safe-area-inset-bottom));
	bottom: calc(env(safe-area-inset-bottom));
}

.fixed-bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 20rpx 0;
}

.tab-active:active {
	opacity: 0.8;
}

.lg-btn,
.md-btn {
	height: 88rpx;
	line-height: 88rpx;
	background: $themeColor;
	border-radius: 44rpx;
	color: #fff;
	transition: 0.1s ease;
	will-change: opacity;
	font-size: 32rpx;
}

.lg-btn[disabled],
.md-btn[disabled] {
	opacity: 0.8;
	color: #fff !important;
	background-color: $themeColor !important;
	font-size: 32rpx;
	font-weight: 500;
}

.lg-btn {
	width: 690rpx !important;
	display: flex;
	align-items: center;
	justify-content: center;
}

.md-btn {
	width: 548rpx;
}

button::after {
	border: none;
}

.btn-active {
	opacity: 0.6;
}

.gray-margin-b {
	box-sizing: content-box;
	border-bottom: 20rpx solid rgba(248, 248, 248, 1);
}

.section-title {
	height: 70rpx;
	padding-top: 10rpx;
	font-size: 32rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	line-height: 60rpx;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
}

.section-title::before {
	content: '';
	width: 6rpx;
	height: 28rpx;
	display: block;
	background-color: $themeColor;
	margin-right: 12rpx;
}

.section-text {
	margin: 0 30rpx 20rpx;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 42rpx;
}

.form-group {
	position: relative;
	background-color: $white;
	padding: 1rpx 30rpx;
	display: flex;
	align-items: center;
	min-height: 88rpx;
	justify-content: space-between;
}

/* .form-group:active {
	  opacity: .7;
	} */

.form-group::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: block;
	background-color: rgba(238, 238, 238, 1);
	height: 2rpx;
	transform: scaleY(0.5);
}

.form-group .label {
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	padding-right: 30rpx;
	position: relative;
	height: 60rpx;
	line-height: 60rpx;
	position: relative;
	display: block;
}

.form-group .label.required::before {
	content: '*';
	position: absolute;
	left: -20rpx;
	color: #ff6f6f;
	display: block;
	top: 6rpx;
}

.form-group picker {
	flex: 1;
	padding-right: 40rpx;
	overflow: hidden;
	position: relative;
	margin-right: -10rpx;
	height: 60rpx;
}

.form-group picker .picker {
	height: 100%;
	font-size: 32rpx;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 100%;
	text-align: right;
	line-height: 60rpx;
}

.form-group .picker:empty:before {
	content: '请选择';
	color: #999;
}

.form-group .picker::after {
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

.form-group input {
	flex: 1;
	font-size: 32rpx;
	color: #333;
	text-align: right;
}

.input-pls {
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
}

.steps {
	overflow-y: auto;
	padding-top: 10rpx;
	background-color: $white;
	border-bottom: 20rpx solid rgba(248, 248, 248, 1);
	height: 130rpx;
	position: relative;
}

.steps-content {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;
}

.steps .steps-node {
	width: 25%;
	min-width: 25%;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	position: relative;
	z-index: 10;
}

.steps-node .tag {
	width: 44rpx;
	height: 44rpx;
	margin-bottom: 6rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.steps-node .text.current {
	color: #ff6634;
}

.steps-node .tag image {
	display: block;
	width: 100%;
	height: 100%;
}

.steps-node .tag-gray,
.steps-node .tag-active {
	width: 28rpx;
	height: 28rpx;
	min-width: 28rpx;
	min-height: 28rpx;
	max-width: 28rpx;
	max-height: 28rpx;
	background: rgba(228, 228, 228, 1);
	border-radius: 50%;
}

.steps-node .tag-active {
	background: #ff6634;
}

.steps-line {
	position: absolute;
	height: 4rpx;
	background: rgba(228, 228, 228, 1);
	border-radius: 8rpx;
	left: 30rpx;
	right: 30rpx;
	top: 22rpx;
	overflow: hidden;
}

.steps-line-light {
	height: 100%;
	background-color: #ff6634;
	/* width: calc((187.5rpx * 0) + (187.5rpx / 2) - 30rpx); */
}

.check-agreement {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	padding: 0 30rpx;
}

.check-agreement checkbox .wx-checkbox-input {
	width: 30rpx;
	height: 30rpx;
}

.check-agreement checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	border-color: #ff6634 !important;
	background-color: #fff !important;
}

.check-agreement checkbox::before {
	margin-top: -10rpx;
	right: 2px;
	font-size: 24rpx;
	line-height: 12px;
}

.check-agreement checkbox[aria-checked='true']::before {
	color: #ff6634 !important;
}

.check-agreement .check-text {
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	margin-left: 12rpx;
}

.li-i {
	margin-bottom: 12rpx;
}

.li-i text {
	display: inline-block;
	width: 168rpx;
	font-size: 28rpx;
	color: #666;
}

.li-i text + text {
	width: auto;
	flex: 1;
	color: #333;
	margin-left: 20rpx;
	font-weight: 500;
}

.serve-alert-mask {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}
.serve-alert {
	width: 640rpx;
	/* margin: 300rpx auto 0; */
	margin-top: -100rpx;
	border-radius: 20rpx;
	background-color: #fff;
	overflow: hidden;
}
.serve-alert-content {
	padding: 80rpx 44rpx 60rpx;
	min-height: 240rpx;
	font-size: 32rpx;
	color: #888;
	border-bottom: 1rpx solid #e4e4e4;
}
.serve-alert-content text {
	font-weight: bold;
	text-decoration: underline;
}
.serve-alert-btn {
	text-align: center;
	padding: 30rpx 0;
	font-weight: bold;
	font-size: 32rpx;
	color: $themeColor;
}
.serve-alert-btn:active {
	background-color: #e4e4e4;
}
.empty::before {
	content: '';
	display: block;
	height: 500rpx;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAB9EAYAAAA6ordPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAEuZJREFUeNrt3X1UVGUeB/Df786IJIqZiolYEjB3cMzU0LMk2lYcs3yDVVLzpZOvqMBpQxOX6mirLdR6Kt/ylVIE8vj+Svk2ZhN6hLUVhXvvAJKVwxEED+LLAZz77B+XaXfdWobXZ2B+n/8YnufO785hvtz73OfeB2VZlmWZMSDECTgGx+CYa9fEIrFILOrXr7HbURKVRCXxz382rDSsNKz87DNERERV5b1/7kbgXQBxUzfhJtx87TXlaeVp5elVq3iX464oAAhfe2AP7ElIkA5Lh6XDMTG8y3E3FADEJeBe3It7P/1U2ahsVDZGRPCux11QABDXkAAJkKDTsQJWwArS0/Ot+dZ86x/+wLus9o4CgLiWuTAX5j7yiFAulAvlhw/nTcqblDcpMJB3We0VBQBxTd2gG3Tr0UPfS99L3yszsyCmIKYgpmdP3mW1NxQAxKWxWBbLYgMD7YPsg+yD9u0rZsWsmHl68q6rvaAAIG1DGIRBWFhYtVwtV8s7djDGGGMC/f02EX2ApG1BQMCoKOtE60TrxORk3uW0dRQApE1iH7IP2YeLF8txcpwcFxfHu562igKAtG2+4Au+n3wiLZAWSAv+9Cfe5bQ1FACkbYuACIgQBOyEnbDTzp3SWmmttDY0lHdZbQUFAGkf6uYPYAiGYMihQ1oQGAy8y3J1FACkfambP4AFWIAFx44V+RT5FPn4+PAuy1VRAJD2aSEshIUBAbWxtbG1sYcP5+Tk5OTkdOrEuyxXQwFA2rcoiIKoYcO6zOwys8vMr77S5g/odLzLchUUAMQtsH1sH9s3bpxiVsyKee1a3vW4CgoA4l58wRd8FyxQApQAJeCtt3iXwxsFAHFLbC6by+auXi3ZJJtkmziRdz28UAAQ9+SYP3AMj+GxnTvl2/Jt+fbw4bzLam0UAMS9hUEYhDnuLjx4UN4qb5W3iiLvsloLBQAhAAA2sIGte3cYCANhYGbm5WWXl11e1qsX77JaGgUAIf/JG7zB29+/Q1yHuA5xR45cir8Ufyney4t3WS2FAoCQ31IJlVAZEuJZ4VnhWdF+5w9QABDyf7ClbClbOnas9SXrS9aX1q/nXU9zowAgxAlsA9vANsyfL5VL5VJ5fDzvepoLBQAhDYDf4Xf43ccfa1cLpk3jXU9TUQAQ0hBGMIIRESIhEiJTUpShylBl6Isv8i6rsSgACGmMMiiDMg8PKIESKNm9W1vRyGjkXVZDUQAQ0gTsJDvJTj72GBvChrAhx45pC5k8/jjvupxFAUBIc6ibP6C36C16y5EjWhB07sy7rPpQABDSjNgZdoadefZZ3aO6R3WP7tplZmZmZno977p+j8sWRtq5KqiCqrg4YYWwQljRtSvvclqKT5RPlE+Ut7f2U0UF73oeRgFAuBDTxXQxPTubdx3ujk4BCHFjFACEuDEKAELcGAUAIW6MAoAQN0YBQIgbo8uApEHYD+wH9kPnztJ16bp0fd483vW4Ot1B3UHdwe++MyQYEgwJksS7nodRAJCGqXt2HiIi4qZNvMtxdWoPtYfaY8EC7SfXCwA6BSDEjVEAEOLGKAAIcWMUAIS4MQoAQtwYBQAhbowCgBA3RgFAiBujACDEjVEAEOLGKAAIcWMUAIS4MQoAQtwYBQAhbowCgBA3xv95ABawgMViEU4Jp4RTK1bwLoe0D6yclbPyZ59la9gatiYpiXc9rop7AOANvIE3SksNGYYMQ8bJk7zrIe2DZJEskkUQEBCQdzEujE4BCHFjFACEuDEKAELcGAUAIW6MAoAQN0YBQIgb434ZkB1lR9lRf39JkiRJooUmSPNAL/RCr/794R7cg3u8q3Fd3AMAUiAFUgYP1q7X0kITpJnQF98pdApAyH+yghWs169DV+gKXXNyIB7iIf7kSbgG1+DawYPAgAHbvRujMRqjjx9HE5rQlJUFe2Ev7JUk6Ak9oWdNDe/dcBbKsizLMmO8CyGkRVnAApayMu0Hs1k78jx9GmbBLJj1j39oryuKcY5xjnFOVVVj38bMzMzM9HqfKJ8on6h+/XSjdaN1o+/d07Zrs/H+GB5GAUDal/2wH/ZXVsIVuAJXdu8WrgpXhas7dgRlBWUFZVks2pqG9PfuwH8MgJAmwKW4FJf+9BNEQzREf/RRJ49OHp08UlL6pvVN65t2//6/G9JNAb+FAoC0LXWH8jgTZ+LMxMSqd6verXr3yy9DhoYMDRlaW8u7vLaGBgGJa5NBBpkxSIM0SEtNxQf4AB/07y96iB6ix5YtrfXFL4gpiCmI6dgxNzc3Nze3W7e8SXmT8iZ17sz742kqGgMgrukW3IJbN2/iTtyJO2fOFNeL68X1mZnNtXnHF7ljVsesjlnPP89OsVPs1MiRWIZlWGYysUyWyTINBhyFo3CUnx/bwrawLfrfP2LeBJtgU2kpvAFvwBsFBZADOZAjy7gJN+Gmc+cwEAMx0GzWbnu/epX3x+tAAUBci+MBMe8I7wjvTJliqDBUGCquX2/s5i7FX4q/FO/l5bnIc5HnookTWSpLZakzZ0JH6AgdX3gBIiACIoTWOxIuhEIolGWIgRiISU3Vf6L/RP9JampgZGBkYOTPP7daHXUoAIhr8AVf8D10yGuL1xavLVOm9I3vG983/j8G8ZykHap7e6tW1apaFyxge9getmfJErCBDWzdu/Pezf9xAA7AAVWFCTABJuzdq1uvW69bv3x50LqgdUHr8vNb+u0pAAhfetCDPiVFDBADxIB587TLdHa7s90ZY4wxRGuxtdhaPGMGu8FusBurV0M36AbdevTgvXsN5giEu3AX7qalYR/sg33efluMFqPF6Js3m/vtaBCQ8JEESZC0a5f2xZ87t6FffIlJTGL9+lmHWYdZh33/PathNaxm+/Y2+8V3cJySTINpMG3GDKYwhSl5eUqlUqlUvvpqc78dBQBpXT2gB/Qwm3WddZ11nd94Q/viq6qz3eWt8lZ56/jxwsvCy8LLFy9q5/Shobx3q8XMh/kw38eHmZmZmY8ckb+Vv5W/TU7Wjnx0uqZunk4BSKtwTNh50OFBhwcdBg827THtMe2pqHC2vxwtR8vRb76JeZiHeZs31zsq397V3ZvgdcXriteVqVMbO2ZCRwCkReEIHIEjamvVcDVcDZ8ypcFf/K3yVnnrkiXwFrwFb6WkuP0X3+FJeBKenDDh7um7p++ePnSomBWzYubp2dDNUACQFsW8mBfzWr48ODY4Njj23Dln+ylLlCXKkhkztFOG5GTe++GyVsNqWB0eXl1VXVVdtWuX42YkZ7vzT9K6c0JWxspY2ZIlvMtxd/g5fo6fDx8OC2EhLPzss0ZvqO72WHuIPcQe8ve/w4/wI/xYfzdtcO+Pf4SRMBJGpqTAbJgNs7H1Z/HXQi3Ufv01xmM8xp85U19zdo6dY+d8fCAbsiH77bdbvV4b2MA2frzvEN8hvkM+/FB78Z136uvGPQC0mVK3bhkTjYnGRMdtmYQXbbS5Vy9WwkpYSeO3gwfwAB6IiTFlm7JN2fXfH1/kU+RT5OPjU1tcW1xbnJbG+1CfVbNqVn32rPG48bjxeP1HINYka5I1KThYBRVU4BAAjrrTWTpLX7xYiVFilJjvvxd/EX8Rfzl48Pfa0ykAaV51/znFbDFbzD592uluz9Q+U/vMxo1QAzVQ4+vLezfaLCMYwYjIolgUi9q82THl+feacz8CIO2LIAiCIPztb862l3+Sf5J/Gj1ae4RXZCTv+tuNusuHHjYPm4dt1SrtxYULH25GRwCkWTgejWUwGUwG09mz9bV3XMfGgTgQBzZhrIH8fxfgAlyYP18Kl8Kl8AEDHv41BQBpFmwum8vmbt3qbHv5hHxCPvHaa+w8O8/OGwy862+36mYWCpVCpVC5bNnDv6YAIE2zBbbAlvv3OyzusLjD4n37nO2Gy3E5LqerPq2FmZiJmSZPVoYqQ5Wh/v6O1ykASNOUQzmUHzoUEBgQGBBYWVlfc+1uvcGDHY+D512+20iABEjQ6bTLsdOnO17mPwiYARmQYTAoo5RRyqilS3mX4/ZMYAKTKMJJOAkn62+uTc09ccLZzdu327fbt0+frt0Pz3tn3VAwBEPwjBlQBmVQ9te/cg8A7X5tx+BEUhLvekhjOH+5D/IgD/LGjKGFO/hgm9lmtjkoKD81PzU/NSiITgFI4+yDfbDvl1+06/3FxfU1lx6RHpEe6d1b++KLIu/y3Z3gL/gL/i+9RAFAGgVX4kpcmZfndIciKIKi557jXTepcw2uwbXnnqMAII3TF/pCX0VxtjmuxtW42mjkXTap4wEe4CGKFACkUVgpK2WlhYVOd8iGbMim6/0uwwpWsBoMFACkcfpAH+hTXu50ewMYwNCGH9XV3iRCIiQ++igFAGmcciiH8gYsoqkHPei7dOFdNvlvFACkUdAP/dDv7l2nO/SBPtCnY0fedZP/RgFAGkWtUWvUGucfSonbcBtuu0dX/l0MBQBpnEzIhExvb2ebs1yWy3Jv3+ZdNqlTt+YiBQBpFPwAP8APnA8A9EZv9LbZeNdN6gyEgTCwpIQCgDQKW8VWsVWPPeZ0h0RIhESrlXfdRIMv4ov4otVKAUAaBeMwDuOcn9ijvqK+or7SgJmDpEWx19nr7PX8fAoA0jj34B7ce/ppZ5urn6qfqp9mZTnWCeBdvrvDXMzF3G+/5X43IGmbsBALsXDAAO3RXoJQ3xJf2oIgd+5oD6TIydFedd0lvXAZLsNlQ4dKkiRJ0rx59bVnBayAFfTuzbvuejkG//oJ/YR+ZjMtDUaaRLgkXBIuDR5smGyYbJj8z3/W1/7XlX7CIAzCPvqId/1uZzpMh+lnzxpzjDnGnOefp1MA0iSqn+qn+o0d27BeaWna6sDOrwZMmgfOwTk4JzXV8TMFAGkS3IE7cMeYMc62N84xzjHOsdlgKkyFqUeO8K7fbeyH/bC/slIfrg/Xh+/e7XiZAoA0CfNn/sx/2DDt0N75BT2EqcJUYapjCSvS4mbBLJi1du3Dz26kACBNU/fYaTabzWaz6x8sczBUGCoMFRcu4BAcgkO++Yb3brRbdf/5cT/ux/3/u/4CDQKS5rEJNsGm0lJdra5WV/vEE0HrgtYFrauurq+bduQgihAJkRCZm6s9rNLDg/fuaMH08cc4ASfghI0b62tvz7fn2/MDAnAX7sJdx4/zrv9XoRAKoXFxxlvGW8Zba9c+/Gu6DEiaR91SVOoQdYg6JCpKe3Hnzvq6aWMCiiKDDDIkJ2tXB957j/fuqGfVs+rZW7eCQ4JDgkOuXq2vvbY4aMeO2uKgLqArdIWuOTlihVghVmzYAAgIv7HGMp0CkGbF1rA1bM2KFdrz/52//bdkdsnsktkffAAWsIDFYuG9H20VDsABOODOHTgKR+Ho9Ona/Izfv9pCAUCaVxiEQdhTT9kH2QfZB8XFOdvtBXwBX8AHD/Td9d313V9/HZMwCZNu3OC9O23GATgAB1SVTWfT2fQ333QcWdXXjU4BSMsogzIoS0ws8inyKfLZvj2gNKA0oLS0tL5ugZGBkYGRP/+sHUG88opdsSt25cwZEEEE0fm7D5tKGCmMFEZ262adap1qnfrUU/W1t2fYM+wZfn4YgREY0VpV/htWYRVWLV4sfil+KX65Z4/T/WgQkLSoSTAJJh09Kl4WL4uXx43TDkmd/3uz5lnzrHkjR6qFaqFaePhwaweBq0MrWtG6fLk4Xhwvjl+xosH9KQBIa9DmysfGBo8LHhc8bt26hvZ3LG+Nm3Ezbv7mG6iBGqhxft5Bu1E3gxJrsAZr4uLEdDFdTN+wobGbowAgraMcyqG8ulqXocvQZYSGapcJf/ihoZvRTg38/LQxhowMbcwhLIz37rU4C1jAUlYGo2AUjJo50/iE8QnjE19/3dTNUgCQ1uUBHuBhs+FknIyTw8KcXVrsYWZmZmam1/fe1ntb723vv6/NI1i61FXmETQXTMZkTD5yRP1K/Ur9at684PvB94Pvl5Q01/bpKgBpXXWH7iyUhbLQEyd+XTOwgRxXDbTR7vff12a8DRzY5mcWboANsKGoCMMxHMMjIsQvxC/EL8aNa+4vvgMdARC+7sAduJOby0awEWzE6NHN9YcurZXWSmtDQ4WLwkXh4l/+wkQmMvHVVx1Tl3nv9q/eg/fgvfx87T99crLN3+Zv809PdwRcS789BQBxDXWnBszETMzk+I938WJzbd4xdqBaVatqnTaNeTEv5hUZqc2YCwmBBEiABOcfc95gjv/sdrSj/dgxzMAMzNi503FPRKt8xr8BlceVx5XHHU9oIYQzT/AEz6oqNV6NV+Pnzw+ODY4Njm25h4kWFRYVFhV27fqg54OeD3oOH852s91st8kEZjCD2WDQgsHPD+xgB3uXLjgaR+NoT0+2iC1ii+x2OA/n4fzt21iKpVhaWqpeUC+oFwoK4AScgBOKwmpYDavJyuo/tv/Y/mOvXeP98T7sX0qs9cbl7V7tAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA4LTE3VDE1OjA5OjU5KzA4OjAwG5tStgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wOC0xN1QxNTowOTo1OSswODowMGrG6goAAABIdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uX2k1Mzd5dzY1YnpiL2VtcHR5LnN2Z5ar8PcAAAAASUVORK5CYII=);
	background-repeat: no-repeat;
	background-size: 128rpx 128rpx;
	background-position: center center;
}
.empty::after {
	content: '暂无数据';
	display: block;
	color: #d8d8d8;
	font-size: 32rpx;
	text-align: center;
	margin-top: -160rpx;
}
</style>
