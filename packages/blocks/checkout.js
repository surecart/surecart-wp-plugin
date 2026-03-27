import { registerBlocks } from './register-block';

import * as address from '@blocks/Address';
import * as bumpLineItem from '@blocks/BumpLineItem';
import * as button from '@blocks/Button';
import * as checkbox from '@blocks/Checkbox';
import * as checkoutErrors from '@blocks/CheckoutErrors';
import * as column from '@blocks/Column';
import * as columns from '@blocks/Columns';
import * as coupon from '@blocks/Coupon';
import * as trialLineItem from '@blocks/TrialLineItem';
import * as divider from '@blocks/Divider';
import * as donation from '@blocks/Donation';
import * as productDonation from '@blocks/ProductDonation';
import * as donationAmount from '@blocks/DonationAmount';
import * as productDonationPrices from '@blocks/ProductDonationPrices';
import * as productDonationRecurringPrices from '@blocks/ProductDonationRecurringPrices';
import * as productDonationAmounts from '@blocks/ProductDonationAmounts';
import * as productDonationAmount from '@blocks/ProductDonationAmount';
import * as productDonationCustomAmount from '@blocks/ProductDonationCustomAmount';
import * as email from '@blocks/Email';
import * as phone from '@blocks/Phone';
import * as expressPayment from '@blocks/ExpressPayment';
import * as firstName from '@blocks/FirstName';
import * as form from '@blocks/Form';
import * as heading from '@blocks/Heading';
import * as input from '@blocks/Input';
import * as lastName from '@blocks/LastName';
import * as lineItems from '@blocks/LineItems';
import * as name from '@blocks/Name';
import * as nameYourPrice from '@blocks/NameYourPrice';
import * as orderBumps from '@blocks/OrderBumps';
import * as password from '@blocks/Password';
import * as payment from '@blocks/Payment';
import * as priceChoice from '@blocks/PriceChoice';
import * as priceSelector from '@blocks/PriceSelector';
import * as variantPriceSelector from '@blocks/VariantPriceSelector';
import * as radio from '@blocks/Radio';
import * as radioGroup from '@blocks/RadioGroup';
import * as submit from '@blocks/Submit';
import * as subtotal from '@blocks/Subtotal';
import * as switchBlock from '@blocks/Switch';
import * as taxIdInput from '@blocks/TaxIdInput';
import * as taxLineItem from '@blocks/TaxLineItem';
import * as textarea from '@blocks/Textarea';
import * as invoiceNumber from '@blocks/InvoiceNumber';
import * as invoiceDueDate from '@blocks/InvoiceDueDate';
import * as invoiceReceiptDownload from '@blocks/InvoiceReceiptDownload';
import * as invoiceMemo from '@blocks/InvoiceMemo';
import * as invoiceDetails from '@blocks/InvoiceDetails';
import * as total from '@blocks/Total';
import * as totals from '@blocks/Totals';
import * as shippingLineItem from '@blocks/LineItemShipping';
import * as conditionalForm from '@blocks/ConditionalForm';
import * as shippingChoices from '@blocks/ShippingChoices';

registerBlocks([
	button,
	donation,
	productDonation,
	donationAmount,
	productDonationPrices,
	productDonationRecurringPrices,
	productDonationAmounts,
	productDonationAmount,
	productDonationCustomAmount,
	nameYourPrice,
	bumpLineItem,
	checkoutErrors,
	address,
	columns,
	column,
	checkbox,
	radio,
	radioGroup,
	coupon,
	taxIdInput,
	divider,
	email,
	phone,
	expressPayment,
	form,
	heading,
	input,
	textarea,
	lineItems,
	taxLineItem,
	name,
	firstName,
	lastName,
	password,
	payment,
	priceChoice,
	priceSelector,
	variantPriceSelector,
	submit,
	subtotal,
	switchBlock,
	invoiceNumber,
	invoiceDueDate,
	invoiceReceiptDownload,
	invoiceDetails,
	invoiceMemo,
	total,
	totals,
	shippingChoices,
	shippingLineItem,
	orderBumps,
	conditionalForm,
	trialLineItem,
]);
