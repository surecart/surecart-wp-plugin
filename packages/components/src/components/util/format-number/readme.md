# ce-format-number



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                    | Description                                                                                    | Type                                             | Default     |
| -------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------- |
| `currency`                 | `currency`                   | The currency to use when formatting. Must be an ISO 4217 currency code such as `USD` or `EUR`. | `string`                                         | `'USD'`     |
| `currencyDisplay`          | `currency-display`           | How to display the currency.                                                                   | `"code" \| "name" \| "narrowSymbol" \| "symbol"` | `'symbol'`  |
| `locale`                   | `locale`                     | The locale to use when formatting the number.                                                  | `string`                                         | `undefined` |
| `maximumFractionDigits`    | `maximum-fraction-digits`    | The maximum number of fraction digits to use. Possible values are 0 - 20.                      | `number`                                         | `undefined` |
| `maximumSignificantDigits` | `maximum-significant-digits` | The maximum number of significant digits to use,. Possible values are 1 - 21.                  | `number`                                         | `undefined` |
| `minimumFractionDigits`    | `minimum-fraction-digits`    | The minimum number of fraction digits to use. Possible values are 0 - 20.                      | `number`                                         | `undefined` |
| `minimumIntegerDigits`     | `minimum-integer-digits`     | The minimum number of integer digits to use. Possible values are 1 - 21.                       | `number`                                         | `undefined` |
| `minimumSignificantDigits` | `minimum-significant-digits` | The minimum number of significant digits to use. Possible values are 1 - 21.                   | `number`                                         | `undefined` |
| `noConvert`                | `no-convert`                 |                                                                                                | `boolean`                                        | `undefined` |
| `noGrouping`               | `no-grouping`                | Turns off grouping separators.                                                                 | `boolean`                                        | `false`     |
| `type`                     | `type`                       | The formatting style to use.                                                                   | `"currency" \| "decimal" \| "percent"`           | `'decimal'` |
| `value`                    | `value`                      | The number to format.                                                                          | `number`                                         | `0`         |


## Dependencies

### Used by

 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-customer-orders-list](../../controllers/dashboard/customer-orders-list)
 - [ce-customer-subscription](../../controllers/dashboard/customer-subscription)
 - [ce-customer-subscription-edit](../../controllers/dashboard/customer-subscription-edit)
 - [ce-customer-subscription-plan](../../controllers/dashboard/customer-subscription-plan)
 - [ce-order-confirmation-totals](../../controllers/order-confirmation-totals)
 - [ce-price-choice](../../controllers/price-choice)
 - [ce-product-line-item](../../ui/product-line-item)
 - [ce-session-detail](../../controllers/session-detail)
 - [ce-session-subscription](../../controllers/session-subscription)
 - [ce-total](../../controllers/ce-total)

### Graph
```mermaid
graph TD;
  ce-coupon-form --> ce-format-number
  ce-customer-orders-list --> ce-format-number
  ce-customer-subscription --> ce-format-number
  ce-customer-subscription-edit --> ce-format-number
  ce-customer-subscription-plan --> ce-format-number
  ce-order-confirmation-totals --> ce-format-number
  ce-price-choice --> ce-format-number
  ce-product-line-item --> ce-format-number
  ce-session-detail --> ce-format-number
  ce-session-subscription --> ce-format-number
  ce-total --> ce-format-number
  style ce-format-number fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
