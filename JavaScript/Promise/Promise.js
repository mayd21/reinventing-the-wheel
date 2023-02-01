/**
 * Promise A+ 规范 https://promisesaplus.com/
 *
 * new MyPromise 需传递一个 executor，executor 立即执行
 * MyPromise 有 then 方法，返回一个 MyPromise
 * then 内函数的返回结果会作为参数传递给下一个 then 的回调（resolve / reject）
 */

// 状态变化
// PENDING -> FULFILLED
// PENDING -> REJECTED
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  const self = this;
  self.status = PENDING;
  // promise 状态成功的值
  self.value = null;
  // promise 状态失败的值
  self.reason = null;
  self.onFulfilled = [];
  self.onRejected = [];

  // executor 的两个参数
  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled.forEach((fn) => fn(value));
    }
  }
  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      self.onRejected.forEach((fn) => fn(reason));
    }
  }

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };

  const self = this;
  const promise2 = new MyPromise((resolve, reject) => {
    if (self.status === FULFILLED) {
      setTimeout(() => {
        try {
          const x = onFulfilled(self.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    } else if (self.status === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    } else if (self.status === PENDING) {
      self.onFulfilled.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      self.onRejected.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(self.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });
  return promise2;
};

function resolvePromise(promise2, x, resolve, reject) {
  const self = this;
  if (promise2 === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }
  // 当 x 是 MyPromise 时，情况同调用 then 方法一致
  if ((x && typeof x === "object") || typeof x === "function") {
    // 如果存在 resolve 和 reject 都被调用的情况，那么第一个优先调用，后面忽略
    let used = false;
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          // 如果 resolve 以值 y 被调用，执行 resolvePromise
          (y) => {
            if (used) return;
            used = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          // 如果 reject 以值 r 被调用，reject promise
          (r) => {
            if (used) return;
            used = true;
            reject(r);
          }
        );
      }
      // then 不是一个 function 完成 MyPromise
      else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (error) {
      if (used) return;
      used = true;
      reject(error);
    }
  }
  // x 不是 object 或者 function 完成 MyPromise
  else {
    resolve(x);
  }
}

// MyPromise 其他方法

// 返回一个以给定值解析后的 MyPromise 对象
MyPromise.resolve = function (param) {
  // param 为 MyPromise 不做处理直接返回
  if (param instanceof MyPromise) {
    return param;
  }
  return new MyPromise((resolve, reject) => {
    // param 是一个 thenable 对象， 返回的 MyPromise 跟随这个 thenable 对象，采用它的最终状态
    if (param && param.then && typeof param.then === "function") {
      setTimeout(() => {
        param.then(resolve, reject);
      });
    } else {
      resolve(param);
    }
  });
};

// 直接将参数原封不动的作为 reject 的理由，最为后续的方法的参数
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

// 返回一个 MyPromise 对象
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    let index = 0;
    let result = [];
    // promises 是一个空的可迭代对象，promise 直接回调完成 resolve
    // 只有此情况是同步执行，其他情况均为异步
    if (promises.length === 0) {
      resolve(result);
    } else {
      function processValue(i, data) {
        result[i] = data;
        // 当所有 promise 都完成时回调完成
        if (++index === promises.length) {
          resolve(result);
        }
      }
      // 传入的值为可迭代的对象
      for (let i = 0; i < promises.length; i++) {
        // promises[i] 可能为普通值，而非 Promise，采用 MyPromise.resolve 进行异步处理
        MyPromise.resolve(promises[i]).then(
          (data) => {
            processValue(i, data);
          },
          (error) => {
            // 有一个失败则直接返回
            reject(error);
            return;
          }
        );
      }
    }
  });
};

// 返回一个 MyPromise
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    // 传入的为空数组，promise 将永远等待
    if (promises.length === 0) return;
    for (let i = 0; i < promises.length; i++) {
      // 解析为迭代中的第一个值结束
      MyPromise.resolve(promises[i]).then(
        (data) => {
          resolve(data);
          return;
        },
        (error) => {
          reject(error);
          return;
        }
      );
    }
  });
};

// 指定出错时的回调，catch 之后可以继续 .then
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

// 无论成功失败都会执行 finally，并且之后还可以继续 .then
MyPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => {
      return MyPromise.resolve(callback()).then(() => {
        return value;
      });
    },
    (error) => {
      return MyPromise.resolve(callback()).then(() => {
        return error;
      });
    }
  );
};
