/** @jsx jsx */
import { ScTab } from '@surecart/components-react';
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
			panel: panelSlug(title),
		});
	}, [title]);

	const panelSlug = (title) => {
		let slug = (title || '')
				.toLowerCase()
				.replace(/ /g, '-')
				.replace(/[^\w-]+/g, '');
		
		if ( ! slug ) {
			slug = (title || '')
			.toLowerCase()
			.trim()
			.replace(/ +/g, '_')
			.replace(/_+/g, '-');
		}
		
		return slug;
	}

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
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'surecart')}
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

			<ScTab {...blockProps}>
				<sc-icon
					style={{ fontSize: '18px' }}
					slot="prefix"
					name={icon || 'home'}
				></sc-icon>

				<RichText
					aria-label={__('Tab Name')}
					placeholder={__('Add a tab name')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScTab>
		</Fragment>
	);
};
