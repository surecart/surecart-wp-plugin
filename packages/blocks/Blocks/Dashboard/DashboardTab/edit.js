/** @jsx jsx */
import { CeTab } from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	DropdownMenu,
	Flex,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import { useEffect, useRef, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import feather from 'feather-icons';

export default ({ attributes, setAttributes }) => {
	const { panel, title, active, icon } = attributes;
	const tab = useRef();
	const blockProps = useBlockProps({
		panel,
		tab,
	});

	useEffect(() => {
		setAttributes({
			panel: (title || '')
				.toLowerCase()
				.replace(/ /g, '-')
				.replace(/[^\w-]+/g, ''),
		});
	}, [title]);

	useEffect(() => {
		if (active) {
			setTimeout(() => {
				tab.current.click();
				setAttributes({ active: false });
			}, 50);
		}
	}, [active]);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout-engine')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'checkout-engine')}
							value={title}
							onChange={(title) => setAttributes({ title })}
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
										className: 'ce-tab-icon-dropdown',
									}}
									icon={
										<ce-icon
											name={icon || 'home'}
											style={{
												fontSize: '20px',
											}}
										></ce-icon>
									}
									label={__('Select an icon', 'surecart')}
									controls={Object.keys(
										feather.icons || {}
									).map((icon) => {
										return {
											icon: (
												<ce-icon
													name={icon}
													style={{
														fontSize: '20px',
														'margin-right': '10px',
													}}
												></ce-icon>
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

			<CeTab {...blockProps}>
				<ce-icon
					style={{ fontSize: '18px' }}
					slot="prefix"
					name={icon || 'home'}
				></ce-icon>

				<RichText
					aria-label={__('Tab Name')}
					placeholder={__('Add a tab name')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</CeTab>
		</Fragment>
	);
};
