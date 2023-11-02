# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                         | Type            | Default     |
| ------------------ | ------------------- | ----------------------------------- | --------------- | ----------- |
| `enableValidation` | `enable-validation` | Ensures strong password validation. | `boolean`       | `true`      |
| `heading`          | `heading`           |                                     | `string`        | `undefined` |
| `successUrl`       | `success-url`       |                                     | `string`        | `undefined` |
| `user`             | --                  |                                     | `WordPressUser` | `undefined` |


## Dependencies

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-password](../../../ui/sc-password)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-wordpress-password-edit --> sc-dashboard-module
  sc-wordpress-password-edit --> sc-card
  sc-wordpress-password-edit --> sc-form
  sc-wordpress-password-edit --> sc-password
  sc-wordpress-password-edit --> sc-button
  sc-wordpress-password-edit --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-password --> sc-input
  sc-input --> sc-form-control
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-wordpress-password-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
