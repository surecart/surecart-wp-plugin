# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type            | Default     |
| ------------ | ------------- | ----------- | --------------- | ----------- |
| `heading`    | `heading`     |             | `string`        | `undefined` |
| `successUrl` | `success-url` |             | `string`        | `undefined` |
| `user`       | --            |             | `WordPressUser` | `undefined` |


## Dependencies

### Used by

 - [sc-password-nag](../sc-password-nag)

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-input](../../../ui/input)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-wordpress-password-edit --> sc-dashboard-module
  sc-wordpress-password-edit --> sc-card
  sc-wordpress-password-edit --> sc-form
  sc-wordpress-password-edit --> sc-input
  sc-wordpress-password-edit --> sc-button
  sc-wordpress-password-edit --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-password-nag --> sc-wordpress-password-edit
  style sc-wordpress-password-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
