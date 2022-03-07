# ce-tag



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                                                                     | Default     |
| ----------- | ----------- | ------------------------------------------ | ------------------------------------------------------------------------ | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                                                                | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                                                                | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`                                         | `'medium'`  |
| `type`      | `type`      | The tag's type.                            | `"danger" \| "default" \| "info" \| "primary" \| "success" \| "warning"` | `'default'` |


## Events

| Event     | Description | Type                 |
| --------- | ----------- | -------------------- |
| `ceClear` |             | `CustomEvent<CeTag>` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"base"`    |             |
| `"content"` |             |


## Dependencies

### Used by

 - [ce-badge-notice](../badge-notice)
 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-coupon-form](../coupon-form)
 - [ce-customer-details](../../controllers/dashboard/ce-customer-details)
 - [ce-customer-edit](../../controllers/dashboard/ce-customer-edit)
 - [ce-invoices-list](../../controllers/dashboard/invoices-list)
 - [ce-order-confirmation-totals](../../controllers/order-confirmation-totals)
 - [ce-order-status-badge](../order-status-badge)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-payment](../../controllers/payment)
 - [ce-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [ce-subscription-details](../../controllers/dashboard/ce-subscription-details)
 - [ce-subscription-status-badge](../subscription-status-badge)
 - [ce-subscription-switch](../../controllers/dashboard/ce-subscription-switch)

### Graph
```mermaid
graph TD;
  ce-badge-notice --> ce-tag
  ce-charges-list --> ce-tag
  ce-coupon-form --> ce-tag
  ce-customer-details --> ce-tag
  ce-customer-edit --> ce-tag
  ce-invoices-list --> ce-tag
  ce-order-confirmation-totals --> ce-tag
  ce-order-status-badge --> ce-tag
  ce-orders-list --> ce-tag
  ce-payment --> ce-tag
  ce-payment-methods-list --> ce-tag
  ce-subscription-details --> ce-tag
  ce-subscription-status-badge --> ce-tag
  ce-subscription-switch --> ce-tag
  style ce-tag fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
