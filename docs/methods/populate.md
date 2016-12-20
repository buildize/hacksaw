.populate
=========

It adds the items to the current store context with given filter function.

### Usage
```javascript
Store.populate(filterFunction)

// returns the context
```

### Example
```javascript
@store class ProductStore {}

// lets add some item to the store first.
ProductStore.put([{ id: 1, count: 4 }, { id: 2, count: 5 }, { id: 3, count: 6 }]);

// see our store context is empty.
ProductStore.context('my-context').all // []

// lets populate the context
ProductStore.context('my-context').populate(item => item.count % 2 === 0);

// lets see the last data of the store context
ProductStore.context('my-context').all // [Object(id: 1, count: 4), Object(id: 3, count: 6)]

// or we could use it with chain
ProductStore.context('another')
       .populate(i => i.id > 2)
       .all // [Object(id: 3, count: 6)]

// the items will exactly be the the same
ProductStore.context('my-context').last === ProductStore.context('another').last // true
```
