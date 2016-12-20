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
@store class ProductStore {}

const myCallback = () => doSomething();

ProductStore.listen(myCallback);
ProductStore.unlisten(myCallback);
```
