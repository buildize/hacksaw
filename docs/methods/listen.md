.listen
=======

Adds a callback to listen updates on contexts.

### Usage
```javascript
Store.listen(callback);

// returns context
```

### Example
```javascript
@store class ProductStore {}

ProductStore.listen(() => console.log('global update'));
ProductStore.context('node1').listen(() => console.log('node 1 updated'));
ProductStore.context('node1', 'node2').listen(() => console.log('node 2 updated'));
ProductStore.context('another').listen(() => console.log('another updated'));

ProductStore.put({ id: 1, name: 'Book' });
// global update

ProductStore.context('node1').put({ id: 2, name: 'node1 book' });
// global update
// node 1 update

ProductStore.context('node1', 'node2').put({ id: 3, name: 'node2 item' });
// global update
// node 1 update
// node 2 update

ProductStore.context('another').put({ id: 5, name: 'another item' });
// global update
// another update
```
