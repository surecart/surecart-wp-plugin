import * as Description from './Blocks/OrderBump/Description';
import * as Media from './Blocks/OrderBump/Media';
import * as Price from './Blocks/OrderBump/Price';
import * as Quantity from './Blocks/OrderBump/Quantity';
import * as CountdownTimer from './Blocks/OrderBump/CountdownTimer';
import * as Title from './Blocks/OrderBump/Title';
import * as ProductTitle from './Blocks/OrderBump/ProductTitle';
import * as ProductDescription from './Blocks/OrderBump/ProductDescription';
import * as PriceChoices from './Blocks/OrderBump/PriceChoices';
import * as Variants from './Blocks/OrderBump/VariantChoices';
import * as SubmitButton from './Blocks/OrderBump/SubmitButton';
import * as NoThanksButton from './Blocks/OrderBump/NoThanksButton';
import { __ } from '@wordpress/i18n';
import { registerBlocksForTemplates } from './conditional-block-registration';

registerBlocksForTemplates({
	blocks: [
		Quantity,
		Title,
		Media,
		Description,
		Price,
		PriceChoices,
		Variants,
		CountdownTimer,
		ProductTitle,
		ProductDescription,
		// Totals,
		SubmitButton,
		NoThanksButton,
	],
	// include only for these templates.
	include: [
		'surecart/surecart//bump-info',
		'surecart/surecart//single-bump',
		'sc-bumps',
		'sc-part-bumps-info',
	],
});
