import { __ } from '@wordpress/i18n';

import {
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

export default ({ customer, onDelete }) => {
	if (!customer?.id) {
		return '';
	}

	return (
		<ScDropdown slot="suffix" placement="bottom-end">
			<ScButton type="text" slot="trigger">
				<sc-icon name="more-horizontal" />
			</ScButton>
			<ScMenu>
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
