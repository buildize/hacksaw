![](logo.png)

<br />

Hacksaw is a data store library for javascript. You can store all the states
along the app life time. For example you can store all search results without
any effort so that if the user go back and back and back the pages will still be
there.

### Store Context
The idea behind Hacksaw is contextual store which means you have one store which
you can generate sub stores using contexts and also all model instances will be
shared among contexts.

### Installation
```
npm install hacksaw --save
```

### Example
```javascript
import { store } from 'hacksaw';

@store class ProductStore {}

ProductStore.all; // []
ProductStore.context('best').all; // []
ProductStore.context('trending').all; // []

//-----
ProductStore.context('best').put({ id: 1, name: 'A book' });
ProductStore.context('trending').put({ id: 2, name: 'Trending book' });
ProductStore.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]
ProductStore.context('best').all; // [{ id: 1, name: 'A book' }]

//-----
ProductStore.context('another-context').populate(i => i.id === 1);
ProductStore.context('another-context').first === ProductStore.first // true;

//----
ProductStore.context('trending').clean().all // [];
ProductStore.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]
```
