# sc-customer-login



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                       | Type     | Default |
| ----------- | ------------ | --------------------------------- | -------- | ------- |
| `codeError` | `code-error` | Code Error coming from the parent | `string` | `''`    |


## Dependencies

### Used by

 - [sc-customer-email](../customer-email)

### Depends on

- [sc-flex](../../../ui/flex)
- [sc-input](../../../ui/input)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-verification-code](../../../ui/verification-code)

### Graph
```mermaid
graph TD;
  sc-customer-login --> sc-flex
  sc-customer-login --> sc-input
  sc-customer-login --> sc-button
  sc-customer-login --> sc-icon
  sc-customer-login --> sc-verification-code
  sc-input --> sc-form-control
  sc-form-control --> sc-visually-hidden
  sc-button --> sc-spinner
  sc-verification-code --> sc-tooltip
  sc-verification-code --> sc-button
  sc-verification-code --> sc-icon
  sc-customer-email --> sc-customer-login
  style sc-customer-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
