/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { ScOrderSummary } from '@surecart/components-react';

const ALLOWED_BLOCKS = [
	'surecart/divider',
	'surecart/line-items',
	'surecart/tax-line-item',
	'surecart/total',
	'surecart/subtotal',
];

export default ({ attributes, setAttributes }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const {
		collapsible,
		collapsedOnDesktop,
		closed_text,
		open_text,
		collapsedOnMobile,
	} = attributes;

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			template: [
				['surecart/divider', {}],
				['surecart/line-items', {}],
				['surecart/divider', {}],
				[
					'surecart/subtotal',
					{
						text: __('Subtotal', 'surecart'),
					},
				],
				['surecart/tax-line-item', {}],
				['surecart/divider', {}],
				[
					'surecart/total',
					{
						text: __('Total', 'surecart'),
						subscription_text: __('Total Due Today', 'surecart'),
					},
				],
			],
			allowedBlocks: ALLOWED_BLOCKS,
			templateLock: false,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Collapsible', 'surecart')}
							checked={collapsible}
							onChange={(collapsible) => {
								setAttributes({ collapsible });
								if (!collapsible) {
									setAttributes({
										collapsed: false,
										collapsedOnMobile: false,
									});
								}
							}}
						/>
					</PanelRow>
					{collapsible ? (
						<Fragment>
							<PanelRow>
								<ToggleControl
									label={__(
										'Collapsed On Desktop',
										'surecart'
									)}
									checked={collapsedOnDesktop}
									onChange={(collapsedOnDesktop) => {
										setAttributes({ collapsedOnDesktop });
										if (collapsedOnDesktop) {
											setAttributes({
												collapsible: true,
											});
										}
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__(
										'Collapsed On Mobile',
										'surecart'
									)}
									checked={collapsedOnMobile}
									onChange={(collapsedOnMobile) => {
										setAttributes({ collapsedOnMobile });
										if (collapsedOnMobile) {
											setAttributes({
												collapsible: true,
											});
										}
									}}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__('Closed Text', 'surecart')}
									value={closed_text}
									onChange={(closed_text) =>
										setAttributes({ closed_text })
									}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__('Open Text', 'surecart')}
									value={open_text}
									onChange={(open_text) =>
										setAttributes({ open_text })
									}
								/>
							</PanelRow>
						</Fragment>
					) : null}
				</PanelBody>
			</InspectorControls>

			<ScOrderSummary
				collapsible={collapsible}
				collapsedOnDesktop={collapsedOnDesktop}
				closedText={closed_text || null}
				openText={open_text || null}
				collapsedOnMobile={collapsedOnMobile}
				{...innerBlocksProps}
			></ScOrderSummary>
		</Fragment>
	);
};
