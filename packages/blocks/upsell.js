/**
 * Internal dependencies.
 */
import * as CountdownTimer from './Blocks/Upsell/CountdownTimer';
import * as Cta from './Blocks/Upsell/Cta';
import * as Description from './Blocks/Upsell/Description';
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
	blocks: [Cta, Description, CountdownTimer, SubmitButton, NoThanksButton],

	// include only for these templates.
	include: upsellPageTemplates,
});
