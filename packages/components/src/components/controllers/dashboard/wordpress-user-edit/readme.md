# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type            | Default     |
| ------------ | ------------- | ----------- | --------------- | ----------- |
| `heading`    | `heading`     |             | `string`        | `undefined` |
| `successUrl` | `success-url` |             | `string`        | `undefined` |
| `user`       | --            |             | `WordPressUser` | `undefined` |


## Dependencies

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-input](../../../ui/input)
- [sc-columns](../../../ui/columns)
- [sc-column](../../../ui/column)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-wordpress-user-edit --> sc-dashboard-module
  sc-wordpress-user-edit --> sc-card
  sc-wordpress-user-edit --> sc-form
  sc-wordpress-user-edit --> sc-input
  sc-wordpress-user-edit --> sc-columns
  sc-wordpress-user-edit --> sc-column
  sc-wordpress-user-edit --> sc-button
  sc-wordpress-user-edit --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-wordpress-user-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
