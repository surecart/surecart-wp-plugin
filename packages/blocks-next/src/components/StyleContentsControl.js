import { BlockControls } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { pencil } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export default ({ mode, setMode }) => {
	return (
		<BlockControls group="other">
			<ToolbarButton
				icon={pencil}
				label={__('Style & Contents', 'surecart')}
				isActive={mode !== 'contentOnly'}
				onClick={() =>
					setMode(mode === 'contentOnly' ? false : 'contentOnly')
				}
			/>
		</BlockControls>
	);
};
