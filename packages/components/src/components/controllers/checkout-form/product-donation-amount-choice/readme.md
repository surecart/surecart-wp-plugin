# sc-product-donation-amount-choice



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                      | Type     | Default     |
| -------------- | --------------- | -------------------------------- | -------- | ----------- |
| `currencyCode` | `currency-code` | The currency code for the field. | `string` | `'USD'`     |
| `label`        | `label`         | The label for the field.         | `string` | `undefined` |
| `productId`    | `product-id`    | The product id for the fields.   | `string` | `undefined` |
| `value`        | `value`         | The value of the field.          | `number` | `undefined` |


## Dependencies

### Depends on

- [sc-choice-container](../../../ui/choice-container)
- [sc-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-product-donation-amount-choice --> sc-choice-container
  sc-product-donation-amount-choice --> sc-format-number
  style sc-product-donation-amount-choice fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
