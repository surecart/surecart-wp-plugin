# ce-line-items



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute   | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Default     |
| ----------------- | ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `checkoutSession` | --          |             | `CheckoutSession`                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `undefined` |
| `editable`        | `editable`  |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `true`      |
| `loading`         | `loading`   |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `undefined` |
| `lockedChoices`   | --          |             | `PriceChoice[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `[]`        |
| `prices`          | --          |             | `{ [id: string]: { id: string; name: string; description?: string; amount: number; currency: string; recurring: boolean; recurring_interval?: "day" \| "week" \| "month" \| "year"; recurring_interval_count?: number; ad_hoc: boolean; ad_hoc_max_amount: number; ad_hoc_min_amount: number; archived: boolean; product_id?: string; archived_at?: string; created_at: number; updated_at: number; product?: string; metadata: { [key: string]: string; }; }; }` | `undefined` |
| `removable`       | `removable` |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `true`      |


## Events

| Event              | Description           | Type                        |
| ------------------ | --------------------- | --------------------------- |
| `ceRemoveLineItem` | Remove the line item. | `CustomEvent<LineItemData>` |
| `ceUpdateLineItem` | Update the line item. | `CustomEvent<LineItemData>` |


## Dependencies

### Depends on

- [ce-line-item](../../ui/line-item)
- [ce-skeleton](../../ui/skeleton)
- [ce-product-line-item](../../ui/product-line-item)

### Graph
```mermaid
graph TD;
  ce-line-items --> ce-line-item
  ce-line-items --> ce-skeleton
  ce-line-items --> ce-product-line-item
  ce-product-line-item --> ce-format-number
  ce-product-line-item --> ce-line-item
  ce-product-line-item --> ce-quantity-select
  ce-quantity-select --> ce-dropdown
  ce-quantity-select --> ce-menu
  ce-quantity-select --> ce-menu-item
  style ce-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
