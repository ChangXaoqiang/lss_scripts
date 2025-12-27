let obj = JSON.parse($response.body);
let url = $request.url;

// Parse $argument if it's a string (Loon passes arguments as a string)
if (typeof $argument === "string") {
    try {
        $argument = JSON.parse($argument);
    } catch (e) {
        console.log("Error parsing $argument: " + e);
    }
}

const gems_key = (typeof $argument !== "undefined" && $argument?.gems != null) ? Number($argument.gems) : undefined;
const attPoints_key = (typeof $argument !== "undefined" && $argument?.attPoints != null) ? Number($argument.attPoints) : undefined;

const subscriptionApis = [/ai-assistant\/purchase-list/];
const userApis = [/telegram\/auth/, /user\/info/];
const unblockApis = [/unblock-feature/];
const bannerApis = [/adsgram\/get-banner/];
const scrollUserInfoApis = [/att\/scroll-to-earn\/user-info/];
const clearDataApis = [/att\/scroll-to-earn\/config/, /att\/scroll-to-earn\/ads-list/, /airdrop\/task-list/];

const data = obj.data || obj;

if (subscriptionApis.some(r => r.test(url))) {
    data.subscriptions?.forEach(item => {
        if (item.id === 9) Object.assign(item, { isInApp: true, isActive: 1 });
    });
    Object.assign(data, {
        topUpBalance: [],
        lifetime_subscription: true,
        store_subscription: true,
        subscription: true
    });
}
else if (userApis.some(r => r.test(url))) {
    Object.assign(data.user, {
        lifetime_subscription: true,
        subscription: true,
        store_subscription: true,
        subscriptionPlus: true
    });
}
else if (unblockApis.some(r => r.test(url))) {
    Object.assign(data, { premium: true, settings: Object.assign(data.settings || {}, { max_pinned_chats: 9999 }) });
}
else if (bannerApis.some(r => r.test(url))) {
    Object.assign(data, { device: {}, user: { is_premium: true } });
}
else if (scrollUserInfoApis.some(r => r.test(url))) {
    Object.assign(data, { enabled: false, enabledAds: false, collectUserActions: false, enableCoinAnimation: false, autopilot: false });
    data.placementSettings?.forEach(item => item.enabled = false);
}
else if (clearDataApis.some(r => r.test(url))) {
    if (Array.isArray(data)) data.length = 0;
    else if (Array.isArray(data.data)) data.data = [];
}

function modifyBalances(o) {
    if (o && typeof o === "object") {
        for (let key in o) {
            if (key === "gems_balance" && gems_key != null) o[key] = gems_key;
            else if (key === "attPoints" && attPoints_key != null) o[key] = attPoints_key;
            else if (typeof o[key] === "object") modifyBalances(o[key]);
        }
    }
}

modifyBalances(data);

$done({ body: JSON.stringify(obj) });
