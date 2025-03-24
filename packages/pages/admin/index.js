import { registerPlugin } from '@wordpress/plugins';
import Panel from './Panel';

import {
	__experimentalFullscreenModeClose as FullscreenModeClose,
	__experimentalMainDashboardButton as MainDashboardButton,
} from '@wordpress/edit-post';
import { wordpress } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
registerPlugin('plugin-document-setting-panel-demo', {
	render: Panel,
});

const MainDashboardButtonIconTest = () => {
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
				icon={wordpress}
				label={__('Edit Product', 'surecart')}
				href={addQueryArgs('/wp-admin/admin.php', {
					page: 'sc-products',
					action: 'edit',
					id: metadata.product.id,
				})}
			/>
		</MainDashboardButton>
	);
};

registerPlugin('main-dashboard-button-icon-test', {
	render: MainDashboardButtonIconTest,
});
