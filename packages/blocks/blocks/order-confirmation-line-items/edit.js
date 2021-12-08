/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<ce-order-confirmation-line-items></ce-order-confirmation-line-items>
		</div>
	);
};
