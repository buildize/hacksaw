export default (target, key, descriptor) => {
  target.constructor.$keys = target.constructor.$keys || [];
  target.constructor.$keys.push(key);
  if (!descriptor.get) descriptor.writable = true;
}
