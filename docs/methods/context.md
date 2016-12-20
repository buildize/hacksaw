.context
========

Context is a sub store extends the model class. You can use different sub
stores for different needs.

### Usage
```javascript
Store.context(node1, node2, node3, ...);
```


```javascript
@store class ProductStore {}

ProductStore.context('search'); // returns new class extends Product.
```
<br />

You can use all methods on the store

```javascript
@store class ProductStore {
  static myMethod() {
    return 'my value';
  }
}

ProductStore.context('aContext').myMethod(); // 'my value'
```

<br />

It always returns the same class

```javascript
ProductStore.context('c1', 'c2') === ProductStore.context('c1', 'c2') // true
```

### Example
```javascript
// create Product store
@store class ProductStore {
  // a method that fetchs products with given query and limit
  async static fetch(query, limit) {
    const params = { query, limit };
    const { data: items } = await axios.get('/products', { params });
    this.put(items);
  }
}

const query = { title_like: 'A Book' };

// we are creating a context with dynamic query under search context.
const context = ProductStore.context('search', query);

context.fetch(query, 15); // using the method we defined above
context.listen(renderContexts); // listen changes on the store context

function renderContexts() {
  console.log(context.all);
  // [Object(id: 141, name: 'A book'), Object(id: 13, name: 'It is a book')]
  console.log(ProductStore.all);
  // [Object(id: 141, name: 'A book'), Object(id: 13, name: 'It is a book')]
  console.log(ProductStore.context('another context').all);
  // []
}

```
