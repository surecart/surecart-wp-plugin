import OverlayLabel from '../../../components/OverlayLabel';
import { ScDashboardModule } from '@surecart/components-react';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;

	const blockProps = useBlockProps();

	var oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

	const nextPaymentDate = oneYearFromNow.toLocaleDateString();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Title', 'surecart')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScDashboardModule>
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
												'Monthly Subscription',
												'surecart'
											)}
										</strong>
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '0.25em',
											color: 'var(--sc-input-label-color)',
										}}
									>
										<sc-tag type="success">
											{__('Active', 'surecart')}
										</sc-tag>
										{__(
											'Your next payment is on',
											'surecart'
										)}{' '}
										{nextPaymentDate}
									</div>
									<sc-tag type="warning">
										{'⚠ '}
										{__(
											'Payment Method Missing',
											'surecart'
										)}
									</sc-tag>
								</sc-spacing>
								<sc-icon
									name="chevron-right"
									slot="suffix"
								></sc-icon>
							</sc-stacked-list-row>
							<sc-stacked-list-row mobile-size={0}>
								<sc-spacing
									style={{
										'--spacing': 'var(--sc-spacing-small)',
									}}
								>
									<div>
										<strong>
											{__(
												'Yearly Subscription',
												'surecart'
											)}
										</strong>
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '0.25em',
											color: 'var(--sc-input-label-color)',
										}}
									>
										<sc-tag type="info">
											{__('Trialing', 'surecart')}
										</sc-tag>
										{__('Your plan begins on', 'surecart')}{' '}
										{nextPaymentDate}
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
			</div>
		</Fragment>
	);
};
