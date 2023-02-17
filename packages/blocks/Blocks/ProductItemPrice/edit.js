/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { ScProductItemPrice } from '@surecart/components-react';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<ScProductItemPrice />
		</div>
	);
};
