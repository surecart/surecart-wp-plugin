import { CeDropdown, CeMenu, CeMenuItem } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { mode } = attributes;

	const renderBadge = () => {
		if (mode === 'test') {
			return (
				<ce-button type="warning" size="small" caret>
					{__('Test', 'surecart')}
				</ce-button>
			);
		}

		return (
			<ce-button type="success" size="small" caret>
				{__('Live', 'surecart')}
			</ce-button>
		);
	};

	return (
		<CeDropdown position="bottom-right">
			<span slot="trigger">{renderBadge()}</span>
			<CeMenu>
				<CeMenuItem
					onClick={() => setAttributes({ mode: 'test' })}
					checked={mode === 'test'}
				>
					{__('Test', 'surecart')}
				</CeMenuItem>
				<CeMenuItem
					onClick={() => setAttributes({ mode: 'live' })}
					checked={mode === 'live' || !mode}
				>
					{__('Live', 'surecart')}
				</CeMenuItem>
			</CeMenu>
		</CeDropdown>
	);
};
