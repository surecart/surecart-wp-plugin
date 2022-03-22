# ce-price-choices



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description         | Type      | Default     |
| ---------- | ---------- | ------------------- | --------- | ----------- |
| `columns`  | `columns`  | Number of columns   | `number`  | `1`         |
| `label`    | `label`    | Selector label      | `string`  | `undefined` |
| `required` | `required` | Required by default | `boolean` | `false`     |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scRemoveLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |
| `scUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Dependencies

### Depends on

- [sc-choices](../../../ui/choices)

### Graph
```mermaid
graph TD;
  sc-price-choices --> sc-choices
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  style sc-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
