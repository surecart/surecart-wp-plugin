import { ScDropdown, ScMenu, ScMenuItem } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ attributes, onModeSelect }) => {
	const { mode } = attributes;

	const renderBadge = () => {
		if (mode === 'test') {
			return (
				<sc-button type="warning" size="small" caret>
					{__('Test', 'surecart')}
				</sc-button>
			);
		}

		return (
			<sc-button type="success" size="small" caret>
				{__('Live', 'surecart')}
			</sc-button>
		);
	};

	return (
		<ScDropdown position="bottom-right">
			<span slot="trigger">{renderBadge()}</span>
			<ScMenu>
				<ScMenuItem
					onClick={() => onModeSelect('test')}
					checked={mode === 'test'}
				>
					{__('Test', 'surecart')}
				</ScMenuItem>
				<ScMenuItem
					onClick={() => onModeSelect('live')}
					checked={mode === 'live' || !mode}
				>
					{__('Live', 'surecart')}
				</ScMenuItem>
			</ScMenu>
		</ScDropdown>
	);
};
