// 防抖---短时间内大量触发同一个事件，只会执行一次函数
// 当用户多次触发回调函数时，只触发最后一次操作的，其余的全部忽略掉
// 在第一次触发事件时，不立即执行函数，而是给出一个延迟时间
// 如果在延迟时间内没有再次触发事件，那么就执行函数
// 如果在延迟时间内再次触发事件，就取消计时，重新计时

function debounce(fn,delay){
  var timer = null
  return function(){
    if(timer){
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(fn,delay)
  }
}

// 节流---让函数执行一次之后，在某个时间段内暂时失效，过了这段时间再次激活
function throttole(fn,delay){
  var flag = false
  return function(){
    if(flag)return
    else{
      flag = true
      setTimeout(() => {
        fn()
        flag = false
      }, delay);
    }
  }
}

