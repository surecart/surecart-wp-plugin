/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import StyleProvider from '../../../components/StyleProvider';

export default () => {
	const blockProps = useBlockProps();

	return (
		<StyleProvider>
			<img
				{...blockProps}
				src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081"
				style={{
					maxWidth: '100%',
					height: 'auto',
					background: '#fff',
					border: '1px solid var(--sc-input-border-color)',
					width: '100%',
					objectFit: 'scale-down',
					margin: 0,
				}}
			/>
			{/* <ScProductImage {...blockProps} /> */}
		</StyleProvider>
	);
};
