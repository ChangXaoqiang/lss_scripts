/*
 * China Unicom 去广告脚本
 * 功能：
 * 1. 移除主页顶部按钮 (通通 / 签到)
 * 2. 移除主页浮窗和底部推广
 * 3. 移除搜索框推广
 */

function safeParse(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    console.log("❌ JSON parse error:", e.message);
    return null;
  }
}

function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.log("❌ JSON stringify error:", e.message);
    return "{}";
  }
}

let url = $request.url;
let body = $response.body;

if (url.includes("/clientIndex/v1/api/navHome")) {
  // 移除主页几个小按钮: 通通 + 签到
  let obj = safeParse(body);
  if (obj?.datas?.homeTopMenuItems) {
    obj.datas.homeTopMenuItems = obj.datas.homeTopMenuItems.filter(
      (item) => item.menuName !== "通通" && item.menuName !== "签到"
    );
    body = safeStringify(obj);
  }
}

else if (url.includes("/clientIndex/homefusion/fuInter")) {
  // 移除主页浮窗和底部推广
  let obj = safeParse(body);
  if (obj) {
    if (obj["HomeFusion.fuchuangAdv_A8"]) {
      delete obj["HomeFusion.fuchuangAdv_A8"];
    }
    if (obj["HomeFusion.bottomLabel"]) {
      delete obj["HomeFusion.bottomLabel"];
    }
    body = safeStringify(obj);
  }
}

else if (url.includes("/search_service/tyfbSearch/searchDiscoverListExpress")) {
  // 移除搜索发现推荐
  let obj = safeParse(body);
  if (obj?.data) {
    obj.data = [];
    body = safeStringify(obj);
  }
}

else if (url.includes("/search_service/search/searchScrollWord")) {
  // 移除搜索联想词
  let obj = safeParse(body);
  if (obj?.["113000004"]) {
    obj["113000004"] = [];
    body = safeStringify(obj);
  }
}

$done({ body });
