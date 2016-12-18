.listen
=======

Adds a callback to listen updates on contexts.

### Usage
```javascript
Model.listen(callback);

// returns context
```

### Example
```javascript
@model class Product {}

Product.listen(() => console.log('global update'));
Product.context('node1').listen(() => console.log('node 1 updated'));
Product.context('node1', 'node2').listen(() => console.log('node 2 updated'));
Product.context('another').listen(() => console.log('another updated'));

Product.put({ id: 1, name: 'Book' });
// global update

Product.context('node1').put({ id: 2, name: 'node1 book' });
// global update
// node 1 update

Product.context('node1', 'node2').put({ id: 3, name: 'node2 item' });
// global update
// node 1 update
// node 2 update

Product.context('another').put({ id: 5, name: 'another item' });
// global update
// another update
```
