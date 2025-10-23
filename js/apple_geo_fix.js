/**
 * Apple GeoServices 修正脚本
 * 解决 VPN 使用导致 Apple 地理服务（GeoServices、Weather、Night Shift、系统主题切换等）
 * 被错误识别为节点所在国家/地区的问题。
 *
 * Author: ChangXiaoqiang
 * Updated: 2025-10-23
 */

const CN_IPS = ["10.", "172.", "192.168.", "100.64.", "127."];
const LOCAL_REGIONS = ["CN", "HK", "MO", "TW"];

/**
 * 判断当前请求是否属于 Apple GeoServices
 */
function isGeoServices(reqUrl) {
  const targets = [
    "gs.apple.com",
    "gsp-ssl.ls.apple.com",
    "geo.apple.com",
    "configuration.apple.com",
    "weather-data.apple.com",
    "init.itunes.apple.com"
  ];
  return targets.some(domain => reqUrl.includes(domain));
}

/**
 * 伪造或固定地理位置区域为中国大陆
 */
function fixGeoResponse(body) {
  try {
    const json = JSON.parse(body);
    if (json && json.countryCode && !LOCAL_REGIONS.includes(json.countryCode)) {
      json.countryCode = "CN";
      json.timeZone = "Asia/Shanghai";
      json.locale = "zh_CN";
    }
    return JSON.stringify(json);
  } catch {
    return body;
  }
}

/**
 * 主执行逻辑
 */
if ($request) {
  if (isGeoServices($request.url)) {
    console.log("[AppleGeoFix] 捕获到 Apple GeoServices 请求:", $request.url);
  }
  $done({});
}

if ($response && isGeoServices($request.url)) {
  const fixed = fixGeoResponse($response.body);
  console.log("[AppleGeoFix] 已修正地理位置返回数据");
  $done({ body: fixed });
} else {
  $done({});
}
