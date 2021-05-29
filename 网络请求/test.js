Promise.resolve().then(()=>{
  console.log('promise1')
  setTimeout(() => {
    console.log('settimeout2')
  }, 0);
})

setTimeout(() => {
  console.log('settimout1')
  Promise.resolve().then(()=>{
    console.log('promise2')
  })
}, 0);