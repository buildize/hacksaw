.clone
======

It adds the clones of items to the current store context with given filter
function.

### Usage
```javascript
Store.clone(filterFunction)

// returns the context
```

### When to use
It can be used for edit forms. Assume that you want to use the data of an item
but don't want to update the store unless you save the data, you can achive
it using clones.

### Example
```javascript
@store class ProductStore {}

// lets add some item to the store first.
ProductStore.put([{ id: 1, count: 4 }, { id: 2, count: 5 }, { id: 3, count: 6 }]);

// see our store context is empty.
ProductStore.context('my-context').all // []

// lets clone the items to the context
ProductStore.context('my-context').clone(item => item.count % 2 === 0);

// lets see the last data of the store context
ProductStore.context('my-context').all // [Object(id: 1, count: 4), Object(id: 3, count: 6)]

// or we could use it with chain
ProductStore.context('another')
       .clone(i => i.id > 2)
       .all // [Object(id: 3, count: 6)]

// the items will have the same data but instances will be different
ProductStore.context('my-context').last === ProductStore.context('another').last // false
```