# ce-total



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                    | Default        |
| -------- | --------- | ----------- | --------------------------------------- | -------------- |
| `order`  | --        |             | `Order`                                 | `undefined`    |
| `total`  | `total`   |             | `"amount_due" \| "subtotal" \| "total"` | `'amount_due'` |


## Dependencies

### Used by

 - [ce-line-item-total](../line-item-total)
 - [ce-order-submit](../order-submit)
 - [ce-order-summary](../order-summary)

### Depends on

- [ce-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  ce-total --> ce-format-number
  ce-line-item-total --> ce-total
  ce-order-submit --> ce-total
  ce-order-summary --> ce-total
  style ce-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
