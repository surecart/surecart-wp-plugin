/**
 * External dependencies.
 */
import { compose } from '@wordpress/compose';
import { MenuItem } from '@wordpress/components';
import { withPluginContext } from '@wordpress/plugins';
import { ActionItem } from '@wordpress/interface';

/**
 * Internal dependencies.
 */
import { MORE_MENU_ACTION_ITEM_SLOT_NAME } from '../constants';

const PluginMoreMenuItem = compose(
	withPluginContext((context, ownProps) => {
		return {
			as: ownProps.as ?? MenuItem,
			icon: ownProps.icon || context.icon,
			name: MORE_MENU_ACTION_ITEM_SLOT_NAME,
		};
	})
)(ActionItem);

export default PluginMoreMenuItem;