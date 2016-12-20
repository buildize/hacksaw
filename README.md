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

@store class Product {}

Product.all; // []
Product.context('best').all; // []
Product.context('trending').all; // []

//-----
Product.context('best').put({ id: 1, name: 'A book' });
Product.context('trending').put({ id: 2, name: 'Trending book' });
Product.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]
Product.context('best').all; // [{ id: 1, name: 'A book' }]

//-----
Product.context('another-context').populate(i => i.id === 1);
Product.context('another-context').first === Product.first // true;

//----
Product.context('trending').clean().all // [];
Product.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]
```
