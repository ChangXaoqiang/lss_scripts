/*
 * ChatGPT Web服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_chatgpt_web()
  $done({
    title: 'ChatGPT Web',
    content: result,
    icon: 'text.bubble.fill',
    'icon-color': '#74AA9C',
  })
})()

async function check_chatgpt_web() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://chat.openai.com/api/auth/session',
      headers: {
        ...REQUEST_HEADERS,
        'Accept': '*/*',
        'Referer': 'https://chat.openai.com/auth/login',
      },
    }
    
    $httpClient.get(option, function (error, response, data) {
      if (error != null) {
        resolve('检测失败，请重试')
        return
      }
      
      if (response.status === 403) {
        resolve('未支持访问 🚫')
        return
      }
      
      if (response.status === 200) {
        resolve('支持访问 ✓')
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 