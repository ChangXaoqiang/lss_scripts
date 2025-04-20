const $ = API();
let body = $response.body;

// 构造一个"已是最新版本"的响应
const updatedBody = {
    "IndividualProductDetails": {},
    "Assets": [],
    "AllProducts": [],
    "NotificationMessages": [],
    "ProductVersion": "16.0",
    "DocumentationURL": "",
    "ExtendedMetaInfo": ""
};

$done({ body: JSON.stringify(updatedBody) });
