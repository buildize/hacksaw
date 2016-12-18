.all
====

Returns all object of the store context.

### Usage
```javascript
Model.all
```


### Example
```javascript
@model class Product {}

Product.context('ctx1').put({ id: 1 });
Product.context('ctx2').put({ id: 2 });

Product.all // [Product(id: 1), Product(id: 2)]
Product.context('ctx1').all // [Product(id: 1)]
Product.context('ctx2').all // [Product(id: 2)]
Product.context('ctx3').all // []
```
