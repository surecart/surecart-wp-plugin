import {
	PluginDocumentSettingPanel,
	store as editorStore,
} from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useEffect } from 'react';
import { usePluginContext } from '@wordpress/plugins';
/**
 * The component to be rendered  as part of the plugin.
 */
export default () => {
	// Retrieve information about the current post type.
	const isProduct = useSelect((select) => {
		console.log(select(editorStore).getCurrentPostType());
		return select(editorStore).getCurrentPostType() === 'sc_product';
	}, []);

	const { name: pluginName } = usePluginContext();
	console.log(pluginName);

	const { toggleEditorPanelOpened } = useDispatch(editorStore);

	const panelName = `${pluginName}/product-page-info`;

	const { opened, isEnabled } = useSelect(
		(select) => {
			const { isEditorPanelOpened, isEditorPanelEnabled } =
				select(editorStore);
			return {
				opened: isEditorPanelOpened(panelName),
				isEnabled: isEditorPanelEnabled(panelName),
			};
		},
		[panelName]
	);

	useEffect(() => {
		toggleEditorPanelOpened(panelName);
	}, [opened]);

	console.log(opened, isEnabled);

	// If the post type is viewable, do not render my fill
	if (!isProduct) {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="product-page-info"
			title={__('Site Editor Example')}
			className="product-page-info"
		>
			<p>{__('Only appears in the Site Editor')}</p>
		</PluginDocumentSettingPanel>
	);
};
