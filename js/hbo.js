/*
 * HBO Max服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.1
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
      url: 'https://www.max.com',
      headers: REQUEST_HEADERS,
    }
    
    $httpClient.get(option, function (error, response, data) {
      if (error) {
        resolve('检测失败，请重试')
        return
      }

      if (response.status === 403) {
        resolve('未支持 🚫')
        return
      }
      
      if (response.status !== 200) {
        resolve('检测失败，请重试')
        return
      }
      
      // 检查是否有地区限制信息
      if (data.indexOf('unavailable in your region') !== -1 || 
          data.indexOf('not available in your region') !== -1 ||
          data.indexOf('currently not available') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      // 尝试获取地区信息
      let region = ''
      let re = new RegExp('"country(?:Code)?":"([A-Z]{2})"', 'i')
      let match = data.match(re)
      
      if (match && match[1]) {
        region = match[1].toUpperCase()
        resolve('已解锁 ➟ ' + region)
        return
      }
      
      // 检查是否包含特定内容标记
      if (data.indexOf('sign in') !== -1 || 
          data.indexOf('sign up') !== -1 || 
          data.indexOf('Sign In') !== -1 ||
          data.indexOf('subscribe') !== -1 ||
          data.indexOf('Subscribe') !== -1) {
        resolve('已解锁 ✓')
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 
