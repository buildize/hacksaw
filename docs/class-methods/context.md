.context
========

Context is a sub store extends the model class. You can use different sub
stores for different needs.

### Usage
```javascript
Model.context(node1, node2, node3, ...);
```


```javascript
@model class Product {}

Product.context('search'); // returns new class extends Product.
```
<br />

You can use all methods on the model

```javascript
@model class Product {
  static myMethod() {
    return 'my value';
  }
}

Product.context('aContext').myMethod(); // 'my value'
```

<br />

It always returns the same class

```javascript
Product.context('c1', 'c2') === Product.context('c1', 'c2') // true
```

### Example
```javascript
// create Product model
@model class Product {
  // a method that fetchs products with given query and limit
  async static fetch(query, limit) {
    const params = { query, limit };
    const { data: items } = await axios.get('/products', { params });
    this.put(items);
  }
}

const query = { title_like: 'A Book' };

// we are creating a context with dynamic query under search context.
const context = Product.context('search', query);

context.fetch(query, 15); // using the method we defined above
context.listen(renderContexts); // listen changes on the store context

function renderContexts() {
  console.log(context.all);
  // [Product(id: 141, name: 'A book'), Product(id: 13, name: 'It is a book')]
  console.log(Product.all);
  // [Product(id: 141, name: 'A book'), Product(id: 13, name: 'It is a book')]
  console.log(Product.context('another context').all);
  // []
}

```
