/*
 * Spotify服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.1
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_spotify()
  $done({
    title: 'Spotify',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#1DB954',
  })
})()

async function check_spotify() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://open.spotify.com',
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
      
      if (data.indexOf('Spotify is currently not available in your country') !== -1 || 
          data.indexOf('Spotify is not available in') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      // 检查是否包含Premium内容标记
      if (data.indexOf('premium-upsell') !== -1) {
        let region = ''
        let re = new RegExp('"countryCode":"([A-Z]{2})"', 'i')
        let match = data.match(re)
        
        if (match && match[1]) {
          region = match[1].toUpperCase()
          resolve('已解锁 ➟ ' + region)
        } else {
          resolve('已解锁 ✓')
        }
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 
