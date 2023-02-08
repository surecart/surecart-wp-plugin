/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
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
					<strong>$545</strong>
					<span>$656</span>
				</div>
			</div>
		</Fragment>
	);
};
