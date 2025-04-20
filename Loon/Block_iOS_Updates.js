const $ = API();
let body = $response.body;

// 伪造 SoftwareUpdate.xml 响应，始终显示“已是最新版本”
const latestVersion = "iOS 17.5.1"; // 可根据实际系统版本调整
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
	<key>MobileAssetProperties</key>
	<dict>
		<key>AllowableOTA</key>
		<false/>
	</dict>
	<key>ServerMetadataURL</key>
	<string></string>
	<key>Updates</key>
	<array/>
	<key>Message</key>
	<string>您的软件已是最新版本（${latestVersion}）。</string>
	<key>ProductVersion</key>
	<string>${latestVersion}</string>
	<key>IsLatest</key>
	<true/>
	<key>IsUpdate</key>
	<false/>
</dict>
</plist>`;

$done({ body: xml, headers: { "Content-Type": "application/xml" } });
