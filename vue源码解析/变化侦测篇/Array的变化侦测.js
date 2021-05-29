
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}


// 创建一个对象作为拦截器
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

// 改变数组自身内容的7个方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
// 改变数组自身的7个方法遍历逐个进行封装
methodsToPatch.forEach(function(method){
  const original = arrayProto[method]      // 缓存原生方法
  Object.defineProperty(arrayMethods, method, {
    enumerable: false,
    configurable: true,
    writable: true,
    value:function mutator(...args){
      const result = original.apply(this, args)
      // 由于拦截器是挂载到数组数据的原型上的，所以拦截器中的this就是数据value，
      // 拿到value上的Observer类实例，从而就可以调用Observer类实例上面依赖管理器的dep.notify()方法，以达到通知依赖的目的。
      const ob = this.__ob__
      ob.dep.notify()
      return result
    }
  }) 
})


function observe (value, asRootData){
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

function defineReactive (obj,key,val) {
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get(){
      if (childOb) {
        // 收集依赖
        childOb.dep.depend()
      }
      return val;
    },
    set(newVal){
      if(val === newVal){
        return
      }
      val = newVal;
      // 在setter中通知依赖更新
      childOb.dep.notify()   
    }
  })
}


// 把数组数据的__proto__属性设置为拦截器arrayMethods
class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 数组类型
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      // 进行深度侦测
      // 对于Array型数据，调用了observeArray()方法
      
      this.observeArray(value)
    } else {
      // object类型
      this.walk(value)
    }
  }
  
  // 调用observe函数将每一个元素都转化成可侦测的响应式数据。
  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

  walk(obj) {
    // Object.keys返回object上可枚举的属性
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}
// 能力检测：判断__proto__是否可用，因为有的浏览器不支持该属性
const hasProto = '__proto__' in {}

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  target.__proto__ = src
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}


