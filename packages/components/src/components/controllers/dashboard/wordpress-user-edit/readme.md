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

- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-card](../../../ui/card)
- [ce-form](../../../ui/form)
- [ce-input](../../../ui/input)
- [ce-columns](../../../ui/columns)
- [ce-column](../../../ui/column)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-wordpress-user-edit --> ce-dashboard-module
  ce-wordpress-user-edit --> ce-card
  ce-wordpress-user-edit --> ce-form
  ce-wordpress-user-edit --> ce-input
  ce-wordpress-user-edit --> ce-columns
  ce-wordpress-user-edit --> ce-column
  ce-wordpress-user-edit --> ce-button
  ce-wordpress-user-edit --> ce-block-ui
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-wordpress-user-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
