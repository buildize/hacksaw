Hacksaw is a data store library for javascript. You can store all the states
along the app life time with view stores.

### View Store
The idea behind Hacksaw is contextual store which means you have one store which
you can generate sub stores using contexts and also all model instances will be
shared among contexts.

![](../diagram.png)

### Installation
```
npm install hacksaw --save
```

### Examples
> See more example on http://hacksaw-examples.open.buildize.com

```javascript
import { createStore } from 'hacksaw';

const store = createStore({
  tables: {
    products: {},
    users: {
      relations: {
        products: {
          type: Array,
          table: 'products'
        }
      }
    }
  }
});

// products table is empty
store.products.all; // []

// create view stores
const bestViewStore = store.view('best');
const trendingViewStore = store.view('trending');
bestViewStore.products.all; // []
trendingViewStore.products.all; // []

// add a product to view store 'best'
bestViewStore.products.put({ id: 1, name: 'A book' });

// add a product to view store 'trending'
trendingViewStore.products.put({ id: 2, name: 'Trending book' });

// global products table has 2 items
store.products.all
// [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]

// view store 'best' has 1 item
bestViewStore.all;
// [{ id: 1, name: 'A book' }]

// create another view store and populate data
const anotherViewStore = store.view('another-context');
anotherViewStore.products.populate(i => i.id === 1);
anotherViewStore.products.first
// { id: 1, name: 'A book' }

// clean trending view store
trendingViewStore.clean();
trendingViewStore.products.all; // []
store.products.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]

// add data has relations
store.users.put({ id: 1, name: 'Plato', products: [{ id: 1, name: 'Apology' }] });
store.users.first;
// { id: 1, name: 'Plato', products: [{ id: 1, name: 'Apology' }] }
store.products.all;
// [{ id: 1, name: 'Apology' }, { id: 2, name: 'Trending book' }]
```
