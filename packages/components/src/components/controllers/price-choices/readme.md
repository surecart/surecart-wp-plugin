# ce-price-choices



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description       | Type      | Default     |
| --------- | --------- | ----------------- | --------- | ----------- |
| `busy`    | `busy`    | Busy              | `boolean` | `false`     |
| `columns` | `columns` | Number of columns | `number`  | `1`         |
| `label`   | `label`   | Selector label    | `string`  | `undefined` |


## Dependencies

### Depends on

- [ce-choices](../../ui/choices)
- [ce-block-ui](../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-price-choices --> ce-choices
  ce-price-choices --> ce-block-ui
  ce-choices --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-block-ui --> ce-spinner
  style ce-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
