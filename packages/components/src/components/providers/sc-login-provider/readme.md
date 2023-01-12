# sc-login-provider



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description            | Type      | Default     |
| ---------- | ----------- | ---------------------- | --------- | ----------- |
| `loggedIn` | `logged-in` | Is the user logged in. | `boolean` | `undefined` |
| `order`    | --          |                        | `Order`   | `undefined` |


## Events

| Event           | Description | Type                                             |
| --------------- | ----------- | ------------------------------------------------ |
| `scSetCustomer` |             | `CustomEvent<{ email: string; name?: string; }>` |
| `scSetLoggedIn` |             | `CustomEvent<boolean>`                           |


## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [sc-alert](../../ui/alert)
- [sc-dialog](../../ui/sc-dialog)
- [sc-form](../../ui/form)
- [sc-input](../../ui/input)
- [sc-button](../../ui/button)

### Graph
```mermaid
graph TD;
  sc-login-provider --> sc-alert
  sc-login-provider --> sc-dialog
  sc-login-provider --> sc-form
  sc-login-provider --> sc-input
  sc-login-provider --> sc-button
  sc-alert --> sc-icon
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-checkout --> sc-login-provider
  style sc-login-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
