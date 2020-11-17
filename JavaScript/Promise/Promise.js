/**
 * Promise A+ 规范 https://promisesaplus.com/
 *
 * new Promise 需传递一个 executor，executor 立即执行
 * Promise 有 then 方法，返回一个 Promise
 * then 内函数的返回结果会作为参数传递给下一个 then 的回调（resolve / reject）
 */

// 状态变化
// PENDING -> FULFOLLED
// PENDING -> REJECTED
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise(executor) {
  const self = this;
  self.status = PENDING;
  // promise 状态成功的值
  this.value = null;
  // promise 状态失败的值
  this.reason = null;
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

Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };

  const self = this;
  const promise2 = new Promise((resolve, reject) => {
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
  // 当 x 是 Promise 时，情况同调用 then 方法一致
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
      // then 不是一个 function 完成 Promise
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
  // x 不是 object 或者 function 完成 Promise
  else {
    resolve(x);
  }
}
