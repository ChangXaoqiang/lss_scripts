/*******************************

[rewrite_local]

^http[s]?:\/\/www.xiaoxiongyouhao.com\/api\/vip\/index.php url script-response-body https://raw.githubusercontent.com/ChangXaoqiang/script/refs/heads/main/Stash/xxyh.js

[mitm] 

hostname = www.xiaoxiongyouhao.com

*******************************/

var body = $response.body.replace(/vip_state":\d/g,'vip_state":2')
.replace(/membership_days":\d+/g,'membership_days":888')
.replace(/vip_valid_till_date":".*?"/g,'vip_valid_till_date":"2099年12月31日"')
$done({ body });