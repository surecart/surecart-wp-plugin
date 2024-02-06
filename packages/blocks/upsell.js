/**
 * Internal dependencies.
 */
import * as Upsell from './Blocks/Upsell/Upsell';
import * as UpsellTotals from './Blocks/Upsell/UpsellTotals';
import * as CountdownTimer from './Blocks/Upsell/CountdownTimer';
import * as SubmitButton from './Blocks/Upsell/SubmitButton';
import * as NoThanksButton from './Blocks/Upsell/NoThanksButton';
import { registerBlocksForTemplates } from './conditional-block-registration';

export const upsellPageTemplates = [
	'surecart/surecart//upsell-info',
	'surecart/surecart//single-upsell',
	'sc-upsell',
	'sc-part-upsell-info',
];

registerBlocksForTemplates({
	blocks: [
		Upsell,
		UpsellTotals,
		CountdownTimer,
		SubmitButton,
		NoThanksButton,
	],

	// include only for these templates.
	include: upsellPageTemplates,
});
