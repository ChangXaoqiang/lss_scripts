/*
 * Spotify服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
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
      if (error != null || response.status !== 200) {
        resolve('检测失败，请重试')
        return
      }
      
      if (data.indexOf('Spotify is currently not available in your country') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      let region = ''
      let re = new RegExp('"countryCode":"(.*?)"', 'gm')
      let result = re.exec(data)
      if (result != null && result.length === 2) {
        region = result[1]
        resolve('已解锁 ➟ ' + region.toUpperCase())
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 