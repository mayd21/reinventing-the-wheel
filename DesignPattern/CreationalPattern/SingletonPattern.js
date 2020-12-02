/**
 * 标准单例模式
 * 问题：
 * 1 不够“透明”，无法使用 new 进行实例化，需要对实例化的方法进行约束，只能使用 getInstace()
 * 2 管理单例的操作与对象创建的操作耦合在一起，不符合单一职责原则
 */
const Singleton = function (name) {
  this.name = name;
  this.instance = null;
};

Singleton.prototype.getName = function () {
  console.log(this.name);
};

Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
};
// test
const a1 = Singleton.getInstance("a1");
const a2 = Singleton.getInstance("a2");
a1.getName(); // a1
a2.getName(); // a1
console.log(a1 === a2); // true

/**
 * 透明单例
 * 统一使用 new 操作符常见单例
 */
const CreateSingleton = (function () {
  let instance = null;
  function create(name) {
    if (instance) {
      return instance;
    }
    this.name = name;
    return (instance = this);
  }
  create.prototype.getName = function () {
    console.log(this.name);
  };
  return create;
})();
// test
const b1 = new CreateSingleton("b1");
const b2 = new CreateSingleton("b2");
console.log(b1 === b2);

/**
 * 代理模式单例
 * 将管理单例和创建对象的操作进行拆分，符合单一职责原则
 */
// 独立的对象创建类
const ProxySingleton = function (name) {
  this.name = name;
};
ProxySingleton.prototype.getName = function () {
  console.log(this.name);
};

const ProxyCreateSingleton = (function () {
  let instance = null;
  return function (name) {
    if (!instance) {
      // 代理给 ProxySingleton
      instance = new ProxySingleton(name);
    }
    return instance;
  };
})();
// test
const c1 = new ProxyCreateSingleton("c1");
const c2 = new ProxyCreateSingleton("c2");
console.log(c1 === c2);

/**
 * 惰性单例
 * 需要时才创建实例化对象，对于懒加载的性能优化
 */
// 获取单例
const getSingleton = function (fn) {
  let instance = null;
  return function () {
    return instance || (instance = fn.apply(this, arguments));
  };
};
// 创建 div
const createDiv = function (html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.style.display = "none";
  document.body.appendChild(div);
  return div;
};
// 获取单例的 div
const createSingletonDiv = getSingleton(createDiv);
