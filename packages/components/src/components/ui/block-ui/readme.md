# ce-block-ui



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `zIndex` | `z-index` |             | `number` | `1`     |


## Dependencies

### Used by

 - [ce-checkout](../../controllers/checkout)
 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-order-summary](../../controllers/order-summary)
 - [ce-price-choices](../../controllers/price-chooser)

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
  style ce-block-ui fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
