# sc-product-price-modal



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `addToCart`  | `add-to-cart` |             | `boolean` | `undefined` |
| `buttonText` | `button-text` |             | `string`  | `undefined` |


## Dependencies

### Depends on

- [sc-dialog](../../../ui/sc-dialog)
- [sc-form](../../../ui/form)
- [sc-price-input](../../../ui/price-input)
- [sc-button](../../../ui/button)

### Graph
```mermaid
graph TD;
  sc-product-price-modal --> sc-dialog
  sc-product-price-modal --> sc-form
  sc-product-price-modal --> sc-price-input
  sc-product-price-modal --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  style sc-product-price-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
