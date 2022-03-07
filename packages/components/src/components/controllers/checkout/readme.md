# ce-checkout



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute                       | Description                                 | Type                           | Default     |
| ----------------------------- | ------------------------------- | ------------------------------------------- | ------------------------------ | ----------- |
| `alignment`                   | `alignment`                     | Alignment                                   | `"center" \| "full" \| "wide"` | `undefined` |
| `coupon`                      | --                              | Optionally pass a coupon.                   | `Coupon`                       | `undefined` |
| `currencyCode`                | `currency-code`                 | Currency to use for this checkout.          | `string`                       | `'usd'`     |
| `customer`                    | --                              | Stores the current customer                 | `Customer`                     | `undefined` |
| `disableComponentsValidation` | `disable-components-validation` | Should we disable components validation     | `boolean`                      | `undefined` |
| `formId`                      | `form-id`                       | The checkout form id                        | `number`                       | `undefined` |
| `i18n`                        | --                              | Translation object.                         | `Object`                       | `undefined` |
| `mode`                        | `mode`                          | Are we in test or live mode.                | `"live" \| "test"`             | `'live'`    |
| `persistSession`              | `persist-session`               | Where to go on success                      | `boolean`                      | `true`      |
| `prices`                      | --                              | An array of prices to pre-fill in the form. | `PriceChoice[]`                | `[]`        |
| `successUrl`                  | `success-url`                   | Where to go on success                      | `string`                       | `''`        |


## Dependencies

### Depends on

- [ce-alert](../../ui/alert)
- [ce-block-ui](../../ui/block-ui)
- [ce-form-components-validator](../../providers/form-components-validator)
- [ce-session-provider](../../providers/session-provider)

### Graph
```mermaid
graph TD;
  ce-checkout --> ce-alert
  ce-checkout --> ce-block-ui
  ce-checkout --> ce-form-components-validator
  ce-checkout --> ce-session-provider
  ce-alert --> ce-icon
  ce-block-ui --> ce-spinner
  ce-form-components-validator --> ce-address
  ce-address --> ce-form-control
  ce-address --> ce-select
  ce-address --> ce-input
  ce-form-control --> ce-tooltip
  ce-select --> ce-menu-label
  ce-select --> ce-menu-item
  ce-select --> ce-form-control
  ce-select --> ce-dropdown
  ce-select --> ce-icon
  ce-select --> ce-input
  ce-select --> ce-spinner
  ce-select --> ce-menu
  ce-input --> ce-form-control
  ce-session-provider --> ce-line-items-provider
  style ce-checkout fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
