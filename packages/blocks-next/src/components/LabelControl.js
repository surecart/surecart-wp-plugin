import { BlockControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { unseen, seen } from '@wordpress/icons';
import { ToolbarButton } from '@wordpress/components';

export default function LabelControl({ label, setLabel }) {
	return (
		<BlockControls group="block">
			<ToolbarButton
				icon={label ? unseen : seen}
				label={
					label
						? __('Show Label', 'surecart')
						: __('Hide Label', 'surecart')
				}
				onClick={() => setLabel(!label)}
			/>
		</BlockControls>
	);
}
