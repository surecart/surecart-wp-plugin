/**
 * Internal dependencies.
 */
import * as CountdownTimer from './Blocks/OrderBump/CountdownTimer';
import * as Cta from './Blocks/OrderBump/Cta';
import * as Description from './Blocks/OrderBump/Description';
import * as SubmitButton from './Blocks/OrderBump/SubmitButton';
import * as NoThanksButton from './Blocks/OrderBump/NoThanksButton';
import { registerBlocksForTemplates } from './conditional-block-registration';

export const bumpPageTemplates = [
	'surecart/surecart//bump-info',
	'surecart/surecart//single-bump',
	'sc-bump',
	'sc-part-bump-info',
];

registerBlocksForTemplates({
	blocks: [Cta, Description, CountdownTimer, SubmitButton, NoThanksButton],

	// include only for these templates.
	include: bumpPageTemplates,
});
