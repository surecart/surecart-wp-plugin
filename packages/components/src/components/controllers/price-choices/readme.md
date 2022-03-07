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
| `ceRemoveLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |
| `ceUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Dependencies

### Depends on

- [ce-choices](../../ui/choices)

### Graph
```mermaid
graph TD;
  ce-price-choices --> ce-choices
  ce-choices --> ce-form-control
  ce-form-control --> ce-tooltip
  style ce-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
