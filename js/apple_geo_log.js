// apple_geo_log.js
// 用于输出日志以确认请求直连是否成功
if ($request) {
  console.log(`[Apple GeoCheck] 请求域名: ${$request.hostname}`);
}
$done({});
