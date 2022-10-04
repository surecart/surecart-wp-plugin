# sc-password-nag



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description        | Type                                                        | Default     |
| ------------ | ------------- | ------------------ | ----------------------------------------------------------- | ----------- |
| `open`       | `open`        |                    | `boolean`                                                   | `true`      |
| `successUrl` | `success-url` | The success url.   | `string`                                                    | `undefined` |
| `type`       | `type`        | The type of alert. | `"danger" \| "info" \| "primary" \| "success" \| "warning"` | `'primary'` |


## Dependencies

### Depends on

- [sc-alert](../../../ui/alert)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-input](../../../ui/input)
- [sc-flex](../../../ui/flex)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-password-nag --> sc-alert
  sc-password-nag --> sc-dashboard-module
  sc-password-nag --> sc-button
  sc-password-nag --> sc-icon
  sc-password-nag --> sc-card
  sc-password-nag --> sc-form
  sc-password-nag --> sc-input
  sc-password-nag --> sc-flex
  sc-password-nag --> sc-block-ui
  sc-alert --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-button --> sc-spinner
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-block-ui --> sc-spinner
  style sc-password-nag fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
