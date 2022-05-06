import Promise from "bluebird";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";

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

export const verifySignature = (nonce, signature, publicKey, walletType) => {
  try {
    let verified = false;
    if (walletType === "solana") {
      const signatureBytes = bs58.decode(signature);
      const messageBytes = new TextEncoder().encode(nonce);
      const publicKeyBytes = bs58.decode(publicKey);
      verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );
    } else {
      const messageBufferHex = bufferToHex(Buffer.from(nonce, "utf8"));
      const retrievedAddress = recoverPersonalSignature({
        data: messageBufferHex,
        sig: signature,
      });
      verified = retrievedAddress.toLowerCase() === publicKey.toLowerCase();
    }
    return verified;
  } catch {
    return false;
  }
};
