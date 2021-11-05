# ce-total



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute | Description | Type                    | Default     |
| ----------------- | --------- | ----------- | ----------------------- | ----------- |
| `checkoutSession` | --        |             | `CheckoutSession`       | `undefined` |
| `total`           | `total`   |             | `"subtotal" \| "total"` | `'total'`   |


## Dependencies

### Used by

 - [ce-line-item-total](../line-item-total)

### Depends on

- [ce-format-number](../../util/format-number)

### Graph
```mermaid
graph TD;
  ce-total --> ce-format-number
  ce-line-item-total --> ce-total
  style ce-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
