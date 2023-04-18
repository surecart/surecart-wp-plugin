import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import usePostProduct from '../../admin/hooks/usePostProduct';
import { Button } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

registerPlugin('surecart-product-settings-panel', {
	render: () => {
		const { product } = usePostProduct();

		if (!product) return null;

		return (
			<PluginDocumentSettingPanel
				name="product-panel"
				title={__('Product', 'surecart')}
			>
				<h2>{product?.name}</h2>
				<Button
					isSecondary
					href={addQueryArgs('admin.php', {
						page: 'sc-products',
						action: 'edit',
						id: product?.id,
					})}
				>
					{__('Edit Product', 'surecart')}
				</Button>
			</PluginDocumentSettingPanel>
		);
	},
	icon: null,
});
