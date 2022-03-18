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

 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-coupon-form](../../ui/coupon-form)
 - [ce-invoices-list](../../controllers/dashboard/invoices-list)
 - [ce-line-item-tax](../../controllers/checkout-form/line-item-tax)
 - [ce-line-item-total](../../controllers/checkout-form/line-item-total)
 - [ce-order-confirmation-totals](../../controllers/confirmation/order-confirmation-totals)
 - [ce-order-detail](../../controllers/confirmation/order-detail)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-price-choice](../../controllers/checkout-form/price-choice)
 - [ce-product-line-item](../../ui/product-line-item)
 - [ce-subscription-details](../../controllers/dashboard/subscription-details)
 - [ce-subscription-switch](../../controllers/dashboard/subscription-switch)
 - [ce-total](../../controllers/checkout-form/total)
 - [ce-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Graph
```mermaid
graph TD;
  ce-charges-list --> ce-format-number
  ce-coupon-form --> ce-format-number
  ce-invoices-list --> ce-format-number
  ce-line-item-tax --> ce-format-number
  ce-line-item-total --> ce-format-number
  ce-order-confirmation-totals --> ce-format-number
  ce-order-detail --> ce-format-number
  ce-orders-list --> ce-format-number
  ce-price-choice --> ce-format-number
  ce-product-line-item --> ce-format-number
  ce-subscription-details --> ce-format-number
  ce-subscription-switch --> ce-format-number
  ce-total --> ce-format-number
  ce-upcoming-invoice --> ce-format-number
  style ce-format-number fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
