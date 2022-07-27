# sc-cart



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                        | Type               | Default     |
| -------------- | --------------- | ------------------------------------------------------------------ | ------------------ | ----------- |
| `alwaysShow`   | `always-show`   | Should we force show the cart, even if there's a form on the page? | `boolean`          | `undefined` |
| `cartTemplate` | `cart-template` | The template for the cart to inject when opened.                   | `string`           | `undefined` |
| `checkoutLink` | `checkout-link` |                                                                    | `string`           | `undefined` |
| `checkoutUrl`  | `checkout-url`  | The checkout url for the button.                                   | `string`           | `undefined` |
| `formId`       | `form-id`       | The form id to use for the cart.                                   | `string`           | `undefined` |
| `header`       | `header`        | The header for the popout.                                         | `string`           | `undefined` |
| `mode`         | `mode`          | Are we in test or live mode.                                       | `"live" \| "test"` | `'live'`    |


## Dependencies

### Depends on

- [sc-cart-session-provider](../../../providers/cart-session-provider)
- [sc-cart-icon](../../../ui/sc-cart-icon)
- [sc-drawer](../../../ui/sc-drawer)
- [sc-error](../../../ui/error)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-cart --> sc-cart-session-provider
  sc-cart --> sc-cart-icon
  sc-cart --> sc-drawer
  sc-cart --> sc-error
  sc-cart --> sc-block-ui
  sc-cart-session-provider --> sc-line-items-provider
  sc-cart-icon --> sc-icon
  sc-drawer --> sc-icon
  sc-error --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-cart fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
