/*
 * Hulu服务可用性检测脚本
 * 更新日期：2024.06.01
 * 版本：1.1
 */

const { REQUEST_HEADERS } = require('./common')

// 主函数
;(async () => {
  let result = await check_hulu()
  $done({
    title: 'Hulu',
    content: result,
    icon: 'play.tv.fill',
    'icon-color': '#1CE783',
  })
})()

async function check_hulu() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.hulu.com',
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
      if (data.indexOf('currently not available in your location') !== -1 || 
          data.indexOf('not available in your region') !== -1 ||
          data.indexOf('unavailable in your area') !== -1 ||
          data.indexOf('currently unavailable') !== -1) {
        resolve('未支持 🚫')
        return
      }
      
      // 检查是否包含特定内容标记
      if (data.indexOf('hulu-header') !== -1 ||
          data.indexOf('hulu-masthead') !== -1 ||
          data.indexOf('hulu-player') !== -1) {
        resolve('已解锁 ➟ US')  // Hulu主要在美国可用
        return
      }
      
      // 检查登录和注册按钮
      if (data.indexOf('Log In') !== -1 || 
          data.indexOf('LOG IN') !== -1 ||
          data.indexOf('START YOUR FREE TRIAL') !== -1 || 
          data.indexOf('SIGN UP') !== -1 ||
          data.indexOf('Sign Up') !== -1 ||
          data.indexOf('Start Free Trial') !== -1) {
        resolve('已解锁 ➟ US')  // Hulu主要在美国可用
        return
      }
      
      resolve('检测失败，请重试')
    })
  })
} 
