/*
 * Amazon Prime Video服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_amazon()
  $done({
    title: 'Amazon Prime',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#1F3B5F',
  })
})()

async function check_amazon() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.primevideo.com',
      headers: REQUEST_HEADERS,
    }
    
    $httpClient.get(option, function (error, response, data) {
      if (error != null || response.status !== 200) {
        resolve('检测失败，请重试')
        return
      }
      
      // 检查是否有地区限制信息
      if (data.indexOf('not available in your location') !== -1 || 
          data.indexOf('not available in your country') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      // 尝试获取地区信息
      let region = ''
      let re = new RegExp('"currentTerritory":"(.*?)"', 'gm')
      let result = re.exec(data)
      if (result != null && result.length === 2) {
        region = result[1]
        resolve('已解锁 ➟ ' + region.toUpperCase())
        return
      }
      
      // 检查是否有登录按钮，表示可以访问
      if (data.indexOf('sign in') !== -1 || 
          data.indexOf('Sign in') !== -1 || 
          data.indexOf('Sign In') !== -1) {
        resolve('已解锁 ✓')
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 