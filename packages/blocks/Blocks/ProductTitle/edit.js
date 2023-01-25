/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { text } = attributes;
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<div {...blockProps}>
				<h4
					css={css`
						margin-top: 0.8rem;
						font-size: 1.2rem;
						margin: 0;
					`}
				>
					{text}
				</h4>
			</div>
		</Fragment>
	);
};
