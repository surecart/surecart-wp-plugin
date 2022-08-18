# ce-total



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                    | Default        |
| -------- | --------- | ----------- | --------------------------------------- | -------------- |
| `order`  | --        |             | `Checkout`                              | `undefined`    |
| `total`  | `total`   |             | `"amount_due" \| "subtotal" \| "total"` | `'amount_due'` |


## Dependencies

### Used by

 - [sc-line-item-total](../line-item-total)
 - [sc-order-submit](../order-submit)
 - [sc-order-summary](../order-summary)

### Depends on

- [sc-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-total --> sc-format-number
  sc-line-item-total --> sc-total
  sc-order-submit --> sc-total
  sc-order-summary --> sc-total
  style sc-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
