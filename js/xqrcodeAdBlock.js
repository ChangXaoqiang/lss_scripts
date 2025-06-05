// xqrcodeAdBlock.js
// 中文注释：拦截包含广告横幅 Cookie 的请求
// 适用于 scanpay.tdzntech.com 的 /scanpay/xqrcode 页面广告过滤

if ($request.headers["Cookie"] && $request.headers["Cookie"].includes("ad_isOpenBanner")) {
  console.log("广告横幅请求已拦截: " + $request.url);
  $done({ status: "HTTP/1.1 403 Forbidden", body: "广告横幅请求已拦截" });
} else {
  $done({});
}