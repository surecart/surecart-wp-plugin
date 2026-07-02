import { ScFormControl, ScOrderBump } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { getFormattedPrice } from '../../../admin/util';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

const currency = scBlockData?.currency || 'usd';

const bumpData = {
	name: __('Bump Name', 'surecart'),
	percent_off: 10,
	subtotal_display_amount: getFormattedPrice({ amount: 3000, currency }),
	total_amount: 2700,
	total_display_amount: getFormattedPrice({ amount: 2700, currency }),
	metadata: {
		description: __(
			'Order bump description will appear here...',
			'surecart'
		),
	},
	rendered_description: __(
		'Order bump description will appear here...',
		'surecart'
	),
	price: {
		currency,
		amount: 3000,
		product: {
			name: __('Bump Name', 'surecart'),
			// Same fallback image Product.php uses for line_item_image.
			line_item_image: {
				src: scBlockData?.plugin_url + '/images/image-placeholder.svg',
				alt: __('Bump Name', 'surecart'),
			},
		},
	},
};

export default ({ attributes, setAttributes }) => {
	const { label, show_control, hide_added_items } = attributes;

	const blockProps = useBlockProps();
	const bumpRef = useRef();

	useEffect(() => {
		if (bumpRef.current) {
			bumpRef.current.bump = bumpData;
		}
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Show control', 'surecart')}
							checked={show_control}
							onChange={(show_control) =>
								setAttributes({ show_control })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Hide added items', 'surecart')}
							help={__(
								'When enabled, items already added to cart will be hidden from the recommendations.',
								'surecart'
							)}
							checked={hide_added_items}
							onChange={(hide_added_items) =>
								setAttributes({ hide_added_items })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScFormControl label={label || __('Recommended', 'surecart')}>
					<Disabled>
						<div className="bumps__list">
							<ScOrderBump
								ref={bumpRef}
								showControl={show_control}
							/>
						</div>
					</Disabled>
				</ScFormControl>
			</div>
		</>
	);
};
