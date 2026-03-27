/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default () => {
	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
		},
	});

	return (
		<div>
			<a {...blockProps}>
				<div class="sc-cart-icon">
					<ScIcon name={'shopping-bag'} />
				</div>

				<span class="sc-cart-count">2</span>
			</a>
		</div>
	);
};
