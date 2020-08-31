import {accountAuth} from "../utils/request/api.js"
export const authMixins={
	data(){
		return{
			
		}
	},
	methods:{
		accountAuth(code,callback,errback){
			accountAuth({code:code}).then(res=>{
				if(res.code==200){
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('uid', res.data.uid);
					if(callback){
						callback()
					}
				}else{
					uni.showToast({
						title: '授权失败',
						icon: 'loading',
						duration: 1000
					});
					if(errback){
						errback(res.msg)
					}
				}
			}).catch(err=>{
				uni.showToast({
					title: '授权失败',
					icon: 'loading',
					duration: 1000
				});
				if(errback){
					errback(err)
				}
			})
		}
	},
}