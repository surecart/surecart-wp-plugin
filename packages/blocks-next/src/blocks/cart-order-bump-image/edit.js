/**
 * External dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Placeholder,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-image-wrap',
	});

	const style = {
		width: attributes.width,
		aspectRatio: attributes.aspectRatio,
		objectFit: 'cover',
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Width', 'surecart')}
						value={attributes.width}
						onChange={(width) => setAttributes({ width })}
					/>
					<SelectControl
						label={__('Aspect Ratio', 'surecart')}
						value={attributes.aspectRatio}
						options={[
							{ label: '1:1', value: '1' },
							{ label: '4:3', value: '4/3' },
							{ label: '16:9', value: '16/9' },
						]}
						onChange={(aspectRatio) =>
							setAttributes({ aspectRatio })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<figure {...blockProps}>
				<Placeholder withIllustration={true} style={style} />
			</figure>
		</>
	);
};
