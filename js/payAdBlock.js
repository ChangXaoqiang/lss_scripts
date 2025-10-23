// payAdBlock.js - 用于拦截广告请求
// 简体中文注释：当URL中包含payScene=-1时，判定为广告请求，进行拦截处理
if ($request.url.includes("payScene=-1")) {
  console.log("广告请求已被拦截：" + $request.url);
  $done({ status: "HTTP/1.1 403 Forbidden", body: "广告请求已拦截" });
} else {
  $done({});
}