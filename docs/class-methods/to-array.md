.toArray
========

Returns array of plain objects of the store context.

### Usage
```javascript
Model.toArray();
```

### Example
```javascript
@model class Product {}

Product.put({ id: 1, name: 'item1' });
Product.put({ id: 2, name: 'item2' });

Product.toArray(); // [Object(id: 1, name: 'item2'), Object(id: 2, name: 'item2')]
```
