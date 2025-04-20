// 伪造更新检测响应内容
const response = {
  status: 200,
  headers: { "Content-Type": "application/xml" },
  body: `
    <?xml version="1.0" encoding="UTF-8"?>
    <root>
      <message>您的软件已是最新版本。</message>
      <update>
        <version>16.0</version>
        <build>20A362</build>
      </update>
    </root>
  `
};

$done(response);
