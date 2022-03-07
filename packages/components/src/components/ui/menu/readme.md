# ce-menu

<!-- Auto Generated Below -->


## Events

| Event      | Description | Type                                            |
| ---------- | ----------- | ----------------------------------------------- |
| `ceSelect` |             | `CustomEvent<{ item: HTMLCeMenuItemElement; }>` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Used by

 - [ce-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [ce-quantity-select](../quantity-select)
 - [ce-select](../select)
 - [ce-tax-id-input](../../controllers/tax-id-input)

### Graph
```mermaid
graph TD;
  ce-payment-methods-list --> ce-menu
  ce-quantity-select --> ce-menu
  ce-select --> ce-menu
  ce-tax-id-input --> ce-menu
  style ce-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
