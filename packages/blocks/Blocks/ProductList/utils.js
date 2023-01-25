import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { grid } from '@wordpress/icons';

export const renderNoProductsPlaceholder = () => (
	<Placeholder icon={grid} label={__('All Products', 'surecart')}>
		<p>{__("You don't have any products to list here yet.", 'surecart')}</p>
	</Placeholder>
);
