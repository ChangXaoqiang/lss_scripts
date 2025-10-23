/*
 * YouTube服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_youtube_premium()
  $done({
    title: 'YouTube',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#FF0000',
  })
})()

async function check_youtube_premium() {
  let inner_check = () => {
    return new Promise((resolve, reject) => {
      let option = {
        url: 'https://www.youtube.com/premium',
        headers: REQUEST_HEADERS,
      }
      $httpClient.get(option, function (error, response, data) {
        if (error != null || response.status !== 200) {
          reject('Error')
          return
        }

        if (data.indexOf('Premium is not available in your country') !== -1) {
          resolve('Not Available')
          return
        }

        let region = ''
        let re = new RegExp('"countryCode":"(.*?)"', 'gm')
        let result = re.exec(data)
        if (result != null && result.length === 2) {
          region = result[1]
        } else if (data.indexOf('www.google.cn') !== -1) {
          region = 'CN'
        } else {
          region = 'US'
        }
        resolve(region)
      })
    })
  }

  let result = ''

  await inner_check()
    .then((code) => {
      if (code === 'Not Available') {
        result = '不支持解锁'
      } else {
        result = '已解锁 ➟ ' + code.toUpperCase()
      }
    })
    .catch((error) => {
      result = '检测失败，请重试'
    })

  return result
} 