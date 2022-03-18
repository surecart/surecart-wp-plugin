# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type     | Default     |
| ------------ | ------------- | ----------- | -------- | ----------- |
| `customerId` | `customer-id` |             | `string` | `undefined` |
| `heading`    | `heading`     |             | `string` | `undefined` |


## Dependencies

### Depends on

- [ce-customer-details](../../../ui/customer-details)

### Graph
```mermaid
graph TD;
  ce-dashboard-customer-details --> ce-customer-details
  ce-customer-details --> ce-stacked-list-row
  ce-customer-details --> ce-tag
  ce-customer-details --> ce-skeleton
  ce-customer-details --> ce-dashboard-module
  ce-customer-details --> ce-button
  ce-customer-details --> ce-icon
  ce-customer-details --> ce-card
  ce-customer-details --> ce-stacked-list
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  style ce-dashboard-customer-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
