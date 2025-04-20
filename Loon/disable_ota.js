//!name = 禁用iOS更新提示
//!desc = 拦截苹果OTA检测请求并返回空数据
//!author = ChangXiaoqiang
//!date = 2024-04-20

const URL_REGEX = /^https?:\/\/api\.apple\.com\/mobileasset\/iosupdate\/.+/;

if (typeof $request !== 'undefined') {
  // 如果是MITM请求，直接返回空JSON
  if (URL_REGEX.test($request.url)) {
    $done({
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Assets: [] })  // 返回空更新列表
      }
    });
  } else {
    $done({});
  }
} else {
  // 脚本持久化逻辑
  const isLoon = typeof $loon !== 'undefined';
  const isSurge = typeof $httpClient !== 'undefined' && !isLoon;
  
  if (isLoon || isSurge) {
    $persistentStore.write("[]", "CachedOTAUpdates");
    
    $httpClient.get('http://www.apple.com', function(error, response, data) {
      if (error) {
        console.log('OTA拦截器激活失败: ' + error);
      } else {
        console.log('✅ iOS更新已屏蔽');
      }
    });
  }
}