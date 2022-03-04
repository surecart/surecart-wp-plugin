# ce-customer-subscription



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description    | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Default     |
| ---------- | ---------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `price`    | --         |                | `Price`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined` |
| `priceId`  | `price-id` |                | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `undefined` |
| `prices`   | --         | Price entities | `{ [id: string]: { id: string; name: string; description?: string; amount: number; currency: string; recurring: boolean; recurring_interval?: "day" \| "week" \| "month" \| "year"; recurring_interval_count?: number; ad_hoc: boolean; ad_hoc_max_amount: number; ad_hoc_min_amount: number; archived: boolean; product_id?: string; archived_at?: string; created_at: number; updated_at: number; product?: string; metadata: { [key: string]: string; }; }; }` | `{}`        |
| `products` | --         | Product entity | `{ [id: string]: Product; }`                                                                                                                                                                                                                                                                                                                                                                                                                                      | `{}`        |


## Events

| Event           | Description  | Type               |
| --------------- | ------------ | ------------------ |
| `ceAddEntities` | Add entities | `CustomEvent<any>` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"name"` |             |


## Dependencies

### Used by

 - [ce-customer-subscription-edit](../subscription-detail)

### Depends on

- [ce-skeleton](../../../ui/skeleton)
- [ce-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  ce-customer-subscription-plan --> ce-skeleton
  ce-customer-subscription-plan --> ce-format-number
  ce-customer-subscription-edit --> ce-customer-subscription-plan
  style ce-customer-subscription-plan fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
