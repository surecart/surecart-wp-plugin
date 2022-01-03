import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps( {
		style: {
			maxWidth: 'var( --ast-content-width-size, 910px )',
			marginLeft: 'auto !important',
			marginRight: 'auto !important',
		},
	} );

	return (
		<div { ...blockProps }>
			<ce-order-confirmation-totals></ce-order-confirmation-totals>
		</div>
	);
};
