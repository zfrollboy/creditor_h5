const util=require("./utils/util"),{defaultConfig:defaultConfig,sysFailInfo:sysFailInfo}=require("./config.js"),init=function(e){wx.onNetworkStatusChange(e=>{"none"!==e.networkType&&"2g"!==e.networkType||wx.showToast({title:"网络异常，请您在良好的网络环境下进行",icon:"none"})}),wx.IVBaseUrl||(wx.IVBaseUrl="https://interactive-video.faceid.qq.com"),wx.startInteractiveVideo=function(i){if(!i.data||!i.fail||!i.success){return void wx.showModal({title:"提示",content:"调用SDK失败，wx.startInteractiveVideo传入参数缺少！",showCancel:!1})}e&&void 0!==e.livenessMode&&(defaultConfig.Common.LivenessMode=e.livenessMode),wx.IVSuccessFunc=i.success,wx.IVFailureFunc=i.fail,wx.IVdefaultConfig=defaultConfig,wx.sysFailInfo=sysFailInfo;const n=i.data.BizToken;util.validate(n,"BizToken")?wx.navigateTo({url:`/faceid-interactive-video-mpsdk/index/index?curPage=1&BizToken=${n}`}):wx.showModal({title:"提示",content:"调用SDK失败,BizToken格式错误！",showCancel:!1})}};module.exports.init=init;