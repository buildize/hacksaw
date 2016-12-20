.set
====

We're using ```.set``` method to change data of the store context. This enables
us to trigger events.

### Usage
```javascript
Store.set(object); // returns Context
```


### Example
```javascript
@store class Product {}

Product.listen(() => {
  // re-render component etc.
});

Product.set({ isLoading: true });
Product.isLoading; // true;

Product.context('ctx').set({ myValue: 15 });
Product.context('ctx').myValue; // 15
```
