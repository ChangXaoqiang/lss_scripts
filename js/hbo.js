/*
 * HBO Max服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_hbo()
  $done({
    title: 'HBO Max',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#8B00FF',
  })
})()

async function check_hbo() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.hbomax.com/',
      headers: REQUEST_HEADERS,
    }
    
    $httpClient.get(option, function (error, response, data) {
      if (error != null || response.status !== 200) {
        resolve('检测失败，请重试')
        return
      }
      
      // 检查是否有地区限制信息
      if (data.indexOf('unavailable in your region') !== -1 || 
          data.indexOf('not available in your region') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      // 尝试获取地区信息
      let region = ''
      let re = new RegExp('"country":"(.*?)"', 'gm')
      let result = re.exec(data)
      if (result != null && result.length === 2) {
        region = result[1]
        resolve('已解锁 ➟ ' + region.toUpperCase())
        return
      }
      
      // 如果没有明确的地区限制信息，但能访问，则认为解锁
      if (data.indexOf('sign in') !== -1 || 
          data.indexOf('sign up') !== -1 || 
          data.indexOf('Sign In') !== -1) {
        resolve('已解锁 ✓')
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 