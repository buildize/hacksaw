Creating Store
==============

You have two way to define a store. First option is defining stores with class
and decorator, other option is using ```createStore``` method.

### @store
```javascript
import { store } from 'hacksaw';

@store class MyStore {
  static fetch() {
    doSomething();
  }
}
```

----

### createStore
We can define the same store with ```createStore``` method;

```javascript
import { createStore } from 'hacksaw';

const MyStore = createStore({
  fetch() {
    doSomething();
  }
});
```
