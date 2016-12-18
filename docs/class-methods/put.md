.put
====

Appends or updates the item both in the store context and the store.

### Usage
```javascript
Model.put(object)
//or
Model.put(modelInstance)
//or
Model.put(array)

// returns appended or updated item array or object
```

### Example
```javascript
@model class Product {}

Product.context('context1').put({ id: 1, name: 'hello' });
Product.context('context1').first // Product(id: 1, name: 'hello')

// this will append the item to the current context and update the other
// contexts.
Product.context('context2').put({ id: 1, name: 'test' });
Product.context('context2').first // Product(id: 1, name: 'test')

// lets see the other context's item
Product.context('context1').first // Product(id: 1, name: 'test')

// lets see the global store
Product.first // Product(id: 1, name: 'test')
```
