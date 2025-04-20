/*
脚本作者：ChangXiaoqiang
功能：彻底屏蔽iOS系统更新检测
引用需配合MitM域名：mesu.apple.com, appldnld.apple.com
*/

// 持久化存储KEY
const CACHE_KEY = "BLOCKED_IOS_UPDATES";

// 主处理函数
if (typeof $request !== 'undefined') {
  handleRequest($request);
} else {
  initScript();
}

function handleRequest(request) {
  const url = request.url;
  const method = request.method;
  
  // 拦截OTA检测请求
  if (url.includes('/mobileasset/iosupdate/')) {
    sendEmptyResponse();
    return;
  }

  // 拦截描述文件检查
  if (url.includes('iprofiles.apple.com')) {
    $done({ response: { status: 404 } });
    return;
  }

  $done({});
}

function sendEmptyResponse() {
  $persistentStore.write("1", CACHE_KEY); // 记录拦截次数
  
  $done({
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ Assets: [] })
    }
  });
}

function initScript() {
  const isActive = $persistentStore.read(CACHE_KEY);
  const now = new Date();
  
  $notification.post(
    '✅ iOS更新屏蔽已激活',
    `最后拦截时间: ${isActive ? now.toLocaleString() : '从未'}`,
    '前往设置→通用→软件更新验证'
  );
  
  console.log(`[${now}] iOS更新拦截器运行中...`);
}