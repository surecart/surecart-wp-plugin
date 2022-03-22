# ce-quantity-select



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type          | Default     |
| ---------- | ---------- | ----------- | ------------- | ----------- |
| `clickEl`  | --         |             | `HTMLElement` | `undefined` |
| `max`      | `max`      |             | `number`      | `100`       |
| `min`      | `min`      |             | `number`      | `1`         |
| `quantity` | `quantity` |             | `number`      | `0`         |


## Events

| Event      | Description | Type                  |
| ---------- | ----------- | --------------------- |
| `scChange` |             | `CustomEvent<number>` |


## Dependencies

### Used by

 - [sc-product-line-item](../product-line-item)

### Depends on

- [sc-dropdown](../dropdown)
- [sc-menu](../menu)
- [sc-menu-item](../menu-item)

### Graph
```mermaid
graph TD;
  sc-quantity-select --> sc-dropdown
  sc-quantity-select --> sc-menu
  sc-quantity-select --> sc-menu-item
  sc-product-line-item --> sc-quantity-select
  style sc-quantity-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
