/*
 * Amazon Prime Video服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.1
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
      if (data.indexOf('not available in your location') !== -1 || 
          data.indexOf('not available in your country') !== -1 ||
          data.indexOf('unavailable in your region') !== -1 ||
          data.indexOf('currently unavailable') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      // 尝试获取地区信息
      let region = ''
      let patterns = [
        /"currentTerritory":"([A-Z]{2})"/, 
        /"countryCode":"([A-Z]{2})"/, 
        /"country":"([A-Z]{2})"/
      ]
      
      for (let pattern of patterns) {
        let match = data.match(pattern)
        if (match && match[1]) {
          region = match[1].toUpperCase()
          break
        }
      }
      
      // 检查是否包含特定内容标记
      if (data.indexOf('prime-video-container') !== -1 ||
          data.indexOf('pv-nav-sign-in') !== -1 ||
          data.indexOf('prime-header') !== -1) {
        resolve(region ? `已解锁 ➟ ${region}` : '已解锁 ✓')
        return
      }
      
      // 检查登录按钮
      if (data.indexOf('sign in') !== -1 || 
          data.indexOf('Sign in') !== -1 || 
          data.indexOf('Sign In') !== -1) {
        resolve(region ? `已解锁 ➟ ${region}` : '已解锁 ✓')
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 
