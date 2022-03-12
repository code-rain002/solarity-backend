import Promise from "bluebird";
import nacl from "tweetnacl";
import bs58 from "bs58";

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

export const verifySignature = (message, signature, publicAddress) => {
  try {
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);
    const publicKeyBytes = bs58.decode(publicAddress);
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    return verified;
  } catch {
    return false;
  }
};
