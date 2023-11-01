# sc-customer-login



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                      | Type     | Default |
| ----------- | ------------ | -------------------------------- | -------- | ------- |
| `codeError` | `code-error` | Code Error comin from the parent | `string` | `''`    |


## Events

| Event                      | Description       | Type                |
| -------------------------- | ----------------- | ------------------- |
| `scClearVerificationCodes` | Clear Codes event | `CustomEvent<void>` |


## Dependencies

### Used by

 - [sc-customer-email](../customer-email)

### Depends on

- [sc-flex](../../../ui/flex)
- [sc-input](../../../ui/input)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-verification-code](../../../ui/verification-code)
- [sc-spinner](../../../ui/spinner)
- [sc-customer-email-preview](../customer-email-preview)
- [sc-divider](../../../ui/divider)

### Graph
```mermaid
graph TD;
  sc-customer-login --> sc-flex
  sc-customer-login --> sc-input
  sc-customer-login --> sc-button
  sc-customer-login --> sc-icon
  sc-customer-login --> sc-verification-code
  sc-customer-login --> sc-spinner
  sc-customer-login --> sc-customer-email-preview
  sc-customer-login --> sc-divider
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-customer-email-preview --> sc-flex
  sc-customer-email-preview --> sc-button
  sc-customer-email --> sc-customer-login
  style sc-customer-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
