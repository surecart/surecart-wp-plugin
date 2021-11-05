# ce-cart-provider



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute | Description            | Type              | Default     |
| ----------------- | --------- | ---------------------- | ----------------- | ----------- |
| `checkoutSession` | --        | CheckoutSession Object | `CheckoutSession` | `undefined` |


## Events

| Event               | Description             | Type                          |
| ------------------- | ----------------------- | ----------------------------- |
| `ceUpdateLineItems` | Update line items event | `CustomEvent<LineItemData[]>` |


## Dependencies

### Used by

 - [ce-checkout](../checkout)

### Graph
```mermaid
graph TD;
  ce-checkout --> ce-cart-provider
  style ce-cart-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
