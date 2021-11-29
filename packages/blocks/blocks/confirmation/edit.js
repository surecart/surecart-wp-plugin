/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { ALLOWED_BLOCKS } from '../../blocks';
import { CeOrderConfirmation } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps( {
		style: {
			fontSize: '16px',
		},
	} );
	return (
		<CeOrderConfirmation { ...blockProps }>
			<ce-text
				tag="h2"
				style={ {
					'--font-size': 'var(--ce-font-size-xx-large)',
					'--font-weight': 'var(--ce-font-weight-bold)',
					'--color': 'var(--ce-form-title-font-color)',
				} }
			>
				Order Details
			</ce-text>
			<ce-text
				style={ {
					'--font-size': 'var(--ce-font-size-medium)',
					'--font-weight': 'var(--ce-font-weight-normal)',
					'--color': 'var(--ce-color-gray-600)',
				} }
			>
				Thank you for your order!
			</ce-text>
			<InnerBlocks
				css={ css`
					> .wp-block {
						margin-top: 30px !important;
						margin-bottom: 30px !important;
					}
				` }
				templateLock={ false }
			/>
		</CeOrderConfirmation>
	);
};
