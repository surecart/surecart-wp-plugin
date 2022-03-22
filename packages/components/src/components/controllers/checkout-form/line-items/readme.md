# ce-line-items



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute   | Description | Type                       | Default     |
| --------------- | ----------- | ----------- | -------------------------- | ----------- |
| `editable`      | `editable`  |             | `boolean`                  | `true`      |
| `loading`       | `loading`   |             | `boolean`                  | `undefined` |
| `lockedChoices` | --          |             | `PriceChoice[]`            | `[]`        |
| `order`         | --          |             | `Order`                    | `undefined` |
| `prices`        | --          |             | `{ [id: string]: Price; }` | `undefined` |
| `removable`     | `removable` |             | `boolean`                  | `true`      |


## Events

| Event              | Description           | Type                        |
| ------------------ | --------------------- | --------------------------- |
| `scRemoveLineItem` | Remove the line item. | `CustomEvent<LineItemData>` |
| `scUpdateLineItem` | Update the line item. | `CustomEvent<LineItemData>` |


## Dependencies

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-product-line-item](../../../ui/product-line-item)

### Graph
```mermaid
graph TD;
  sc-line-items --> sc-line-item
  sc-line-items --> sc-skeleton
  sc-line-items --> sc-product-line-item
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-line-item
  sc-product-line-item --> sc-quantity-select
  sc-quantity-select --> sc-dropdown
  sc-quantity-select --> sc-menu
  sc-quantity-select --> sc-menu-item
  style sc-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
