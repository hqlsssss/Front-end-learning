CACHE MANIFEST
#v0.11

CACHE:

js/app.js
css/style.css

NETWORK:
resourse/logo.png

FALLBACK:
/ /offline.html


// 离线存储的manifest一般由三个部分组成:
// 1.CACHE:表示需要离线存储的资源列表，由于包含manifest文件的页面将被自动离线存储，所以不需要把页面自身也列出来。
// 2.NETWORK:表示在它下面列出来的资源只有在在线的情况下才能访问，他们不会被离线存储，所以在离线情况下无法使用这些资源。
//   不过，如果在CACHE和NETWORK中有一个相同的资源，那么这个资源还是会被离线存储，也就是说CACHE的优先级更高。
// 3.FALLBACK:表示如果访问第一个资源失败，那么就使用第二个资源来替换他，
//   比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问offline.html。