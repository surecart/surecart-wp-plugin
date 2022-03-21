# ce-subscription-payment



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type              | Default     |
| ---------------- | ----------------- | ----------- | ----------------- | ----------- |
| `backUrl`        | `back-url`        |             | `string`          | `undefined` |
| `customerIds`    | --                |             | `string[]`        | `[]`        |
| `paymentMethods` | --                |             | `PaymentMethod[]` | `[]`        |
| `subscription`   | --                |             | `Subscription`    | `undefined` |
| `subscriptionId` | `subscription-id` |             | `string`          | `undefined` |
| `successUrl`     | `success-url`     |             | `string`          | `undefined` |


## Dependencies

### Depends on

- [sc-choice](../../../ui/choice)
- [sc-skeleton](../../../ui/skeleton)
- [sc-button](../../../ui/button)
- [sc-empty](../../../ui/empty)
- [sc-choices](../../../ui/choices)
- [sc-flex](../../../ui/flex)
- [sc-cc-logo](../../../ui/cc-logo)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-form](../../../ui/form)
- [sc-card](../../../ui/card)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-payment --> sc-choice
  sc-subscription-payment --> sc-skeleton
  sc-subscription-payment --> sc-button
  sc-subscription-payment --> sc-empty
  sc-subscription-payment --> sc-choices
  sc-subscription-payment --> sc-flex
  sc-subscription-payment --> sc-cc-logo
  sc-subscription-payment --> sc-dashboard-module
  sc-subscription-payment --> sc-form
  sc-subscription-payment --> sc-card
  sc-subscription-payment --> sc-block-ui
  sc-button --> sc-spinner
  sc-empty --> sc-icon
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-cc-logo --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-subscription-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
