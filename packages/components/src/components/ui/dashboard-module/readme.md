# ce-dashboard-module



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type     | Default     |
| --------- | --------- | ----------- | -------- | ----------- |
| `error`   | `error`   |             | `string` | `undefined` |
| `heading` | `heading` |             | `string` | `undefined` |


## Shadow Parts

| Part                    | Description |
| ----------------------- | ----------- |
| `"heading-description"` |             |
| `"heading-title"`       |             |


## Dependencies

### Used by

 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-customer-details](../../controllers/dashboard/customer-details)
 - [ce-customer-edit](../../controllers/dashboard/customer-edit)
 - [ce-invoices-list](../../controllers/dashboard/invoices-list)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [ce-subscription](../../controllers/dashboard/subscription)
 - [ce-subscription-cancel](../../controllers/dashboard/subscription-cancel)
 - [ce-subscription-payment](../../controllers/dashboard/subscription-payment)
 - [ce-subscription-renew](../../controllers/dashboard/subscription-renew)
 - [ce-subscription-switch](../../controllers/dashboard/subscription-switch)
 - [ce-subscriptions-list](../../controllers/dashboard/subscriptions-list)
 - [ce-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)
 - [ce-wordpress-password-edit](../../controllers/dashboard/wordpress-password-edit)
 - [ce-wordpress-user](../../controllers/dashboard/wordpress-user)
 - [ce-wordpress-user-edit](../../controllers/dashboard/wordpress-user-edit)

### Depends on

- [ce-alert](../alert)

### Graph
```mermaid
graph TD;
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-charges-list --> ce-dashboard-module
  ce-customer-details --> ce-dashboard-module
  ce-customer-edit --> ce-dashboard-module
  ce-invoices-list --> ce-dashboard-module
  ce-orders-list --> ce-dashboard-module
  ce-payment-methods-list --> ce-dashboard-module
  ce-subscription --> ce-dashboard-module
  ce-subscription-cancel --> ce-dashboard-module
  ce-subscription-payment --> ce-dashboard-module
  ce-subscription-renew --> ce-dashboard-module
  ce-subscription-switch --> ce-dashboard-module
  ce-subscriptions-list --> ce-dashboard-module
  ce-upcoming-invoice --> ce-dashboard-module
  ce-wordpress-password-edit --> ce-dashboard-module
  ce-wordpress-user --> ce-dashboard-module
  ce-wordpress-user-edit --> ce-dashboard-module
  style ce-dashboard-module fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
