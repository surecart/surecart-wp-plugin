# ce-donation-choices



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                               | Type         | Default     |
| --------------- | ---------------- | ----------------------------------------- | ------------ | ----------- |
| `busy`          | `busy`           |                                           | `boolean`    | `undefined` |
| `defaultAmount` | `default-amount` | The default amount to load the page with. | `string`     | `undefined` |
| `label`         | `label`          | The label for the field.                  | `string`     | `undefined` |
| `lineItems`     | --               | Order line items.                         | `LineItem[]` | `[]`        |
| `loading`       | `loading`        | Is this loading                           | `boolean`    | `undefined` |
| `priceId`       | `price-id`       | The price id for the fields.              | `string`     | `undefined` |
| `removeInvalid` | `remove-invalid` |                                           | `boolean`    | `true`      |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `ceAddLineItem`    | Toggle line item event | `CustomEvent<LineItemData>` |
| `ceRemoveLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |
| `ceUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [ce-skeleton](../../../ui/skeleton)
- [ce-choices](../../../ui/choices)
- [ce-price-input](../../../ui/price-input)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-donation-choices --> ce-skeleton
  ce-donation-choices --> ce-choices
  ce-donation-choices --> ce-price-input
  ce-donation-choices --> ce-button
  ce-donation-choices --> ce-block-ui
  ce-choices --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-price-input --> ce-input
  ce-input --> ce-form-control
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-donation-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
