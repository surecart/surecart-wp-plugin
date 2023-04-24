# sc-cancel-dialog



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type                   | Default     |
| -------------- | --------- | ----------- | ---------------------- | ----------- |
| `open`         | `open`    |             | `boolean`              | `undefined` |
| `protocol`     | --        |             | `SubscriptionProtocol` | `undefined` |
| `subscription` | --        |             | `Subscription`         | `undefined` |


## Events

| Event            | Description | Type                                                     |
| ---------------- | ----------- | -------------------------------------------------------- |
| `scRefresh`      |             | `CustomEvent<void>`                                      |
| `scRequestClose` |             | `CustomEvent<"close-button" \| "keyboard" \| "overlay">` |


## Dependencies

### Used by

 - [sc-subscription](../subscription)

### Depends on

- [sc-dialog](../../../ui/sc-dialog)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-subscription-cancel](../subscription-cancel)
- [sc-cancel-survey](../sc-cancel-survey)
- [sc-cancel-discount](../sc-cancel-discount)

### Graph
```mermaid
graph TD;
  sc-cancel-dialog --> sc-dialog
  sc-cancel-dialog --> sc-button
  sc-cancel-dialog --> sc-icon
  sc-cancel-dialog --> sc-subscription-cancel
  sc-cancel-dialog --> sc-cancel-survey
  sc-cancel-dialog --> sc-cancel-discount
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-subscription-cancel --> sc-format-date
  sc-subscription-cancel --> sc-skeleton
  sc-subscription-cancel --> sc-dashboard-module
  sc-subscription-cancel --> sc-flex
  sc-subscription-cancel --> sc-button
  sc-subscription-cancel --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  sc-cancel-survey --> sc-choice
  sc-cancel-survey --> sc-skeleton
  sc-cancel-survey --> sc-dashboard-module
  sc-cancel-survey --> sc-form
  sc-cancel-survey --> sc-choices
  sc-cancel-survey --> sc-textarea
  sc-cancel-survey --> sc-flex
  sc-cancel-survey --> sc-button
  sc-cancel-survey --> sc-icon
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-textarea --> sc-form-control
  sc-cancel-discount --> sc-dashboard-module
  sc-cancel-discount --> sc-flex
  sc-cancel-discount --> sc-button
  sc-cancel-discount --> sc-block-ui
  sc-subscription --> sc-cancel-dialog
  style sc-cancel-dialog fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
