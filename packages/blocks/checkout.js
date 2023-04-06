import * as address from '@blocks/Address';
import * as bumpLineItem from '@blocks/BumpLineItem';
// blocks
import * as button from '@blocks/Button';
import * as checkbox from '@blocks/Checkbox';
import * as checkoutErrors from '@blocks/CheckoutErrors';
import * as column from '@blocks/Column';
import * as columns from '@blocks/Columns';
import * as coupon from '@blocks/Coupon';
import * as divider from '@blocks/Divider';
import * as donation from '@blocks/Donation';
import * as donationAmount from '@blocks/DonationAmount';
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
import * as radio from '@blocks/Radio';
import * as radioGroup from '@blocks/RadioGroup';
import * as submit from '@blocks/Submit';
import * as subtotal from '@blocks/Subtotal';
import * as switchBlock from '@blocks/Switch';
import * as taxIdInput from '@blocks/TaxIdInput';
import * as taxLineItem from '@blocks/TaxLineItem';
import * as textarea from '@blocks/Textarea';
import * as total from '@blocks/Total';
import * as totals from '@blocks/Totals';
import * as conditionalForm from '@blocks/ConditionalForm';

import { registerBlocks } from './register-block';

registerBlocks([
	button,
	donation,
	donationAmount,
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
	submit,
	subtotal,
	switchBlock,
	total,
	totals,
	...(!!window?.scBlockData?.entitlements?.bumps ? [orderBumps] : []),
	...(!!window?.scBlockData?.entitlements?.conditional_forms
		? [conditionalForm]
		: []),
]);
