# sc-custom-donation-amount



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                           | Type     | Default     |
| ----------- | ------------ | ------------------------------------- | -------- | ----------- |
| `productId` | `product-id` | Selected Product Id for the donation. | `string` | `undefined` |
| `value`     | `value`      | Custom Amount of the donation.        | `number` | `undefined` |


## Dependencies

### Depends on

- [sc-choice-container](../../../ui/choice-container)
- [sc-visually-hidden](../../../util/visually-hidden)
- [sc-price-input](../../../ui/price-input)

### Graph
```mermaid
graph TD;
  sc-product-donation-custom-amount --> sc-choice-container
  sc-product-donation-custom-amount --> sc-visually-hidden
  sc-product-donation-custom-amount --> sc-price-input
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-visually-hidden
  style sc-product-donation-custom-amount fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
