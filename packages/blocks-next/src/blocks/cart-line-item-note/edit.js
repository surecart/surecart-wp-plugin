/**
 * External dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<div class="line-item-note">
				<div class="line-item-note__text">
					{__('Your note here...', 'surecart')}
				</div>
			</div>
		</div>
	);
};
