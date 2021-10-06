import { useSelect } from '@wordpress/data';
import {
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { CeCheckout } from '@checkout-engine/react';
import { css, jsx } from '@emotion/core';
import { ALLOWED_BLOCKS } from '../../blocks';

export default function edit( { clientId, attributes } ) {
	const { align, className, choices, font_size } = attributes;
	const blockCount = useSelect( ( select ) =>
		select( blockEditorStore ).getBlockCount( clientId )
	);
	return (
		<CeCheckout
			keys={ ceData?.keys }
			css={ css`
				margin-top: 2em;
				font-size: ${ font_size }px;
			` }
			alignment={ align }
			className={ className }
			choices={ choices }
		>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				renderAppender={
					blockCount ? undefined : InnerBlocks.ButtonBlockAppender
				}
			/>
		</CeCheckout>
	);
}
