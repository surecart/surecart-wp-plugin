import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { ScDashboardModule } from '@surecart/components-react';
import { Fragment } from 'react';

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
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
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
								<div>
									4 files &bull;{' '}
									<sc-format-bytes
										value={1235}
									></sc-format-bytes>
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
								<div>
									4 files &bull;{' '}
									<sc-format-bytes
										value={2345}
									></sc-format-bytes>
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
