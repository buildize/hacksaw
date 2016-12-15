HACKSAW
=======

Hacksaw is a data store library for javascript. You can store all the states
along the app life time. For example you can store all search results without
any effort so that if the user go back and back and back the pages will still be
there.

This is experimental and conceptual work. Do not use for critical products but
you can use for your hobby or side projects to improve the library.

## Store Context
The idea behind Hacksaw is contextual store which means you have one store which
you can generate sub stores using contexts and also all model instances will be
shared among context stores.

```javascript
Product.all; // []
Product.context('best').all; // []
Product.context('trending').all; // []

//-----
Product.context('best').put({ id: 1, name: 'A book' });
Product.context('trending').put(Product.new({ id: 2, name: 'Trending book' }));
Product.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]
Product.context('best').all; // [{ id: 1, name: 'A book' }]

//-----
Product.context('another-context').populate(i => i.id === 1);
Product.context('another-context').first === Product.first // true;

//----
Product.context('trending').clean().all // [];
Product.all // [{ id: 1, name: 'A book' }, { id: 2, name: 'Trending book' }]

//----
// assume we defined a static search method
const context = Product.context('search', query, page);
context.listen(() => {
         context.all // [...search result items]
       })
       .search(query, page);
```

As we said this is an experimental library for now, the api will probably
change but it's really important you to use the library in your small projects.i

## Installation
```
npm install hacksaw --save
```

## Complete Example

Assume we have an app for searching products and edit them.

#### Creating a model
First we need to create a model which will store our product items and also it
will be product item itself.

Every model must have a unique key, like:
```javascript
  @key id;
```
or it can be a getter function:
```javascript
  @key
  get myKey() {
    return this.tag + '-' + this.name;
  }
```

We are adding our items to the store with ```put``` method. It can be a object,
array, model instance or array of model instances.

Everything else is your custom methods:

```javascript
// models/product.js

import { Model, key } from 'hacksaw';
import axios from 'axios';

class Product extends Model {
  @key id;

  // this is our custom static method
  static async fetch(query, limit, force = false) {
    if (this.all.length && !force) return;

    const params = { query, limit };
    const { data: items } = await axios.get('/products', { params });

    this.put(items);
  }

  async static get(id) {
    const { data: product } = await axios.get(`/product/${this.id}`);
    this.put(product);
  }

  async save() {
    const params = this.toJSON();
    const { data: product } = await axios.patch(`/product/${this.id}`, params);
    Product.put(product);
  }
}
```

#### Creating search component
We are using a react component in this example. Every changes on the query, we
will change context as well.

```javascript
// components/search.js

import React, { Component } from 'react';
import { Product } from '../models';

class Search extends Component {  
  componentWillMount() {
    this.search(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.search(nextProps);
  }

  search(props) {
    const { query } = props.location;
    const limit = 15;

    Product.context(query)
           .fetch(query, limit)
           .listen(::this.forceUpdate);
  }

  render() {
    const { query } = this.props.location;
    const products = Product.context(query).all;

    return products.map(product => <ProductItem product={product} />);
  }
}
```

#### Creating edit product component

```javascript
// component/edit.js

import React, { Component } from 'react';
import { Product } from '../models';
import { Input } from '../common';

class Edit extends Component {  
  componentWillMount() {
    const { id } = this.props.params;

    Product.context('edit')
           .populate(i => i.id === id)
           .listen(::this.forceUpdate)
           .get(id);
  }

  componentWillUnmount() {
    Product.context('edit').clean();
  }

  render() {
    const { id } = this.props.params;
    const product = Product.context('edit').first;

    return (
      <form onSubmit={product.save}>
        <p>
          <label>Name:</label>
          <Input
            onChange={product.getSetter('name')}
            value={product.name}
          />
        </p>
        <button>Save</button>
      </form>
    );
  }
}
```
