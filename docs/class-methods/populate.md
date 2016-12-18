.populate
=========

It adds the items to the current store context with given filter function.

### Usage
```javascript
Model.populate(filterFunction)

// returns the context
```

### Example
```javascript
@model class Product {}

// lets add some item to the store first.
Product.put([{ id: 1, count: 4 }, { id: 2, count: 5 }, { id: 3, count: 6 }]);

// see our store context is empty.
Product.context('my-context').all // []

// lets populate the context
Product.context('my-context').populate(item => item.count % 2 === 0);

// lets see the last data of the store context
Product.context('my-context').all // [Product(id: 1, count: 4), Product(id: 3, count: 6)]

// or we could use it with chain
Product.context('another')
       .populate(i => i.id > 2)
       .all // [Product(id: 3, count: 6)]

// the items will exactly be the the same
Product.context('my-context').last === Product.context('another').last // true
```
