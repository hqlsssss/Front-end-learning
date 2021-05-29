// 使用ajax封装一个可以发送get和post请求的函数
function ajax({ url, type, data }) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    // 第三个参数true表示异步请求，false表示同步
    xhr.open(type, url, true)
    if (type === "POST") {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(data))
    }
    else {
      // get请求一般不携带数据体
      xhr.send(null)
    }
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          // 请求成功
          resolve(this.responseText)
        } else {
          // 请求失败
          let res = {
            code: this.status,
            response: this.response
          }
          reject(res)
        }
      }
    }
  })
}

// axios---对原生xhr的封装
// 支持并发请求
// 可以拦截请求和响应
//自动转换json数据
// 转换请求响应数据

