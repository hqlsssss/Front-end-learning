// 四个操作会忽略enumerable为false的属性。
//for...in循环：只遍历对象自身的和继承的可枚举的属性。
//Object.keys()：返回对象自身的所有可枚举的属性的键名。
//JSON.stringify()：只串行化对象自身的可枚举的属性。
//Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
//只有for...in会返回继承的属性，其他三个方法都会忽略继承的属性
//ES6 规定，所有 Class 的原型的方法都是不可枚举的。

// super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。
//ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"

//JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）或
// Object.getPrototypeOf(this).foo.call(this)（方法）。
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
};

const obj = {
  x: 'world',
  foo() {
    super.foo();
  }
}

Object.setPrototypeOf(obj, proto);

obj.foo() // "world"