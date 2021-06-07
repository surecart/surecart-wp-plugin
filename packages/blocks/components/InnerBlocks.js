/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { InnerBlocks } from '@wordpress/block-editor';
import withIsPremium from '../higher-order/withIsPremium';

export default withIsPremium( ( props ) => {
	const { isPremium } = props;
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
				renderAppender={ InnerBlocks.ButtonBlockAppender }
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
