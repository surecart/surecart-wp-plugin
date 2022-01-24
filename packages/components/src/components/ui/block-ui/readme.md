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

 - [ce-address](../ce-address)
 - [ce-checkout](../../controllers/checkout)
 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-customer-subscription-edit](../../controllers/dashboard/subscription-detail)
 - [ce-login-form](../../controllers/login)
 - [ce-order-summary](../../controllers/order-summary)
 - [ce-price-choices](../../controllers/price-choices)
 - [ce-purchase](../../controllers/purchase)
 - [ce-subscription](../../controllers/dashboard/subscription)

### Depends on

- [ce-spinner](../spinner)

### Graph
```mermaid
graph TD;
  ce-block-ui --> ce-spinner
  ce-address --> ce-block-ui
  ce-checkout --> ce-block-ui
  ce-coupon-form --> ce-block-ui
  ce-customer-subscription-edit --> ce-block-ui
  ce-login-form --> ce-block-ui
  ce-order-summary --> ce-block-ui
  ce-price-choices --> ce-block-ui
  ce-purchase --> ce-block-ui
  ce-subscription --> ce-block-ui
  style ce-block-ui fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
