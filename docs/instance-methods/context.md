\#context
========

This is the current context of the instance.

### Usage
```javascript
instance.context; // the context
```

### Example
```javascript
@model class Product {
  save() {
    const { data: item } = await axios.patch(`/product/${this.id}`, this.toObject());
    this.context.put(item);
  }
}

const product = Product.context('edit').clone(i => i.id === id).first;

product.set({ name: 'another name' });
product.save();
```
