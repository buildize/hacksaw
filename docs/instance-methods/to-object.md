\#toObject
==========

Returns the instance as plain object.

### Usage
```javascript
instance.toObject();
```

### Example
```javascript
@model class Product {}

const product = new Product;
product.set({ id: 5, name: 'hello' });
product.toObject(); // Object(id: 5, name: 'hello')
```
