/*
 * Apple Geo Fix for Loon
 * 解决 Apple 日出日落 / 时区偏移问题
 * 原理：让 iOS 定位相关域名跳过 FakeIP，并强制直连
 * 作者：ChangXiaoqiang (ChatGPT协助)
 */

const REAL_DNS_DOMAINS = [
  "gs.apple.com",
  "gsp-ssl.ls.apple.com",
  "smp-device-content.apple.com",
  "configuration.apple.com",
  "bag.itunes.apple.com",
  "time-ios.apple.com",
  "time.apple.com",
  "pool.ntp.org",
  "ocsp.apple.com",
  "ocsp2.apple.com",
  "geolocation.onetrust.com",
  "api.apple-cloudkit.com",
  "weather-data.apple.com",
  "api.weather.com",
  "cdn.weather.com"
];

if ($domain) {
  if (REAL_DNS_DOMAINS.some(d => $domain.endsWith(d))) {
    // 强制跳过 FakeIP
    $fakeDNS = false;

    // 强制直连
    $policy = "DIRECT";

    $done({ matched: true, policy: $policy });
  } else {
    $done({ matched: false });
  }
} else {
  $done({});
}
