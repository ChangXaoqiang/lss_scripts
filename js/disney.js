/*
 * Disney+服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.1
 */

const { REQUEST_HEADERS, STATUS_AVAILABLE, STATUS_NOT_AVAILABLE, STATUS_ERROR } = require('./common')

// 主函数
;(async () => {
  let result = await checkDisneyPlus()
  $done({
    title: 'Disney+',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#1A3676',
  })
})()

async function checkDisneyPlus() {
  return new Promise((resolve) => {
    let opts = {
      url: 'https://www.disneyplus.com',
      headers: REQUEST_HEADERS,
    }

    $httpClient.get(opts, function (error, response, data) {
      if (error) {
        resolve('检测失败，请重试')
        return
      }

      if (response.status !== 200 || data.indexOf('Sorry, Disney+ is not available in your region.') !== -1) {
        resolve('未支持 🚫')
        return
      }

      // 提取地区信息
      let region = ''
      let match = data.match(/Region: ([A-Za-z]{2})/)
      if (match) {
        region = match[1].toUpperCase()
      }

      // 检查是否支持
      if (data.indexOf('Disney+ is available in your region') !== -1 || data.indexOf('Start Streaming') !== -1) {
        resolve(region ? `已解锁 ➟ ${region}` : '已解锁 ✓')
      } else {
        resolve('未支持 🚫')
      }
    })
  })
} 
