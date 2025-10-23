/*
 * Netflix服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.0
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_netflix()
  $done({
    title: 'Netflix',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#E50914',
  })
})()

async function check_netflix() {
  let inner_check = (filmId) => {
    return new Promise((resolve, reject) => {
      let option = {
        url: 'https://www.netflix.com/title/' + filmId,
        headers: REQUEST_HEADERS,
      }
      $httpClient.get(option, function (error, response, data) {
        if (error != null) {
          reject('Error')
          return
        }

        if (response.status === 403) {
          reject('Not Available')
          return
        }

        if (response.status === 404) {
          resolve('Not Found')
          return
        }

        if (response.status === 200) {
          let url = response.headers['x-originating-url']
          let region = url.split('/')[3]
          region = region.split('-')[0]
          if (region == 'title') {
            region = 'us'
          }
          resolve(region)
          return
        }

        reject('Error')
      })
    })
  }

  let result = ''

  await inner_check(81280792)
    .then((code) => {
      if (code === 'Not Found') {
        return inner_check(80018499)
      }
      result = '已完整解锁 ➟ ' + code.toUpperCase()
      return Promise.reject('BreakSignal')
    })
    .then((code) => {
      if (code === 'Not Found') {
        return Promise.reject('Not Available')
      }

      result = '仅解锁自制剧 ➟ ' + code.toUpperCase()
      return Promise.reject('BreakSignal')
    })
    .catch((error) => {
      if (error === 'BreakSignal') {
        return
      }
      if (error === 'Not Available') {
        result = '该节点不支持解锁'
        return
      }
      result = '检测失败，请重试'
    })

  return result
} 