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
 - [ce-customer-order](../../controllers/dashboard/customer-order)
 - [ce-customer-orders-list](../../controllers/dashboard/customer-orders-list)
 - [ce-customer-subscription](../../controllers/dashboard/customer-subscription)
 - [ce-customer-subscription-edit](../../controllers/dashboard/customer-subscription-edit)
 - [ce-customer-subscriptions-list](../../controllers/dashboard/customer-subscriptions-list)
 - [ce-login-form](../../controllers/login)
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
  ce-customer-order --> ce-card
  ce-customer-orders-list --> ce-card
  ce-customer-subscription --> ce-card
  ce-customer-subscription-edit --> ce-card
  ce-customer-subscriptions-list --> ce-card
  ce-login-form --> ce-card
  ce-subscriptions-list --> ce-card
  style ce-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
