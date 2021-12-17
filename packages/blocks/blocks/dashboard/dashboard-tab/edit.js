/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
import {
	TextControl,
	PanelBody,
	PanelRow,
	SelectControl,
	DropdownMenu,
	Flex,
	BaseControl,
} from '@wordpress/components';
import feather from 'feather-icons';

export default ( { attributes, setAttributes } ) => {
	const { panel, title, active, icon } = attributes;
	const tab = useRef();
	const blockProps = useBlockProps();

	useEffect( () => {
		setAttributes( {
			panel: ( title || '' )
				.toLowerCase()
				.replace( / /g, '-' )
				.replace( /[^\w-]+/g, '' ),
		} );
	}, [ title ] );

	useEffect( () => {
		if ( active ) {
			setTimeout( () => {
				tab.current.click();
				setAttributes( { active: false } );
			}, 50 );
		}
	}, [ active ] );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Title', 'checkout-engine' ) }
							value={ title }
							onChange={ ( title ) => setAttributes( { title } ) }
						/>
					</PanelRow>
					<PanelRow>
						<Flex>
							<BaseControl.VisualLabel>
								{ __( 'Tab Icon', 'checkout_engine' ) }
							</BaseControl.VisualLabel>
							<div
								css={ css`
									svg {
										fill: none !important;
									}
								` }
							>
								<DropdownMenu
									popoverProps={ {
										className: 'ce-tab-icon-dropdown',
									} }
									icon={
										<ce-icon
											name={ icon }
											style={ {
												'font-size': '20px',
											} }
										></ce-icon>
									}
									label={ __(
										'Select an icon',
										'checkout_engine'
									) }
									controls={ Object.keys(
										feather.icons || {}
									).map( ( icon ) => {
										return {
											icon: (
												<ce-icon
													name={ icon }
													style={ {
														'font-size': '20px',
														'margin-right': '10px',
													} }
												></ce-icon>
											),
											title: feather.icons[ icon ].name,
											onClick: () =>
												setAttributes( {
													icon,
												} ),
										};
									} ) }
								/>
							</div>
						</Flex>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ce-tab panel={ panel } ref={ tab }>
				<div
					slot="prefix"
					dangerouslySetInnerHTML={ {
						__html: feather.icons[ icon || 'home' ].toSvg( {
							width: 18,
							height: 18,
							fill: 'none',
							style: 'fill: none',
						} ),
					} }
				/>

				<RichText
					aria-label={ __( 'Tab Name' ) }
					placeholder={ __( 'Add a tab name' ) }
					value={ title }
					onChange={ ( title ) => setAttributes( { title } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</ce-tab>
		</div>
	);
};
