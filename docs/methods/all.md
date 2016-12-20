.all
====

Returns all object of the store context.

### Usage
```javascript
Store.all
```


### Example
```javascript
@store class Product {}

Product.context('ctx1').put({ id: 1 });
Product.context('ctx2').put({ id: 2 });

Product.all // [Object(id: 1), Object(id: 2)]
Product.context('ctx1').all // [Object(id: 1)]
Product.context('ctx2').all // [Object(id: 2)]
Product.context('ctx3').all // []
```
