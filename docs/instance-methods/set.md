\#set
=====

Assigns given object to the instance and triggers the context.

### Usage
```javascript
instance.set(object);
```

### Example
```javascript
@model class Product {}

const product = new (Product.context('edit'));
product.set({ name: params.name, description: params.description });
```
