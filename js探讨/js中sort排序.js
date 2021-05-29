// sort排序始终是根据元素的unicode编码进行的
var arr1 = [10, 1, 5, 2, 3];
arr1.sort();
console.log(arr1);//输出 [1,10,2,3,5]

// arr.sort(compareFunction)
// compareFunction可选。用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的诸个字符的Unicode位点进行排序。
var arr1 = [10, 1, 5, 2, 3];
function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  // a must be equal to b
  return 0;
}
arr1.sort(compare);
console.log(arr1);


// 或者简写
var arr1 = [10, 1, 5, 2, 3];
arr1.sort(function (a, b) {
  return a - b;
});
console.log(arr1);

//元素为对象时（可按其中某个属性来排序）：
var items = [
  { name: 'Edward', age: 21 },
  { name: 'Sharpe', age: 37 },
  { name: 'And', age: 45 },
  { name: 'The', age: -12 },
  { name: 'Magnetic',age:0 },
  { name: 'Zeros', age: 37 }
];
 
items.sort(function (a, b) {
  if (a.age > b.age) {
    return 1;
  }
  if (a.age< b.age) {
    return -1;
  }
  // a 必须等于 b
  return 0;
});

console.log(items)

// 打印结果
// [[object Object] {
//   age: -12,
//   name: "The"
// }, [object Object] {
//   age: 0,
//   name: "Magnetic"
// }, [object Object] {
//   age: 21,
//   name: "Edward"
// }, [object Object] {
//   age: 37,
//   name: "Sharpe"
// }, [object Object] {
//   age: 37,
//   name: "Zeros"
// }, [object Object] {
//   age: 45,
//   name: "And"
// }]