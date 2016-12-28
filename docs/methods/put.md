.put
====

Appends or updates the item both in the store context and the store.

### Usage
```javascript
Store.put(object)
//or
Store.put(array)

// returns appended or updated item array or object
```

### Example
```javascript
@store class ProductStore {}

ProductStore.context('context1').put({ id: 1, name: 'hello' });
ProductStore.context('context1').first // Object(id: 1, name: 'hello')

// this will append the item to the current context and update the other
// contexts.
ProductStore.context('context2').put({ id: 1, name: 'test' });
ProductStore.context('context2').first // Object(id: 1, name: 'test')

// lets see the other context's item
ProductStore.context('context1').first // Object(id: 1, name: 'test')

// lets see the global store
ProductStore.first // Object(id: 1, name: 'test')
```
