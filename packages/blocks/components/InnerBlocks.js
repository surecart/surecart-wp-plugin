/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import {
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import withIsPremium from '../higher-order/withIsPremium';

const ALLOWED_BLOCKS = [
	'core/spacer',
	'core/columns',
	'surecart/input',
	'surecart/password',
	'surecart/price-selector',
	'surecart/checkbox',
	'surecart/divider',
	'surecart/button',
	'surecart/email',
	'surecart/header',
	'surecart/switch',
	'surecart/name',
	'surecart/payment',
	'surecart/express-payment',
	'surecart/pricing-section',
	'surecart/totals',
	'surecart/form',
	'surecart/section-title',
	'surecart/submit',
];

export default withIsPremium((props, clientId) => {
	const { isPremium } = props;
	const hasChildBlocks = useSelect(
		(select) => {
			const { getBlockOrder } = select(blockEditorStore);
			return getBlockOrder(clientId).length > 0;
		},
		[clientId]
	);
	return (
		<div
			css={css`
				.block-editor-button-block-appender {
					box-shadow: none;
					border: 1px dashed #dcdcdc;
					margin-top: 30px;
					box-sizing: border-box;
				}
			`}
		>
			<InnerBlocks
				renderAppender={
					hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender
				}
				templateLock={isPremium ? 'insert' : 'all'}
				allowedBlocks={ALLOWED_BLOCKS}
				{...props}
			/>
		</div>
	);
});
