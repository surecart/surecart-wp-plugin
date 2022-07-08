# ce-cart-provider



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description  | Type    | Default     |
| -------- | --------- | ------------ | ------- | ----------- |
| `order`  | --        | Order Object | `Order` | `undefined` |


## Events

| Event               | Description             | Type                          |
| ------------------- | ----------------------- | ----------------------------- |
| `scUpdateLineItems` | Update line items event | `CustomEvent<LineItemData[]>` |


## Dependencies

### Used by

 - [sc-cart-session-provider](../cart-session-provider)
 - [sc-session-provider](../session-provider)

### Graph
```mermaid
graph TD;
  sc-cart-session-provider --> sc-line-items-provider
  sc-session-provider --> sc-line-items-provider
  style sc-line-items-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
