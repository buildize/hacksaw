.merge
======

You can use this method to override merge functionality.

### Usage
```javascript
@store class MyStore {
  static merge(currentItem, nextItem) {
    return currentItem.mergeDeep(nextItem); // assume you use immutable js
  }
}
```

### Default
```javascript
static getKey(currentItem, nextItem) {
  Object.assign(currentItem, nextItem);
  // if you return something hacksaw will put new references to the store
  // otherwise the old references will be the same
}
```
