/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelRow, PanelBody, ToggleControl } from '@wordpress/components';
import { ALLOWED_BLOCKS } from '../../blocks';
import { CeOrderConfirmation } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps( {
		style: {
			maxWidth: 'var( --ast-content-width-size, 910px )',
			marginLeft: 'auto !important',
			marginRight: 'auto !important',
		},
	} );

	return (
		<div { ...blockProps }>
			<ce-session-subscription></ce-session-subscription>
		</div>
	);
};
