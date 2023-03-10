/**
 * WordPress dependencies
 */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { src, sizing } = attributes;

	return (
		<sc-product-item-image
			src={src}
			sizing={sizing}
		></sc-product-item-image>
	);
};
