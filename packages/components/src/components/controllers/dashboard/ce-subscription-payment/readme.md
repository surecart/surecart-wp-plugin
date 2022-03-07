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

- [ce-choice](../../../ui/choice)
- [ce-skeleton](../../../ui/skeleton)
- [ce-choices](../../../ui/choices)
- [ce-flex](../../../ui/flex)
- [ce-cc-logo](../../../ui/ce-cc-logo)
- [ce-dashboard-module](../../../ui/ce-dashboard-module)
- [ce-form](../../../ui/form)
- [ce-card](../../../ui/card)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-subscription-payment --> ce-choice
  ce-subscription-payment --> ce-skeleton
  ce-subscription-payment --> ce-choices
  ce-subscription-payment --> ce-flex
  ce-subscription-payment --> ce-cc-logo
  ce-subscription-payment --> ce-dashboard-module
  ce-subscription-payment --> ce-form
  ce-subscription-payment --> ce-card
  ce-subscription-payment --> ce-button
  ce-subscription-payment --> ce-block-ui
  ce-choices --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-cc-logo --> ce-icon
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-subscription-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
