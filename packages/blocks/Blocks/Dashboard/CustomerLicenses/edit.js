/** @jsx jsx  */
import { css, jsx } from '@emotion/core';
import { __, _n } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { ScDashboardModule, ScTag } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import OverlayLabel from '../../../components/OverlayLabel';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps();

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
				</PanelBody>
			</InspectorControls>

			<ScDashboardModule {...blockProps}>
				<OverlayLabel>{__('Sample Data', 'surecart')}</OverlayLabel>
				<RichText
					aria-label={__('Title', 'surecart')}
					placeholder={__('Add A Title…', 'surecart')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<sc-button type="link" slot="end">
					{__('View all', 'surecart')}
					<sc-icon name="chevron-right" slot="suffix"></sc-icon>
				</sc-button>

				<sc-card no-padding style={{ '--overflow': 'hidden' }}>
					<sc-stacked-list>
						<sc-stacked-list-row mobile-size={0}>
							<sc-spacing
								style={{
									'--spacing': 'var(--sc-spacing-small)',
								}}
							>
								<div>
									<strong>
										{__(
											'Camping & Hiking Icons',
											'surecart'
										)}
									</strong>
								</div>
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 0.25em;
										color: var(--sc-input-label-color);
									`}
								>
									<div>
										<ScTag type="success">
											{__('Active', 'surecart')}
										</ScTag>
									</div>
									<div>
										{__(
											'1 of 2 Activations Used',
											'surecart'
										)}
									</div>
								</div>
							</sc-spacing>
							<sc-icon
								name="chevron-right"
								slot="suffix"
							></sc-icon>
						</sc-stacked-list-row>
						<sc-stacked-list-row mobile-size={0}>
							<sc-spacing
								style={{
									'--spacing': 'var(--sc-spacing-x-small)',
								}}
							>
								<div>
									<strong>
										{__(
											'Application UI Icon Pack',
											'surecart'
										)}
									</strong>
								</div>
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 0.25em;
										color: var(--sc-input-label-color);
									`}
								>
									<div>
										<ScTag type="info">
											{__('Not Activated', 'surecart')}
										</ScTag>
									</div>
									<div>
										{__(
											'0 of 2 Activations Used',
											'surecart'
										)}
									</div>
								</div>
							</sc-spacing>
							<sc-icon
								name="chevron-right"
								slot="suffix"
							></sc-icon>
						</sc-stacked-list-row>
					</sc-stacked-list>
				</sc-card>
			</ScDashboardModule>
		</Fragment>
	);
};
