/**
 * WordPress dependencies
 */
import {
	__experimentalFullscreenModeClose as FullscreenModeClose,
	__experimentalMainDashboardButton as MainDashboardButton,
} from '@wordpress/edit-post';
import { arrowLeft } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

export default () => {
	const metadata = useSelect((select) =>
		select('core/editor').getEditedPostAttribute('meta')
	);

	// we only care about product id.
	if (!metadata?.product?.id) {
		return null;
	}

	return (
		<MainDashboardButton>
			<FullscreenModeClose
				icon={arrowLeft}
				label={__('Edit Product', 'surecart')}
				showTooltip={false}
				href={addQueryArgs(`${window?.scData?.admin_url}admin.php`, {
					page: 'sc-products',
					action: 'edit',
					id: metadata.product.id,
				})}
			/>
		</MainDashboardButton>
	);
};
