\#getSetter
===========

Returns the setter function of the given property.

### Usage
```javascript
instance.getSetter(propertyName);
```

### Example
```javascript
@model class Product {}

@listener(Product.context('edit'))
class ProductForm extends Component {
  componentWillMount() {
    this.setState({
      product: new (Product.context('edit'))
    });
  }

  render() {
    const { product } = this.state;

    return (
      <form>
        <Input
          onChange={product.getSetter('name')}
          value={product.name}
        />
        <button>Save</button>
      </form>
    )
  }
}
```
