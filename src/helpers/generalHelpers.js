import Promise from "bluebird";

export const promiseWhile = function (condition, action) {
  var resolver = defer();
  var loop = function () {
    if (!condition()) return resolver.resolve();
    return Promise.cast(action()).then(loop).catch(resolver.reject);
  };
  process.nextTick(loop);
  return resolver.promise;
};

// used by promiseWhile
function defer() {
  var resolve, reject;
  var promise = new Promise(function () {
    resolve = arguments[0];
    reject = arguments[1];
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise,
  };
}
