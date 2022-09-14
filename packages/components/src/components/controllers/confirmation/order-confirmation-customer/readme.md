# ce-order-confirmation-customer



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description      | Type       | Default     |
| ---------- | --------- | ---------------- | ---------- | ----------- |
| `customer` | --        | The customer     | `Customer` | `undefined` |
| `error`    | `error`   | Error message.   | `string`   | `undefined` |
| `heading`  | `heading` | The heading      | `string`   | `undefined` |
| `loading`  | `loading` | Is this loading? | `boolean`  | `undefined` |
| `order`    | --        | The Order        | `Checkout` | `undefined` |


## Dependencies

### Depends on

- [sc-customer-details](../../../ui/customer-details)

### Graph
```mermaid
graph TD;
  sc-order-confirmation-customer --> sc-customer-details
  sc-customer-details --> sc-card
  sc-customer-details --> sc-stacked-list
  sc-customer-details --> sc-stacked-list-row
  sc-customer-details --> sc-tag
  sc-customer-details --> sc-divider
  sc-customer-details --> sc-empty
  sc-customer-details --> sc-skeleton
  sc-customer-details --> sc-dashboard-module
  sc-customer-details --> sc-button
  sc-customer-details --> sc-icon
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  style sc-order-confirmation-customer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
