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
@store class ProductStore {}

ProductStore.listen(() => {
  // re-render component etc.
});

ProductStore.set({ isLoading: true });
ProductStore.isLoading; // true;

ProductStore.context('ctx').set({ myValue: 15 });
ProductStore.context('ctx').myValue; // 15
```
