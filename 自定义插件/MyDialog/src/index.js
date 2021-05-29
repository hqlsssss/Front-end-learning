//  一个可复用的插件需要满足以下条件：
// 插件自身的作用域与用户当前的作用域相互独立，也就是插件内部的私有变量不能影响使用者的环境变量；
// 插件需具备默认设置参数；
// 插件除了具备已实现的基本功能外，需提供部分API，使用者可以通过该API修改插件功能的默认参数，从而实现用户自定义插件效果；
// 插件支持链式调用；
// 插件需提供监听入口，及针对指定元素进行监听，使得该元素与插件响应达到插件效果。

; (function (undefined) {
  "use strict"
  var _global;

  // 对象合并
  // 将调用者自己设置的选项与默认选项进行合并或者覆盖掉默认值
  function extend(o, n, override) {
    for (var key in n) {
      if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
        o[key] = n[key];
      }
    }
    return o;
  }

  // 自定义模板引擎
  function templateEngine(html, data) {
    // ^在方括号中使用时，表示不接受该方括号表达式中的字符集合，即排除^和%
    var re = /<%([^%>]+)?%>/g,
      reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
      code = 'var r=[];\n',
      cursor = 0;
    var match;
    var add = function (line, js) {
      js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add;
    }
    while (match = re.exec(html)) {
      add(html.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
  }

  // 通过class查找dom
  // 在原型上添加getElementsByClass方法
  if (!('getElementsByClass' in HTMLElement)) {
    HTMLElement.prototype.getElementsByClass = function (n, tar) {
      var el = [],
        _el = (!!tar ? tar : this).getElementsByTagName('*');
      for (var i = 0; i < _el.length; i++) {
        if (!!_el[i].className && (typeof _el[i].className == 'string') && _el[i].className.indexOf(n) > -1) {
          el[el.length] = _el[i];
        }
      }
      return el;
    };
    ((typeof HTMLDocument !== 'undefined') ? HTMLDocument : Document).prototype.getElementsByClass = HTMLElement.prototype.getElementsByClass;
  }

  function MyDialog(opt) {
    this._initial(opt)
  }

  MyDialog.prototype = {
    constructor: this,
    _initial: function (opt) {
      // 默认参数
      var def = {
        ok: true,
        ok_txt: '确定',
        cancel: false,
        cancel_txt: '取消',
        confirm: function () { },
        close: function () { },
        content: '',
        tmpId: null
      };
      this.def = extend(def, opt, true); //配置参数
      this.tpl = this._parseTpl(this.def.tmpId); //模板字符串
      this.dom = this._parseToDom(this.tpl)[0]; //存放在实例中的节点
      this.hasDom = false; //检查dom树中dialog的节点是否存在
      this.listeners = []; //自定义事件，用于监听插件的用户交互
      this.handlers = {};
    },
    _parseTpl: function (tmpId) { // 将模板转为字符串
      var data = this.def;
      var tplStr = document.getElementById(tmpId).innerHTML.trim();
      return templateEngine(tplStr, data);
    },
    _parseToDom: function (str) { // 将字符串转为dom
      var div = document.createElement('div');
      if (typeof str == 'string') {
        div.innerHTML = str;
      }
      return div.childNodes;
    },
    show: function (callback) {
      var _this = this;
      if (this.hasDom) return;
      if (this.listeners.indexOf('show') > -1) {
        // 如果弹框出现之后，没有回调函数执行就
        if (!this.emit({ type: 'show', target: this.dom })) return;
      }
      document.body.appendChild(this.dom);
      this.hasDom = true;
      this.dom.getElementsByClass('close')[0].onclick = function () {
        _this.hide();
        // 点击关闭查看是否有回调函数执行
        if (_this.listeners.indexOf('close') > -1) {
          _this.emit({ type: 'close', target: _this.dom })
        }
        !!_this.def.close && _this.def.close.call(this, _this.dom);
      };
      this.dom.getElementsByClass('btn-ok')[0].onclick = function () {
        _this.hide();
        // 点击确认之后查看是否有回调函数要执行
        if (_this.listeners.indexOf('confirm') > -1) {
          _this.emit({ type: 'confirm', target: _this.dom })
        }
        !!_this.def.confirm && _this.def.confirm.call(this, _this.dom);
      };
      if (this.def.cancel) {
        this.dom.getElementsByClass('btn-cancel')[0].onclick = function () {
          _this.hide();
          // 点击取消之后执行回调函数
          if (_this.listeners.indexOf('cancel') > -1) {
            _this.emit({ type: 'cancel', target: _this.dom })
          }
        };
      }
      callback && callback();
      if (this.listeners.indexOf('shown') > -1) {
        this.emit({ type: 'shown', target: this.dom })
      }
      return this;
    },
    hide: function (callback) {
      // 弹框隐藏之后执行回调函数
      if (this.listeners.indexOf('hide') > -1) {
        if (!this.emit({ type: 'hide', target: this.dom })) return;
      }
      document.body.removeChild(this.dom);
      this.hasDom = false;
      callback && callback();
      // 弹框
      if (this.listeners.indexOf('hidden') > -1) {
        this.emit({ type: 'hidden', target: this.dom })
      }
      return this;
    },
    modifyTpl: function (template) {
      if (!!template) {
        if (typeof template == 'string') {
          this.tpl = template;
        } else if (typeof template == 'function') {
          this.tpl = template();
        } else {
          return this;
        }
      }
      this.dom = this._parseToDom(this.tpl)[0];
      return this;
    },
    css: function (styleObj) {
      for (var prop in styleObj) {
        var attr = prop.replace(/[A-Z]/g, function (word) {
          return '-' + word.toLowerCase();
        });
        this.dom.style[attr] = styleObj[prop];
      }
      return this;
    },
    width: function (val) {
      this.dom.style.width = val + 'px';
      return this;
    },
    height: function (val) {
      this.dom.style.height = val + 'px';
      return this;
    },
    on: function (type, handler) {
      // type: show, shown, hide, hidden, close, confirm
      if (typeof this.handlers[type] === 'undefined') {
        this.handlers[type] = [];
      }
      this.listeners.push(type);
      this.handlers[type].push(handler);
      return this;
    },
    off: function (type, handler) {
      if (this.handlers[type] instanceof Array) {
        var handlers = this.handlers[type];
        for (var i = 0, len = handlers.length; i < len; i++) {
          if (handlers[i] === handler) {
            break;
          }
        }
        this.listeners.splice(i, 1);
        handlers.splice(i, 1);
        return this;
      }
    },
    emit: function (event) {
      if (!event.target) {
        event.target = this;
      }
      if (this.handlers[event.type] instanceof Array) {
        var handlers = this.handlers[event.type];
        for (var i = 0, len = handlers.length; i < len; i++) {
          handlers[i](event);
          return true;
        }
      }
      return false;
    }
  }

  // 利用闭包包装 
  // js变量的调用，从全局作用域上找查的速度会比在私有作用域里面慢得多得多。所以，我们最好将插件逻辑写在一个私有作用域中。

  _global = (function () { return this || (0, eval)('this'); }())
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MyDialog;
  } else if (typeof define === "function" && define.amd) {
    define(function () { return MyDialog; });
  } else {
    !('MyDialog' in _global) && (_global.MyDialog = MyDialog);
  }
}());
