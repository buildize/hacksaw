.all
====

Returns all object of the store context.

### Usage
```javascript
Store.all
```


### Example
```javascript
@store class ProductStore {}

ProductStore.context('ctx1').put({ id: 1 });
ProductStore.context('ctx2').put({ id: 2 });

ProductStore.all // [Object(id: 1), Object(id: 2)]
ProductStore.context('ctx1').all // [Object(id: 1)]
ProductStore.context('ctx2').all // [Object(id: 2)]
ProductStore.context('ctx3').all // []
```
