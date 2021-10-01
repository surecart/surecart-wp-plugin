/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import {
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import withIsPremium from '../higher-order/withIsPremium';

export default withIsPremium( ( props, clientId ) => {
	const { isPremium } = props;
	const hasChildBlocks = useSelect(
		( select ) => {
			const { getBlockOrder } = select( blockEditorStore );
			return getBlockOrder( clientId ).length > 0;
		},
		[ clientId ]
	);
	return (
		<div
			css={ css`
				.block-editor-button-block-appender {
					box-shadow: none;
					border: 1px dashed #dcdcdc;
					margin-top: 30px;
					box-sizing: border-box;
				}
			` }
		>
			<InnerBlocks
				renderAppender={
					hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender
				}
				templateLock={ isPremium ? 'insert' : 'all' }
				allowedBlocks={ [
					'checkout-engine/input',
					'checkout-engine/email',
					'checkout-engine/button',
				] }
				{ ...props }
			/>
		</div>
	);
} );
