/*
 * ChatGPT App服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_chatgpt_app()
  $done({
    title: 'ChatGPT App',
    content: result,
    icon: 'text.bubble.fill',
    'icon-color': '#74AA9C',
  })
})()

async function check_chatgpt_app() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://ios.chat.openai.com/api/health',
      headers: {
        ...REQUEST_HEADERS,
        'Accept': '*/*',
      },
    }
    
    $httpClient.get(option, function (error, response, data) {
      if (error != null) {
        resolve('检测失败，请重试')
        return
      }
      
      if (response.status === 403 || response.status === 404) {
        resolve('未支持访问 🚫')
        return
      }
      
      if (response.status === 200) {
        try {
          let obj = JSON.parse(data)
          if (obj.status === 'ok') {
            resolve('支持访问 ✓')
            return
          }
        } catch (e) {
          // 解析错误，继续处理
        }
      }
      
      resolve('检测失败，请重试')
    })
  })
} 