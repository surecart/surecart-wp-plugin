# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type     | Default     |
| ------------ | ------------- | ----------- | -------- | ----------- |
| `customerId` | `customer-id` |             | `string` | `undefined` |
| `heading`    | `heading`     |             | `string` | `undefined` |


## Dependencies

### Depends on

- [sc-customer-details](../../../ui/customer-details)

### Graph
```mermaid
graph TD;
  sc-dashboard-customer-details --> sc-customer-details
  sc-customer-details --> sc-stacked-list-row
  sc-customer-details --> sc-tag
  sc-customer-details --> sc-skeleton
  sc-customer-details --> sc-dashboard-module
  sc-customer-details --> sc-button
  sc-customer-details --> sc-icon
  sc-customer-details --> sc-card
  sc-customer-details --> sc-stacked-list
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  style sc-dashboard-customer-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
