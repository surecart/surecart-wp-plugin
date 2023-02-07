/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { useProductDataContext } from '../../context/product-data-context';

export default () => {
	const blockProps = useBlockProps();
	const { product, isLoading } = useProductDataContext();

	if (isLoading) return null;

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
					{product?.name}
				</h4>
			</div>
		</Fragment>
	);
};
