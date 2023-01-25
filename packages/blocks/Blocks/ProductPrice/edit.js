/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { amount, scratchAmount } = attributes;
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<div {...blockProps}>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1rem;
						font-size: 0.88rem;
						margin-top: 0.8rem;
					`}
				>
					<strong>{amount}</strong>
					<span>{scratchAmount}</span>
				</div>
			</div>
		</Fragment>
	);
};
