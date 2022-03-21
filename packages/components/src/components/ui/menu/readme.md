# ce-menu

<!-- Auto Generated Below -->


## Events

| Event      | Description | Type                                            |
| ---------- | ----------- | ----------------------------------------------- |
| `scSelect` |             | `CustomEvent<{ item: HTMLScMenuItemElement; }>` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Used by

 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-quantity-select](../quantity-select)
 - [sc-select](../select)
 - [sc-tax-id-input](../tax-id-input)

### Graph
```mermaid
graph TD;
  sc-payment-methods-list --> sc-menu
  sc-quantity-select --> sc-menu
  sc-select --> sc-menu
  sc-tax-id-input --> sc-menu
  style sc-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
