export default (target, key, descriptor) => {
  target.constructor.$keys = target.constructor.$keys || [];
  target.constructor.$keys.push(key);
  descriptor.writable = true;
}
