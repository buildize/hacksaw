.getKey
=====

Default unique key is ```id``` for Hacksaw stores but if you want to use
different keys to make the item unique you can use this method in your store.

### Usage
```javascript
@store class MyStore {
  static getKey(object) {
    return object.get('_id'); // assume you are using immutable js.
  }
}
```

### Default
```javascript
static getKey(object) {
  return object.id;
}
```

### Tip
You can use a common class if your data structure is the same for all stores.

```javascript
class MyCommonStore {
  static getKey(object) {
    return object._id;
  }
}

@store ProductStore extends MyCommonStore {}
```
