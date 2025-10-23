/**
 * Apple GeoServices 修正脚本
 * 解决 VPN 使用时 Apple 系统根据节点 IP 误判地理位置问题
 * 作者: ChangXiaoqiang
 * 日期: 2025-10-23
 */

const LOCAL_IP_API = "http://ip-api.com/json/?fields=status,country,regionName,city,lat,lon,query";
const APPLE_GEO_HOSTS = [
  "gs-loc.apple.com",
  "geo.apple.com",
  "configuration.apple.com",
  "gsp-ssl.ls.apple.com"
];

(async () => {
  let url = $request.url;
  let hostname = $request.hostname;
  if (!hostname) hostname = url.match(/https?:\/\/([^/]+)/)?.[1];

  // 判断是否为 Apple 地理服务请求
  if (!APPLE_GEO_HOSTS.some(h => hostname.includes(h))) {
    $done({});
    return;
  }

  try {
    // 获取设备真实地理位置（基于出口 IP）
    const res = await new Promise((resolve, reject) => {
      $httpClient.get(LOCAL_IP_API, (error, response, data) => {
        if (error) reject(error);
        else resolve(JSON.parse(data));
      });
    });

    if (res?.status === "success") {
      const fixedResponse = {
        location: {
          lat: res.lat,
          lng: res.lon
        },
        country: res.country,
        region: res.regionName,
        city: res.city,
        ip: res.query
      };

      console.log(`[Apple Geo Fix] ✅ 使用真实位置: ${res.city} (${res.lat}, ${res.lon})`);
      $done({ response: { status: 200, body: JSON.stringify(fixedResponse) } });
    } else {
      console.log("[Apple Geo Fix] ⚠️ 获取地理信息失败，返回原始结果");
      $done({});
    }

  } catch (e) {
    console.log("[Apple Geo Fix] ❌ 错误: " + e);
    $done({});
  }
})();
