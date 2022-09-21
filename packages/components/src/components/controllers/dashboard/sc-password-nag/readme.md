# sc-password-nag



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description        | Type                                                        | Default     |
| -------- | --------- | ------------------ | ----------------------------------------------------------- | ----------- |
| `open`   | `open`    |                    | `boolean`                                                   | `true`      |
| `type`   | `type`    | The type of alert. | `"danger" \| "info" \| "primary" \| "success" \| "warning"` | `'warning'` |


## Dependencies

### Depends on

- [sc-alert](../../../ui/alert)
- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-wordpress-password-edit](../wordpress-password-edit)

### Graph
```mermaid
graph TD;
  sc-password-nag --> sc-alert
  sc-password-nag --> sc-flex
  sc-password-nag --> sc-button
  sc-password-nag --> sc-wordpress-password-edit
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-wordpress-password-edit --> sc-dashboard-module
  sc-wordpress-password-edit --> sc-card
  sc-wordpress-password-edit --> sc-form
  sc-wordpress-password-edit --> sc-input
  sc-wordpress-password-edit --> sc-button
  sc-wordpress-password-edit --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-block-ui --> sc-spinner
  style sc-password-nag fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
