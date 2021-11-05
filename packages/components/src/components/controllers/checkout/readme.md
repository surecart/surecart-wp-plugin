# ce-checkout



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                   | Type                              | Default                                 |
| -------------- | --------------- | --------------------------------------------- | --------------------------------- | --------------------------------------- |
| `alignment`    | `alignment`     | Alignment                                     | `"center" \| "full" \| "wide"`    | `undefined`                             |
| `choiceType`   | `choice-type`   | Give a user a choice to switch session prices | `"all" \| "multiple" \| "single"` | `'all'`                                 |
| `coupon`       | --              | Optionally pass a coupon.                     | `Coupon`                          | `undefined`                             |
| `currencyCode` | `currency-code` | Currency to use for this checkout.            | `string`                          | `'usd'`                                 |
| `i18n`         | --              | Translation object.                           | `Object`                          | `undefined`                             |
| `keys`         | --              | Publishable keys for providers                | `Keys`                            | `{     stripe: '',     paypal: '',   }` |
| `lineItemData` | --              | Pass line item data to create with session.   | `LineItemData[]`                  | `undefined`                             |
| `prices`       | --              | An array of prices to pre-fill in the form.   | `PriceChoice[]`                   | `undefined`                             |
| `successUrl`   | `success-url`   | Where to go on success                        | `string`                          | `''`                                    |


## Dependencies

### Depends on

- [ce-alert](../../ui/alert)
- [ce-cart-provider](../cart-provider)

### Graph
```mermaid
graph TD;
  ce-checkout --> ce-alert
  ce-checkout --> ce-cart-provider
  style ce-checkout fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
