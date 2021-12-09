# ce-block-ui



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type      | Default     |
| ------------- | ------------- | ----------- | --------- | ----------- |
| `spinner`     | `spinner`     |             | `boolean` | `undefined` |
| `transparent` | `transparent` |             | `boolean` | `undefined` |
| `zIndex`      | `z-index`     |             | `number`  | `1`         |


## Dependencies

### Used by

 - [ce-checkout](../../controllers/checkout)
 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-order-summary](../../controllers/order-summary)
 - [ce-price-choices](../../controllers/price-choices)
 - [ce-purchase](../../controllers/ce-purchase)

### Depends on

- [ce-spinner](../spinner)

### Graph
```mermaid
graph TD;
  ce-block-ui --> ce-spinner
  ce-checkout --> ce-block-ui
  ce-coupon-form --> ce-block-ui
  ce-order-summary --> ce-block-ui
  ce-price-choices --> ce-block-ui
  ce-purchase --> ce-block-ui
  style ce-block-ui fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
