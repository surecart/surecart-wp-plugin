# ce-subscription-switch



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description                        | Type           | Default     |
| ---------------- | --------- | ---------------------------------- | -------------- | ----------- |
| `heading`        | `heading` |                                    | `string`       | `undefined` |
| `productGroupId` | --        |                                    | `ProductGroup` | `undefined` |
| `query`          | --        | Customer id to fetch subscriptions | `object`       | `undefined` |
| `subscription`   | --        |                                    | `Subscription` | `undefined` |


## Dependencies

### Depends on

- [ce-flex](../../../ui/flex)
- [ce-button](../../../ui/button)
- [ce-choice](../../../ui/choice)
- [ce-skeleton](../../../ui/skeleton)
- [ce-choices](../../../ui/choices)
- [ce-format-number](../../../util/format-number)
- [ce-tag](../../../ui/tag)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-form](../../../ui/form)
- [ce-icon](../../../ui/icon)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-subscription-switch --> ce-flex
  ce-subscription-switch --> ce-button
  ce-subscription-switch --> ce-choice
  ce-subscription-switch --> ce-skeleton
  ce-subscription-switch --> ce-choices
  ce-subscription-switch --> ce-format-number
  ce-subscription-switch --> ce-tag
  ce-subscription-switch --> ce-dashboard-module
  ce-subscription-switch --> ce-form
  ce-subscription-switch --> ce-icon
  ce-subscription-switch --> ce-block-ui
  ce-button --> ce-spinner
  ce-choices --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-block-ui --> ce-spinner
  style ce-subscription-switch fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
