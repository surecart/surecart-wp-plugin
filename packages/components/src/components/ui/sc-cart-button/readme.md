# sc-cart-button



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                      | Type               | Default          |
| -------- | --------- | -------------------------------- | ------------------ | ---------------- |
| `formId` | `form-id` | The form id to use for the cart. | `string`           | `undefined`      |
| `icon`   | `icon`    | The icon to show.                | `string`           | `'shopping-bag'` |
| `mode`   | `mode`    | Are we in test or live mode.     | `"live" \| "test"` | `'live'`         |


## Shadow Parts

| Part      | Description                |
| --------- | -------------------------- |
| `"base"`  | The elements base wrapper. |
| `"count"` | The icon base wrapper.     |


## Dependencies

### Depends on

- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-cart-button --> sc-icon
  style sc-cart-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
