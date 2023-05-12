/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import feather from 'feather-icons';
import { ScToggle } from '@surecart/components-react';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	DropdownMenu,
	Flex,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { heading, icon } = attributes;
	const blockProps = useBlockProps({});
	const innerBlocksProps = useInnerBlocksProps();
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							value={heading}
							onChange={(heading) => setAttributes({ heading })}
						/>
					</PanelRow>
					<PanelRow>
						<Flex>
							<BaseControl.VisualLabel>
								{__('Tab Icon', 'surecart')}
							</BaseControl.VisualLabel>
							<div
								css={css`
									svg {
										fill: none !important;
									}
								`}
							>
								<DropdownMenu
									popoverProps={{
										className: 'sc-tab-icon-dropdown',
									}}
									icon={
										<sc-icon
											name={icon || 'home'}
											style={{
												fontSize: '20px',
											}}
										></sc-icon>
									}
									label={__('Select an icon', 'surecart')}
									controls={Object.keys(
										feather.icons || {}
									).map((icon) => {
										return {
											icon: (
												<sc-icon
													name={icon}
													style={{
														fontSize: '20px',
														'margin-right': '10px',
													}}
												></sc-icon>
											),
											title: feather.icons[icon].name,
											onClick: () =>
												setAttributes({
													icon,
												}),
										};
									})}
								/>
							</div>
						</Flex>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScToggle
					summary={heading}
					borderless={true}
					style={{
						width: '100%',
					}}
					class="sc-collapsible-row"
				>
					<span slot="summary">
						{icon && (
							<sc-icon
								name={icon}
								style={{ fontSize: '18px' }}
							></sc-icon>
						)}
						<span>{heading}</span>
					</span>
					<span {...innerBlocksProps}></span>
				</ScToggle>
			</div>
		</>
	);
};
