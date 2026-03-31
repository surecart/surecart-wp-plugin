# sc-verification-code



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description                                           | Type                      | Default     |
| ---------- | --------- | ----------------------------------------------------- | ------------------------- | ----------- |
| `loading`  | `loading` | Whether the component is in a loading/verifying state | `boolean`                 | `false`     |
| `onChange` | --        | On change verification code                           | `(value: string) => void` | `undefined` |
| `total`    | `total`   | Total number of inputs                                | `number`                  | `6`         |


## Dependencies

### Used by

 - [sc-customer-login](../../controllers/checkout-form/customer-login)

### Depends on

- [sc-tooltip](../tooltip)
- [sc-button](../button)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-verification-code --> sc-tooltip
  sc-verification-code --> sc-button
  sc-verification-code --> sc-icon
  sc-button --> sc-spinner
  sc-customer-login --> sc-verification-code
  style sc-verification-code fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
