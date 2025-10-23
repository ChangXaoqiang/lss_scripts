// otterlife.js — OtterLife VIP unlock (robust)
try {
  if (typeof $response === "undefined" || !$response || !$response.body) {
    $done({});
  } else {
    let bodyText = $response.body;
    // 有的响应可能已经是对象（部分环境），先处理字符串
    let dataObj = typeof bodyText === "string" ? JSON.parse(bodyText) : bodyText;

    // 如果没有 data 字段就创建一个
    if (!dataObj) dataObj = {};
    if (typeof dataObj !== "object") dataObj = {};

    // 合并并覆盖 VIP 字段
    dataObj.data = {
      ...(dataObj.data || {}),
      vipType: "lifetime",
      vipDeadline: "2099-09-09T09:09:09.000Z",
      isVip: true
    };

    $done({ body: JSON.stringify(dataObj) });
  }
} catch (e) {
  // 出错时不要阻断原始响应，方便排查
  // 在 Loon 的脚本日志里能看到异常信息（如果支持）
  $done({});
}
