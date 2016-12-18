.unlisten
=========

Removes the given callback from the store context.

### Usage
```javascript
Model.unlisten(callback);

// returns context
```

### Example
```javascript
@model class Product {}

const myCallback = () => doSomething();

Product.listen(myCallback);
Product.unlisten(myCallback);
```
