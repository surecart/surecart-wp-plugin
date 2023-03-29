# sc-product-selected-price



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description     | Type     | Default     |
| ----------- | ------------ | --------------- | -------- | ----------- |
| `productId` | `product-id` | The product id. | `string` | `undefined` |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Shadow Parts

| Part               | Description |
| ------------------ | ----------- |
| `"price__scratch"` |             |


## Dependencies

### Depends on

- [sc-form](../../../ui/form)
- [sc-price-input](../../../ui/price-input)
- [sc-button](../../../ui/button)
- [sc-format-number](../../../util/format-number)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-product-selected-price --> sc-form
  sc-product-selected-price --> sc-price-input
  sc-product-selected-price --> sc-button
  sc-product-selected-price --> sc-format-number
  sc-product-selected-price --> sc-icon
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  style sc-product-selected-price fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
