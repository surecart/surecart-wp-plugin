# ce-price-choices



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description | Type                    | Default     |
| ------------ | ------------ | ----------- | ----------------------- | ----------- |
| `columns`    | `columns`    |             | `number`                | `1`         |
| `default`    | `default`    |             | `string`                | `undefined` |
| `loading`    | `loading`    |             | `boolean`               | `true`      |
| `price_ids`  | --           |             | `string[]`              | `undefined` |
| `prices`     | --           |             | `Price[]`               | `undefined` |
| `submitting` | `submitting` |             | `boolean`               | `true`      |
| `type`       | `type`       |             | `"checkbox" \| "radio"` | `'radio'`   |


## Dependencies

### Depends on

- [ce-choices](../../ui/choices)
- [ce-choice](../../ui/choice)
- [ce-skeleton](../../ui/skeleton)
- [ce-provider](../../context/provider)
- [ce-consumer](../../context/consumer)

### Graph
```mermaid
graph TD;
  ce-price-choices --> ce-choices
  ce-price-choices --> ce-choice
  ce-price-choices --> ce-skeleton
  ce-price-choices --> ce-provider
  ce-price-choices --> ce-consumer
  style ce-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
