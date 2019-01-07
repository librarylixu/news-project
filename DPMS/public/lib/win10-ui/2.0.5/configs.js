//把锁定的应用得到给配置项
var lockedApps = ['yl-system', 'yl-browser'];//锁定的应用的配置项
var userappidarr = _USERAPPID.split(',');//权限下能展示的页面转成数组
for (i = 0; i < userappidarr.length; i++) {
    lockedApps.push('eim-'+userappidarr[i]);
}
//配置项
YL.static = {
  softwareName: 'CRM', //软件名
  version: "v2.0.0.0",
  iconBtnStart: 'windows', //主图标
  author: '昕辰CRM开发小组',//作者
  contactInformation: '18511090066',//联系方式
  officialWebsite: 'http://www.qhoa.net',//软件官网
  welcome: '欢迎您使用CRM系统软件',//加载完毕控制台提示信息
  copyrightDetail: '北京昕辰清虹科技有限公司所有',//版权信息信息
  otherStatements: '',//其他信息（可留空）

  /**————————————————————————————————————————————————————————————————————————————————————————————*/
  // lang:'zh-cn', //语言
  lang: 'zh-cn', //语言
  localStorageName: "ylui-storage", //ls存储名
  
  lockedApps: lockedApps,//锁定应用列表，被锁定应用不会被覆盖或卸载 
  trustedApps: ['yl-browser'],//可信应用列表，被信任应用有更高的操作权限 
  debug: true,//启用更多调试信息
  beforeOnloadEnable: true,//启用意外重载询问（打包app时请关闭防止出错）
  WarningPerformanceInIE: true,//在IE下提示体验不佳信息
  languages: {}, //推荐留空，自动从文件加载
  changeable: false,//存档数据是否可被普通用户修改 系统管理中除了关于都被置灰
  dataCenter: false,//是否展示数据管理中心  禁用了数据管理中心功能

  /**————————————————————————————————————————————————————————————————————————————————————————————*/
  /** LYUI注册信息 */
  authorization: '社区版',//授权类型
  serialNumber: null,//序列号

};
