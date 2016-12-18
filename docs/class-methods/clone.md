.clone
======

It adds the clones of items to the current store context with given filter
function.

### Usage
```javascript
Model.clone(filterFunction)

// returns the context
```

### When to use
It can be used for edit forms. Assume that you want to use the data of an item
but don't want to update the store unless you save the data, you can achive
it using clones.

### Example
```javascript
@model class Product {}

// lets add some item to the store first.
Product.put([{ id: 1, count: 4 }, { id: 2, count: 5 }, { id: 3, count: 6 }]);

// see our store context is empty.
Product.context('my-context').all // []

// lets clone the items to the context
Product.context('my-context').clone(item => item.count % 2 === 0);

// lets see the last data of the store context
Product.context('my-context').all // [Product(id: 1, count: 4), Product(id: 3, count: 6)]

// or we could use it with chain
Product.context('another')
       .clone(i => i.id > 2)
       .all // [Product(id: 3, count: 6)]

// the items will have the same data but instances will be different
Product.context('my-context').last === Product.context('another').last // false
```
