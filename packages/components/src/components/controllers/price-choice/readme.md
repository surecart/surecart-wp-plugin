# ce-price-choice



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute      | Description                     | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Default     |
| ----------------- | -------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `checked`         | `checked`      | Is this checked by default      | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `false`     |
| `order` | --             | Session                         | `Order`                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `undefined` |
| `description`     | `description`  | Label for the choice.           | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `undefined` |
| `error`           | --             | Errors from response            | `ResponseError`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `undefined` |
| `label`           | `label`        | Label for the choice.           | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `undefined` |
| `loading`         | `loading`      | Is this loading                 | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `false`     |
| `price`           | --             | Stores the price                | `Price`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined` |
| `priceId`         | `price-id`     | Id of the price.                | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `undefined` |
| `prices`          | --             | Price entities                  | `{ [id: string]: { id: string; name: string; description?: string; amount: number; currency: string; recurring: boolean; recurring_interval?: "day" \| "week" \| "month" \| "year"; recurring_interval_count?: number; ad_hoc: boolean; ad_hoc_max_amount: number; ad_hoc_min_amount: number; archived: boolean; product_id?: string; archived_at?: string; created_at: number; updated_at: number; product?: string; metadata: { [key: string]: string; }; }; }` | `{}`        |
| `products`        | --             | Product entity                  | `{ [id: string]: Product; }`                                                                                                                                                                                                                                                                                                                                                                                                                                      | `{}`        |
| `quantity`        | `quantity`     | Default quantity                | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `1`         |
| `showControl`     | `show-control` | Show the radio/checkbox control | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `true`      |
| `showLabel`       | `show-label`   | Show the label                  | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `true`      |
| `showPrice`       | `show-price`   | Show the price amount           | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `true`      |
| `type`            | `type`         | Choice Type                     | `"checkbox" \| "radio"`                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined` |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `ceAddEntities`    | Add entities           | `CustomEvent<any>`          |
| `ceRemoveLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |
| `ceUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Dependencies

### Depends on

- [ce-price-input](../../ui/price-input)
- [ce-alert](../../ui/alert)
- [ce-format-number](../../util/format-number)
- [ce-choice](../../ui/choice)
- [ce-skeleton](../../ui/skeleton)
- [ce-tooltip](../../ui/tooltip)

### Graph
```mermaid
graph TD;
  ce-price-choice --> ce-price-input
  ce-price-choice --> ce-alert
  ce-price-choice --> ce-format-number
  ce-price-choice --> ce-choice
  ce-price-choice --> ce-skeleton
  ce-price-choice --> ce-tooltip
  ce-price-input --> ce-input
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  style ce-price-choice fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
