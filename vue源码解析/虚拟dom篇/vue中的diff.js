// 在Vue中，把 DOM-Diff过程叫做patch过程

// 创建节点---新的vnode有而旧的vnode没有,在旧的oldVNode中创建。
function createElm (vnode, parentElm, refElm) {
  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    // 判断元素节点是否有tag
    //代码中的nodeOps是Vue为了跨平台兼容性，对所有节点操作进行了封装，例如nodeOps.createTextNode()在浏览器端等同于document.createTextNode()
    vnode.elm = nodeOps.createElement(tag, vnode)   // 创建元素节点
    createChildren(vnode, children, insertedVnodeQueue) // 创建元素节点的子节点
    insert(parentElm, vnode.elm, refElm)       // 插入到DOM中
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)  // 创建注释节点
    insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)  // 创建文本节点
    insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
  }
}

// 删除节点
// 新的VNode中没有而旧的oldVNode中有，就从旧的oldVNode中删除。
function removeNode (el) {
  const parent = nodeOps.parentNode(el)  // 获取父节点
  if (isDef(parent)) {
    nodeOps.removeChild(parent, el)  // 调用父节点的removeChild方法
  }
}

//更新节点：新的VNode和旧的oldVNode中都有，就以新的VNode为准，更新旧的oldVNode。
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // vnode与oldVnode是否完全一样？若是，退出程序
  if (oldVnode === vnode) {
    return
  }
  //令新的vnode的真实dom等于旧的vnode的真实dom
  vnode.elm = oldVnode.elm
  const elm = vnode.elm

  // vnode与oldVnode是否都是静态节点？若是，退出程序
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    return
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  // vnode有text属性？若没有：
  if (isUndef(vnode.text)) {
    // vnode的子节点与oldVnode的子节点是否都存在？
    if (isDef(oldCh) && isDef(ch)) {
      // 若都存在，判断子节点是否相同，不同则更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    }
    // 若只有vnode的子节点存在
    else if (isDef(ch)) {
      /**
       * 判断oldVnode是否有文本？
       * 若没有，则把vnode的子节点添加到真实DOM中
       * 若有，则清空Dom中的文本，再把vnode的子节点添加到真实DOM中
       */
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    // 若只有oldnode的子节点存在
    else if (isDef(oldCh)) {
      // 清空DOM中的子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 若vnode和oldnode都没有子节点，但是oldnode中有文本
    else if (isDef(oldVnode.text)) {
      // 清空oldnode文本
      nodeOps.setTextContent(elm, '')
    }
    // 上面两个判断一句话概括就是，如果vnode中既没有text，也没有子节点，那么对应的oldnode中有什么就清空什么
  }
  // 如果VNode是文本节点即表示这个节点内只包含纯文本，那么只需看oldVNode是否也是文本节点，
  // 如果是，那就比较两个文本是否不同，如果不同则把oldVNode里的文本改成跟VNode的文本一样。
  // 如果oldVNode不是文本节点，那么不论它是什么，直接调用setTextNode方法把它改成文本节点，并且文本内容跟VNode相同。
  // 若有，vnode的text属性与oldVnode的text属性是否相同？
  else if (oldVnode.text !== vnode.text) {
    // 若不相同：则用vnode的text替换真实DOM的文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}
