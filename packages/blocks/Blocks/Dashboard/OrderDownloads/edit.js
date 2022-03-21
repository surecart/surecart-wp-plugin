import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { CeDashboardModule } from '@checkout-engine/components-react';
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

			<CeDashboardModule {...blockProps}>
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<ce-button type="link" slot="end">
					{__('View all', 'surecart')}
					<ce-icon name="chevron-right" slot="suffix"></ce-icon>
				</ce-button>

				<ce-card no-padding style={{ '--overflow': 'hidden' }}>
					<ce-stacked-list>
						<ce-stacked-list-row mobile-size={0}>
							<ce-spacing
								style={{
									'--spacing': 'var(--ce-spacing-small)',
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
									<ce-format-bytes
										value={1235}
									></ce-format-bytes>
								</div>
							</ce-spacing>
							<ce-icon
								name="chevron-right"
								slot="suffix"
							></ce-icon>
						</ce-stacked-list-row>
						<ce-stacked-list-row mobile-size={0}>
							<ce-spacing
								style={{
									'--spacing': 'var(--ce-spacing-x-small)',
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
									<ce-format-bytes
										value={2345}
									></ce-format-bytes>
								</div>
							</ce-spacing>
							<ce-icon
								name="chevron-right"
								slot="suffix"
							></ce-icon>
						</ce-stacked-list-row>
					</ce-stacked-list>
				</ce-card>
			</CeDashboardModule>
		</Fragment>
	);
};
