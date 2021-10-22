# ce-price-choices



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute       | Description | Type                              | Default     |
| ----------------- | --------------- | ----------- | --------------------------------- | ----------- |
| `busy`            | `busy`          |             | `boolean`                         | `undefined` |
| `checkoutSession` | --              |             | `CheckoutSession`                 | `undefined` |
| `choiceType`      | `choice-type`   |             | `"all" \| "multiple" \| "single"` | `'all'`     |
| `columns`         | `columns`       |             | `number`                          | `1`         |
| `currencyCode`    | `currency-code` |             | `string`                          | `undefined` |
| `default`         | `default`       |             | `string`                          | `undefined` |
| `label`           | `label`         |             | `string`                          | `undefined` |
| `lineItemData`    | --              |             | `LineItemData[]`                  | `undefined` |
| `loading`         | `loading`       |             | `boolean`                         | `undefined` |
| `products`        | --              |             | `Product[]`                       | `undefined` |
| `productsChoices` | --              |             | `ProductChoices`                  | `undefined` |


## Events

| Event               | Description              | Type                          |
| ------------------- | ------------------------ | ----------------------------- |
| `ceAddLineItems`    | Add line items event.    | `CustomEvent<LineItemData[]>` |
| `ceUpdateLineItems` | Update line items event. | `CustomEvent<LineItemData[]>` |


## Dependencies

### Depends on

- [ce-choices](../../ui/choices)
- [ce-choice](../../ui/choice)
- [ce-skeleton](../../ui/skeleton)
- [ce-format-number](../../util/format-number)
- [ce-form-row](../../ui/form-row)
- [ce-block-ui](../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-price-choices --> ce-choices
  ce-price-choices --> ce-choice
  ce-price-choices --> ce-skeleton
  ce-price-choices --> ce-format-number
  ce-price-choices --> ce-form-row
  ce-price-choices --> ce-block-ui
  ce-choices --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-block-ui --> ce-spinner
  style ce-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
