# ce-card



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description              | Type      | Default     |
| ------------ | ------------ | ------------------------ | --------- | ----------- |
| `borderless` | `borderless` | Is this card borderless. | `boolean` | `undefined` |
| `loading`    | `loading`    | Is this card loading.    | `boolean` | `undefined` |
| `noDivider`  | `no-divider` | Eliminate the divider    | `boolean` | `undefined` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"base"`   |             |
| `"border"` |             |


## Dependencies

### Used by

 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-customer-orders-list](../../controllers/dashboard/customer-orders-list)
 - [ce-customer-subscription-edit](../../controllers/dashboard/subscription-detail)
 - [ce-login-form](../../controllers/login)
 - [ce-order-detail](../../controllers/dashboard/order-detail)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [ce-subscription](../../controllers/dashboard/subscription)
 - [ce-subscriptions-list](../../controllers/dashboard/subscriptions-list)

### Depends on

- [ce-skeleton](../skeleton)
- [ce-divider](../divider)

### Graph
```mermaid
graph TD;
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-charges-list --> ce-card
  ce-customer-orders-list --> ce-card
  ce-customer-subscription-edit --> ce-card
  ce-login-form --> ce-card
  ce-order-detail --> ce-card
  ce-orders-list --> ce-card
  ce-payment-methods-list --> ce-card
  ce-subscription --> ce-card
  ce-subscriptions-list --> ce-card
  style ce-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
