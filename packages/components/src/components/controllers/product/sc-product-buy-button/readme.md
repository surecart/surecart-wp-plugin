# sc-product-buy-button



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute     | Description                    | Type                                                                                         | Default     |
| ----------- | ------------- | ------------------------------ | -------------------------------------------------------------------------------------------- | ----------- |
| `addToCart` | `add-to-cart` | Is this an add to cart button? | `boolean`                                                                                    | `undefined` |
| `busy`      | `busy`        | Is the order busy              | `boolean`                                                                                    | `undefined` |
| `full`      | `full`        | Full                           | `boolean`                                                                                    | `false`     |
| `icon`      | `icon`        | Icon to show.                  | `string`                                                                                     | `undefined` |
| `outline`   | `outline`     | Outline                        | `boolean`                                                                                    | `false`     |
| `showTotal` | `show-total`  | Show the total.                | `boolean`                                                                                    | `undefined` |
| `size`      | `size`        | The button's size.             | `"large" \| "medium" \| "small"`                                                             | `'medium'`  |
| `text`      | `text`        |                                | `string`                                                                                     | `undefined` |
| `type`      | `type`        | The button type.               | `"danger" \| "default" \| "info" \| "link" \| "primary" \| "success" \| "text" \| "warning"` | `'default'` |


## Dependencies

### Depends on

- [sc-spinner](../../../ui/spinner)
- [sc-dialog](../../../ui/sc-dialog)
- [sc-form](../../../ui/form)
- [sc-price-input](../../../ui/price-input)
- [sc-button](../../../ui/button)

### Graph
```mermaid
graph TD;
  sc-product-buy-button --> sc-spinner
  sc-product-buy-button --> sc-dialog
  sc-product-buy-button --> sc-form
  sc-product-buy-button --> sc-price-input
  sc-product-buy-button --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  style sc-product-buy-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
