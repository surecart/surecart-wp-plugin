import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedListRow,
} from '@surecart/components-react';

export default ({ children, onRemove }) => {
	return (
		<ScStackedListRow
			style={{
				'--columns': '1',
			}}
		>
			{children}
			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={onRemove}>
						<ScIcon slot="prefix" name="trash" />
						{__('Remove', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</ScStackedListRow>
	);
};
