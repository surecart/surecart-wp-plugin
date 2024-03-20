import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export default ({
	attributes: { sizing },
	context: { 'surecart/productId': productId },
	setAttributes
}) => {
	const classes = classnames({
		'product-img': true,
		is_contained: sizing === 'contain',
		is_covered: sizing === 'cover',
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const product = useSelect(
		(select) => {
			if (!productId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				productId
			);
		},
		[productId]
	);

	const alt = product?.featured_media?.alt || '';
	const title = product?.featured_media?.title || '';

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleGroupControl
						label={__('Image Cropping', 'surecart')}
						value={sizing}
						onChange={(value) => setAttributes({ sizing: value })}
					>
						<ToggleGroupControlOption
							value="contain"
							label={__('Contain', 'surecart')}
						/>
						<ToggleGroupControlOption
							value="cover"
							label={__('Cover', 'surecart')}
						/>
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<img
					src={product?.featured_media?.src}
					alt={alt}
					{...(title ? { title } : {})}
				/>
			</div>
		</>
	);
};
