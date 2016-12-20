.unlisten
=========

Removes the given callback from the store context.

### Usage
```javascript
Store.unlisten(callback);

// returns context
```

### Example
```javascript
@store class Product {}

const myCallback = () => doSomething();

Product.listen(myCallback);
Product.unlisten(myCallback);
```
