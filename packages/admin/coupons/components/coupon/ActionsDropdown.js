import { __ } from '@wordpress/i18n';

import {
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

export default ({ coupon, onDelete, onToggleArchive }) => {
	if (!coupon?.id) {
		return '';
	}

	return (
		<ScDropdown slot="suffix" placement="bottom-end">
			<ScButton type="text" slot="trigger">
				<sc-icon name="more-horizontal" />
			</ScButton>
			<ScMenu>
				{!!onToggleArchive && (
					<ScMenuItem onClick={onToggleArchive}>
						<sc-icon
							slot="prefix"
							style={{ opacity: 0.5 }}
							name="archive"
						></sc-icon>
						{coupon?.archived
							? __('Un-Archive', 'surecart')
							: __('Archive', 'surecart')}
					</ScMenuItem>
				)}
				{!!onDelete && (
					<ScMenuItem onClick={onDelete}>
						<sc-icon
							slot="prefix"
							style={{ opacity: 0.5 }}
							name="trash"
						></sc-icon>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				)}
			</ScMenu>
		</ScDropdown>
	);
};
